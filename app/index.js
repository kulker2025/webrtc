import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',  // fejlesztéshez, élesben szűkítsd
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);

    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    const otherClients = clients.filter(id => id !== socket.id);

    // Új kliensnek küldjük, kik vannak már a szobában
    socket.emit('all-users', otherClients);

    // Többi felhasználónak jelezzük az új csatlakozót
    socket.to(roomId).emit('user-connected', socket.id);
  });

  socket.on('signal', ({ targetId, data }) => {
    io.to(targetId).emit('signal', { id: socket.id, data });
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach(roomId => {
      socket.to(roomId).emit('user-disconnected', socket.id);
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
