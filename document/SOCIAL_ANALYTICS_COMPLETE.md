# Social Analytics Feature - COMPLETE ✅

## Summary

Added complete social analytics infrastructure with 3 new tables, TypeScript types, Zod schemas, and repository functions to track social media posts and their performance metrics over time.

## What Was Created

### 1. Database Schema (`supabase/migrations/003_add_social_analytics.sql`)

**Three new tables:**

#### `social_accounts`
- Stores social media account information
- Fields: platform, handle, profile_url, label
- Unique constraint on platform + handle
- Indexes on platform and created_at

#### `social_posts`
- Tracks individual posts across platforms
- Fields: social_account_id (FK), product, audience_type, source_type, source_id, url, posted_at
- Links to social accounts (CASCADE delete)
- Optional reference to scripts or blog_outlines
- Indexes on all key fields for efficient filtering

#### `social_post_metrics_snapshots`
- Time-series performance data for posts
- Fields: social_post_id (FK), captured_at, views, likes, comments, shares, saves
- Multiple snapshots per post for tracking growth
- Indexes on social_post_id and captured_at

**Features:**
- ✅ Proper foreign keys with CASCADE
- ✅ CHECK constraints on enum fields
- ✅ Auto-updated `updated_at` triggers
- ✅ RLS policies enabled
- ✅ Comprehensive indexes for performance
- ✅ Documentation comments on tables and columns

### 2. TypeScript Types (`packages/shared/src/index.ts`)

**New types:**
```typescript
export type SocialPlatform = 'linkedin' | 'tiktok' | 'reddit' | 'youtube' | 'instagram' | 'x';
export type SourceType = 'script' | 'blog' | 'other';

export interface SocialAccount extends BaseEntity {
  platform: SocialPlatform;
  handle: string;
  profile_url: string;
  label: string;
}

export interface SocialPost extends BaseEntity {
  social_account_id: string;
  product: Product;
  audience_type: AudienceType;
  source_type: SourceType;
  source_id: string | null;
  platform_post_id: string | null;
  url: string;
  posted_at: string;
}

export interface SocialPostMetricsSnapshot extends BaseEntity {
  social_post_id: string;
  captured_at: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}
```

Plus `Create*Input` interfaces for all three.

### 3. Zod Validation Schemas (`apps/backend/src/aiSchemas.ts`)

**Added schemas:**
- `SocialAccountSchema` - Validates platform, handle, URLs, label
- `SocialPostSchema` - Validates product, audience_type, source_type, URLs, timestamps
- `MetricsSnapshotSchema` - Validates metrics are integers ≥ 0

**Validation features:**
- URL validation for profile_url and post url
- UUID validation for references
- Datetime validation for timestamps
- Integer validation for metrics (min 0)
- Enum validation for platform, product, audience_type, source_type

### 4. Repository Functions

**`apps/backend/src/repositories/socialAccounts.ts`**
- ✅ `createSocialAccount(input)` → Promise<SocialAccount>
- ✅ `listSocialAccounts(platform?)` → Promise<SocialAccount[]>
- ✅ `getSocialAccountById(id)` → Promise<SocialAccount | null>

**`apps/backend/src/repositories/socialPosts.ts`**
- ✅ `createSocialPost(input)` → Promise<SocialPost>
- ✅ `listSocialPosts(filters?)` → Promise<SocialPost[]>
  - Filters: `{ product?, audienceType?, socialAccountId? }`
- ✅ `getSocialPostById(id)` → Promise<SocialPost | null>

**`apps/backend/src/repositories/metricsSnapshots.ts`**
- ✅ `createMetricsSnapshot(input)` → Promise<SocialPostMetricsSnapshot>
- ✅ `listMetricsForPost(socialPostId)` → Promise<SocialPostMetricsSnapshot[]>
- ✅ `getLatestMetricsForPost(socialPostId)` → Promise<SocialPostMetricsSnapshot | null>

**Barrel export updated:** `apps/backend/src/repositories/index.ts`

## Use Cases

