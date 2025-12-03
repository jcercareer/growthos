import { Request, Response } from 'express';
import { listLinkedInViralPacksForPersona, listLinkedInViralPacksByProduct } from '../repositories';

export async function listLinkedInViralPacksHandler(req: Request, res: Response) {
  try {
    const personaId = req.query.personaId as string;
    const product = req.query.product as string;

    if (personaId) {
      const linkedInViralPacks = await listLinkedInViralPacksForPersona(personaId);
      return res.status(200).json({
        success: true,
        data: linkedInViralPacks,
      });
    }

    if (product) {
      const linkedInViralPacks = await listLinkedInViralPacksByProduct(product);
      return res.status(200).json({
        success: true,
        data: linkedInViralPacks,
      });
    }

    return res.status(400).json({
      success: false,
      error: 'personaId or product query parameter is required',
    });
  } catch (error) {
    console.error('Error listing LinkedIn viral packs:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list LinkedIn viral packs',
    });
  }
}

