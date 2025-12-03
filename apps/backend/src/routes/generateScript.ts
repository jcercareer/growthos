import { Request, Response } from 'express';
import { z } from 'zod';
import { generateJSON } from '../aiClient';
import { ScriptSchema, ScriptAIOutput } from '../aiSchemas';
import { getPersonaById, getMessagingById, createScript } from '../repositories';

// ============================================================
// SYSTEM PROMPT
// ============================================================
export const scriptSystemPrompt = `

You generate short-form video scripts (TikTok/Reels/Shorts) based on:
- Persona
- Audience type
- Messaging
- Product (CareerScaleUp or Zevaux)
- Real product features

Requirements:
- Script must be 30–45 seconds (approx. 80–120 words).
- Must follow a strict structure:
  - hook (dramatic, pain-focused)
  - story (realistic scenario from persona's life)
  - insight (connect their pain to the product features)
  - transformation (what changes when they use the product)
  - CTA (specific to CareerScaleUp or Zevaux)
- Script must reference 3–6 real product features.
- Must reflect the persona's psychology and emotions.
- MUST NOT be generic or "inspirational fluff."

Output:
- ONLY JSON matching:
  {
    "hook": string,
    "body": string,
    "cta": string
  }
`;

// ============================================================
// USER PROMPT BUILDER
// ============================================================
export function buildScriptUserPrompt(params: {
  product: "CareerScaleUp" | "Zevaux";
  audienceType: string;
  personaName: string;
  personaDescription: string;
  messagingHeadline: string;
  messagingElevatorPitch: string;
}) {
  const { product, audienceType, personaName, personaDescription, messagingHeadline, messagingElevatorPitch } = params;

  return `
Generate a short-form video script for:
- Product: ${product}
- Audience: ${audienceType}
- Persona: ${personaName}
- Persona description: ${personaDescription}
- Messaging headline: ${messagingHeadline}
- Messaging elevator pitch: ${messagingElevatorPitch}

JSON output shape (strict):

{
  "hook": string,
  "body": string,
  "cta": string
}

Rules:
- Hook must reflect an urgent, relatable problem this persona experiences.
- Body must:
  - Describe a real U.S. scenario (ATS rejection, missed calls, admin overload, bad hiring experience, etc.)
  - Reference 3–6 features of ${product} in a natural way.
- CTA must be clear, direct, and appropriate for this persona.
- Do not output notes, commentary, markdown, or code fences.
`;
}

// Input validation schema
const GenerateScriptInputSchema = z.object({
  personaId: z.string().uuid(),
  messagingId: z.string().uuid(),
  platform: z.enum(['tiktok', 'reels', 'shorts']),
});

export async function generateScriptHandler(req: Request, res: Response) {
  try {
    // Validate input
    const input = GenerateScriptInputSchema.parse(req.body);
    const { personaId, messagingId, platform } = input;

    // Use the service to generate script
    const { generateScriptForPersonaAndMessaging } = await import('../services/generators/scriptGenerator');
    const savedScript = await generateScriptForPersonaAndMessaging(
      personaId,
      messagingId,
      platform
    );

    // Return saved record
    res.status(201).json({
      success: true,
      data: savedScript,
    });
  } catch (error) {
    console.error('Error generating script:', error);

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
        error instanceof Error ? error.message : 'Failed to generate script',
    });
  }
}

