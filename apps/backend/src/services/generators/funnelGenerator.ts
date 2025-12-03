import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { createFunnel } from '../../repositories/funnels';
import { generateJSON } from '../../aiClient';
import { FunnelSchema } from '../../aiSchemas';
import type { Funnel, FunnelType, ToneType } from '@growth-os/shared';

const CAREERSCALEUP_FEATURES = `
CORE FEATURES:
- ATS Resume Scanner + Score
- AI Resume Writer & Optimizer
- AI Cover Letter Writer
- Job Match Engine (matches resume to live job postings)
- Job Search Automations
- AI Interview Trainer (mock interviews + scoring)
- Skills Gap Recommender
- Chrome Extension (job scraping + instant resume match)
- AI Career Document Generator

AI COACHING FEATURES:
- AI Career Coach, Job Search Strategy Coach, Resume Coach, Interview Coach
- AI Skill Gap Coach, Career Roadmap Coach, Portfolio/Branding Coach
- AI Motivation Coach

USER PORTFOLIO WEBSITE:
- Each user gets: username.careerscaleup.com
- Showcases resume, portfolio, skills, achievements, projects, testimonials
- "Companies have websites — now you do too."

RECRUITER FEATURES:
- Post jobs, manage applicants, AI candidate shortlisting
- Direct message chat, view candidate portfolios
- Internal ATS light features
`;

const ZEVAUX_FEATURES = `
CORE FEATURES:
- AI Receptionist for SMBs (answers calls 24/7)
- Books appointments, responds to FAQs, handles missed calls instantly
- Multi-language support, custom SMB knowledge base
- Real-time notifications, hyper-human voice quality
- Automations via n8n, SMS follow-up after missed calls
- Lead capture → CRM

POSITIONING:
- "The best AI Receptionist in the US."
- "Never miss a customer again."
- "Turn every missed call into revenue instantly."
`;

const FUNNEL_GRADE_HOOKS_CAREERSCALEUP = `
- "Companies have websites — now you do too."
- "Get hired faster with your AI career team."
- "Fix your resume in 60 seconds."
- "ATS doesn't care about beauty — it cares about keywords."
- "The job market has changed — your tools should too."
- "Your subdomain portfolio makes you unforgettable."
`;

const FUNNEL_GRADE_HOOKS_RECRUITER = `
- "The fastest way to shortlist candidates with AI."
- "Your ATS, simplified."
- "See everything in one place — including candidate portfolios."
`;

const FUNNEL_GRADE_HOOKS_ZEVAUX = `
- "Never miss another customer again."
- "Your new AI receptionist works 24/7."
- "Turn missed calls into booked appointments instantly."
- "Small businesses deserve enterprise-grade customer service."
`;

export function buildFunnelSystemPrompt(product: 'CareerScaleUp' | 'Zevaux', audienceType: string) {
  const features = product === 'CareerScaleUp' ? CAREERSCALEUP_FEATURES : ZEVAUX_FEATURES;
  
  let hooks = '';
  if (product === 'CareerScaleUp' && audienceType === 'recruiter') {
    hooks = FUNNEL_GRADE_HOOKS_RECRUITER;
  } else if (product === 'CareerScaleUp') {
    hooks = FUNNEL_GRADE_HOOKS_CAREERSCALEUP;
  } else {
    hooks = FUNNEL_GRADE_HOOKS_ZEVAUX;
  }

  return `
You are GrowthOS — JCER's internal AI marketing engine that generates high-performance funnel pages for ${product}.

${features}

FUNNEL-GRADE HOOKS:
${hooks}

OUTPUT REQUIREMENTS:
You MUST generate a complete funnel structure with:
1. Hero Section
   - Hook: Scroll-stopping H1 (10-15 words max)
   - Subhook: Clarifying H2 (15-25 words)
   - CTA Text: Action-oriented button (2-5 words)
   - CTA Link (optional placeholder)
   - Media URL (optional placeholder)

2. Social Proof (MANDATORY)
   - Testimonials: 3-5 generic placeholder testimonials (20-80 words each)
   - Example: "This tool helped me land 3 interviews in 2 weeks after months of struggling."
   - Metrics: 3-5 impressive stats (e.g., "10,000+ users", "95% success rate")
   - NO REAL NAMES. Use generic placeholders only.

3. Feature Blocks (3-8 blocks)
   - Title: Short, benefit-driven (3-8 words)
   - Description: Specific, feature-based (15-30 words)
   - Icon: Optional emoji or icon suggestion
   - MUST reference ONLY real product features from the feature list above

4. Value Stack (3-10 benefit statements)
   - Each statement: 5-15 words
   - Format: "✓ Benefit statement"
   - Must be specific and outcome-focused
   - Examples:
     * "Fix your resume in 60 seconds"
     * "Never miss another customer call again"
     * "Get hired 3x faster with AI-powered job matching"

5. Urgency Section (OPTIONAL - use if tone is "urgent")
   - Headline: 5-10 words
   - Copy: 20-40 words creating FOMO
   - Examples: "Early access closes in 48 hours", "Limited to first 500 users"

6. Final CTA
   - Text: Strong action verb (2-5 words)
   - Link: Optional placeholder

7. Color Scheme (MANDATORY)
   - Primary: Hex code (blue gradient preferred)
   - Secondary: Hex code (purple accent preferred)
   - Accent: Hex code (complementary color)
   - Must follow modern SaaS aesthetic (white bg, blue/purple gradient)

STYLE RULES:
- Alex Hormozi / Sabri Suby style: Direct, bold, no-nonsense
- Pain → Agitation → Solution framework
- Use power words: "Transform", "Instantly", "Proven", "Guaranteed"
- Short sentences for impact
- NO passive voice
- NO generic claims without specifics
- Every feature must tie to a real product capability
- Social proof must be believable but GENERIC (no real names)

MANDATORY STRUCTURAL FLOW:
1. Hero: Hook + Promise + CTA
2. Pain/Agitation: "You're struggling with X because Y"
3. Solution: "Here's how [Product] solves it"
4. Features: How it works (3-8 blocks)
5. Value Stack: What you get
6. Social Proof: Others' results
7. Urgency: Why now
8. Final CTA: Take action

Tone Guidelines:
- Job seekers: Supportive yet empowering. "You deserve better opportunities."
- Recruiters: Efficiency-focused. "Save 10+ hours per week on screening."
- SMB owners: Revenue protection. "Never lose a customer to a missed call."

Output ONLY valid JSON matching the FunnelSchema (no extra commentary, no markdown).
`;
}

