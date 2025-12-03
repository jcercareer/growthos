# Brand & Tags Feature - Quick Summary

## ✅ Complete!

Social analytics now supports JCER master accounts, multiple brands, and flexible tagging.

## What's New

### 1. Brand Support (`social_accounts`)

**Database:**
- Added `brand` column: `JCER` | `CareerScaleUp` | `Zevaux`
- Default: `JCER`

**Use:**
- Distinguish master accounts from product accounts
- Filter analytics by brand
- Track brand-specific performance

### 2. Tags Support (`social_posts`)

**Database:**
- Added `tags` column: Array of strings
- Default: Empty array `[]`

**Use:**
- Flexible categorization: `['launch', 'tutorial', 'promo']`
- Campaign tracking: `['black-friday-2025', 'sale']`
- Content types: `['educational', 'case-study']`

## Quick Examples

### Create JCER Master Account

```
Go to /social → Accounts tab
Platform: LinkedIn
Brand: JCER (Master)
Handle: @jcer-llc
Label: JCER Company LinkedIn
→ Submit
```

### Create Tagged Post

```
Go to /social → Posts tab
Account: Select any
Product: CareerScaleUp
Tags: launch, announcement, careerscaleup
→ Submit
```

### Filter by Brand

```
Go to /social → Metrics Dashboard
Brand filter: JCER
→ See only JCER master account analytics
```

### Filter by Tag

```
Go to /social → Metrics Dashboard
Tag filter: launch
→ See all posts tagged "launch"
```

## Migration Required

**Run this SQL in Supabase:**
```sql
-- File: supabase/migrations/005_add_brand_and_tags.sql
```

**Steps:**
1. Go to Supabase dashboard → SQL Editor
2. Copy/paste the migration file
3. Click Run
4. Verify: `SELECT brand FROM social_accounts LIMIT 1;`

## UI Updates

**Accounts Tab:**
- ✅ Brand select added to form (JCER / CareerScaleUp / Zevaux)
- ✅ Brand badge displayed on accounts

**Posts Tab:**
- ✅ Tags input added (comma-separated)
- ✅ Helper text for format

**Metrics Dashboard:**
- ✅ Brand filter added (dropdown)
- ✅ Tag filter added (text input)
- ✅ Filters apply to all analytics

## API Updates

**Endpoints:**
```
POST /api/social/accounts - Now accepts "brand"
GET  /api/social/accounts?brand=JCER - Filter by brand
POST /api/social/posts - Now accepts "tags" array
GET  /api/social/posts?tag=launch - Filter by tag
```

## Use Cases

### 1. JCER Master Presence
**Track company-wide social content separate from products**

```
Brand: JCER
→ Company announcements, hiring, culture
```

### 2. Product Accounts
**Track each product's social performance**

```
Brand: CareerScaleUp → Career content
Brand: Zevaux → Automation content
```

### 3. Campaign Tracking
**Tag all campaign posts, filter by tag**

```
Tags: ['summer-sale', 'promo', '2025']
Dashboard → Tag filter: "summer-sale"
→ See campaign performance
```

### 4. Content Types
**Track performance by content type**

```
Educational: ['tutorial', 'how-to', 'educational']
Promotional: ['promo', 'sale', 'discount']
Social Proof: ['testimonial', 'case-study', 'success']
```

## Tag Best Practices

**Recommended Format:**
- Lowercase
- Use hyphens: `product-launch` not `product launch`
- Keep short: `tutorial` not `step-by-step-tutorial-video`
- 3-5 tags per post
- Be consistent

**Example Tags:**
```
Products: jcer, careerscaleup, zevaux
Types: educational, promo, testimonial, announcement
Campaigns: launch, webinar, sale, black-friday
Topics: resume-tips, ai-tools, automation
```

## Backend Changes

**Files Modified (8):**
- Migration: `005_add_brand_and_tags.sql`
- Types: `packages/shared/src/index.ts`
- Schemas: `apps/backend/src/aiSchemas.ts`
- Routes: `socialAccountsRoutes.ts`, `socialPostsRoutes.ts`
- Repos: `socialAccounts.ts`, `socialPosts.ts`
- Frontend: `api.ts`, `social/page.tsx`

**No breaking changes - backward compatible!**

## Verification

- ✅ No linter errors
- ✅ Backend compiled
- ✅ Frontend compiled
- ✅ All existing features work
- ✅ New fields optional/defaulted

## Testing

### 1. Test Brand

```
1. Add account with Brand: JCER
2. Add account with Brand: CareerScaleUp
3. Go to Metrics Dashboard
4. Set Brand filter: JCER
5. Verify only JCER accounts shown
```

### 2. Test Tags

```
1. Log post with Tags: "launch, test"
2. Log post with Tags: "tutorial"
3. Go to Metrics Dashboard
4. Set Tag filter: "launch"
5. Verify only "launch" posts shown
```

## 🎉 Result

**You can now:**
- ✅ Separate JCER master accounts from product accounts
- ✅ Filter analytics by brand
- ✅ Tag posts flexibly for campaigns/types
- ✅ Filter analytics by tag
- ✅ Track cross-brand campaigns
- ✅ Analyze content by type

**Navigate to `http://localhost:3000/social` and try it!** 🚀

---

**See `BRAND_AND_TAGS_COMPLETE.md` for detailed documentation.**

