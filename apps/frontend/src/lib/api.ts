import type {
  Persona,
  Messaging,
  Script,
  BlogOutline,
  Product,
  AudienceType,
  SocialAccount,
  SocialPost,
  SocialPostMetricsSnapshot,
  CreateSocialAccountInput,
  CreateSocialPostInput,
  CreateMetricsSnapshotInput,
  Funnel,
  FunnelType,
  ToneType,
  LeadMagnet,
  LeadMagnetType,
  EmailSmsSequence,
  SequenceType,
  SocialPack,
  PaidAdsPack,
  PricingPagePack,
  SocialProofPack,
  ViralShortFormScript,
  ShortFormPlatform,
  LinkedInViralPack,
  AdsPackResponse,
  SocialProofPackResponse,
  PricingPackResponse,
  AnalyticsInput,
  AnalyticsResponse,
  NicheVariantResponse,
} from '@growth-os/shared';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

class ApiError extends Error {
  constructor(
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const json: ApiResponse<T> = await response.json();

  if (!json.success || !response.ok) {
    throw new ApiError(json.error || 'Request failed', json.details);
  }

  return json.data as T;
}

// ============================================================
// PERSONA API
// ============================================================
export async function generatePersona(input: {
  product: Product;
  audienceType?: AudienceType;
  seed_notes?: string;
}): Promise<Persona> {
  return fetchApi<Persona>('/api/generate/persona', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listPersonas(product?: Product): Promise<Persona[]> {
  const url = product ? `/api/personas?product=${product}` : '/api/personas';
  return fetchApi<Persona[]>(url);
}

// ============================================================
// MESSAGING API
// ============================================================
export async function generateMessaging(input: {
  personaId: string;
}): Promise<Messaging> {
  return fetchApi<Messaging>('/api/generate/messaging', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listMessagingForPersona(
  personaId: string
): Promise<Messaging[]> {
  return fetchApi<Messaging[]>(`/api/messaging?personaId=${personaId}`);
}

// ============================================================
// SCRIPT API
// ============================================================
export async function generateScript(input: {
  personaId: string;
  messagingId: string;
  platform: 'tiktok' | 'reels' | 'shorts';
}): Promise<Script> {
  return fetchApi<Script>('/api/generate/script', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listScriptsForPersona(
  personaId: string
): Promise<Script[]> {
  return fetchApi<Script[]>(`/api/scripts?personaId=${personaId}`);
}

// ============================================================
// BLOG OUTLINE API
// ============================================================
export async function generateBlogOutline(input: {
  personaId: string;
  messagingId: string;
}): Promise<BlogOutline> {
  return fetchApi<BlogOutline>('/api/generate/blog-outline', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listBlogOutlinesForPersona(
  personaId: string
): Promise<BlogOutline[]> {
  return fetchApi<BlogOutline[]>(`/api/blog-outlines?personaId=${personaId}`);
}

// ============================================================
// SOCIAL ANALYTICS API
// ============================================================

// Social Accounts
export async function createSocialAccount(
  input: CreateSocialAccountInput
): Promise<SocialAccount> {
  return fetchApi<SocialAccount>('/api/social/accounts', {
    method: 'POST',
    body: JSON.stringify({
      platform: input.platform,
      handle: input.handle,
      profileUrl: input.profile_url,
      label: input.label,
      brand: input.brand,
    }),
  });
}

export async function listSocialAccounts(
  platform?: string,
  brand?: string
): Promise<SocialAccount[]> {
  const params = new URLSearchParams();
  if (platform) params.append('platform', platform);
  if (brand) params.append('brand', brand);
  
  const url = params.toString()
    ? `/api/social/accounts?${params.toString()}`
    : '/api/social/accounts';
  return fetchApi<SocialAccount[]>(url);
}

// Social Posts
export async function createSocialPost(
  input: CreateSocialPostInput
): Promise<SocialPost> {
  return fetchApi<SocialPost>('/api/social/posts', {
    method: 'POST',
    body: JSON.stringify({
      socialAccountId: input.social_account_id,
      product: input.product,
      audienceType: input.audience_type,
      sourceType: input.source_type,
      sourceId: input.source_id,
      platformPostId: input.platform_post_id,
      url: input.url,
      postedAt: input.posted_at,
      tags: input.tags || [],
    }),
  });
}

export async function listSocialPosts(filters?: {
  product?: string;
  audienceType?: string;
  accountId?: string;
  dateFrom?: string;
  dateTo?: string;
  tag?: string;
}): Promise<SocialPost[]> {
  const params = new URLSearchParams();
  if (filters?.product) params.append('product', filters.product);
  if (filters?.audienceType) params.append('audienceType', filters.audienceType);
  if (filters?.accountId) params.append('accountId', filters.accountId);
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters?.dateTo) params.append('dateTo', filters.dateTo);
  if (filters?.tag) params.append('tag', filters.tag);

  const url = params.toString()
    ? `/api/social/posts?${params.toString()}`
    : '/api/social/posts';
  return fetchApi<SocialPost[]>(url);
}

// Metrics
export async function createMetricsSnapshot(
  postId: string,
  input: Omit<CreateMetricsSnapshotInput, 'social_post_id'>
): Promise<SocialPostMetricsSnapshot> {
  return fetchApi<SocialPostMetricsSnapshot>(
    `/api/social/posts/${postId}/metrics`,
    {
      method: 'POST',
      body: JSON.stringify({
        views: input.views,
        likes: input.likes,
        comments: input.comments,
        shares: input.shares,
        saves: input.saves || 0,
      }),
    }
  );
}

export async function listMetricsForPost(
  postId: string
): Promise<SocialPostMetricsSnapshot[]> {
  return fetchApi<SocialPostMetricsSnapshot[]>(
    `/api/social/posts/${postId}/metrics`
  );
}

// Helper to get all scripts and blogs for source selection
export async function listAllScripts(): Promise<Script[]> {
  return fetchApi<Script[]>('/api/scripts');
}

export async function listAllBlogOutlines(): Promise<BlogOutline[]> {
  return fetchApi<BlogOutline[]>('/api/blog-outlines');
}

// ============================================================
// VALIDATION ENDPOINTS
// ============================================================

export interface GlobalValidationInput {
  personaId: string;
  messagingId?: string;
  scriptId?: string;
  blogOutlineId?: string;
}

export interface HardCheckResult {
  pass: boolean;
  errors: string[];
  warnings: string[];
}

export interface AiCheckScores {
  overallConsistencyScore: number;
  productAlignmentScore: number;
  audienceAlignmentScore: number;
  toneConsistencyScore: number;
  featureMentionConsistencyScore: number;
}

export interface AiCheckResult {
  scores: AiCheckScores;
  issues: string[];
  suggestedFixes: string[];
}

export interface GlobalValidationResult {
  hardChecks: HardCheckResult;
  aiChecks?: AiCheckResult;
}

export async function validateGlobalSet(
  input: GlobalValidationInput
): Promise<GlobalValidationResult> {
  return fetchApi<GlobalValidationResult>('/api/validate/global', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export interface ValidateAutoFixInput extends GlobalValidationInput {
  threshold?: number; // 0-1, default 0.75
  fixMessaging?: boolean; // default true
  fixScript?: boolean; // default true
}

export interface AutoFixResult {
  hardChecks: HardCheckResult;
  aiChecks?: AiCheckResult;
  autoFixApplied: boolean;
  updatedIds?: {
    messagingId?: string;
    scriptId?: string;
  };
}

export async function validateAutoFix(
  input: ValidateAutoFixInput
): Promise<AutoFixResult> {
  return fetchApi<AutoFixResult>('/api/validate/auto-fix', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// ============================================================
// GROWTH OS NEW MODULES API
// ============================================================

// FUNNELS
export async function generateFunnel(input: {
  personaId: string;
  messagingId?: string;
  funnelType: FunnelType;
  tone: ToneType;
  customNotes?: string;
}): Promise<Funnel> {
  return fetchApi<Funnel>('/api/generate/funnel', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listFunnels(personaId?: string, product?: string): Promise<Funnel[]> {
  const params = new URLSearchParams();
  if (personaId) params.append('personaId', personaId);
  if (product) params.append('product', product);
  const url = params.toString() ? `/api/funnels?${params.toString()}` : '/api/funnels';
  return fetchApi<Funnel[]>(url);
}

// LEAD MAGNETS
export async function generateLeadMagnet(input: {
  personaId: string;
  messagingId?: string;
  leadMagnetType: LeadMagnetType;
  customNotes?: string;
}): Promise<LeadMagnet> {
  return fetchApi<LeadMagnet>('/api/generate/lead-magnet', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listLeadMagnets(personaId?: string, product?: string): Promise<LeadMagnet[]> {
  const params = new URLSearchParams();
  if (personaId) params.append('personaId', personaId);
  if (product) params.append('product', product);
  const url = params.toString() ? `/api/lead-magnets?${params.toString()}` : '/api/lead-magnets';
  return fetchApi<LeadMagnet[]>(url);
}

// EMAIL/SMS SEQUENCES
export async function generateEmailSmsSequence(input: {
  personaId: string;
  messagingId?: string;
  sequenceType: SequenceType;
  customNotes?: string;
}): Promise<EmailSmsSequence> {
  return fetchApi<EmailSmsSequence>('/api/generate/email-sms-sequence', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listEmailSmsSequences(personaId?: string, product?: string): Promise<EmailSmsSequence[]> {
  const params = new URLSearchParams();
  if (personaId) params.append('personaId', personaId);
  if (product) params.append('product', product);
  const url = params.toString() ? `/api/email-sms-sequences?${params.toString()}` : '/api/email-sms-sequences';
  return fetchApi<EmailSmsSequence[]>(url);
}

// SOCIAL PACKS
export async function generateSocialPack(input: {
  personaId: string;
  messagingId?: string;
  customNotes?: string;
}): Promise<SocialPack> {
  return fetchApi<SocialPack>('/api/generate/social-pack', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listSocialPacks(personaId?: string, product?: string): Promise<SocialPack[]> {
  const params = new URLSearchParams();
  if (personaId) params.append('personaId', personaId);
  if (product) params.append('product', product);
  const url = params.toString() ? `/api/social-packs?${params.toString()}` : '/api/social-packs';
  return fetchApi<SocialPack[]>(url);
}

// PAID ADS PACKS
export async function generatePaidAdsPack(input: {
  personaId: string;
  messagingId?: string;
  customNotes?: string;
}): Promise<PaidAdsPack> {
  return fetchApi<PaidAdsPack>('/api/generate/paid-ads-pack', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listPaidAdsPacks(personaId?: string, product?: string): Promise<PaidAdsPack[]> {
  const params = new URLSearchParams();
  if (personaId) params.append('personaId', personaId);
  if (product) params.append('product', product);
  const url = params.toString() ? `/api/paid-ads-packs?${params.toString()}` : '/api/paid-ads-packs';
  return fetchApi<PaidAdsPack[]>(url);
}

// PRICING PAGE PACKS
export async function generatePricingPagePack(input: {
  product: Product;
  customNotes?: string;
}): Promise<PricingPagePack> {
  return fetchApi<PricingPagePack>('/api/generate/pricing-page-pack', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listPricingPagePacks(product: string): Promise<PricingPagePack[]> {
  return fetchApi<PricingPagePack[]>(`/api/pricing-page-packs?product=${product}`);
}

// SOCIAL PROOF PACKS
export async function generateSocialProofPack(input: {
  product: Product;
  customNotes?: string;
}): Promise<SocialProofPack> {
  return fetchApi<SocialProofPack>('/api/generate/social-proof-pack', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listSocialProofPacks(product: string): Promise<SocialProofPack[]> {
  return fetchApi<SocialProofPack[]>(`/api/social-proof-packs?product=${product}`);
}

// VIRAL SHORT FORM SCRIPTS
export async function generateViralShortFormScript(input: {
  personaId: string;
  messagingId?: string;
  platform: ShortFormPlatform;
  customNotes?: string;
}): Promise<ViralShortFormScript> {
  return fetchApi<ViralShortFormScript>('/api/generate/viral-short-form-script', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listViralShortFormScripts(personaId?: string, product?: string): Promise<ViralShortFormScript[]> {
  const params = new URLSearchParams();
  if (personaId) params.append('personaId', personaId);
  if (product) params.append('product', product);
  const url = params.toString() ? `/api/viral-short-form-scripts?${params.toString()}` : '/api/viral-short-form-scripts';
  return fetchApi<ViralShortFormScript[]>(url);
}

// LINKEDIN VIRAL PACKS
export async function generateLinkedInViralPack(input: {
  personaId: string;
  messagingId?: string;
  customNotes?: string;
}): Promise<LinkedInViralPack> {
  return fetchApi<LinkedInViralPack>('/api/generate/linkedin-viral-pack', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listLinkedInViralPacks(personaId?: string, product?: string): Promise<LinkedInViralPack[]> {
  const params = new URLSearchParams();
  if (personaId) params.append('personaId', personaId);
  if (product) params.append('product', product);
  const url = params.toString() ? `/api/linkedin-viral-packs?${params.toString()}` : '/api/linkedin-viral-packs';
  return fetchApi<LinkedInViralPack[]>(url);
}

// ============================================================
// CAMPAIGN ASSETS API (Generate-Only)
// ============================================================

// ADS PACK GENERATOR
export async function generateAdsPack(input: {
  product: Product;
  audience: AudienceType;
  personaId: string;
  messagingId: string;
  campaignAngle?: string;
}): Promise<AdsPackResponse> {
  return fetchApi<AdsPackResponse>('/api/generate-ads-pack', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// SOCIAL PROOF PACK GENERATOR
export async function generateSocialProofPackLive(input: {
  product: Product;
  audience: AudienceType;
  personaId: string;
  messagingId: string;
  campaignAngle?: string;
}): Promise<SocialProofPackResponse> {
  return fetchApi<SocialProofPackResponse>('/api/generate-social-proof', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// PRICING PACK GENERATOR
export async function generatePricingPackLive(input: {
  product: Product;
  audience: AudienceType;
  personaId: string;
  messagingId: string;
  campaignAngle?: string;
}): Promise<PricingPackResponse> {
  return fetchApi<PricingPackResponse>('/api/generate-pricing-pack', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// ============================================================
// ANALYTICS API
// ============================================================

export async function analyzeAnalytics(input: {
  analytics: AnalyticsInput[];
}): Promise<AnalyticsResponse> {
  return fetchApi<AnalyticsResponse>('/api/analyze-analytics', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// ============================================================
// NICHE VARIANT ENGINE API
// ============================================================

export async function generateNicheVariant(input: {
  product: Product;
  niche: string;
  personaId: string;
  messagingId: string;
  notes?: string;
}): Promise<NicheVariantResponse> {
  return fetchApi<NicheVariantResponse>('/api/generate-niche-variant', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

