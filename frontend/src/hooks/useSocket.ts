'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/components/providers/AuthProvider';

export const useSocket = (namespace: string, sessionId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { session } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!session?.access_token || !sessionId) return;

    const s = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}${namespace}`, {
      auth: {
        token: session.access_token
      },
      query: {
        sessionId
      },
      transports: ['websocket']
    });

    s.on('connect', () => {
      console.log(`Connected to ${namespace} socket`);
    });

    s.on('connect_error', (err) => {
      console.error(`${namespace} socket error:`, err.message);
    });

    socketRef.current = s;
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [namespace, sessionId, session?.access_token]);

  return socket;
};
