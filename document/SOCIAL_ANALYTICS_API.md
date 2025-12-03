# Social Analytics REST API Documentation

## Base URL

```
http://localhost:4000/api/social
```

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/accounts` | Create a social account |
| GET | `/accounts` | List all social accounts |
| POST | `/posts` | Create a social post |
| GET | `/posts` | List social posts (with filters) |
| POST | `/posts/:postId/metrics` | Create metrics snapshot |
| GET | `/posts/:postId/metrics` | Get all metrics for a post |

---

## Social Accounts

### Create Social Account

**POST** `/api/social/accounts`

Create a new social media account record.

**Request Body:**

```json
{
  "platform": "tiktok",
  "handle": "@careerscaleup",
  "profileUrl": "https://tiktok.com/@careerscaleup",
  "label": "CareerScaleUp TikTok"
}
```

**Field Validation:**

- `platform` (required): One of: `linkedin`, `tiktok`, `reddit`, `youtube`, `instagram`, `x`
- `handle` (required): String, 1-100 chars
- `profileUrl` (required): Valid URL, max 500 chars
- `label` (required): String, 1-200 chars (e.g., "Founder LinkedIn", "CareerScaleUp TikTok")

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "created_at": "2025-12-02T10:00:00Z",
    "updated_at": "2025-12-02T10:00:00Z",
    "platform": "tiktok",
    "handle": "@careerscaleup",
    "profile_url": "https://tiktok.com/@careerscaleup",
    "label": "CareerScaleUp TikTok"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid input (Zod validation failed)
- `500 Internal Server Error`: Database error

**cURL Example:**

```bash
curl -X POST http://localhost:4000/api/social/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "tiktok",
    "handle": "@careerscaleup",
    "profileUrl": "https://tiktok.com/@careerscaleup",
    "label": "CareerScaleUp TikTok"
  }'
```

---

### List Social Accounts

**GET** `/api/social/accounts`

List all social media accounts, optionally filtered by platform.

**Query Parameters:**

- `platform` (optional): Filter by platform (e.g., `tiktok`, `linkedin`)

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "created_at": "2025-12-02T10:00:00Z",
      "updated_at": "2025-12-02T10:00:00Z",
      "platform": "tiktok",
      "handle": "@careerscaleup",
      "profile_url": "https://tiktok.com/@careerscaleup",
      "label": "CareerScaleUp TikTok"
    },
    {
      "id": "uuid-2",
      "created_at": "2025-12-02T09:00:00Z",
      "updated_at": "2025-12-02T09:00:00Z",
      "platform": "linkedin",
      "handle": "@jcer-llc",
      "profile_url": "https://linkedin.com/company/jcer-llc",
      "label": "JCER Company LinkedIn"
    }
  ]
}
```

**cURL Examples:**

```bash
# List all accounts
curl http://localhost:4000/api/social/accounts

# Filter by platform
curl "http://localhost:4000/api/social/accounts?platform=tiktok"
```

---

## Social Posts

### Create Social Post

**POST** `/api/social/posts`

Record a new social media post with its metadata.

**Request Body:**

```json
{
  "socialAccountId": "uuid-of-social-account",
  "product": "CareerScaleUp",
  "audienceType": "jobseeker",
  "sourceType": "script",
  "sourceId": "uuid-of-script",
  "platformPostId": "external-platform-id",
  "url": "https://tiktok.com/@careerscaleup/video/123456789",
  "postedAt": "2025-12-02T10:00:00Z"
}
```

**Field Validation:**

- `socialAccountId` (required): UUID of the social account
- `product` (required): `CareerScaleUp` or `Zevaux`
- `audienceType` (required): `jobseeker`, `recruiter`, `smb_owner`, or `other`
- `sourceType` (required): `script`, `blog`, or `other`
- `sourceId` (optional): UUID linking to scripts or blog_outlines table
- `platformPostId` (optional): External platform's post ID (max 200 chars)
- `url` (required): Valid URL to the post (max 1000 chars)
- `postedAt` (required): ISO 8601 datetime string

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "created_at": "2025-12-02T10:00:00Z",
    "updated_at": "2025-12-02T10:00:00Z",
    "social_account_id": "uuid-of-social-account",
    "product": "CareerScaleUp",
    "audience_type": "jobseeker",
    "source_type": "script",
    "source_id": "uuid-of-script",
    "platform_post_id": "external-platform-id",
    "url": "https://tiktok.com/@careerscaleup/video/123456789",
    "posted_at": "2025-12-02T10:00:00Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid input (Zod validation failed)
- `500 Internal Server Error`: Database error

**cURL Example:**

```bash
curl -X POST http://localhost:4000/api/social/posts \
  -H "Content-Type: application/json" \
  -d '{
    "socialAccountId": "uuid-of-social-account",
    "product": "CareerScaleUp",
    "audienceType": "jobseeker",
    "sourceType": "script",
    "sourceId": "uuid-of-script",
    "url": "https://tiktok.com/@careerscaleup/video/123456789",
    "postedAt": "2025-12-02T10:00:00Z"
  }'
```

