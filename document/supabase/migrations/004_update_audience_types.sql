-- Update Audience Types to Support Additional Values
-- Migration: 004_update_audience_types.sql

-- Drop the old CHECK constraint
ALTER TABLE social_posts
DROP CONSTRAINT IF EXISTS social_posts_audience_type_check;

-- Add new CHECK constraint with additional audience types
ALTER TABLE social_posts
ADD CONSTRAINT social_posts_audience_type_check
CHECK (audience_type IN ('jobseeker', 'recruiter', 'smb_owner', 'other'));

-- Comment for documentation
COMMENT ON COLUMN social_posts.audience_type IS 'Target audience: jobseeker, recruiter, smb_owner, or other';

