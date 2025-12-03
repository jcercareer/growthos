import { Request, Response } from 'express';
import { z } from 'zod';
import { generateViralShortFormScriptForPersona } from '../services/generators/viralShortFormScriptGenerator';

const GenerateViralShortFormScriptInputSchema = z.object({
  personaId: z.string().uuid(),
  messagingId: z.string().uuid().optional(),
  platform: z.enum(['tiktok', 'instagram_reel', 'youtube_short']),
  customNotes: z.string().optional(),
});

export async function generateViralShortFormScriptHandler(req: Request, res: Response) {
  try {
    const input = GenerateViralShortFormScriptInputSchema.parse(req.body);

    const savedScript = await generateViralShortFormScriptForPersona({
      personaId: input.personaId,
      messagingId: input.messagingId,
      platform: input.platform,
      customNotes: input.customNotes,
    });

    res.status(201).json({
      success: true,
      data: savedScript,
    });
  } catch (error) {
    console.error('Error generating viral short form script:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate viral short form script',
    });
  }
}

