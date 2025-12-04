/**
 * Prompt Application Utility
 * 
 * Ensures the Global System Prompt is prepended to all AI calls
 * while preserving module-specific prompts.
 */

import { GLOBAL_SYSTEM_PROMPT } from './systemPrompt';

/**
 * Applies the global system prompt to any module-specific prompt
 * 
 * @param moduleSystemPrompt - Module-specific system instructions (optional)
 * @param userPrompt - The user's actual generation request
 * @returns Combined prompt with global context
 */
export function buildPrompt(moduleSystemPrompt: string, userPrompt: string): {
  systemPrompt: string;
  userPrompt: string;
} {
  // Combine global prompt with module-specific prompt
  const combinedSystemPrompt = `${GLOBAL_SYSTEM_PROMPT}

---

MODULE-SPECIFIC INSTRUCTIONS:
${moduleSystemPrompt}`;

  return {
    systemPrompt: combinedSystemPrompt,
    userPrompt: userPrompt,
  };
}

/**
 * Legacy support: Simple system prompt application
 */
export function applySystemPrompt(userPrompt: string): {
  systemPrompt: string;
  userPrompt: string;
} {
  return {
    systemPrompt: GLOBAL_SYSTEM_PROMPT,
    userPrompt: userPrompt,
  };
}

export default buildPrompt;

