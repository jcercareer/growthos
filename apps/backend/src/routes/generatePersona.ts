import { Request, Response } from 'express';
import { z } from 'zod';
import { generateJSON } from '../aiClient';
import { PersonaSchema, PersonaAIOutput } from '../aiSchemas';
import { createPersona } from '../repositories';
import type { Product } from '@growth-os/shared';

// Input validation schema
const GeneratePersonaInputSchema = z.object({
  product: z.enum(['CareerScaleUp', 'Zevaux']),
  audienceType: z.enum(['jobseeker', 'recruiter']).optional(),
  seed_notes: z.string().optional(),
});

// System prompt for persona generation
export const personaSystemPrompt = `
You are generating highly detailed, realistic customer personas specifically for JCER's SaaS products in the United States.

Products and audiences:

1. CareerScaleUp – Job Seekers:
   - AI Resume Optimizer (ATS rewriting, formatting, keyword infusion)
   - Job Description Matching Engine (tailors resume to specific roles)
   - AI Career Clarity Coach (skill analysis, suggested career paths)
   - Interview Prep Simulator (AI mock interviews and feedback)
   - Job Application Tracker (auto-organization, reminders, follow-up)
   - AI Cover Letter Generator
   - Personal Branding / LinkedIn Optimization

2. CareerScaleUp – Recruiters / Hiring Teams:
   (Assume current or planned capabilities; I will refine later if needed.)
   - AI-assisted Job Description Writer (clear, inclusive, ATS-friendly JDs)
   - AI Candidate Screening Helper (resume triage, keyword and skills match notes)
   - Shortlist & Ranking Suggestions (prioritized candidates based on role fit)
   - Outreach Template Generator (personalized email/LinkedIn outreach)
   - Interview Question & Scorecard Suggestions
   - Pipeline Visibility (where candidates are in the process)

3. Zevaux – SMBs and Agencies:
   - AI Voice Receptionist (24/7 call answering, greeting, routing)
   - AI Lead Qualification (asks screening questions and scores leads)
   - Automated Appointment Scheduling (calendar sync + reminders)
   - AI Follow-up Engine (SMS/email after missed or completed calls)
   - Workflow Automation (n8n-style sequences across tools)
   - Client Onboarding Flows
   - CRM-lite contact log and conversation summaries

Persona requirements:
- The persona MUST be tightly tied to:
  - the selected product AND
  - the selected audienceType (jobseeker or recruiter).
- Reference at least 4–6 relevant product features in the persona's description, painPoints, goals, and buyingTriggers.
- Use U.S. business and career context: layoffs, hiring freezes, low budgets, time pressure, ATS behavior, missed calls, client churn, etc.
- Use authentic emotional drivers: frustration, anxiety, ambition, fear of wasting time or money, desire for confidence and control.
- Do NOT produce generic templates. Each persona must feel like a specific, believable person with a realistic backstory and constraints.

Output policy:
- Output ONLY the JSON object defined by our Zod schema.
- Do not add extra fields or commentary.
`;

// User prompt builder function
export function buildPersonaUserPrompt(params: {
  product: 'CareerScaleUp' | 'Zevaux';
  audienceType: 'jobseeker' | 'recruiter';
  seedNotes?: string;
}) {
  const { product, audienceType, seedNotes } = params;

  return `
Generate ONE customer persona.

Product: ${product}
Audience type: ${audienceType === 'jobseeker' ? 'Job Seeker using CareerScaleUp for their own career' : 'Recruiter / Hiring Manager using CareerScaleUp to hire and manage candidates'}

Additional guidance from the user (optional):
${seedNotes && seedNotes.trim().length > 0 ? seedNotes : 'No extra guidance provided.'}

JSON shape (no extra fields):

{
  "name": string,
  "product": "CareerScaleUp" | "Zevaux",
  "audienceType": "jobseeker" | "recruiter",
  "ageRange": string,
  "location": string,
  "roleOrTitle": string,
  "industry": string,
  "description": string,
  "painPoints": string[],
  "goals": string[],
  "buyingTriggers": string[]
}

Content rules:
- Make the description clearly match the audienceType:
  - For jobseeker: focus on getting hired, ATS issues, interviews, job search stress.
  - For recruiter: focus on sourcing, screening, time pressure, quality of hire, stakeholder pressure, tools overload.
- Mention at least 4–6 concrete features of ${product} that matter for this audienceType.
- Mention at least 3 concrete real-world consequences (e.g., lost revenue, wasted hours screening resumes, missed great candidates, repeated ATS rejections, burnt-out team).
- Use a realistic U.S. setting and salary/role context.
- Do not wrap the JSON in markdown or code fences.
`;
}

export async function generatePersonaHandler(req: Request, res: Response) {
  try {
    // Validate input
    const input = GeneratePersonaInputSchema.parse(req.body);
    const { product, audienceType, seed_notes } = input;

    // Default audienceType to 'jobseeker' for backward compatibility
    const finalAudienceType = audienceType || 'jobseeker';

    // Build prompts using new prompt system
    const systemPrompt = personaSystemPrompt;
    const userPrompt = buildPersonaUserPrompt({
      product,
      audienceType: finalAudienceType,
      seedNotes: seed_notes,
    });

    // Generate with OpenAI
    const aiOutput = await generateJSON<PersonaAIOutput>(
      systemPrompt,
      userPrompt
    );

    // Validate AI output with Zod
    const validatedOutput = PersonaSchema.parse(aiOutput);

    // Map AI output to database format (snake_case)
    const savedPersona = await createPersona({
      product: validatedOutput.product as Product,
      audience_type: validatedOutput.audienceType,
      name: validatedOutput.name,
      age_range: validatedOutput.ageRange,
      description: validatedOutput.description,
      pain_points: validatedOutput.painPoints,
      goals: validatedOutput.goals,
      buying_triggers: validatedOutput.buyingTriggers,
    });

    // Return enhanced persona with additional AI-generated fields
    res.status(201).json({
      success: true,
      data: {
        ...savedPersona,
        location: validatedOutput.location,
        roleOrTitle: validatedOutput.roleOrTitle,
        industry: validatedOutput.industry,
        audienceType: validatedOutput.audienceType,
      },
    });
  } catch (error) {
    console.error('Error generating persona:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'AI output invalid, please retry.',
        details: error.errors,
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to generate persona',
    });
  }
}

