import { Request, Response } from 'express';
import { z } from 'zod';
import { generateJSON } from '../aiClient';
import { PersonaSchema, PersonaAIOutput } from '../aiSchemas';
import { createPersona } from '../repositories';
import type { Product } from '@growth-os/shared';

// Input validation schema
const GeneratePersonaInputSchema = z.object({
  product: z.enum(['CareerScaleUp', 'Zevaux']),
  audienceType: z.enum(['jobseeker', 'recruiter', 'smb_owner', 'agency_owner']).optional(),
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
   - AI-assisted Job Description Writer (clear, inclusive, ATS-friendly JDs)
   - AI Candidate Screening Helper (resume triage, keyword and skills match notes)
   - Shortlist & Ranking Suggestions (prioritized candidates based on role fit)
   - Outreach Template Generator (personalized email/LinkedIn outreach)
   - Interview Question & Scorecard Suggestions
   - Pipeline Visibility (where candidates are in the process)

3. Zevaux – SMB Owners / Front-Desk Staff / Agencies:
   - AI Voice Receptionist (24/7 call answering, greeting, routing)
   - AI Lead Qualification (asks screening questions and scores leads)
   - Automated Appointment Scheduling (calendar sync + reminders)
   - AI Follow-up Engine (SMS/email after missed or completed calls)
   - Workflow Automation (n8n-style sequences across tools)
   - Client Onboarding Flows
   - CRM-lite contact log and conversation summaries

CRITICAL RULES FOR ZEVAUX PERSONAS:
- Zevaux personas are BUSINESS DECISION-MAKERS, OWNERS, or OPERATIONS STAFF at small/mid-size U.S. businesses.
- Examples: dentist practice owner, HVAC company owner, law firm managing partner, clinic front-desk manager, salon owner, contractor, real estate agent.
- Focus on: missed calls, lead leakage, overwhelmed staff, after-hours calls, appointment no-shows, competitor stealing leads, high admin costs, can't scale, losing revenue to poor follow-up.
- NEVER describe Zevaux personas as looking for a new job, searching for roles, using resumes/ATS, preparing for interviews, or job hunting.
- NEVER mention job boards, LinkedIn job applications, recruiters (as audience), or career advancement in the context of Zevaux.
- Zevaux personas want to GROW THEIR BUSINESS, not get hired by someone else.

Persona requirements:
- The persona MUST be tightly tied to:
  - the selected product AND
  - the selected audienceType (jobseeker, recruiter, smb_owner, agency_owner).
- Reference at least 4–6 relevant product features in the persona's description, painPoints, goals, and buyingTriggers.
- Use U.S. business context: missed calls, lead leakage, staff overwhelm, competitor pressure, low budgets, time pressure.
- Use authentic emotional drivers: frustration, anxiety, fear of losing revenue, desire for control and growth.
- Do NOT produce generic templates. Each persona must feel like a specific, believable person with a realistic backstory and constraints.

Output policy:
- Output ONLY the JSON object defined by our Zod schema.
- Do not add extra fields or commentary.
`;

// User prompt builder function
export function buildPersonaUserPrompt(params: {
  product: 'CareerScaleUp' | 'Zevaux';
  audienceType: 'jobseeker' | 'recruiter' | 'smb_owner' | 'agency_owner';
  seedNotes?: string;
}) {
  const { product, audienceType, seedNotes } = params;

  // Build audience description based on product and type
  let audienceDescription = '';
  if (product === 'CareerScaleUp') {
    if (audienceType === 'jobseeker') {
      audienceDescription = 'Job Seeker using CareerScaleUp for their own career (resume optimization, job search, interview prep, application tracking)';
    } else if (audienceType === 'recruiter') {
      audienceDescription = 'Recruiter / Hiring Manager using CareerScaleUp to hire and manage candidates (screening, job descriptions, candidate ranking)';
    }
  } else if (product === 'Zevaux') {
    if (audienceType === 'smb_owner') {
      audienceDescription = 'Small/Mid-size Business Owner or Operations Manager using Zevaux AI Receptionist (call handling, lead qualification, appointment scheduling, follow-ups)';
    } else if (audienceType === 'agency_owner') {
      audienceDescription = 'Agency Owner or Agency Operations Manager using Zevaux for client communication and lead management';
    }
  }

  return `
Generate ONE customer persona.

Product: ${product}
Audience type: ${audienceDescription}

${product === 'Zevaux' ? `
CRITICAL: This persona is a BUSINESS OWNER or STAFF MEMBER, NOT a job seeker.
- Focus on: missed calls, lead leakage, overwhelmed receptionist, after-hours calls, appointment scheduling chaos, lost revenue from poor follow-up
- Role examples: dentist, HVAC contractor, law firm partner, salon owner, clinic manager, real estate agent, home services owner
- Goals: grow business revenue, capture more leads, reduce admin costs, improve customer service, scale operations
- DO NOT mention: resumes, job applications, ATS, interviews, recruiters, career advancement, job searching
` : ''}

Additional guidance from the user (optional):
${seedNotes && seedNotes.trim().length > 0 ? seedNotes : 'No extra guidance provided.'}

JSON shape (no extra fields):

{
  "name": string,
  "product": "CareerScaleUp" | "Zevaux",
  "audienceType": "jobseeker" | "recruiter" | "smb_owner" | "agency_owner",
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
- Make the description clearly match the audienceType and product:
  ${product === 'CareerScaleUp' ? `
  - For jobseeker: focus on getting hired, ATS issues, interviews, job search stress, resume optimization
  - For recruiter: focus on sourcing, screening, time pressure, quality of hire, stakeholder pressure, tools overload
  ` : `
  - For smb_owner: focus on missed calls costing revenue, staff overwhelmed with admin, lead leakage to competitors, no after-hours coverage, poor follow-up killing conversions
  - For agency_owner: focus on managing multiple clients, scaling operations, maintaining quality, reducing manual tasks
  `}
- Mention at least 4–6 concrete features of ${product} that matter for this audienceType.
- Mention at least 3 concrete real-world consequences (e.g., ${product === 'Zevaux' ? 'lost revenue from missed calls, leads going to competitors, staff burnout, customer complaints' : 'lost revenue, wasted hours screening resumes, missed great candidates, repeated ATS rejections, burnt-out team'}).
- Use a realistic U.S. setting and salary/role context.
- Do not wrap the JSON in markdown or code fences.
`;
}

export async function generatePersonaHandler(req: Request, res: Response) {
  try {
    // Validate input
    const input = GeneratePersonaInputSchema.parse(req.body);
    const { product, audienceType, seed_notes } = input;

    // Auto-default audienceType based on product
    let finalAudienceType = audienceType;
    if (!finalAudienceType) {
      // If product is Zevaux, default to smb_owner
      // If product is CareerScaleUp, default to jobseeker for backward compatibility
      finalAudienceType = product === 'Zevaux' ? 'smb_owner' : 'jobseeker';
    }
    
    // Validation: Ensure Zevaux personas are SMB/agency owners, not job seekers
    if (product === 'Zevaux' && (finalAudienceType === 'jobseeker' || finalAudienceType === 'recruiter')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid audience type for Zevaux. Must be "smb_owner" or "agency_owner".',
      });
    }

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

