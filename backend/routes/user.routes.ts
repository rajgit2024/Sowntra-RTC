import express from "express";
import { createUser, getUserRooms, getMyRooms } from "../controller/userController";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.post("/", createUser);
router.get("/:userId/rooms", getUserRooms); // optional public
router.get("/me/rooms", authMiddleware, getMyRooms); // protected

export default router;
