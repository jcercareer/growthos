# Growth OS API Examples

All endpoints are available at `http://localhost:4000/api/generate/*`

## Authentication

No authentication required for Phase 1 (internal tool).

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "data": { /* generated and saved record */ }
}
```

All error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": { /* optional validation details */ }
}
```

---

## 1. Generate Persona

**Endpoint:** `POST /api/generate/persona`

**Description:** Uses AI to generate a customer persona and saves it to the database.

### Request Body

```json
{
  "product": "CareerScaleUp",
  "seed_notes": "Target mid-career professionals who feel stuck"
}
```

**Fields:**
- `product` (required): Either `"CareerScaleUp"` or `"Zevaux"`
- `seed_notes` (optional): String with guidance for AI generation

### Example Request

```bash
curl -X POST http://localhost:4000/api/generate/persona \
  -H "Content-Type: application/json" \
  -d '{
    "product": "CareerScaleUp",
    "seed_notes": "Focus on entry-level professionals struggling with ATS systems"
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-12-01T23:00:00.000Z",
    "updated_at": "2025-12-01T23:00:00.000Z",
    "product": "CareerScaleUp",
    "name": "Entry-Level Job Seeker - Recent Graduate",
    "age_range": "22-26",
    "description": "Recent college graduate with 0-2 years of experience who is actively job searching but struggling to get past initial screening. Tech-savvy but lacks professional network and interview experience.",
    "pain_points": [
      "Resume gets rejected before reaching human recruiters",
      "Unsure how to tailor resume for ATS systems",
      "Limited professional experience to showcase",
      "Competing with hundreds of applicants for entry-level roles",
      "Don't know which keywords to include"
    ],
    "goals": [
      "Land first professional job within 3 months",
      "Get at least 5 interview callbacks per month",
      "Build a resume that passes ATS filters",
      "Learn how to stand out with limited experience",
      "Gain confidence in job search process"
    ],
    "buying_triggers": [
      "Graduation approaching or recently graduated",
      "Sent 50+ applications with no responses",
      "Friend got job offer after optimizing resume",
      "Found out resume wasn't ATS-compatible",
      "Job search lasting longer than 2 months"
    ]
  }
}
```

---

## 2. Generate Messaging

**Endpoint:** `POST /api/generate/messaging`

**Description:** Generates marketing messaging for a specific persona.

### Request Body

