import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { generateJSON } from '../../aiClient';
import { z } from 'zod';
import type { Product, AudienceType, PricingPackResponse } from '@growth-os/shared';
import { buildPrompt } from '../../prompts/applySystemPrompt';

const PricingPackSchema = z.object({
  hero: z.object({
    title: z.string().min(10).max(150),
    subtitle: z.string().min(20).max(300),
  }),
  plans: z.array(z.object({
    name: z.string().min(3).max(50),
    tagline: z.string().min(10).max(150),
    idealFor: z.string().min(10).max(200),
    pricePlaceholder: z.string().min(2).max(50),
    billingNotes: z.string().max(100).optional(),
    features: z.array(z.string().min(5).max(200)).min(3).max(15),
    highlight: z.boolean().optional(),
  })).min(2).max(4),
  comparisonTable: z.object({
    rows: z.array(z.object({
      label: z.string().min(5).max(100),
      jobSeekerValue: z.string().max(50).optional(),
      recruiterValue: z.string().max(50).optional(),
      smbValue: z.string().max(50).optional(),
    })).min(5).max(15),
  }),
  faq: z.array(z.object({
    question: z.string().min(10).max(200),
    answer: z.string().min(20).max(1000),
  })).min(5).max(12),
  guaranteeSection: z.object({
    headline: z.string().min(10).max(100),
    body: z.string().min(50).max(500),
  }),
  whoThisIsFor: z.object({
    bullets: z.array(z.string().min(10).max(200)).min(3).max(8),
  }),
  whoThisIsNotFor: z.object({
    bullets: z.array(z.string().min(10).max(200)).min(3).max(8),
  }),
});

const CAREERSCALEUP_PRICING = `
FREE TIER: Basic ATS Resume Scanner, limited job matches (5/week)
BASIC ($19/mo): Full ATS Scanner, AI Resume Writer, Cover Letter Writer, Job Match Engine, 50 applications/month
PRO ($49/mo): Everything in Basic + AI Interview Trainer, Skills Gap Recommender, Chrome Extension, Job Search Automations, AI Coaches, subdomain portfolio, unlimited applications
RECRUITER TIER ($99/mo): Post unlimited jobs, manage applicants, AI candidate shortlisting, direct messaging, view candidate portfolios, analytics dashboard
`;

const ZEVAUX_PRICING = `
STARTER ($49/mo): 500 calls/month, basic FAQ responses, appointment booking, email notifications
PRO ($149/mo): Unlimited calls, multi-language support, custom knowledge base, SMS follow-up, real-time notifications, hyper-human voice quality
ENTERPRISE (Custom): Everything in Pro + dedicated account manager, custom integrations, priority support, white-label option, SLA guarantees
`;

