import { Request, Response } from 'express';
import { z } from 'zod';
import { generateSocialProofPackForProduct } from '../services/generators/socialProofPackGenerator';

const GenerateSocialProofPackInputSchema = z.object({
  product: z.enum(['CareerScaleUp', 'Zevaux']),
  customNotes: z.string().optional(),
});

export async function generateSocialProofPackHandler(req: Request, res: Response) {
  try {
    const input = GenerateSocialProofPackInputSchema.parse(req.body);

    const savedSocialProofPack = await generateSocialProofPackForProduct({
      product: input.product,
      customNotes: input.customNotes,
    });

    res.status(201).json({
      success: true,
      data: savedSocialProofPack,
    });
  } catch (error) {
    console.error('Error generating social proof pack:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate social proof pack',
    });
  }
}

