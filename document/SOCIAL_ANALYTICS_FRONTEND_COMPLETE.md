# Task 3: Social Analytics Frontend - COMPLETE ✅

## Summary

Created a complete Social Analytics dashboard with tabbed interface for managing social accounts, logging posts, and recording metrics snapshots.

## What Was Built

### New Page: `/social`

A comprehensive dashboard with 3 tabs:
1. **Accounts Tab** - Manage social media accounts
2. **Posts Tab** - Log posts and view recent activity
3. **Metrics Dashboard Tab** - Placeholder for future analytics

### Features Implemented

#### ✅ Accounts Tab

**Account Management:**
- **Add New Account Form:**
  - Platform select (LinkedIn, TikTok, Reddit, YouTube, Instagram, X)
  - Handle input (@username)
  - Profile URL input (validated)
  - Label input (e.g., "CareerScaleUp TikTok")
  - Submit button with loading state

- **Accounts List:**
  - Card-based layout showing all registered accounts
  - Platform badge and handle display
  - Clickable profile URLs (opens in new tab)
  - Real-time refresh after adding new account

#### ✅ Posts Tab

**Post Logging Form:**
- **Social Account Select** - Choose from registered accounts
- **Product Select** - CareerScaleUp or Zevaux
- **Audience Type Select** - Job Seeker, Recruiter, SMB Owner, Other
- **Source Type Select** - Script, Blog, Other
- **Source ID Input** - Optional UUID (shown only for script/blog)
- **Post URL Input** - Link to the published post
- **Posted At Input** - Date/time picker (datetime-local)
- Submit button with loading state

**Posts Table:**
- Displays all logged posts in chronological order
- Columns:
  - Platform (with account handle)
  - Product
  - Audience type
  - Post URL (clickable)
  - Posted date
  - Actions (Add Metrics button)

#### ✅ Metrics Quick-Add Dialog

**Metrics Entry:**
- Opens from "Add Metrics" button in posts table
- Modal dialog with form fields:
  - Views (number input)
  - Likes (number input)
  - Comments (number input)
  - Shares (number input)
  - Saves (number input)
- Submit button with loading state
- Auto-closes and refreshes on success

#### ✅ Metrics Dashboard Tab

- Placeholder for future analytics features
- Coming soon message
- Ready for charts and visualizations

### Files Created

**Frontend (3 new files):**

1. **`apps/frontend/src/app/social/page.tsx`** (730+ lines)
   - Main Social Analytics page with tabs
   - AccountsTab component
   - PostsTab component
   - AddMetricsDialog component
   - MetricsDashboardTab component (placeholder)
   - Complete state management
   - Form handling and validation
   - Error handling with toast notifications

**Backend (2 new files):**

2. **`apps/backend/src/routes/listScripts.ts`**
   - GET /api/scripts handler
   - Lists all scripts (or filtered by personaId)

3. **`apps/backend/src/routes/listBlogOutlines.ts`**
   - GET /api/blog-outlines handler
   - Lists all blog outlines (or filtered by personaId)

### Files Modified

**Frontend (2 files):**

4. **`apps/frontend/src/lib/api.ts`**
   - Added 9 new API functions:
     - `createSocialAccount()`
     - `listSocialAccounts()`
     - `createSocialPost()`
     - `listSocialPosts()`
     - `createMetricsSnapshot()`
     - `listMetricsForPost()`
     - `listAllScripts()`
     - `listAllBlogOutlines()`
   - Added SocialAccount, SocialPost, SocialPostMetricsSnapshot types
   - Added camelCase ↔ snake_case mapping

5. **`apps/frontend/src/app/layout.tsx`**
   - Added "Social Analytics" link to navigation
   - Added Toaster component for notifications

**Backend (3 files):**

6. **`apps/backend/src/repositories/scripts.ts`**
   - Added `listScripts(personaId?)` function
   - Updated `listScriptsForPersona()` to use new function

7. **`apps/backend/src/repositories/blogOutlines.ts`**
   - Added `listBlogOutlines(personaId?)` function
   - Updated `listBlogOutlinesForPersona()` to use new function

8. **`apps/backend/src/index.ts`**
   - Added `GET /api/scripts` endpoint
   - Added `GET /api/blog-outlines` endpoint
   - Imported and registered list handlers

## UI/UX Features

### ✅ Responsive Design
- Grid layout adapts to screen size
- Tables scroll horizontally on mobile
- Forms stack properly on small screens

### ✅ Loading States
- "Loading..." placeholders while fetching data
- "Submitting..." button states during API calls
- Disabled buttons during submission

### ✅ Empty States
- Helpful messages when no data exists
- "Add your first account!" prompts
- "Log your first post!" prompts

### ✅ Toast Notifications
- Success messages for successful actions
- Error messages with details
- Validation error feedback

### ✅ Form Validation
- Required field checking
- URL validation
- Datetime validation
- Clear error messages

