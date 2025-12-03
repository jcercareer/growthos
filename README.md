# Growth OS

**Internal marketing tool for JCER LLC** - AI-powered content generation for CareerScaleUp and Zevaux.

Generate customer personas, marketing messaging, video scripts, and blog outlines using OpenAI GPT-4o-mini with strict JSON validation.

---

## 🏗️ Architecture

This is a **monorepo** built with **pnpm workspaces**:

```
growth-os/
├── apps/
│   ├── frontend/          # Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
│   └── backend/           # Node + Express + TypeScript API
└── packages/
    └── shared/            # Shared TypeScript types
```

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Button, Card, Select, Alert, etc.)
- **API Client**: Type-safe fetch wrapper
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **Language**: TypeScript
- **Validation**: Zod schemas for AI output
- **Deployment**: Render

### Database & AI
- **Database**: Supabase (hosted PostgreSQL)
- **ORM**: Supabase JS Client with repository pattern
- **AI**: OpenAI API (gpt-4o-mini) with strict JSON mode
- **Validation**: Double validation (OpenAI JSON schema + Zod)

---

## 📋 Features

### Current (Phase 1)

✅ **Personas** - Generate detailed customer personas
- Product selection (CareerScaleUp/Zevaux)
- Optional seed notes for guidance
- Outputs: name, age range, description, pain points, goals, buying triggers

✅ **Messaging** - Generate marketing messaging
- Select existing persona
- Outputs: headline, emotional hook, elevator pitch, viral taglines

✅ **Video Scripts** - Generate platform-optimized scripts
- Platform selection (TikTok, Instagram Reels, YouTube Shorts)
- Outputs: hook, body, CTA, production notes

✅ **Blog Outlines** - Generate SEO-optimized outlines
- Outputs: title, sections with bullets, SEO keywords, meta description

### Future Phases
- Content calendar and scheduling
- Campaign management
- Analytics and performance tracking
- Multi-variant A/B testing
- Export to PDF/Markdown
- Team collaboration features

---

## 🛠️ Setup Guide

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Supabase** account (free tier works)
- **OpenAI** API key with billing enabled

### Quick Start (5 minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Create Supabase database (see Database Setup below)

# 3. Configure environment variables (see below)

# 4. Start development servers
pnpm dev
```

Servers will start at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

---

## 📦 Database Setup

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Create a new project (or use existing)
3. Wait for project to finish provisioning

### 2. Run SQL Migration

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the editor
6. Click **Run** (or press `Ctrl+Enter`)

This creates 4 tables:
- `personas` - Customer persona data
- `messaging` - Marketing messaging
- `scripts` - Video scripts
- `blog_outlines` - Blog post outlines

**Verify**: Go to **Table Editor** and confirm all 4 tables exist.

See `SUPABASE_SETUP.md` for detailed instructions with screenshots.

---

## 🔑 Environment Variables

### Backend Configuration

Create `apps/backend/.env`:

```bash
PORT=4000
NODE_ENV=development

# Supabase (use SERVICE ROLE key, NOT anon key)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

# OpenAI API
OPENAI_API_KEY=sk-proj-your_openai_api_key_here
```

**Getting Keys:**
- **Supabase**: Dashboard > Settings > API > **Service Role Key** (secret)
- **OpenAI**: https://platform.openai.com/api-keys

### Frontend Configuration

Create `apps/frontend/.env.local`:

```bash
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

**Complete Setup Script:**

```bash
# Backend
cat > apps/backend/.env << 'EOF'
PORT=4000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=paste_service_key_here
OPENAI_API_KEY=paste_openai_key_here
EOF

# Frontend
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:4000" > apps/frontend/.env.local
```

See `ENV_SETUP.md` for detailed configuration guide.

---

## 🏃 Development

### Start All Servers

```bash
pnpm dev
```

This starts both apps in parallel:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000 (with hot reload)

### Run Individually

```bash
# Frontend only
cd apps/frontend && pnpm dev

# Backend only  
cd apps/backend && pnpm dev
```

### Verify Backend

```bash
# Health check
curl http://localhost:4000/health

# Expected response:
# {"status":"ok","timestamp":"...","service":"growth-os-backend"}
```

### Test Complete Workflow