```json
{
  "personaId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Fields:**
- `personaId` (required): UUID of an existing persona

### Example Request

```bash
curl -X POST http://localhost:4000/api/generate/messaging \
  -H "Content-Type: application/json" \
  -d '{
    "personaId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "created_at": "2025-12-01T23:05:00.000Z",
    "updated_at": "2025-12-01T23:05:00.000Z",
    "persona_id": "550e8400-e29b-41d4-a716-446655440000",
    "headline": "Stop Sending Resumes Into the Void. Start Getting Interviews.",
    "emotional_hook": "You've spent hours perfecting your resume, but it never reaches a human. That crushing silence after sending 50 applications? It's not you—it's the ATS systems filtering you out.",
    "elevator_pitch": "CareerScaleUp uses AI to optimize your resume specifically for Applicant Tracking Systems. We analyze job descriptions, identify the exact keywords employers look for, and restructure your resume to pass ATS filters while still impressing human recruiters. Get more interviews in weeks, not months.",
    "viral_taglines": [
      "Your resume is perfect. Your strategy is broken.",
      "75% of resumes never reach a human. Are you in that 75%?",
      "I sent 100 applications. Got 2 interviews. Then I fixed my resume.",
      "The ATS doesn't care about your experience. It cares about keywords.",
      "Stop playing resume roulette. Start playing smart."
    ]
  }
}
```

---

## 3. Generate Video Script

**Endpoint:** `POST /api/generate/script`

**Description:** Generates a short-form video script for TikTok, Instagram Reels, or YouTube Shorts.

### Request Body

```json
{
  "personaId": "550e8400-e29b-41d4-a716-446655440000",
  "messagingId": "660e8400-e29b-41d4-a716-446655440001",
  "platform": "tiktok"
}
```

**Fields:**
- `personaId` (required): UUID of an existing persona
- `messagingId` (required): UUID of an existing messaging record
- `platform` (required): One of `"tiktok"`, `"reels"`, or `"shorts"`

### Example Request

```bash
curl -X POST http://localhost:4000/api/generate/script \
  -H "Content-Type: application/json" \
  -d '{
    "personaId": "550e8400-e29b-41d4-a716-446655440000",
    "messagingId": "660e8400-e29b-41d4-a716-446655440001",
    "platform": "reels"
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "created_at": "2025-12-01T23:10:00.000Z",
    "updated_at": "2025-12-01T23:10:00.000Z",
    "persona_id": "550e8400-e29b-41d4-a716-446655440000",
    "messaging_id": "660e8400-e29b-41d4-a716-446655440001",
    "script_type": "reels",
    "content": "[HOOK - First 3 seconds]\nPOV: You just sent your 50th job application this month. Still no response.\n\n[BODY - Main content]\n[0:03] Here's what they don't tell you: 75% of resumes are rejected by robots before a human even sees them.\n\n[0:08] These robots are called ATS systems, and they're scanning for specific keywords, formats, and structure.\n\n[0:15] Your resume could be perfect, but if it's not optimized for ATS, it goes straight to the digital trash.\n\n[0:22] That's why I built CareerScaleUp - AI that speaks the ATS language.\n\n[0:28] We analyze each job posting, extract the exact keywords employers want, and restructure your resume to pass the filter while still looking great to humans.\n\n[0:38] Stop playing resume roulette. Start getting interviews.\n\n[CTA - Final seconds]\n[0:42] Link in bio for a free ATS scan. See what's blocking you.",
    "notes": "B-roll suggestions: Show frustrated person at laptop, ATS dashboard UI, before/after resume comparison, interview callback notifications pinging. On-screen text: '75% REJECTED BY ROBOTS', 'ATS = Applicant Tracking System', 'LINK IN BIO'. Use trending audio about career struggles."
  }
}
```

---

## 4. Generate Blog Outline

**Endpoint:** `POST /api/generate/blog-outline`

**Description:** Generates an SEO-optimized blog post outline.

### Request Body

```json
{
  "personaId": "550e8400-e29b-41d4-a716-446655440000",
  "messagingId": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Fields:**
- `personaId` (required): UUID of an existing persona
- `messagingId` (required): UUID of an existing messaging record

### Example Request

```bash
curl -X POST http://localhost:4000/api/generate/blog-outline \
  -H "Content-Type: application/json" \
  -d '{
    "personaId": "550e8400-e29b-41d4-a716-446655440000",
    "messagingId": "660e8400-e29b-41d4-a716-446655440001"
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "created_at": "2025-12-01T23:15:00.000Z",
    "updated_at": "2025-12-01T23:15:00.000Z",
    "persona_id": "550e8400-e29b-41d4-a716-446655440000",
    "messaging_id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "How to Beat ATS Systems: The Ultimate Guide to Getting Your Resume Past the Robots (2025)",
    "outline": {
      "sections": [
        {
          "heading": "What is an ATS and Why Should You Care?",
          "bullets": [
            "Definition: Applicant Tracking System explained simply",
            "75% of resumes are filtered out by ATS before reaching recruiters",
            "Fortune 500 companies and 98% of large corporations use ATS",
            "Real example: What happens when you click 'Apply'",
            "The cost of not optimizing: Lost opportunities"
          ]
        },
        {
          "heading": "7 Ways ATS Systems Reject Your Resume (And You Don't Even Know It)",
          "bullets": [
            "Complex formatting that ATS can't parse (tables, text boxes, headers)",
            "Missing keywords from the job description",
            "Wrong file format (some ATS prefer .docx over PDF)",
            "Unconventional section headings that confuse the system",
            "Images, graphics, or logos that break parsing",
            "Typos in critical keywords",
            "Lack of exact job title matches"
          ]
        },
        {
          "heading": "The ATS Optimization Framework: 10 Steps to Pass the Filter",
          "bullets": [
            "Step 1: Use standard section headers (Experience, Education, Skills)",
            "Step 2: Extract keywords from job descriptions",
            "Step 3: Match your job titles to the posting when accurate",
            "Step 4: Use simple, clean formatting with standard fonts",
            "Step 5: Include both acronyms and spelled-out terms (ATS & Applicant Tracking System)",
            "Step 6: Quantify achievements with numbers and metrics",
            "Step 7: Test your resume with an ATS scanner",
            "Step 8: Tailor your resume for each application",
            "Step 9: Save as .docx for maximum compatibility",
            "Step 10: Keep the design human-friendly while being ATS-compliant"
          ]
        },
        {
          "heading": "Keywords That Matter: How to Find and Use Them",
          "bullets": [
            "Where to find keywords: Job description analysis",
            "Hard skills vs. soft skills in ATS scanning",
            "Industry-specific terminology and certifications",
            "How to naturally incorporate keywords without stuffing",
            "The 60-80% keyword match rule"
          ]
        },
        {
          "heading": "Common ATS Myths Debunked",
          "bullets": [
            "Myth: PDFs never work (truth: depends on the ATS)",
            "Myth: You need to include every keyword (truth: relevance matters more)",
            "Myth: ATS is looking to reject you (truth: it's looking for matches)",
            "Myth: Creative resumes always fail (truth: save creativity for post-ATS stages)"
          ]
        },
        {
          "heading": "Tools and Resources to Optimize Your Resume",
          "bullets": [
            "Free ATS scanners you can use today",
            "CareerScaleUp's AI-powered optimization",
            "Jobscan and other comparison tools",
            "How to test your resume before applying"
          ]
        },
        {
          "heading": "Real Results: Case Studies of ATS Optimization",
          "bullets": [
            "Case study: From 0 to 5 interviews per week",
            "Before and after: What changed in the resume",
            "Common patterns in successful ATS-optimized resumes"
          ]
        },
        {
          "heading": "Your Action Plan: Next Steps",
          "bullets": [
            "Download our free ATS checklist",
            "Run your current resume through a scanner",
            "Identify your top 5 target companies and their ATS systems",
            "Set up a resume optimization schedule",
            "Track your application-to-interview rate"
          ]
        }
      ],
      "seo_keywords": [
        "ATS system",
        "applicant tracking system",
        "ATS resume optimization",
        "beat ATS",
        "pass ATS filter",
        "ATS-friendly resume",
        "resume keywords",
        "ATS scanner",
        "get past resume robots",
        "ATS resume tips 2025",
        "how to optimize resume for ATS",
        "why resume gets rejected"
      ],
      "meta_description": "Learn how to beat ATS systems and get your resume past the robots. This complete guide shows you exactly how to optimize for Applicant Tracking Systems and land more interviews in 2025."
    }
  }
}
```

---

## Error Responses

### Validation Error (AI Output Invalid)

```json
{
  "success": false,
  "error": "AI output invalid, please retry.",
  "details": [
    {
      "path": ["headline"],
      "message": "String must contain at most 80 character(s)"
    }
  ]
}
```

### Not Found Error

```json
{
  "success": false,
  "error": "Persona not found"
}
```

### Server Error

```json
{
  "success": false,
  "error": "OpenAI generation failed: Insufficient quota"
}
```

---

## Testing the API

### Health Check

```bash
curl http://localhost:4000/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T23:00:00.000Z",
  "service": "growth-os-backend"
}
```

### Full Workflow Example

```bash
# 1. Generate a persona
PERSONA_RESPONSE=$(curl -s -X POST http://localhost:4000/api/generate/persona \
  -H "Content-Type: application/json" \
  -d '{"product": "CareerScaleUp"}')

PERSONA_ID=$(echo $PERSONA_RESPONSE | jq -r '.data.id')
echo "Persona ID: $PERSONA_ID"

# 2. Generate messaging for that persona
MESSAGING_RESPONSE=$(curl -s -X POST http://localhost:4000/api/generate/messaging \
  -H "Content-Type: application/json" \
  -d "{\"personaId\": \"$PERSONA_ID\"}")

MESSAGING_ID=$(echo $MESSAGING_RESPONSE | jq -r '.data.id')
echo "Messaging ID: $MESSAGING_ID"

# 3. Generate a video script
curl -X POST http://localhost:4000/api/generate/script \
  -H "Content-Type: application/json" \
  -d "{
    \"personaId\": \"$PERSONA_ID\",
    \"messagingId\": \"$MESSAGING_ID\",
    \"platform\": \"tiktok\"
  }" | jq

# 4. Generate a blog outline
curl -X POST http://localhost:4000/api/generate/blog-outline \
  -H "Content-Type: application/json" \
  -d "{
    \"personaId\": \"$PERSONA_ID\",
    \"messagingId\": \"$MESSAGING_ID\"
  }" | jq
```

---

## Rate Limiting & Costs

**OpenAI Model:** `gpt-4o-mini`
- Fast, cost-effective for JSON generation
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens

**Typical Costs Per Generation:**
- Persona: ~$0.01
- Messaging: ~$0.005
- Script: ~$0.01
- Blog Outline: ~$0.02

No rate limiting implemented in Phase 1 (internal tool).

