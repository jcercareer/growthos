import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { generateJSON } from '../../aiClient';
import { z } from 'zod';
import type { Product, NicheVariantResponse } from '@growth-os/shared';

const CAREERSCALEUP_FEATURES = `
CORE FEATURES: ATS Resume Scanner, AI Resume Writer, Cover Letter Writer, Job Match Engine, Job Search Automations, AI Interview Trainer, Skills Gap Recommender, Chrome Extension
AI COACHING: Career Coach, Job Search Strategy Coach, Resume Coach, Interview Coach, Skill Gap Coach, Career Roadmap Coach
USER PORTFOLIO: username.careerscaleup.com (public subdomain showcasing resume, portfolio, skills)
RECRUITER FEATURES: Post jobs, manage applicants, AI candidate shortlisting, direct messaging
`;

const ZEVAUX_FEATURES = `
CORE FEATURES: AI Receptionist (24/7), books appointments, responds to FAQs, handles missed calls, multi-language support, custom SMB knowledge base, SMS follow-up, lead capture → CRM
`;

const NicheVariantSchema = z.object({
  personaVariant: z.object({
    name: z.string().min(5).max(200),
    ageRange: z.string().min(3).max(50),
    description: z.string().min(50).max(2000),
    painPoints: z.array(z.string().min(10).max(300)).min(3).max(8),
    goals: z.array(z.string().min(10).max(300)).min(3).max(8),
    buyingTriggers: z.array(z.string().min(10).max(300)).min(3).max(8),
  }),
  messagingVariant: z.object({
    headline: z.string().min(10).max(150),
    emotionalHook: z.string().min(20).max(500),
    elevatorPitch: z.string().min(50).max(1000),
    viralTaglines: z.array(z.string().min(10).max(200)).min(3).max(6),
  }),
  scriptVariant: z.object({
    hook: z.string().min(10).max(300),
    body: z.string().min(100).max(2000),
    cta: z.string().min(10).max(200),
    notes: z.string().max(500).optional(),
  }),
  funnelVariant: z.object({
    heroSection: z.object({
      hook: z.string().min(10).max(200),
      subhook: z.string().min(10).max(300),
      ctaText: z.string().min(3).max(50),
    }),
    featureBlocks: z.array(z.object({
      title: z.string().min(5).max(100),
      description: z.string().min(20).max(300),
    })).min(3).max(6),
    valueStack: z.array(z.string().min(10).max(200)).min(3).max(8),
  }),
  adVariant: z.object({
    tiktokScript: z.string().min(50).max(1000),
    facebookPrimaryText: z.string().min(50).max(500),
    googleHeadline: z.string().min(10).max(30),
  }),
  leadMagnetVariant: z.object({
    title: z.string().min(10).max(150),
    subtitle: z.string().min(10).max(200),
    overview: z.string().min(50).max(800),
    benefits: z.array(z.string().min(10).max(200)).min(3).max(8),
  }),
});

