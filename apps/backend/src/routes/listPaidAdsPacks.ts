import { Request, Response } from 'express';
import { listPaidAdsPacksForPersona, listPaidAdsPacksByProduct } from '../repositories';

export async function listPaidAdsPacksHandler(req: Request, res: Response) {
  try {
    const personaId = req.query.personaId as string;
    const product = req.query.product as string;

    if (personaId) {
      const paidAdsPacks = await listPaidAdsPacksForPersona(personaId);
      return res.status(200).json({
        success: true,
        data: paidAdsPacks,
      });
    }

    if (product) {
      const paidAdsPacks = await listPaidAdsPacksByProduct(product);
      return res.status(200).json({
        success: true,
        data: paidAdsPacks,
      });
    }

    return res.status(400).json({
      success: false,
      error: 'personaId or product query parameter is required',
    });
  } catch (error) {
    console.error('Error listing paid ads packs:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list paid ads packs',
    });
  }
}

