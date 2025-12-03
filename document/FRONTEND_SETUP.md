# Frontend Setup - Quick Start

## Required: Create Environment Variable File

The `.env.local` file is gitignored for security. You need to create it manually.

### Create the file:

```bash
# From the project root
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:4000" > apps/frontend/.env.local
```

Or create `apps/frontend/.env.local` manually with this content:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

## Restart Dev Servers

After creating the `.env.local` file, restart the dev servers:

```bash
# Stop current servers (Ctrl+C in terminal)
# Then restart:
pnpm dev
```

Both servers will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

## Test the Application

### Complete Workflow Test

1. **Generate a Persona** (http://localhost:3000/personas)
   - Select "CareerScaleUp"
   - Add seed notes: "Focus on entry-level job seekers"
   - Click "Generate Persona"
   - Wait 5-10 seconds
   - ✅ Should display complete persona with pain points, goals, triggers

2. **Generate Messaging** (http://localhost:3000/messaging)
   - Select the persona you just created
   - Click "Generate Messaging"
   - Wait 3-5 seconds
   - ✅ Should display headline, emotional hook, elevator pitch, viral taglines

3. **Generate Script** (http://localhost:3000/scripts)
   - Select your persona
   - Select the messaging you just created
   - Choose "TikTok"
   - Click "Generate Script"
   - Wait 5-10 seconds
   - ✅ Should display formatted script with hook, body, CTA, and notes

4. **Generate Blog Outline** (http://localhost:3000/blogs)
   - Select your persona
   - Select your messaging
   - Click "Generate Blog Outline"
   - Wait 10-15 seconds
   - ✅ Should display title, sections with bullets, SEO keywords

## Troubleshooting

### Error: "Failed to fetch" or Network Error

**Problem**: Frontend can't reach backend

**Solution**:
1. Verify backend is running on port 4000
2. Check `.env.local` exists and has correct URL
3. Restart frontend: `pnpm dev`
4. Check browser console for CORS errors

### Error: "No personas found"

**Problem**: No personas in database yet

**Solution**:
1. Go to `/personas` page first
2. Generate at least one persona
3. Then visit `/messaging`, `/scripts`, or `/blogs`

### Error: "No messaging found for this persona"

**Problem**: Selected persona has no messaging generated yet

**Solution**:
1. Go to `/messaging` page
2. Select the persona
3. Generate messaging first
4. Then use it in `/scripts` or `/blogs`

### Blank page or loading forever

**Problem**: JavaScript error or API timeout

**Solution**:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify backend logs for errors

## Frontend Features

### All Pages Have:
- ✅ Loading states (buttons show "Generating...")
- ✅ Error handling (red alert boxes)
- ✅ Empty states (helpful messages when no data)
- ✅ Clean UI (cards, proper spacing)
- ✅ Type safety (full TypeScript)

### Page-Specific Features:

**Personas** (`/personas`)
- Product dropdown
- Optional seed notes textarea
- Displays: name, age, description, pain points, goals, buying triggers

**Messaging** (`/messaging`)
- Persona dropdown (loads all personas)
- Shows selected persona context
- Displays: headline, emotional hook, elevator pitch, viral taglines

**Scripts** (`/scripts`)
- Persona dropdown
- Messaging dropdown (dynamically loads based on persona)
- Platform selection (TikTok/Reels/Shorts)
- Displays: formatted script in monospace, production notes

**Blogs** (`/blogs`)
- Persona dropdown
- Messaging dropdown (dynamically loads)
- Displays: title, meta description, numbered sections with bullets, SEO keywords

## API Costs

Using OpenAI `gpt-4o-mini`:
- Persona: ~$0.01
- Messaging: ~$0.005
- Script: ~$0.01
- Blog: ~$0.02
- **Total workflow**: ~$0.045 (4.5 cents)

## Next Steps

Once everything works:
1. Try generating content for Zevaux product
2. Generate multiple personas
3. Create different messaging angles for same persona
4. Try all 3 script platforms
5. Compare blog outlines for different messaging

## Production Deployment

For production:
1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Update `NEXT_PUBLIC_BACKEND_URL` to production backend URL
4. Set environment variables in Vercel dashboard
5. Both should work seamlessly!