export function buildNicheVariantSystemPrompt(product: 'CareerScaleUp' | 'Zevaux', niche: string) {
  const features = product === 'CareerScaleUp' ? CAREERSCALEUP_FEATURES : ZEVAUX_FEATURES;

  return `
You are GrowthOS — JCER's internal AI marketing engine that adapts existing content for specific industry niches.

You are creating a NICHE VARIANT for:
Product: ${product}
Target Niche: ${niche}

${features}

YOUR MISSION:
Take the base persona and messaging provided, and adapt EVERYTHING for the specific niche.

This is how major SaaS companies scale into 10+ markets without rewriting everything.

OUTPUT REQUIREMENTS:

1. PERSONA VARIANT
   - name: Niche-specific persona name
   - ageRange: Typical age range for this niche
   - description: 50-2000 chars, niche-specific details
   - painPoints: 3-8 niche-specific pain points
   - goals: 3-8 niche-specific goals
   - buyingTriggers: 3-8 niche-specific buying triggers

   Examples for Nurses (CareerScaleUp):
   - Pain: "Hospital shifts leave no time to update your resume"
   - Pain: "Medical terminology doesn't translate well to ATS software"
   - Goal: "Land a better-paying nursing position at a top hospital"
   - Trigger: "Seeing colleagues get promoted while stuck in same role"

   Examples for Dental Clinics (Zevaux):
   - Pain: "Patients calling during procedures when staff can't answer"
   - Pain: "Losing revenue from no-shows who couldn't reach us to reschedule"
   - Goal: "Reduce missed appointments by 50%"
   - Trigger: "Realizing how much revenue is lost from missed calls"

2. MESSAGING VARIANT
   - headline: Niche-specific hook (10-150 chars)
   - emotionalHook: Niche pain/desire (20-500 chars)
   - elevatorPitch: Niche value prop (50-1000 chars)
   - viralTaglines: 3-6 niche taglines

   Examples for Nurses:
   - Headline: "Nurse-Friendly Resume Templates Built with Real Job Descriptions"
   - Hook: "Hospital shifts leave you no time for job searching. Your AI career team handles the paperwork while you focus on patients."

   Examples for Dental Clinics:
   - Headline: "Your AI Receptionist Books Appointments While You Focus on Patients"
   - Hook: "Patients calling during lunch breaks? Your AI receptionist handles it — even when your team is busy with procedures."

3. SCRIPT VARIANT (Short-form video)
   - hook: First 3 seconds, niche-specific
   - body: Full script, niche examples
   - cta: Niche-specific call to action
   - notes: Optional production notes

4. FUNNEL VARIANT
   - heroSection: Hook, subhook, CTA for niche
   - featureBlocks: 3-6 features adapted for niche
   - valueStack: 3-8 niche-specific benefits

5. AD VARIANT
   - tiktokScript: 50-1000 char niche script
   - facebookPrimaryText: 50-500 char niche ad
   - googleHeadline: 10-30 char niche headline

6. LEAD MAGNET VARIANT
   - title: Niche-specific lead magnet title
   - subtitle: Clarifying niche angle
   - overview: What they'll get
   - benefits: 3-8 niche outcomes

CRITICAL RULES:
- Use ONLY real ${product} features
- Adapt language to niche (nurses speak differently than dentists)
- Reference niche-specific pain points
- Use industry terminology correctly
- Make it feel like it was built SPECIFICALLY for this niche
- No generic "one-size-fits-all" language
- Be specific about niche workflows and challenges

NICHE LANGUAGE EXAMPLES:

CareerScaleUp - Nurses:
- "From RN to your next role — AI handles the paperwork"
- "Shift-friendly job search tools"
- "Medical terminology optimized for ATS"

CareerScaleUp - Software Engineers:
- "From coding bootcamp to Big Tech"
- "GitHub portfolio automatically synced"
- "Technical resume templates for FAANG"

Zevaux - Dental Clinics:
- "Patient calling during a root canal? We've got it."
- "Hygienist busy? Your AI answers."
- "Filling schedule gaps automatically"

Zevaux - Real Estate:
- "Showing a house? Your AI books the next one."
- "Never miss a buyer lead again"
- "24/7 availability for property inquiries"

Output ONLY valid JSON matching the schema. No markdown, no commentary.
`;
}

export function buildNicheVariantUserPrompt(params: {
  product: Product;
  niche: string;
  basePersona: any;
  baseMessaging: any;
  customNotes?: string;
}) {
  const { product, niche, basePersona, baseMessaging, customNotes } = params;

  return `
Generate a comprehensive niche variant pack for:

Product: ${product}
Target Niche: ${niche}

BASE PERSONA (to adapt):
- Name: ${basePersona.name}
- Description: ${basePersona.description}
- Pain Points: ${basePersona.pain_points.join('; ')}
- Goals: ${basePersona.goals.join('; ')}

BASE MESSAGING (to adapt):
- Headline: ${baseMessaging.headline}
- Hook: ${baseMessaging.emotional_hook}
- Pitch: ${baseMessaging.elevator_pitch}

${customNotes ? `CUSTOM ANGLE:\n${customNotes}\n` : ''}

ADAPT EVERYTHING FOR ${niche}:

1. Persona Variant (niche-specific pain, goals, triggers)
2. Messaging Variant (niche language, hooks, taglines)
3. Script Variant (video script for ${niche})
4. Funnel Variant (hero, features, value stack)
5. Ad Variant (TikTok, Facebook, Google for ${niche})
6. Lead Magnet Variant (title, subtitle, benefits for ${niche})

Make it feel like ${product} was built SPECIFICALLY for ${niche}.
Use industry terminology correctly.
Reference niche-specific workflows and pain points.

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Generate niche variant (no DB write)
 */
export async function generateNicheVariantPack(params: {
  product: Product;
  niche: string;
  personaId: string;
  messagingId: string;
  notes?: string;
}): Promise<NicheVariantResponse> {
  const { product, niche, personaId, messagingId, notes } = params;

  // Look up base persona and messaging
  const persona = await getPersonaById(personaId);
  if (!persona) {
    throw new Error('Persona not found');
  }

  const messaging = await getMessagingById(messagingId);
  if (!messaging) {
    throw new Error('Messaging not found');
  }

  // Build prompts
  const systemPrompt = buildNicheVariantSystemPrompt(
    product as 'CareerScaleUp' | 'Zevaux',
    niche
  );

  const userPrompt = buildNicheVariantUserPrompt({
    product,
    niche,
    basePersona: persona,
    baseMessaging: messaging,
    customNotes: notes,
  });

  // Generate with OpenAI
  const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);

  // Validate AI output with Zod
  const validatedOutput = NicheVariantSchema.parse(aiOutput);

  return validatedOutput;
}

