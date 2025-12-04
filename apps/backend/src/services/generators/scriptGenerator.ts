import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { createScript } from '../../repositories/scripts';
import { generateJSON } from '../../aiClient';
import { ScriptSchema } from '../../aiSchemas';
import {
  scriptSystemPrompt,
  buildScriptUserPrompt,
} from '../../routes/generateScript';
import { buildPrompt } from '../../prompts/applySystemPrompt';
import type { Script } from '@growth-os/shared';

/**
 * Internal service to generate script for a persona and messaging
 * Used by both HTTP endpoint and auto-fix service
 */
export async function generateScriptForPersonaAndMessaging(
  personaId: string,
  messagingId: string,
  platform: string = 'tiktok'
): Promise<Script> {
  // Look up persona and messaging
  const [persona, messaging] = await Promise.all([
    getPersonaById(personaId),
    getMessagingById(messagingId),
  ]);

  if (!persona) {
    throw new Error('Persona not found');
  }

  if (!messaging) {
    throw new Error('Messaging not found');
  }

  // Build prompts with global context
  const { systemPrompt: combinedSystemPrompt, userPrompt: finalUserPrompt } = buildPrompt(
    scriptSystemPrompt,
    buildScriptUserPrompt({
      product: persona.product as 'CareerScaleUp' | 'Zevaux',
      audienceType: persona.audience_type || 'jobseeker',
      personaName: persona.name,
      personaDescription: persona.description,
      messagingHeadline: messaging.headline,
      messagingElevatorPitch: messaging.elevator_pitch,
    })
  );

  // Generate with OpenAI
  const aiOutput = await generateJSON<any>(combinedSystemPrompt, finalUserPrompt);

  // Validate AI output with Zod
  const validatedOutput = ScriptSchema.parse(aiOutput);

  // Combine hook, body, cta into full content
  const fullContent = `[HOOK - First 3 seconds]\n${validatedOutput.hook}\n\n[BODY - Main content]\n${validatedOutput.body}\n\n[CTA - Final seconds]\n${validatedOutput.cta}`;

  // Save to database
  const savedScript = await createScript({
    persona_id: personaId,
    messaging_id: messagingId,
    script_type: platform,
    content: fullContent,
    notes: validatedOutput.notes || null,
  });

  return savedScript;
}

