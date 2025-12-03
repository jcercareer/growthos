'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  listAllPersonas,
  listAllMessaging,
  listAllScripts,
  listAllBlogOutlines,
  validateGlobalSet,
  type GlobalValidationResult,
} from '@/lib/api';
import type { Persona, Messaging, Script, BlogOutline } from '@growth-os/shared';

export default function ValidatePage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [messaging, setMessaging] = useState<Messaging[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [blogs, setBlogs] = useState<BlogOutline[]>([]);

  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('');
  const [selectedMessagingId, setSelectedMessagingId] = useState<string>('');
  const [selectedScriptId, setSelectedScriptId] = useState<string>('');
  const [selectedBlogId, setSelectedBlogId] = useState<string>('');

  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<GlobalValidationResult | null>(null);

  // Load all assets
  useEffect(() => {
    async function loadAssets() {
      try {
        const [p, m, s, b] = await Promise.all([
          listAllPersonas(),
          listAllMessaging(),
          listAllScripts(),
          listAllBlogOutlines(),
        ]);
        setPersonas(p);
        setMessaging(m);
        setScripts(s);
        setBlogs(b);
      } catch (error) {
        console.error('Failed to load assets:', error);
      }
    }
    loadAssets();
  }, []);

  // Filter messaging, scripts, and blogs by selected persona
  const filteredMessaging = messaging.filter(
    (m) => !selectedPersonaId || m.persona_id === selectedPersonaId
  );
  const filteredScripts = scripts.filter(
    (s) => !selectedPersonaId || s.persona_id === selectedPersonaId
  );
  const filteredBlogs = blogs.filter(
    (b) => !selectedPersonaId || b.persona_id === selectedPersonaId
  );

  const handleValidate = async () => {
    if (!selectedPersonaId) {
      alert('Please select a persona');
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const result = await validateGlobalSet({
        personaId: selectedPersonaId,
        messagingId: selectedMessagingId || undefined,
        scriptId: selectedScriptId || undefined,
        blogOutlineId: selectedBlogId || undefined,
      });
      setValidationResult(result);
    } catch (error) {
      console.error('Validation failed:', error);
      alert('Validation failed. See console for details.');
    } finally {
      setIsValidating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-700 bg-green-100';
    if (score >= 75) return 'text-blue-700 bg-blue-100';
    if (score >= 60) return 'text-yellow-700 bg-yellow-100';
    if (score >= 40) return 'text-orange-700 bg-orange-100';
    return 'text-red-700 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Poor';
    return 'Critical';
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Global Validation</h1>
        <p className="text-muted-foreground">
          Validate consistency across your persona, messaging, scripts, and blog outlines using
          deterministic checks + AI-powered analysis.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Assets to Validate</CardTitle>
          <CardDescription>
            Choose a persona (required) and optionally select related messaging, scripts, and blog
            outlines to validate their consistency.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="persona">Persona (Required)</Label>
            <Select value={selectedPersonaId} onValueChange={setSelectedPersonaId}>
              <SelectTrigger id="persona">
                <SelectValue placeholder="Select persona" />
              </SelectTrigger>
              <SelectContent>
                {personas.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.product} - {p.audience_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="messaging">Messaging (Optional)</Label>
            <Select
              value={selectedMessagingId}
              onValueChange={setSelectedMessagingId}
              disabled={!selectedPersonaId}
            >
              <SelectTrigger id="messaging">
                <SelectValue placeholder="Select messaging" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredMessaging.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.headline.substring(0, 60)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="script">Script (Optional)</Label>
            <Select
              value={selectedScriptId}
              onValueChange={setSelectedScriptId}
              disabled={!selectedPersonaId}
            >
              <SelectTrigger id="script">
                <SelectValue placeholder="Select script" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredScripts.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.script_type} - {s.content.substring(0, 40)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog">Blog Outline (Optional)</Label>
            <Select
              value={selectedBlogId}
              onValueChange={setSelectedBlogId}
              disabled={!selectedPersonaId}
            >
              <SelectTrigger id="blog">
                <SelectValue placeholder="Select blog outline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredBlogs.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleValidate}
            disabled={!selectedPersonaId || isValidating}
            className="w-full"
          >
            {isValidating ? 'Validating...' : 'Validate Assets'}
          </Button>
        </CardContent>
      </Card>

      {validationResult && (
        <>
          {/* Hard Checks Results */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Hard Checks
                {validationResult.hardChecks.pass ? (
                  <span className="text-green-600">✓ Passed</span>
                ) : (
                  <span className="text-red-600">✗ Failed</span>
                )}
              </CardTitle>
              <CardDescription>
                Deterministic validation of product consistency, audience alignment, and ID linking.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {validationResult.hardChecks.errors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">Errors:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {validationResult.hardChecks.errors.map((error, idx) => (
                      <li key={idx} className="text-red-600">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.hardChecks.warnings.length > 0 && (
                <div>
                  <h3 className="font-semibold text-yellow-700 mb-2">Warnings:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {validationResult.hardChecks.warnings.map((warning, idx) => (
                      <li key={idx} className="text-yellow-600">
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.hardChecks.errors.length === 0 &&
                validationResult.hardChecks.warnings.length === 0 && (
                  <p className="text-green-600">
                    ✓ All hard checks passed with no warnings!
                  </p>
                )}
            </CardContent>
          </Card>

          {/* AI Checks Results */}
          {validationResult.aiChecks && (
            <Card>
              <CardHeader>
                <CardTitle>AI Consistency Analysis (gpt-4o-mini)</CardTitle>
                <CardDescription>
                  Intelligent scoring of consistency, alignment, tone, and feature mentions across
                  your marketing assets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(validationResult.aiChecks.scores).map(([key, score]) => {
                    const label = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())
                      .replace('Score', '');
                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-lg border-2 ${getScoreColor(score)}`}
                      >
                        <div className="text-sm font-medium mb-1">{label}</div>
                        <div className="text-3xl font-bold">{score}/100</div>
                        <div className="text-xs mt-1">{getScoreLabel(score)}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Issues */}
                {validationResult.aiChecks.issues.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-orange-700 mb-2">Issues Identified:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {validationResult.aiChecks.issues.map((issue, idx) => (
                        <li key={idx} className="text-orange-600">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Fixes */}
                {validationResult.aiChecks.suggestedFixes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-blue-700 mb-2">Suggested Improvements:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {validationResult.aiChecks.suggestedFixes.map((fix, idx) => (
                        <li key={idx} className="text-blue-600">
                          {fix}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!validationResult.aiChecks && validationResult.hardChecks.pass && (
            <Card>
              <CardContent className="py-6">
                <p className="text-muted-foreground text-center">
                  AI validation was not performed. This may be due to hard check failures or an AI
                  service error.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

