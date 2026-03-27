import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';

interface EditorState {
  content: string;
  version: number;
}

// Memory cache for active sessions (last-write-wins)
const sessionContent = new Map<string, EditorState>();

export const setupEditorNamespace = (io: Server) => {
  const editorNamespace = io.of('/editor');

  editorNamespace.use((socket: Socket, next) => {
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

  editorNamespace.on('connection', (socket: Socket) => {
    const { sessionId } = socket.handshake.query;
    if (!sessionId) {
      socket.disconnect();
      return;
    }

    const room = `session:${sessionId}`;
    socket.join(room);

    // Send current content to new joiner
    const currentState = sessionContent.get(sessionId as string) || { content: '', version: 0 };
    socket.emit('editor-sync', currentState);

    socket.on('editor-change', (data: { content: string; version: number }) => {
      // Simple last-write-wins sync
      sessionContent.set(sessionId as string, data);
      
      // Broadcast to others in the room
      socket.to(room).emit('editor-change', data);
    });

    socket.on('disconnect', () => {
      // Clean up if last user? (Optional for MVP, maybe keep content till session ends)
    });
  });
};
