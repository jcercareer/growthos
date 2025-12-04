import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { createLeadMagnet } from '../../repositories/leadMagnets';
import { generateJSON } from '../../aiClient';
import { LeadMagnetSchema } from '../../aiSchemas';
import { buildPrompt } from '../../prompts/applySystemPrompt';
import type { LeadMagnet, LeadMagnetType } from '@growth-os/shared';

const CAREERSCALEUP_FEATURES = `
CORE FEATURES: ATS Resume Scanner, AI Resume Writer, Cover Letter Writer, Job Match Engine, Job Search Automations, AI Interview Trainer, Skills Gap Recommender, Chrome Extension, AI Career Document Generator
AI COACHING: Career Coach, Job Search Strategy Coach, Resume Coach, Interview Coach, Skill Gap Coach, Career Roadmap Coach, Portfolio/Branding Coach
USER PORTFOLIO: username.careerscaleup.com (showcases resume, portfolio, skills, achievements)
RECRUITER FEATURES: Post jobs, manage applicants, AI candidate shortlisting, direct messaging, view portfolios
`;

const ZEVAUX_FEATURES = `
CORE FEATURES: AI Receptionist (24/7), books appointments, responds to FAQs, handles missed calls, multi-language support, custom SMB knowledge base, real-time notifications, hyper-human voice, SMS follow-up, lead capture → CRM
`;

export function buildLeadMagnetSystemPrompt(product: 'CareerScaleUp' | 'Zevaux', audienceType: string) {
  const features = product === 'CareerScaleUp' ? CAREERSCALEUP_FEATURES : ZEVAUX_FEATURES;
  const includeSms = product === 'Zevaux' && audienceType === 'smb_owner';

  return `
You are GrowthOS — JCER's internal AI marketing engine that generates high-converting Lead Magnets with follow-up sequences for ${product}.

${features}

LEAD MAGNET OUTPUT REQUIREMENTS:
You MUST generate a complete lead magnet pack with:

1. TITLE (10-80 chars)
   - Clear, benefit-driven
   - Examples:
     * "The ATS Resume Fix Report: Why 90% of Resumes Get Rejected"
     * "The Missed Calls Loss Calculator: What Every Call Costs You"
     * "The 5-Minute Recruiter's Hiring Scorecard"

2. SUBTITLE (10-200 chars)
   - Clarifying, specific outcome
   - Examples:
     * "Fix the 7 mistakes that get your resume auto-rejected by ATS software"
     * "Calculate your monthly revenue loss from missed customer calls"

3. OVERVIEW (50-1000 chars)
   - Elevator pitch for the lead magnet
   - Pain → Solution → Outcome
   - Include specific outcomes they'll get

4. PAGES (3-20 pages)
   - Each page: page_number, title, description
   - Progressive content flow
   - Examples for CareerScaleUp Job Seekers:
     * Page 1: "Why ATS Software Rejects 75% of Resumes" - Overview of ATS filtering
     * Page 2: "The 7 Fatal Resume Mistakes" - Common errors with examples
     * Page 3: "How to Optimize Your Resume in 60 Seconds" - Quick fixes
   - Examples for Zevaux SMB:
     * Page 1: "The Hidden Cost of Missed Calls" - Revenue impact analysis
     * Page 2: "24/7 AI Receptionist: How It Works" - System walkthrough
     * Page 3: "30-Day Implementation Roadmap" - Action plan

5. BENEFITS (3-10 bullet points)
   - Tangible, specific outcomes
   - Use numbers where possible
   - Format: "Action verb + specific outcome"
   - Examples:
     * "Increase your ATS score from 45% to 95% in under 10 minutes"
     * "Capture 100% of inbound calls, even at 3am"
     * "Shortlist qualified candidates 5x faster"

6. CTA COPY (10-200 chars)
   - Action-oriented, benefit-driven
   - Examples:
     * "Download Your Free ATS Score Report Now"
     * "Get Your Missed Calls Loss Calculator"
     * "Access the Hiring Scorecard Template"

EMAIL SEQUENCE REQUIREMENTS (1-5 emails):
Generate a nurture sequence that follows the lead magnet download:

Email 1 (Day 0 - Immediate):
- Subject: Delivery + quick win
- Preview: Set expectations
- Body: Thank them, deliver value immediately, soft CTA
- Example subject: "Here's your ATS Resume Report (+ quick fix inside)"

Email 2 (Day 2):
- Subject: Educational + social proof
- Preview: Curiosity-driven
- Body: Share a case study or testimonial, deeper value
- Example subject: "How Sarah got 3 interviews in 5 days (you can too)"

Email 3 (Day 4):
- Subject: Problem amplification
- Preview: Pain point focus
- Body: Remind them of the problem, position your product as the solution
- Example subject: "Still getting rejected? Here's why..."

Email 4 (Day 7):
- Subject: Product-focused CTA
- Preview: Clear offer
- Body: Direct pitch for your product, benefits, limited-time angle
- Example subject: "Ready to fix your job search for good?"

Email 5 (Day 10 - optional):
- Subject: Last chance / urgency
- Preview: FOMO
- Body: Final push, scarcity/urgency, testimonials
- Example subject: "This closes tonight: Your AI career team"

${includeSms ? `
SMS SEQUENCE REQUIREMENTS (0-3 messages):
IMPORTANT: Only generate SMS for Zevaux SMB owners.

SMS 1 (Day 1):
- 140 chars max
- Delivery confirmation + value reminder
- Example: "Hey! Your Missed Calls Report is ready. Check your email. Quick Q: How many calls do you think you're missing weekly? -Zevaux Team"

SMS 2 (Day 5):
- 140 chars max
- Soft product pitch
- Example: "Most SMBs lose $12K/yr from missed calls. Our AI receptionist captures every one. Want a demo? Reply YES. -Zevaux"

SMS 3 (Day 9):
- 140 chars max
- Urgency/FOMO
- Example: "Only 3 spots left for our free trial. Lock it in before midnight: [LINK] -Zevaux"
` : ''}

SOCIAL POSTING SCRIPTS (3-8 posts):
Generate platform-agnostic social posts to promote the lead magnet:

Post 1: Pain point focused
Post 2: Stat/data driven
Post 3: Testimonial/social proof
Post 4: How-to teaser
Post 5: Myth-busting
Post 6-8: Variations with different hooks

Each post should:
- Include a hook (first line scroll-stopper)
- Provide value snippet
- End with CTA to download lead magnet
- 100-300 words

STYLE RULES:
- Bold, direct, no-fluff copy
- Use specific numbers and outcomes
- Reference ONLY real product features
- Pain → Agitation → Solution framework
- Conversational yet professional
- Email bodies: 100-300 words max per email
- SMS: 140 chars max
- Social posts: 100-300 words

TONE GUIDELINES:
- Job seekers: "You deserve better opportunities. We'll help you get them."
- Recruiters: "Stop wasting time. Hire better, faster."
- SMB owners: "Every missed call is lost revenue. Fix it in 5 minutes."

Output ONLY valid JSON matching the LeadMagnetSchema (no extra commentary, no markdown).
`;
}

