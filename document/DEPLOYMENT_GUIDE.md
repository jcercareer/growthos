# 🚀 Growth OS Deployment Guide

## Repository
**GitHub:** https://github.com/jcercareer/growthos  
**Branch:** main  
**Latest Commit:** 2858ea4

---

## 📋 Deployment Checklist

### Pre-Deployment
- [x] Code pushed to GitHub
- [x] Backend builds successfully
- [x] Frontend builds successfully (except minor error page warnings)
- [x] Authentication system implemented
- [ ] Generate admin access key
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Test in production

---

## 1️⃣ DEPLOY BACKEND (Render)

### A. Create New Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account (if not already connected)
4. Select repository: **`jcercareer/growthos`**

### B. Configure Service

**Basic Settings:**
- **Name:** `growthos-api` (or your preferred name)
- **Region:** Oregon (US West) or closest to you
- **Branch:** `main`
- **Root Directory:** leave blank (monorepo auto-detected)
- **Runtime:** Node
- **Build Command:**
  ```bash
  pnpm install && pnpm --filter backend build
  ```
- **Start Command:**
  ```bash
  node apps/backend/dist/index.js
  ```

**Instance Type:**
- Free tier is fine for now
- Can upgrade to Starter ($7/month) for better performance

### C. Environment Variables

Click **"Advanced"** and add these environment variables:

```bash
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://slnomadjemgakrdaqnlq.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFhYmFzZSIsInJlZiI6InNsbm9tYWRqZW1nYWtyZGFxbmxxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYyNjczMiwiZXhwIjoyMDgwMjAyNzMyfQ.AM_rL3IrYPOJt_5sgpMTRfQ9TIKUcwFVGiR3cyGil0Y
OPENAI_API_KEY=<your-openai-key>
```

**Note:** PORT is automatically set by Render, but including it doesn't hurt.

### D. Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone the repo
   - Run build command
   - Start the service
3. Wait 3-5 minutes for first deploy
4. Copy the URL (e.g., `https://growthos-api.onrender.com`)

### E. Test Backend

```bash
curl https://your-render-url.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-02T...",
  "service": "growth-os-backend"
}
```

---

## 2️⃣ DEPLOY FRONTEND (Vercel)

### A. Generate Access Key

First, generate a strong access key for authentication:

```bash
openssl rand -base64 32
```

**Save this key!** You'll need it to:
- Add to Vercel environment variables
- Share with JCER team to log in

Example key: `jf83HFh3-98fh2h9-FH823hf2hb-xK92hfH3`

### B. Import Project

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select: **`jcercareer/growthos`**
4. Click **"Import"**

### C. Configure Project

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `apps/frontend` (click "Edit" and set this)

**Build Settings:**
- **Build Command:**
  ```bash
  cd ../.. && pnpm install && pnpm --filter frontend build
  ```
- **Output Directory:** `.next` (auto-detected)
- **Install Command:**
  ```bash
  pnpm install
  ```

### D. Environment Variables

Add these in Vercel project settings:

```bash
# Backend API URL (from Render deployment)
NEXT_PUBLIC_BACKEND_URL=https://your-render-url.onrender.com

# Admin Access Key (the one you generated above)
ADMIN_ACCESS_KEY=your-generated-access-key-here
```

**Important:** Set these for **Production**, **Preview**, and **Development** environments.

### E. Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Build the frontend
   - Deploy to CDN
3. Wait 2-3 minutes
4. Get your URL (e.g., `https://growthos.vercel.app`)

### F. Custom Domain (Optional)

To use `growth.jcergroup.com`:

1. Go to Vercel project → **Settings** → **Domains**
2. Add domain: `growth.jcergroup.com`
3. Add DNS records in your domain provider:
   - **Type:** CNAME
   - **Name:** growth
   - **Value:** cname.vercel-dns.com

---

## 3️⃣ POST-DEPLOYMENT TESTING

### A. Test Authentication

1. Visit your Vercel URL
2. Should redirect to `/auth/login`
3. Enter your access key
4. Should redirect to `/personas`
5. Test logout button

### B. Test Backend Connection

1. Go to `/personas` page
2. Select "CareerScaleUp" and "Job Seeker"
3. Click "Generate Persona"
4. Should call backend and generate persona

### C. Test All Pages

- [ ] `/` - Home
- [ ] `/personas` - Persona generation
- [ ] `/messaging` - Messaging generation
- [ ] `/scripts` - Script generation
- [ ] `/blogs` - Blog outline generation
- [ ] `/social` - Social analytics
- [ ] `/validate` - Global validation

---

## 4️⃣ SHARE ACCESS WITH TEAM

### A. Share URLs

**Production App:** `https://growth.jcergroup.com` (or your Vercel URL)  
**Backend API:** `https://your-render-url.onrender.com`

### B. Share Access Key

Share the `ADMIN_ACCESS_KEY` securely with JCER team:
- Store in password manager (1Password, LastPass)
- Send via encrypted channel (Signal, encrypted email)
- **Never commit to GitHub or share in public channels**

### C. Team Login Instructions

1. Visit `growth.jcergroup.com`
2. Enter the shared access key
3. Session lasts 8 hours
4. Use logout button when done

---

## 🔧 Troubleshooting

### Backend Issues

**Build fails:**
```bash
# Check build logs in Render dashboard
# Common issues: missing dependencies, wrong Node version
```

**API returns 500 errors:**
- Check environment variables are set correctly
- Verify Supabase credentials
- Check OpenAI API key is valid

**Health check fails:**
- Backend might still be starting (wait 1-2 minutes)
- Check logs in Render dashboard

### Frontend Issues

**Build fails on error pages:**
- This is a known issue, won't affect production
- Error pages work at runtime

**"Invalid access key":**
- Verify `ADMIN_ACCESS_KEY` is set in Vercel
- Check for typos or extra spaces
- Regenerate key if needed

**Can't connect to backend:**
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Check backend is deployed and healthy
- Test backend health endpoint directly

**Redirect loop:**
- Clear browser cookies
- Check middleware configuration
- Verify `/auth/login` is accessible

---

## 📊 Monitoring

### Render (Backend)
- **Dashboard:** https://dashboard.render.com
- View logs, metrics, and deploys
- Free tier has some cold starts (first request may be slow)

### Vercel (Frontend)
- **Dashboard:** https://vercel.com/dashboard
- View analytics, logs, and performance
- Check function invocations

---

## 🔄 Updating After Deployment

### Push updates:
```bash
git add .
git commit -m "Your update message"
git push
```

### Auto-deploys:
- **Render:** Auto-deploys on push to main branch
- **Vercel:** Auto-deploys on push to main branch

### Manual redeploys:
- **Render:** Click "Manual Deploy" → "Deploy latest commit"
- **Vercel:** Click "Redeploy" in deployments tab

---

## 🎉 Success Checklist

- [ ] Backend deployed to Render
- [ ] Backend health check returns OK
- [ ] Frontend deployed to Vercel
- [ ] Login page accessible
- [ ] Can log in with access key
- [ ] Can generate personas
- [ ] All pages load correctly
- [ ] Logout works
- [ ] Team has access key
- [ ] Custom domain configured (if applicable)

---

## 📞 Support

**Issues with deployment?**
- Check logs in Render/Vercel dashboards
- Review environment variables
- Test backend health endpoint
- Clear browser cache/cookies

**Need to rotate access key?**
1. Generate new key
2. Update `ADMIN_ACCESS_KEY` in Vercel
3. Share new key with team
4. All users will need to log in again

