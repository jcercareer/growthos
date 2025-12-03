import { Request, Response } from 'express';
import { listEmailSmsSequencesForPersona, listEmailSmsSequencesByProduct } from '../repositories';

export async function listEmailSmsSequencesHandler(req: Request, res: Response) {
  try {
    const personaId = req.query.personaId as string;
    const product = req.query.product as string;

    if (personaId) {
      const sequences = await listEmailSmsSequencesForPersona(personaId);
      return res.status(200).json({
        success: true,
        data: sequences,
      });
    }

    if (product) {
      const sequences = await listEmailSmsSequencesByProduct(product);
      return res.status(200).json({
        success: true,
        data: sequences,
      });
    }

    return res.status(400).json({
      success: false,
      error: 'personaId or product query parameter is required',
    });
  } catch (error) {
    console.error('Error listing email/SMS sequences:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list email/SMS sequences',
    });
  }
}

