import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { generateJSON } from '../../aiClient';
import { z } from 'zod';
import type { Product, AudienceType, SocialProofPackResponse } from '@growth-os/shared';

const SocialProofPackSchema = z.object({
  testimonialCards: z.array(z.object({
    quote: z.string().min(20).max(500),
    displayName: z.string().min(2).max(50),
    roleOrLabel: z.string().min(3).max(100),
    styleTag: z.string().max(50).optional(),
  })).min(5).max(12),
  miniCaseStudies: z.array(z.object({
    title: z.string().min(10).max(200),
    scenario: z.string().min(50).max(500),
    intervention: z.string().min(50).max(500),
    outcome: z.string().min(50).max(500),
    pullQuote: z.string().min(20).max(300),
  })).min(2).max(5),
  proofBullets: z.array(z.string().min(10).max(200)).min(5).max(15),
  founderNote: z.object({
    title: z.string().min(10).max(100),
    body: z.string().min(100).max(1000),
  }),
  trustBadges: z.array(z.string().min(3).max(50)).min(4).max(10),
});

export function buildSocialProofPackSystemPrompt(product: 'CareerScaleUp' | 'Zevaux') {
  return `
You are GrowthOS — JCER's internal AI marketing engine that generates Social Proof Packs for ${product}.

OUTPUT REQUIREMENTS:
Generate a comprehensive social proof pack with:

1. TESTIMONIAL CARDS (5-12 testimonials)
   Each testimonial:
   - quote: Customer testimonial (20-500 chars)
   - displayName: Generic name like "Sarah K.", "Mike T.", "Dr. Chen"
   - roleOrLabel: Role like "Marketing Manager", "Dental Clinic Owner", "Recent Grad"
   - styleTag: Optional tag like "job seeker", "SMB owner", "recruiter"

   Testimonial Style:
   - Specific, believable outcomes
   - Emotional + rational
   - Before → After structure
   - NO fake specific numbers
   - Generic but authentic-sounding
   
   Examples:
   - "I was stuck applying to hundreds of jobs with no responses. After using this tool, I got 3 interviews in my first week. The ATS optimization made all the difference."
   - "We were losing customers left and right because we couldn't answer calls after hours. Now our AI receptionist handles everything. It's like having a full-time employee who never sleeps."
   - "Screening candidates used to take me 10+ hours a week. Now I can shortlist qualified people in minutes and focus on actual interviews."

2. MINI CASE STUDIES (2-5 case studies)
   Each case study:
   - title: Descriptive title (10-200 chars)
   - scenario: Before situation (50-500 chars)
   - intervention: How ${product} was used (50-500 chars)
   - outcome: After results (50-500 chars)
   - pullQuote: Highlighted quote (20-300 chars)

   Case Study Structure:
   - Realistic scenarios (no fake companies)
   - Clear problem → solution → outcome
   - Specific feature usage
   - Believable results
   
   Example for CareerScaleUp Job Seeker:
   - Title: "From Resume Black Hole to Multiple Offers"
   - Scenario: "A mid-career IT professional was sending out 50+ applications per week with zero responses. Standard resume templates weren't working."
   - Intervention: "Used the ATS Resume Scanner to identify keyword gaps, then optimized the resume with AI suggestions. Set up the Chrome Extension to match resume to each job posting."
   - Outcome: "Within 2 weeks, got interview requests from 3 companies. Accepted a role with 15% higher salary than previous job. The key was understanding what ATS systems were actually looking for."
   - PullQuote: "I went from invisible to in-demand in less than a month."

3. PROOF BULLETS (5-15 bullets)
   Short, powerful statements:
   - "Helps you avoid ATS rejections"
   - "Never lose a customer because of missed calls"
   - "Find qualified candidates 5x faster"
   - "Built on enterprise-grade AWS infrastructure"
   - "Works with your existing workflow"
   - "No credit card required to start"
   
   Rules:
   - Action-oriented
   - Specific but not fake-specific
   - Trust-building
   - Feature + benefit combined

4. FOUNDER NOTE
   - title: Note title (10-100 chars)
   - body: Sincere message from founder (100-1000 chars)
   
   Founder Note Style:
   - Personal, vulnerable
   - Shares the "why" behind ${product}
   - Addresses audience's pain directly
   - Mission-driven, not sales-y
   - Authentic voice
   
   Example for CareerScaleUp:
   "I built CareerScaleUp after watching my sister send 200+ job applications with almost zero responses. She's smart, qualified, and driven—but modern hiring systems weren't giving her a chance. I realized the problem wasn't her skills. It was that ATS software was filtering her out before any human ever saw her resume. That's wrong. Everyone deserves a fair shot at opportunities. That's why we built tools that level the playing field. We're not here to game the system—we're here to make sure your real qualifications actually get seen. You've worked too hard to be invisible. Let's fix that together."

5. TRUST BADGES (4-10 badges)
   Text-only labels:
   - "ATS-friendly"
   - "Built on AWS"
   - "GDPR compliant"
   - "256-bit encryption"
   - "No credit card required"
   - "Used by professionals in 50+ countries"
   - "Rated 4.8/5 by users"
   - "Free tier available"
   - "Cancel anytime"
   - "24/7 support"

CRITICAL RULES:
- NO fake company names
- NO specific fake numbers ("increased revenue by 47%")
- Use generic but believable names ("Sarah K.", not "Sarah Johnson from Acme Corp")
- Testimonials must be realistic and specific to ${product} features
- Case studies must reference real product capabilities
- Founder note must be sincere and mission-driven
- Trust badges must be factual or aspirational

TONE:
- Authentic, not salesy
- Specific, not vague
- Emotional + rational
- Build trust through specificity

Output ONLY valid JSON matching the schema. No markdown, no commentary.
`;
}

