import { Request, Response } from 'express';
import { listPersonas } from '../repositories';

export async function listPersonasHandler(req: Request, res: Response) {
  try {
    const product = req.query.product as string | undefined;
    const personas = await listPersonas(product);

    res.status(200).json({
      success: true,
      data: personas,
    });
  } catch (error) {
    console.error('Error listing personas:', error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to list personas',
    });
  }
}

