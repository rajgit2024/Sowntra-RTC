import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import roomRoutes from './routes/room.routes.ts';

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/rooms", roomRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


io.on('connection',(socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("draw", ({ roomId, data }) => {
        socket.to(roomId).emit("draw", data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

})

server.listen(5000, () => console.log("Server running on port 5000"));
export { io };