import { Request, Response } from 'express';
import { listMessagingForPersona } from '../repositories';

export async function listMessagingHandler(req: Request, res: Response) {
  try {
    const personaId = req.query.personaId as string;
    
    if (!personaId) {
      return res.status(400).json({
        success: false,
        error: 'personaId query parameter is required',
      });
    }

    const messaging = await listMessagingForPersona(personaId);

    res.status(200).json({
      success: true,
      data: messaging,
    });
  } catch (error) {
    console.error('Error listing messaging:', error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to list messaging',
    });
  }
}

