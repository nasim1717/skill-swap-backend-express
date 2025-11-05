import { Server } from "socket.io";
import http from "http";
import app from "./src/app.js";
import initChatSocket from "./src/sockets/chat.js"
const PORT = process.env.PORT || 5051;


BigInt.prototype.toJSON = function () {
    return this.toString();
};

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
    },
});

initChatSocket(io);


server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
