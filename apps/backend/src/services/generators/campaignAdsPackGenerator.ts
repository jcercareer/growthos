import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { generateJSON } from '../../aiClient';
import { z } from 'zod';
import type { Product, AudienceType, AdsPackResponse } from '@growth-os/shared';
import { buildPrompt } from '../../prompts/applySystemPrompt';

const CAREERSCALEUP_FEATURES = `
CORE FEATURES: ATS Resume Scanner, AI Resume Writer, Cover Letter Writer, Job Match Engine, Job Search Automations, AI Interview Trainer, Skills Gap Recommender, Chrome Extension
AI COACHING: Career Coach, Job Search Strategy Coach, Resume Coach, Interview Coach
USER PORTFOLIO: username.careerscaleup.com (showcases resume, portfolio, skills)
RECRUITER FEATURES: Post jobs, manage applicants, AI candidate shortlisting, direct messaging
`;

const ZEVAUX_FEATURES = `
CORE FEATURES: AI Receptionist (24/7), books appointments, responds to FAQs, handles missed calls, multi-language support, SMS follow-up, lead capture → CRM
`;

// Zod schema for AI validation
const AdsPackSchema = z.object({
  tiktokAds: z.array(z.object({
    hook: z.string().min(10).max(200),
    script: z.string().min(50).max(2000),
    durationSeconds: z.number().int().min(15).max(60),
    cta: z.string().min(5).max(100),
    caption: z.string().min(20).max(500),
    hashtags: z.array(z.string()).min(3).max(10),
  })).min(2).max(5),
  instagramReelsAds: z.array(z.object({
    hook: z.string().min(10).max(200),
    script: z.string().min(50).max(2000),
    cta: z.string().min(5).max(100),
    caption: z.string().min(20).max(500),
    primaryText: z.string().min(20).max(500),
    headline: z.string().min(10).max(100),
    hashtags: z.array(z.string()).min(3).max(10),
  })).min(2).max(5),
  facebookAds: z.array(z.object({
    primaryText: z.string().min(20).max(500),
    headline: z.string().min(10).max(100),
    description: z.string().min(20).max(200),
    cta: z.string().min(3).max(50),
  })).min(2).max(5),
  googleSearchAds: z.array(z.object({
    headline1: z.string().min(5).max(30),
    headline2: z.string().min(5).max(30),
    headline3: z.string().min(5).max(30).optional(),
    description1: z.string().min(10).max(90),
    description2: z.string().min(10).max(90).optional(),
    path1: z.string().max(15).optional(),
    path2: z.string().max(15).optional(),
  })).min(2).max(5),
  linkedinAds: z.array(z.object({
    intro: z.string().min(10).max(150),
    body: z.string().min(50).max(1000),
    headline: z.string().min(10).max(100),
    cta: z.string().min(3).max(50),
  })).min(2).max(5),
  retargetingSnippets: z.array(z.object({
    platform: z.enum(['Meta', 'Google', 'LinkedIn']),
    copy: z.string().min(20).max(500),
    angle: z.string().min(10).max(100),
  })).min(3).max(6),
});

