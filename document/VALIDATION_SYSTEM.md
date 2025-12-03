# Global Validation System

## Overview

The Global Validation System ensures consistency and quality across all marketing assets (Persona, Messaging, Scripts, Blog Outlines) in Growth OS.

It uses a two-tier approach:
1. **Hard Checks** (Deterministic validation)
2. **AI Checks** (Intelligent consistency scoring with gpt-4o-mini)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│            Frontend UI (/validate)              │
│    User selects persona + optional assets       │
└──────────────────┬──────────────────────────────┘
                   │
                   │ POST /api/validate/global
                   ▼
┌─────────────────────────────────────────────────┐
│         Backend Validation Endpoint             │
│      (apps/backend/src/routes/validateGlobal.ts)│
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│          Global Validator Orchestrator          │
│   (apps/backend/src/services/validation/        │
│             globalValidator.ts)                 │
└──────────┬────────────────────────┬─────────────┘
           │                        │
           ▼                        ▼
┌──────────────────┐    ┌──────────────────────────┐
│   Hard Checks    │    │    AI Checks (optional)  │
│   (Deterministic)│    │   (gpt-4o-mini powered)  │
│   hardChecks.ts  │    │   aiGlobalValidator.ts   │
└──────────────────┘    └──────────────────────────┘
```

---

## Part 1: Hard Checks

### What Are Hard Checks?

Hard checks are **deterministic validations** that verify:
- Persona exists
- ID linking is correct (messaging/script/blog reference the right persona)
- Content quality minimums (length, structure)
- Required field presence

### Implementation

**File:** `apps/backend/src/services/validation/hardChecks.ts`

**Function:** `runHardChecks(input: GlobalValidationInput)`

**Checks Performed:**

1. **Persona Existence**
   - Persona must exist in the database
   - If not found, validation fails immediately

2. **ID Linking**
   - `messaging.persona_id` must match `personaId`
   - `script.persona_id` must match `personaId`
   - `script.messaging_id` must match `messagingId` (if provided)
   - `blog.persona_id` must match `personaId`
   - `blog.messaging_id` must match `messagingId` (if provided)

3. **Messaging Quality**
   - Headline must be at least 10 characters
   - Elevator pitch must be at least 10 characters
   - Must have at least 3 viral taglines, each at least 10 characters

4. **Script Quality**
   - Parses script content (stored as `[HOOK]...[BODY]...[CTA]`)
   - Hook must be at least 10 characters
   - Body must be at least 10 characters
   - CTA must be at least 10 characters
   - Total word count should be 60-150 words (warnings for 30-45 second target)

5. **Blog Outline Quality**
   - Title must be at least 10 characters
   - Meta description must be at least 10 characters
   - Should have 6-12 sections (warnings if outside this range)
   - Should have 6-15 SEO keywords (warnings if outside this range)

### Output

```typescript
{
  pass: boolean,          // true if no errors
  errors: string[],       // blocking issues
  warnings: string[]      // non-blocking quality issues
}
```

---

## Part 2: AI Checks

### What Are AI Checks?

AI checks use **OpenAI's gpt-4o-mini** model to perform intelligent consistency analysis across marketing assets. This provides:
- Subjective scoring (0-100) across 5 dimensions
- Specific issues identified
- Concrete suggestions for improvement

### Implementation

**File:** `apps/backend/src/services/validation/aiGlobalValidator.ts`

**Function:** `runGlobalAiValidation(input: GlobalValidationInput)`

**Model:** `gpt-4o-mini` (temperature: 0.3 for consistency)

### AI Scoring Dimensions

1. **Overall Consistency Score (0-100)**
   - How well all assets work together as a cohesive marketing strategy

2. **Product Alignment Score (0-100)**
   - Do assets accurately reference real product features?
   - Are features mentioned consistently?

3. **Audience Alignment Score (0-100)**
   - Is content consistently targeted to the right audience type?
   - Does tone match the audience (jobseeker, recruiter, SMB owner)?

4. **Tone Consistency Score (0-100)**
   - Is the tone appropriate and consistent across all assets?
   - Does it match the audience's expectations?

5. **Feature Mention Consistency Score (0-100)**
   - Are product features mentioned accurately and consistently?
   - Do features align with persona pain points and goals?

### Scoring Rubric

- **90-100**: Excellent, production-ready
- **75-89**: Good, minor improvements needed
- **60-74**: Fair, some inconsistencies or gaps
- **40-59**: Poor, major issues
- **0-39**: Critical issues, complete rewrite needed

### Output

```typescript
{
  scores: {
    overallConsistencyScore: number,
    productAlignmentScore: number,
    audienceAlignmentScore: number,
    toneConsistencyScore: number,
    featureMentionConsistencyScore: number
  },
  issues: string[],            // specific problems identified
  suggestedFixes: string[]     // concrete improvement suggestions
}
```

### AI Prompt Design

**System Prompt:**
- Lists all features for CareerScaleUp (Job Seekers/Recruiters) and Zevaux (SMBs/Agencies)
- Defines scoring dimensions and rubric
- Enforces JSON-only output (no markdown, no commentary)

**User Prompt:**
- Provides complete context:
  - Persona (description, pain points, goals, buying triggers)
  - Messaging (headline, hook, elevator pitch, taglines)
  - Script (parsed hook, body, CTA)
  - Blog Outline (title, meta description, sections, SEO keywords)
- Asks AI to:
  - Score each dimension
  - Identify specific issues
  - Suggest concrete fixes

---

## Part 3: API Endpoint

### Endpoint

**POST** `/api/validate/global`

### Request

```json
{
  "personaId": "uuid-required",
  "messagingId": "uuid-optional",
  "scriptId": "uuid-optional",
  "blogOutlineId": "uuid-optional"
}
```

### Response (Success)

```json
{
  "success": true,
  "data": {
    "hardChecks": {
      "pass": true,
      "errors": [],
      "warnings": ["Script is slightly short (65 words). Should be ~80-120 words."]
    },
    "aiChecks": {
      "scores": {
        "overallConsistencyScore": 92,
        "productAlignmentScore": 95,
        "audienceAlignmentScore": 88,
        "toneConsistencyScore": 90,
        "featureMentionConsistencyScore": 94
      },
      "issues": [
        "Blog outline mentions 'AI Resume Optimizer' but persona pain points don't emphasize resume issues."
      ],
      "suggestedFixes": [
        "Add 'frustrated by ATS rejections' to persona pain points.",
        "Consider mentioning 'Job Application Tracker' feature in the messaging elevator pitch."
      ]
    }
  }
}
```

### Response (Hard Checks Failed)

```json
{
  "success": true,
  "data": {
    "hardChecks": {
      "pass": false,
      "errors": [
        "Messaging does not reference the correct persona_id. Expected: abc-123, Got: xyz-789"
      ],
      "warnings": []
    },
    "aiChecks": undefined  // AI checks not run when hard checks fail
  }
}
```

---

## Part 4: Frontend UI

### Page

`/validate` (apps/frontend/src/app/validate/page.tsx)

### Features

1. **Asset Selection**
   - Select persona (required)
   - Select messaging (optional)
   - Select script (optional)
   - Select blog outline (optional)
   - Auto-filters messaging/scripts/blogs to show only those linked to selected persona

2. **Validation Trigger**
   - "Validate Assets" button
   - Sends POST request to `/api/validate/global`

3. **Hard Checks Display**
   - Shows pass/fail status
   - Lists all errors (red)
   - Lists all warnings (yellow)

4. **AI Checks Display**
   - Score cards with color-coding:
     - Green (90-100): Excellent
     - Blue (75-89): Good
     - Yellow (60-74): Fair
     - Orange (40-59): Poor
     - Red (0-39): Critical
   - Lists all identified issues
   - Lists all suggested improvements

---

## File Structure

```
apps/backend/src/
├── services/validation/
│   ├── globalValidationTypes.ts    # TypeScript types
│   ├── hardChecks.ts               # Deterministic validation
│   ├── aiGlobalValidator.ts        # AI-powered validation
│   └── globalValidator.ts          # Orchestrator (runs both)
└── routes/
    └── validateGlobal.ts           # API endpoint handler

