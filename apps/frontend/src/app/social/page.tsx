'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import {
  createSocialAccount,
  listSocialAccounts,
  createSocialPost,
  listSocialPosts,
  createMetricsSnapshot,
  listPersonas,
} from '@/lib/api';
import type { SocialAccount, SocialPost, Product, AudienceType, Brand } from '@growth-os/shared';

export default function SocialAnalyticsPage() {
  const { toast } = useToast();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Social Analytics</h1>
        <p className="text-muted-foreground">
          Track your social media accounts, posts, and performance metrics.
        </p>
      </div>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="metrics">Metrics Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <AccountsTab toast={toast} />
        </TabsContent>

        <TabsContent value="posts">
          <PostsTab toast={toast} />
        </TabsContent>

        <TabsContent value="metrics">
          <MetricsDashboardTab toast={toast} />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}

// ============================================================
// ACCOUNTS TAB
// ============================================================
function AccountsTab({ toast }: { toast: any }) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [platform, setPlatform] = useState<string>('');
  const [handle, setHandle] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [label, setLabel] = useState('');
  const [brand, setBrand] = useState<Brand>('JCER');

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      setLoading(true);
      const data = await listSocialAccounts();
      setAccounts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load accounts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!platform || !handle || !profileUrl || !label || !brand) {
      toast({
        title: 'Validation Error',
        description: 'All fields are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      await createSocialAccount({
        platform: platform as any,
        handle,
        profile_url: profileUrl,
        label,
        brand,
      });

      toast({
        title: 'Success',
        description: 'Social account created successfully',
      });

      // Reset form
      setPlatform('');
      setHandle('');
      setProfileUrl('');
      setLabel('');
      setBrand('JCER');

      // Reload accounts
      loadAccounts();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Add Account Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Social Account</CardTitle>
          <CardDescription>Register a new social media account to track</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="reddit">Reddit</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="x">X (Twitter)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select value={brand} onValueChange={(v) => setBrand(v as Brand)}>
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JCER">JCER (Master)</SelectItem>
                  <SelectItem value="CareerScaleUp">CareerScaleUp</SelectItem>
                  <SelectItem value="Zevaux">Zevaux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="handle">Handle</Label>
              <Input
                id="handle"
                placeholder="@username"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileUrl">Profile URL</Label>
              <Input
                id="profileUrl"
                type="url"
                placeholder="https://..."
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                placeholder="e.g., CareerScaleUp TikTok"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Creating...' : 'Add Account'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Accounts List */}
      <Card>
        <CardHeader>
          <CardTitle>Social Accounts</CardTitle>
          <CardDescription>Your registered social media accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No accounts yet. Add your first account!</p>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{account.label}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {account.brand}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {account.platform} • {account.handle}
                      </p>
                      <a
                        href={account.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Profile →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// POSTS TAB
// ============================================================
function PostsTab({ toast }: { toast: any }) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [product, setProduct] = useState<Product | ''>('');
  const [audienceType, setAudienceType] = useState<AudienceType | ''>('');
  const [sourceType, setSourceType] = useState<'script' | 'blog' | 'other'>('other');
  const [sourceId, setSourceId] = useState<string>('');
  const [url, setUrl] = useState('');
  const [postedAt, setPostedAt] = useState('');
  const [tagsInput, setTagsInput] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [accountsData, postsData] = await Promise.all([
        listSocialAccounts(),
        listSocialPosts(),
      ]);
      setAccounts(accountsData);
      setPosts(postsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAccountId || !product || !audienceType || !url || !postedAt) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      // Parse tags from comma-separated input
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await createSocialPost({
        social_account_id: selectedAccountId,
        product: product as Product,
        audience_type: audienceType as AudienceType,
        source_type: sourceType,
        source_id: sourceId || null,
        url,
        posted_at: postedAt,
        tags,
      });

      toast({
        title: 'Success',
        description: 'Post logged successfully',
      });

      // Reset form
      setSelectedAccountId('');
      setProduct('');
      setAudienceType('');
      setSourceType('other');
      setSourceId('');
      setUrl('');
      setPostedAt('');
      setTagsInput('');

      // Reload posts
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to log post',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  }

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  return (
    <div className="space-y-6">
      {/* Log New Post Form */}
      <Card>
        <CardHeader>
          <CardTitle>Log New Post</CardTitle>
          <CardDescription>Record a social media post you've published</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account">Social Account</Label>
                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.label} ({account.platform})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select value={product} onValueChange={(v) => setProduct(v as Product)}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CareerScaleUp">CareerScaleUp</SelectItem>
                    <SelectItem value="Zevaux">Zevaux</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audienceType">Audience Type</Label>
                <Select value={audienceType} onValueChange={(v) => setAudienceType(v as AudienceType)}>
                  <SelectTrigger id="audienceType">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jobseeker">Job Seeker</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                    <SelectItem value="smb_owner">SMB Owner</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceType">Source Type</Label>
                <Select value={sourceType} onValueChange={(v) => setSourceType(v as any)}>
                  <SelectTrigger id="sourceType">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="script">Script</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(sourceType === 'script' || sourceType === 'blog') && (
              <div className="space-y-2">
                <Label htmlFor="sourceId">Source ID (Optional)</Label>
                <Input
                  id="sourceId"
                  placeholder="Enter script/blog UUID"
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You can find IDs in the Personas, Scripts, or Blogs pages
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="url">Post URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postedAt">Posted At</Label>
              <Input
                id="postedAt"
                type="datetime-local"
                value={postedAt}
                onChange={(e) => setPostedAt(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                placeholder="e.g., launch, announcement, tutorial (comma-separated)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple tags with commas
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Logging Post...' : 'Log Post'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Your logged social media posts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No posts yet. Log your first post!</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Posted At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => {
                    const account = accounts.find((a) => a.id === post.social_account_id);
                    return (
                      <TableRow key={post.id}>
                        <TableCell>
                          {account ? (
                            <div>
                              <p className="font-medium">{account.platform}</p>
                              <p className="text-sm text-muted-foreground">{account.handle}</p>
                            </div>
                          ) : (
                            'Unknown'
                          )}
                        </TableCell>
                        <TableCell>{post.product}</TableCell>
                        <TableCell className="capitalize">{post.audience_type.replace('_', ' ')}</TableCell>
                        <TableCell>
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View Post →
                          </a>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(post.posted_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <AddMetricsDialog postId={post.id} toast={toast} onSuccess={loadData} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// ADD METRICS DIALOG
// ============================================================
function AddMetricsDialog({
  postId,
  toast,
  onSuccess,
}: {
  postId: string;
  toast: any;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [views, setViews] = useState('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [shares, setShares] = useState('');
  const [saves, setSaves] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);
      await createMetricsSnapshot(postId, {
        views: parseInt(views) || 0,
        likes: parseInt(likes) || 0,
        comments: parseInt(comments) || 0,
        shares: parseInt(shares) || 0,
        saves: parseInt(saves) || 0,
      });

      toast({
        title: 'Success',
        description: 'Metrics recorded successfully',
      });

      // Reset form
      setViews('');
      setLikes('');
      setComments('');
      setShares('');
      setSaves('');
      setOpen(false);

      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to record metrics',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Metrics
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Metrics Snapshot</DialogTitle>
          <DialogDescription>
            Record current performance metrics for this post
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="views">Views</Label>
              <Input
                id="views"
                type="number"
                min="0"
                placeholder="0"
                value={views}
                onChange={(e) => setViews(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="likes">Likes</Label>
              <Input
                id="likes"
                type="number"
                min="0"
                placeholder="0"
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Input
                id="comments"
                type="number"
                min="0"
                placeholder="0"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shares">Shares</Label>
              <Input
                id="shares"
                type="number"
                min="0"
                placeholder="0"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="saves">Saves</Label>
              <Input
                id="saves"
                type="number"
                min="0"
                placeholder="0"
                value={saves}
                onChange={(e) => setSaves(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Recording...' : 'Record Metrics'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// METRICS DASHBOARD TAB
// ============================================================
interface PostWithMetrics {
  post: SocialPost;
  account: SocialAccount | undefined;
  latestMetrics: any | null;
}

function MetricsDashboardTab({ toast }: { toast: any }) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [postsWithMetrics, setPostsWithMetrics] = useState<PostWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterProduct, setFilterProduct] = useState<string>('All');
  const [filterPlatform, setFilterPlatform] = useState<string>('All');
  const [filterBrand, setFilterBrand] = useState<string>('All');
  const [filterTag, setFilterTag] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [postsData, accountsData] = await Promise.all([
        listSocialPosts(),
        listSocialAccounts(),
      ]);

      setPosts(postsData);
      setAccounts(accountsData);

      // Fetch metrics for each post
      const postsWithMetricsData = await Promise.all(
        postsData.map(async (post) => {
          try {
            const metrics = await listMetricsForPost(post.id);
            const latestMetrics = metrics.length > 0 ? metrics[0] : null;
            const account = accountsData.find((a) => a.id === post.social_account_id);
            return { post, account, latestMetrics };
          } catch (error) {
            return { post, account: undefined, latestMetrics: null };
          }
        })
      );

      setPostsWithMetrics(postsWithMetricsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  // Apply filters
  const filteredPosts = postsWithMetrics.filter((item) => {
    // Product filter
    if (filterProduct !== 'All' && item.post.product !== filterProduct) {
      return false;
    }

    // Platform filter
    if (filterPlatform !== 'All' && item.account?.platform !== filterPlatform) {
      return false;
    }

    // Brand filter
    if (filterBrand !== 'All' && item.account?.brand !== filterBrand) {
      return false;
    }

    // Tag filter
    if (filterTag && !item.post.tags?.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase()))) {
      return false;
    }

    // Date range filter
    const postedDate = new Date(item.post.posted_at);
    if (filterDateFrom && postedDate < new Date(filterDateFrom)) {
      return false;
    }
    if (filterDateTo && postedDate > new Date(filterDateTo)) {
      return false;
    }

    return true;
  });

  // Calculate KPIs
  const totalViews = filteredPosts.reduce((sum, item) => sum + (item.latestMetrics?.views || 0), 0);
  const totalLikes = filteredPosts.reduce((sum, item) => sum + (item.latestMetrics?.likes || 0), 0);
  const totalComments = filteredPosts.reduce((sum, item) => sum + (item.latestMetrics?.comments || 0), 0);
  const totalShares = filteredPosts.reduce((sum, item) => sum + (item.latestMetrics?.shares || 0), 0);

  // Top posts by views
  const topPosts = [...filteredPosts]
    .filter((item) => item.latestMetrics !== null)
    .sort((a, b) => (b.latestMetrics?.views || 0) - (a.latestMetrics?.views || 0))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter your analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filterProduct">Product</Label>
              <Select value={filterProduct} onValueChange={setFilterProduct}>
                <SelectTrigger id="filterProduct">
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Products</SelectItem>
                  <SelectItem value="CareerScaleUp">CareerScaleUp</SelectItem>
                  <SelectItem value="Zevaux">Zevaux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterPlatform">Platform</Label>
              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger id="filterPlatform">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Platforms</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="reddit">Reddit</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="x">X (Twitter)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterBrand">Brand</Label>
              <Select value={filterBrand} onValueChange={setFilterBrand}>
                <SelectTrigger id="filterBrand">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Brands</SelectItem>
                  <SelectItem value="JCER">JCER (Master)</SelectItem>
                  <SelectItem value="CareerScaleUp">CareerScaleUp</SelectItem>
                  <SelectItem value="Zevaux">Zevaux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterTag">Tag</Label>
              <Input
                id="filterTag"
                placeholder="Filter by tag (e.g., launch)"
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterDateFrom">Date From</Label>
              <Input
                id="filterDateFrom"
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterDateTo">Date To</Label>
              <Input
                id="filterDateTo"
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts with metrics found. Log some posts and add metrics to see analytics!</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Views</CardDescription>
                <CardTitle className="text-3xl">{totalViews.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Across {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Likes</CardDescription>
                <CardTitle className="text-3xl">{totalLikes.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Avg: {filteredPosts.length > 0 ? Math.round(totalLikes / filteredPosts.length) : 0} per post
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Comments</CardDescription>
                <CardTitle className="text-3xl">{totalComments.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Avg: {filteredPosts.length > 0 ? Math.round(totalComments / filteredPosts.length) : 0} per post
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Shares</CardDescription>
                <CardTitle className="text-3xl">{totalShares.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Avg: {filteredPosts.length > 0 ? Math.round(totalShares / filteredPosts.length) : 0} per post
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Posts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Posts by Views</CardTitle>
              <CardDescription>
                Your best performing posts (showing top {topPosts.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topPosts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No posts with metrics yet
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                        <TableHead className="text-right">Likes</TableHead>
                        <TableHead className="text-right">Comments</TableHead>
                        <TableHead className="text-right">Shares</TableHead>
                        <TableHead>URL</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topPosts.map((item, index) => (
                        <TableRow key={item.post.id}>
                          <TableCell className="font-medium">#{index + 1}</TableCell>
                          <TableCell>
                            <div className="capitalize">{item.account?.platform || 'Unknown'}</div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[150px] truncate">
                              {item.account?.label || item.account?.handle || 'Unknown'}
                            </div>
                          </TableCell>
                          <TableCell>{item.post.product}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {(item.latestMetrics?.views || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {(item.latestMetrics?.likes || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {(item.latestMetrics?.comments || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {(item.latestMetrics?.shares || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <a
                              href={item.post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View →
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Key insights from your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                    <p className="text-2xl font-bold">
                      {totalViews > 0 ? ((totalLikes + totalComments + totalShares) / totalViews * 100).toFixed(2) : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (Likes + Comments + Shares) / Views
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="text-sm font-medium text-muted-foreground">Avg Views per Post</p>
                    <p className="text-2xl font-bold">
                      {filteredPosts.length > 0 ? Math.round(totalViews / filteredPosts.length).toLocaleString() : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Across {filteredPosts.length} posts
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="text-sm font-medium text-muted-foreground">Best Performing Post</p>
                    <p className="text-2xl font-bold">
                      {topPosts.length > 0 ? (topPosts[0].latestMetrics?.views || 0).toLocaleString() : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {topPosts.length > 0 ? `${topPosts[0].account?.platform} - ${topPosts[0].post.product}` : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Platform Breakdown */}
                {accounts.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-3">Posts by Platform</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {['linkedin', 'tiktok', 'reddit', 'youtube', 'instagram', 'x'].map((platform) => {
                        const count = filteredPosts.filter(
                          (item) => item.account?.platform === platform
                        ).length;
                        return (
                          <div key={platform} className="text-center p-3 border rounded-lg">
                            <p className="text-xs text-muted-foreground capitalize">{platform}</p>
                            <p className="text-xl font-bold">{count}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Product Breakdown */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-3">Posts by Product</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 border rounded-lg bg-blue-50">
                      <p className="text-sm text-muted-foreground">CareerScaleUp</p>
                      <p className="text-2xl font-bold">
                        {filteredPosts.filter((item) => item.post.product === 'CareerScaleUp').length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalViews > 0 ? (
                          (filteredPosts.filter((item) => item.post.product === 'CareerScaleUp').reduce((sum, item) => sum + (item.latestMetrics?.views || 0), 0) / totalViews * 100).toFixed(1)
                        ) : 0}% of views
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-purple-50">
                      <p className="text-sm text-muted-foreground">Zevaux</p>
                      <p className="text-2xl font-bold">
                        {filteredPosts.filter((item) => item.post.product === 'Zevaux').length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalViews > 0 ? (
                          (filteredPosts.filter((item) => item.post.product === 'Zevaux').reduce((sum, item) => sum + (item.latestMetrics?.views || 0), 0) / totalViews * 100).toFixed(1)
                        ) : 0}% of views
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