### ✅ Real-time Updates
- Auto-refresh after adding accounts
- Auto-refresh after logging posts
- Auto-refresh after recording metrics

## User Flows

### Flow 1: Add Social Account

1. Navigate to `/social`
2. Click "Accounts" tab (default)
3. Fill in form:
   - Select platform (e.g., TikTok)
   - Enter handle (e.g., @careerscaleup)
   - Enter profile URL
   - Enter label (e.g., "CareerScaleUp TikTok")
4. Click "Add Account"
5. See success toast
6. Account appears in list immediately

### Flow 2: Log Social Post

1. Navigate to `/social`
2. Click "Posts" tab
3. Fill in form:
   - Select social account
   - Select product (CareerScaleUp)
   - Select audience (Job Seeker)
   - Select source type (Script)
   - Optionally enter source ID
   - Enter post URL
   - Select posted date/time
4. Click "Log Post"
5. See success toast
6. Post appears in table below

### Flow 3: Add Metrics to Post

1. Navigate to `/social` → "Posts" tab
2. Find post in table
3. Click "Add Metrics" button
4. Dialog opens
5. Fill in metrics:
   - Views: 15000
   - Likes: 450
   - Comments: 23
   - Shares: 89
   - Saves: 156
6. Click "Record Metrics"
7. See success toast
8. Dialog closes

### Flow 4: View Performance Over Time

1. Add metrics on Day 1 (e.g., 1,500 views)
2. Add metrics on Day 7 (e.g., 15,000 views)
3. Future: View growth chart in Metrics Dashboard tab

## Technical Implementation

### Component Structure

```
SocialAnalyticsPage
├── Tabs (shadcn/ui)
│   ├── AccountsTab
│   │   ├── Add Account Form (Card)
│   │   └── Accounts List (Card)
│   ├── PostsTab
│   │   ├── Log Post Form (Card)
│   │   ├── Posts Table (Card)
│   │   └── AddMetricsDialog (per row)
│   └── MetricsDashboardTab (placeholder)
```

### State Management

**AccountsTab:**
- `accounts` - Array of SocialAccount
- `loading` - Boolean
- `submitting` - Boolean
- Form fields: `platform`, `handle`, `profileUrl`, `label`

**PostsTab:**
- `posts` - Array of SocialPost
- `accounts` - Array of SocialAccount
- `loading` - Boolean
- `submitting` - Boolean
- Form fields: `selectedAccountId`, `product`, `audienceType`, `sourceType`, `sourceId`, `url`, `postedAt`

**AddMetricsDialog:**
- `open` - Boolean
- `submitting` - Boolean
- Form fields: `views`, `likes`, `comments`, `shares`, `saves`

### API Integration

**Data Flow:**
```
Component → API helper function → Backend endpoint → Supabase → Response
```

**Example:**
```typescript
// Component calls
await createSocialAccount({
  platform: 'tiktok',
  handle: '@user',
  profile_url: 'https://...',
  label: 'Label'
});

// API helper converts to camelCase
POST /api/social/accounts
{
  "platform": "tiktok",
  "handle": "@user",
  "profileUrl": "https://...",
  "label": "Label"
}

// Backend converts to snake_case and saves
INSERT INTO social_accounts...
```

### shadcn/ui Components Used

- ✅ `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- ✅ `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- ✅ `Button`
- ✅ `Input`
- ✅ `Label`
- ✅ `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- ✅ `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
- ✅ `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`
- ✅ `useToast` hook for notifications
- ✅ `Toaster` component in layout

## Screenshots (Text Descriptions)

### Accounts Tab
```
+-------------------------------------------------------+
| Add Social Account          | Social Accounts         |
|------------------------------|-------------------------|
| Platform: [TikTok ▼]        | CareerScaleUp TikTok   |
| Handle: [@careerscaleup]    | tiktok • @careerscaleup|
| Profile URL: [https://...]  | View Profile →         |
| Label: [CareerScaleUp...]   |                         |
| [Add Account]               | JCER LinkedIn          |
|                             | linkedin • @jcer-llc   |
|                             | View Profile →         |
+-------------------------------------------------------+
```

### Posts Tab
```
+-------------------------------------------------------+
| Log New Post                                          |
|-------------------------------------------------------|
| Social Account: [CareerScaleUp TikTok ▼]             |
| Product: [CareerScaleUp ▼]  Audience: [Job Seeker ▼] |
| Source Type: [Script ▼]     Source ID: [optional]    |
| Post URL: [https://tiktok.com/@.../video/123]        |
| Posted At: [2025-12-02 10:00]                        |
| [Log Post]                                            |
+-------------------------------------------------------+
| Recent Posts                                          |
|-------------------------------------------------------|
| Platform | Product      | Audience   | URL | [Actions]|
| TikTok   | CareerScaleUp| Job Seeker | 🔗  | [Add...]  |
| LinkedIn | Zevaux       | SMB Owner  | 🔗  | [Add...]  |
+-------------------------------------------------------+
```

