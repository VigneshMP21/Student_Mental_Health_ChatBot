# MindWell – Student Mental Health Chatbot

AI-powered emotional wellness and support platform for students, built with Next.js, Supabase, and Google Gemini.

## Features

- **Authentication** – Register, login, forgot/reset password, email verification, protected routes
- **AI Chatbot** – ChatGPT-style interface with markdown, copy, regenerate, and clear conversation
- **Mood Tracker** – Log moods with notes, weekly/monthly statistics and charts
- **Daily Journal** – Create, edit, delete, search journal entries
- **Chat History** – Save, search, continue, and delete conversations
- **Wellness Suggestions** – AI-personalized study tips, stress relief, sleep, meditation, and more
- **Dashboard** – Stats cards, mood charts, recent activity, quick actions
- **User Profile** – Manage name, avatar, and password

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS |
| Backend | Next.js API Routes (Serverless) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Authentication |
| AI | Google Gemini API |
| Hosting | Vercel |

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor
3. Enable Email auth in Authentication → Providers
4. Copy your project URL and anon key

### 3. Set up Google Gemini

1. Get an API key from [Google AI Studio](https://aistudio.google.com/apikey)

### 4. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables in Project Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (your production URL)
4. Deploy

Update Supabase Auth redirect URLs to include your Vercel domain.

## Project Structure

```
app/                  # Next.js App Router pages and API routes
components/           # Reusable UI components
context/              # React context providers
lib/                  # Supabase and Gemini clients
types/                # TypeScript type definitions
utils/                # Helpers and security utilities
supabase/             # Database schema SQL
public/               # Static assets
```

## Security

- API keys stored in environment variables (never exposed to frontend)
- All AI requests routed through server-side API routes
- Input sanitization and validation (Zod)
- Rate limiting on chat API
- Row Level Security on all Supabase tables
- XSS prevention on user inputs

## Important Disclaimer

MindWell is a supportive wellness tool, **not** a substitute for professional mental health care. For emergencies, contact the **988 Suicide & Crisis Lifeline** or seek qualified professional help.

## License

MIT
