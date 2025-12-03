import {
  GlobalValidationInput,
  GlobalValidationResult,
  AiCheckResult,
} from './globalValidationTypes';
import { runHardChecks } from './hardChecks';
import { runGlobalAiValidation } from './aiGlobalValidator';

/**
 * Run complete global validation:
 * 1. Hard checks (deterministic validation)
 * 2. AI checks (if hard checks pass)
 */
export async function validateGlobalSet(
  input: GlobalValidationInput
): Promise<GlobalValidationResult> {
  // Step 1: Run hard checks
  const hardChecks = await runHardChecks(input);

  let aiChecks: AiCheckResult | undefined = undefined;

  // Step 2: Run AI checks only if hard checks pass
  if (hardChecks.pass) {
    const result = await runGlobalAiValidation(input);
    // runGlobalAiValidation returns null on failure
    aiChecks = result ?? undefined;
  }

  return {
    hardChecks,
    aiChecks,
  };
}