### Metrics Dialog
```
+--------------------------------+
| Add Metrics Snapshot           |
|--------------------------------|
| Record current performance     |
|--------------------------------|
| Views:    [15000]              |
| Likes:    [450]                |
| Comments: [23]                 |
| Shares:   [89]                 |
| Saves:    [156]                |
|                                |
| [Record Metrics]               |
+--------------------------------+
```

## Testing Instructions

### 1. Navigate to Social Analytics

```
http://localhost:3000/social
```

### 2. Test Accounts Tab

**Add Account:**
```
Platform: TikTok
Handle: @careerscaleup
Profile URL: https://tiktok.com/@careerscaleup
Label: CareerScaleUp TikTok
→ Click "Add Account"
→ Should see success toast
→ Account appears in list
```

**Verify:**
- Account shows in list with correct info
- Profile URL is clickable
- Can add multiple accounts

### 3. Test Posts Tab

**Log Post:**
```
Social Account: Select from dropdown
Product: CareerScaleUp
Audience Type: Job Seeker
Source Type: Other
Post URL: https://example.com/post
Posted At: Select date/time
→ Click "Log Post"
→ Should see success toast
→ Post appears in table
```

**Verify:**
- Post shows in table with correct info
- Post URL is clickable
- Can log multiple posts

### 4. Test Metrics Dialog

**Add Metrics:**
```
Find post in table
→ Click "Add Metrics"
→ Dialog opens
→ Fill in: Views: 1000, Likes: 50, etc.
→ Click "Record Metrics"
→ Should see success toast
→ Dialog closes
```

**Verify:**
- Can add multiple snapshots to same post
- Metrics are saved correctly
- Can track growth over time

### 5. Test Navigation

```
Click "Social Analytics" in nav
→ Should navigate to /social
→ Should default to "Accounts" tab
→ Can switch between tabs
```

### 6. Test Error Handling

**Try submitting empty forms:**
- Should see validation error toast
- Required fields should be checked

**Try invalid URLs:**
- Should see error toast
- URL validation should work

## Verification Checklist

- ✅ New page at `/social` created
- ✅ Tabbed interface with 3 tabs
- ✅ Accounts tab with form and list
- ✅ Posts tab with form and table
- ✅ Metrics dialog with form
- ✅ All API functions added
- ✅ Backend list endpoints added
- ✅ Navigation link added
- ✅ Toast notifications working
- ✅ Loading states implemented
- ✅ Empty states implemented
- ✅ Form validation working
- ✅ Real-time updates working
- ✅ No linter errors
- ✅ Responsive design
- ✅ Error handling

## Future Enhancements

**Phase 4 (Future):**
- Metrics Dashboard tab with charts
- Line charts for growth over time
- Bar charts for platform comparison
- Aggregate analytics
- Best performing content
- Export data as CSV
- Bulk operations
- Automated metrics collection via APIs
- Scheduled snapshots

## Architecture Diagram

```
Frontend (/social)
    ↓ HTTP requests
API Helper Functions (api.ts)
    ↓ camelCase → API format
Backend Express Endpoints
    ↓ API format → snake_case
Repository Functions
    ↓ Supabase client
Database (Postgres)
    ↓ Response
(Reverse flow back to Frontend)
```

## Files Summary

**New Files (3):**
- `apps/frontend/src/app/social/page.tsx` (730+ lines)
- `apps/backend/src/routes/listScripts.ts`
- `apps/backend/src/routes/listBlogOutlines.ts`

**Modified Files (5):**
- `apps/frontend/src/lib/api.ts` (added 9 functions)
- `apps/frontend/src/app/layout.tsx` (nav + toaster)
- `apps/backend/src/repositories/scripts.ts` (list function)
- `apps/backend/src/repositories/blogOutlines.ts` (list function)
- `apps/backend/src/index.ts` (2 new endpoints)

**Total Lines Added:** ~900+ lines

## Integration with Existing Features

### Link to Generated Content

When logging a post from a generated script:

1. Go to `/scripts` page
2. Generate a script
3. Copy the script ID from the UI
4. Post content on social media
5. Go to `/social` → "Posts" tab
6. Fill in form:
   - Source Type: Script
   - Source ID: [paste script ID]
7. This creates a trackable link between generated content and social performance

### Query Performance

Future feature to:
- See which scripts/blogs perform best on social
- Identify high-performing personas
- Optimize content strategy based on data

## 🎉 Result

**Social Analytics frontend is fully operational!**

You can now:
- ✅ Manage social media accounts via UI
- ✅ Log posts with full metadata
- ✅ Record metrics snapshots quickly
- ✅ Track posts across platforms
- ✅ Link posts to generated content
- ✅ View all activity in one dashboard

**Navigate to:** `http://localhost:3000/social`

**Ready for phase 4: Analytics dashboards and automation!** 🚀

