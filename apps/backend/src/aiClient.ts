import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

// Lazy-load OpenAI client (only initialize when first used)
function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error(
        'Missing OpenAI API key. Please set OPENAI_API_KEY environment variable.'
      );
    }
    
    openaiInstance = new OpenAI({
      apiKey: apiKey,
    });
  }
  
  return openaiInstance;
}

// Export the client getter for direct use (e.g., in validators)
export const openai = getOpenAIClient();

/**
 * Call OpenAI with strict JSON output mode
 * Uses JSON schema mode when available for guaranteed valid JSON
 */
export async function generateJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  jsonSchema?: Record<string, unknown>
): Promise<T> {
  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast and cost-effective for JSON generation
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: jsonSchema
        ? {
            type: 'json_schema',
            json_schema: {
              name: 'response',
              strict: true,
              schema: jsonSchema,
            },
          }
        : { type: 'json_object' },
      temperature: 0.8, // Balanced creativity
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const parsed = JSON.parse(content);
    return parsed as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI generation failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Product context for JCER's products
 */
export const PRODUCT_CONTEXT = {
  CareerScaleUp: `CareerScaleUp is an AI-powered career platform designed for job seekers. 
It helps users:
- Optimize resumes to pass ATS (Applicant Tracking Systems)
- Get personalized job search strategies
- Prepare for interviews with AI-powered practice
- Track job applications intelligently
- Build confidence in their career journey

Target audience: Entry to senior-level professionals looking to advance their careers, switch jobs, or navigate career transitions. Common pain points include resume rejections, lack of interview callbacks, unclear career direction, and feeling stuck in current roles.`,

  Zevaux: `Zevaux is an AI automation and AI receptionist platform for small businesses and agencies.
It helps businesses:
- Automate repetitive tasks and workflows
- Handle customer inquiries 24/7 with AI receptionists
- Qualify leads automatically
- Schedule appointments without human intervention
- Provide consistent customer service at scale

Target audience: Small business owners, agencies, and service providers who are overwhelmed with admin work, missing customer calls, or struggling to scale their operations. Common pain points include missed opportunities, high admin costs, inconsistent customer service, and inability to scale.`,
};

