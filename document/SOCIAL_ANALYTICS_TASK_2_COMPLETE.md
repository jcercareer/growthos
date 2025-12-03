# Task 2: Social Analytics REST API - COMPLETE ✅

## Summary

Created 6 REST endpoints for manual social analytics data entry with complete Zod validation, proper error handling, and comprehensive documentation.

## Endpoints Created

### Social Accounts (2 endpoints)

**1. POST `/api/social/accounts`** - Create social account
- Validates: platform, handle, profileUrl, label
- Returns: Created SocialAccount with UUID

**2. GET `/api/social/accounts`** - List social accounts
- Optional filter: `?platform=tiktok`
- Returns: Array of SocialAccount

### Social Posts (2 endpoints)

**3. POST `/api/social/posts`** - Record social post
- Validates: socialAccountId, product, audienceType, sourceType, url, postedAt
- Optional: sourceId, platformPostId
- Returns: Created SocialPost with UUID

**4. GET `/api/social/posts`** - List posts with filters
- Optional filters: `?product=CareerScaleUp&audienceType=jobseeker&accountId=uuid&dateFrom=ISO&dateTo=ISO`
- Returns: Filtered array of SocialPost

### Metrics (2 endpoints)

**5. POST `/api/social/posts/:postId/metrics`** - Record metrics snapshot
- Validates: postId (UUID), views, likes, comments, shares, saves
- Checks post exists (404 if not found)
- Returns: Created MetricsSnapshot with UUID

**6. GET `/api/social/posts/:postId/metrics`** - Get all metrics for post
- Validates: postId (UUID)
- Checks post exists (404 if not found)
- Returns: Array of MetricsSnapshot ordered by captured_at DESC

## Files Created

**Route Handlers (4 new files):**

1. **`apps/backend/src/routes/socialAccountsRoutes.ts`**
   - `createSocialAccountHandler` - POST /accounts
   - `listSocialAccountsHandler` - GET /accounts
   - Validates input with Zod
   - Maps camelCase → snake_case

2. **`apps/backend/src/routes/socialPostsRoutes.ts`**
   - `createSocialPostHandler` - POST /posts
   - `listSocialPostsHandler` - GET /posts with filters
   - Date range filtering (dateFrom, dateTo)
   - Validates input with Zod

3. **`apps/backend/src/routes/metricsRoutes.ts`**
   - `createMetricsSnapshotHandler` - POST /posts/:postId/metrics
   - `listMetricsForPostHandler` - GET /posts/:postId/metrics
   - Validates postId is UUID
   - Checks post exists before operations

4. **`apps/backend/src/routes/socialRouter.ts`**
   - Main router combining all routes
   - Mounted at `/api/social` in Express app

**Files Modified:**

- ✅ `apps/backend/src/index.ts` - Added `app.use('/api/social', socialRouter)`
- ✅ `supabase/migrations/003_add_social_analytics.sql` - Updated audience_type to support `smb_owner` and `other`
- ✅ `packages/shared/src/index.ts` - Updated AudienceType to include `smb_owner` and `other`
- ✅ `apps/backend/src/aiSchemas.ts` - Updated SocialPostSchema to include all audience types

**Documentation:**

- ✅ `SOCIAL_ANALYTICS_API.md` - Complete API reference with cURL examples

## Features Implemented

### ✅ Complete Zod Validation

**Input Schemas:**
- `CreateSocialAccountInputSchema` - Validates platform, handle, profileUrl, label
- `CreateSocialPostInputSchema` - Validates all post fields including ISO datetime
- `CreateMetricsSnapshotInputSchema` - Validates all metrics are integers ≥ 0
- `ListSocialPostsQuerySchema` - Validates query parameters

**Validation Features:**
- UUID validation for IDs
- URL validation for profile_url and post url
- Datetime validation (ISO 8601)
- Enum validation for platform, product, audience_type, source_type
- Integer validation for metrics (min 0)
- String length limits

### ✅ Proper HTTP Status Codes

- `200 OK` - GET requests successful
- `201 Created` - POST requests successful
- `400 Bad Request` - Zod validation failed
- `404 Not Found` - Post not found (metrics endpoints)
- `500 Internal Server Error` - Database/server errors

### ✅ Error Handling

**Zod Validation Errors:**
```json
{
  "success": false,
  "error": "Invalid input",
  "details": [...]
}
```

**Not Found Errors:**
```json
{
  "success": false,
  "error": "Social post not found"
}
```

**Server Errors:**
```json
{
  "success": false,
  "error": "Failed to create social post"
}
```

### ✅ Filtering & Queries

