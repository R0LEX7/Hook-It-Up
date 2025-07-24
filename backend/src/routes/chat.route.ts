import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/user.middleware";
import { createChat, getChats } from "../controllers/chat.controller";
import { validate } from "../middlewares/validate.middleware";
import { chatSchema } from "../schemas/chat.schema";
const router: Router = express.Router();

/*
  POST : create chat
*/

router.post("/create-chat", isAuthenticated, validate(chatSchema), createChat);
router.get("/all-chats", isAuthenticated, getChats);

export default router;
