# Brand & Tags Feature - COMPLETE ✅

## Summary

Extended social analytics to support JCER master accounts, multiple brands, and flexible tagging system.

## What Was Added

### 1. Brand Support

**Database:**
- Added `brand` column to `social_accounts` table
- Options: `JCER` (master), `CareerScaleUp`, `Zevaux`
- Indexed for fast filtering
- Default value: `JCER`

**Use Case:**
- Distinguish between JCER master accounts (company-wide) and product-specific accounts
- Track which brand owns each social media account
- Filter analytics by brand

### 2. Tags Support

**Database:**
- Added `tags` column to `social_posts` table
- Array of strings (`TEXT[]`)
- GIN index for fast array searches
- Default value: `{}` (empty array)

**Use Case:**
- Flexible categorization: `['launch', 'announcement', 'tutorial']`
- Cross-product campaigns: `['jcer', 'careerscaleup', 'product-launch']`
- Content types: `['educational', 'promotional', 'case-study']`
- Track special campaigns or initiatives

## Database Migration

**File:** `supabase/migrations/005_add_brand_and_tags.sql`

**Changes:**
```sql
-- Add brand to social_accounts
ALTER TABLE social_accounts
ADD COLUMN brand TEXT NOT NULL DEFAULT 'JCER'
CHECK (brand IN ('JCER', 'CareerScaleUp', 'Zevaux'));

CREATE INDEX idx_social_accounts_brand ON social_accounts(brand);

-- Add tags to social_posts
ALTER TABLE social_posts
ADD COLUMN tags TEXT[] DEFAULT '{}';

CREATE INDEX idx_social_posts_tags ON social_posts USING GIN(tags);
```

## Backend Updates

### Types & Schemas

**Added Brand Type:**
```typescript
export type Brand = 'JCER' | 'CareerScaleUp' | 'Zevaux';

export interface SocialAccount extends BaseEntity {
  // ...existing fields
  brand: Brand;
}

export interface SocialPost extends BaseEntity {
  // ...existing fields
  tags: string[];
}
```

**Zod Schemas:**
- Updated `SocialAccountSchema` to include `brand` enum
- Updated `SocialPostSchema` to include `tags` array

### API Endpoints

**POST `/api/social/accounts`**
- Now accepts `brand` field in request body
- Required field (defaults to 'JCER')
- Validated with Zod

**GET `/api/social/accounts`**
- Now supports `?brand=JCER` query parameter
- Can filter by platform AND brand

**POST `/api/social/posts`**
- Now accepts `tags` array in request body
- Optional field (defaults to empty array)
- Validates each tag is 1-50 chars

**GET `/api/social/posts`**
- Now supports `?tag=launch` query parameter
- Uses Postgres array contains operator for searching

### Repository Functions

**Updated:**
```typescript
// Can filter by platform AND brand
listSocialAccounts(platform?, brand?) 

// Can filter by product, audience, account, AND tag
listSocialPosts(filters: {
  product?, 
  audienceType?, 
  socialAccountId?, 
  tag?
})
```

## Frontend Updates

### Accounts Tab

**Add Account Form:**
- Added "Brand" select field
- Options: JCER (Master), CareerScaleUp, Zevaux
- Positioned between Platform and Handle
- Required field with default 'JCER'

**Accounts List:**
- Now displays brand badge next to account label
- Color-coded badge (blue background)

### Posts Tab

**Log Post Form:**
- Added "Tags (Optional)" text input
- Comma-separated input format
- Helper text: "Separate multiple tags with commas"
- Positioned after Posted At field
- Parses comma-separated input into array

**Example Input:**
```
launch, announcement, careerscaleup
→ ["launch", "announcement", "careerscaleup"]
```

### Metrics Dashboard Tab

**Filters:**
- Added "Brand" select filter (All / JCER / CareerScaleUp / Zevaux)
- Added "Tag" text input filter (free text search)
- Changed grid from 4 columns to 3 columns (2 rows)
- Filters apply to all KPIs, charts, and tables

**Filter Logic:**
- Brand: Exact match on account's brand
- Tag: Case-insensitive contains search (matches any tag)

## Use Cases

### 1. JCER Master Accounts

**Scenario:** Company-wide social presence

```bash
# Create JCER master accounts
POST /api/social/accounts
{
  "platform": "linkedin",
  "handle": "@jcer-llc",
  "brand": "JCER",
  "label": "JCER Company LinkedIn"
}

# Filter analytics by JCER brand
Dashboard → Brand filter: JCER
→ See only company-wide content performance
```

### 2. Product-Specific Accounts

