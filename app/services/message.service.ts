import { IMessageDataToBeSent } from "@/interfaces/message.interface";
import { Socket } from "socket.io-client";

export const handleSendMessageService = async (message : IMessageDataToBeSent, socket : Socket) => {

  socket.emit('send_message', message);
};
