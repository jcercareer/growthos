import { Request, Response } from 'express';
import { z } from 'zod';
import { generateAdsPackForPersona } from '../services/generators/campaignAdsPackGenerator';

const GenerateAdsPackInputSchema = z.object({
  product: z.enum(['CareerScaleUp', 'Zevaux']),
  audience: z.enum(['jobseeker', 'recruiter', 'smb_owner', 'other']),
  personaId: z.string().uuid(),
  messagingId: z.string().uuid(),
  campaignAngle: z.string().optional(),
});

export async function generateAdsPackHandler(req: Request, res: Response) {
  try {
    const input = GenerateAdsPackInputSchema.parse(req.body);

    const result = await generateAdsPackForPersona({
      product: input.product,
      audienceType: input.audience,
      personaId: input.personaId,
      messagingId: input.messagingId,
      campaignAngle: input.campaignAngle,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error generating ads pack:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate ads pack',
    });
  }
}

