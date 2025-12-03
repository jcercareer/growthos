import { z } from 'zod';

// ============================================================
// PERSONA SCHEMA
// ============================================================
export const PersonaSchema = z.object({
  name: z.string().min(1).max(200),
  product: z.enum(['CareerScaleUp', 'Zevaux']),
  audienceType: z.enum(['jobseeker', 'recruiter']),
  ageRange: z.string().min(1).max(50),
  location: z.string().min(1).max(100),
  roleOrTitle: z.string().min(1).max(200),
  industry: z.string().min(1).max(200),
  description: z.string().min(50).max(3000),
  painPoints: z.array(z.string().min(1)).min(3).max(10),
  goals: z.array(z.string().min(1)).min(3).max(10),
  buyingTriggers: z.array(z.string().min(1)).min(3).max(10),
});

export type PersonaAIOutput = z.infer<typeof PersonaSchema>;

// ============================================================
// MESSAGING SCHEMA
// ============================================================
export const MessagingSchema = z.object({
  headline: z.string().min(10).max(80),
  emotional_hook: z.string().min(10).max(500),
  elevator_pitch: z.string().min(20).max(1000),
  viral_taglines: z.array(z.string().min(5).max(200)).min(3).max(5),
});

export type MessagingAIOutput = z.infer<typeof MessagingSchema>;

// ============================================================
// SCRIPT SCHEMA
// ============================================================
export const ScriptSchema = z.object({
  hook: z.string().min(10).max(500),
  body: z.string().min(50).max(3000),
  cta: z.string().min(5).max(300),
  notes: z.string().optional(),
});

export type ScriptAIOutput = z.infer<typeof ScriptSchema>;

// ============================================================
// BLOG OUTLINE SCHEMA
// ============================================================
export const BlogOutlineSchema = z.object({
  title: z.string().min(10).max(200),
  sections: z
    .array(
      z.object({
        heading: z.string().min(5).max(200),
        bullets: z.array(z.string().min(5).max(500)).min(1).max(10),
      })
    )
    .min(3)
    .max(10),
  seo_keywords: z.array(z.string().min(2).max(100)).min(3).max(15).optional(),
  meta_description: z.string().min(50).max(160).optional(),
});

export type BlogOutlineAIOutput = z.infer<typeof BlogOutlineSchema>;

// ============================================================
// SOCIAL ANALYTICS SCHEMAS
// ============================================================
export const SocialAccountSchema = z.object({
  platform: z.enum(['linkedin', 'tiktok', 'reddit', 'youtube', 'instagram', 'x']),
  handle: z.string().min(1).max(100),
  profile_url: z.string().url().max(500),
  label: z.string().min(1).max(200),
  brand: z.enum(['JCER', 'CareerScaleUp', 'Zevaux']),
});

export const SocialPostSchema = z.object({
  social_account_id: z.string().uuid(),
  product: z.enum(['CareerScaleUp', 'Zevaux']),
  audience_type: z.enum(['jobseeker', 'recruiter', 'smb_owner', 'other']),
  source_type: z.enum(['script', 'blog', 'other']),
  source_id: z.string().uuid().nullable().optional(),
  platform_post_id: z.string().max(200).nullable().optional(),
  url: z.string().url().max(1000),
  posted_at: z.string().datetime(),
  tags: z.array(z.string().min(1).max(50)).optional(),
});

export const MetricsSnapshotSchema = z.object({
  social_post_id: z.string().uuid(),
  captured_at: z.string().datetime().optional(),
  views: z.number().int().min(0),
  likes: z.number().int().min(0),
  comments: z.number().int().min(0),
  shares: z.number().int().min(0),
  saves: z.number().int().min(0),
});

