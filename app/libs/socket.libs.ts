import { BASE_URI } from '@/constants/api';
import { io } from 'socket.io-client';

export const socket = io(BASE_URI, {
    transports: ["polling", "websocket"],

});
