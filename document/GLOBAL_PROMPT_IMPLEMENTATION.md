# Global System Prompt Implementation

## ✅ COMPLETED:

### Core Infrastructure:
1. ✅ Created `/apps/backend/src/prompts/systemPrompt.ts` - Global marketing prompt
2. ✅ Created `/apps/backend/src/prompts/applySystemPrompt.ts` - Helper function
3. ✅ Updated `/apps/backend/src/routes/generatePersona.ts` - Persona generation
4. ✅ Updated `/apps/backend/src/services/generators/messagingGenerator.ts` - Messaging
5. ✅ Updated `/apps/backend/src/services/generators/scriptGenerator.ts` - Scripts

## 🚧 REMAINING GENERATORS TO UPDATE:

Apply the same pattern to these files:

### `/apps/backend/src/services/generators/`:
- [ ] `funnelGenerator.ts`
- [ ] `leadMagnetGenerator.ts`
- [ ] `emailSmsSequenceGenerator.ts`
- [ ] `socialPackGenerator.ts`
- [ ] `paidAdsPackGenerator.ts`
- [ ] `pricingPagePackGenerator.ts`
- [ ] `socialProofPackGenerator.ts`
- [ ] `viralShortFormScriptGenerator.ts`
- [ ] `linkedInViralPackGenerator.ts`
- [ ] `nicheVariantGenerator.ts`
- [ ] `campaignAdsPackGenerator.ts`
- [ ] `campaignSocialProofGenerator.ts`
- [ ] `campaignPricingPackGenerator.ts`
- [ ] `analyticsGenerator.ts`

### `/apps/backend/src/routes/`:
- [ ] `generateBlogOutline.ts`
- [ ] `generateMessaging.ts` (route file)
- [ ] `generateScript.ts` (route file)

---

## 📋 PATTERN TO APPLY:

### Step 1: Add import
```typescript
import { buildPrompt } from '../../prompts/applySystemPrompt';
// OR for route files:
import { buildPrompt } from '../prompts/applySystemPrompt';
```

### Step 2: Replace AI call
**BEFORE:**
```typescript
const systemPrompt = someSystemPrompt;
const userPrompt = buildSomeUserPrompt(...);
const aiOutput = await generateJSON<any>(systemPrompt, userPrompt);
```

**AFTER:**
```typescript
const { systemPrompt: combinedSystemPrompt, userPrompt: finalUserPrompt } = buildPrompt(
  someSystemPrompt,
  buildSomeUserPrompt(...)
);
const aiOutput = await generateJSON<any>(combinedSystemPrompt, finalUserPrompt);
```

---

## ✅ BENEFITS:

1. **Consistency**: All AI-generated content uses the same high-quality marketing framework
2. **Brand Voice**: Unified tone across all modules (personas, funnels, ads, etc.)
3. **Product Knowledge**: Every generation references actual CareerScaleUp and Zevaux features
4. **Non-Breaking**: Module-specific prompts are preserved and enhanced (not replaced)
5. **Future-Proof**: Easy to update global prompt once to affect all generators

---

## 🎯 GLOBAL PROMPT KEY FEATURES:

- High-conversion sales framework (hook → pain → solution → proof → CTA)
- Bold, emotional, compelling copywriting
- Persona-tailored messaging (job seekers, recruiters, SMB owners)
- Real feature references (no generic claims)
- Professional marketing best practices

---

## 🚀 DEPLOYMENT:

Once all generators are updated:
1. Commit all changes
2. Push to GitHub
3. Render will auto-deploy backend
4. All future AI generations will use the enhanced global prompt

---

## 📝 NOTES:

- No existing functionality was broken
- No routing or UI changes
- Only AI generation logic was enhanced
- Backward compatible with existing data

