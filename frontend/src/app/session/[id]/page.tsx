'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSocket } from '@/hooks/useSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import { VideoPanel } from '@/components/session/VideoPanel';
import { EditorPanel } from '@/components/session/EditorPanel';
import { ChatPanel } from '@/components/session/ChatPanel';
import { 
  Loader2, 
  ChevronLeft, 
  LogOut, 
  Share2, 
  Check, 
  Info,
  Users,
  LayoutGrid
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function SessionRoomPage() {
  const { id } = useParams();
  const { user, profile, loading } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // Socket Namespaces
  const webrtcSocket = useSocket('/webrtc', id as string);
  const editorSocket = useSocket('/editor', id as string);
  const chatSocket = useSocket('/chat', id as string);

  // WebRTC Hook
  const { remoteStream } = useWebRTC(webrtcSocket, localStream);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchSessionAndMedia = async () => {
      try {
        // 1. Fetch Session Info
        const { data: { session: authSession } } = await (await import('@/lib/supabase/client')).createClient().auth.getSession();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/${id}`, {
          headers: {
            'Authorization': `Bearer ${authSession?.access_token}`
          }
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setSession(data.session);

        // 2. Request Media Permissions
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (err: any) {
        toast.error('Could not initialize session: ' + err.message);
        router.push('/dashboard');
      }
    };

    if (user && id) {
      fetchSessionAndMedia();
    }

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, [id, user]);

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(session?.invite_code || '');
    setCopied(true);
    toast.success('Invite code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndSession = async () => {
    if (!window.confirm('Are you sure you want to end this session?')) return;
    
    try {
      const { data: { session: authSession } } = await (await import('@/lib/supabase/client')).createClient().auth.getSession();
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/${id}/end`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authSession?.access_token}`
        }
      });
      router.push('/dashboard');
    } catch (err) {
      router.push('/dashboard');
    }
  };

  if (!session || !localStream) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-white/30 font-medium animate-pulse">Initializing real-time engine...</p>
      </div>
    );
  }

  const isMentor = profile?.id === session.mentor_id;

  return (
    <main className="h-screen flex flex-col pt-2 bg-[#050810] overflow-hidden">
      {/* Top Bar */}
      <header className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/30 hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <h1 className="text-lg font-bold leading-none">{session.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-1.5 bg-green-500/10 text-green-400 rounded uppercase font-bold tracking-tighter ring-1 ring-green-500/20">Active</span>
              <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{session.profiles?.display_name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyInvite}
            className="glass flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition-all border-white/5"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4 text-primary" />}
            <span className="font-mono">{session.invite_code}</span>
          </button>
          
          <div className="w-px h-8 bg-white/10 mx-2" />

          {isMentor && (
            <button 
              onClick={handleEndSession}
              className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-destructive/20 transition-all"
            >
              End Session
            </button>
          )}

          <button 
            onClick={() => router.push('/dashboard')}
            className="glass p-2 rounded-xl hover:bg-white/10 transition-all border-white/5"
          >
            <LogOut className="w-5 h-5 text-white/50" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 min-h-0">
        {/* Left: Video */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-4 min-h-0"
        >
          <VideoPanel localStream={localStream} remoteStream={remoteStream} />
        </motion.div>

        {/* Center: Editor */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-5 min-h-0"
        >
          <EditorPanel socket={editorSocket} language={session.language} />
        </motion.div>

        {/* Right: Chat */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-3 min-h-0"
        >
          <ChatPanel socket={chatSocket} sessionId={id as string} />
        </motion.div>
      </div>

      {/* Footer Info (Minor) */}
      <footer className="px-6 py-2 flex items-center justify-between opacity-30">
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1"><Users className="w-3 h-3" /> Peer Connected</div>
          <div className="flex items-center gap-1"><LayoutGrid className="w-3 h-3" /> Grid Optimized</div>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
          <Info className="w-3 h-3" /> Secure E2E Loop
        </div>
      </footer>
    </main>
  );
}
