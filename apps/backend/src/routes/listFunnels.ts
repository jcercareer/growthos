import { Request, Response } from 'express';
import { listFunnelsForPersona, listFunnelsByProduct } from '../repositories';

export async function listFunnelsHandler(req: Request, res: Response) {
  try {
    const personaId = req.query.personaId as string;
    const product = req.query.product as string;

    if (personaId) {
      const funnels = await listFunnelsForPersona(personaId);
      return res.status(200).json({
        success: true,
        data: funnels,
      });
    }

    if (product) {
      const funnels = await listFunnelsByProduct(product);
      return res.status(200).json({
        success: true,
        data: funnels,
      });
    }

    return res.status(400).json({
      success: false,
      error: 'personaId or product query parameter is required',
    });
  } catch (error) {
    console.error('Error listing funnels:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list funnels',
    });
  }
}

