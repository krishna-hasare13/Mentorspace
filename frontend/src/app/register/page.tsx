'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, Mail, Lock, User, Loader2, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'mentor' | 'student'>('student');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign up user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: role,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Failed to create account');

      // 2. Create profile record (handled by trigger in production, but we'll do it manually for this MVP)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          role,
          display_name: displayName,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // We don't throw here because user is already created in Auth
      }

      toast.success('Account created successfully!');
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to register');
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
        className="w-full max-w-2xl glass-card"
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground">Join the MentorSpace community</p>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-field w-full pl-11"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/70">Select Your Role</label>
              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                    role === 'student' ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "border-white/10 glass hover:border-white/20"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", role === 'student' ? "bg-primary text-white" : "bg-white/5 text-white/40")}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold">I am a Student</div>
                    <div className="text-xs text-muted-foreground">I want to learn from experts</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('mentor')}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                    role === 'mentor' ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "border-white/10 glass hover:border-white/20"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", role === 'mentor' ? "bg-primary text-white" : "bg-white/5 text-white/40")}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold">I am a Mentor</div>
                    <div className="text-xs text-muted-foreground">I want to share my knowledge</div>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2 mt-auto"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Join MentorSpace <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
