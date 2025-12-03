import { Request, Response } from 'express';
import { listViralShortFormScriptsForPersona, listViralShortFormScriptsByProduct } from '../repositories';

export async function listViralShortFormScriptsHandler(req: Request, res: Response) {
  try {
    const personaId = req.query.personaId as string;
    const product = req.query.product as string;

    if (personaId) {
      const scripts = await listViralShortFormScriptsForPersona(personaId);
      return res.status(200).json({
        success: true,
        data: scripts,
      });
    }

    if (product) {
      const scripts = await listViralShortFormScriptsByProduct(product);
      return res.status(200).json({
        success: true,
        data: scripts,
      });
    }

    return res.status(400).json({
      success: false,
      error: 'personaId or product query parameter is required',
    });
  } catch (error) {
    console.error('Error listing viral short form scripts:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list viral short form scripts',
    });
  }
}

