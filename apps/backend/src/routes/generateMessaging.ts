import { Request, Response } from 'express';
import { z } from 'zod';
import { generateJSON } from '../aiClient';
import { MessagingSchema, MessagingAIOutput } from '../aiSchemas';
import { getPersonaById, createMessaging } from '../repositories';

// ============================================================
// SYSTEM PROMPT
// ============================================================
export const messagingSystemPrompt = `
You generate marketing messaging for JCER's SaaS products based on:
- A specific persona (jobseeker, recruiter, SMB owner, etc.)
- A selected product (CareerScaleUp or Zevaux)
- Real product features
- U.S. market and behavior patterns

Products:
1. CareerScaleUp – Job Seekers:
   - AI Resume Optimizer (ATS rewriting, formatting, keyword injection)
   - Job Description Matching Engine
   - AI Career Clarity Coach
   - Interview Prep Simulator
   - Job Application Tracker
   - AI Cover Letter Generator
   - LinkedIn Optimization

2. CareerScaleUp – Recruiters / Hiring Teams:
   - AI Job Description Writer
   - AI Candidate Screening Helper
   - Shortlist Ranking & Fit Scoring
   - Outreach Templates
   - Interview Question/Scorecard Generator
   - Hiring Pipeline Visibility

3. Zevaux – SMBs & Agencies:
   - AI Voice Receptionist
   - AI Lead Qualification
   - Automated Scheduling
   - AI Follow-Up Engine
   - Workflow Automation
   - Client Onboarding Flows
   - CRM-lite Contact Log

Requirements:
- Messaging must explicitly reference 3–5 relevant features.
- Messaging must directly address the persona's pain points, fears, motivations, and desired outcomes.
- Tone must reflect the audienceType:
  - Job seekers: supportive, empowering, clarity-focused
  - Recruiters: efficiency, confidence, quality-of-hire
  - SMB owners: stress reduction, revenue protection, professionalism
  - Agency operators: automation, scale, client experience
- MUST NOT be generic or interchangeable with competitors.

Output policy:
- Output ONLY a JSON object (validated by our Zod Messaging schema).
- Fields:
  - headline
  - emotionalHook
  - elevatorPitch
  - viralTaglines[]
- No prose outside JSON.
`;

// ============================================================
// USER PROMPT BUILDER
// ============================================================
export function buildMessagingUserPrompt(params: {
  product: "CareerScaleUp" | "Zevaux";
  audienceType: string;
  personaDescription: string;
  personaPainPoints: string[];
  personaGoals: string[];
}) {
  const { product, audienceType, personaDescription, personaPainPoints, personaGoals } = params;

  return `
Create marketing messaging for:
- Product: ${product}
- Audience: ${audienceType}
- Persona: ${personaDescription}
- Persona pain points: ${personaPainPoints.join("; ")}
- Persona goals: ${personaGoals.join("; ")}

JSON fields to output (exact):

{
  "headline": string,
  "emotional_hook": string,
  "elevator_pitch": string,
  "viral_taglines": string[]
}

Content requirements:
- Headline must be sharp, product-specific, and emotionally resonant.
- Emotional hook: 1–2 sentences addressing core fears/desires of this persona.
- Elevator pitch: 2–3 sentences explicitly referencing 3–5 relevant product features.
- Viral taglines: 3–6 short lines, scroll-stopping, tailored to the persona's psychology.
- Must integrate U.S. cultural and economic realities.
- Tone must match audienceType.
- DO NOT output extra commentary or markdown.
`;
}

// Input validation schema
const GenerateMessagingInputSchema = z.object({
  personaId: z.string().uuid(),
});

export async function generateMessagingHandler(req: Request, res: Response) {
  try {
    // Validate input
    const input = GenerateMessagingInputSchema.parse(req.body);
    const { personaId } = input;

    // Use the service to generate messaging
    const { generateMessagingForPersona } = await import('../services/generators/messagingGenerator');
    const savedMessaging = await generateMessagingForPersona(personaId);

    // Return saved record
    res.status(201).json({
      success: true,
      data: savedMessaging,
    });
  } catch (error) {
    console.error('Error generating messaging:', error);

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
        error instanceof Error
          ? error.message
          : 'Failed to generate messaging',
    });
  }
}

