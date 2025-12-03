import { Request, Response } from 'express';
import { z } from 'zod';
import { generateLinkedInViralPackForPersona } from '../services/generators/linkedInViralPackGenerator';

const GenerateLinkedInViralPackInputSchema = z.object({
  personaId: z.string().uuid(),
  messagingId: z.string().uuid().optional(),
  customNotes: z.string().optional(),
});

export async function generateLinkedInViralPackHandler(req: Request, res: Response) {
  try {
    const input = GenerateLinkedInViralPackInputSchema.parse(req.body);

    const savedLinkedInViralPack = await generateLinkedInViralPackForPersona({
      personaId: input.personaId,
      messagingId: input.messagingId,
      customNotes: input.customNotes,
    });

    res.status(201).json({
      success: true,
      data: savedLinkedInViralPack,
    });
  } catch (error) {
    console.error('Error generating LinkedIn viral pack:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate LinkedIn viral pack',
    });
  }
}