// ============================================================
// FUNNEL SCHEMA
// ============================================================
export const FunnelSchema = z.object({
  hero_section: z.object({
    hook: z.string().min(10).max(200),
    subhook: z.string().min(10).max(300),
    cta_text: z.string().min(3).max(50),
    cta_link: z.string().url().optional(),
    media_url: z.string().url().optional(),
  }),
  social_proof: z.object({
    testimonials: z.array(z.string().min(10).max(500)).optional(),
    metrics: z.array(z.string().min(5).max(100)).optional(),
    logos: z.array(z.string()).optional(),
  }).optional(),
  feature_blocks: z.array(z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(500),
    icon: z.string().optional(),
  })).min(3).max(8),
  value_stack: z.array(z.string().min(5).max(200)).min(3).max(10),
  urgency_section: z.object({
    headline: z.string().min(10).max(100),
    copy: z.string().min(20).max(500),
  }).optional(),
  final_cta: z.object({
    text: z.string().min(3).max(50),
    link: z.string().url().optional(),
  }),
  color_scheme: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }).optional(),
});

export type FunnelAIOutput = z.infer<typeof FunnelSchema>;

// ============================================================
// LEAD MAGNET SCHEMA
// ============================================================
export const LeadMagnetSchema = z.object({
  title: z.string().min(10).max(200),
  subtitle: z.string().min(10).max(300),
  overview: z.string().min(50).max(1000),
  pages: z.array(z.object({
    page_number: z.number().int().min(1),
    title: z.string().min(5).max(200),
    description: z.string().min(20).max(1000),
  })).min(3).max(20),
  benefits: z.array(z.string().min(10).max(200)).min(3).max(10),
  cta_copy: z.string().min(10).max(200),
  email_scripts: z.array(z.object({
    subject: z.string().min(5).max(100),
    preview_text: z.string().min(10).max(100),
    body: z.string().min(50).max(2000),
  })).min(1).max(5),
  social_posting_scripts: z.array(z.string().min(20).max(500)).min(3).max(8),
});

export type LeadMagnetAIOutput = z.infer<typeof LeadMagnetSchema>;

// ============================================================
// EMAIL SMS SEQUENCE SCHEMA
// ============================================================
export const EmailSmsSequenceSchema = z.object({
  title: z.string().min(10).max(200),
  emails: z.array(z.object({
    day: z.number().int().min(0).max(30),
    subject: z.string().min(5).max(100),
    preview_text: z.string().min(10).max(100),
    body: z.string().min(50).max(3000),
    cta_text: z.string().min(3).max(50),
    cta_link: z.string().url().optional(),
  })).min(3).max(10),
  sms_messages: z.array(z.object({
    day: z.number().int().min(0).max(30),
    message: z.string().min(10).max(160),
    cta_link: z.string().url().optional(),
  })).min(0).max(5).optional(),
  nurturing_logic: z.string().min(20).max(1000),
});

export type EmailSmsSequenceAIOutput = z.infer<typeof EmailSmsSequenceSchema>;

// ============================================================
// SOCIAL PACK SCHEMA
// ============================================================
export const SocialPackSchema = z.object({
  title: z.string().min(10).max(200),
  posts: z.array(z.object({
    platform: z.enum(['linkedin', 'tiktok', 'reddit', 'youtube', 'instagram', 'x']),
    content: z.string().min(20).max(3000),
    hook: z.string().min(10).max(200).optional(),
    cta: z.string().min(5).max(200).optional(),
    hashtags: z.array(z.string().min(2).max(50)).optional(),
    media_suggestions: z.string().min(10).max(500).optional(),
  })).min(3).max(15),
});

export type SocialPackAIOutput = z.infer<typeof SocialPackSchema>;

// ============================================================
// PAID ADS PACK SCHEMA
// ============================================================
export const PaidAdsPackSchema = z.object({
  title: z.string().min(10).max(200),
  ads: z.array(z.object({
    platform: z.enum(['tiktok', 'instagram', 'facebook', 'google_search', 'linkedin', 'youtube']),
    ad_type: z.string().min(3).max(100),
    headline: z.string().min(5).max(100).optional(),
    primary_text: z.string().min(10).max(1000).optional(),
    description: z.string().min(10).max(500).optional(),
    script: z.string().min(20).max(2000).optional(),
    cta_text: z.string().min(3).max(50),
    targeting_notes: z.string().min(10).max(500).optional(),
    visual_prompt: z.string().min(10).max(500).optional(),
  })).min(3).max(15),
  retargeting_scripts: z.array(z.string().min(20).max(1000)).min(0).max(5).optional(),
});

