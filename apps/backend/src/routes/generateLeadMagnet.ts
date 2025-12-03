import { Request, Response } from 'express';
import { z } from 'zod';
import { generateLeadMagnetForPersona } from '../services/generators/leadMagnetGenerator';

const GenerateLeadMagnetInputSchema = z.object({
  personaId: z.string().uuid(),
  messagingId: z.string().uuid().optional(),
  leadMagnetType: z.enum(['pdf_guide', 'checklist', 'template', 'ebook', 'cheatsheet', 'swipe_file']),
  customNotes: z.string().optional(),
});

export async function generateLeadMagnetHandler(req: Request, res: Response) {
  try {
    const input = GenerateLeadMagnetInputSchema.parse(req.body);

    const savedLeadMagnet = await generateLeadMagnetForPersona({
      personaId: input.personaId,
      messagingId: input.messagingId,
      leadMagnetType: input.leadMagnetType,
      customNotes: input.customNotes,
    });

    res.status(201).json({
      success: true,
      data: savedLeadMagnet,
    });
  } catch (error) {
    console.error('Error generating lead magnet:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate lead magnet',
    });
  }
}

