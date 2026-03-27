# MentorSpace – Setup & Deployment Guide

A premium, production-ready 1-on-1 real-time mentorship platform.

## Architecture
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Socket.io-client, simple-peer (WebRTC), @monaco-editor/react.
- **Backend**: Node.js, Express, Socket.io, TypeScript, JWT (Supabase), Supabase JS SDK.
- **Database**: PostgreSQL (via Supabase).

## Prerequisites
1. **Supabase Project**: Create a new project at [supabase.com](https://supabase.com).
2. **SQL Setup**: Copy the content of `backend/schema.sql` (or the `schema.sql` artifact) into the Supabase SQL Editor and run it.

## 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Fill in `.env`:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET` (from Supabase Settings > API)
- `DATABASE_URL` (from Supabase Settings > Database > Connection String)

Run locally:
```bash
npm run dev
```

## 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
```
Fill in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000`

Run locally:
```bash
npm run dev
```

## Deployment
- **Frontend**: Deploy to Vercel. Ensure environment variables are set in the Vercel dashboard.
- **Backend**: Deploy to Railway or Render. Use the included `Procfile`. Set environment variables in the provider's dashboard.
- **CORS**: Update `FRONTEND_URL` in the backend `.env` to your production frontend URL.

## Features
- **Role-based Auth**: Students and Mentors have different dashboard views.
- **Real-time Video**: 1-on-1 WebRTC calling with mic/camera toggles.
- **Collaborative Editor**: Monaco-powered sync with language-aware highlighting.
- **Persistence**: Chat messages and sessions are stored in PostgreSQL.
- **Premium UI**: Glassmorphism, smooth Framer Motion transitions, and responsive layout.
