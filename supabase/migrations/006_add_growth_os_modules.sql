-- Growth OS New Modules Migration
-- Adds 9 new tables: funnels, lead_magnets, email_sms_sequences, social_packs,
-- paid_ads_packs, pricing_page_packs, social_proof_packs, viral_short_form_scripts, linkedin_viral_packs

-- ============================================================
-- FUNNELS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS funnels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  messaging_id UUID REFERENCES messaging(id) ON DELETE SET NULL,
  product TEXT NOT NULL CHECK (product IN ('CareerScaleUp', 'Zevaux')),
  audience_type TEXT NOT NULL CHECK (audience_type IN ('jobseeker', 'recruiter', 'smb_owner', 'other')),
  funnel_type TEXT NOT NULL CHECK (funnel_type IN ('landing_page', 'vsl', 'webinar', 'squeeze_page', 'sales_page')),
  tone TEXT NOT NULL CHECK (tone IN ('professional', 'bold', 'friendly', 'urgent')),
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  custom_notes TEXT
);

CREATE INDEX idx_funnels_persona_id ON funnels(persona_id);
CREATE INDEX idx_funnels_product ON funnels(product);
CREATE INDEX idx_funnels_audience_type ON funnels(audience_type);
CREATE INDEX idx_funnels_created_at ON funnels(created_at DESC);

-- ============================================================
-- LEAD MAGNETS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS lead_magnets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  messaging_id UUID REFERENCES messaging(id) ON DELETE SET NULL,
  product TEXT NOT NULL CHECK (product IN ('CareerScaleUp', 'Zevaux')),
  audience_type TEXT NOT NULL CHECK (audience_type IN ('jobseeker', 'recruiter', 'smb_owner', 'other')),
  lead_magnet_type TEXT NOT NULL CHECK (lead_magnet_type IN ('pdf_guide', 'checklist', 'template', 'ebook', 'cheatsheet', 'swipe_file')),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  email_scripts JSONB DEFAULT '[]'::jsonb,
  social_posting_scripts JSONB DEFAULT '[]'::jsonb,
  custom_notes TEXT
);

CREATE INDEX idx_lead_magnets_persona_id ON lead_magnets(persona_id);
CREATE INDEX idx_lead_magnets_product ON lead_magnets(product);
CREATE INDEX idx_lead_magnets_audience_type ON lead_magnets(audience_type);
CREATE INDEX idx_lead_magnets_created_at ON lead_magnets(created_at DESC);

-- ============================================================
-- EMAIL SMS SEQUENCES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS email_sms_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  messaging_id UUID REFERENCES messaging(id) ON DELETE SET NULL,
  product TEXT NOT NULL CHECK (product IN ('CareerScaleUp', 'Zevaux')),
  audience_type TEXT NOT NULL CHECK (audience_type IN ('jobseeker', 'recruiter', 'smb_owner', 'other')),
  sequence_type TEXT NOT NULL CHECK (sequence_type IN ('welcome', 'nurture', 'cart_abandonment', 're_engagement', 'product_launch')),
  title TEXT NOT NULL,
  emails JSONB NOT NULL DEFAULT '[]'::jsonb,
  sms_messages JSONB DEFAULT '[]'::jsonb,
  nurturing_logic TEXT,
  custom_notes TEXT
);

CREATE INDEX idx_email_sms_sequences_persona_id ON email_sms_sequences(persona_id);
CREATE INDEX idx_email_sms_sequences_product ON email_sms_sequences(product);
CREATE INDEX idx_email_sms_sequences_audience_type ON email_sms_sequences(audience_type);
CREATE INDEX idx_email_sms_sequences_created_at ON email_sms_sequences(created_at DESC);

-- ============================================================
-- SOCIAL PACKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS social_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  messaging_id UUID REFERENCES messaging(id) ON DELETE SET NULL,
  product TEXT NOT NULL CHECK (product IN ('CareerScaleUp', 'Zevaux')),
  audience_type TEXT NOT NULL CHECK (audience_type IN ('jobseeker', 'recruiter', 'smb_owner', 'other')),
  title TEXT NOT NULL,
  posts JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_notes TEXT
);

CREATE INDEX idx_social_packs_persona_id ON social_packs(persona_id);
CREATE INDEX idx_social_packs_product ON social_packs(product);
CREATE INDEX idx_social_packs_audience_type ON social_packs(audience_type);
CREATE INDEX idx_social_packs_created_at ON social_packs(created_at DESC);

-- ============================================================
-- PAID ADS PACKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS paid_ads_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  messaging_id UUID REFERENCES messaging(id) ON DELETE SET NULL,
  product TEXT NOT NULL CHECK (product IN ('CareerScaleUp', 'Zevaux')),
  audience_type TEXT NOT NULL CHECK (audience_type IN ('jobseeker', 'recruiter', 'smb_owner', 'other')),
  title TEXT NOT NULL,
  ads JSONB NOT NULL DEFAULT '[]'::jsonb,
  retargeting_scripts JSONB DEFAULT '[]'::jsonb,
  custom_notes TEXT
);

