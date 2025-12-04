import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { createPaidAdsPack } from '../../repositories/paidAdsPacks';
import { generateJSON } from '../../aiClient';
import { PaidAdsPackSchema } from '../../aiSchemas';
import { buildPrompt } from '../../prompts/applySystemPrompt';
import type { PaidAdsPack } from '@growth-os/shared';

const CAREERSCALEUP_FEATURES = `
CORE FEATURES: ATS Resume Scanner, AI Resume Writer, Cover Letter Writer, Job Match Engine, Job Search Automations, AI Interview Trainer, Skills Gap Recommender, Chrome Extension, AI Career Document Generator
AI COACHING: Career Coach, Job Search Strategy Coach, Resume Coach, Interview Coach, Skill Gap Coach, Career Roadmap Coach, Portfolio/Branding Coach
USER PORTFOLIO: username.careerscaleup.com
RECRUITER FEATURES: Post jobs, manage applicants, AI candidate shortlisting
`;

const ZEVAUX_FEATURES = `
CORE FEATURES: AI Receptionist (24/7), books appointments, responds to FAQs, handles missed calls, multi-language support, custom SMB knowledge base, real-time notifications, hyper-human voice, SMS follow-up, lead capture → CRM
`;

export function buildPaidAdsPackSystemPrompt(product: 'CareerScaleUp' | 'Zevaux') {
  const features = product === 'CareerScaleUp' ? CAREERSCALEUP_FEATURES : ZEVAUX_FEATURES;

  return `
You are GrowthOS — JCER's internal AI marketing engine that generates Paid Ads Packs for ${product}.

${features}

OUTPUT REQUIREMENTS:
You MUST generate a paid ads pack with 3-15 ads across platforms:
- Platforms: tiktok, instagram, facebook, google_search, linkedin, youtube
- Each ad includes: platform, ad_type, headline (optional), primary_text (optional), description (optional), script (optional), cta_text, targeting_notes (optional), visual_prompt (optional)
- Retargeting scripts (0-5 scripts)

PLATFORM-SPECIFIC AD TYPES:
- TikTok: video script (15-60s)
- Instagram: feed post, story, reel script
- Facebook: feed post, video ad
- Google Search: text ads (headlines + descriptions)
- LinkedIn: sponsored content, video ad
- YouTube: video script (15-30s bumper, 6s-15s skippable)

AD BEST PRACTICES:
- Scroll-stopping hooks in first 3 seconds (video)
- Pain → solution → CTA structure
- Use ONLY real product features
- CTAs: clear, action-oriented, benefit-driven
- Targeting notes: describe ideal audience demographics/interests
- Visual prompts: describe visual scenes/elements for video/image ads

Output ONLY valid JSON matching the PaidAdsPackSchema (no extra commentary).
`;
}

export function buildPaidAdsPackUserPrompt(params: {
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
Generate a paid ads pack for ${product} targeting ${audienceType}.

PERSONA CONTEXT:
- Description: ${personaDescription}
- Pain Points: ${personaPainPoints.join('; ')}
- Goals: ${personaGoals.join('; ')}

${messagingHeadline ? `EXISTING MESSAGING:\n- Headline: ${messagingHeadline}` : ''}

${customNotes ? `CUSTOM NOTES: ${customNotes}` : ''}

Generate:
- Title (10-200 chars)
- Ads (3-15 ads across platforms: tiktok, instagram, facebook, google_search, linkedin, youtube)
- Each ad: platform, ad_type, headline, primary_text, description, script, cta_text, targeting_notes, visual_prompt
- Retargeting Scripts (0-5 scripts for re-engaging visitors)

Make each ad platform-native, bold, and conversion-driven.

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Generate paid ads pack for a persona
 */
export async function generatePaidAdsPackForPersona(params: {
  personaId: string;
  messagingId?: string;
  customNotes?: string;
}): Promise<PaidAdsPack> {
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
  const moduleSystemPrompt = buildPaidAdsPackSystemPrompt(
    persona.product as 'CareerScaleUp' | 'Zevaux'
  );

  const moduleUserPrompt = buildPaidAdsPackUserPrompt({
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
  const validatedOutput = PaidAdsPackSchema.parse(aiOutput);

  // Save to database
  const savedPaidAdsPack = await createPaidAdsPack({
    persona_id: personaId,
    messaging_id: messagingId || null,
    product: persona.product,
    audience_type: persona.audience_type,
    title: validatedOutput.title,
    ads: validatedOutput.ads,
    retargeting_scripts: validatedOutput.retargeting_scripts,
    custom_notes: customNotes,
  });

  return savedPaidAdsPack;
}