export function buildFunnelUserPrompt(params: {
  product: 'CareerScaleUp' | 'Zevaux';
  audienceType: string;
  funnelType: FunnelType;
  tone: ToneType;
  personaDescription: string;
  personaPainPoints: string[];
  personaGoals: string[];
  messagingHeadline?: string;
  messagingHook?: string;
  customNotes?: string;
}) {
  const {
    product,
    audienceType,
    funnelType,
    tone,
    personaDescription,
    personaPainPoints,
    personaGoals,
    messagingHeadline,
    messagingHook,
    customNotes,
  } = params;

  return `
Generate a ${funnelType} funnel for ${product} targeting ${audienceType}.

PERSONA CONTEXT:
- Description: ${personaDescription}
- Pain Points: ${personaPainPoints.join('; ')}
- Goals: ${personaGoals.join('; ')}

${messagingHeadline ? `EXISTING MESSAGING:\n- Headline: ${messagingHeadline}\n- Hook: ${messagingHook}` : ''}

TONE: ${tone}
FUNNEL TYPE: ${funnelType}

${customNotes ? `CUSTOM NOTES: ${customNotes}` : ''}

Generate a complete funnel with:
- Hero section with scroll-stopping hook + subhook + CTA
- Social proof section (3+ testimonials, metrics)
- Feature blocks (3-8 features, explicitly reference real product features)
- Value stack (3-10 benefits)
- Urgency section (optional, use if tone is "urgent")
- Final CTA
- Color scheme (primary, secondary, accent hex codes)

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Generate funnel for a persona
 */
export async function generateFunnelForPersona(params: {
  personaId: string;
  messagingId?: string;
  funnelType: FunnelType;
  tone: ToneType;
  customNotes?: string;
}): Promise<Funnel> {
  const { personaId, messagingId, funnelType, tone, customNotes } = params;

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
  const systemPrompt = buildFunnelSystemPrompt(
    persona.product as 'CareerScaleUp' | 'Zevaux',
    persona.audience_type
  );

  const userPrompt = buildFunnelUserPrompt({
    product: persona.product as 'CareerScaleUp' | 'Zevaux',
    audienceType: persona.audience_type,
    funnelType,
    tone,
    personaDescription: persona.description,
    personaPainPoints: persona.pain_points,
    personaGoals: persona.goals,
    messagingHeadline: messaging?.headline,
    messagingHook: messaging?.emotional_hook,
    customNotes,
  });

  // Generate with OpenAI
  const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);

  // Validate AI output with Zod
  const validatedOutput = FunnelSchema.parse(aiOutput);

  // Save to database
  const savedFunnel = await createFunnel({
    persona_id: personaId,
    messaging_id: messagingId || null,
    product: persona.product,
    audience_type: persona.audience_type,
    funnel_type: funnelType,
    tone,
    title: validatedOutput.hero_section.hook,
    content: validatedOutput,
    custom_notes: customNotes,
  });

  return savedFunnel;
}

