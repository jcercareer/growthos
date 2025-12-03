import {
  GlobalValidationInput,
  HardCheckResult,
} from './globalValidationTypes';
import { getPersonaById } from '../../repositories/personas';
import { getMessagingById } from '../../repositories/messaging';
import { getScriptById } from '../../repositories/scripts';
import { getBlogOutlineById } from '../../repositories/blogOutlines';

export async function runHardChecks(
  input: GlobalValidationInput
): Promise<HardCheckResult> {
  const { personaId, messagingId, scriptId, blogOutlineId } = input;

  // Load all rows from DB
  const persona = await getPersonaById(personaId);
  const messaging = messagingId ? await getMessagingById(messagingId) : null;
  const script = scriptId ? await getScriptById(scriptId) : null;
  const blog = blogOutlineId ? await getBlogOutlineById(blogOutlineId) : null;

  const errors: string[] = [];
  const warnings: string[] = [];

  // Persona must exist
  if (!persona) {
    errors.push('Persona not found.');
    return { pass: false, errors, warnings };
  }

  // Product and AudienceType consistency checks
  // Note: messaging, scripts, and blog_outlines inherit product/audience from persona via persona_id
  // So we just need to verify they're linked to the correct persona (checked in ID linking section)

  // ID linking checks
  if (messaging && messaging.persona_id !== personaId) {
    errors.push(
      `Messaging does not reference the correct persona_id. Expected: ${personaId}, Got: ${messaging.persona_id}`
    );
  }
  if (script && script.persona_id !== personaId) {
    errors.push(
      `Script does not reference correct persona_id. Expected: ${personaId}, Got: ${script.persona_id}`
    );
  }
  if (script && messagingId && script.messaging_id !== messagingId) {
    errors.push(
      `Script.messaging_id does not match messagingId. Expected: ${messagingId}, Got: ${script.messaging_id}`
    );
  }
  if (blog && blog.persona_id !== personaId) {
    errors.push(
      `BlogOutline does not reference correct persona_id. Expected: ${personaId}, Got: ${blog.persona_id}`
    );
  }
  if (blog && messagingId && blog.messaging_id !== messagingId) {
    errors.push(
      `BlogOutline.messaging_id does not match messagingId. Expected: ${messagingId}, Got: ${blog.messaging_id}`
    );
  }

  // Required field and content quality checks
  const minLen = (s?: string | null) =>
    s && typeof s === 'string' && s.trim().length >= 10;

  if (messaging) {
    if (!minLen(messaging.headline)) {
      warnings.push('Messaging headline is too short or empty.');
    }
    if (!minLen(messaging.elevator_pitch)) {
      warnings.push('Messaging elevator pitch is too short or empty.');
    }
    if (
      !messaging.viral_taglines ||
      messaging.viral_taglines.length < 3 ||
      messaging.viral_taglines.some((t) => !minLen(t))
    ) {
      warnings.push('Messaging viral taglines are insufficient or too short.');
    }
  }

  if (script) {
    // Scripts are stored in content field with format: [HOOK]...[BODY]...[CTA]
    // Parse the sections
    const hookMatch = script.content.match(/\[HOOK[^\]]*\]\s*\n([\s\S]*?)\n\n/);
    const bodyMatch = script.content.match(/\[BODY[^\]]*\]\s*\n([\s\S]*?)\n\n/);
    const ctaMatch = script.content.match(/\[CTA[^\]]*\]\s*\n([\s\S]*?)$/);

    const hook = hookMatch ? hookMatch[1].trim() : '';
    const body = bodyMatch ? bodyMatch[1].trim() : '';
    const cta = ctaMatch ? ctaMatch[1].trim() : '';

    if (!minLen(hook)) {
      warnings.push('Script hook is too short or empty.');
    }
    if (!minLen(body)) {
      warnings.push('Script body is too short or empty.');
    }
    if (!minLen(cta)) {
      warnings.push('Script CTA is too short or empty.');
    }

    // Check word count for 30-45 second script (~80-120 words)
    const totalWords =
      (hook?.split(/\s+/).length || 0) +
      (body?.split(/\s+/).length || 0) +
      (cta?.split(/\s+/).length || 0);
    if (totalWords < 60) {
      warnings.push(
        `Script is too short (${totalWords} words). Should be ~80-120 words for 30-45 seconds.`
      );
    }
    if (totalWords > 150) {
      warnings.push(
        `Script is too long (${totalWords} words). Should be ~80-120 words for 30-45 seconds.`
      );
    }
  }

  if (blog) {
    if (!minLen(blog.title)) {
      warnings.push('Blog title is too short or empty.');
    }

    // Blog outline is stored in JSONB with sections, seo_keywords, meta_description
    const metaDescription =
      typeof blog.outline === 'object' && blog.outline !== null
        ? (blog.outline as any).meta_description
        : null;
    const sections =
      typeof blog.outline === 'object' && blog.outline !== null
        ? (blog.outline as any).sections
        : null;
    const seoKeywords =
      typeof blog.outline === 'object' && blog.outline !== null
        ? (blog.outline as any).seo_keywords
        : null;

    if (!minLen(metaDescription)) {
      warnings.push('Blog meta description is too short or empty.');
    }
    if (!sections || !Array.isArray(sections) || sections.length < 6) {
      warnings.push(
        `Blog outline has too few sections (${sections?.length || 0}). Should have 6-9 sections.`
      );
    }
    if (sections && Array.isArray(sections) && sections.length > 12) {
      warnings.push(
        `Blog outline has too many sections (${sections.length}). Should have 6-9 sections.`
      );
    }
    if (
      !seoKeywords ||
      !Array.isArray(seoKeywords) ||
      seoKeywords.length < 6 ||
      seoKeywords.length > 15
    ) {
      warnings.push(
        `Blog SEO keywords count is off (${seoKeywords?.length || 0}). Should have 6-12 keywords.`
      );
    }
  }

  return {
    pass: errors.length === 0,
    errors,
    warnings,
  };
}

