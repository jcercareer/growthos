// GrowthOS structured content types

export type BlockType =
  | 'hero'
  | 'section'
  | 'featureGrid'
  | 'bulletList'
  | 'testimonial'
  | 'cta'
  | 'stat'
  | 'quote'
  | 'stepList';

export interface ImagePrompt {
  id: string;
  useCase:
    | 'thumbnail'
    | 'hero'
    | 'socialPost'
    | 'blogHeader'
    | 'adCreative'
    | 'carouselSlide'
    | 'broll'
    | 'uiMockup';
  prompt: string;
  styleHint?: string; // e.g. "hybrid SaaS + AI, clean, purple/blue"
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  title?: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  stats?: { label: string; value: string }[];
  steps?: { label: string; description: string }[];
  ctaLabel?: string;
  ctaUrl?: string;
  emphasis?: 'primary' | 'secondary';
  imageRefIds?: string[]; // which ImagePrompt ids pair with this block
}

export interface GrowthOSResult {
  rawTextSummary: string; // 2–3 paragraph summary
  blocks: ContentBlock[];
  imagePrompts: ImagePrompt[];
  notes?: string; // implementation hints for humans
}

