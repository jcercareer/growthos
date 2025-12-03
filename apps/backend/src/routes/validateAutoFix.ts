import { Request, Response } from 'express';
import { z } from 'zod';
import { validateGlobalSet } from '../services/validation/globalValidator';
import { generateMessagingForPersona } from '../services/generators/messagingGenerator';
import { generateScriptForPersonaAndMessaging } from '../services/generators/scriptGenerator';
import type {
  GlobalValidationResult,
  HardCheckResult,
  AiCheckResult,
} from '../services/validation/globalValidationTypes';

// Input validation schema
const ValidateAutoFixInputSchema = z.object({
  personaId: z.string().uuid('Invalid persona ID'),
  messagingId: z.string().uuid('Invalid messaging ID').optional(),
  scriptId: z.string().uuid('Invalid script ID').optional(),
  blogOutlineId: z.string().uuid('Invalid blog outline ID').optional(),
  threshold: z.number().min(0).max(1).default(0.75),
  fixMessaging: z.boolean().default(true),
  fixScript: z.boolean().default(true),
});

interface AutoFixResult {
  hardChecks: HardCheckResult;
  aiChecks: AiCheckResult | undefined;
  autoFixApplied: boolean;
  updatedIds?: {
    messagingId?: string;
    scriptId?: string;
  };
}

/**
 * POST /api/validate/auto-fix
 * 
 * Validates a set of marketing assets and optionally auto-regenerates
 * messaging and/or script if consistency score is below threshold.
 * 
 * Request body:
 * {
 *   "personaId": "uuid",
 *   "messagingId": "uuid" (optional),
 *   "scriptId": "uuid" (optional),
 *   "blogOutlineId": "uuid" (optional),
 *   "threshold": number (0-1, default 0.75),
 *   "fixMessaging": boolean (default true),
 *   "fixScript": boolean (default true)
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "hardChecks": {...},
 *     "aiChecks": {...} | undefined,
 *     "autoFixApplied": boolean,
 *     "updatedIds": {
 *       "messagingId": "uuid",
 *       "scriptId": "uuid"
 *     }
 *   }
 * }
 */
export async function validateAutoFixHandler(req: Request, res: Response) {
  try {
    // Validate input
    const input = ValidateAutoFixInputSchema.parse(req.body);
    const {
      personaId,
      messagingId,
      scriptId,
      blogOutlineId,
      threshold,
      fixMessaging,
      fixScript,
    } = input;

    // Step 1: Run initial validation
    const initialValidation = await validateGlobalSet({
      personaId,
      messagingId,
      scriptId,
      blogOutlineId,
    });

    // Step 2: If hard checks fail, return 400
    if (!initialValidation.hardChecks.pass) {
      return res.status(400).json({
        success: false,
        error: 'Hard checks failed. Please fix errors before auto-fix can run.',
        data: {
          hardChecks: initialValidation.hardChecks,
          aiChecks: null,
          autoFixApplied: false,
        },
      });
    }

    // Step 3: If AI checks missing, return 200 with no auto-fix
    if (!initialValidation.aiChecks) {
      return res.status(200).json({
        success: true,
        data: {
          hardChecks: initialValidation.hardChecks,
          aiChecks: null,
          autoFixApplied: false,
        },
      });
    }

    // Step 4: Check if score is above threshold
    const overallScore =
      initialValidation.aiChecks.scores.overallConsistencyScore / 100; // Convert to 0-1

    if (overallScore >= threshold) {
      // Score is good, no auto-fix needed
      return res.status(200).json({
        success: true,
        data: {
          hardChecks: initialValidation.hardChecks,
          aiChecks: initialValidation.aiChecks,
          autoFixApplied: false,
        },
      });
    }

    // Step 5: Score is below threshold, apply auto-fix
    console.log(
      `Auto-fix triggered: score ${overallScore.toFixed(2)} < threshold ${threshold}`
    );

    let newMessagingId = messagingId;
    let newScriptId = scriptId;

    // Regenerate messaging if requested
    if (fixMessaging) {
      console.log('Regenerating messaging...');
      const newMessaging = await generateMessagingForPersona(personaId);
      newMessagingId = newMessaging.id;
      console.log(`New messaging generated: ${newMessagingId}`);
    }

    // Regenerate script if requested and we have messaging
    if (fixScript && newMessagingId) {
      console.log('Regenerating script...');
      const newScript = await generateScriptForPersonaAndMessaging(
        personaId,
        newMessagingId,
        'tiktok' // Default platform
      );
      newScriptId = newScript.id;
      console.log(`New script generated: ${newScriptId}`);
    }

    // Step 6: Run validation again with new IDs
    const finalValidation = await validateGlobalSet({
      personaId,
      messagingId: newMessagingId,
      scriptId: newScriptId,
      blogOutlineId, // Keep blog unchanged
    });

    // Step 7: Return results with updated IDs
    const result: AutoFixResult = {
      hardChecks: finalValidation.hardChecks,
      aiChecks: finalValidation.aiChecks,
      autoFixApplied: true,
      updatedIds: {
        messagingId: newMessagingId,
        scriptId: newScriptId,
      },
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in auto-fix validation:', error);

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
        error instanceof Error ? error.message : 'Failed to run auto-fix validation',
    });
  }
}

