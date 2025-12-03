-- Social Analytics Schema
-- Migration: 003_add_social_analytics.sql

-- ============================================================
-- SOCIAL ACCOUNTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'tiktok', 'reddit', 'youtube', 'instagram', 'x')),
  handle TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  label TEXT NOT NULL
);

-- Create indexes for social_accounts
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_social_accounts_created_at ON social_accounts(created_at DESC);

-- Unique constraint on platform + handle combination
CREATE UNIQUE INDEX idx_social_accounts_platform_handle ON social_accounts(platform, handle);

-- ============================================================
-- SOCIAL POSTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  social_account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  product TEXT NOT NULL CHECK (product IN ('CareerScaleUp', 'Zevaux')),
  audience_type TEXT NOT NULL DEFAULT 'jobseeker' CHECK (audience_type IN ('jobseeker', 'recruiter', 'smb_owner', 'other')),
  source_type TEXT NOT NULL DEFAULT 'script' CHECK (source_type IN ('script', 'blog', 'other')),
  source_id UUID NULL,
  platform_post_id TEXT NULL,
  url TEXT NOT NULL,
  posted_at TIMESTAMPTZ NOT NULL
);

-- Create indexes for social_posts
CREATE INDEX idx_social_posts_social_account_id ON social_posts(social_account_id);
CREATE INDEX idx_social_posts_product ON social_posts(product);
CREATE INDEX idx_social_posts_audience_type ON social_posts(audience_type);
CREATE INDEX idx_social_posts_source_type ON social_posts(source_type);
CREATE INDEX idx_social_posts_posted_at ON social_posts(posted_at DESC);
CREATE INDEX idx_social_posts_created_at ON social_posts(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_social_posts_product_audience ON social_posts(product, audience_type);

-- ============================================================
-- SOCIAL POST METRICS SNAPSHOTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS social_post_metrics_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  social_post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  saves INTEGER NOT NULL DEFAULT 0
);

-- Create indexes for metrics_snapshots
CREATE INDEX idx_metrics_snapshots_social_post_id ON social_post_metrics_snapshots(social_post_id);
CREATE INDEX idx_metrics_snapshots_captured_at ON social_post_metrics_snapshots(captured_at DESC);
CREATE INDEX idx_metrics_snapshots_created_at ON social_post_metrics_snapshots(created_at DESC);

-- ============================================================
-- TRIGGER TO AUTO-UPDATE updated_at TIMESTAMP
-- ============================================================
-- Apply trigger to social_accounts
CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to social_posts
CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Enable RLS on all tables
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_post_metrics_snapshots ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for service role
CREATE POLICY "Enable all access for service role" ON social_accounts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON social_posts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON social_post_metrics_snapshots
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================
COMMENT ON TABLE social_accounts IS 'Social media accounts for JCER products (CareerScaleUp, Zevaux)';
COMMENT ON TABLE social_posts IS 'Individual posts on social platforms, linked to generated content';
COMMENT ON TABLE social_post_metrics_snapshots IS 'Time-series snapshots of post performance metrics';

COMMENT ON COLUMN social_posts.source_type IS 'Type of content source: script, blog, or other';
COMMENT ON COLUMN social_posts.source_id IS 'Optional reference to scripts.id or blog_outlines.id';
COMMENT ON COLUMN social_posts.platform_post_id IS 'External platform ID (e.g., LinkedIn post ID)';

