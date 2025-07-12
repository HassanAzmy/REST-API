import { Server } from "socket.io";

/** @type {import('socket.io').Server} */
let io;

export const socket = {
   init: httpServer => {
      io = new Server(httpServer, {
         cors: {
            origin: '*'
         }
      });
      return io;
   },
   /** @returns {import('socket.io').Server} */
   getIO: () => {
      if(!io) {
         throw new Error('Socket.io is not initialized.');
      }
      return io;
   }
};