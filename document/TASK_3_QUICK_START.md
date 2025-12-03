# Task 3: Social Analytics Frontend - Quick Start

## ✅ Complete!

The Social Analytics dashboard is now live at `http://localhost:3000/social`

## What You Can Do Now

### 1. Add Social Accounts

**Navigate to:** `http://localhost:3000/social` (Accounts tab)

**Add your first account:**
```
Platform: TikTok
Handle: @careerscaleup
Profile URL: https://tiktok.com/@careerscaleup
Label: CareerScaleUp TikTok
→ Click "Add Account"
```

### 2. Log Social Posts

**Switch to:** "Posts" tab

**Log a post:**
```
Social Account: [Select from dropdown]
Product: CareerScaleUp
Audience Type: Job Seeker
Source Type: Other
Post URL: https://tiktok.com/@careerscaleup/video/123456789
Posted At: [Select date/time]
→ Click "Log Post"
```

### 3. Track Metrics

**In the Posts table:**
```
→ Find your post
→ Click "Add Metrics" button
→ Fill in:
   Views: 15000
   Likes: 450
   Comments: 23
   Shares: 89
   Saves: 156
→ Click "Record Metrics"
```

**Track growth over time:**
- Add metrics on Day 1
- Add metrics again on Day 7
- Compare performance

## Complete Workflow Example

### Step-by-Step: Track Your First Post

**1. Add Account (once)**
```
Go to /social → Accounts tab
→ Add your TikTok account
```

**2. Post Content on Social Media**
```
Create and post your TikTok video
→ Copy the post URL
```

**3. Log Post in System**
```
Go to /social → Posts tab
→ Select account, product, audience
→ Paste URL
→ Select posted date/time
→ Submit
```

**4. Track Initial Metrics (Day 1)**
```
Find post in table
→ Click "Add Metrics"
→ Enter Day 1 metrics (e.g., 1,500 views)
→ Submit
```

**5. Track Growth (Day 7)**
```
Find same post in table
→ Click "Add Metrics" again
→ Enter Day 7 metrics (e.g., 15,000 views)
→ Submit
```

**Result:** You've tracked 10x growth over 7 days! 📈

## Navigation

```
Top navigation bar:
Growth OS | Personas | Messaging | Scripts | Blogs | Social Analytics
                                                            ↑
                                                     Click here!
```

## Features

### Accounts Tab
- ✅ Add social accounts
- ✅ View all accounts
- ✅ Platform badges
- ✅ Clickable profile links

### Posts Tab
- ✅ Log new posts
- ✅ View all posts in table
- ✅ Quick metrics entry
- ✅ Clickable post URLs

### Metrics Dashboard
- 🔜 Coming soon (placeholder)
- 🔜 Charts and visualizations
- 🔜 Performance analytics

## Tips

### Linking Generated Content

When posting content from a generated script:

1. Go to `/scripts` and generate content
2. Copy the script ID from the UI
3. Post on social media
4. Log in `/social` with:
   - Source Type: "Script"
   - Source ID: [paste ID]
5. This creates a trackable link!

### Track Multiple Snapshots

You can add metrics multiple times for the same post:
- Day 1: 1,500 views
- Day 3: 5,000 views
- Day 7: 15,000 views
- Day 30: 50,000 views

### Best Practices

**Frequency:**
- Take snapshots daily for first week
- Then weekly for first month
- Then monthly for long-term tracking

**What to Track:**
- Initial performance (24 hours)
- Short-term growth (7 days)
- Long-term performance (30+ days)

## Testing

### Quick Test

```bash
# 1. Check page loads
http://localhost:3000/social

# 2. Add test account
Platform: TikTok
Handle: @test
Profile URL: https://tiktok.com/@test
Label: Test Account
→ Submit

# 3. Log test post
Social Account: Test Account
Product: CareerScaleUp
Audience: Job Seeker
Source Type: Other
URL: https://example.com/post
Posted At: Today
→ Submit

# 4. Add test metrics
Views: 1000
Likes: 50
Comments: 5
Shares: 10
Saves: 20
→ Submit

# All working? ✅ You're good to go!
```

## Verification

**Check that:**
- ✅ Navigation shows "Social Analytics" link
- ✅ `/social` page loads with tabs
- ✅ Can add accounts
- ✅ Can log posts
- ✅ Can add metrics
- ✅ Toast notifications appear
- ✅ Data persists after refresh

## API Endpoints Used

The frontend calls these backend endpoints:

```
POST   /api/social/accounts       → Create account
GET    /api/social/accounts       → List accounts
POST   /api/social/posts          → Log post
GET    /api/social/posts          → List posts
POST   /api/social/posts/:id/metrics → Record metrics
GET    /api/social/posts/:id/metrics → View metrics history
```

## Files to Know

**Frontend:**
- `apps/frontend/src/app/social/page.tsx` - Main page
- `apps/frontend/src/lib/api.ts` - API functions

**Backend:**
- `apps/backend/src/routes/socialRouter.ts` - Routes
- `apps/backend/src/repositories/` - Database functions

**Database:**
- `supabase/migrations/003_add_social_analytics.sql` - Schema

## Troubleshooting

### Issue: "Failed to load accounts"

**Solution:**
1. Check backend is running: `http://localhost:4000/health`
2. Run Supabase migration `003_add_social_analytics.sql`
3. Check browser console for errors

### Issue: "Invalid input" when submitting

**Solution:**
- Check all required fields are filled
- Verify URLs are valid (https://...)
- Check date format is correct

### Issue: Navigation link missing

**Solution:**
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Check `apps/frontend/src/app/layout.tsx` has link

### Issue: Toast notifications not showing

**Solution:**
- Check `Toaster` component is in layout
- Check browser console for errors
- Verify `@/hooks/use-toast` exists

## Next Steps

### Phase 4: Analytics Dashboards

Future enhancements:
- Line charts for growth tracking
- Bar charts for platform comparison
- Performance insights
- Top performing content
- Automated metrics collection

### Phase 5: Automation

- Schedule automatic snapshots
- API integrations with platforms
- Email alerts for viral posts
- Export reports as PDF

## Documentation

**Complete guides:**
- `SOCIAL_ANALYTICS_FRONTEND_COMPLETE.md` - Detailed docs
- `SOCIAL_ANALYTICS_API.md` - API reference
- `SOCIAL_ANALYTICS_SETUP.md` - Database setup

## 🎉 You're Ready!

**Navigate to** `http://localhost:3000/social` **and start tracking!**

---

**Questions?** See the complete documentation files above. 📚