export function buildLeadMagnetUserPrompt(params: {
  product: 'CareerScaleUp' | 'Zevaux';
  audienceType: string;
  leadMagnetType: LeadMagnetType;
  personaDescription: string;
  personaPainPoints: string[];
  personaGoals: string[];
  messagingHeadline?: string;
  messagingHook?: string;
  customNotes?: string;
}) {
  const {
    product,
    audienceType,
    leadMagnetType,
    personaDescription,
    personaPainPoints,
    personaGoals,
    messagingHeadline,
    messagingHook,
    customNotes,
  } = params;

  const includeSms = product === 'Zevaux' && audienceType === 'smb_owner';

  return `
Generate a comprehensive ${leadMagnetType} pack with follow-up sequences for ${product} targeting ${audienceType}.

PERSONA CONTEXT:
- Description: ${personaDescription}
- Pain Points: ${personaPainPoints.join('; ')}
- Goals: ${personaGoals.join('; ')}

${messagingHeadline ? `EXISTING MESSAGING:\n- Headline: ${messagingHeadline}\n- Hook: ${messagingHook || 'N/A'}` : ''}

LEAD MAGNET TYPE: ${leadMagnetType}

${customNotes ? `CUSTOM NOTES / SPECIAL ANGLE:\n${customNotes}\n` : ''}

GENERATE THE FOLLOWING:

1. LEAD MAGNET CONTENT:
   - Title: Compelling, benefit-driven (10-80 chars)
   - Subtitle: Clarifying, outcome-focused (10-200 chars)
   - Overview: Elevator pitch (50-1000 chars)
   - Pages: 3-20 progressive content pages
   - Benefits: 3-10 tangible, specific outcomes
   - CTA Copy: Action-oriented download CTA (10-200 chars)

2. EMAIL NURTURE SEQUENCE (${includeSms ? '4-5 emails' : '3-5 emails'}):
   Each email must include:
   - subject: 5-100 chars, scroll-stopping
   - preview_text: 10-100 chars, complements subject
   - body: 100-300 words, conversational, value-first
   
   Email flow:
   - Email 1 (Day 0): Delivery + immediate value
   - Email 2 (Day 2): Educational + social proof
   - Email 3 (Day 4): Problem amplification
   - Email 4 (Day 7): Product pitch + benefits
   ${includeSms ? '' : '- Email 5 (Day 10): Urgency/FOMO (optional)'}

${includeSms ? `
3. SMS FOLLOW-UP SEQUENCE (2-3 messages):
   IMPORTANT: Include SMS messages because product=Zevaux and audience=SMB.
   
   Each SMS:
   - Maximum 140 characters
   - Conversational, personal
   - Clear CTA
   
   SMS flow:
   - SMS 1 (Day 1): Delivery confirmation
   - SMS 2 (Day 5): Soft product pitch
   - SMS 3 (Day 9): Urgency/limited spots
` : `
3. SMS SEQUENCE:
   NOT REQUIRED for ${product} ${audienceType}. Set sms_messages to empty array or omit.
`}

4. SOCIAL POSTING SCRIPTS (3-8 posts):
   Each post:
   - Hook-driven opening line
   - Value snippet from lead magnet
   - CTA to download
   - 100-300 words
   - Platform-agnostic (works on LinkedIn, Twitter, Facebook)

CRITICAL REQUIREMENTS:
- Use ONLY real ${product} features
- All content must align with persona's pain points
- Email subjects must create curiosity
- ${includeSms ? 'SMS messages MUST be 140 chars or less' : 'Do NOT include SMS messages'}
- Social posts must provide standalone value
- Every benefit must be specific and measurable
- No fake testimonials or made-up names

Output ONLY valid JSON matching the LeadMagnetSchema. No markdown, no commentary, no extra text.
`;
}

