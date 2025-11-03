import type { Request, Response } from "express";
import prisma from "../db/db.ts";

export const createRoom = async (req: Request, res: Response) => {
  const { name } = req.body;
  const room = await prisma.room.create({ data: { name } });
  res.json(room);
};

export const getRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
};