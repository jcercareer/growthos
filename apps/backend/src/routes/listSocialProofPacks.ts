import { Request, Response } from 'express';
import { listSocialProofPacksByProduct } from '../repositories';

export async function listSocialProofPacksHandler(req: Request, res: Response) {
  try {
    const product = req.query.product as string;

    if (!product) {
      return res.status(400).json({
        success: false,
        error: 'product query parameter is required',
      });
    }

    const socialProofPacks = await listSocialProofPacksByProduct(product);

    res.status(200).json({
      success: true,
      data: socialProofPacks,
    });
  } catch (error) {
    console.error('Error listing social proof packs:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list social proof packs',
    });
  }
}

