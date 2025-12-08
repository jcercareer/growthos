// Shared types and utilities for Growth OS

export type Product = 'CareerScaleUp' | 'Zevaux';
export type AudienceType = 'jobseeker' | 'recruiter' | 'smb_owner' | 'agency_owner' | 'other';

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// PERSONA TYPES
// ============================================================
export interface Persona extends BaseEntity {
  product: Product;
  audience_type: AudienceType;
  name: string;
  age_range: string;
  description: string;
  pain_points: string[];
  goals: string[];
  buying_triggers: string[];
}

export interface CreatePersonaInput {
  product: Product;
  audience_type: AudienceType;
  name: string;
  age_range: string;
  description: string;
  pain_points: string[];
  goals: string[];
  buying_triggers: string[];
}

// ============================================================
// MESSAGING TYPES
// ============================================================
export interface Messaging extends BaseEntity {
  persona_id: string;
  headline: string;
  emotional_hook: string;
  elevator_pitch: string;
  viral_taglines: string[];
}

export interface CreateMessagingInput {
  persona_id: string;
  headline: string;
  emotional_hook: string;
  elevator_pitch: string;
  viral_taglines: string[];
}

// ============================================================
// SCRIPT TYPES
// ============================================================
export interface Script extends BaseEntity {
  persona_id: string;
  messaging_id: string | null;
  script_type: string;
  content: string;
  notes: string | null;
}

export interface CreateScriptInput {
  persona_id: string;
  messaging_id?: string | null;
  script_type: string;
  content: string;
  notes?: string | null;
}

// ============================================================
// BLOG OUTLINE TYPES
// ============================================================
export interface BlogOutline extends BaseEntity {
  persona_id: string;
  messaging_id: string | null;
  title: string;
  outline: {
    sections?: Array<{
      title: string;
      points: string[];
    }>;
    seo_keywords?: string[];
    meta_description?: string;
  };
}

export interface CreateBlogOutlineInput {
  persona_id: string;
  messaging_id?: string | null;
  title: string;
  outline: {
    sections?: Array<{
      title: string;
      points: string[];
    }>;
    seo_keywords?: string[];
    meta_description?: string;
  };
}

// GrowthOS structured content types
export * from './growthos';

// ============================================================
// SOCIAL ANALYTICS TYPES
// ============================================================
export type SocialPlatform = 'linkedin' | 'tiktok' | 'reddit' | 'youtube' | 'instagram' | 'x';
export type SourceType = 'script' | 'blog' | 'other';
export type Brand = 'JCER' | 'CareerScaleUp' | 'Zevaux';

export interface SocialAccount extends BaseEntity {
  platform: SocialPlatform;
  handle: string;
  profile_url: string;
  label: string;
  brand: Brand;
}

export interface CreateSocialAccountInput {
  platform: SocialPlatform;
  handle: string;
  profile_url: string;
  label: string;
  brand: Brand;
}

export interface SocialPost extends BaseEntity {
  social_account_id: string;
  product: Product;
  audience_type: AudienceType;
  source_type: SourceType;
  source_id: string | null;
  platform_post_id: string | null;
  url: string;
  posted_at: string;
  tags: string[];
}

export interface CreateSocialPostInput {
  social_account_id: string;
  product: Product;
  audience_type: AudienceType;
  source_type: SourceType;
  source_id?: string | null;
  platform_post_id?: string | null;
  url: string;
  posted_at: string;
  tags?: string[];
}

