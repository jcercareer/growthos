import { getPersonaById } from '../../repositories/personas';
import { createMessaging } from '../../repositories/messaging';
import { generateJSON } from '../../aiClient';
import { MessagingSchema } from '../../aiSchemas';
import {
  messagingSystemPrompt,
  buildMessagingUserPrompt,
} from '../../routes/generateMessaging';
import type { Messaging } from '@growth-os/shared';

/**
 * Internal service to generate messaging for a persona
 * Used by both HTTP endpoint and auto-fix service
 */
export async function generateMessagingForPersona(
  personaId: string
): Promise<Messaging> {
  // Look up persona
  const persona = await getPersonaById(personaId);
  if (!persona) {
    throw new Error('Persona not found');
  }

  // Build prompts
  const systemPrompt = messagingSystemPrompt;
  const userPrompt = buildMessagingUserPrompt({
    product: persona.product as 'CareerScaleUp' | 'Zevaux',
    audienceType: persona.audience_type || 'jobseeker',
    personaDescription: persona.description,
    personaPainPoints: persona.pain_points,
    personaGoals: persona.goals,
  });

  // Generate with OpenAI
  const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);

  // Validate AI output with Zod
  const validatedOutput = MessagingSchema.parse(aiOutput);

  // Save to database
  const savedMessaging = await createMessaging({
    persona_id: personaId,
    ...validatedOutput,
  });

  return savedMessaging;
}