### 1. Track Content Performance
```typescript
// 1. Create account
const account = await createSocialAccount({
  platform: 'tiktok',
  handle: '@careerscaleup',
  profile_url: 'https://tiktok.com/@careerscaleup',
  label: 'CareerScaleUp TikTok',
});

// 2. Record a post
const post = await createSocialPost({
  social_account_id: account.id,
  product: 'CareerScaleUp',
  audience_type: 'jobseeker',
  source_type: 'script',
  source_id: 'script-uuid', // Links back to generated script
  url: 'https://tiktok.com/@careerscaleup/video/123456',
  posted_at: new Date().toISOString(),
});

// 3. Take metrics snapshot (Day 1)
await createMetricsSnapshot({
  social_post_id: post.id,
  views: 1500,
  likes: 45,
  comments: 3,
  shares: 8,
  saves: 12,
});

// 4. Take another snapshot (Day 7)
await createMetricsSnapshot({
  social_post_id: post.id,
  views: 15000,
  likes: 450,
  comments: 23,
  shares: 89,
  saves: 156,
});

// 5. Analyze growth
const snapshots = await listMetricsForPost(post.id);
// Shows growth from Day 1 to Day 7
```

### 2. Compare Audience Performance
```typescript
// Get all job seeker posts
const jobSeekerPosts = await listSocialPosts({
  product: 'CareerScaleUp',
  audienceType: 'jobseeker',
});

// Get all recruiter posts
const recruiterPosts = await listSocialPosts({
  product: 'CareerScaleUp',
  audienceType: 'recruiter',
});

// Compare average engagement rates
```

### 3. Platform Analysis
```typescript
// Get all LinkedIn accounts
const linkedinAccounts = await listSocialAccounts('linkedin');

// Get all posts from a specific account
const accountPosts = await listSocialPosts({
  socialAccountId: 'account-uuid',
});

// Get latest metrics for each post
for (const post of accountPosts) {
  const latest = await getLatestMetricsForPost(post.id);
  console.log(`Post ${post.url}: ${latest?.views} views`);
}
```

### 4. Content ROI Tracking
```typescript
// Find posts generated from a specific script
const posts = await listSocialPosts();
const scriptPosts = posts.filter(p => p.source_id === 'script-uuid');

// Get total engagement for that script's content
let totalViews = 0;
for (const post of scriptPosts) {
  const latest = await getLatestMetricsForPost(post.id);
  totalViews += latest?.views || 0;
}

console.log(`Script generated ${totalViews} total views across ${scriptPosts.length} posts`);
```

## Data Relationships

```
Personas
    ↓ (influences)
Scripts / Blog Outlines
    ↓ (source_id reference, optional)
Social Posts
    ↓ (belongs to)
Social Accounts
    ↓ (has many)
Metrics Snapshots
```

## Supported Platforms

| Platform | Example Handle | Example URL |
|----------|----------------|-------------|
| linkedin | @jcer-llc | https://linkedin.com/company/jcer-llc |
| tiktok | @careerscaleup | https://tiktok.com/@careerscaleup |
| reddit | u/careerscaleup | https://reddit.com/user/careerscaleup |
| youtube | @CareerScaleUp | https://youtube.com/@CareerScaleUp |
| instagram | @careerscaleup | https://instagram.com/careerscaleup |
| x | @careerscaleup | https://x.com/careerscaleup |

## Repository Functions Reference

### Social Accounts

```typescript
// Create new account
const account = await createSocialAccount({
  platform: 'tiktok',
  handle: '@careerscaleup',
  profile_url: 'https://tiktok.com/@careerscaleup',
  label: 'CareerScaleUp TikTok',
});

// List all accounts
const allAccounts = await listSocialAccounts();

// List by platform
const tiktokAccounts = await listSocialAccounts('tiktok');

// Get by ID
const account = await getSocialAccountById('uuid');
```

### Social Posts