apps/frontend/src/
├── lib/
│   └── api.ts                      # API helpers (validateGlobalSet)
└── app/validate/
    └── page.tsx                    # Validation UI page
```

---

## Usage Example

### Step 1: Create Marketing Assets

```bash
# 1. Create persona
POST /api/generate/persona
{
  "product": "CareerScaleUp",
  "audienceType": "jobseeker"
}
# → Returns persona with ID: persona-abc-123

# 2. Create messaging
POST /api/generate/messaging
{
  "personaId": "persona-abc-123"
}
# → Returns messaging with ID: messaging-def-456

# 3. Create script
POST /api/generate/script
{
  "personaId": "persona-abc-123",
  "messagingId": "messaging-def-456",
  "platform": "tiktok"
}
# → Returns script with ID: script-ghi-789

# 4. Create blog outline
POST /api/generate/blog-outline
{
  "personaId": "persona-abc-123",
  "messagingId": "messaging-def-456"
}
# → Returns blog with ID: blog-jkl-012
```

### Step 2: Validate the Set

```bash
POST /api/validate/global
{
  "personaId": "persona-abc-123",
  "messagingId": "messaging-def-456",
  "scriptId": "script-ghi-789",
  "blogOutlineId": "blog-jkl-012"
}
```

### Step 3: Review Results

**Hard Checks:**
- ✓ All IDs correctly linked
- ✓ Content meets minimum quality thresholds
- ⚠ Script slightly short (65 words, should be 80-120)

**AI Checks:**
- Overall Consistency: 92/100 (Excellent)
- Product Alignment: 95/100 (Excellent)
- Audience Alignment: 88/100 (Good)
- Tone Consistency: 90/100 (Excellent)
- Feature Mention: 94/100 (Excellent)

**Issues:**
- Blog outline mentions "AI Resume Optimizer" but persona doesn't emphasize resume pain points.

**Suggested Fixes:**
- Add "frustrated by ATS rejections" to persona pain points.
- Mention "Job Application Tracker" in messaging elevator pitch.

---

## Integration Points

### 1. Pre-Publish Validation

Add a "Validate Before Export" button on any page where users finalize content.

### 2. Dashboard Widget

Show validation status for recent asset sets on the dashboard.

### 3. Automated Alerts

Run validation nightly and alert if any asset sets fall below threshold (e.g., < 75 overall score).

### 4. Quality Gate

Block publishing to social platforms if hard checks fail or AI score < 60.

---

## Benefits

### For Users

1. **Confidence**: Know your marketing assets are consistent and high-quality before publishing
2. **Clarity**: Clear, actionable feedback on what to improve
3. **Efficiency**: Catch issues early instead of after content is live
4. **Learning**: AI suggestions teach best practices for product marketing

### For Growth OS

1. **Quality Control**: Ensures all generated content meets standards
2. **Feedback Loop**: Identifies where prompts or generators need improvement
3. **Trust**: Users trust the tool more when it validates itself
4. **Differentiation**: Competitors don't validate consistency across asset types

---

## Technical Notes

### Why gpt-4o-mini?

- **Cost-effective**: Cheaper than gpt-4 for high-frequency validation
- **Fast**: Low latency for real-time feedback
- **Sufficient**: Consistency scoring doesn't require the most powerful model
- **Specified by user**: User explicitly requested gpt-4o-mini (not gpt-4.1-mini)

### Error Handling

- If AI validation fails, hard checks still run and return results
- Default scores (50/100) returned if AI fails, with notice to user
- All errors logged to console for debugging

### Performance

- Hard checks: ~100-200ms (database queries)
- AI checks: ~2-4 seconds (OpenAI API call)
- Total validation time: ~3-5 seconds for full asset set

### Extensibility

Easy to add new checks:
1. **Hard checks**: Add logic to `hardChecks.ts`
2. **AI dimensions**: Update AI prompt and Zod schema
3. **UI display**: Add new score cards to frontend

---

## Testing

### Manual Testing

1. Navigate to `/validate`
2. Select a persona
3. Select optional messaging, script, blog
4. Click "Validate Assets"
5. Review hard checks and AI scores

### API Testing

```bash
# Test with curl
curl -X POST http://localhost:4000/api/validate/global \
  -H "Content-Type: application/json" \
  -d '{
    "personaId": "YOUR_PERSONA_ID",
    "messagingId": "YOUR_MESSAGING_ID"
  }'
```

### Expected Outputs

**All Pass:**
- Hard checks: `pass: true, errors: [], warnings: []`
- AI scores: All 90+ (Excellent)

**Some Issues:**
- Hard checks: `pass: true` with warnings
- AI scores: 75-89 (Good) with suggestions

**Critical Issues:**
- Hard checks: `pass: false` with errors
- AI checks: Not run (undefined)

---

## Future Enhancements

1. **Historical Tracking**: Store validation results over time, show trends
2. **Batch Validation**: Validate all assets for a product at once
3. **Automated Re-generation**: If score < threshold, auto-regenerate with feedback
4. **Custom Rules**: Let users define their own validation rules
5. **Integration with Social Analytics**: Track validation scores vs. social performance

---

## Summary

✅ **Hard Checks** ensure structural integrity and basic quality
🤖 **AI Checks** provide intelligent, context-aware consistency scoring
🎯 **Combined Approach** gives users confidence their marketing content is production-ready

**The validation system is now live and ready to use!** 🚀