export function buildPricingPackSystemPrompt(product: 'CareerScaleUp' | 'Zevaux') {
  const pricing = product === 'CareerScaleUp' ? CAREERSCALEUP_PRICING : ZEVAUX_PRICING;

  return `
You are GrowthOS — JCER's internal AI marketing engine that generates Pricing Page Packs for ${product}.

${pricing}

OUTPUT REQUIREMENTS:
Generate a comprehensive pricing page pack with:

1. HERO SECTION
   - title: Pricing page headline (10-150 chars)
   - subtitle: Clarifying subheadline (20-300 chars)
   
   Examples:
   - "Simple Pricing, Powerful Results"
   - "Choose the plan that fits your goals"
   - "From free tools to full AI career team"

2. PLANS (2-4 pricing tiers)
   Each plan:
   - name: Plan name (e.g., "Free", "Basic", "Pro", "Enterprise")
   - tagline: One-line value prop (10-150 chars)
   - idealFor: Who this is perfect for (10-200 chars)
   - pricePlaceholder: Price display (e.g., "$19/mo", "Contact us", "Free")
   - billingNotes: Optional billing info (e.g., "Billed annually")
   - features: 3-15 specific features
   - highlight: true for recommended plan (usually Pro)
   
   Feature Guidelines:
   - Be specific about limits ("50 applications/month", not "limited applications")
   - Lead with value, not just features
   - Use checkmarks mentally: "✓ Feature name"
   - Examples:
     * "ATS-optimized resume in 60 seconds"
     * "Unlimited AI-powered job matches"
     * "24/7 AI receptionist (never misses a call)"
     * "Multi-language support (12+ languages)"

3. COMPARISON TABLE
   rows: 5-15 feature comparison rows
   Each row:
   - label: Feature name
   - jobSeekerValue: Value for job seeker plans (if applicable)
   - recruiterValue: Value for recruiter plans (if applicable)
   - smbValue: Value for SMB plans (if applicable)
   
   Use "✓", "✗", specific limits, or tier names
   
   Examples:
   - { label: "ATS Resume Scanner", jobSeekerValue: "✓", recruiterValue: "✗" }
   - { label: "Monthly Applications", jobSeekerValue: "50", recruiterValue: "Unlimited" }
   - { label: "AI Coaches", jobSeekerValue: "Basic only", recruiterValue: "All coaches" }

4. FAQ (5-12 Q&A pairs)
   Common questions:
   - "Can I cancel anytime?" → "Yes, cancel anytime with no penalties."
   - "Do you offer refunds?" → "30-day money-back guarantee if you're not satisfied."
   - "What payment methods do you accept?" → "All major credit cards, PayPal, and bank transfers for annual plans."
   - "Can I upgrade or downgrade?" → "Yes, upgrade/downgrade anytime. We'll prorate your billing."
   - "Is there a free trial?" → Details about free tier or trial period
   - "What happens if I exceed my plan limits?" → Overage policies
   - "Do you offer discounts?" → Student, nonprofit, annual billing discounts
   - "Is my data secure?" → Security practices

5. GUARANTEE SECTION
   - headline: Guarantee headline (10-100 chars)
   - body: Guarantee details (50-500 chars)
   
   Examples:
   - "30-Day Money-Back Guarantee"
   - "If you don't see results in 30 days, we'll refund every penny. No questions asked."
   - "Try risk-free for 60 days. If our AI receptionist doesn't capture at least one lead, full refund."

6. WHO THIS IS FOR (3-8 bullets)
   Ideal customers:
   - "Job seekers tired of getting auto-rejected by ATS software"
   - "Recruiters spending 10+ hours/week on manual candidate screening"
   - "SMB owners losing revenue from missed calls"
   - "Career changers looking to break into a new industry"
   - "Dental clinics missing appointments due to phone tag"

7. WHO THIS IS NOT FOR (3-8 bullets)
   Not ideal customers (honest, builds trust):
   - "People who prefer manual job searching without AI assistance"
   - "Companies looking for a full enterprise ATS replacement"
   - "Businesses that rarely receive phone calls"
   - "Those who want someone else to apply to jobs for them (we're a tool, not a service)"
   - "Call centers with dedicated 24/7 phone staff already in place"

CRITICAL RULES:
- Use ONLY real ${product} features and pricing tiers
- Be specific about limits and features
- Highlight the Pro/recommended tier
- FAQ must address real concerns
- "Who This Is NOT For" builds trust through honesty
- Price placeholders should be realistic
- Comparison table must be clear and scannable

Output ONLY valid JSON matching the schema. No markdown, no commentary.
`;
}

export function buildPricingPackUserPrompt(params: {
  product: Product;
  audienceType: AudienceType;
  personaDescription: string;
  personaPainPoints: string[];
  messagingHeadline?: string;
}) {
  const {
    product,
    audienceType,
    personaDescription,
    personaPainPoints,
    messagingHeadline,
  } = params;

  return `
Generate a comprehensive pricing page pack for ${product} targeting ${audienceType}.

PERSONA CONTEXT:
- Description: ${personaDescription}
- Pain Points: ${personaPainPoints.join('; ')}

${messagingHeadline ? `EXISTING MESSAGING: ${messagingHeadline}` : ''}

Generate:
1. Hero (title + subtitle)
2. Plans (2-4 pricing tiers with features, highlight Pro/recommended)
3. Comparison Table (5-15 feature rows)
4. FAQ (5-12 common questions)
5. Guarantee Section (money-back guarantee or risk-free trial)
6. Who This Is For (3-8 ideal customer bullets)
7. Who This Is NOT For (3-8 non-ideal customer bullets)

Focus on ${audienceType} needs and pain points.
Be specific about features and limits.
Build trust through honesty.

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Generate pricing pack (generate-only, no DB write)
 */
export async function generatePricingPackForPersona(params: {
  product: Product;
  audienceType: AudienceType;
  personaId: string;
  messagingId: string;
  campaignAngle?: string;
}): Promise<PricingPackResponse> {
  const { product, audienceType, personaId, messagingId } = params;

  const persona = await getPersonaById(personaId);
  if (!persona) {
    throw new Error('Persona not found');
  }

  const messaging = await getMessagingById(messagingId);
  if (!messaging) {
    throw new Error('Messaging not found');
  }

  const { systemPrompt, userPrompt } = buildPrompt(
    buildPricingPackSystemPrompt(product as 'CareerScaleUp' | 'Zevaux'),
    buildPricingPackUserPrompt({
      product,
      audienceType,
      personaDescription: persona.description,
      personaPainPoints: persona.pain_points,
      messagingHeadline: messaging.headline,
    })
  );

  const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);
  const validatedOutput = PricingPackSchema.parse(aiOutput);

  return {
    meta: {
      product: product as string,
      audience: audienceType as string,
    },
    ...validatedOutput,
  };
}

