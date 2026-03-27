export interface UserPayload {
  sub: string;
  email: string;
  role: 'mentor' | 'student';
  display_name?: string;
  iat?: number;
  exp?: number;
}

export interface Session {
  id: string;
  mentor_id: string;
  title: string;
  invite_code: string;
  status: 'active' | 'ended';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  user_id: string;
  display_name: string;
  content: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'mentor' | 'student';
  display_name: string;
  created_at: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
