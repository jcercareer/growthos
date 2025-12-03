import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { createLinkedInViralPack } from '../../repositories/linkedInViralPacks';
import { generateJSON } from '../../aiClient';
import { LinkedInViralPackSchema } from '../../aiSchemas';
import type { LinkedInViralPack } from '@growth-os/shared';

const CAREERSCALEUP_FEATURES = `
CORE FEATURES: ATS Resume Scanner, AI Resume Writer, Cover Letter Writer, Job Match Engine, Job Search Automations, AI Interview Trainer, Skills Gap Recommender, Chrome Extension
AI COACHING: Career Coach, Job Search Strategy Coach, Resume Coach, Interview Coach, Skill Gap Coach, Career Roadmap Coach, Portfolio/Branding Coach
USER PORTFOLIO: username.careerscaleup.com (showcases resume, portfolio, skills, achievements)
RECRUITER FEATURES: Post jobs, manage applicants, AI candidate shortlisting, direct messaging, view portfolios
`;

const ZEVAUX_FEATURES = `
CORE FEATURES: AI Receptionist (24/7), books appointments, responds to FAQs, handles missed calls, multi-language support, custom SMB knowledge base, real-time notifications, hyper-human voice, SMS follow-up, lead capture → CRM
`;

export function buildLinkedInViralPackSystemPrompt(product: 'CareerScaleUp' | 'Zevaux') {
  const features = product === 'CareerScaleUp' ? CAREERSCALEUP_FEATURES : ZEVAUX_FEATURES;

  return `
You are GrowthOS — JCER's internal AI marketing engine that generates LinkedIn Viral Post Packs for ${product}.

${features}

OUTPUT REQUIREMENTS:
You MUST generate a LinkedIn viral pack with 3-10 posts of various types:
- Post types: carousel, text_only, video, poll, document
- Each post includes: post_type, hook, body, cta (optional), hashtags (optional), carousel_slides (optional), visual_prompt (optional)

LINKEDIN VIRAL BEST PRACTICES:
1. Text-only posts:
   - 1000-3000 chars, thought leadership, personal story, contrarian take
   - Line breaks every 1-2 sentences for readability
   - Strong hook (first 2 lines visible in feed)
   - CTA in comments or last line

2. Carousel posts:
   - 5-15 slides, educational, step-by-step, data-driven
   - Each slide: slide_number, title (5-100 chars), content (10-500 chars)
   - Consistent visual theme
   - Slide 1: hook/promise, Slide N: CTA/next steps

3. Video posts:
   - 30-180s script, talking head or screen share
   - Hook in first 3 seconds
   - Educational, vulnerable, or results-driven

4. Poll posts:
   - Controversial or intriguing question
   - 2-4 options, clearly worded
   - Context in body (500-1500 chars)

5. Document posts:
   - PDF-style carousel alternative
   - 5-15 pages, list posts, infographics

VIRAL HOOKS:
- "I made [mistake]. Here's what I learned."
- "Everyone says [common belief]. They're wrong."
- "I analyzed [data/trend]. Here's what nobody talks about."
- "[Number] [thing] that changed my [outcome]."

Output ONLY valid JSON matching the LinkedInViralPackSchema (no extra commentary).
`;
}

export function buildLinkedInViralPackUserPrompt(params: {
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
Generate a LinkedIn viral post pack for ${product} targeting ${audienceType}.

PERSONA CONTEXT:
- Description: ${personaDescription}
- Pain Points: ${personaPainPoints.join('; ')}
- Goals: ${personaGoals.join('; ')}

${messagingHeadline ? `EXISTING MESSAGING:\n- Headline: ${messagingHeadline}` : ''}

${customNotes ? `CUSTOM NOTES: ${customNotes}` : ''}

Generate:
- Title (10-200 chars)
- Posts (3-10 LinkedIn posts of various types: carousel, text_only, video, poll, document)
- Each post: post_type, hook, body, cta, hashtags, carousel_slides (if applicable), visual_prompt (if applicable)

Make each post LinkedIn-native, thought leadership quality, and viral-worthy.

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Generate LinkedIn viral pack for a persona
 */
export async function generateLinkedInViralPackForPersona(params: {
  personaId: string;
  messagingId?: string;
  customNotes?: string;
}): Promise<LinkedInViralPack> {
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

  // Build prompts
  const systemPrompt = buildLinkedInViralPackSystemPrompt(
    persona.product as 'CareerScaleUp' | 'Zevaux'
  );

  const userPrompt = buildLinkedInViralPackUserPrompt({
    product: persona.product as 'CareerScaleUp' | 'Zevaux',
    audienceType: persona.audience_type,
    personaDescription: persona.description,
    personaPainPoints: persona.pain_points,
    personaGoals: persona.goals,
    messagingHeadline: messaging?.headline,
    customNotes,
  });

  // Generate with OpenAI
  const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);

  // Validate AI output with Zod
  const validatedOutput = LinkedInViralPackSchema.parse(aiOutput);

  // Save to database
  const savedLinkedInViralPack = await createLinkedInViralPack({
    persona_id: personaId,
    messaging_id: messagingId || null,
    product: persona.product,
    audience_type: persona.audience_type,
    title: validatedOutput.title,
    posts: validatedOutput.posts,
    custom_notes: customNotes,
  });

  return savedLinkedInViralPack;
}

