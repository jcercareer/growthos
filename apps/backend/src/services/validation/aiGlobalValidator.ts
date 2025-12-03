import {
  GlobalValidationInput,
  AiCheckResult,
} from './globalValidationTypes';
import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { getScriptById } from '../../repositories/scripts';
import { getBlogOutlineById } from '../../repositories/blogOutlines';
import { openai } from '../../aiClient';

export const globalValidationSystemPrompt = `
You are a strict marketing quality auditor for JCER's Growth OS.

Your task: Evaluate if Persona, Messaging, Script, and BlogOutline are consistent.

Score alignment with:
- Product (CareerScaleUp or Zevaux)
- Audience type (jobseeker, recruiter, SMB owner, agency operator)
- Tone consistency
- Feature usage consistency

Respond ONLY in JSON. No commentary.
`;

export async function runGlobalAiValidation(
  input: GlobalValidationInput
): Promise<AiCheckResult | null> {
  const { personaId, messagingId, scriptId, blogOutlineId } = input;

  // Load DB rows
  const persona = await getPersonaById(personaId);
  const messaging = messagingId ? await getMessagingById(messagingId) : null;
  const script = scriptId ? await getScriptById(scriptId) : null;
  const blog = blogOutlineId ? await getBlogOutlineById(blogOutlineId) : null;

  // Build compressed summaries
  const personaText = JSON.stringify(persona ?? {});
  const messagingText = messaging ? JSON.stringify(messaging) : '';
  const scriptText = script ? JSON.stringify(script) : '';
  const blogText = blog ? JSON.stringify(blog) : '';

  const userPrompt = `
Evaluate consistency for:

Product: ${persona?.product}
Audience: ${persona?.audience_type}

Persona:
${personaText}

Messaging:
${messagingText}

Script:
${scriptText}

Blog:
${blogText}

Return ONLY JSON shaped as:
{
  "scores": {
    "overallConsistencyScore": number,
    "productAlignmentScore": number,
    "audienceAlignmentScore": number,
    "toneConsistencyScore": number,
    "featureMentionConsistencyScore": number
  },
  "issues": string[],
  "suggestedFixes": string[]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: globalValidationSystemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return null;
    }

    const parsed = JSON.parse(content) as AiCheckResult;
    return parsed;
  } catch (error) {
    console.error('AI validation error:', error);
    return null;
  }
}

