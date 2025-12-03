import { Request, Response } from 'express';
import { z } from 'zod';
import { generateEmailSmsSequenceForPersona } from '../services/generators/emailSmsSequenceGenerator';

const GenerateEmailSmsSequenceInputSchema = z.object({
  personaId: z.string().uuid(),
  messagingId: z.string().uuid().optional(),
  sequenceType: z.enum(['welcome', 'nurture', 'cart_abandonment', 're_engagement', 'product_launch']),
  customNotes: z.string().optional(),
});

export async function generateEmailSmsSequenceHandler(req: Request, res: Response) {
  try {
    const input = GenerateEmailSmsSequenceInputSchema.parse(req.body);

    const savedSequence = await generateEmailSmsSequenceForPersona({
      personaId: input.personaId,
      messagingId: input.messagingId,
      sequenceType: input.sequenceType,
      customNotes: input.customNotes,
    });

    res.status(201).json({
      success: true,
      data: savedSequence,
    });
  } catch (error) {
    console.error('Error generating email/SMS sequence:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate email/SMS sequence',
    });
  }
}

