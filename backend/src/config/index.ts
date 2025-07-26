import { initializeSocket } from './socket.io';
import { corsConfig } from './cors.config';
import { connectToDatabase } from "./database";


export  {
    connectToDatabase,
    corsConfig ,
    initializeSocket
}
