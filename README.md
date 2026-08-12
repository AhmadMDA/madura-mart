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
1. Create a Vercel project from this repository.
2. Add these environment variables in the Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MIDTRANS_SERVER_KEY`
   - `MIDTRANS_CLIENT_KEY`
   - `MIDTRANS_IS_PRODUCTION`
   - `OPENAI_API_KEY`
3. Keep server-only secrets in Vercel environment variables and never expose them to the frontend bundle.
4. Ensure the project uses the rewrite config in `vercel.json` for SPA routing and API routes.
5. After deployment, verify the app loads and the login page works with real Supabase credentials.

## Authentication and Role Separation
- Customers sign in with the normal Supabase Auth flow.
- Admin accounts must be assigned a `role` value of `admin` in the `profiles` table.
- Use PostgreSQL RLS and Supabase policies so admin-only pages are protected on the backend.
- Do not rely on frontend-only checks for access control.

## Demo Accounts
This phase includes the login UX and route gating, but real login access requires valid Supabase environment variables and a database with the configured profiles table.

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
