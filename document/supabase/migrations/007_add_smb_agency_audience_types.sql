-- Add SMB and Agency audience types to personas table
-- Migration: 007_add_smb_agency_audience_types.sql
-- Purpose: Enable Zevaux personas (SMB owners and agency owners)

-- Drop the old constraint
ALTER TABLE personas 
DROP CONSTRAINT IF EXISTS personas_audience_type_check;

-- Add new constraint with all audience types
ALTER TABLE personas 
ADD CONSTRAINT personas_audience_type_check 
CHECK (audience_type IN ('jobseeker', 'recruiter', 'smb_owner', 'agency_owner', 'other'));

-- Update the column comment
COMMENT ON COLUMN personas.audience_type IS 'Target audience: jobseeker (CareerScaleUp), recruiter (CareerScaleUp), smb_owner (Zevaux), agency_owner (Zevaux), or other. Zevaux personas must be smb_owner or agency_owner (business decision-makers), never jobseeker or recruiter.';