```typescript
// Create post
const post = await createSocialPost({
  social_account_id: 'account-uuid',
  product: 'CareerScaleUp',
  audience_type: 'jobseeker',
  source_type: 'script',
  source_id: 'script-uuid',
  platform_post_id: 'external-platform-id', // Optional
  url: 'https://tiktok.com/@careerscaleup/video/123456',
  posted_at: '2025-12-01T10:00:00Z',
});

// List all posts
const allPosts = await listSocialPosts();

// Filter by product
const careerPosts = await listSocialPosts({ product: 'CareerScaleUp' });

// Filter by audience type
const recruiterPosts = await listSocialPosts({ audienceType: 'recruiter' });

// Filter by account
const accountPosts = await listSocialPosts({ socialAccountId: 'uuid' });

// Combine filters
const filteredPosts = await listSocialPosts({
  product: 'CareerScaleUp',
  audienceType: 'jobseeker',
  socialAccountId: 'uuid',
});

// Get by ID
const post = await getSocialPostById('uuid');
```

### Metrics Snapshots

```typescript
// Create snapshot
const snapshot = await createMetricsSnapshot({
  social_post_id: 'post-uuid',
  views: 15000,
  likes: 450,
  comments: 23,
  shares: 89,
  saves: 156,
});

// List all snapshots for a post (ordered by captured_at DESC)
const snapshots = await listMetricsForPost('post-uuid');

// Get only the latest snapshot
const latest = await getLatestMetricsForPost('post-uuid');
console.log(`Latest: ${latest.views} views on ${latest.captured_at}`);
```

## Analytics Queries

### Most Viewed Posts
```typescript
const posts = await listSocialPosts();
const postsWithMetrics = await Promise.all(
  posts.map(async (post) => ({
    post,
    metrics: await getLatestMetricsForPost(post.id),
  }))
);

const sorted = postsWithMetrics
  .filter(p => p.metrics !== null)
  .sort((a, b) => (b.metrics?.views || 0) - (a.metrics?.views || 0));

console.log('Top 10 posts:', sorted.slice(0, 10));
```

### Engagement Rate by Audience Type
```typescript
const jobSeekerPosts = await listSocialPosts({ audienceType: 'jobseeker' });
const recruiterPosts = await listSocialPosts({ audienceType: 'recruiter' });

// Calculate average engagement rates...
```

### Growth Over Time
```typescript
const snapshots = await listMetricsForPost('post-uuid');
snapshots.forEach((snapshot, i) => {
  if (i < snapshots.length - 1) {
    const previous = snapshots[i + 1];
    const growth = snapshot.views - previous.views;
    console.log(`${snapshot.captured_at}: +${growth} views`);
  }
});
```

## Field Descriptions

### social_accounts
- `platform`: Social media platform identifier
- `handle`: Platform-specific username/handle
- `profile_url`: Full URL to the profile
- `label`: Friendly name (e.g., "Founder LinkedIn", "CareerScaleUp TikTok")

### social_posts
- `social_account_id`: Which account posted this
- `product`: CareerScaleUp or Zevaux
- `audience_type`: jobseeker or recruiter (for analytics segmentation)
- `source_type`: Where the content came from (script, blog, other)
- `source_id`: Optional UUID linking to scripts or blog_outlines
- `platform_post_id`: External platform's ID (for API integrations)
- `url`: Permalink to the post
- `posted_at`: When it was published

### social_post_metrics_snapshots
- `social_post_id`: Which post these metrics belong to
- `captured_at`: When these metrics were recorded
- `views`: Total views/impressions
- `likes`: Total likes/reactions
- `comments`: Total comments
- `shares`: Total shares/reposts
- `saves`: Total saves/bookmarks

## Future API Endpoints (Not Yet Built)

Potential future additions:
- `POST /api/social-accounts` - Create account via API
- `GET /api/social-accounts` - List accounts
- `POST /api/social-posts` - Record post via API
- `GET /api/social-posts` - List posts with filters
- `POST /api/metrics` - Record metrics snapshot
- `GET /api/analytics/posts/:id` - Get post performance
- `GET /api/analytics/dashboard` - Aggregate analytics

