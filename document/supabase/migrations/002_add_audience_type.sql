-- Add audience_type to personas table
-- Migration: 002_add_audience_type.sql

-- Add the audience_type column with default value
ALTER TABLE personas 
ADD COLUMN audience_type TEXT NOT NULL DEFAULT 'jobseeker'
CHECK (audience_type IN ('jobseeker', 'recruiter'));

-- Add index for filtering by audience type
CREATE INDEX idx_personas_audience_type ON personas(audience_type);

-- Add composite index for product + audience_type queries
CREATE INDEX idx_personas_product_audience ON personas(product, audience_type);

-- Add comment for documentation
COMMENT ON COLUMN personas.audience_type IS 'Target audience: jobseeker (default) or recruiter. Used primarily for CareerScaleUp to differentiate between job seekers and hiring teams.';

