'use client';

import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';

export const useWebRTC = (socket: Socket | null, localStream: MediaStream | null) => {
  const [peers, setPeers] = useState<Map<string, Peer.Instance>>(new Map());
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    if (!socket || !localStream) return;

    socket.on('peer-joined', ({ userId }: { userId: string }) => {
      console.log('Peer joined, creating offer...');
      createPeer(userId, socket, true);
    });

    socket.on('signal', ({ userId, signal }: { userId: string; signal: any }) => {
      console.log('Received signal from', userId);
      if (peerRef.current) {
        peerRef.current.signal(signal);
      } else {
        // Peer received offer first
        createPeer(userId, socket, false, signal);
      }
    });

    socket.on('peer-left', () => {
      setRemoteStream(null);
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    });

    const createPeer = (userId: string, socket: Socket, initiator: boolean, signal?: any) => {
      const peer = new Peer({
        initiator,
        trickle: false,
        stream: localStream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      peer.on('signal', (s) => {
        socket.emit('signal', { target: userId, signal: s });
      });

      peer.on('stream', (stream) => {
        console.log('Received remote stream');
        setRemoteStream(stream);
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
      });

      if (signal) {
        peer.signal(signal);
      }

      peerRef.current = peer;
    };

    return () => {
      socket.off('peer-joined');
      socket.off('signal');
      socket.off('peer-left');
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [socket, localStream]);

  return { remoteStream };
};