export function buildAdsPackSystemPrompt(product: 'CareerScaleUp' | 'Zevaux') {
  const features = product === 'CareerScaleUp' ? CAREERSCALEUP_FEATURES : ZEVAUX_FEATURES;

  return `
You are GrowthOS — JCER's internal AI marketing engine that generates cross-platform Ad Packs for ${product}.

${features}

OUTPUT REQUIREMENTS:
Generate a comprehensive ads pack with 2-5 ads per platform:

1. TIKTOK ADS (2-5 ads)
   Each ad:
   - hook: First 3 seconds, scroll-stopping (10-200 chars)
   - script: Full video script (50-2000 chars)
   - durationSeconds: 15-60 seconds
   - cta: Call to action (5-100 chars)
   - caption: Text overlay suggestions (20-500 chars)
   - hashtags: 3-10 relevant hashtags

   TikTok Style:
   - Fast-paced, trend-aware
   - Hook in first 3 seconds
   - Text overlays throughout
   - Relatable, authentic
   - Educational or entertaining

2. INSTAGRAM REELS ADS (2-5 ads)
   Each ad:
   - hook: Opening hook (10-200 chars)
   - script: Video script (50-2000 chars)
   - cta: Call to action (5-100 chars)
   - caption: Post caption (20-500 chars)
   - primaryText: Ad primary text (20-500 chars)
   - headline: Ad headline (10-100 chars)
   - hashtags: 3-10 relevant hashtags

   Instagram Style:
   - Aesthetic, polished
   - Visual-first
   - Aspirational
   - Professional yet relatable

3. FACEBOOK ADS (2-5 ads)
   Each ad:
   - primaryText: Main ad copy (20-500 chars)
   - headline: Ad headline (10-100 chars)
   - description: Link description (20-200 chars)
   - cta: Button text (3-50 chars)

   Facebook Style:
   - Benefit-driven
   - Social proof friendly
   - Clear value proposition
   - Audience targeting hints

4. GOOGLE SEARCH ADS (2-5 ads)
   Each ad:
   - headline1: First headline (5-30 chars)
   - headline2: Second headline (5-30 chars)
   - headline3: Third headline (5-30 chars, optional)
   - description1: First description (10-90 chars)
   - description2: Second description (10-90 chars, optional)
   - path1: URL path 1 (max 15 chars, optional)
   - path2: URL path 2 (max 15 chars, optional)

   Google Search Style:
   - Intent-driven
   - Keyword-rich
   - Specific, action-oriented
   - Addresses search query

5. LINKEDIN ADS (2-5 ads)
   Each ad:
   - intro: Opening line (10-150 chars)
   - body: Main copy (50-1000 chars)
   - headline: Ad headline (10-100 chars)
   - cta: Call to action (3-50 chars)

   LinkedIn Style:
   - Professional, thought leadership
   - B2B focused
   - Career/business outcomes
   - Authority positioning

6. RETARGETING SNIPPETS (3-6 snippets)
   Each snippet:
   - platform: Meta | Google | LinkedIn
   - copy: Retargeting ad copy (20-500 chars)
   - angle: Retargeting angle description (10-100 chars)

   Retargeting Angles:
   - "You visited but didn't sign up"
   - "Here's what you're missing"
   - "Limited time offer"
   - "We noticed you're interested in X"
   - "Last chance to get Y"

CRITICAL RULES:
- Use ONLY real ${product} features
- No fake testimonials or made-up numbers
- Platform-specific formatting
- Character limits are STRICT (Google Search especially)
- Every ad must have a clear CTA
- Hooks must create curiosity or urgency
- Scripts must follow Hook → Problem → Solution → CTA structure

TONE BY AUDIENCE:
- Job seekers: "Your career breakthrough starts here"
- Recruiters: "Hire smarter, not harder"
- SMB owners: "Stop losing revenue to missed opportunities"

Output ONLY valid JSON matching the schema. No markdown, no commentary.
`;
}

export function buildAdsPackUserPrompt(params: {
  product: Product;
  audienceType: AudienceType;
  personaDescription: string;
  personaPainPoints: string[];
  personaGoals: string[];
  messagingHeadline?: string;
  messagingHook?: string;
  campaignAngle?: string;
}) {
  const {
    product,
    audienceType,
    personaDescription,
    personaPainPoints,
    personaGoals,
    messagingHeadline,
    messagingHook,
    campaignAngle,
  } = params;

  return `
Generate a comprehensive cross-platform ads pack for ${product} targeting ${audienceType}.

PERSONA CONTEXT:
- Description: ${personaDescription}
- Pain Points: ${personaPainPoints.join('; ')}
- Goals: ${personaGoals.join('; ')}

${messagingHeadline ? `EXISTING MESSAGING:\n- Headline: ${messagingHeadline}\n- Hook: ${messagingHook || 'N/A'}` : ''}

${campaignAngle ? `CAMPAIGN ANGLE: ${campaignAngle}` : ''}

Generate 2-5 ads for each platform:
1. TikTok Ads (15-60 second scripts)
2. Instagram Reels Ads
3. Facebook Ads
4. Google Search Ads (strict character limits!)
5. LinkedIn Ads
6. Retargeting Snippets (3-6 across Meta, Google, LinkedIn)

Each ad must:
- Reference real ${product} features
- Address persona's specific pain points
- Include clear CTA
- Follow platform-specific best practices
- Stay within character limits

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Generate ads pack (generate-only, no DB write)
 */
export async function generateAdsPackForPersona(params: {
  product: Product;
  audienceType: AudienceType;
  personaId: string;
  messagingId: string;
  campaignAngle?: string;
}): Promise<AdsPackResponse> {
  const { product, audienceType, personaId, messagingId, campaignAngle } = params;

  // Look up persona and messaging
  const persona = await getPersonaById(personaId);
  if (!persona) {
    throw new Error('Persona not found');
  }

  const messaging = await getMessagingById(messagingId);
  if (!messaging) {
    throw new Error('Messaging not found');
  }

  // Build prompts with global context
  const { systemPrompt, userPrompt } = buildPrompt(
    buildAdsPackSystemPrompt(product as 'CareerScaleUp' | 'Zevaux'),
    buildAdsPackUserPrompt({
      product,
      audienceType,
      personaDescription: persona.description,
      personaPainPoints: persona.pain_points,
      personaGoals: persona.goals,
      messagingHeadline: messaging.headline,
      messagingHook: messaging.emotional_hook,
      campaignAngle,
    })
  );

  // Generate with OpenAI
  const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);

  // Validate AI output with Zod
  const validatedOutput = AdsPackSchema.parse(aiOutput);

  // Return response (no DB write)
  return {
    meta: {
      product: product as string,
      audience: audienceType as string,
      campaignAngle,
    },
    ...validatedOutput,
  };
}

