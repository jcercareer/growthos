import { Request, Response } from 'express';
import { z } from 'zod';
import { generatePricingPagePackForProduct } from '../services/generators/pricingPagePackGenerator';

const GeneratePricingPagePackInputSchema = z.object({
  product: z.enum(['CareerScaleUp', 'Zevaux']),
  customNotes: z.string().optional(),
});

export async function generatePricingPagePackHandler(req: Request, res: Response) {
  try {
    const input = GeneratePricingPagePackInputSchema.parse(req.body);

    const savedPricingPagePack = await generatePricingPagePackForProduct({
      product: input.product,
      customNotes: input.customNotes,
    });

    res.status(201).json({
      success: true,
      data: savedPricingPagePack,
    });
  } catch (error) {
    console.error('Error generating pricing page pack:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate pricing page pack',
    });
  }
}

