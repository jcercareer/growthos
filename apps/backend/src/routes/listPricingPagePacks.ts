import { Request, Response } from 'express';
import { listPricingPagePacksByProduct } from '../repositories';

export async function listPricingPagePacksHandler(req: Request, res: Response) {
  try {
    const product = req.query.product as string;

    if (!product) {
      return res.status(400).json({
        success: false,
        error: 'product query parameter is required',
      });
    }

    const pricingPagePacks = await listPricingPagePacksByProduct(product);

    res.status(200).json({
      success: true,
      data: pricingPagePacks,
    });
  } catch (error) {
    console.error('Error listing pricing page packs:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list pricing page packs',
    });
  }
}