/**
 * Generate lead magnet for a persona
 */
export async function generateLeadMagnetForPersona(params: {
  personaId: string;
  messagingId?: string;
  leadMagnetType: LeadMagnetType;
  customNotes?: string;
}): Promise<LeadMagnet> {
  const { personaId, messagingId, leadMagnetType, customNotes } = params;

  // Look up persona
  const persona = await getPersonaById(personaId);
  if (!persona) {
    throw new Error('Persona not found');
  }

  // Optionally look up messaging
  let messaging = null;
  if (messagingId) {
    messaging = await getMessagingById(messagingId);
  }

  // Build prompts with global context
  const moduleSystemPrompt = buildLeadMagnetSystemPrompt(
    persona.product as 'CareerScaleUp' | 'Zevaux',
    persona.audience_type
  );

  const moduleUserPrompt = buildLeadMagnetUserPrompt({
    product: persona.product as 'CareerScaleUp' | 'Zevaux',
    audienceType: persona.audience_type,
    leadMagnetType,
    personaDescription: persona.description,
    personaPainPoints: persona.pain_points,
    personaGoals: persona.goals,
    messagingHeadline: messaging?.headline,
    messagingHook: messaging?.emotional_hook,
    customNotes,
  });

  const { systemPrompt: combinedSystemPrompt, userPrompt: finalUserPrompt } = buildPrompt(
    moduleSystemPrompt,
    moduleUserPrompt
  );

  // Generate with OpenAI
  const aiOutput = await generateJSON<any>(combinedSystemPrompt, finalUserPrompt);

  // Validate AI output with Zod
  const validatedOutput = LeadMagnetSchema.parse(aiOutput);

  // Save to database
  const savedLeadMagnet = await createLeadMagnet({
    persona_id: personaId,
    messaging_id: messagingId || null,
    product: persona.product,
    audience_type: persona.audience_type,
    lead_magnet_type: leadMagnetType,
    title: validatedOutput.title,
    subtitle: validatedOutput.subtitle,
    content: {
      overview: validatedOutput.overview,
      pages: validatedOutput.pages,
      benefits: validatedOutput.benefits,
      cta_copy: validatedOutput.cta_copy,
    },
    email_scripts: validatedOutput.email_scripts,
    social_posting_scripts: validatedOutput.social_posting_scripts,
    custom_notes: customNotes,
  });

  return savedLeadMagnet;
}

