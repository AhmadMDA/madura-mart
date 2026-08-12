# Madura Mart

Madura Mart is a production-ready e-commerce platform foundation built for Vercel + Supabase.

## Features
- React + Vite frontend
- Tailwind CSS styling
- Supabase client integration
- Vercel serverless health endpoint
- Phase 2 database schema foundation

## Tech Stack
- React
- Vite
- JavaScript
- Tailwind CSS
- Supabase PostgreSQL
- Vercel Serverless Functions

## Architecture
- Frontend SPA deployed on Vercel
- Supabase handles PostgreSQL, auth, storage, and RLS
- Server-side operations stay in Vercel API routes

## Environment Variables
Copy `.env.example` to `.env` and fill in values for:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MIDTRANS_SERVER_KEY`
- `MIDTRANS_CLIENT_KEY`
- `MIDTRANS_IS_PRODUCTION`
- `OPENAI_API_KEY`

## Supabase Setup
1. Create a Supabase project.
2. Add the project URL and anonymous key to the frontend env.
3. Apply migrations with Supabase CLI:
   ```bash
   supabase db push
   ```
4. Configure authentication and storage in the Supabase dashboard.

## Local Development
```bash
npm install
npm run dev
```

## Database Migration
```bash
supabase db push
```

## Vercel Deployment
- Add environment variables in the Vercel dashboard.
- Ensure the app uses the Vercel rewrite configuration in `vercel.json`.
- Keep all server-side secrets off the client bundle.

## Demo Accounts
This phase does not yet include authentication flows.

## Project Structure
```bash
madura-mart/
├── api/
├── src/
├── supabase/
├── .env.example
├── README.md
├── vercel.json
├── vite.config.js
└── package.json
```
