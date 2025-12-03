import { Request, Response } from 'express';
import { z } from 'zod';
import { generatePaidAdsPackForPersona } from '../services/generators/paidAdsPackGenerator';

const GeneratePaidAdsPackInputSchema = z.object({
  personaId: z.string().uuid(),
  messagingId: z.string().uuid().optional(),
  customNotes: z.string().optional(),
});

export async function generatePaidAdsPackHandler(req: Request, res: Response) {
  try {
    const input = GeneratePaidAdsPackInputSchema.parse(req.body);

    const savedPaidAdsPack = await generatePaidAdsPackForPersona({
      personaId: input.personaId,
      messagingId: input.messagingId,
      customNotes: input.customNotes,
    });

    res.status(201).json({
      success: true,
      data: savedPaidAdsPack,
    });
  } catch (error) {
    console.error('Error generating paid ads pack:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate paid ads pack',
    });
  }
}