export type PaidAdsPackAIOutput = z.infer<typeof PaidAdsPackSchema>;

// ============================================================
// PRICING PAGE PACK SCHEMA
// ============================================================
export const PricingPagePackSchema = z.object({
  title: z.string().min(10).max(200),
  headline: z.string().min(10).max(150),
  subheadline: z.string().min(20).max(300),
  tiers: z.array(z.object({
    tier: z.enum(['free', 'basic', 'pro', 'enterprise']),
    name: z.string().min(3).max(50),
    price: z.string().min(1).max(50),
    billing_period: z.string().min(3).max(50),
    features: z.array(z.string().min(5).max(200)).min(3).max(15),
    cta_text: z.string().min(3).max(50),
    cta_link: z.string().url().optional(),
    highlighted: z.boolean().optional(),
  })).min(2).max(5),
  faq: z.array(z.object({
    question: z.string().min(10).max(200),
    answer: z.string().min(20).max(1000),
  })).min(3).max(10).optional(),
  guarantee_section: z.object({
    headline: z.string().min(10).max(100),
    copy: z.string().min(20).max(500),
  }).optional(),
});

export type PricingPagePackAIOutput = z.infer<typeof PricingPagePackSchema>;

// ============================================================
// SOCIAL PROOF PACK SCHEMA
// ============================================================
export const SocialProofPackSchema = z.object({
  title: z.string().min(10).max(200),
  testimonials: z.array(z.object({
    quote: z.string().min(20).max(500),
    author_name: z.string().min(2).max(100).optional(),
    author_title: z.string().min(2).max(200).optional(),
    author_avatar: z.string().url().optional(),
    rating: z.number().int().min(1).max(5).optional(),
  })).min(3).max(15),
  case_studies: z.array(z.object({
    title: z.string().min(10).max(200),
    summary: z.string().min(50).max(1000),
    results: z.array(z.string().min(10).max(200)).min(3).max(8),
  })).min(0).max(5).optional(),
  metrics: z.array(z.object({
    value: z.string().min(1).max(50),
    label: z.string().min(3).max(100),
  })).min(3).max(10).optional(),
  reviews: z.array(z.object({
    source: z.string().min(3).max(100),
    rating: z.number().min(1).max(5),
    quote: z.string().min(20).max(500),
  })).min(0).max(10).optional(),
  founder_note: z.object({
    author: z.string().min(2).max(100),
    title: z.string().min(2).max(100),
    message: z.string().min(50).max(1000),
    photo_url: z.string().url().optional(),
  }).optional(),
});

export type SocialProofPackAIOutput = z.infer<typeof SocialProofPackSchema>;

// ============================================================
// VIRAL SHORT FORM SCRIPT SCHEMA
// ============================================================
export const ViralShortFormScriptSchema = z.object({
  title: z.string().min(10).max(200),
  hook: z.string().min(10).max(200),
  script: z.string().min(50).max(2000),
  visual_prompts: z.array(z.string().min(10).max(300)).min(3).max(10),
  hashtags: z.array(z.string().min(2).max(50)).min(3).max(15),
  cta: z.string().min(5).max(200),
  duration_seconds: z.number().int().min(7).max(180),
});

export type ViralShortFormScriptAIOutput = z.infer<typeof ViralShortFormScriptSchema>;

// ============================================================
// LINKEDIN VIRAL PACK SCHEMA
// ============================================================
export const LinkedInViralPackSchema = z.object({
  title: z.string().min(10).max(200),
  posts: z.array(z.object({
    post_type: z.enum(['carousel', 'text_only', 'video', 'poll', 'document']),
    hook: z.string().min(10).max(200),
    body: z.string().min(50).max(3000),
    cta: z.string().min(5).max(200).optional(),
    hashtags: z.array(z.string().min(2).max(50)).optional(),
    carousel_slides: z.array(z.object({
      slide_number: z.number().int().min(1).max(20),
      title: z.string().min(5).max(100),
      content: z.string().min(10).max(500),
    })).min(0).max(20).optional(),
    visual_prompt: z.string().min(10).max(500).optional(),
  })).min(3).max(10),
});

export type LinkedInViralPackAIOutput = z.infer<typeof LinkedInViralPackSchema>;