## Integration Points

### Link Generated Content to Posts

When a script or blog is used for a social post:

```typescript
// 1. Generate script
const script = await generateScript({ ... });

// 2. Post it on TikTok (manually or via automation)

// 3. Record in database
const post = await createSocialPost({
  social_account_id: 'tiktok-account-uuid',
  product: 'CareerScaleUp',
  audience_type: 'jobseeker',
  source_type: 'script',
  source_id: script.id, // ← Link back to generated content
  url: 'https://tiktok.com/@careerscaleup/video/123456',
  posted_at: new Date().toISOString(),
});

// 4. Track performance
await createMetricsSnapshot({
  social_post_id: post.id,
  views: 1500,
  likes: 45,
  // ...
});
```

### Query Content Performance

```typescript
// Find which scripts performed best
const posts = await listSocialPosts({ sourceType: 'script' });
const scriptPerformance = new Map();

for (const post of posts) {
  if (post.source_id) {
    const metrics = await getLatestMetricsForPost(post.id);
    if (metrics) {
      const current = scriptPerformance.get(post.source_id) || 0;
      scriptPerformance.set(post.source_id, current + metrics.views);
    }
  }
}

// scriptPerformance now has total views per script ID
```

## Files Created/Modified

**New Files:**
- ✅ `supabase/migrations/003_add_social_analytics.sql` - Database migration
- ✅ `apps/backend/src/repositories/socialAccounts.ts` - Social accounts repo
- ✅ `apps/backend/src/repositories/socialPosts.ts` - Social posts repo
- ✅ `apps/backend/src/repositories/metricsSnapshots.ts` - Metrics repo
- ✅ `SOCIAL_ANALYTICS_SETUP.md` - Setup guide
- ✅ `SOCIAL_ANALYTICS_COMPLETE.md` - This file

**Modified Files:**
- ✅ `packages/shared/src/index.ts` - Added 3 new type families
- ✅ `apps/backend/src/aiSchemas.ts` - Added 3 new Zod schemas
- ✅ `apps/backend/src/repositories/index.ts` - Exported new repos

## Setup Steps

### 1. Run Migration

```bash
# Go to Supabase dashboard SQL Editor
# Copy/paste: supabase/migrations/003_add_social_analytics.sql
# Click Run
```

### 2. Verify Tables

In Supabase Table Editor, you should now see:
- social_accounts
- social_posts
- social_post_metrics_snapshots

### 3. Create Your First Account

```sql
INSERT INTO social_accounts (platform, handle, profile_url, label)
VALUES (
  'linkedin',
  '@jcer-llc',
  'https://linkedin.com/company/jcer-llc',
  'JCER Company LinkedIn'
);
```

## Benefits

### Track Content Performance
- Record every post with source content
- Take daily/weekly metrics snapshots
- Analyze which content types perform best

### Audience Segmentation
- Compare job seeker vs recruiter content
- Identify which audience responds better on which platforms

### Platform Optimization
- See which platforms drive most engagement
- Optimize content strategy per platform

### ROI Analysis
- Link posts back to generated scripts/blogs
- Measure ROI of AI-generated content
- Identify high-performing personas and messaging

## Verification

```bash
# Check no linter errors
✅ No linter errors found

# Backend auto-reloads
✅ Repository functions available

# All types exported
✅ Can import from @growth-os/shared
```

## What's Next

**Phase 1 (Data Layer):** ✅ Complete
- Database schema
- TypeScript types
- Repository functions

**Phase 2 (Future):**
- API endpoints for CRUD operations
- Analytics dashboard in frontend
- Automated metrics collection
- Performance charts and insights
- Content recommendations based on performance

---

## 🎉 Result

**Growth OS now has a complete social analytics foundation!**

You can now:
- Track social accounts across 6 platforms
- Record every post with source content linkage
- Capture metrics snapshots over time
- Analyze performance by product, audience, and platform

Ready to build analytics dashboards and automated tracking! 🚀

