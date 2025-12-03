# Supabase Setup Guide

## Step 1: Run the Migration

1. Go to your Supabase dashboard: https://slnomadjemgakrdaqnlq.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter`

This will create all tables:
- `personas`
- `messaging`
- `scripts`
- `blog_outlines`

## Step 2: Get Your Service Role Key

1. In Supabase dashboard, go to **Settings** > **API**
2. Find the **Service Role Key** (NOT the anon key)
3. Copy this key - it's a long JWT token starting with `eyJ...`

⚠️ **Important**: The service role key bypasses Row Level Security (RLS) and should only be used on the backend. Never expose it in frontend code.

## Step 3: Configure Backend Environment

Create `apps/backend/.env` with the following:

```bash
PORT=4000
NODE_ENV=development

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Supabase
SUPABASE_URL=https://slnomadjemgakrdaqnlq.supabase.co
SUPABASE_SERVICE_KEY=<paste_your_service_role_key_here>
```

## Step 4: Test the Connection

After running `pnpm install` and `pnpm dev`, you should see:

```
🚀 Growth OS Backend running on http://localhost:4000
📊 Health check: http://localhost:4000/health
```

Test the health check:
```bash
curl http://localhost:4000/health
```

## Database Schema Overview

### Personas Table
- Stores customer personas for CareerScaleUp and Zevaux
- Contains demographic info, pain points, goals, and buying triggers
- Product field is constrained to 'CareerScaleUp' or 'Zevaux'

### Messaging Table
- Stores value messaging tied to specific personas
- Contains headlines, emotional hooks, elevator pitches, and viral taglines
- Foreign key to personas (cascades on delete)

### Scripts Table
- Stores video scripts for content creation
- Linked to both personas and messaging (optional)
- Contains script type, content, and notes

### Blog Outlines Table
- Stores structured blog post outlines
- Linked to personas and messaging (optional)
- JSONB outline field for flexible structure

## Repository Functions Available

All repository functions are in `apps/backend/src/repositories/`:

### Personas
- `createPersona(input)` - Create a new persona
- `listPersonas(product?)` - List all personas, optionally filter by product
- `getPersonaById(id)` - Get a single persona

### Messaging
- `createMessaging(input)` - Create new messaging
- `listMessagingForPersona(personaId)` - Get all messaging for a persona
- `getMessagingById(id)` - Get a single messaging entry

### Scripts
- `createScript(input)` - Create a new script
- `listScriptsForPersona(personaId)` - Get all scripts for a persona
- `getScriptById(id)` - Get a single script

### Blog Outlines
- `createBlogOutline(input)` - Create a new blog outline
- `listBlogOutlinesForPersona(personaId)` - Get all outlines for a persona
- `getBlogOutlineById(id)` - Get a single outline

## TypeScript Types

All types are defined in `packages/shared/src/index.ts` and can be imported in both frontend and backend:

```typescript
import type { 
  Persona, 
  CreatePersonaInput,
  Messaging,
  CreateMessagingInput,
  // etc...
} from '@growth-os/shared';
```

## Verification

After migration, verify tables were created:

1. In Supabase dashboard, go to **Table Editor**
2. You should see all 4 tables listed
3. Click on each to verify the schema matches

You can also verify in SQL Editor:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check a table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'personas';
```

