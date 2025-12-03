import { createPricingPagePack } from '../../repositories/pricingPagePacks';
import { generateJSON } from '../../aiClient';
import { PricingPagePackSchema } from '../../aiSchemas';
import type { PricingPagePack, Product } from '@growth-os/shared';

const CAREERSCALEUP_FEATURES = `
FREE TIER: Basic ATS Resume Scanner, limited job matches
BASIC TIER: Full ATS Resume Scanner + AI Resume Writer, AI Cover Letter Writer, Job Match Engine, 50 job applications/month
PRO TIER: Everything in Basic + AI Interview Trainer, Skills Gap Recommender, Chrome Extension, Job Search Automations, AI Coaches (Career, Resume, Interview, Job Search Strategy), subdomain portfolio (username.careerscaleup.com), unlimited job applications
ENTERPRISE TIER (Recruiters): Post unlimited jobs, manage applicants, AI candidate shortlisting, direct messaging, view candidate portfolios, analytics dashboard
`;

const ZEVAUX_FEATURES = `
FREE TIER: 50 calls/month, basic FAQ responses
BASIC TIER: 500 calls/month, appointment booking, missed call handling, SMS follow-up, email notifications
PRO TIER: Unlimited calls, multi-language support, custom knowledge base, real-time notifications, hyper-human voice, n8n automations, lead capture → CRM
ENTERPRISE TIER: Everything in Pro + dedicated account manager, custom integrations, priority support, white-label option
`;

export function buildPricingPagePackSystemPrompt(product: 'CareerScaleUp' | 'Zevaux') {
  const features = product === 'CareerScaleUp' ? CAREERSCALEUP_FEATURES : ZEVAUX_FEATURES;

  return `
You are GrowthOS — JCER's internal AI marketing engine that generates Pricing Page Packs for ${product}.

${features}

OUTPUT REQUIREMENTS:
You MUST generate a complete pricing page with:
1. Title (10-200 chars)
2. Headline (10-150 chars, scroll-stopping, value-driven)
3. Subheadline (20-300 chars, clarifying, benefit-oriented)
4. Tiers (2-5 pricing tiers)
   - Each tier: tier (free/basic/pro/enterprise), name, price, billing_period, features (3-15), cta_text, highlighted (bool)
5. FAQ (3-10 Q&A pairs)
6. Guarantee Section (optional: money-back guarantee, free trial details)

PRICING BEST PRACTICES:
- Highlight the PRO tier (most popular)
- Clear feature differentiation between tiers
- Price anchoring (show value vs. competitors)
- CTAs: action-oriented ("Start Free Trial", "Get Started", "Contact Sales")
- Features: specific, benefit-driven, use real product features only

FAQ TOPICS:
- Billing/payment methods
- Cancellation policy
- Feature limits
- Support availability
- Data security/privacy
- Upgrades/downgrades

Output ONLY valid JSON matching the PricingPagePackSchema (no extra commentary).
`;
}

export function buildPricingPagePackUserPrompt(params: {
  product: 'CareerScaleUp' | 'Zevaux';
  customNotes?: string;
}) {
  const { product, customNotes } = params;

  return `
Generate a pricing page for ${product}.

${customNotes ? `CUSTOM NOTES: ${customNotes}` : ''}

Generate:
- Title (10-200 chars)
- Headline (10-150 chars, value-driven)
- Subheadline (20-300 chars, benefit-oriented)
- Tiers (2-5 tiers: free, basic, pro, enterprise)
  - Each tier: name, price, billing_period, features (3-15), cta_text, highlighted (true for PRO)
- FAQ (3-10 Q&A pairs addressing common pricing questions)
- Guarantee Section (optional: money-back guarantee or free trial info)

Use ONLY real product features. Make the PRO tier highlighted.

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Generate pricing page pack for a product
 */
export async function generatePricingPagePackForProduct(params: {
  product: Product;
  customNotes?: string;
}): Promise<PricingPagePack> {
  const { product, customNotes } = params;

  // Build prompts
  const systemPrompt = buildPricingPagePackSystemPrompt(
    product as 'CareerScaleUp' | 'Zevaux'
  );

  const userPrompt = buildPricingPagePackUserPrompt({
    product: product as 'CareerScaleUp' | 'Zevaux',
    customNotes,
  });

  // Generate with OpenAI
  const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);

  // Validate AI output with Zod
  const validatedOutput = PricingPagePackSchema.parse(aiOutput);

  // Save to database
  const savedPricingPagePack = await createPricingPagePack({
    product,
    title: validatedOutput.title,
    headline: validatedOutput.headline,
    subheadline: validatedOutput.subheadline,
    tiers: validatedOutput.tiers,
    faq: validatedOutput.faq,
    guarantee_section: validatedOutput.guarantee_section,
    custom_notes: customNotes,
  });

  return savedPricingPagePack;
}

