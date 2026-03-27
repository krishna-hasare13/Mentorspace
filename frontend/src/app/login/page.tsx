'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Welcome back!');
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card"
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your MentorSpace account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full pl-11"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full pl-11"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Sign In <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Create one for free
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
