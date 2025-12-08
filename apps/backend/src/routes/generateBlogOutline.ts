import { Request, Response } from 'express';
import { z } from 'zod';
import { generateJSON } from '../aiClient';
import { BlogOutlineSchema, BlogOutlineAIOutput } from '../aiSchemas';
import { getPersonaById, getMessagingById, createBlogOutline } from '../repositories';
import type {
  Product,
  Persona,
  Messaging,
  GrowthOSResult,
  ContentBlock,
  ImagePrompt,
} from '@growth-os/shared';
import { openai } from '../aiClient';

// ============================================================
// SYSTEM PROMPT
// ============================================================
export const blogOutlineSystemPrompt = `
You generate highly practical, SEO-aware blog post outlines for JCER's SaaS products in the United States.

Products:

1. CareerScaleUp (AI career platform for job seekers and career changers):
   - AI Resume Optimizer (ATS rewriting, formatting, keyword infusion)
   - Job Description Matching Engine (tailors resume to specific roles)
   - AI Career Clarity Coach (skill analysis, suggested career paths)
   - Interview Prep Simulator (AI mock interviews and feedback)
   - Job Application Tracker (auto-organization, reminders, follow-up)
   - AI Cover Letter Generator (job-specific cover letters)
   - Personal Branding / LinkedIn Optimization (headline, about, keywords)

2. Zevaux (AI receptionist and automation suite for SMBs and agencies):
   - AI Voice Receptionist (24/7 call answering, greeting, routing)
   - AI Lead Qualification (asks screening questions and scores leads)
   - Automated Appointment Scheduling (calendar sync + reminders)
   - AI Follow-up Engine (SMS/email after missed or completed calls)
   - Workflow Automation (n8n-style sequences across tools)
   - Client Onboarding Flows (forms, steps, notifications)
   - CRM-lite contact log and conversation summaries

General rules:
- Every outline must be tightly tied to the selected product AND to the specific persona and messaging passed in.
- At least 4 sections must explicitly reference concrete product features and how they solve the persona's real-world problems.
- Use real U.S. context: ATS rejections, layoffs, inflation, missed calls, lost revenue, burnout, limited hiring budgets, etc.
- Write with clear, persuasive, but educational tone. This content will be used for SEO and to warm up leads.
- Do NOT be generic. The reader should clearly feel: "This is written for someone exactly like me, and it clearly explains how CareerScaleUp or Zevaux helps."

Output policy:
- Output ONLY a JSON object that matches our Zod schema:
  - title: string
  - sections: array of { heading: string; bullets: string[] }
  - seo_keywords: string[] (optional)
  - meta_description: string (optional)
- Do not add any extra fields.
- Do not include markdown, code fences, or commentary – just raw JSON.
`;

// ============================================================
// USER PROMPT BUILDER
// ============================================================
export function buildBlogOutlineUserPrompt(params: {
  product: "CareerScaleUp" | "Zevaux";
  personaName: string;
  personaDescription: string;
  personaPainPoints: string[]; // can be joined into text
  messagingHeadline: string;
  messagingElevatorPitch: string;
}) {
  const {
    product,
    personaName,
    personaDescription,
    personaPainPoints,
    messagingHeadline,
    messagingElevatorPitch,
  } = params;

  const joinedPainPoints =
    personaPainPoints && personaPainPoints.length > 0
      ? personaPainPoints.join("; ")
      : "No explicit pain points provided.";

  return `
You are writing a long-form blog outline for the product: ${product}.

Target persona:
- Name: ${personaName}
- Description: ${personaDescription}
- Key pain points: ${joinedPainPoints}

Core messaging to align with:
- Headline: ${messagingHeadline}
- Elevator pitch: ${messagingElevatorPitch}

Goal:
- Create a blog outline that educates this specific persona, builds trust, and naturally leads them to try ${product}.
- The article should feel like a mini "playbook" for their situation, not generic advice.

JSON shape to output (no extra fields):

{
  "title": string,
  "sections": [
    {
      "heading": string,
      "bullets": string[]
    }
  ],
  "seo_keywords": string[],
  "meta_description": string
}

Content rules:
- Title: compelling, benefit-driven, under ~70 characters, includes a key phrase relevant to ${product}.
- Meta description: 140–170 characters, includes the persona's main outcome and mentions ${product} by name.
- Outline:
  - 6–9 sections.
  - At least 4 sections must directly reference concrete ${product} features and how they solve the persona's problems in real-world U.S. scenarios.
  - Include sections that:
    - Describe the persona's current struggle
    - Explain the impact of that struggle (lost time, money, energy, missed opportunities)
    - Show how ${product} features fix those issues step by step
    - Offer a simple action plan for the reader
  - Bullets should be specific and practical, not vague advice.
- SEO:
  - seoKeywords must be 6–12 phrases the persona might actually search for on Google (e.g., for CareerScaleUp: "beat ATS resume", "AI resume for U.S. jobs"; for Zevaux: "AI receptionist for small business", "automate missed call follow up").
- Use U.S. spelling and examples.

Return ONLY the JSON object that matches the shape above.`;
}

