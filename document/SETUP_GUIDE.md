# Growth OS - Complete Setup Guide

## Prerequisites

- **Node.js** 18+ 
- **pnpm** (or npm/yarn)
- **Supabase Account** (free tier works)
- **OpenAI API Key** (for AI generation)

---

## Step 1: Clone and Install

```bash
# Clone the repo
cd /path/to/jcer-marketing-infra

# Install dependencies
pnpm install

# This installs:
# - Frontend (Next.js 14, Tailwind, shadcn/ui)
# - Backend (Express, TypeScript)
# - Shared types
```

---

## Step 2: Set Up Supabase

### 2.1 Create Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for project to be ready (~2 minutes)

### 2.2 Run Migrations

```bash
# Copy your Supabase project URL
# Go to Supabase SQL Editor
# Run migrations in order:

1. supabase/migrations/001_initial_schema.sql
2. supabase/migrations/002_add_audience_type.sql
3. supabase/migrations/003_add_social_analytics.sql
4. supabase/migrations/004_update_audience_types.sql
5. supabase/migrations/005_add_brand_and_tags.sql
```

### 2.3 Get API Keys

```bash
# Project Settings → API
# Copy:
# - Project URL (e.g., https://xxx.supabase.co)
# - service_role key (secret, for backend)
```

---

## Step 3: Configure Environment Variables

### 3.1 Backend Environment

Create `apps/backend/.env`:

```bash
PORT=4000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

# OpenAI
OPENAI_API_KEY=sk-your-openai-key-here
```

### 3.2 Frontend Environment

Create `apps/frontend/.env.local`:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

---

## Step 4: Verify Setup

### 4.1 Start Backend

```bash
cd apps/backend
pnpm dev

# Should see:
# 🚀 Growth OS Backend running on http://localhost:4000
# ✅ Global Validation endpoint ready
```

### 4.2 Start Frontend

```bash
# New terminal
cd apps/frontend
pnpm dev

# Should see:
# ✓ Ready on http://localhost:3000
```

### 4.3 Test Health Check

```bash
curl http://localhost:4000/health

# Should return:
# {"status":"ok","timestamp":"...","service":"growth-os-backend"}
```

---

## Step 5: Generate Your First Content

1. **Navigate to** http://localhost:3000/personas

2. **Generate a Persona**:
   - Product: CareerScaleUp
   - Audience Type: Job Seeker
   - Click "Generate Persona"

3. **Generate Messaging**:
   - Go to /messaging
   - Select the persona you created
   - Click "Generate Messaging"

4. **Validate**:
   - Scroll down to validation panel
   - Click "Run Consistency Check"
   - See scores and suggestions

---

## Troubleshooting

### Backend won't start

```bash
# Check Supabase credentials
node -e "require('dotenv').config(); console.log('URL:', process.env.SUPABASE_URL)"

# Should print your Supabase URL
# If not, check apps/backend/.env
```

### "Module not found" errors

```bash
# From project root
pnpm install

# This reinstalls all dependencies
```

### OpenAI errors

```bash
# Verify API key
node -e "require('dotenv').config(); console.log('Key:', process.env.OPENAI_API_KEY?.substring(0, 10))"

# Should print: Key: sk-proj-xx
```

### Supabase connection errors

- Verify SUPABASE_URL in .env
- Verify SUPABASE_SERVICE_KEY (not anon key!)
- Check Supabase project is active
- Run migrations in correct order

---

## Next Steps

✅ **Explore Features**:
- Generate personas, messaging, scripts, blogs
- Use social analytics to track performance
- Validate content with AI consistency checks
- Auto-fix low-quality content

✅ **Read Documentation**:
- [Validation System](./VALIDATION_SYSTEM.md)
- [Auto-Fix Guide](./AUTO_FIX_UX_COMPLETE.md)
- [Social Analytics](./SOCIAL_ANALYTICS_COMPLETE.md)
- [API Examples](../apps/backend/API_EXAMPLES.md)

✅ **Customize**:
- Add your own personas
- Adjust validation thresholds
- Track your social accounts
- Build custom workflows

---

## Project Structure

```
jcer-marketing-infra/
├── apps/
│   ├── backend/          # Express API server
│   │   ├── src/
│   │   │   ├── routes/   # API endpoints
│   │   │   ├── services/ # Business logic
│   │   │   └── repositories/ # Database access
│   │   └── .env          # Backend config
│   └── frontend/         # Next.js UI
│       ├── src/
│       │   ├── app/      # Pages
│       │   ├── components/ # UI components
│       │   └── lib/      # API client
│       └── .env.local    # Frontend config
├── packages/
│   └── shared/           # Shared types
├── supabase/
│   └── migrations/       # Database schema
└── docs/                 # Documentation
```

---

## Available Scripts

```bash
# From project root
pnpm dev              # Start frontend + backend
pnpm build            # Build all packages
pnpm lint             # Run linters

# Backend only
cd apps/backend
pnpm dev              # Start dev server
pnpm build            # Build for production

# Frontend only
cd apps/frontend
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
```

---

## Database Schema

**Core Tables:**
- `personas` - Customer personas
- `messaging` - Marketing messaging
- `scripts` - Video scripts
- `blog_outlines` - Blog post outlines

**Social Analytics:**
- `social_accounts` - Social media accounts
- `social_posts` - Posted content
- `social_post_metrics_snapshots` - Performance metrics

---

## API Endpoints

**Generation:**
- POST `/api/generate/persona`
- POST `/api/generate/messaging`
- POST `/api/generate/script`
- POST `/api/generate/blog-outline`

**Validation:**
- POST `/api/validate/global`
- POST `/api/validate/auto-fix`

**Social:**
- POST/GET `/api/social/accounts`
- POST/GET `/api/social/posts`
- POST/GET `/api/social/posts/:id/metrics`

**List:**
- GET `/api/personas`
- GET `/api/messaging`
- GET `/api/scripts`
- GET `/api/blog-outlines`

---

## Support

- **Documentation**: `/docs` folder
- **API Examples**: `apps/backend/API_EXAMPLES.md`
- **Issues**: Check console logs for errors
- **Database**: Supabase SQL Editor for queries

---

**You're all set! 🎉**

Start generating AI-powered marketing content with confidence.

