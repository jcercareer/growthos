import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { createEmailSmsSequence } from '../../repositories/emailSmsSequences';
import { generateJSON } from '../../aiClient';
import { EmailSmsSequenceSchema } from '../../aiSchemas';
import type { EmailSmsSequence, SequenceType } from '@growth-os/shared';

const CAREERSCALEUP_FEATURES = `
CORE FEATURES: ATS Resume Scanner, AI Resume Writer, Cover Letter Writer, Job Match Engine, Job Search Automations, AI Interview Trainer, Skills Gap Recommender, Chrome Extension
AI COACHING: Career Coach, Job Search Strategy Coach, Resume Coach, Interview Coach, Skill Gap Coach, Career Roadmap Coach
USER PORTFOLIO: username.careerscaleup.com
RECRUITER FEATURES: Post jobs, manage applicants, AI candidate shortlisting
`;

const ZEVAUX_FEATURES = `
CORE FEATURES: AI Receptionist (24/7), books appointments, responds to FAQs, handles missed calls, multi-language support, SMS follow-up, lead capture → CRM
`;

export function buildEmailSmsSequenceSystemPrompt(product: 'CareerScaleUp' | 'Zevaux', audienceType: string) {
  const features = product === 'CareerScaleUp' ? CAREERSCALEUP_FEATURES : ZEVAUX_FEATURES;
  const includeSms = product === 'Zevaux' && audienceType === 'smb_owner';

  return `
You are GrowthOS — JCER's internal AI marketing engine that generates Email & SMS Sequences for ${product}.

${features}

OUTPUT REQUIREMENTS:
You MUST generate a complete email/SMS sequence with:
1. Title (10-200 chars)
2. Emails (3-10 emails over 30 days max)
   - Each email: day, subject, preview_text, body, cta_text, cta_link (optional)
3. SMS Messages (0-5 SMS, only for Zevaux SMB sequences)
   - Each SMS: day, message (max 160 chars), cta_link (optional)
4. Nurturing Logic (20-1000 chars explaining the strategy)

EMAIL BEST PRACTICES:
- Subjects: 5-100 chars, scroll-stopping, curiosity-driven
- Preview text: 10-100 chars, complements subject
- Body: 50-3000 chars, conversational, value-first
- CTA: clear, action-oriented, benefit-driven

SMS BEST PRACTICES (Zevaux only):
- Max 160 chars
- Conversational, personal, time-sensitive
- Include clear CTA

SEQUENCE TYPES:
- welcome: onboarding, introduce value
- nurture: educate, build trust, demonstrate value
- cart_abandonment: recover lost leads
- re_engagement: win back inactive users
- product_launch: announce new features

${includeSms ? 'IMPORTANT: Include SMS messages for Zevaux SMB sequences.' : 'IMPORTANT: SMS messages optional or empty for this audience.'}

Output ONLY valid JSON matching the EmailSmsSequenceSchema (no extra commentary).
`;
}

export function buildEmailSmsSequenceUserPrompt(params: {
  product: 'CareerScaleUp' | 'Zevaux';
  audienceType: string;
  sequenceType: SequenceType;
  personaDescription: string;
  personaPainPoints: string[];
  personaGoals: string[];
  messagingHeadline?: string;
  customNotes?: string;
}) {
  const {
    product,
    audienceType,
    sequenceType,
    personaDescription,
    personaPainPoints,
    personaGoals,
    messagingHeadline,
    customNotes,
  } = params;

  return `
Generate a ${sequenceType} email/SMS sequence for ${product} targeting ${audienceType}.

PERSONA CONTEXT:
- Description: ${personaDescription}
- Pain Points: ${personaPainPoints.join('; ')}
- Goals: ${personaGoals.join('; ')}

${messagingHeadline ? `EXISTING MESSAGING:\n- Headline: ${messagingHeadline}` : ''}

SEQUENCE TYPE: ${sequenceType}

${customNotes ? `CUSTOM NOTES: ${customNotes}` : ''}

Generate:
- Title (10-200 chars)
- Emails (3-10 emails over 30 days, each with day, subject, preview_text, body, cta_text)
- SMS Messages (0-5 SMS if Zevaux SMB, otherwise empty)
- Nurturing Logic (20-1000 chars explaining the strategy)

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Generate email/SMS sequence for a persona
 */
export async function generateEmailSmsSequenceForPersona(params: {
  personaId: string;
  messagingId?: string;
  sequenceType: SequenceType;
  customNotes?: string;
}): Promise<EmailSmsSequence> {
  const { personaId, messagingId, sequenceType, customNotes } = params;

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
  const systemPrompt = buildEmailSmsSequenceSystemPrompt(
    persona.product as 'CareerScaleUp' | 'Zevaux',
    persona.audience_type
  );

  const userPrompt = buildEmailSmsSequenceUserPrompt({
    product: persona.product as 'CareerScaleUp' | 'Zevaux',
    audienceType: persona.audience_type,
    sequenceType,
    personaDescription: persona.description,
    personaPainPoints: persona.pain_points,
    personaGoals: persona.goals,
    messagingHeadline: messaging?.headline,
    customNotes,
  });

  // Generate with OpenAI
  const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);

  // Validate AI output with Zod
  const validatedOutput = EmailSmsSequenceSchema.parse(aiOutput);

  // Save to database
  const savedSequence = await createEmailSmsSequence({
    persona_id: personaId,
    messaging_id: messagingId || null,
    product: persona.product,
    audience_type: persona.audience_type,
    sequence_type: sequenceType,
    title: validatedOutput.title,
    emails: validatedOutput.emails,
    sms_messages: validatedOutput.sms_messages,
    nurturing_logic: validatedOutput.nurturing_logic,
    custom_notes: customNotes,
  });

  return savedSequence;
}