---

### List Social Posts

**GET** `/api/social/posts`

List all social posts with optional filtering.

**Query Parameters:**

- `product` (optional): Filter by product (`CareerScaleUp` or `Zevaux`)
- `audienceType` (optional): Filter by audience (`jobseeker`, `recruiter`, `smb_owner`, `other`)
- `accountId` (optional): Filter by social account UUID
- `dateFrom` (optional): ISO datetime - show posts posted after this date
- `dateTo` (optional): ISO datetime - show posts posted before this date

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "created_at": "2025-12-02T10:00:00Z",
      "updated_at": "2025-12-02T10:00:00Z",
      "social_account_id": "uuid-of-social-account",
      "product": "CareerScaleUp",
      "audience_type": "jobseeker",
      "source_type": "script",
      "source_id": "uuid-of-script",
      "platform_post_id": "external-id",
      "url": "https://tiktok.com/@careerscaleup/video/123456789",
      "posted_at": "2025-12-02T10:00:00Z"
    }
  ]
}
```

**Error Responses:**

- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Database error

**cURL Examples:**

```bash
# List all posts
curl http://localhost:4000/api/social/posts

# Filter by product
curl "http://localhost:4000/api/social/posts?product=CareerScaleUp"

# Filter by audience type
curl "http://localhost:4000/api/social/posts?audienceType=jobseeker"

# Filter by account
curl "http://localhost:4000/api/social/posts?accountId=uuid-of-account"

# Filter by date range
curl "http://localhost:4000/api/social/posts?dateFrom=2025-12-01T00:00:00Z&dateTo=2025-12-31T23:59:59Z"

# Combine multiple filters
curl "http://localhost:4000/api/social/posts?product=CareerScaleUp&audienceType=jobseeker&dateFrom=2025-12-01T00:00:00Z"
```

---

## Metrics

### Create Metrics Snapshot

**POST** `/api/social/posts/:postId/metrics`

Record a new metrics snapshot for a social post.

**URL Parameters:**

- `postId` (required): UUID of the social post

**Request Body:**

```json
{
  "views": 15000,
  "likes": 450,
  "comments": 23,
  "shares": 89,
  "saves": 156
}
```

**Field Validation:**

- `views` (required): Integer ≥ 0
- `likes` (required): Integer ≥ 0
- `comments` (required): Integer ≥ 0
- `shares` (required): Integer ≥ 0
- `saves` (optional): Integer ≥ 0 (defaults to 0)

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "created_at": "2025-12-02T10:00:00Z",
    "social_post_id": "uuid-of-post",
    "captured_at": "2025-12-02T10:00:00Z",
    "views": 15000,
    "likes": 450,
    "comments": 23,
    "shares": 89,
    "saves": 156
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid input or invalid post ID
- `404 Not Found`: Social post not found
- `500 Internal Server Error`: Database error

**cURL Example:**

```bash
curl -X POST http://localhost:4000/api/social/posts/uuid-of-post/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "views": 15000,
    "likes": 450,
    "comments": 23,
    "shares": 89,
    "saves": 156
  }'
```

---

### Get Metrics for Post

**GET** `/api/social/posts/:postId/metrics`

Get all metrics snapshots for a social post, ordered by `captured_at` (newest first).

**URL Parameters:**

- `postId` (required): UUID of the social post

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "created_at": "2025-12-07T10:00:00Z",
      "social_post_id": "uuid-of-post",
      "captured_at": "2025-12-07T10:00:00Z",
      "views": 15000,
      "likes": 450,
      "comments": 23,
      "shares": 89,
      "saves": 156
    },
    {
      "id": "uuid-2",
      "created_at": "2025-12-02T10:00:00Z",
      "social_post_id": "uuid-of-post",
      "captured_at": "2025-12-02T10:00:00Z",
      "views": 1500,
      "likes": 45,
      "comments": 3,
      "shares": 8,
      "saves": 12
    }
  ]
}
```

**Error Responses:**

- `400 Bad Request`: Invalid post ID
- `404 Not Found`: Social post not found
- `500 Internal Server Error`: Database error

**cURL Example:**

```bash
curl http://localhost:4000/api/social/posts/uuid-of-post/metrics
```

---

## Complete Workflow Example

### 1. Create a Social Account

```bash
curl -X POST http://localhost:4000/api/social/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "tiktok",
    "handle": "@careerscaleup",
    "profileUrl": "https://tiktok.com/@careerscaleup",
    "label": "CareerScaleUp TikTok"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "account-uuid",
    ...
  }
}
```

### 2. Record a Post

