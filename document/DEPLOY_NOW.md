# 🚀 GrowthOS Deployment - Quick Steps

## ✅ Current Status

### Git Commits:
- ✅ All 188 files committed (38,353 lines)
- ✅ 3 commits total:
  1. Complete GrowthOS implementation (20 modules)
  2. Add deployment configuration
  3. Fix vercel.json for pnpm workspace

### Vercel Projects:
- ✅ **growthos-frontend** - Already exists and showing "Ready" deployments
- ⚠️ Need to connect to this GitHub repo for auto-deploy

---

## 🎯 Next Steps to Deploy

### 1️⃣ Push to GitHub

First, you need to create a GitHub repository and push the code:

```bash
# Go to https://github.com/new
# Create repo: jcer-marketing-infra (or any name)
# Then run:

cd /Users/joshua/Documents/jcer-marketing-infra
git remote add origin https://github.com/YOUR_USERNAME/jcer-marketing-infra.git
git branch -M main
git push -u origin main
```

### 2️⃣ Connect Vercel to GitHub Repo

Since you already have the `growthos-frontend` project in Vercel:

1. Go to: https://vercel.com/jcercareers-projects/growthos-frontend/settings
2. Click on **"Git"** in the left sidebar
3. Click **"Connect Git Repository"**
4. Select your new GitHub repo: `jcer-marketing-infra`
5. Set **Root Directory** to: `apps/frontend`
6. Save

### 3️⃣ Configure Build Settings in Vercel

The `apps/frontend/vercel.json` is already configured with:

```json
{
  "installCommand": "pnpm install",
  "buildCommand": "cd ../.. && pnpm install && pnpm --filter @growth-os/frontend build",
  "devCommand": "cd ../.. && pnpm --filter @growth-os/frontend dev",
  "framework": "nextjs"
}
```

But you should also verify in the Vercel dashboard:
1. Go to Settings → General
2. **Root Directory:** `apps/frontend`
3. **Framework Preset:** Next.js
4. **Build Command:** (let vercel.json handle it)
5. **Install Command:** (let vercel.json handle it)

### 4️⃣ Set Environment Variables in Vercel

1. Go to: https://vercel.com/jcercareers-projects/growthos-frontend/settings/environment-variables
2. Add these variables for all environments (Production, Preview, Development):

```
NEXT_PUBLIC_API_URL=https://growthos-backend.onrender.com
```

(You'll get the actual backend URL after deploying to Render)

### 5️⃣ Deploy Backend to Render

#### Option A: Via Render Dashboard (Easiest)

1. Go to: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `growthos-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** Leave blank (Render will use repo root)
   - **Build Command:**
     ```bash
     npm install -g pnpm && pnpm install && cd apps/backend && pnpm build
     ```
   - **Start Command:**
     ```bash
     cd apps/backend && node dist/index.js
     ```
   - **Plan:** Free

5. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   OPENAI_API_KEY=your-openai-key-here
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-key-here
   CORS_ORIGIN=https://growthos-frontend.vercel.app
   ```

6. Click **"Create Web Service"**
7. Wait 5-10 minutes for build
8. Copy the backend URL (e.g., `https://growthos-backend.onrender.com`)

#### Option B: Via render.yaml (Automatic)

The `render.yaml` file is already in the repo. Render will auto-detect it.
Just add the environment variables in the dashboard.

### 6️⃣ Update Frontend Environment Variable

Once you have the backend URL from Render:

1. Go back to Vercel: https://vercel.com/jcercareers-projects/growthos-frontend/settings/environment-variables
2. Update `NEXT_PUBLIC_API_URL` with the actual Render backend URL
3. Trigger a redeploy: Settings → Deployments → Click "Redeploy"

### 7️⃣ Run Database Migrations

```bash
# If you have Supabase CLI installed
supabase db push

# OR manually in Supabase dashboard:
# 1. Go to SQL Editor
# 2. Copy/paste contents of supabase/migrations/006_add_growth_os_modules.sql
# 3. Run
```

---

## 🧪 Testing After Deployment

### Test Backend:
```bash
curl https://growthos-backend.onrender.com/health
# Expected: {"status":"ok"}
```

### Test Frontend:
1. Open `https://growthos-frontend.vercel.app`
2. Click on "Personas"
3. Try generating a persona
4. Should work end-to-end!

---

## 📊 All Your Vercel Projects

From your screenshot, I can see:
- ✅ **growthos-frontend** - Ready (this is the correct one!)
- ❌ **frontend** - Error (created by mistake, you can delete this)
- ❌ **jcer-marketing-infra** - Error (created by mistake, you can delete this)

### Clean up unnecessary projects:
1. Go to each project's settings
2. Scroll to bottom → "Delete Project"

---

## 🎉 Summary of What's Ready

### ✅ Committed to Git:
- 20 GrowthOS modules (Personas, Messaging, Scripts, Blogs, Funnels, Lead Magnets, Email/SMS, Social Packs, Paid Ads, Pricing Pages, Social Proof, Viral Scripts, LinkedIn Viral, Campaign Assets, Analytics, Niches)
- Database migrations
- Frontend & Backend apps
- Deployment configs
- Documentation

### ⏳ Next Actions Required:
1. [ ] Create GitHub repo and push code
2. [ ] Connect Vercel's `growthos-frontend` to GitHub repo
3. [ ] Deploy backend to Render
4. [ ] Update frontend env var with backend URL
5. [ ] Run database migrations
6. [ ] Test end-to-end

---

## 🚨 Quick Deploy Checklist

```bash
# 1. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/jcer-marketing-infra.git
git push -u origin main

# 2. In Vercel Dashboard:
#    - Connect growthos-frontend to GitHub repo
#    - Set root directory: apps/frontend
#    - Add NEXT_PUBLIC_API_URL env var

# 3. In Render Dashboard:
#    - Create new Web Service
#    - Connect GitHub repo
#    - Add all environment variables
#    - Deploy

# 4. Update Vercel env var with Render URL

# 5. Run migrations:
supabase db push

# 6. Test!
```

---

## 🔗 Important URLs

- **Vercel Dashboard:** https://vercel.com/jcercareers-projects/growthos-frontend
- **Render Dashboard:** https://dashboard.render.com
- **Supabase Dashboard:** https://app.supabase.com

---

Need the actual deployment commands? Just ask! 🚀