1. Open http://localhost:3000/personas
2. Select "CareerScaleUp" and click "Generate Persona"
3. Go to http://localhost:3000/messaging
4. Select your persona and generate messaging
5. Try scripts and blog outlines

See `FRONTEND_SETUP.md` for detailed testing instructions.

---

## 🏗️ Build

```bash
# Build everything
pnpm build

# Builds:
# - Frontend: .next/ directory (optimized production build)
# - Backend: dist/ directory (compiled TypeScript)
```

---

## 📝 Code Quality

```bash
# Lint all code
pnpm lint

# Format all files
pnpm format

# Check formatting (CI)
pnpm format:check
```

---

## 📁 Project Structure

```
growth-os/
├── apps/
│   ├── frontend/                          # Next.js 14 App
│   │   ├── src/
│   │   │   ├── app/                       # App Router pages
│   │   │   │   ├── layout.tsx            # Root layout + navigation
│   │   │   │   ├── page.tsx              # Home page
│   │   │   │   ├── personas/page.tsx     # ✅ Persona generation
│   │   │   │   ├── messaging/page.tsx    # ✅ Messaging generation
│   │   │   │   ├── scripts/page.tsx      # ✅ Video script generation
│   │   │   │   └── blogs/page.tsx        # ✅ Blog outline generation
│   │   │   ├── components/ui/            # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   └── alert.tsx
│   │   │   └── lib/
│   │   │       ├── api.ts                # API client wrapper
│   │   │       └── utils.ts              # Utility functions
│   │   ├── .env.local                    # Environment variables (gitignored)
│   │   └── next.config.mjs
│   │
│   └── backend/                           # Express API
│       ├── src/
│       │   ├── index.ts                  # Express server + routes
│       │   ├── supabaseClient.ts         # Supabase client
│       │   ├── aiClient.ts               # OpenAI wrapper
│       │   ├── aiSchemas.ts              # Zod validation schemas
│       │   ├── repositories/             # Database operations
│       │   │   ├── personas.ts
│       │   │   ├── messaging.ts
│       │   │   ├── scripts.ts
│       │   │   ├── blogOutlines.ts
│       │   │   └── index.ts
│       │   └── routes/                   # API route handlers
│       │       ├── generatePersona.ts
│       │       ├── generateMessaging.ts
│       │       ├── generateScript.ts
│       │       ├── generateBlogOutline.ts
│       │       ├── listPersonas.ts
│       │       └── listMessaging.ts
│       ├── .env                          # Environment variables (gitignored)
│       └── tsconfig.json
│
├── packages/
│   └── shared/                           # Shared TypeScript types
│       └── src/
│           └── index.ts                  # Type definitions
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        # Database schema
│
├── package.json                          # Root workspace config
├── pnpm-workspace.yaml                   # Workspace definition
└── README.md                             # This file
```

## 🎯 Development Principles

1. **TypeScript everywhere** - Full type safety across the stack
2. **Simple architecture** - Production-ready, no over-engineering
3. **Strict validation** - Zod schemas prevent AI hallucinations
4. **Clear code** - Explicit over clever abstractions

---

## 🚀 Deployment

### Backend → Render

**1. Create New Web Service**
- Go to https://render.com
- Click **New** > **Web Service**
- Connect your GitHub repository

**2. Configure Build**
```
Name: growth-os-backend
Root Directory: apps/backend
Build Command: pnpm install && pnpm build
Start Command: pnpm start
```

**3. Set Environment Variables**
```
PORT=4000
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
OPENAI_API_KEY=sk-proj-your_openai_key
```

**4. Deploy**
- Render will auto-deploy on push to main branch
- Backend will be available at: `https://your-app.onrender.com`

**Cost**: Free tier available (spins down after inactivity)

---

### Frontend → Vercel

**1. Import Project**
- Go to https://vercel.com
- Click **Add New** > **Project**
- Import your GitHub repository

**2. Configure Framework**
```
Framework Preset: Next.js
Root Directory: apps/frontend
Build Command: (auto-detected)
Output Directory: (auto-detected)
Install Command: pnpm install
```

**3. Set Environment Variables**
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co (optional)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key (optional)
```

**4. Deploy**
- Vercel auto-deploys on push to main
- Frontend will be available at: `https://your-app.vercel.app`

**Cost**: Free tier includes:
- Unlimited deployments
- Automatic HTTPS
- Global CDN

---

### Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend environment variables set
- [ ] Backend health check responds: `https://your-backend.onrender.com/health`
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable points to backend URL
- [ ] Test persona generation from production frontend
- [ ] Monitor OpenAI usage dashboard
- [ ] Set spending limits in OpenAI

### Post-Deployment

**Monitor Costs:**
- OpenAI: ~$0.045 per complete workflow
- Render: Free (or $7/month for always-on)
- Vercel: Free for hobby projects
- Supabase: Free tier (500MB database, 2GB bandwidth)

**Custom Domain (Optional):**
- Vercel: Settings > Domains > Add domain
- Render: Settings > Custom Domains > Add domain

---

## 📡 API Endpoints

### Generation Endpoints (POST)
- `/api/generate/persona` - Generate customer persona
- `/api/generate/messaging` - Generate marketing messaging
- `/api/generate/script` - Generate video script
- `/api/generate/blog-outline` - Generate blog outline

### List Endpoints (GET)
- `/api/personas` - List all personas
- `/api/messaging?personaId={uuid}` - List messaging for persona

**Complete API documentation**: See `apps/backend/API_EXAMPLES.md`

**Example Request:**
```bash
curl -X POST http://localhost:4000/api/generate/persona \
  -H "Content-Type: application/json" \
  -d '{"product": "CareerScaleUp", "seed_notes": "Focus on career switchers"}'
```

---

## 💰 Cost Estimates

Using OpenAI `gpt-4o-mini` (fast + cost-effective):

| Operation | Avg Cost | Time |
|-----------|----------|------|
| Generate Persona | ~$0.01 | 5-10s |
| Generate Messaging | ~$0.005 | 3-5s |
| Generate Script | ~$0.01 | 5-10s |
| Generate Blog | ~$0.02 | 10-15s |
| **Complete Workflow** | **~$0.045** | **25-40s** |

**Monthly estimates:**
- 100 workflows/month = ~$4.50
- 500 workflows/month = ~$22.50
- 1000 workflows/month = ~$45.00

Set spending limits in OpenAI dashboard to avoid surprises.

---

## 📚 Documentation

All documentation is organized in the `/document` folder:

| File | Description |
|------|-------------|
| `document/INDEX.md` | Documentation index - start here |
| `document/SETUP_GUIDE.md` | Complete setup walkthrough |
| `document/PROJECT_SUMMARY.md` | Comprehensive project overview |
| `document/VALIDATION_SYSTEM.md` | Validation architecture and usage |
| `document/AUTO_FIX_UX_COMPLETE.md` | Auto-fix system guide |
| `document/SOCIAL_ANALYTICS_COMPLETE.md` | Social analytics documentation |
| `apps/backend/API_EXAMPLES.md` | API examples and usage |
| `apps/backend/DATA_LAYER.md` | Database layer reference |

**Quick Start**: See [document/SETUP_GUIDE.md](./document/SETUP_GUIDE.md) for complete setup instructions.

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check `.env` file exists in `apps/backend/`
- Verify Supabase and OpenAI keys are valid
- Check port 4000 not in use: `lsof -i :4000`

**Frontend can't reach backend:**
- Verify backend is running: `curl http://localhost:4000/health`
- Check `.env.local` has correct `NEXT_PUBLIC_BACKEND_URL`
- Restart frontend after creating `.env.local`

**Database errors:**
- Verify SQL migration ran successfully in Supabase
- Check Supabase dashboard for all 4 tables
- Verify using SERVICE ROLE key, not anon key

**OpenAI errors:**
- Check API key is valid and has credits
- Verify billing is enabled in OpenAI dashboard
- Check usage limits not exceeded

**"No personas found" error:**
- Go to `/personas` page first
- Generate at least one persona
- Then try other pages

**More help**: See documentation files listed above.

---

## 👥 About JCER LLC

### Products
- **CareerScaleUp** - AI career platform for job seekers
  - Resume optimization (ATS-friendly)
  - Job search strategy
  - Interview preparation
  
- **Zevaux** - AI automation for small businesses
  - AI receptionist (24/7)
  - Lead qualification
  - Appointment scheduling

### Growth OS Purpose
Internal tool to generate consistent, high-quality marketing content across both products using AI.

---

## 📄 License

Internal tool for JCER LLC. Not for public distribution.

---

Made with ❤️ by JCER LLC

