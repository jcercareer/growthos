-- Add Brand and Tags Support to Social Analytics
-- Migration: 005_add_brand_and_tags.sql

-- ============================================================
-- ADD BRAND TO SOCIAL_ACCOUNTS
-- ============================================================
ALTER TABLE social_accounts
ADD COLUMN brand TEXT NOT NULL DEFAULT 'JCER'
CHECK (brand IN ('JCER', 'CareerScaleUp', 'Zevaux'));

-- Create index for brand filtering
CREATE INDEX idx_social_accounts_brand ON social_accounts(brand);

-- Comment for documentation
COMMENT ON COLUMN social_accounts.brand IS 'Brand/company this account belongs to: JCER (master), CareerScaleUp, or Zevaux';

-- ============================================================
-- ADD TAGS TO SOCIAL_POSTS
-- ============================================================
ALTER TABLE social_posts
ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Create GIN index for array searching
CREATE INDEX idx_social_posts_tags ON social_posts USING GIN(tags);

-- Comment for documentation
COMMENT ON COLUMN social_posts.tags IS 'Optional tags for categorization (e.g., launch, announcement, tutorial)';