```bash
curl -X POST http://localhost:4000/api/social/posts \
  -H "Content-Type: application/json" \
  -d '{
    "socialAccountId": "account-uuid",
    "product": "CareerScaleUp",
    "audienceType": "jobseeker",
    "sourceType": "script",
    "url": "https://tiktok.com/@careerscaleup/video/123456789",
    "postedAt": "2025-12-02T10:00:00Z"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "post-uuid",
    ...
  }
}
```

### 3. Take Initial Metrics (Day 1)

```bash
curl -X POST http://localhost:4000/api/social/posts/post-uuid/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "views": 1500,
    "likes": 45,
    "comments": 3,
    "shares": 8,
    "saves": 12
  }'
```

### 4. Take Follow-up Metrics (Day 7)

```bash
curl -X POST http://localhost:4000/api/social/posts/post-uuid/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "views": 15000,
    "likes": 450,
    "comments": 23,
    "shares": 89,
    "saves": 156
  }'
```

### 5. View Growth Over Time

```bash
curl http://localhost:4000/api/social/posts/post-uuid/metrics
```

Response shows all snapshots (newest first):
```json
{
  "success": true,
  "data": [
    { "captured_at": "2025-12-09T...", "views": 15000, ... },
    { "captured_at": "2025-12-02T...", "views": 1500, ... }
  ]
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": [...] // Optional, for validation errors
}
```

### Validation Error Example

```json
{
  "success": false,
  "error": "Invalid input",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "number",
      "path": ["platform"],
      "message": "Expected string, received number"
    }
  ]
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or parameters |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Use Cases

### Track Content Performance

```bash
# 1. Create account
# 2. Record each post with source_id linking to script/blog
# 3. Take daily/weekly metrics snapshots
# 4. Analyze growth trends
```

### Compare Audience Segments

```bash
# Get all job seeker posts
curl "http://localhost:4000/api/social/posts?audienceType=jobseeker"

# Get all recruiter posts
curl "http://localhost:4000/api/social/posts?audienceType=recruiter"

# Compare average engagement
```

### Platform Analysis

```bash
# Get all TikTok accounts
curl "http://localhost:4000/api/social/accounts?platform=tiktok"

# Get all posts from a specific account
curl "http://localhost:4000/api/social/posts?accountId=uuid"

# Analyze which platform performs best
```

### Content ROI Tracking

```bash
# Get all posts from a specific script
curl "http://localhost:4000/api/social/posts"
# Filter results where source_id matches your script ID
# Sum up total views/engagement for that script's content
```

---

## Testing Endpoints

### Health Check

First, verify the backend is running:

```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-02T10:00:00.000Z",
  "service": "growth-os-backend"
}
```

### Test Social Analytics Endpoints

```bash
# 1. Create test account
curl -X POST http://localhost:4000/api/social/accounts \
  -H "Content-Type: application/json" \
  -d '{"platform":"tiktok","handle":"@test","profileUrl":"https://tiktok.com/@test","label":"Test Account"}'

# 2. List accounts (should show your new account)
curl http://localhost:4000/api/social/accounts

# 3. Create test post (use account ID from step 1)
curl -X POST http://localhost:4000/api/social/posts \
  -H "Content-Type: application/json" \
  -d '{"socialAccountId":"ACCOUNT_ID","product":"CareerScaleUp","audienceType":"jobseeker","sourceType":"other","url":"https://example.com/post","postedAt":"2025-12-02T10:00:00Z"}'

# 4. Record metrics (use post ID from step 3)
curl -X POST http://localhost:4000/api/social/posts/POST_ID/metrics \
  -H "Content-Type: application/json" \
  -d '{"views":1000,"likes":50,"comments":5,"shares":10,"saves":20}'

# 5. View metrics
curl http://localhost:4000/api/social/posts/POST_ID/metrics
```

---

## Frontend Integration Example

```typescript
// Create social account
const response = await fetch('http://localhost:4000/api/social/accounts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    platform: 'tiktok',
    handle: '@careerscaleup',
    profileUrl: 'https://tiktok.com/@careerscaleup',
    label: 'CareerScaleUp TikTok',
  }),
});

const { data: account } = await response.json();

// Record post
const postResponse = await fetch('http://localhost:4000/api/social/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    socialAccountId: account.id,
    product: 'CareerScaleUp',
    audienceType: 'jobseeker',
    sourceType: 'script',
    url: 'https://tiktok.com/@careerscaleup/video/123',
    postedAt: new Date().toISOString(),
  }),
});

const { data: post } = await postResponse.json();

// Record metrics
await fetch(`http://localhost:4000/api/social/posts/${post.id}/metrics`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    views: 15000,
    likes: 450,
    comments: 23,
    shares: 89,
    saves: 156,
  }),
});
```

---

## Next Steps

- ✅ Database schema created
- ✅ REST API endpoints live
- 🔜 Frontend analytics dashboard
- 🔜 Automated metrics collection
- 🔜 Performance charts and insights
- 🔜 Content recommendations based on performance

See `SOCIAL_ANALYTICS_SETUP.md` for database setup instructions.

