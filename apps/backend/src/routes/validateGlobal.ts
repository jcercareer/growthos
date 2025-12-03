import { Request, Response } from 'express';
import { z } from 'zod';
import { validateGlobalSet } from '../services/validation/globalValidator';

// Input validation schema
const ValidateGlobalInputSchema = z.object({
  personaId: z.string().uuid('Invalid persona ID'),
  messagingId: z.string().uuid('Invalid messaging ID').optional(),
  scriptId: z.string().uuid('Invalid script ID').optional(),
  blogOutlineId: z.string().uuid('Invalid blog outline ID').optional(),
});

/**
 * POST /api/validate/global
 * 
 * Validates consistency across persona, messaging, script, and blog outline.
 * 
 * Request body:
 * {
 *   "personaId": "uuid",
 *   "messagingId": "uuid" (optional),
 *   "scriptId": "uuid" (optional),
 *   "blogOutlineId": "uuid" (optional)
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "hardChecks": {
 *       "pass": boolean,
 *       "errors": string[],
 *       "warnings": string[]
 *     },
 *     "aiChecks": {
 *       "scores": {
 *         "overallConsistencyScore": number,
 *         "productAlignmentScore": number,
 *         "audienceAlignmentScore": number,
 *         "toneConsistencyScore": number,
 *         "featureMentionConsistencyScore": number
 *       },
 *       "issues": string[],
 *       "suggestedFixes": string[]
 *     } | undefined
 *   }
 * }
 */
export async function validateGlobalHandler(req: Request, res: Response) {
  try {
    // Validate input
    const input = ValidateGlobalInputSchema.parse(req.body);

    // Run validation
    const result = await validateGlobalSet(input);

    // Return result
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error validating global set:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    // General error
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to validate global set',
    });
  }
}