**Social Accounts:**
- Filter by platform: `?platform=tiktok`

**Social Posts:**
- Filter by product: `?product=CareerScaleUp`
- Filter by audience: `?audienceType=jobseeker`
- Filter by account: `?accountId=uuid`
- Filter by date range: `?dateFrom=ISO&dateTo=ISO`
- Combine multiple filters

### ✅ Data Mapping

- Converts camelCase (API) → snake_case (database)
- Handles nullable/optional fields properly
- Preserves timestamps and UUIDs

## Testing

### Verify Backend Running

```bash
curl http://localhost:4000/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2025-12-02T...",
  "service": "growth-os-backend"
}
```

### Test Social Accounts

```bash
# Create account
curl -X POST http://localhost:4000/api/social/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "tiktok",
    "handle": "@careerscaleup",
    "profileUrl": "https://tiktok.com/@careerscaleup",
    "label": "CareerScaleUp TikTok"
  }'

# List accounts
curl http://localhost:4000/api/social/accounts
```

### Test Social Posts

```bash
# Create post (use account ID from previous step)
curl -X POST http://localhost:4000/api/social/posts \
  -H "Content-Type: application/json" \
  -d '{
    "socialAccountId": "ACCOUNT_ID",
    "product": "CareerScaleUp",
    "audienceType": "jobseeker",
    "sourceType": "other",
    "url": "https://tiktok.com/@careerscaleup/video/123",
    "postedAt": "2025-12-02T10:00:00Z"
  }'

# List posts
curl http://localhost:4000/api/social/posts

# Filter by product
curl "http://localhost:4000/api/social/posts?product=CareerScaleUp"
```

### Test Metrics

```bash
# Record metrics (use post ID from previous step)
curl -X POST http://localhost:4000/api/social/posts/POST_ID/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "views": 15000,
    "likes": 450,
    "comments": 23,
    "shares": 89,
    "saves": 156
  }'

# Get metrics
curl http://localhost:4000/api/social/posts/POST_ID/metrics
```

## Complete Workflow

### 1. Create Social Account
```bash
POST /api/social/accounts
```
→ Returns `account.id`

### 2. Record Post
```bash
POST /api/social/posts
Body: { socialAccountId: account.id, ... }
```
→ Returns `post.id`

### 3. Take Metrics Snapshot (Day 1)
```bash
POST /api/social/posts/:postId/metrics
Body: { views: 1500, likes: 45, ... }
```

### 4. Take Metrics Snapshot (Day 7)
```bash
POST /api/social/posts/:postId/metrics
Body: { views: 15000, likes: 450, ... }
```

### 5. Analyze Growth
```bash
GET /api/social/posts/:postId/metrics
```
→ Returns array of snapshots (newest first)

### 6. Query Posts
```bash
GET /api/social/posts?product=CareerScaleUp&audienceType=jobseeker
```
→ Returns filtered posts

## API URL Patterns

### Base Patterns

```
/api/social/accounts          → Social accounts collection
/api/social/posts             → Social posts collection
/api/social/posts/:postId     → Specific post
/api/social/posts/:postId/metrics → Metrics for specific post
```

### Query Patterns

```
/api/social/accounts?platform=tiktok
/api/social/posts?product=CareerScaleUp
/api/social/posts?audienceType=jobseeker
/api/social/posts?accountId=uuid
/api/social/posts?dateFrom=2025-12-01T00:00:00Z&dateTo=2025-12-31T23:59:59Z
```

## Use Cases

### 1. Manual Post Tracking

**Scenario:** You post a TikTok video, manually record it in the system

```bash
# Step 1: Create account (once)
POST /api/social/accounts

# Step 2: Record each post
POST /api/social/posts

# Step 3: Manually check metrics daily and record
POST /api/social/posts/:postId/metrics
```

### 2. Content Performance Analysis

**Scenario:** Compare job seeker vs recruiter content

```bash
# Get all job seeker posts
GET /api/social/posts?audienceType=jobseeker

# Get all recruiter posts
GET /api/social/posts?audienceType=recruiter

# For each post, get latest metrics
GET /api/social/posts/:postId/metrics

# Compare engagement rates
```

### 3. Platform Optimization

**Scenario:** See which platform performs best

```bash
# Get all TikTok accounts
GET /api/social/accounts?platform=tiktok

# For each account, get all posts
GET /api/social/posts?accountId=uuid

# Analyze metrics for each post
GET /api/social/posts/:postId/metrics
```

### 4. Source Content ROI

**Scenario:** Track performance of content generated from scripts

