import { generateJSON } from '../../aiClient';
import { z } from 'zod';
import type { AnalyticsInput, AnalyticsResponse } from '@growth-os/shared';

const AnalyticsResponseSchema = z.object({
  summary: z.string().min(100).max(2000),
  platformRankings: z.array(z.string()).min(3).max(10),
  strengths: z.array(z.string().min(20).max(300)).min(2).max(8),
  weaknesses: z.array(z.string().min(20).max(300)).min(2).max(8),
  recommendations: z.object({
    videoIdeas: z.array(z.string().min(20).max(500)).min(3).max(5),
    linkedinPosts: z.array(z.string().min(20).max(500)).min(3).max(5),
    funnelAngles: z.array(z.string().min(20).max(300)).min(2).max(3),
    leadMagnetIdeas: z.array(z.string().min(20).max(300)).min(1).max(2),
    adIdeas: z.array(z.string().min(20).max(300)).min(1).max(2),
  }),
});

export function buildAnalyticsSystemPrompt() {
  return `
You are GrowthOS — JCER's internal AI marketing analytics engine.

You analyze manually-entered social media performance data and provide actionable insights.

OUTPUT REQUIREMENTS:
You MUST generate a comprehensive analytics report with:

1. SUMMARY (100-2000 chars)
   - High-level performance analysis
   - Key trends and patterns
   - Overall marketing health assessment

2. PLATFORM RANKINGS (3-10 platforms)
   - Ordered list from best to worst performing
   - Format: "Platform Name - Reason for ranking"
   - Example: "LinkedIn - Highest engagement rate (4.2%) and conversion potential"

3. STRENGTHS (2-8 bullet points)
   - What's working well
   - Specific metrics or patterns
   - Example: "TikTok views are 3x higher than other platforms"
   - Example: "LinkedIn has strong click-through rate, indicating quality audience"

4. WEAKNESSES (2-8 bullet points)
   - What needs improvement
   - Gaps or missed opportunities
   - Example: "Instagram engagement rate below 1% suggests content mismatch"
   - Example: "YouTube has zero link clicks despite views"

5. RECOMMENDATIONS:
   a) Video Ideas (3-5 ideas)
      - Platform-specific or cross-platform
      - Based on what's working
      - Hook-driven, actionable
      - Example: "TikTok: 'I fixed 100 resumes — here are the 3 mistakes that got rejected every time'"

   b) LinkedIn Posts (3-5 ideas)
      - Thought leadership angles
      - Based on audience engagement patterns
      - Example: "Share a controversial take: 'Your resume is getting rejected by software, not humans. Here's proof.'"

   c) Funnel Angles (2-3 angles)
      - Landing page hooks based on best-performing content
      - Example: "Focus on speed: 'Fix your resume in 60 seconds'"

   d) Lead Magnet Ideas (1-2 ideas)
      - Based on pain points evident in data
      - Example: "ATS Resume Scorecard - instant analysis"

   e) Ad Ideas (1-2 ideas)
      - Platform recommendations based on performance
      - Example: "Run retargeting on LinkedIn - high CTR suggests warm audience"

CRITICAL RULES:
- Base insights on ACTUAL data provided
- Don't make up metrics or numbers
- Be specific and actionable
- Prioritize high-ROI recommendations
- Consider CareerScaleUp and Zevaux context if evident in notes
- No generic advice - everything must be data-driven

TONE:
- Direct, analytical, actionable
- "Here's what the data shows..."
- "Based on your performance..."
- "Your best move next week is..."

Output ONLY valid JSON matching the schema. No markdown, no commentary.
`;
}

export function buildAnalyticsUserPrompt(analytics: AnalyticsInput[]) {
  const dataTable = analytics.map(a => {
    const engagementRate = a.views > 0 ? ((a.engagements / a.views) * 100).toFixed(2) : '0';
    return `${a.platform}: ${a.followers} followers, ${a.views} views, ${a.engagements} engagements (${engagementRate}% ER), ${a.clicks} clicks${a.notes ? ` - Notes: ${a.notes}` : ''}`;
  }).join('\n');

  return `
Analyze the following social media performance data from the last 7 days:

${dataTable}

Generate a comprehensive analytics report with:
1. Summary (high-level performance analysis)
2. Platform Rankings (ordered by performance with reasoning)
3. Strengths (2-8 specific things working well)
4. Weaknesses (2-8 areas needing improvement)
5. Recommendations:
   - 3-5 Video Ideas (platform-specific, hook-driven)
   - 3-5 LinkedIn Post Ideas (thought leadership angles)
   - 2-3 Funnel Angles (landing page hooks)
   - 1-2 Lead Magnet Ideas (based on evident pain points)
   - 1-2 Ad Ideas (platform + strategy)

Be specific, data-driven, and actionable. Reference actual metrics in your analysis.

Output ONLY valid JSON. No markdown, no commentary.
`;
}

/**
 * Analyze manually-entered analytics data (no DB write)
 */
export async function analyzePerformanceData(
  analytics: AnalyticsInput[]
): Promise<AnalyticsResponse> {
  const systemPrompt = buildAnalyticsSystemPrompt();
  const userPrompt = buildAnalyticsUserPrompt(analytics);

  const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);
  const validatedOutput = AnalyticsResponseSchema.parse(aiOutput);

  return validatedOutput;
}

