import { createSocialProofPack } from '../../repositories/socialProofPacks';
import { generateJSON } from '../../aiClient';
import { SocialProofPackSchema } from '../../aiSchemas';
import type { SocialProofPack, Product } from '@growth-os/shared';

export function buildSocialProofPackSystemPrompt(product: 'CareerScaleUp' | 'Zevaux') {
  return `
You are GrowthOS — JCER's internal AI marketing engine that generates Social Proof Packs for ${product}.

OUTPUT REQUIREMENTS:
You MUST generate a complete social proof pack with:
1. Title (10-200 chars)
2. Testimonials (3-15 customer testimonials)
   - Each: quote (20-500 chars), author_name (optional), author_title (optional), rating (1-5, optional)
3. Case Studies (0-5 case studies)
   - Each: title, summary (50-1000 chars), results (3-8 bullet points)
4. Metrics (3-10 key metrics)
   - Each: value (e.g., "10,000+", "95%"), label (e.g., "Users helped", "Success rate")
5. Reviews (0-10 reviews from platforms)
   - Each: source (e.g., "G2", "Trustpilot", "Capterra"), rating (1-5), quote
6. Founder Note (optional)
   - author, title, message (50-1000 chars), photo_url (optional)

SOCIAL PROOF BEST PRACTICES:
- Testimonials: specific, emotional, results-oriented (generic placeholders only)
- Case studies: real-world scenarios, quantifiable results
- Metrics: impressive, specific, credible
- Reviews: platform-specific language
- Founder note: authentic, vulnerable, mission-driven

IMPORTANT: Generate ONLY generic placeholder testimonials. No fake "real" people.

Examples:
- "This tool helped me land 3 interviews in 2 weeks after months of struggling."
- "Our team saves 10+ hours per week on candidate screening."
- "We've recovered over $50K in lost leads since using this AI receptionist."

Output ONLY valid JSON matching the SocialProofPackSchema (no extra commentary).
`;
}

export function buildSocialProofPackUserPrompt(params: {
  product: 'CareerScaleUp' | 'Zevaux';
  customNotes?: string;
}) {
  const { product, customNotes } = params;

  return `
Generate a social proof pack for ${product}.

${customNotes ? `CUSTOM NOTES: ${customNotes}` : ''}

Generate:
- Title (10-200 chars)
- Testimonials (3-15 generic placeholder testimonials with quotes, optional author details, ratings)
- Case Studies (0-5 case studies with title, summary, results)
- Metrics (3-10 key metrics: value + label)
- Reviews (0-10 platform reviews: source, rating, quote)
- Founder Note (optional: author, title, message)

Use ONLY generic placeholders. No fake "real" people.

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Generate social proof pack for a product
 */
export async function generateSocialProofPackForProduct(params: {
  product: Product;
  customNotes?: string;
}): Promise<SocialProofPack> {
  const { product, customNotes } = params;

  // Build prompts
  const systemPrompt = buildSocialProofPackSystemPrompt(
    product as 'CareerScaleUp' | 'Zevaux'
  );

  const userPrompt = buildSocialProofPackUserPrompt({
    product: product as 'CareerScaleUp' | 'Zevaux',
    customNotes,
  });

  // Generate with OpenAI
  const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);

  // Validate AI output with Zod
  const validatedOutput = SocialProofPackSchema.parse(aiOutput);

  // Save to database
  const savedSocialProofPack = await createSocialProofPack({
    product,
    title: validatedOutput.title,
    testimonials: validatedOutput.testimonials,
    case_studies: validatedOutput.case_studies,
    metrics: validatedOutput.metrics,
    reviews: validatedOutput.reviews,
    founder_note: validatedOutput.founder_note,
    custom_notes: customNotes,
  });

  return savedSocialProofPack;
}

