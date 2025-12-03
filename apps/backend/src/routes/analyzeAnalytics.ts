import { Request, Response } from 'express';
import { z } from 'zod';
import { analyzePerformanceData } from '../services/generators/analyticsGenerator';

const AnalyticsInputItemSchema = z.object({
  platform: z.string().min(1).max(50),
  followers: z.number().int().min(0),
  views: z.number().int().min(0),
  engagements: z.number().int().min(0),
  clicks: z.number().int().min(0),
  notes: z.string().optional(),
});

const AnalyzeAnalyticsInputSchema = z.object({
  analytics: z.array(AnalyticsInputItemSchema).min(1).max(20),
});

export async function analyzeAnalyticsHandler(req: Request, res: Response) {
  try {
    const input = AnalyzeAnalyticsInputSchema.parse(req.body);

    const result = await analyzePerformanceData(input.analytics);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error analyzing analytics:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze analytics',
    });
  }
}

