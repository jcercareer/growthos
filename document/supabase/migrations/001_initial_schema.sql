-- Growth OS Initial Schema Migration
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PERSONAS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  product TEXT NOT NULL CHECK (product IN ('CareerScaleUp', 'Zevaux')),
  name TEXT NOT NULL,
  age_range TEXT NOT NULL,
  description TEXT NOT NULL,
  pain_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  buying_triggers JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Create index on product for faster filtering
CREATE INDEX idx_personas_product ON personas(product);
CREATE INDEX idx_personas_created_at ON personas(created_at DESC);

-- ============================================================
-- MESSAGING TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS messaging (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  emotional_hook TEXT NOT NULL,
  elevator_pitch TEXT NOT NULL,
  viral_taglines JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Create indexes for foreign key and filtering
CREATE INDEX idx_messaging_persona_id ON messaging(persona_id);
CREATE INDEX idx_messaging_created_at ON messaging(created_at DESC);

-- ============================================================
-- SCRIPTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  messaging_id UUID REFERENCES messaging(id) ON DELETE SET NULL,
  script_type TEXT NOT NULL DEFAULT 'short_form',
  content TEXT NOT NULL,
  notes TEXT
);

-- Create indexes for foreign keys and filtering
CREATE INDEX idx_scripts_persona_id ON scripts(persona_id);
CREATE INDEX idx_scripts_messaging_id ON scripts(messaging_id);
CREATE INDEX idx_scripts_created_at ON scripts(created_at DESC);

-- ============================================================
-- BLOG OUTLINES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_outlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  messaging_id UUID REFERENCES messaging(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  outline JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Create indexes for foreign keys and filtering
CREATE INDEX idx_blog_outlines_persona_id ON blog_outlines(persona_id);
CREATE INDEX idx_blog_outlines_messaging_id ON blog_outlines(messaging_id);
CREATE INDEX idx_blog_outlines_created_at ON blog_outlines(created_at DESC);

-- ============================================================
-- TRIGGER TO AUTO-UPDATE updated_at TIMESTAMP
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_personas_updated_at BEFORE UPDATE ON personas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messaging_updated_at BEFORE UPDATE ON messaging
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON scripts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_outlines_updated_at BEFORE UPDATE ON blog_outlines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Note: For internal tool, you may want to disable RLS or set permissive policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE messaging ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_outlines ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for service role (backend will use service key)
-- These policies allow full access when using the service role key
CREATE POLICY "Enable all access for service role" ON personas
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON messaging
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON scripts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for service role" ON blog_outlines
  FOR ALL USING (true) WITH CHECK (true);

