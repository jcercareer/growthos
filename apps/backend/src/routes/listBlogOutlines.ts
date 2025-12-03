import { Request, Response } from 'express';
import { listBlogOutlines } from '../repositories';

export async function listBlogOutlinesHandler(req: Request, res: Response) {
  try {
    const personaId = req.query.personaId as string | undefined;
    const blogOutlines = await listBlogOutlines(personaId);

    res.status(200).json({
      success: true,
      data: blogOutlines,
    });
  } catch (error) {
    console.error('Error listing blog outlines:', error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to list blog outlines',
    });
  }
}

