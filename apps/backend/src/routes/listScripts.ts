import { Request, Response } from 'express';
import { listScripts } from '../repositories';

export async function listScriptsHandler(req: Request, res: Response) {
  try {
    const personaId = req.query.personaId as string | undefined;
    const scripts = await listScripts(personaId);

    res.status(200).json({
      success: true,
      data: scripts,
    });
  } catch (error) {
    console.error('Error listing scripts:', error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to list scripts',
    });
  }
}