export function buildSocialProofPackUserPrompt(params: {
  product: Product;
  audienceType: AudienceType;
  personaDescription: string;
  personaPainPoints: string[];
  personaGoals: string[];
  messagingHeadline?: string;
}) {
  const {
    product,
    audienceType,
    personaDescription,
    personaPainPoints,
    personaGoals,
    messagingHeadline,
  } = params;

  return `
Generate a comprehensive social proof pack for ${product} targeting ${audienceType}.

PERSONA CONTEXT:
- Description: ${personaDescription}
- Pain Points: ${personaPainPoints.join('; ')}
- Goals: ${personaGoals.join('; ')}

${messagingHeadline ? `EXISTING MESSAGING: ${messagingHeadline}` : ''}

Generate:
1. Testimonial Cards (5-12 testimonials with generic names, specific outcomes)
2. Mini Case Studies (2-5 case studies with before/after structure)
3. Proof Bullets (5-15 trust-building statements)
4. Founder Note (sincere message addressing this persona's pain)
5. Trust Badges (4-10 text labels building credibility)

All content must:
- Reference real ${product} features
- Use generic but believable names
- Be specific without being fake-specific
- Build trust through authenticity
- Address persona's pain points directly

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Generate social proof pack (generate-only, no DB write)
 */
export async function generateSocialProofPackForPersona(params: {
  product: Product;
  audienceType: AudienceType;
  personaId: string;
  messagingId: string;
  campaignAngle?: string;
}): Promise<SocialProofPackResponse> {
  const { product, audienceType, personaId, messagingId } = params;

  const persona = await getPersonaById(personaId);
  if (!persona) {
    throw new Error('Persona not found');
  }

  const messaging = await getMessagingById(messagingId);
  if (!messaging) {
    throw new Error('Messaging not found');
  }

  const systemPrompt = buildSocialProofPackSystemPrompt(product as 'CareerScaleUp' | 'Zevaux');

  const userPrompt = buildSocialProofPackUserPrompt({
    product,
    audienceType,
    personaDescription: persona.description,
    personaPainPoints: persona.pain_points,
    personaGoals: persona.goals,
    messagingHeadline: messaging.headline,
  });

  const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);
  const validatedOutput = SocialProofPackSchema.parse(aiOutput);

  return {
    meta: {
      product: product as string,
      audience: audienceType as string,
    },
    ...validatedOutput,
  };
}

