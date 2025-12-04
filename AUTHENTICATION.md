# Authentication Setup for Growth OS

## Overview

Growth OS now includes access key-based authentication to protect the entire application.

### How It Works

1. User visits `growth.jcergroup.com`
2. If no auth cookie exists → redirect to `/auth/login`
3. User enters the secret access key
4. Backend validates against `ADMIN_ACCESS_KEY` environment variable
5. If valid → sets secure 8-hour session cookie → redirects to app
6. Only JCER team members with the access key can enter

---

## Setup Instructions

### 1. Generate Access Key

Create a strong random access key. Use a password generator or run:

```bash
openssl rand -base64 32
```

Example: `jf83HFh3-98fh2h9-FH823hf2hb-xK92hfH3`

### 2. Add to Environment Variables

**Local Development (.env.local):**
```env
ADMIN_ACCESS_KEY=your-strong-random-key-here
```

**Vercel Production:**
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - **Name:** `ADMIN_ACCESS_KEY`
   - **Value:** Your generated access key
   - **Environment:** Production, Preview, Development

### 3. Share the Key Securely

- Store the key in your password manager (1Password, LastPass, etc.)
- Share with JCER team members through secure channels
- **Never commit the key to GitHub**

---

## Features

### ✅ Secure Session Management
- HTTP-only cookies (not accessible via JavaScript)
- Secure flag enabled in production
- 8-hour session duration
- Automatic expiration

### ✅ Protected Routes
- All app pages require authentication
- Middleware intercepts unauthorized requests
- Automatic redirect to login with callback URL
- After login, users return to their intended page

### ✅ Clean UX
- Modern login page matching Growth OS design
- Password field (hidden input)
- Error handling
- Loading states
- Logout button in navbar

---

## Files Created

```
apps/frontend/src/
├── app/
│   ├── api/
│   │   ├── login/route.ts          # Login API endpoint
│   │   └── logout/route.ts         # Logout API endpoint
│   └── auth/
│       └── login/
│           ├── page.tsx             # Login page (server component)
│           └── LoginClient.tsx      # Login UI (client component)
├── components/
│   └── LogoutButton.tsx             # Logout button component
└── middleware.ts                    # Auth middleware (protects all routes)
```

---

## Usage

### For Users

1. **Visit Growth OS:** `growth.jcergroup.com`
2. **Enter Access Key:** Use the key shared by the JCER team
3. **Click "Sign in":** Redirects to the app
4. **Session lasts 8 hours:** After that, you'll need to log in again
5. **Logout:** Click "Logout" button in navbar when done

### For Admins

**Rotating the Access Key:**
1. Generate a new key
2. Update `ADMIN_ACCESS_KEY` in Vercel environment variables
3. Share new key with team
4. All users will need to log in again with the new key

**Viewing Active Sessions:**
- Sessions are stored as cookies on user browsers
- No server-side session tracking (stateless)
- Sessions expire automatically after 8 hours

---

## Security Notes

- ✅ **HTTP-only cookies** prevent XSS attacks
- ✅ **Secure flag** ensures cookies only sent over HTTPS in production
- ✅ **SameSite: lax** protects against CSRF attacks
- ✅ **No server-side session storage** = no database breach risk
- ✅ **Access key never exposed** in client-side code
- ⚠️ **Single shared key** = if leaked, all users affected (rotate immediately)
- ⚠️ **No user accounts** = no per-user access control (suitable for small internal teams)

---

## Troubleshooting

**"Invalid access key" error:**
- Check the key was copied correctly (no extra spaces)
- Verify `ADMIN_ACCESS_KEY` is set in Vercel
- Check key hasn't been rotated without notification

**Redirect loop:**
- Clear browser cookies for the domain
- Check middleware isn't blocking `/auth/login` path
- Verify `/api/login` is in PUBLIC_PATHS

**Session expires too quickly:**
- Adjust `maxAge` in `apps/frontend/src/app/api/login/route.ts`
- Current setting: `60 * 60 * 8` = 8 hours

---

## Testing Locally

1. Set `ADMIN_ACCESS_KEY` in `apps/frontend/.env.local`
2. Run the dev server: `pnpm dev`
3. Visit `http://localhost:3000`
4. You'll be redirected to `/auth/login`
5. Enter your access key
6. You should be logged in and redirected to the app

---

## Deployment Checklist

- [ ] Generate strong random access key
- [ ] Add `ADMIN_ACCESS_KEY` to Vercel environment variables
- [ ] Test login flow in production
- [ ] Share access key with JCER team securely
- [ ] Store key in team password manager
- [ ] Document key rotation process for team

