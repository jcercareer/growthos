# Environment Variables Setup

## Required Environment Variables

### Backend (`apps/backend/.env`)

Create `apps/backend/.env`:

```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# Supabase (use SERVICE ROLE key, not anon key)
SUPABASE_URL=https://slnomadjemgakrdaqnlq.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

# OpenAI API
OPENAI_API_KEY=sk-proj-your_openai_api_key_here
```

**Important:** Use the **SERVICE ROLE** key from Supabase (Settings > API), NOT the anon key. The service role bypasses RLS for backend operations.

### Frontend (`apps/frontend/.env.local`)

Create `apps/frontend/.env.local`:

```bash
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

# Supabase (optional, for future direct access)
NEXT_PUBLIC_SUPABASE_URL=https://slnomadjemgakrdaqnlq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
```

**Note:** Only `NEXT_PUBLIC_BACKEND_URL` is currently required. The Supabase vars are for potential future frontend features.

## Quick Setup Script

```bash
# From project root

# 1. Backend .env
cat > apps/backend/.env << 'EOF'
PORT=4000
NODE_ENV=development
SUPABASE_URL=https://slnomadjemgakrdaqnlq.supabase.co
SUPABASE_SERVICE_KEY=YOUR_SERVICE_KEY_HERE
OPENAI_API_KEY=YOUR_OPENAI_KEY_HERE
EOF

# 2. Frontend .env.local
cat > apps/frontend/.env.local << 'EOF'
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
EOF

# 3. Replace placeholders with your actual keys
```

## Getting Your API Keys

### Supabase Keys

1. Go to https://slnomadjemgakrdaqnlq.supabase.co
2. Navigate to **Settings** > **API**
3. Copy:
   - **Service Role Key** (secret) for backend
   - **Anon Key** (public) for frontend (optional)

### OpenAI Key

1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. Copy the key (starts with `sk-proj-`)
4. Keep it secure!

## Environment Files Summary

| File | Purpose | Required? |
|------|---------|-----------|
| `apps/backend/.env` | Backend server config | ✅ Yes |
| `apps/frontend/.env.local` | Frontend config | ✅ Yes |
| `.gitignore` | Protects .env files | ✅ Already configured |

## Verification

After creating the files:

```bash
# Verify backend .env exists
ls -la apps/backend/.env

# Verify frontend .env.local exists
ls -la apps/frontend/.env.local

# Start servers
pnpm dev
```

If you see errors about missing environment variables, check:
1. Files exist in correct locations
2. No typos in variable names
3. No extra spaces around `=`
4. Keys are valid and not expired

## Production Environment Variables

### Vercel (Frontend)

In Vercel dashboard, add:
- `NEXT_PUBLIC_BACKEND_URL` = Your Render backend URL
- `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL (optional)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key (optional)

### Render (Backend)

In Render dashboard, add:
- `PORT` = 4000 (or let Render auto-assign)
- `NODE_ENV` = production
- `SUPABASE_URL` = Your Supabase URL
- `SUPABASE_SERVICE_KEY` = Your service role key
- `OPENAI_API_KEY` = Your OpenAI key

## Security Notes

⚠️ **NEVER commit .env files to Git**
- Already in `.gitignore`
- Service role keys bypass security
- OpenAI keys are tied to billing

✅ **Best Practices**
- Rotate keys periodically
- Use different keys for dev/prod
- Monitor OpenAI usage dashboard
- Set spending limits in OpenAI