export interface SocialPostMetricsSnapshot extends BaseEntity {
  social_post_id: string;
  captured_at: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

export interface CreateMetricsSnapshotInput {
  social_post_id: string;
  captured_at?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

// ============================================================
// FUNNEL TYPES
// ============================================================
export type FunnelType = 'landing_page' | 'vsl' | 'webinar' | 'squeeze_page' | 'sales_page';
export type ToneType = 'professional' | 'bold' | 'friendly' | 'urgent';

export interface Funnel extends BaseEntity {
  persona_id: string;
  messaging_id: string | null;
  product: Product;
  audience_type: AudienceType;
  funnel_type: FunnelType;
  tone: ToneType;
  title: string;
  content: {
    hero_section?: {
      hook: string;
      subhook: string;
      cta_text: string;
      cta_link?: string;
      media_url?: string;
    };
    social_proof?: {
      testimonials?: string[];
      metrics?: string[];
      logos?: string[];
    };
    feature_blocks?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
    value_stack?: string[];
    urgency_section?: {
      headline: string;
      copy: string;
    };
    final_cta?: {
      text: string;
      link?: string;
    };
    color_scheme?: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  custom_notes?: string;
}

export interface CreateFunnelInput {
  persona_id: string;
  messaging_id?: string | null;
  product: Product;
  audience_type: AudienceType;
  funnel_type: FunnelType;
  tone: ToneType;
  title: string;
  content: {
    hero_section?: {
      hook: string;
      subhook: string;
      cta_text: string;
      cta_link?: string;
      media_url?: string;
    };
    social_proof?: {
      testimonials?: string[];
      metrics?: string[];
      logos?: string[];
    };
    feature_blocks?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
    value_stack?: string[];
    urgency_section?: {
      headline: string;
      copy: string;
    };
    final_cta?: {
      text: string;
      link?: string;
    };
    color_scheme?: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  custom_notes?: string;
}

// ============================================================
// LEAD MAGNET TYPES
// ============================================================
export type LeadMagnetType = 'pdf_guide' | 'checklist' | 'template' | 'ebook' | 'cheatsheet' | 'swipe_file';

export interface LeadMagnet extends BaseEntity {
  persona_id: string;
  messaging_id: string | null;
  product: Product;
  audience_type: AudienceType;
  lead_magnet_type: LeadMagnetType;
  title: string;
  subtitle: string;
  content: {
    overview: string;
    pages?: Array<{
      page_number: number;
      title: string;
      description: string;
    }>;
    benefits: string[];
    cta_copy: string;
    download_url?: string;
  };
  email_scripts?: {
    subject: string;
    preview_text: string;
    body: string;
  }[];
  social_posting_scripts?: string[];
  custom_notes?: string;
}

export interface CreateLeadMagnetInput {
  persona_id: string;
  messaging_id?: string | null;
  product: Product;
  audience_type: AudienceType;
  lead_magnet_type: LeadMagnetType;
  title: string;
  subtitle: string;
  content: {
    overview: string;
    pages?: Array<{
      page_number: number;
      title: string;
      description: string;
    }>;
    benefits: string[];
    cta_copy: string;
    download_url?: string;
  };
  email_scripts?: {
    subject: string;
    preview_text: string;
    body: string;
  }[];
  social_posting_scripts?: string[];
  custom_notes?: string;
}

// ============================================================
// EMAIL & SMS SEQUENCE TYPES
// ============================================================
export type SequenceType = 'welcome' | 'nurture' | 'cart_abandonment' | 're_engagement' | 'product_launch';

export interface EmailSmsSequence extends BaseEntity {
  persona_id: string;
  messaging_id: string | null;
  product: Product;
  audience_type: AudienceType;
  sequence_type: SequenceType;
  title: string;
  emails: Array<{
    day: number;
    subject: string;
    preview_text: string;
    body: string;
    cta_text: string;
    cta_link?: string;
  }>;
  sms_messages?: Array<{
    day: number;
    message: string;
    cta_link?: string;
  }>;
  nurturing_logic?: string;
  custom_notes?: string;
}

export interface CreateEmailSmsSequenceInput {
  persona_id: string;
  messaging_id?: string | null;
  product: Product;
  audience_type: AudienceType;
  sequence_type: SequenceType;
  title: string;
  emails: Array<{
    day: number;
    subject: string;
    preview_text: string;
    body: string;
    cta_text: string;
    cta_link?: string;
  }>;
  sms_messages?: Array<{
    day: number;
    message: string;
    cta_link?: string;
  }>;
  nurturing_logic?: string;
  custom_notes?: string;
}

// ============================================================
// SOCIAL PACK TYPES
// ============================================================
export interface SocialPack extends BaseEntity {
  persona_id: string;
  messaging_id: string | null;
  product: Product;
  audience_type: AudienceType;
  title: string;
  posts: Array<{
    platform: SocialPlatform;
    content: string;
    hook?: string;
    cta?: string;
    hashtags?: string[];
    media_suggestions?: string;
  }>;
  custom_notes?: string;
}

export interface CreateSocialPackInput {
  persona_id: string;
  messaging_id?: string | null;
  product: Product;
  audience_type: AudienceType;
  title: string;
  posts: Array<{
    platform: SocialPlatform;
    content: string;
    hook?: string;
    cta?: string;
    hashtags?: string[];
    media_suggestions?: string;
  }>;
  custom_notes?: string;
}

// ============================================================
// PAID ADS PACK TYPES
// ============================================================
export type AdPlatform = 'tiktok' | 'instagram' | 'facebook' | 'google_search' | 'linkedin' | 'youtube';

export interface PaidAdsPack extends BaseEntity {
  persona_id: string;
  messaging_id: string | null;
  product: Product;
  audience_type: AudienceType;
  title: string;
  ads: Array<{
    platform: AdPlatform;
    ad_type: string;
    headline?: string;
    primary_text?: string;
    description?: string;
    script?: string;
    cta_text: string;
    targeting_notes?: string;
    visual_prompt?: string;
  }>;
  retargeting_scripts?: string[];
  custom_notes?: string;
}

export interface CreatePaidAdsPackInput {
  persona_id: string;
  messaging_id?: string | null;
  product: Product;
  audience_type: AudienceType;
  title: string;
  ads: Array<{
    platform: AdPlatform;
    ad_type: string;
    headline?: string;
    primary_text?: string;
    description?: string;
    script?: string;
    cta_text: string;
    targeting_notes?: string;
    visual_prompt?: string;
  }>;
  retargeting_scripts?: string[];
  custom_notes?: string;
}

// ============================================================
// PRICING PAGE PACK TYPES
// ============================================================
export type PricingTier = 'free' | 'basic' | 'pro' | 'enterprise';

export interface PricingPagePack extends BaseEntity {
  product: Product;
  title: string;
  headline: string;
  subheadline: string;
  tiers: Array<{
    tier: PricingTier;
    name: string;
    price: string;
    billing_period: string;
    features: string[];
    cta_text: string;
    cta_link?: string;
    highlighted?: boolean;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  guarantee_section?: {
    headline: string;
    copy: string;
  };
  custom_notes?: string;
}

export interface CreatePricingPagePackInput {
  product: Product;
  title: string;
  headline: string;
  subheadline: string;
  tiers: Array<{
    tier: PricingTier;
    name: string;
    price: string;
    billing_period: string;
    features: string[];
    cta_text: string;
    cta_link?: string;
    highlighted?: boolean;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  guarantee_section?: {
    headline: string;
    copy: string;
  };
  custom_notes?: string;
}

// ============================================================
// SOCIAL PROOF PACK TYPES
// ============================================================
export interface SocialProofPack extends BaseEntity {
  product: Product;
  title: string;
  testimonials: Array<{
    quote: string;
    author_name?: string;
    author_title?: string;
    author_avatar?: string;
    rating?: number;
  }>;
  case_studies?: Array<{
    title: string;
    summary: string;
    results: string[];
  }>;
  metrics?: Array<{
    value: string;
    label: string;
  }>;
  reviews?: Array<{
    source: string;
    rating: number;
    quote: string;
  }>;
  founder_note?: {
    author: string;
    title: string;
    message: string;
    photo_url?: string;
  };
  custom_notes?: string;
}

export interface CreateSocialProofPackInput {
  product: Product;
  title: string;
  testimonials: Array<{
    quote: string;
    author_name?: string;
    author_title?: string;
    author_avatar?: string;
    rating?: number;
  }>;
  case_studies?: Array<{
    title: string;
    summary: string;
    results: string[];
  }>;
  metrics?: Array<{
    value: string;
    label: string;
  }>;
  reviews?: Array<{
    source: string;
    rating: number;
    quote: string;
  }>;
  founder_note?: {
    author: string;
    title: string;
    message: string;
    photo_url?: string;
  };
  custom_notes?: string;
}

// ============================================================
// VIRAL SHORT-FORM SCRIPT TYPES
// ============================================================
export type ShortFormPlatform = 'tiktok' | 'instagram_reel' | 'youtube_short';

export interface ViralShortFormScript extends BaseEntity {
  persona_id: string;
  messaging_id: string | null;
  product: Product;
  audience_type: AudienceType;
  platform: ShortFormPlatform;
  title: string;
  hook: string;
  script: string;
  visual_prompts: string[];
  hashtags: string[];
  cta: string;
  duration_seconds: number;
  custom_notes?: string;
}

export interface CreateViralShortFormScriptInput {
  persona_id: string;
  messaging_id?: string | null;
  product: Product;
  audience_type: AudienceType;
  platform: ShortFormPlatform;
  title: string;
  hook: string;
  script: string;
  visual_prompts: string[];
  hashtags: string[];
  cta: string;
  duration_seconds: number;
  custom_notes?: string;
}

// ============================================================
// LINKEDIN VIRAL PACK TYPES
// ============================================================
export type LinkedInPostType = 'carousel' | 'text_only' | 'video' | 'poll' | 'document';

export interface LinkedInViralPack extends BaseEntity {
  persona_id: string;
  messaging_id: string | null;
  product: Product;
  audience_type: AudienceType;
  title: string;
  posts: Array<{
    post_type: LinkedInPostType;
    hook: string;
    body: string;
    cta?: string;
    hashtags?: string[];
    carousel_slides?: Array<{
      slide_number: number;
      title: string;
      content: string;
    }>;
    visual_prompt?: string;
  }>;
  custom_notes?: string;
}

export interface CreateLinkedInViralPackInput {
  persona_id: string;
  messaging_id?: string | null;
  product: Product;
  audience_type: AudienceType;
  title: string;
  posts: Array<{
    post_type: LinkedInPostType;
    hook: string;
    body: string;
    cta?: string;
    hashtags?: string[];
    carousel_slides?: Array<{
      slide_number: number;
      title: string;
      content: string;
    }>;
    visual_prompt?: string;
  }>;
  custom_notes?: string;
}

// ============================================================
// CAMPAIGN ASSETS RESPONSE TYPES (Generate-Only, No DB)
// ============================================================

// ADS PACK RESPONSE
export interface AdsPackResponse {
  meta: {
    product: string;
    audience: string;
    campaignAngle?: string;
  };
  tiktokAds: Array<{
    hook: string;
    script: string;
    durationSeconds: number;
    cta: string;
    caption: string;
    hashtags: string[];
  }>;
  instagramReelsAds: Array<{
    hook: string;
    script: string;
    cta: string;
    caption: string;
    primaryText: string;
    headline: string;
    hashtags: string[];
  }>;
  facebookAds: Array<{
    primaryText: string;
    headline: string;
    description: string;
    cta: string;
  }>;
  googleSearchAds: Array<{
    headline1: string;
    headline2: string;
    headline3?: string;
    description1: string;
    description2?: string;
    path1?: string;
    path2?: string;
  }>;
  linkedinAds: Array<{
    intro: string;
    body: string;
    headline: string;
    cta: string;
  }>;
  retargetingSnippets: Array<{
    platform: 'Meta' | 'Google' | 'LinkedIn';
    copy: string;
    angle: string;
  }>;
}

// SOCIAL PROOF PACK RESPONSE
export interface SocialProofPackResponse {
  meta: {
    product: string;
    audience: string;
  };
  testimonialCards: Array<{
    quote: string;
    displayName: string;
    roleOrLabel: string;
    styleTag?: string;
  }>;
  miniCaseStudies: Array<{
    title: string;
    scenario: string;
    intervention: string;
    outcome: string;
    pullQuote: string;
  }>;
  proofBullets: string[];
  founderNote: {
    title: string;
    body: string;
  };
  trustBadges: string[];
}

// PRICING PACK RESPONSE
export interface PricingPackResponse {
  meta: {
    product: string;
    audience: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  plans: Array<{
    name: string;
    tagline: string;
    idealFor: string;
    pricePlaceholder: string;
    billingNotes?: string;
    features: string[];
    highlight?: boolean;
  }>;
  comparisonTable: {
    rows: Array<{
      label: string;
      jobSeekerValue?: string;
      recruiterValue?: string;
      smbValue?: string;
    }>;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  guaranteeSection: {
    headline: string;
    body: string;
  };
  whoThisIsFor: {
    bullets: string[];
  };
  whoThisIsNotFor: {
    bullets: string[];
  };
}

// ============================================================
// ANALYTICS MODULE TYPES (Manual Input + AI Insights)
// ============================================================

export interface AnalyticsInput {
  platform: string;
  followers: number;
  views: number;
  engagements: number;
  clicks: number;
  notes?: string;
}

export interface AnalyticsResponse {
  summary: string;
  platformRankings: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: {
    videoIdeas: string[];
    linkedinPosts: string[];
    funnelAngles: string[];
    leadMagnetIdeas: string[];
    adIdeas: string[];
  };
}

// ============================================================
// NICHE VARIANT ENGINE TYPES
// ============================================================

export interface NicheVariantResponse {
  personaVariant: {
    name: string;
    ageRange: string;
    description: string;
    painPoints: string[];
    goals: string[];
    buyingTriggers: string[];
  };
  messagingVariant: {
    headline: string;
    emotionalHook: string;
    elevatorPitch: string;
    viralTaglines: string[];
  };
  scriptVariant: {
    hook: string;
    body: string;
    cta: string;
    notes?: string;
  };
  funnelVariant: {
    heroSection: {
      hook: string;
      subhook: string;
      ctaText: string;
    };
    featureBlocks: Array<{
      title: string;
      description: string;
    }>;
    valueStack: string[];
  };
  adVariant: {
    tiktokScript: string;
    facebookPrimaryText: string;
    googleHeadline: string;
  };
  leadMagnetVariant: {
    title: string;
    subtitle: string;
    overview: string;
    benefits: string[];
  };
}

