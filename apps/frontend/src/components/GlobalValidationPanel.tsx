'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  validateGlobalSet,
  validateAutoFix,
  type GlobalValidationResult,
  type AutoFixResult,
} from '@/lib/api';

interface GlobalValidationPanelProps {
  personaId: string;
  messagingId?: string;
  scriptId?: string;
  blogOutlineId?: string;
  enableAutoFix?: boolean;
  onAutoFixComplete?: (updatedIds: { messagingId?: string; scriptId?: string }) => void;
}

export function GlobalValidationPanel({
  personaId,
  messagingId,
  scriptId,
  blogOutlineId,
  enableAutoFix = false,
  onAutoFixComplete,
}: GlobalValidationPanelProps) {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [result, setResult] = useState<GlobalValidationResult | null>(null);
  const [autoFixResult, setAutoFixResult] = useState<AutoFixResult | null>(null);

  const handleValidate = async () => {
    setIsValidating(true);
    setResult(null);
    setAutoFixResult(null);

    try {
      const validationResult = await validateGlobalSet({
        personaId,
        messagingId,
        scriptId,
        blogOutlineId,
      });
      setResult(validationResult);
    } catch (error) {
      console.error('Validation failed:', error);
      alert('Validation failed. See console for details.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleAutoFix = async () => {
    setIsAutoFixing(true);
    setAutoFixResult(null);

    try {
      const fixResult = await validateAutoFix({
        personaId,
        messagingId,
        scriptId,
        blogOutlineId,
        threshold: 0.75, // 75% threshold
        fixMessaging: true,
        fixScript: true,
      });

      if (fixResult.autoFixApplied) {
        // Auto-fix was applied
        toast({
          title: '✨ Auto-Fix Applied Successfully!',
          description: 'Messaging and/or script regenerated for better consistency.',
        });

        // Notify parent component to refresh data
        if (fixResult.updatedIds && onAutoFixComplete) {
          onAutoFixComplete(fixResult.updatedIds);
        }

        // Automatically re-run validation with new IDs to show updated results
        const updatedValidation = await validateGlobalSet({
          personaId,
          messagingId: fixResult.updatedIds?.messagingId || messagingId,
          scriptId: fixResult.updatedIds?.scriptId || scriptId,
          blogOutlineId,
        });
        setResult(updatedValidation);
      } else {
        // No auto-fix needed
        toast({
          title: 'No Auto-Fix Needed',
          description: 'Consistency is already above the threshold (75%). Content is good!',
        });
        setResult({
          hardChecks: fixResult.hardChecks,
          aiChecks: fixResult.aiChecks,
        });
      }
    } catch (error) {
      console.error('Auto-fix failed:', error);
      toast({
        variant: 'destructive',
        title: 'Auto-Fix Failed',
        description: error instanceof Error ? error.message : 'See console for details.',
      });
    } finally {
      setIsAutoFixing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-blue-100 text-blue-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consistency Validation</CardTitle>
        <CardDescription>
          Check if your selected assets are consistent and production-ready
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleValidate}
          disabled={isValidating || isAutoFixing}
          className="w-full"
        >
          {isValidating ? 'Running Consistency Check...' : 'Run Consistency Check'}
        </Button>

        {/* Auto-Fix Results */}
        {autoFixResult && (
          <div className="space-y-4">
            {autoFixResult.autoFixApplied ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="font-semibold text-green-800 mb-2">
                  ✨ Auto-Fix Applied Successfully!
                </p>
                <p className="text-sm text-green-700">
                  New messaging and/or script generated to improve consistency.
                </p>
                {autoFixResult.updatedIds && (
                  <div className="mt-2 text-xs text-green-600">
                    {autoFixResult.updatedIds.messagingId && (
                      <p>New Messaging ID: {autoFixResult.updatedIds.messagingId}</p>
                    )}
                    {autoFixResult.updatedIds.scriptId && (
                      <p>New Script ID: {autoFixResult.updatedIds.scriptId}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="font-semibold text-blue-800 mb-2">No Auto-Fix Needed</p>
                <p className="text-sm text-blue-700">
                  {autoFixResult.hardChecks.pass
                    ? 'Consistency score is above threshold (75%). Content is good!'
                    : 'Hard checks must pass before auto-fix can be applied.'}
                </p>
              </div>
            )}

            {/* Show validation results after auto-fix */}
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">Validation After Auto-Fix</h3>
                {autoFixResult.hardChecks.pass ? (
                  <Badge className="bg-green-600">Passed</Badge>
                ) : (
                  <Badge className="bg-red-600">FAILED</Badge>
                )}
              </div>

              {autoFixResult.aiChecks && (
                <div className="text-sm">
                  <p>
                    Overall Consistency:{' '}
                    <Badge className={getScoreColor(autoFixResult.aiChecks.scores.overallConsistencyScore)}>
                      {autoFixResult.aiChecks.scores.overallConsistencyScore}%
                    </Badge>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Hard Checks */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">Hard Checks</h3>
                {result.hardChecks.pass ? (
                  <Badge className="bg-green-600">Passed</Badge>
                ) : (
                  <Badge className="bg-red-600">FAILED</Badge>
                )}
              </div>

              {result.hardChecks.errors.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-red-700 mb-1">Errors:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.hardChecks.errors.map((error, idx) => (
                      <li key={idx} className="text-sm text-red-600">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.hardChecks.warnings.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-amber-700 mb-1">Warnings:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.hardChecks.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-amber-600">
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.hardChecks.errors.length === 0 &&
                result.hardChecks.warnings.length === 0 && (
                  <p className="text-sm text-green-600">✓ All hard checks passed!</p>
                )}
            </div>

            {/* Low Score Warning Banner */}
            {result.aiChecks &&
              result.aiChecks.scores.overallConsistencyScore < 75 &&
              enableAutoFix && (
                <>
                  <Separator />
                  <Alert variant="default" className="border-amber-500 bg-amber-50">
                    <AlertTitle className="text-amber-900 font-semibold">
                      ⚠️ Consistency is Low (
                      {result.aiChecks.scores.overallConsistencyScore}%)
                    </AlertTitle>
                    <AlertDescription className="text-amber-800 space-y-3">
                      <p>
                        Your content may not be aligned with your persona and product features.
                        Auto-regeneration can improve consistency.
                      </p>
                      <Button
                        onClick={handleAutoFix}
                        disabled={isAutoFixing}
                        variant="default"
                        className="w-full bg-amber-600 hover:bg-amber-700"
                      >
                        {isAutoFixing
                          ? 'Auto-Fixing Messaging & Script...'
                          : 'Auto-Fix Messaging & Script'}
                      </Button>
                    </AlertDescription>
                  </Alert>
                </>
              )}

            {/* AI Checks */}
            {result.aiChecks && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">AI Consistency Analysis</h3>

                  {/* Overall Score */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Consistency</span>
                      <Badge
                        className={getScoreColor(
                          result.aiChecks.scores.overallConsistencyScore
                        )}
                      >
                        {result.aiChecks.scores.overallConsistencyScore}%
                      </Badge>
                    </div>
                  </div>

                  {/* Key Scores */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Product Alignment</span>
                      <Badge
                        variant="outline"
                        className={getScoreColor(
                          result.aiChecks.scores.productAlignmentScore
                        )}
                      >
                        {result.aiChecks.scores.productAlignmentScore}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Audience Alignment</span>
                      <Badge
                        variant="outline"
                        className={getScoreColor(
                          result.aiChecks.scores.audienceAlignmentScore
                        )}
                      >
                        {result.aiChecks.scores.audienceAlignmentScore}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tone Consistency</span>
                      <Badge
                        variant="outline"
                        className={getScoreColor(result.aiChecks.scores.toneConsistencyScore)}
                      >
                        {result.aiChecks.scores.toneConsistencyScore}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Feature Consistency</span>
                      <Badge
                        variant="outline"
                        className={getScoreColor(
                          result.aiChecks.scores.featureMentionConsistencyScore
                        )}
                      >
                        {result.aiChecks.scores.featureMentionConsistencyScore}
                      </Badge>
                    </div>
                  </div>

                  {/* Issues (top 3) */}
                  {result.aiChecks.issues.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-orange-700 mb-1">
                        Issues Identified:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        {result.aiChecks.issues.slice(0, 3).map((issue, idx) => (
                          <li key={idx} className="text-sm text-orange-600">
                            {issue}
                          </li>
                        ))}
                      </ul>
                      {result.aiChecks.issues.length > 3 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          +{result.aiChecks.issues.length - 3} more issues
                        </p>
                      )}
                    </div>
                  )}

                  {/* Suggested Fixes (top 3) */}
                  {result.aiChecks.suggestedFixes.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">
                        Suggested Improvements:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        {result.aiChecks.suggestedFixes.slice(0, 3).map((fix, idx) => (
                          <li key={idx} className="text-sm text-blue-600">
                            {fix}
                          </li>
                        ))}
                      </ul>
                      {result.aiChecks.suggestedFixes.length > 3 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          +{result.aiChecks.suggestedFixes.length - 3} more suggestions
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {!result.aiChecks && result.hardChecks.pass && (
              <>
                <Separator />
                <p className="text-sm text-muted-foreground">
                  AI validation was not performed (service may be unavailable).
                </p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

