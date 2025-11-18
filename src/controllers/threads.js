import prisma from "../config/db.js";

async function listThreads(req, res) {
    const userId = req.user.id;
    const threads = await prisma.chat_threads.findMany({
        where: {
            OR: [
                { participant_a: userId },
                { participant_b: userId },
            ]
        },
        include: {
            participantA: { select: { id: true, name: true, profile_picture: true } },
            participantB: { select: { id: true, name: true, profile_picture: true } },
            messages: {
                orderBy: { created_at: 'desc' },
                take: 1, // last message preview
            }
        },
        orderBy: { created_at: 'desc' },
    });
    res.json({ data: threads });
}

async function getMessages(req, res) {
    const userId = req.user.id;
    const threadId = req.params.id;

    const thread = await prisma.chat_threads.findUnique({
        where: { id: threadId },
    });
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    if (![thread.participant_a, thread.participant_b].includes(userId)) {
        return res.status(403).json({ error: 'Not a participant' });
    }

    const messages = await prisma.messages.findMany({
        where: { thread_id: threadId },
        orderBy: { created_at: 'asc' },
    });
    res.json({ data: messages });
}

// (Optional) send REST fallback message (but recommended to send via socket)
async function postMessage(req, res) {
    const userId = req.user.id;
    const threadId = Number(req.params.id);
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });

    const thread = await prisma.chat_threads.findUnique({ where: { id: threadId } });
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    if (![thread.participant_a, thread.participant_b].includes(userId)) {
        return res.status(403).json({ error: 'Not a participant' });
    }

    const other = thread.participant_a === userId ? thread.participant_b : thread.participant_a;
    const created = await prisma.messages.create({
        data: {
            sender_id: userId,
            receiver_id: other,
            message,
            thread_id: threadId,
        }
    });

    // optionally emit socket event from server side
    res.status(201).json({ data: created });
}

export { listThreads, getMessages, postMessage };
