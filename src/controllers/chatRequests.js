import prisma from "../config/db.js";
import { onlineUsers } from "../sockets/chat.js";

async function sendRequest(req, res) {
    const senderId = req.body.user_id;
    const { receiver_id, message } = req.body;
    if (!receiver_id) return res.status(400).json({ error: 'receiver_id required' });
    if (receiver_id === senderId) return res.status(400).json({ error: 'cannot send request to yourself' });

    // Prevent duplicate pending request
    const existing = await prisma.chat_requests.findFirst({
        where: {
            sender_id: senderId,
            receiver_id: receiver_id,
            status: 'PENDING',
        },
    });
    if (existing) return res.status(409).json({ error: 'Pending request already exists' });

    console.log("req.body-->", req.body)

    const created = await prisma.chat_requests.create({
        data: {
            sender_id: senderId,
            receiver_id,
            message,
        },
    });

    // you should emit a socket event to notify receiver (handled by socket server)
    return res.status(201).json({ data: created });
}

async function listRequests(req, res) {
    try {
        const userId = BigInt(req.user.user_id);
        const status = (req.query.status || 'ALL').toUpperCase();

        const where = {
            OR: [{ sender_id: userId }, { receiver_id: userId }],
        };

        // Optional filter by status
        if (status === 'PENDING') where.status = 'PENDING';
        if (status === 'ACTIVE') where.status = 'ACCEPTED';

        const requests = await prisma.chat_requests.findMany({
            where,
            orderBy: { created_at: 'desc' },
            include: {
                sender: { select: { id: true, name: true, profile_picture: true } },
                receiver: { select: { id: true, name: true, profile_picture: true } },
            },
        });

        const enriched = await Promise.all(
            requests.map(async (reqItem) => {
                // 👉 PENDING request শুধুমাত্র receiver দেখবে
                if (reqItem.status === 'PENDING' && reqItem.receiver_id !== userId) {
                    return null;
                }

                // Find chat thread (if exists)
                const thread = await prisma.chat_threads.findFirst({
                    where: {
                        OR: [
                            {
                                participant_a: reqItem.sender_id,
                                participant_b: reqItem.receiver_id,
                            },
                            {
                                participant_a: reqItem.receiver_id,
                                participant_b: reqItem.sender_id,
                            },
                        ],
                    },
                });

                // Get last message and unread count
                let lastMessage = null;
                let unread_count = 0;

                if (thread) {
                    // 👈 Last message fetch করা
                    lastMessage = await prisma.messages.findFirst({
                        where: { thread_id: thread.id },
                        orderBy: { created_at: 'desc' },
                        select: {
                            id: true,
                            message: true,
                            sender_id: true,
                            created_at: true,
                            seen: true,
                        },
                    });

                    // Count unread messages
                    unread_count = await prisma.messages.count({
                        where: {
                            thread_id: thread.id,
                            receiver_id: userId,
                            seen: false,
                        },
                    });
                }

                // Determine other user info
                const isSender = reqItem.sender_id === userId;
                const otherUser = isSender ? reqItem.receiver : reqItem.sender;
                const isOnline = onlineUsers.has(otherUser.id);

                return {
                    id: reqItem.id.toString(),
                    status: reqItem.status,
                    created_at: reqItem.created_at,
                    thread_id: thread?.id ? thread.id.toString() : null,
                    unread_count,
                    is_online: isOnline,
                    // 👈 Last message add করা
                    last_message: lastMessage ? {
                        id: lastMessage.id.toString(),
                        message: lastMessage.message,
                        sender_id: lastMessage.sender_id.toString(),
                        created_at: lastMessage.created_at,
                        seen: lastMessage.seen,
                        is_own: lastMessage.sender_id === userId, // আমার নিজের message কিনা
                    } : (reqItem.status === 'PENDING' ? {
                        // 👈 যদি thread না থাকে, তাহলে request এর first message দেখাও
                        message: reqItem.message,
                        created_at: reqItem.created_at,
                        is_own: reqItem.sender_id === userId,
                    } : null),
                    user: {
                        ...otherUser,
                        id: otherUser.id.toString(),
                    },
                };
            })
        );

        // Remove skipped (null) items
        const filtered = enriched.filter(Boolean);

        // "Active" means accepted + currently online
        let finalList = filtered;
        if (status === 'ACTIVE') {
            finalList = filtered.filter(
                (item) => item.status === 'ACCEPTED' && item.is_online
            );
        }

        res.json({ data: finalList });
    } catch (error) {
        console.error('Error listing requests:', error);
        res.status(500).json({ message: 'Failed to load chat requests' });
    }
}


async function acceptRequest(req, res) {

    const userId = BigInt(req.user.user_id);
    const requestId = BigInt(req.params.id);

    const request = await prisma.chat_requests.findUnique({ where: { id: requestId } });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.receiver_id !== userId) return res.status(403).json({ error: 'Not allowed' });
    if (request.status !== 'PENDING') return res.status(400).json({ error: 'Request not pending' });

    // canonicalize participants so unique([a,b]) works.
    const a = Math.min(Number(request.sender_id), Number(request.receiver_id));
    const b = Math.max(Number(request.sender_id), Number(request.receiver_id));

    // Create thread only if not exists (race-safe-ish).
    let thread = await prisma.chat_threads.findUnique({
        where: {
            participant_a_participant_b: { participant_a: a, participant_b: b }
        }
    });

    if (!thread) {
        thread = await prisma.chat_threads.create({
            data: {
                participant_a: a,
                participant_b: b,
            }
        });
    }

    // mark request accepted
    const updated = await prisma.chat_requests.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
    });

    // Optionally: connect the request to thread via custom column (not in schema) or just return thread
    res.json({ data: { request: updated, thread } });
}

async function declineRequest(req, res) {
    const userId = BigInt(req.user.user_id);
    const requestId = BigInt(req.params.id);
    const request = await prisma.chat_requests.findUnique({ where: { id: requestId } });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.receiver_id !== userId) return res.status(403).json({ error: 'Not allowed' });

    const updated = await prisma.chat_requests.update({
        where: { id: requestId },
        data: { status: 'DECLINED' },
    });
    res.json({ data: updated });
}

export {
    sendRequest,
    listRequests,
    acceptRequest,
    declineRequest,
};
