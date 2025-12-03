# Social Analytics Setup Guide

## Overview

The social analytics system tracks social media posts and their performance metrics over time across multiple platforms.

## Database Schema

### Tables Created

**1. `social_accounts`** - Social media accounts for JCER products
- Stores account information for each platform (LinkedIn, TikTok, etc.)
- Each account has a unique platform + handle combination

**2. `social_posts`** - Individual posts on social platforms
- Links to social accounts
- Tracks product, audience type, and source content
- Stores post URLs and posting timestamps

**3. `social_post_metrics_snapshots`** - Time-series performance data
- Multiple snapshots per post for tracking growth over time
- Tracks: views, likes, comments, shares, saves

## Setup Instructions

### 1. Run the Migration

1. Go to your Supabase dashboard: https://slnomadjemgakrdaqnlq.supabase.co
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/003_add_social_analytics.sql`
5. Paste into the SQL editor
6. Click **Run**

### 2. Verify Tables Created

Go to **Table Editor** and confirm you see:
- `social_accounts`
- `social_posts`
- `social_post_metrics_snapshots`

### 3. Test with Sample Data

```sql
-- Create a sample social account
INSERT INTO social_accounts (platform, handle, profile_url, label)
VALUES (
  'linkedin',
  '@jcer-llc',
  'https://linkedin.com/company/jcer-llc',
  'JCER Company LinkedIn'
);

-- Verify
SELECT * FROM social_accounts;
```

## Usage Examples

### Create a Social Account

```typescript
import { createSocialAccount } from './repositories';

const account = await createSocialAccount({
  platform: 'tiktok',
  handle: '@careerscaleup',
  profile_url: 'https://tiktok.com/@careerscaleup',
  label: 'CareerScaleUp TikTok',
});
```

### Track a Post

```typescript
import { createSocialPost } from './repositories';

const post = await createSocialPost({
  social_account_id: 'account-uuid',
  product: 'CareerScaleUp',
  audience_type: 'jobseeker',
  source_type: 'script',
  source_id: 'script-uuid', // Optional reference to scripts table
  url: 'https://tiktok.com/@careerscaleup/video/123456',
  posted_at: new Date().toISOString(),
});
```

### Record Metrics

```typescript
import { createMetricsSnapshot } from './repositories';

const metrics = await createMetricsSnapshot({
  social_post_id: 'post-uuid',
  views: 15000,
  likes: 450,
  comments: 23,
  shares: 89,
  saves: 156,
});
```

### Get Performance Over Time

```typescript
import { listMetricsForPost } from './repositories';

const snapshots = await listMetricsForPost('post-uuid');
// Returns array ordered by captured_at (newest first)
// Use to create growth charts
```

## Supported Platforms

- `linkedin` - LinkedIn
- `tiktok` - TikTok
- `reddit` - Reddit
- `youtube` - YouTube
- `instagram` - Instagram
- `x` - X (formerly Twitter)

## Data Relationships

```
social_accounts
    ↓ (1:many)
social_posts
    ↓ (1:many)
social_post_metrics_snapshots
```

**Optional references:**
- `social_posts.source_id` can point to `scripts.id` or `blog_outlines.id`
- No foreign key constraint (flexible for future content types)

## Use Cases

### 1. Track Content Performance
- Record every post with its source content
- Take daily/weekly metrics snapshots
- Analyze which content types perform best

### 2. Audience Segmentation
- Compare job seeker vs recruiter content performance
- Identify which audience responds better to which platforms

### 3. Platform Optimization
- See which platforms drive the most engagement
- Optimize content strategy per platform

### 4. ROI Analysis
- Link posts back to generated scripts/blogs
- Measure ROI of AI-generated content
- Identify high-performing personas and messaging

## Repository Functions

### Social Accounts
```typescript
createSocialAccount(input) → Promise<SocialAccount>
listSocialAccounts(platform?) → Promise<SocialAccount[]>
getSocialAccountById(id) → Promise<SocialAccount | null>
```

### Social Posts
```typescript
createSocialPost(input) → Promise<SocialPost>
listSocialPosts(filters?) → Promise<SocialPost[]>
  // Filters: { product?, audienceType?, socialAccountId? }
getSocialPostById(id) → Promise<SocialPost | null>
```

### Metrics Snapshots
```typescript
createMetricsSnapshot(input) → Promise<SocialPostMetricsSnapshot>
listMetricsForPost(socialPostId) → Promise<SocialPostMetricsSnapshot[]>
getLatestMetricsForPost(socialPostId) → Promise<SocialPostMetricsSnapshot | null>
```

## Next Steps

1. **Run migration** in Supabase
2. **Create initial social accounts** for your platforms
3. **Start tracking posts** as you publish content
4. **Record metrics snapshots** (manually or via automation)
5. **Build analytics dashboard** (future task)

## Future Enhancements

- API endpoints for CRUD operations
- Analytics dashboard in frontend
- Automated metrics collection via platform APIs
- Performance comparison charts
- Best performing content recommendations
- Content scheduling features

---

See `apps/backend/DATA_LAYER.md` for repository function reference.

