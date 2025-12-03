import { Request, Response } from 'express';
import { listLeadMagnetsForPersona, listLeadMagnetsByProduct } from '../repositories';

export async function listLeadMagnetsHandler(req: Request, res: Response) {
  try {
    const personaId = req.query.personaId as string;
    const product = req.query.product as string;

    if (personaId) {
      const leadMagnets = await listLeadMagnetsForPersona(personaId);
      return res.status(200).json({
        success: true,
        data: leadMagnets,
      });
    }

    if (product) {
      const leadMagnets = await listLeadMagnetsByProduct(product);
      return res.status(200).json({
        success: true,
        data: leadMagnets,
      });
    }

    return res.status(400).json({
      success: false,
      error: 'personaId or product query parameter is required',
    });
  } catch (error) {
    console.error('Error listing lead magnets:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list lead magnets',
    });
  }
}