**Scenario:** Separate accounts for each product

```bash
# CareerScaleUp TikTok
POST /api/social/accounts
{
  "platform": "tiktok",
  "brand": "CareerScaleUp",
  "handle": "@careerscaleup",
  "label": "CareerScaleUp TikTok"
}

# Zevaux YouTube
POST /api/social/accounts
{
  "platform": "youtube",
  "brand": "Zevaux",
  "handle": "@zevaux",
  "label": "Zevaux YouTube Channel"
}
```

### 3. Cross-Brand Campaigns

**Scenario:** Launch campaign across all brands

```bash
# JCER announcement post
POST /api/social/posts
{
  "product": "CareerScaleUp",
  "tags": ["launch", "jcer", "announcement"]
}

# CareerScaleUp launch post
POST /api/social/posts
{
  "product": "CareerScaleUp", 
  "tags": ["launch", "careerscaleup", "feature-release"]
}

# Zevaux launch post
POST /api/social/posts
{
  "product": "Zevaux",
  "tags": ["launch", "zevaux", "new-feature"]
}

# Filter by "launch" tag
Dashboard → Tag filter: "launch"
→ See all launch-related content performance
```

### 4. Content Type Tracking

**Scenario:** Track performance by content type

```bash
# Educational posts
tags: ["educational", "tutorial", "how-to"]

# Promotional posts
tags: ["promo", "discount", "offer"]

# Case study posts
tags: ["case-study", "success-story", "testimonial"]

# Filter by type
Dashboard → Tag filter: "tutorial"
→ See how educational content performs
```

### 5. Campaign Tracking

**Scenario:** Track specific marketing campaigns

```bash
# Black Friday campaign
tags: ["black-friday-2025", "sale", "limited-time"]

# Webinar series
tags: ["webinar", "live-event", "q4-series"]

# Product launch
tags: ["v2-launch", "new-features", "announcement"]

# Filter by campaign
Dashboard → Tag filter: "black-friday-2025"
→ See campaign performance
```

## Example Workflows

### Workflow 1: JCER Master Account Setup

```
1. Go to /social → Accounts tab
2. Click "Add Account"
3. Fill form:
   Platform: LinkedIn
   Brand: JCER (Master)
   Handle: @jcer-llc
   Profile URL: https://linkedin.com/company/jcer-llc
   Label: JCER Company LinkedIn
4. Submit
5. Account appears with JCER badge
```

### Workflow 2: Tagged Post

```
1. Go to /social → Posts tab
2. Fill form:
   Account: JCER Company LinkedIn
   Product: CareerScaleUp
   Audience: Job Seeker
   Source Type: Other
   URL: https://...
   Posted At: Today
   Tags: launch, careerscaleup, announcement
3. Submit
4. Post logged with 3 tags
```

### Workflow 3: Filter Analytics by Brand

```
1. Go to /social → Metrics Dashboard
2. Set Brand filter: CareerScaleUp
3. All KPIs update to show only CareerScaleUp accounts
4. Top posts table shows only CareerScaleUp content
5. Performance summary reflects filtered data
```

### Workflow 4: Track Campaign Performance

```
1. Tag all campaign posts with "summer-sale"
2. Go to Metrics Dashboard
3. Set Tag filter: "summer-sale"
4. See total views, engagement for campaign
5. Identify best performing campaign posts
```

## API Examples

### Create Account with Brand

```bash
curl -X POST http://localhost:4000/api/social/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "linkedin",
    "brand": "JCER",
    "handle": "@jcer-llc",
    "profileUrl": "https://linkedin.com/company/jcer-llc",
    "label": "JCER Company LinkedIn"
  }'
```

### Create Post with Tags

```bash
curl -X POST http://localhost:4000/api/social/posts \
  -H "Content-Type: application/json" \
  -d '{
    "socialAccountId": "uuid",
    "product": "CareerScaleUp",
    "audienceType": "jobseeker",
    "sourceType": "other",
    "url": "https://...",
    "postedAt": "2025-12-02T10:00:00Z",
    "tags": ["launch", "announcement", "careerscaleup"]
  }'
```

### Filter by Brand

```bash
# Get all JCER accounts
curl "http://localhost:4000/api/social/accounts?brand=JCER"

# Get CareerScaleUp LinkedIn accounts
curl "http://localhost:4000/api/social/accounts?platform=linkedin&brand=CareerScaleUp"
```

### Filter by Tag

```bash
# Get all posts tagged "launch"
curl "http://localhost:4000/api/social/posts?tag=launch"

# Get CareerScaleUp posts tagged "tutorial"
curl "http://localhost:4000/api/social/posts?product=CareerScaleUp&tag=tutorial"
```

