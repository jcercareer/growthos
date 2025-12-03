import { Request, Response } from 'express';
import { z } from 'zod';
import { generateNicheVariantPack } from '../services/generators/nicheVariantGenerator';

const GenerateNicheVariantInputSchema = z.object({
  product: z.enum(['CareerScaleUp', 'Zevaux']),
  niche: z.string().min(1).max(200),
  personaId: z.string().uuid(),
  messagingId: z.string().uuid(),
  notes: z.string().optional(),
});

export async function generateNicheVariantHandler(req: Request, res: Response) {
  try {
    const input = GenerateNicheVariantInputSchema.parse(req.body);

    const result = await generateNicheVariantPack({
      product: input.product,
      niche: input.niche,
      personaId: input.personaId,
      messagingId: input.messagingId,
      notes: input.notes,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error generating niche variant:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate niche variant',
    });
  }
}

