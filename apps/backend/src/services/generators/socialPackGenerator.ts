import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { createSocialPack } from '../../repositories/socialPacks';
import { generateJSON } from '../../aiClient';
import { SocialPackSchema } from '../../aiSchemas';
import { buildPrompt } from '../../prompts/applySystemPrompt';
import type { SocialPack } from '@growth-os/shared';

const CAREERSCALEUP_FEATURES = `
CORE FEATURES: ATS Resume Scanner, AI Resume Writer, Cover Letter Writer, Job Match Engine, Job Search Automations, AI Interview Trainer, Skills Gap Recommender, Chrome Extension, AI Career Document Generator
AI COACHING: Career Coach, Job Search Strategy Coach, Resume Coach, Interview Coach, Skill Gap Coach, Career Roadmap Coach, Portfolio/Branding Coach
USER PORTFOLIO: username.careerscaleup.com (showcases resume, portfolio, skills, achievements)
RECRUITER FEATURES: Post jobs, manage applicants, AI candidate shortlisting, direct messaging, view portfolios
`;

const ZEVAUX_FEATURES = `
CORE FEATURES: AI Receptionist (24/7), books appointments, responds to FAQs, handles missed calls, multi-language support, custom SMB knowledge base, real-time notifications, hyper-human voice, SMS follow-up, lead capture → CRM
`;

export function buildSocialPackSystemPrompt(product: 'CareerScaleUp' | 'Zevaux') {
  const features = product === 'CareerScaleUp' ? CAREERSCALEUP_FEATURES : ZEVAUX_FEATURES;

  return `
You are GrowthOS — JCER's internal AI marketing engine that generates Social Media Post Packs for ${product}.

${features}

OUTPUT REQUIREMENTS:
You MUST generate a social pack with 3-15 posts across multiple platforms:
- Platforms: linkedin, tiktok, reddit, youtube, instagram, x
- Each post includes: platform, content, hook (optional), cta (optional), hashtags (optional), media_suggestions (optional)

PLATFORM-SPECIFIC GUIDELINES:
- LinkedIn: professional, thought leadership, 1000-3000 chars, focus on results/insights
- TikTok: short, punchy, hook-driven, 100-500 chars, trending vibes
- Reddit: authentic, community-first, conversational, no corporate speak, 200-1000 chars
- YouTube: video script style, educational, 500-2000 chars
- Instagram: visual-first, aspirational, 500-2200 chars, emoji-friendly
- X (Twitter): concise, scroll-stopping, 100-280 chars

CONTENT STYLE:
- Bold, persuasive, scroll-stopping hooks
- Use ONLY real product features
- Each post must be platform-native (not generic)
- Include CTAs when appropriate
- Hashtags: relevant, not spammy (3-8 per post)

Output ONLY valid JSON matching the SocialPackSchema (no extra commentary).
`;
}

export function buildSocialPackUserPrompt(params: {
  product: 'CareerScaleUp' | 'Zevaux';
  audienceType: string;
  personaDescription: string;
  personaPainPoints: string[];
  personaGoals: string[];
  messagingHeadline?: string;
  customNotes?: string;
}) {
  const {
    product,
    audienceType,
    personaDescription,
    personaPainPoints,
    personaGoals,
    messagingHeadline,
    customNotes,
  } = params;

  return `
Generate a social media post pack for ${product} targeting ${audienceType}.

PERSONA CONTEXT:
- Description: ${personaDescription}
- Pain Points: ${personaPainPoints.join('; ')}
- Goals: ${personaGoals.join('; ')}

${messagingHeadline ? `EXISTING MESSAGING:\n- Headline: ${messagingHeadline}` : ''}

${customNotes ? `CUSTOM NOTES: ${customNotes}` : ''}

Generate:
- Title (10-200 chars)
- Posts (3-15 posts across different platforms: linkedin, tiktok, reddit, youtube, instagram, x)
- Each post: platform, content, hook, cta, hashtags, media_suggestions

Make each post platform-native, bold, and conversion-driven.

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Generate social pack for a persona
 */
export async function generateSocialPackForPersona(params: {
  personaId: string;
  messagingId?: string;
  customNotes?: string;
}): Promise<SocialPack> {
  const { personaId, messagingId, customNotes } = params;

  // Look up persona
  const persona = await getPersonaById(personaId);
  if (!persona) {
    throw new Error('Persona not found');
  }

  // Optionally look up messaging
  let messaging = null;
  if (messagingId) {
    messaging = await getMessagingById(messagingId);
  }

  // Build prompts with global context
  const moduleSystemPrompt = buildSocialPackSystemPrompt(
    persona.product as 'CareerScaleUp' | 'Zevaux'
  );

  const moduleUserPrompt = buildSocialPackUserPrompt({
    product: persona.product as 'CareerScaleUp' | 'Zevaux',
    audienceType: persona.audience_type,
    personaDescription: persona.description,
    personaPainPoints: persona.pain_points,
    personaGoals: persona.goals,
    messagingHeadline: messaging?.headline,
    customNotes,
  });

  const { systemPrompt: combinedSystemPrompt, userPrompt: finalUserPrompt } = buildPrompt(
    moduleSystemPrompt,
    moduleUserPrompt
  );

  // Generate with OpenAI
  const aiOutput = await generateJSON<any>(combinedSystemPrompt, finalUserPrompt);

  // Validate AI output with Zod
  const validatedOutput = SocialPackSchema.parse(aiOutput);

  // Save to database
  const savedSocialPack = await createSocialPack({
    persona_id: personaId,
    messaging_id: messagingId || null,
    product: persona.product,
    audience_type: persona.audience_type,
    title: validatedOutput.title,
    posts: validatedOutput.posts,
    custom_notes: customNotes,
  });

  return savedSocialPack;
}

