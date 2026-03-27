import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';

export const setupWebRTCNamespace = (io: Server) => {
  const webrtcNamespace = io.of('/webrtc');

  webrtcNamespace.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!) as UserPayload;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  webrtcNamespace.on('connection', (socket: Socket) => {
    const { sessionId } = socket.handshake.query;
    if (!sessionId) {
      socket.disconnect();
      return;
    }

    const room = `session:${sessionId}`;
    socket.join(room);

    // Notify others that a new peer joined
    socket.to(room).emit('peer-joined', { userId: socket.data.user.sub });

    // Signaling relay
    socket.on('signal', (data: { target: string; signal: any }) => {
      // Data contains the WebRTC signaling data (offer/answer/ice)
      // We broadcast it to the room or a specific target if we had multiple peers
      // For 1-on-1, just broadcasting to everyone else in the room works
      socket.to(room).emit('signal', {
        userId: socket.data.user.sub,
        signal: data.signal
      });
    });

    socket.on('disconnect', () => {
      socket.to(room).emit('peer-left', { userId: socket.data.user.sub });
    });
  });
};