CREATE INDEX idx_paid_ads_packs_persona_id ON paid_ads_packs(persona_id);
CREATE INDEX idx_paid_ads_packs_product ON paid_ads_packs(product);
CREATE INDEX idx_paid_ads_packs_audience_type ON paid_ads_packs(audience_type);
CREATE INDEX idx_paid_ads_packs_created_at ON paid_ads_packs(created_at DESC);

-- ============================================================
-- PRICING PAGE PACKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS pricing_page_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  product TEXT NOT NULL CHECK (product IN ('CareerScaleUp', 'Zevaux')),
  title TEXT NOT NULL,
  headline TEXT NOT NULL,
  subheadline TEXT NOT NULL,
  tiers JSONB NOT NULL DEFAULT '[]'::jsonb,
  faq JSONB DEFAULT '[]'::jsonb,
  guarantee_section JSONB,
  custom_notes TEXT
);

CREATE INDEX idx_pricing_page_packs_product ON pricing_page_packs(product);
CREATE INDEX idx_pricing_page_packs_created_at ON pricing_page_packs(created_at DESC);

-- ============================================================
-- SOCIAL PROOF PACKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS social_proof_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  product TEXT NOT NULL CHECK (product IN ('CareerScaleUp', 'Zevaux')),
  title TEXT NOT NULL,
  testimonials JSONB NOT NULL DEFAULT '[]'::jsonb,
  case_studies JSONB DEFAULT '[]'::jsonb,
  metrics JSONB DEFAULT '[]'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb,
  founder_note JSONB,
  custom_notes TEXT
);

CREATE INDEX idx_social_proof_packs_product ON social_proof_packs(product);
CREATE INDEX idx_social_proof_packs_created_at ON social_proof_packs(created_at DESC);

-- ============================================================
-- VIRAL SHORT FORM SCRIPTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS viral_short_form_scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  messaging_id UUID REFERENCES messaging(id) ON DELETE SET NULL,
  product TEXT NOT NULL CHECK (product IN ('CareerScaleUp', 'Zevaux')),
  audience_type TEXT NOT NULL CHECK (audience_type IN ('jobseeker', 'recruiter', 'smb_owner', 'other')),
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram_reel', 'youtube_short')),
  title TEXT NOT NULL,
  hook TEXT NOT NULL,
  script TEXT NOT NULL,
  visual_prompts JSONB NOT NULL DEFAULT '[]'::jsonb,
  hashtags JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  custom_notes TEXT
);

CREATE INDEX idx_viral_short_form_scripts_persona_id ON viral_short_form_scripts(persona_id);
CREATE INDEX idx_viral_short_form_scripts_product ON viral_short_form_scripts(product);
CREATE INDEX idx_viral_short_form_scripts_audience_type ON viral_short_form_scripts(audience_type);
CREATE INDEX idx_viral_short_form_scripts_platform ON viral_short_form_scripts(platform);
CREATE INDEX idx_viral_short_form_scripts_created_at ON viral_short_form_scripts(created_at DESC);

-- ============================================================
-- LINKEDIN VIRAL PACKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS linkedin_viral_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  messaging_id UUID REFERENCES messaging(id) ON DELETE SET NULL,
  product TEXT NOT NULL CHECK (product IN ('CareerScaleUp', 'Zevaux')),
  audience_type TEXT NOT NULL CHECK (audience_type IN ('jobseeker', 'recruiter', 'smb_owner', 'other')),
  title TEXT NOT NULL,
  posts JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_notes TEXT
);

CREATE INDEX idx_linkedin_viral_packs_persona_id ON linkedin_viral_packs(persona_id);
CREATE INDEX idx_linkedin_viral_packs_product ON linkedin_viral_packs(product);
CREATE INDEX idx_linkedin_viral_packs_audience_type ON linkedin_viral_packs(audience_type);
CREATE INDEX idx_linkedin_viral_packs_created_at ON linkedin_viral_packs(created_at DESC);

-- ============================================================
-- TRIGGERS FOR AUTO-UPDATE updated_at
-- ============================================================
CREATE TRIGGER update_funnels_updated_at BEFORE UPDATE ON funnels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_magnets_updated_at BEFORE UPDATE ON lead_magnets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_sms_sequences_updated_at BEFORE UPDATE ON email_sms_sequences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_packs_updated_at BEFORE UPDATE ON social_packs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paid_ads_packs_updated_at BEFORE UPDATE ON paid_ads_packs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_page_packs_updated_at BEFORE UPDATE ON pricing_page_packs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_proof_packs_updated_at BEFORE UPDATE ON social_proof_packs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_viral_short_form_scripts_updated_at BEFORE UPDATE ON viral_short_form_scripts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_linkedin_viral_packs_updated_at BEFORE UPDATE ON linkedin_viral_packs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sms_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE paid_ads_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_page_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_proof_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_short_form_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_viral_packs ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for service role
CREATE POLICY "Enable all access for service role" ON funnels
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON lead_magnets
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON email_sms_sequences
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON social_packs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON paid_ads_packs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON pricing_page_packs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON social_proof_packs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON viral_short_form_scripts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON linkedin_viral_packs
  FOR ALL USING (true) WITH CHECK (true);

