import express from "express";
import { createRoom, getRoom } from "../controller/roomController.ts";
const router = express.Router();

router.post("/", createRoom);
router.get("/:id", getRoom);

export default router;
