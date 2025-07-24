import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/user.middleware";
import { deleteMessage, editMessage, getMessages, sendMessage } from "../controllers/message.controller";
import { validate } from "../middlewares/validate.middleware";
import { deleteMessageSchema, editMessageSchema, getMessagesSchema, sendMessageSchema } from "../schemas/message.schema";

const router: Router = express.Router();

/*
1  Get : all messages
2. POST :  send message
3. PATCH : edit message
4. DELETE : message
 */

router.get("/all" , isAuthenticated ,validate(getMessagesSchema), getMessages);
router.post("/send" , isAuthenticated ,validate(sendMessageSchema), sendMessage);
router.patch("/edit" , isAuthenticated ,validate(editMessageSchema), editMessage);
router.delete("/delete" , isAuthenticated ,validate(deleteMessageSchema), deleteMessage);

export default router
