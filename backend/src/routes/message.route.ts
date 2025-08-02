
import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/user.middleware";
import { deleteMessage, editMessage, getMessages, seenMessage, sendMessage } from "../controllers/message.controller";
import { RequestPart, validate } from "../middlewares/validate.middleware";
import { deleteMessageSchema, editMessageSchema, getMessagesSchema, sendMessageSchema } from "../schemas/message.schema";

const router: Router = express.Router();

/*
1  Get : all messages
2. POST :  send message
3. PATCH : edit message
4. DELETE : message
 */

router.get("/all/:chatRoomId" , isAuthenticated , validate(getMessagesSchema, RequestPart.PARAMS), getMessages);
router.post("/send" , isAuthenticated ,validate(sendMessageSchema), sendMessage);
router.put("/edit" , isAuthenticated ,validate(editMessageSchema), editMessage);
router.put("/seen" , isAuthenticated ,validate(getMessagesSchema), seenMessage);
router.delete("/delete/:messageId" , isAuthenticated ,validate(deleteMessageSchema , RequestPart.PARAMS), deleteMessage);

export default router
