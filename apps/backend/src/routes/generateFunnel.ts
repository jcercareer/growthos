import { Request, Response } from 'express';
import { z } from 'zod';
import { generateFunnelForPersona } from '../services/generators/funnelGenerator';

const GenerateFunnelInputSchema = z.object({
  personaId: z.string().uuid(),
  messagingId: z.string().uuid().optional(),
  funnelType: z.enum(['landing_page', 'vsl', 'webinar', 'squeeze_page', 'sales_page']),
  tone: z.enum(['professional', 'bold', 'friendly', 'urgent']),
  customNotes: z.string().optional(),
});

export async function generateFunnelHandler(req: Request, res: Response) {
  try {
    const input = GenerateFunnelInputSchema.parse(req.body);

    const savedFunnel = await generateFunnelForPersona({
      personaId: input.personaId,
      messagingId: input.messagingId,
      funnelType: input.funnelType,
      tone: input.tone,
      customNotes: input.customNotes,
    });

    res.status(201).json({
      success: true,
      data: savedFunnel,
    });
  } catch (error) {
    console.error('Error generating funnel:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate funnel',
    });
  }
}

