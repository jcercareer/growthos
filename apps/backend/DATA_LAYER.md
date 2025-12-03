# Backend Data Layer Reference

## Repository Functions

All repository functions are in `src/repositories/` and exported from `src/repositories/index.ts`.

Import them like this:

```typescript
import {
  createPersona,
  listPersonas,
  getPersonaById,
  createMessaging,
  listMessagingForPersona,
  // ... etc
} from './repositories';
```

## Personas Repository

### `createPersona(input: CreatePersonaInput): Promise<Persona>`

Creates a new persona.

**Example:**
```typescript
const persona = await createPersona({
  product: 'CareerScaleUp',
  name: 'Mid-Career Professional',
  age_range: '30-45',
  description: 'Experienced professional looking to advance career',
  pain_points: [
    'Stuck in current role',
    'Resume not getting responses',
    'Unsure how to pivot careers'
  ],
  goals: [
    'Get promoted or switch companies',
    'Increase salary by 20%+',
    'Build executive presence'
  ],
  buying_triggers: [
    'Job dissatisfaction',
    'Missed promotion',
    'Market downturn'
  ]
});
```

### `listPersonas(product?: string): Promise<Persona[]>`

Lists all personas, optionally filtered by product.

**Examples:**
```typescript
// All personas
const allPersonas = await listPersonas();

// CareerScaleUp personas only
const careerPersonas = await listPersonas('CareerScaleUp');

// Zevaux personas only
const zevauxPersonas = await listPersonas('Zevaux');
```

### `getPersonaById(id: string): Promise<Persona | null>`

Gets a single persona by ID. Returns `null` if not found.

**Example:**
```typescript
const persona = await getPersonaById('uuid-here');
if (persona) {
  console.log(`Found: ${persona.name}`);
} else {
  console.log('Persona not found');
}
```

---

## Messaging Repository

### `createMessaging(input: CreateMessagingInput): Promise<Messaging>`

Creates new messaging for a persona.

**Example:**
```typescript
const messaging = await createMessaging({
  persona_id: 'persona-uuid-here',
  headline: 'Land Your Dream Job in 30 Days',
  emotional_hook: 'Stop sending resumes into the void and start getting interviews',
  elevator_pitch: 'CareerScaleUp uses AI to optimize your resume for ATS systems and gives you a personalized job search strategy that actually works.',
  viral_taglines: [
    'Your resume is good. Your strategy is broken.',
    'AI-powered career advice that gets results',
    '10x your interview rate in weeks, not months'
  ]
});
```

### `listMessagingForPersona(personaId: string): Promise<Messaging[]>`

Gets all messaging entries for a specific persona.

**Example:**
```typescript
const messagingList = await listMessagingForPersona('persona-uuid-here');
console.log(`Found ${messagingList.length} messaging entries`);
```

### `getMessagingById(id: string): Promise<Messaging | null>`

Gets a single messaging entry by ID.

---

## Scripts Repository

### `createScript(input: CreateScriptInput): Promise<Script>`

Creates a new video script.

**Example:**
```typescript
const script = await createScript({
  persona_id: 'persona-uuid-here',
  messaging_id: 'messaging-uuid-here', // optional
  script_type: 'short_form',
  content: `[Hook - 3 seconds]
"Your resume is being rejected before a human even sees it..."

[Problem - 10 seconds]
"Most job seekers don't know that 75% of resumes are filtered out by AI systems called ATS. You could be the perfect candidate, but your resume isn't speaking the AI's language..."

[Solution - 15 seconds]
"That's where CareerScaleUp comes in. Our AI analyzes job descriptions and optimizes your resume to pass ATS filters while still impressing human recruiters..."

[CTA - 2 seconds]
"Link in bio to try it free for 7 days."`,
  notes: 'Target platform: TikTok/Instagram Reels. 30-second format.'
});
```

### `listScriptsForPersona(personaId: string): Promise<Script[]>`

Gets all scripts for a specific persona.

**Example:**
```typescript
const scripts = await listScriptsForPersona('persona-uuid-here');
```

### `getScriptById(id: string): Promise<Script | null>`

Gets a single script by ID.

---

## Blog Outlines Repository

### `createBlogOutline(input: CreateBlogOutlineInput): Promise<BlogOutline>`

Creates a new blog outline.

**Example:**
```typescript
const outline = await createBlogOutline({
  persona_id: 'persona-uuid-here',
  messaging_id: 'messaging-uuid-here', // optional
  title: 'How to Beat ATS Systems and Get More Interviews in 2025',
  outline: {
    sections: [
      {
        title: 'What is an ATS and Why Should You Care?',
        points: [
          'Definition of Applicant Tracking Systems',
          'Statistics on ATS usage (75%+ of companies)',
          'How ATS filters resumes'
        ]
      },
      {
        title: '5 Ways to Optimize Your Resume for ATS',
        points: [
          'Use standard section headings',
          'Include keywords from job description',
          'Avoid complex formatting',
          'Use standard fonts',
          'Save as .docx not PDF (unless specified)'
        ]
      },
      {
        title: 'Tools to Help You Win',
        points: [
          'CareerScaleUp AI optimizer',
          'ATS-friendly templates',
          'Keyword analysis tools'
        ]
      }
    ],
    seo_keywords: [
      'ATS optimization',
      'resume tips 2025',
      'applicant tracking system',
      'get more interviews'
    ],
    meta_description: 'Learn how to optimize your resume to beat ATS systems and land more interviews in 2025. Proven strategies from career experts.'
  }
});
```

### `listBlogOutlinesForPersona(personaId: string): Promise<BlogOutline[]>`

Gets all blog outlines for a specific persona.

**Example:**
```typescript
const outlines = await listBlogOutlinesForPersona('persona-uuid-here');
```

### `getBlogOutlineById(id: string): Promise<BlogOutline | null>`

Gets a single blog outline by ID.

---

## Error Handling

All repository functions throw errors with descriptive messages. Always wrap calls in try-catch:

```typescript
try {
  const persona = await createPersona(input);
  console.log('Created:', persona.id);
} catch (error) {
  console.error('Failed to create persona:', error.message);
  // Handle error appropriately
}
```

## TypeScript Types

All types are in `@growth-os/shared` package:

```typescript
import type {
  Persona,
  CreatePersonaInput,
  Messaging,
  CreateMessagingInput,
  Script,
  CreateScriptInput,
  BlogOutline,
  CreateBlogOutlineInput,
  Product,
  BaseEntity,
} from '@growth-os/shared';
```

## Next Steps

1. Create API routes in `src/index.ts` that use these repositories
2. Add validation middleware (use Zod schemas)
3. Add error handling middleware
4. Add OpenAI integration for content generation

