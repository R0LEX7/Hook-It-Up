import { IChat } from "../../Interfaces/chat.interface";
import { IMessageDataToBeRecieved } from "../../Interfaces/message.interface";
import { IUser } from "../../Interfaces/user.interfaces";
import { chatModel } from "../../models/chat.model";
import { messageModel } from "../../models/message.model.";
import { UserModal } from "../../models/user.model";

export const handleMessageSend = async ({
  chatRoomId,
  senderId,
  messageType,
  text,
  mediaUrl,
}: IMessageDataToBeRecieved) => {
  const isChatroomExists = await chatModel.findById(chatRoomId);
  if (!isChatroomExists) {
    return {
      success: false,
      message: "Chat room doesn't exist",
      data: null,
    };
  }

  const isSenderExists = await UserModal.findById(senderId);
  if (!isSenderExists) {
    return {
      success: false,
      message: "Sender does not exist",
      data: null,
    };
  }

  // security check is sender is validate
  if (!isSenderExists._id.equals(senderId)) {
    return {
      success: false,
      message: "Sender ID mismatch",
      data: null,
    };
  }

  if (messageType === "text" && !text?.trim()) {
    return {
      success: false,
      message: "Text message is empty",
      data: null,
    };
  }

  if (
    (messageType === "image" || messageType === "video") &&
    !mediaUrl?.trim()
  ) {
    return {
      success: false,
      message: `${messageType} message requires a media URL`,
      data: null,
    };
  }

  const messageBody =
    messageType === "text" ? { text } : { mediaUrl };

  const receiverId = isChatroomExists.members.find(
    (id) => id.toString() !== senderId.toString()
  );

  const message = new messageModel({
    chatRoom: chatRoomId,
    senderId,
    receiverId,
    messageType,
    ...messageBody,
  });

  await message.save();

  const populatedMessage = await message.populate([
    { path: "senderId", select: " username profilePic" },
    { path: "receiverId", select: "username profilePic" },
    { path: "chatRoom" },
  ]);

  isChatroomExists.lastMessage = message._id;
  isChatroomExists.lastMessageAt = new Date();
  await isChatroomExists.save();

  return {
    success: true,
    message: "Message sent successfully",
    data: populatedMessage,
  };
};
