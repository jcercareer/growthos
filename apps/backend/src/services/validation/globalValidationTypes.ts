export type GlobalValidationInput = {
  personaId: string;
  messagingId?: string;
  scriptId?: string;
  blogOutlineId?: string;
};

export type HardCheckResult = {
  pass: boolean;
  errors: string[];
  warnings: string[];
};

export type AiCheckScores = {
  overallConsistencyScore: number;
  productAlignmentScore: number;
  audienceAlignmentScore: number;
  toneConsistencyScore: number;
  featureMentionConsistencyScore: number;
};

export type AiCheckResult = {
  scores: AiCheckScores;
  issues: string[];
  suggestedFixes: string[];
};

export type GlobalValidationResult = {
  hardChecks: HardCheckResult;
  aiChecks?: AiCheckResult;
};

