import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../db/db"; 
import { AuthRequest } from "../middlewares/auth";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Return response (omit password)
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getUserRooms = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const rooms = await prisma.roomMember.findMany({
      where: { userId },
      include: { room: true },
    });

    res.json(rooms.map((r) => r.room));
  } catch (error) {
    console.error("Error fetching user rooms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyRooms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const rooms = await prisma.roomMember.findMany({
      where: { userId },
      include: { room: true },
      orderBy: { joinedAt: "desc" },
    });

    const roomList = rooms.map((r) => r.room);
    res.json(roomList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

