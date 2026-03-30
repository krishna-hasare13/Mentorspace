import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';

import { supabaseAdmin, supabaseJwtSecret } from '../config/supabase';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }
  
  // Remove quotes if they exist (standardizing)
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }

  try {
    // Verify the JWT signature using the Supabase JWT Secret
    // This is the most reliable way to verify tokens in a custom backend
    const decoded = jwt.verify(token, supabaseJwtSecret) as any;
    
    if (!decoded || !decoded.sub) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    // Role extraction from Supabase's token structure
    // Role can be in user_metadata (custom) or app_metadata (system)
    const role = decoded.user_metadata?.role || decoded.app_metadata?.role || 'student';

    req.user = {
      sub: decoded.sub,
      email: decoded.email || '',
      role: (role === 'mentor' || role === 'student') ? role : 'student',
      display_name: decoded.user_metadata?.display_name
    };
    
    next();
  } catch (err: any) {
    console.error('Token Verification Failure:', err.message);
    res.status(403).json({ 
      error: 'Invalid or expired token', 
      detailed: err.message === 'jwt expired' ? 'Your session has expired. Please log in again.' : err.message
    });
  }
};

export const requireRole = (role: 'mentor' | 'student') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (req.user.role !== role) {
      res.status(403).json({ error: `Only ${role}s can perform this action` });
      return;
    }
    next();
  };
};
