import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';

const generateInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createSession = async (req: Request, res: Response): Promise<void> => {
  const { title, language = 'javascript' } = req.body;
  const mentorId = req.user!.sub;

  if (!title) {
    res.status(400).json({ error: 'Session title is required' });
    return;
  }

  try {
    const inviteCode = generateInviteCode();

    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .insert({
        mentor_id: mentorId,
        title,
        invite_code: inviteCode,
        language,
        status: 'active',
      })
      .select('*')
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ session });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSessions = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.sub;
  const role = req.user!.role;

  try {
    let query = supabaseAdmin
      .from('sessions')
      .select(`
        *,
        profiles!sessions_mentor_id_fkey(display_name, email)
      `)
      .order('created_at', { ascending: false });

    if (role === 'mentor') {
      query = query.eq('mentor_id', userId);
    } else {
      // Students see sessions they've joined
      const { data: participations } = await supabaseAdmin
        .from('session_participants')
        .select('session_id')
        .eq('student_id', userId);

      const sessionIds = participations?.map((p) => p.session_id) || [];
      if (sessionIds.length === 0) {
        res.json({ sessions: [] });
        return;
      }
      query = query.in('id', sessionIds);
    }

    const { data: sessions, error } = await query;

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSession = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .select(`
        *,
        profiles!sessions_mentor_id_fkey(display_name, email)
      `)
      .eq('id', id)
      .single();

    if (error || !session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const joinSession = async (req: Request, res: Response): Promise<void> => {
  const { invite_code } = req.body;
  const studentId = req.user!.sub;

  if (!invite_code) {
    res.status(400).json({ error: 'Invite code is required' });
    return;
  }

  try {
    const { data: session, error } = await supabaseAdmin
      .from('sessions')
      .select('*')
      .eq('invite_code', invite_code.toUpperCase())
      .eq('status', 'active')
      .single();

    if (error || !session) {
      res.status(404).json({ error: 'Session not found or has ended' });
      return;
    }

    // Add participant record (upsert to handle reconnects)
    await supabaseAdmin
      .from('session_participants')
      .upsert({
        session_id: session.id,
        student_id: studentId,
      }, { onConflict: 'session_id,student_id' });

    res.json({ session });
  } catch (error) {
    console.error('Join session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const endSession = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const mentorId = req.user!.sub;

  try {
    const { data: session, error: findError } = await supabaseAdmin
      .from('sessions')
      .select('*')
      .eq('id', id)
      .eq('mentor_id', mentorId)
      .single();

    if (findError || !session) {
      res.status(404).json({ error: 'Session not found or not authorized' });
      return;
    }

    const { error } = await supabaseAdmin
      .from('sessions')
      .update({ status: 'ended', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: 'Session ended successfully' });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { limit = 50, before } = req.query;

  try {
    let query = supabaseAdmin
      .from('messages')
      .select(`
        *,
        profiles!messages_user_id_fkey(display_name)
      `)
      .eq('session_id', id)
      .order('created_at', { ascending: true })
      .limit(Number(limit));

    if (before) {
      query = query.lt('created_at', before as string);
    }

    const { data: messages, error } = await query;

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