## Tag Best Practices

### Recommended Tag Categories

**1. Product Tags:**
- `jcer`, `careerscaleup`, `zevaux`

**2. Content Type:**
- `educational`, `promotional`, `testimonial`, `case-study`, `tutorial`, `announcement`

**3. Campaign Tags:**
- `launch`, `webinar`, `sale`, `black-friday`, `q4-campaign`

**4. Audience Tags:**
- `for-job-seekers`, `for-recruiters`, `for-smb-owners`

**5. Topic Tags:**
- `resume-tips`, `interview-prep`, `ai-tools`, `automation`, `productivity`

### Tag Naming Conventions

- Use lowercase
- Use hyphens for multi-word tags: `product-launch` not `product launch`
- Be consistent: always `careerscaleup` not `career-scale-up`
- Keep tags short and descriptive
- Limit to 3-5 tags per post

## Database Schema

### social_accounts

```sql
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  platform TEXT NOT NULL,
  handle TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  label TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'JCER',  -- NEW
  CHECK (brand IN ('JCER', 'CareerScaleUp', 'Zevaux'))
);

CREATE INDEX idx_social_accounts_brand ON social_accounts(brand);
```

### social_posts

```sql
CREATE TABLE social_posts (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  social_account_id UUID NOT NULL,
  product TEXT NOT NULL,
  audience_type TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id UUID,
  platform_post_id TEXT,
  url TEXT NOT NULL,
  posted_at TIMESTAMPTZ NOT NULL,
  tags TEXT[] DEFAULT '{}',  -- NEW
  FOREIGN KEY (social_account_id) REFERENCES social_accounts(id)
);

CREATE INDEX idx_social_posts_tags ON social_posts USING GIN(tags);
```

## Files Modified

**Database (1 new file):**
- ✅ `supabase/migrations/005_add_brand_and_tags.sql`

**Backend (6 files):**
- ✅ `packages/shared/src/index.ts` - Added Brand type, updated interfaces
- ✅ `apps/backend/src/aiSchemas.ts` - Updated Zod schemas
- ✅ `apps/backend/src/routes/socialAccountsRoutes.ts` - Added brand support
- ✅ `apps/backend/src/routes/socialPostsRoutes.ts` - Added tags support
- ✅ `apps/backend/src/repositories/socialAccounts.ts` - Added brand filtering
- ✅ `apps/backend/src/repositories/socialPosts.ts` - Added tag filtering

**Frontend (2 files):**
- ✅ `apps/frontend/src/lib/api.ts` - Updated API functions
- ✅ `apps/frontend/src/app/social/page.tsx` - Updated all 3 tabs

## Verification Checklist

- ✅ Database migration created
- ✅ Brand column added with CHECK constraint
- ✅ Tags column added with array type
- ✅ Indexes created for performance
- ✅ Backend types updated
- ✅ Zod schemas updated
- ✅ API endpoints accept new fields
- ✅ Repository functions support filtering
- ✅ Frontend forms include new fields
- ✅ Frontend filters include brand and tag
- ✅ No linter errors
- ✅ Backward compatible

## Migration Steps

### 1. Run Database Migration

```bash
# In Supabase dashboard → SQL Editor
# Copy/paste: supabase/migrations/005_add_brand_and_tags.sql
# Click Run
```

### 2. Verify Migration

```sql
-- Check brand column exists
SELECT brand FROM social_accounts LIMIT 1;

-- Check tags column exists  
SELECT tags FROM social_posts LIMIT 1;

-- Check indexes exist
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('social_accounts', 'social_posts');
```

### 3. Test in Frontend

```
1. Go to http://localhost:3000/social
2. Accounts tab: See brand select
3. Posts tab: See tags input
4. Metrics tab: See brand and tag filters
```

## Backward Compatibility

**Existing Accounts:**
- Will have `brand = 'JCER'` (default)
- No action required

**Existing Posts:**
- Will have `tags = []` (empty array)
- No action required

**Existing API Calls:**
- Without brand: Defaults to 'JCER'
- Without tags: Defaults to empty array
- All existing functionality preserved

## 🎉 Result

**Social analytics now supports:**
- ✅ JCER master accounts vs product-specific accounts
- ✅ Brand-level filtering and analytics
- ✅ Flexible tagging for posts
- ✅ Tag-based filtering and campaign tracking
- ✅ Cross-brand campaign management
- ✅ Content type and campaign performance analysis

**Navigate to `http://localhost:3000/social` to start using brand and tags!** 🚀

