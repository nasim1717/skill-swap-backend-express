// src/sockets/chat.socket.js

import prisma from "../config/db.js";

// Keep track of online users globally
// Map structure: userId (as string) -> socketId
export const onlineUsers = new Map();

function initSocket(io) {
    io.on('connection', (socket) => {
        console.log('🟢 New socket connected:', socket.id);

        // When client authenticates
        socket.on('authenticate', async ({ userId }) => {
            if (!userId) return socket.disconnect();

            //  Store as string for consistent comparison
            socket.userId = userId;
            socket.join(`user_${socket.userId}`);

            //  Mark user as online (store as string key)
            onlineUsers.set(socket.userId, socket.id);
            console.log(`✅ User ${socket.userId} connected. Online users:`, Array.from(onlineUsers.keys()));

            //  Broadcast to all connected clients
            io.emit('user_status_change', {
                userId: socket.userId,
                online: true
            });
        });

        // Join a chat thread
        socket.on('join_thread', async ({ threadId }) => {
            if (!socket.userId) return socket.emit('error', 'not authenticated');
            socket.join(`thread_${threadId}`);
            console.log(`User ${socket.userId} joined thread ${threadId}`);
        });

        //  Send message
        socket.on('send_message', async ({ threadId, message }) => {
            if (!socket.userId) return socket.emit('error', 'not authenticated');
            if (!message || !threadId) return socket.emit('error', 'invalid payload');

            const thread = await prisma.chat_threads.findUnique({
                where: { id: threadId }
            });

            if (!thread) return socket.emit('error', 'thread not found');

            // Convert to numbers for comparison
            const userIdNum = socket.userId;
            if (![thread.participant_a, thread.participant_b].includes(userIdNum)) {
                return socket.emit('error', 'not participant');
            }

            const receiverId = thread.participant_a === userIdNum
                ? thread.participant_b
                : thread.participant_a;

            const created = await prisma.messages.create({
                data: {
                    sender_id: userIdNum,
                    receiver_id: receiverId,
                    message,
                    thread_id: threadId,
                }
            });

            // Emit to thread participants (both sender and receiver will get this)
            io.to(`thread_${threadId}`).emit('message', {
                ...created,
                id: created.id,
                sender_id: created.sender_id,
                receiver_id: created.receiver_id,
                thread_id: created.thread_id,
            });

            //  Notify receiver's personal room (for notification/badge update)
            io.to(`user_${receiverId}`).emit('incoming_message', {
                threadId: threadId,
                message: {
                    ...created,
                    id: created.id,
                    sender_id: created.sender_id,
                    receiver_id: created.receiver_id,
                }
            });

            console.log(`Message sent from ${socket.userId} to ${receiverId} in thread ${threadId}`);
        });

        // ✅ Mark message as seen
        socket.on('mark_seen', async ({ messageId }) => {
            if (!socket.userId) return;

            const msg = await prisma.messages.findUnique({
                where: { id: messageId }
            });

            if (!msg) return;
            if (msg.receiver_id !== userIdNum) return;
            if (msg.seen) return; // Already seen, skip

            await prisma.messages.update({
                where: { id: messageId },
                data: { seen: true },
            });

            // Notify sender that message was seen
            io.to(`user_${msg.sender_id}`).emit('message_seen', {
                messageId: messageId,
                threadId: msg.thread_id
            });

            console.log(`Message ${messageId} marked as seen by user ${socket.userId}`);
        });

        // Mark multiple messages as seen (batch operation)
        socket.on('mark_messages_seen', async ({ threadId }) => {
            if (!socket.userId) return;
            if (!threadId) return;

            const userIdNum = socket.userId;

            // Find all unseen messages for this user in this thread
            const unseenMessages = await prisma.messages.findMany({
                where: {
                    thread_id: threadId,
                    receiver_id: userIdNum,
                    seen: false,
                }
            });

            if (unseenMessages.length === 0) return;

            // Mark all as seen
            await prisma.messages.updateMany({
                where: {
                    thread_id: threadId,
                    receiver_id: userIdNum,
                    seen: false,
                },
                data: {
                    seen: true,
                }
            });

            // Get the sender (other participant)
            const thread = await prisma.chat_threads.findUnique({
                where: { id: threadId }
            });

            if (thread) {
                const senderId = thread.participant_a === userIdNum
                    ? thread.participant_b
                    : thread.participant_a;

                // Notify sender that all messages were seen
                io.to(`user_${senderId}`).emit('messages_seen', {
                    threadId: threadId,
                    count: unseenMessages.length
                });
            }

            console.log(`${unseenMessages.length} messages marked as seen in thread ${threadId} by user ${socket.userId}`);
        });

        // Typing indicator
        socket.on('typing', ({ threadId, isTyping }) => {
            if (!socket.userId) return;

            // Broadcast to other participants in the thread
            socket.to(`thread_${threadId}`).emit('typing', {
                threadId,
                userId: socket.userId,
                isTyping
            });
        });

        // Disconnect handler
        socket.on('disconnect', () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                console.log(`🔴 User ${socket.userId} disconnected. Online users:`, Array.from(onlineUsers.keys()));

                // Broadcast to all connected clients
                io.emit('user_status_change', {
                    userId: socket.userId,
                    online: false
                });
            }
        });
    });
}

export default initSocket;