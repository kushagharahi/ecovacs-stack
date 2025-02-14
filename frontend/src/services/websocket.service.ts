import { io } from 'socket.io-client';

const websocketService = () => {
  const socket = io(`ws://127.0.0.1:3000`);

  socket.on('disconnect', () => {
    console.log(socket.id);
  });

  return socket;
};

export default websocketService;
