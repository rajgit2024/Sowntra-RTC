import express from "express";
import { createRoom, getRoom , joinRoom } from "../controller/roomController";
const router = express.Router();
import { authMiddleware } from "../middlewares/auth";

router.post("/", authMiddleware, createRoom);      // create room (auth required)
router.post("/join", authMiddleware, joinRoom);  
router.get("/:id", getRoom);

export default router;
