import prisma from "../db/db";
import { io } from "../index";

interface DrawData {
  x: number;
  y: number;
  type: "start" | "draw";
}

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // When user joins a room
  socket.on("join-room", async ({ roomId, userId }: { roomId: string; userId: string }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Save user-room relation (for history)
    try {
      await prisma.roomMember.upsert({
        where: {
          userId_roomId: { userId, roomId }, // unique composite key
        },
        update: {},
        create: { userId, roomId },
      });
    } catch (err) {
      console.error("Error saving user-room history:", err);
    }

    //  Load previous whiteboard data if exists
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (room?.whiteboardData) {
      socket.emit("load_canvas", room.whiteboardData);
    }
  });

  // When user draws something on the canvas
  socket.on("draw", ({ roomId, data }: { roomId: string; data: DrawData }) => {
    socket.to(roomId).emit("draw", data);
  });

  // When canvas saved manually or periodically
  socket.on("save_canvas", async ({ roomId, canvasData }) => {
    try {
      await prisma.room.update({
        where: { id: roomId },
        data: { whiteboardData: canvasData },
      });
    } catch (err) {
      console.error("Error saving canvas:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