// Input validation schema
const GenerateBlogOutlineInputSchema = z.object({
  personaId: z.string().uuid(),
  messagingId: z.string().uuid(),
  generateImages: z.boolean().optional(),
});

export async function generateBlogOutlineHandler(req: Request, res: Response) {
  try {
    // Validate input
    const input = GenerateBlogOutlineInputSchema.parse(req.body);
    const { personaId, messagingId } = input;

    // Look up persona and messaging
    const [persona, messaging] = await Promise.all([
      getPersonaById(personaId),
      getMessagingById(messagingId),
    ]);

    if (!persona) {
      return res.status(404).json({
        success: false,
        error: 'Persona not found',
      });
    }

    if (!messaging) {
      return res.status(404).json({
        success: false,
        error: 'Messaging not found',
      });
    }

    // Build system prompt
    const systemPrompt = blogOutlineSystemPrompt;

    // Build user prompt with individual fields from persona and messaging
    const userPrompt = buildBlogOutlineUserPrompt({
      product: persona.product as "CareerScaleUp" | "Zevaux",
      personaName: persona.name,
      personaDescription: persona.description,
      personaPainPoints: persona.pain_points,
      messagingHeadline: messaging.headline,
      messagingElevatorPitch: messaging.elevator_pitch,
    });

    // Generate with OpenAI
    const aiOutput = await generateJSON<BlogOutlineAIOutput>(
      systemPrompt,
      userPrompt
    );

    // Validate AI output with Zod
    const validatedOutput = BlogOutlineSchema.parse(aiOutput);

    // Save to database (map AI output to DB schema)
    const savedOutline = await createBlogOutline({
      persona_id: personaId,
      messaging_id: messagingId,
      title: validatedOutput.title,
      outline: {
        sections: validatedOutput.sections.map(section => ({
          title: section.heading,
          points: section.bullets,
        })),
        seo_keywords: validatedOutput.seo_keywords,
        meta_description: validatedOutput.meta_description,
      },
    });

    // Map to GrowthOSResult structure for UI blocks + image prompts
    const productName = persona.product;
    const heroBlock: ContentBlock = {
      id: 'hero-1',
      type: 'hero',
      title: validatedOutput.title,
      subtitle: validatedOutput.meta_description,
      body: `Blog outline for ${productName} tailored to ${persona.name}`,
      emphasis: 'primary',
      imageRefIds: ['img-hero'],
    };

    const sectionBlocks: ContentBlock[] = validatedOutput.sections.map((section, idx) => ({
      id: `section-${idx + 1}`,
      type: 'section',
      title: section.heading,
      bullets: section.bullets,
    }));

    const takeaways: ContentBlock = {
      id: 'takeaways-1',
      type: 'bulletList',
      title: 'Key Takeaways',
      bullets: validatedOutput.seo_keywords && validatedOutput.seo_keywords.length > 0
        ? validatedOutput.seo_keywords
        : ['Focus on persona pains', 'Show product fit', 'Include clear CTA'],
    };

    const ctaBlock: ContentBlock = {
      id: 'cta-1',
      type: 'cta',
      title: `Try ${productName} today`,
      subtitle: 'Put this playbook into action with AI that does the heavy lifting.',
      ctaLabel: productName === 'CareerScaleUp' ? 'Optimize my resume' : 'Book more calls',
      ctaUrl: productName === 'CareerScaleUp'
        ? 'https://careerscaleup.com'
        : 'https://zevaux.com',
      emphasis: 'primary',
    };

    const imagePrompts: ImagePrompt[] = [
      {
        id: 'img-hero',
        useCase: 'blogHeader',
        prompt:
          productName === 'CareerScaleUp'
            ? 'Header image of a professional reviewing AI-enhanced resume insights on a laptop, hybrid SaaS + AI, clean white UI, purple/blue accent'
            : 'Header image of an AI receptionist dashboard handling calls for an SMB, hybrid SaaS + AI, clean white UI, purple/blue accent',
        styleHint: 'hybrid SaaS + AI, clean, purple/blue gradient',
      },
      {
        id: 'img-ui-1',
        useCase: 'uiMockup',
        prompt:
          productName === 'CareerScaleUp'
            ? 'UI mockup showing ATS resume scan results with actionable fixes, modern SaaS dashboard'
            : 'UI mockup showing missed-call auto-reply and appointment booking timeline for a local business',
        styleHint: 'clean SaaS, rounded cards, subtle shadow',
      },
      {
        id: 'img-ui-2',
        useCase: 'uiMockup',
        prompt:
          productName === 'CareerScaleUp'
            ? 'Comparison view of before/after resume keyword match score with AI suggestions'
            : 'Lead qualification chat transcript and scoring panel inside AI receptionist dashboard',
        styleHint: 'hybrid SaaS + AI, minimal, readable',
      },
    ];

    const images: GrowthOSResult['images'] = [];

    // Helper: fallback to free stock (Unsplash) if AI images unavailable
    const addStockImages = () => {
      const maxImages = Math.min(imagePrompts.length, 2);
      for (let i = 0; i < maxImages; i++) {
        const promptDef = imagePrompts[i];
        const q = encodeURIComponent(promptDef.prompt.slice(0, 120));
        images.push({
          url: `https://source.unsplash.com/featured/?${q}`,
          useCase: promptDef.useCase,
          prompt: promptDef.prompt,
        });
      }
    };

    // Optional: generate actual images if requested
    if (input.generateImages) {
      const maxImages = Math.min(imagePrompts.length, 2);
      let generated = 0;
      for (let i = 0; i < maxImages; i++) {
        const promptDef = imagePrompts[i];
        try {
          const imgResp = await openai.images.generate({
            // Known stable model; adjust if needed
            model: 'dall-e-3',
            prompt: `${promptDef.prompt} ${promptDef.styleHint || ''}`,
            size: '1024x1024',
          });
          const url = imgResp.data?.[0]?.url;
          if (url) {
            images.push({
              url,
              useCase: promptDef.useCase,
              prompt: promptDef.prompt,
            });
            generated++;
          }
        } catch (err) {
          console.error('Image generation failed:', err);
        }
      }

      // Fallback to stock if nothing returned
      if (generated === 0) {
        addStockImages();
      }
    }

    const growthResult: GrowthOSResult = {
      rawTextSummary:
        validatedOutput.meta_description ||
        `Blog outline for ${persona.name} (${productName}) focused on pains and product fit.`,
      blocks: [heroBlock, ...sectionBlocks, takeaways, ctaBlock],
      imagePrompts,
      images,
      notes: 'Use blocks to render sections; pair hero with img-hero; use UI mockups inline.',
    };

    // Return saved record plus structured result
    res.status(201).json({
      success: true,
      data: {
        outline: savedOutline,
        growth: growthResult,
      },
    });
  } catch (error) {
    console.error('Error generating blog outline:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'AI output invalid, please retry.',
        details: error.errors,
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to generate blog outline',
    });
  }
}

