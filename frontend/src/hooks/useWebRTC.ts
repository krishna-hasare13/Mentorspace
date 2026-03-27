'use client';

import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';

export const useWebRTC = (socket: Socket | null, localStream: MediaStream | null) => {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    if (!socket || !localStream) return;

    const createPeer = (userId: string, targetSocket: Socket, initiator: boolean, signal?: any) => {
      // Don't recreate if we already have a healthy connection
      if (peerRef.current && !peerRef.current.destroyed) return;

      const peer = new Peer({
        initiator,
        trickle: true,
        stream: localStream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' },
            { 
              urls: ['turn:openrelay.metered.ca:80', 'turn:openrelay.metered.ca:443', 'turn:openrelay.metered.ca:443?transport=tcp'], 
              username: 'openrelayproject', 
              credential: 'openrelayproject' 
            }
          ]
        }
      });

      peer.on('signal', (s) => {
        targetSocket.emit('signal', { target: userId, signal: s });
      });

      peer.on('stream', (stream) => {
        console.log('Received remote stream');
        setRemoteStream(stream);
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
      });

      peer.on('close', () => {
        console.log('WebRTC P2P connection closed natively.');
        setRemoteStream(null);
        if (peerRef.current === peer) {
          peerRef.current = null;
        }
      });

      if (signal && !peer.destroyed) {
        peer.signal(signal);
      }

      peerRef.current = peer;
    };

    // Update signaling listeners on current socket
    socket.on('peer-joined', ({ userId }: { userId: string }) => {
      console.log('Peer joined, creating P2P offer...');
      createPeer(userId, socket, true);
    });

    socket.on('signal', ({ userId, signal }: { userId: string; signal: any }) => {
      if (peerRef.current && !peerRef.current.destroyed) {
        peerRef.current.signal(signal);
      } else {
        createPeer(userId, socket, false, signal);
      }
    });

    socket.on('peer-left', () => {
      console.log('Signaling peer left. P2P connection may still be alive.');
    });

    socket.emit('ready');

    return () => {
      socket.off('peer-joined');
      socket.off('signal');
      socket.off('peer-left');
      // NOTE: We do NOT destroy the peer here to survive socket refreshes!
    };
  }, [socket, localStream]);

  // Handle final cleanup on unmount
  useEffect(() => {
    return () => {
      if (peerRef.current) {
        console.log('Destroying P2P peer on unmount');
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, []);

  return { remoteStream };
};
