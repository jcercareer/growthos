'use client';

import { useState, useEffect } from 'react';
import {
  generateScript,
  listPersonas,
  listMessagingForPersona,
  generateMessaging,
} from '@/lib/api';
import type { Script, Persona, Messaging } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';
import { OutputToolbar } from '@/components/OutputToolbar';

type Platform = 'tiktok' | 'reels' | 'shorts';

export default function ScriptsPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [messaging, setMessaging] = useState<Messaging[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [selectedMessagingId, setSelectedMessagingId] = useState('');
  const [platform, setPlatform] = useState<Platform>('tiktok');
  const [loading, setLoading] = useState(false);
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [loadingMessaging, setLoadingMessaging] = useState(false);
  const [generatingMessaging, setGeneratingMessaging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<Script | null>(null);

  // Load personas on mount
  useEffect(() => {
    const loadPersonas = async () => {
      try {
        const data = await listPersonas();
        setPersonas(data);
        if (data.length > 0) {
          setSelectedPersonaId(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load personas');
      } finally {
        setLoadingPersonas(false);
      }
    };
    loadPersonas();
  }, []);

  // Load messaging when persona changes
  useEffect(() => {
    if (!selectedPersonaId) return;

    const loadMessaging = async () => {
      setLoadingMessaging(true);
      try {
        const data = await listMessagingForPersona(selectedPersonaId);
        setMessaging(data);
        if (data.length > 0) {
          setSelectedMessagingId(data[0].id);
        } else {
          setSelectedMessagingId('');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load messaging'
        );
      } finally {
        setLoadingMessaging(false);
      }
    };
    loadMessaging();
  }, [selectedPersonaId]);

  const handleGenerate = async () => {
    if (!selectedPersonaId || !selectedMessagingId) {
      setError('Please select both persona and messaging');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateScript({
        personaId: selectedPersonaId,
        messagingId: selectedMessagingId,
        platform,
      });
      setScript(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate script');
    } finally {
      setLoading(false);
    }
  };

  const selectedPersona = personas.find((p) => p.id === selectedPersonaId);
  const selectedMsg = messaging.find((m) => m.id === selectedMessagingId);

  return (
    <AppShell
      title="Video Scripts"
      subtitle="Generate TikTok, Reels, and Shorts scripts tailored to your personas and messaging."
    >
      {/* Main card */}
      <PageCard
        title="Generate Video Script"
        subtitle="Select a persona and messaging, then let Growth OS write a 30–45 second script that highlights real CareerScaleUp or Zevaux features."
        badgeLabel="AI Script Generator"
        iconSlot={
          <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-alt text-white shadow-lg shadow-brand-soft/30">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        }
      >
        <div className="grid gap-8 md:grid-cols-[2fr,1.4fr]">
          {/* LEFT: form */}
          <div className="space-y-4">
            {loadingPersonas ? (
              <p className="text-sm text-slate-600">Loading personas...</p>
            ) : personas.length === 0 ? (
              <Alert>
                <AlertTitle>No Personas Found</AlertTitle>
                <AlertDescription>
                  Please create a persona first from the Personas page.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="persona" className="text-sm font-medium text-slate-800">
                    Select Persona
                  </Label>
                  <Select
                    id="persona"
                    value={selectedPersonaId}
                    onValueChange={setSelectedPersonaId}
                    className="w-full"
                  >
                    {personas.map((persona) => (
                      <option key={persona.id} value={persona.id}>
                        {persona.name} ({persona.product})
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="messaging" className="text-sm font-medium text-slate-800">
                    Select Messaging
                  </Label>
                  {loadingMessaging ? (
                    <p className="text-sm text-slate-600">Loading messaging...</p>
                  ) : messaging.length === 0 ? (
                    <div className="space-y-2">
                      <Alert>
                        <AlertDescription>
                          No messaging found for this persona. Generate messaging first.
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={async () => {
                          setGeneratingMessaging(true);
                          setError(null);
                          try {
                            const msg = await generateMessaging({ personaId: selectedPersonaId });
                            setMessaging([msg]);
                            setSelectedMessagingId(msg.id);
                          } catch (err) {
                            setError(err instanceof Error ? err.message : 'Failed to generate messaging');
                          } finally {
                            setGeneratingMessaging(false);
                          }
                        }}
                        disabled={generatingMessaging}
                        variant="secondary"
                        size="sm"
                      >
                        {generatingMessaging ? 'Generating...' : 'Generate Messaging'}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Select
                        id="messaging"
                        value={selectedMessagingId}
                        onValueChange={setSelectedMessagingId}
                        className="w-full"
                      >
                        {messaging.map((msg) => (
                          <option key={msg.id} value={msg.id}>
                            {msg.headline}
                          </option>
                        ))}
                      </Select>
                      {selectedMsg && (
                        <div className="mt-2 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                          <p className="text-sm font-medium text-slate-800">{selectedMsg.headline}</p>
                          <p className="text-xs text-slate-600 mt-1">
                            {selectedMsg.emotional_hook}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="platform" className="text-sm font-medium text-slate-800">
                    Platform
                  </Label>
                  <Select
                    id="platform"
                    value={platform}
                    onValueChange={(value) => setPlatform(value as Platform)}
                    className="w-full"
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="reels">Instagram Reels</option>
                    <option value="shorts">YouTube Shorts</option>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={
                    loading ||
                    !selectedPersonaId ||
                    !selectedMessagingId ||
                    loadingMessaging
                  }
                  className="mt-2 w-full md:w-auto btn-brand"
                  size="lg"
                >
                  {loading ? 'Generating Script...' : 'Generate Script'}
                </Button>
              </>
            )}
          </div>

          {/* RIGHT: helper panel */}
          <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              What this script will include
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Persona-specific hook based on U.S. job / business reality</li>
              <li>• 3–6 real features from CareerScaleUp or Zevaux</li>
              <li>• Clear transformation story from pain → outcome</li>
              <li>• Strong CTA you can paste into TikTok / Reels / Shorts</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              Tip: create separate personas for job seekers, recruiters, SMB owners, and agencies
              so your scripts feel ultra-targeted.
            </p>
          </div>
        </div>
      </PageCard>

      {/* Error */}
      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Result */}
      {script && (
        <Card className="border-0 shadow-xl rounded-3xl">
          <CardHeader className="border-b border-slate-200/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)} Script Generated
                </CardTitle>
                <CardDescription className="text-slate-600">
                  For {selectedPersona?.name} • {selectedPersona?.product}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="rounded-2xl bg-slate-900 p-6 shadow-inner">
              <pre className="text-sm whitespace-pre-wrap font-mono text-slate-100 leading-relaxed">
                {script.content}
              </pre>
            </div>

            {script.notes && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Production Notes
                </h3>
                <p className="text-sm text-amber-800">{script.notes}</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Platform: {script.script_type} • ID: {script.id}
              </p>
              <OutputToolbar
                onCopy={() => navigator.clipboard.writeText(script.content)}
                onRegenerate={handleGenerate}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
