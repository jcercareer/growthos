# 🚀 GrowthOS Deployment Guide

## ✅ Git Commits Complete
- ✅ Initialized Git repository
- ✅ Committed all 188 files (38,353 lines)
- ✅ Added deployment configurations

## 📋 Prerequisites

### Required:
1. **GitHub Account** - to host the repository
2. **Vercel Account** - for frontend deployment
3. **Render Account** - for backend deployment
4. **Supabase Project** - already set up
5. **OpenAI API Key** - for AI generation

---

## 🎯 Step-by-Step Deployment

### 1️⃣ Create GitHub Repository

```bash
# Option A: Using GitHub CLI (if installed)
gh auth login
gh repo create jcer-marketing-infra --public --source=. --remote=origin
git push -u origin main

# Option B: Manual (via GitHub website)
# 1. Go to https://github.com/new
# 2. Repository name: jcer-marketing-infra
# 3. Set to Public (or Private)
# 4. Do NOT initialize with README
# 5. Click "Create repository"
# 6. Then run:
git remote add origin https://github.com/YOUR_USERNAME/jcer-marketing-infra.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Deploy Backend to Render

#### A. Via Render Dashboard (Recommended)
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `jcer-marketing-infra`
4. Configure:
   - **Name:** `growthos-backend`
   - **Region:** Oregon (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** `apps/backend`
   - **Build Command:**
     ```bash
     cd /opt/render/project/src && npm install -g pnpm && pnpm install && cd apps/backend && pnpm build
     ```
   - **Start Command:**
     ```bash
     cd apps/backend && node dist/index.js
     ```
   - **Plan:** Free

5. **Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=10000
   OPENAI_API_KEY=sk-proj-...
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=eyJh...
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. **Copy the backend URL** (e.g., `https://growthos-backend.onrender.com`)

#### B. Via render.yaml (Alternative)
```bash
# After pushing to GitHub, Render will auto-detect render.yaml
# Just add the environment variables in the dashboard
```

---

### 3️⃣ Deploy Frontend to Vercel

#### A. Via Vercel CLI (Quick)
```bash
cd /Users/joshua/Documents/jcer-marketing-infra

# Login to Vercel
vercel login

# Deploy
vercel --prod

# When prompted:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? growthos-frontend (or keep default)
# - Directory? ./apps/frontend
# - Override settings? No
```

#### B. Via Vercel Dashboard (Recommended for first-time)
1. Go to https://vercel.com/new
2. Import Git Repository → Select `jcer-marketing-infra`
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/frontend`
   - **Build Command:** `cd ../.. && pnpm install && cd apps/frontend && pnpm build`
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install`

4. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://growthos-backend.onrender.com
   ```

5. Click **"Deploy"**
6. Wait 2-3 minutes
7. **Your frontend is live!** (e.g., `https://growthos-frontend.vercel.app`)

---

### 4️⃣ Run Database Migrations

```bash
# Install Supabase CLI if needed
brew install supabase/tap/supabase

# Login
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run all migrations
supabase db push

# Or manually in Supabase dashboard:
# 1. Go to https://app.supabase.com/project/YOUR_PROJECT/editor/sql
# 2. Copy contents of supabase/migrations/006_add_growth_os_modules.sql
# 3. Click "Run"
```

---

### 5️⃣ Update CORS in Backend

Once you have your Vercel frontend URL, update the environment variable in Render:

```
CORS_ORIGIN=https://your-actual-frontend.vercel.app
```

Then trigger a redeploy in Render dashboard.

---

## 🧪 Testing the Deployment

### Backend Health Check:
```bash
curl https://growthos-backend.onrender.com/health
# Should return: {"status":"ok"}
```

### Test API Endpoint:
```bash
curl https://growthos-backend.onrender.com/api/personas
# Should return: {"personas":[]}
```

### Frontend:
1. Open `https://your-frontend.vercel.app`
2. Navigate to "Personas"
3. Try generating a persona for CareerScaleUp Job Seekers
4. Check if it works end-to-end

---

## 🔒 Security Checklist

- ✅ Never commit `.env` files
- ✅ Use Vercel/Render environment variable UI
- ✅ Enable HTTPS only (both platforms enforce this)
- ✅ Set CORS_ORIGIN to your frontend URL
- ✅ Use Supabase RLS policies (already configured)
- ✅ Rotate API keys regularly

---

## 📊 Monitoring

### Vercel:
- Dashboard: https://vercel.com/dashboard
- Logs: Click project → "Deployments" → Click deployment → "Function Logs"

### Render:
- Dashboard: https://dashboard.render.com
- Logs: Click service → "Logs" tab (real-time)

---

## 🐛 Troubleshooting

### Vercel Build Fails:
1. Check build logs in Vercel dashboard
2. Verify `NEXT_PUBLIC_API_URL` is set
3. Ensure root directory is `apps/frontend`
4. Try: Settings → General → "Redeploy"

### Render Build Fails:
1. Check build logs in Render dashboard
2. Verify all environment variables are set
3. Check if pnpm workspace resolution works
4. Try manual deploy from dashboard

### Frontend can't connect to backend:
1. Verify backend URL in Vercel env vars
2. Check CORS settings in backend
3. Test backend health endpoint directly
4. Check browser console for CORS errors

### Database errors:
1. Verify Supabase URL and key
2. Run migrations: `supabase db push`
3. Check RLS policies in Supabase dashboard
4. Verify network access (Supabase allows all IPs by default)

---

## 🎉 Success Checklist

- [ ] GitHub repository created and pushed
- [ ] Backend deployed to Render
- [ ] Backend health check passes
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads successfully
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Can generate a persona end-to-end
- [ ] Can view Analytics dashboard
- [ ] Can generate Niche Variants
- [ ] All 20 modules accessible

---

## 🚀 Quick Deploy Commands

```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy frontend (if using CLI)
cd /Users/joshua/Documents/jcer-marketing-infra
vercel --prod

# 3. Backend deploys automatically on git push (if connected to Render)

# 4. Run migrations
supabase db push
```

---

## 📱 URLs to Save

- **Frontend:** https://YOUR-PROJECT.vercel.app
- **Backend:** https://growthos-backend.onrender.com
- **Supabase:** https://app.supabase.com/project/YOUR_PROJECT
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com

---

## 🎯 Next Steps After Deployment

1. **Test all 20 modules** systematically
2. **Monitor Render logs** for any backend errors
3. **Set up custom domain** (optional, in Vercel settings)
4. **Enable Vercel Analytics** (optional, free tier available)
5. **Set up error tracking** (Sentry, LogRocket, etc.)
6. **Create backup schedule** for Supabase database

---

Need help? Check:
- Vercel docs: https://vercel.com/docs
- Render docs: https://render.com/docs
- Supabase docs: https://supabase.com/docs

