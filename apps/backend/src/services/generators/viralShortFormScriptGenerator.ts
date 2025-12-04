import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { createViralShortFormScript } from '../../repositories/viralShortFormScripts';
import { generateJSON } from '../../aiClient';
import { ViralShortFormScriptSchema } from '../../aiSchemas';
import type { ViralShortFormScript, ShortFormPlatform } from '@growth-os/shared';
import { buildPrompt } from '../../prompts/applySystemPrompt';

const CAREERSCALEUP_FEATURES = `
CORE FEATURES: ATS Resume Scanner, AI Resume Writer, Cover Letter Writer, Job Match Engine, Job Search Automations, AI Interview Trainer, Skills Gap Recommender, Chrome Extension
AI COACHING: Career Coach, Job Search Strategy Coach, Resume Coach, Interview Coach
USER PORTFOLIO: username.careerscaleup.com
`;

const ZEVAUX_FEATURES = `
CORE FEATURES: AI Receptionist (24/7), books appointments, responds to FAQs, handles missed calls, multi-language support, SMS follow-up, lead capture → CRM
`;

export function buildViralShortFormScriptSystemPrompt(product: 'CareerScaleUp' | 'Zevaux') {
  const features = product === 'CareerScaleUp' ? CAREERSCALEUP_FEATURES : ZEVAUX_FEATURES;

  return `
You are GrowthOS — JCER's internal AI marketing engine that generates Viral Short-Form Scripts for ${product}.

${features}

OUTPUT REQUIREMENTS:
You MUST generate a viral short-form script with:
1. Title (10-200 chars)
2. Hook (10-200 chars, scroll-stopping, first 3 seconds)
3. Script (50-2000 chars, conversational, engaging)
4. Visual Prompts (3-10 scene descriptions for video production)
5. Hashtags (3-15 relevant hashtags)
6. CTA (5-200 chars, clear action)
7. Duration (7-180 seconds)

PLATFORM GUIDELINES:
- TikTok: 15-60s, trending audio, fast cuts, text overlays, relatable humor
- Instagram Reel: 15-90s, aesthetic, aspirational, polished, music-driven
- YouTube Short: 15-60s, educational, value-first, clear structure

VIRAL SCRIPT STRUCTURE:
1. Hook (0-3s): scroll-stopper, pattern interrupt, curiosity gap
2. Problem (3-10s): relatable pain point, empathy
3. Solution (10-45s): show the product in action, demonstrate value
4. Proof (45-55s): quick result, testimonial snippet, metric
5. CTA (55-60s): clear action, urgency

VISUAL PROMPTS:
- Describe specific scenes, camera angles, transitions
- Examples: "Close-up of frustrated job seeker staring at laptop", "Screen recording of ATS score going from 45 to 98", "Split screen: before/after resume"

Output ONLY valid JSON matching the ViralShortFormScriptSchema (no extra commentary).
`;
}

export function buildViralShortFormScriptUserPrompt(params: {
  product: 'CareerScaleUp' | 'Zevaux';
  audienceType: string;
  platform: ShortFormPlatform;
  personaDescription: string;
  personaPainPoints: string[];
  personaGoals: string[];
  messagingHeadline?: string;
  customNotes?: string;
}) {
  const {
    product,
    audienceType,
    platform,
    personaDescription,
    personaPainPoints,
    personaGoals,
    messagingHeadline,
    customNotes,
  } = params;

  return `
Generate a viral short-form script for ${product} targeting ${audienceType} on ${platform}.

PERSONA CONTEXT:
- Description: ${personaDescription}
- Pain Points: ${personaPainPoints.join('; ')}
- Goals: ${personaGoals.join('; ')}

${messagingHeadline ? `EXISTING MESSAGING:\n- Headline: ${messagingHeadline}` : ''}

PLATFORM: ${platform}

${customNotes ? `CUSTOM NOTES: ${customNotes}` : ''}

Generate:
- Title (10-200 chars)
- Hook (10-200 chars, scroll-stopping, first 3 seconds)
- Script (50-2000 chars, conversational, viral structure)
- Visual Prompts (3-10 scene descriptions)
- Hashtags (3-15 relevant hashtags)
- CTA (5-200 chars)
- Duration (7-180 seconds)

Make it platform-native, scroll-stopping, and conversion-driven.

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Generate viral short form script for a persona
 */
export async function generateViralShortFormScriptForPersona(params: {
  personaId: string;
  messagingId?: string;
  platform: ShortFormPlatform;
  customNotes?: string;
}): Promise<ViralShortFormScript> {
  const { personaId, messagingId, platform, customNotes } = params;

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
  const { systemPrompt, userPrompt } = buildPrompt(
    buildViralShortFormScriptSystemPrompt(
      persona.product as 'CareerScaleUp' | 'Zevaux'
    ),
    buildViralShortFormScriptUserPrompt({
      product: persona.product as 'CareerScaleUp' | 'Zevaux',
      audienceType: persona.audience_type,
      platform,
      personaDescription: persona.description,
      personaPainPoints: persona.pain_points,
      personaGoals: persona.goals,
      messagingHeadline: messaging?.headline,
      customNotes,
    })
  );

  // Generate with OpenAI
  const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);

  // Validate AI output with Zod
  const validatedOutput = ViralShortFormScriptSchema.parse(aiOutput);

  // Save to database
  const savedScript = await createViralShortFormScript({
    persona_id: personaId,
    messaging_id: messagingId || null,
    product: persona.product,
    audience_type: persona.audience_type,
    platform,
    title: validatedOutput.title,
    hook: validatedOutput.hook,
    script: validatedOutput.script,
    visual_prompts: validatedOutput.visual_prompts,
    hashtags: validatedOutput.hashtags,
    cta: validatedOutput.cta,
    duration_seconds: validatedOutput.duration_seconds,
    custom_notes: customNotes,
  });

  return savedScript;
}

