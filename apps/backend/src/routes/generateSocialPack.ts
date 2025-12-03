import { Request, Response } from 'express';
import { z } from 'zod';
import { generateSocialPackForPersona } from '../services/generators/socialPackGenerator';

const GenerateSocialPackInputSchema = z.object({
  personaId: z.string().uuid(),
  messagingId: z.string().uuid().optional(),
  customNotes: z.string().optional(),
});

export async function generateSocialPackHandler(req: Request, res: Response) {
  try {
    const input = GenerateSocialPackInputSchema.parse(req.body);

    const savedSocialPack = await generateSocialPackForPersona({
      personaId: input.personaId,
      messagingId: input.messagingId,
      customNotes: input.customNotes,
    });

    res.status(201).json({
      success: true,
      data: savedSocialPack,
    });
  } catch (error) {
    console.error('Error generating social pack:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate social pack',
    });
  }
}