```bash
# When creating post, include sourceId
POST /api/social/posts
Body: { sourceType: "script", sourceId: "script-uuid", ... }

# Later, query all posts from that script
GET /api/social/posts
# Filter results where source_id matches

# Sum up total engagement
```

## Audience Types Supported

| Type | Description | Example Use |
|------|-------------|-------------|
| `jobseeker` | Job seekers looking for careers | CareerScaleUp job search content |
| `recruiter` | Hiring managers, recruiters | CareerScaleUp recruiting tools |
| `smb_owner` | Small business owners | Zevaux automation content |
| `other` | Other audience segments | General marketing, awareness |

## Platform Types Supported

| Platform | Example URL |
|----------|-------------|
| `linkedin` | https://linkedin.com/posts/... |
| `tiktok` | https://tiktok.com/@user/video/123 |
| `reddit` | https://reddit.com/r/subreddit/... |
| `youtube` | https://youtube.com/watch?v=... |
| `instagram` | https://instagram.com/p/... |
| `x` | https://x.com/user/status/... |

## Backend Console Output

When backend starts:

```bash
🚀 Growth OS Backend running on http://localhost:4000
📊 Health check: http://localhost:4000/health
🤖 AI Generation endpoints ready at /api/generate/*
📱 Social Analytics endpoints ready at /api/social/*
```

## Verification Checklist

- ✅ All 6 endpoints created
- ✅ Zod validation on all inputs
- ✅ Proper HTTP status codes (200, 201, 400, 404, 500)
- ✅ Error handling with descriptive messages
- ✅ camelCase → snake_case mapping
- ✅ Post existence checks (404 handling)
- ✅ Date range filtering
- ✅ No linter errors
- ✅ Backend auto-reloads (tsx watch)
- ✅ Comprehensive API documentation

## Architecture

```
Frontend (future)
    ↓ HTTP requests
Backend Express Server
    ↓ Zod validation
Route Handlers (socialAccountsRoutes, socialPostsRoutes, metricsRoutes)
    ↓ calls
Repository Functions (socialAccounts, socialPosts, metricsSnapshots)
    ↓ Supabase client
Database (Supabase Postgres)
```

## Next Steps

**Phase 1 (Data Layer):** ✅ Complete
- Database schema
- Repository functions

**Phase 2 (API Layer):** ✅ Complete
- REST endpoints
- Zod validation
- Error handling

**Phase 3 (Future):**
- Frontend analytics dashboard
- Charts and visualizations
- Automated metrics collection (API integrations)
- Performance insights and recommendations
- Bulk operations (import CSV, etc.)

## Integration with Existing Features

### Link to Generated Content

When posting content from a script or blog:

```bash
# 1. Generate script
POST /api/generate/script
→ Returns script.id

# 2. Post on social media (manually)

# 3. Record in system with source linkage
POST /api/social/posts
Body: {
  sourceType: "script",
  sourceId: "script-uuid",  ← Links back
  ...
}
```

### Query Content Performance

```bash
# Get all posts
GET /api/social/posts

# Filter by source_id in your code
posts.filter(p => p.source_id === 'script-uuid')

# For each, get metrics
GET /api/social/posts/:postId/metrics

# Calculate total ROI for that script
```

## Security Notes

**Current Implementation:**
- ✅ Zod validation prevents injection
- ✅ UUID validation prevents ID manipulation
- ✅ Foreign key constraints (CASCADE) protect data integrity
- ✅ RLS policies enabled on all tables

**Future Enhancements:**
- Authentication/authorization (JWT)
- Rate limiting
- API key authentication
- CORS restrictions

## Files Summary

**New Files (4):**
- `apps/backend/src/routes/socialAccountsRoutes.ts`
- `apps/backend/src/routes/socialPostsRoutes.ts`
- `apps/backend/src/routes/metricsRoutes.ts`
- `apps/backend/src/routes/socialRouter.ts`

**Modified Files (4):**
- `apps/backend/src/index.ts`
- `supabase/migrations/003_add_social_analytics.sql`
- `packages/shared/src/index.ts`
- `apps/backend/src/aiSchemas.ts`

**Documentation (1):**
- `SOCIAL_ANALYTICS_API.md`

## 🎉 Result

**Social Analytics REST API is fully operational!**

You can now:
- ✅ Create social accounts via API
- ✅ Record posts with full metadata
- ✅ Track metrics over time
- ✅ Query and filter posts
- ✅ Analyze content performance

**All endpoints live at:** `http://localhost:4000/api/social/*`

**See `SOCIAL_ANALYTICS_API.md` for complete API reference with cURL examples!** 🚀

