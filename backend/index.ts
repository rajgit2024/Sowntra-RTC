import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });
import authRoutes from "./routes/auth.routes";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/user.routes";
import roomRoutes from "./routes/room.routes";
import prisma from "./db/db";


const app = express();
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('Server is running...');
});

const server = http.createServer(app);

// SockeT.io setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
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

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`Server started on port ${PORT}`);
    console.log('Connected to PostgreSQL database successfully!');
  } catch (err) {
    console.error('Failed to connect to database:', err);
  }
});

export { io };
