import type { Request, Response } from "express";
import prisma from "../db/db";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Room name required" });

    const room = await prisma.room.create({ data: { name } });
    res.status(201).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const joinRoom = async (req: Request, res: Response) => {
  try {
    // req.user should be set by authMiddleware
    const user = (req as any).user;
    const { roomId } = req.body;
    if (!user || !user.id) return res.status(401).json({ error: "Unauthorized" });
    if (!roomId) return res.status(400).json({ error: "roomId required" });

    // upsert using unique composite (we have @@unique([userId, roomId]) in schema)
    await prisma.roomMember.upsert({
      where: { userId_roomId: { userId: user.id, roomId } },
      update: {},
      create: { userId: user.id, roomId },
    });

    res.json({ message: "Joined room" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
