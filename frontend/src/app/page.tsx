'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { motion } from 'framer-motion';
import { Bot, Code2, Video, Globe2, ArrowRight, Layers, Briefcase, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const Nav = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            MentorSpace
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Pricing</Link>
          <Link href="#about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
              <button onClick={signOut} className="btn-primary text-sm">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">Login</Link>
              <Link href="/register" className="btn-primary text-sm flex items-center gap-2">
                Join Now <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass-card flex flex-col items-start gap-4"
  >
    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

export default function LandingPage() {
  return (
    <main className="pt-24 pb-20">
      <Nav />
      
      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Zap className="w-4 h-4 text-accent fill-accent" />
          <span className="text-sm font-medium text-accent">Next-Gen Mentorship Platform</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight"
        >
          Master Any Skill with <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            1-on-1 Real-time Mentoring
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          The ultimate collaborative space for developers and students. 
          Real-time video, collaborative code editing, and instant chat — all in one seamless experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all hover:scale-105">
            Get Started for Free
          </Link>
          <Link href="#features" className="w-full sm:w-auto px-8 py-4 glass text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
            See How it Works
          </Link>
        </motion.div>

        {/* Floating elements visually */}
        <div className="mt-24 relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="glass rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
          >
            <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="mx-auto text-xs text-white/30 font-mono">session_room.ts — MentorSpace</div>
            </div>
            <div className="aspect-video bg-background/50 flex items-center justify-center p-8">
              <div className="grid grid-cols-12 gap-6 w-full h-full">
                <div className="col-span-8 glass rounded-xl border-dashed opacity-50 flex flex-col p-4 gap-2">
                  <div className="w-1/3 h-4 bg-white/10 rounded" />
                  <div className="w-2/3 h-4 bg-white/10 rounded" />
                  <div className="w-1/2 h-4 bg-white/10 rounded" />
                  <div className="w-full mt-auto h-24 bg-primary/5 rounded border border-primary/20 flex flex-col p-3 gap-2">
                    <div className="w-1/4 h-2 bg-primary/20 rounded" />
                    <div className="w-3/4 h-2 bg-primary/20 rounded" />
                  </div>
                </div>
                <div className="col-span-4 flex flex-col gap-4">
                  <div className="aspect-square glass rounded-xl opacity-50 flex items-center justify-center">
                    <Video className="w-8 h-8 text-white/20" />
                  </div>
                  <div className="flex-1 glass rounded-xl opacity-50 p-3 flex flex-col gap-2">
                    <div className="w-full h-2 bg-white/10 rounded" />
                    <div className="w-3/4 h-2 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-32 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-lg">Integrated tools designed for the best learning experience.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Video}
            title="Video Calling"
            description="Crystal clear 1-on-1 video and audio powered by WebRTC. Zero lag, high fidelity."
            delay={0.1}
          />
          <FeatureCard 
            icon={Code2}
            title="Collaborative Editor"
            description="Real-time synchronized Monaco editor. Write, debug, and learn code together instantly."
            delay={0.2}
          />
          <FeatureCard 
            icon={Bot}
            title="AI-Powered Insight"
            description="Intelligent session summaries and session analytics to track your growth."
            delay={0.3}
          />
          <FeatureCard 
            icon={Globe2}
            title="Global Access"
            description="Join from anywhere in the world. Our edge-optimized backend ensures 100% uptime."
            delay={0.4}
          />
          <FeatureCard 
            icon={Briefcase}
            title="Mentor Profiles"
            description="Customizable profiles for mentors to showcase expertise and handle requests."
            delay={0.5}
          />
          <FeatureCard 
            icon={Users}
            title="Session Management"
            description="Easy scheduling, private invite links, and session persistence."
            delay={0.6}
          />
        </div>
      </section>
    </main>
  );
}
