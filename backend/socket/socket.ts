import prisma from '../db/db.ts';
import { io } from '../index.ts';

interface DrawData {
    x: number;
    y: number;
    type: "start" | "draw";
}

io.on("connection",(socket) => {
    console.log("User Connected",socket.id);
    
    socket.on("join-room",async (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if(room?.whiteboardData){
            socket.emit("load_canvas", room.whiteboardData);
        }
    })

    socket.on("draw", ({ roomId, data }: { roomId: string; data: DrawData }) => {
        socket.to(roomId).emit("draw", data);
    });

     socket.on("save_canvas", async ({ roomId, canvasData }) => {
        await prisma.room.update({
        where: { id: roomId },
        data: { whiteboardData: canvasData },
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
})