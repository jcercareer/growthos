'use client';

import { useState, useEffect } from 'react';
import { generateMessaging, listPersonas } from '@/lib/api';
import type { Messaging, Persona } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GlobalValidationPanel } from '@/components/GlobalValidationPanel';
import { Toaster } from '@/components/ui/toaster';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';
import { OutputToolbar } from '@/components/OutputToolbar';

export default function MessagingPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messaging, setMessaging] = useState<Messaging | null>(null);

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

  const handleGenerate = async () => {
    if (!selectedPersonaId) {
      setError('Please select a persona');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateMessaging({ personaId: selectedPersonaId });
      setMessaging(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate messaging'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedPersona = personas.find((p) => p.id === selectedPersonaId);

  return (
    <AppShell
      title="Messaging"
      subtitle="Generate AI-powered marketing messaging for your personas."
    >
      <PageCard
        title="Generate Messaging"
        subtitle="Select a persona to generate targeted marketing messaging."
        badgeLabel="Marketing Engine"
        iconSlot={
          <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-alt text-white shadow-lg shadow-brand-soft/30">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
        }
      >
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
              <div className="space-y-2">
                <Label htmlFor="persona" className="text-sm font-medium text-slate-800">Select Persona</Label>
                <Select
                  id="persona"
                  value={selectedPersonaId}
                  onValueChange={setSelectedPersonaId}
                >
                  {personas.map((persona) => (
                    <option key={persona.id} value={persona.id}>
                      {persona.name} ({persona.product})
                    </option>
                  ))}
                </Select>
              </div>

              {selectedPersona && (
                <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                  <p className="text-sm font-medium text-slate-800">{selectedPersona.name}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {selectedPersona.description}
                  </p>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={loading || !selectedPersonaId}
                className="w-full btn-brand"
                size="lg"
              >
                {loading ? 'Generating...' : 'Generate Messaging'}
              </Button>
            </>
          )}
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
      {messaging && (
        <Card className="border-0 shadow-xl rounded-3xl">
          <CardHeader className="border-b border-slate-200/60 pb-4">
            <div className="flex items-start gap-3 justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-900">Generated Messaging</CardTitle>
                  <CardDescription className="text-slate-600">
                    For {selectedPersona?.name} • {selectedPersona?.product}
                  </CardDescription>
                </div>
              </div>
              <OutputToolbar
                onCopy={() => {
                  const copyText = JSON.stringify(messaging, null, 2);
                  void navigator.clipboard.writeText(copyText);
                }}
                onRegenerate={handleGenerate}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headline</h3>
              <p className="text-lg text-slate-800">{messaging.headline}</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Emotional Hook</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {messaging.emotional_hook}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Elevator Pitch</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {messaging.elevator_pitch}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Viral Taglines</h3>
              <ul className="space-y-2">
                {messaging.viral_taglines.map((tagline, i) => (
                  <li
                    key={i}
                    className="text-sm text-slate-600 border-l-2 border-indigo-500 pl-3 py-1"
                  >
                    {tagline}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">ID: {messaging.id}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Panel */}
      {messaging && selectedPersonaId && (
        <GlobalValidationPanel
          personaId={selectedPersonaId}
          messagingId={messaging.id}
          enableAutoFix={true}
          onAutoFixComplete={async (updatedIds) => {
            // Refresh messaging data with new ID
            if (updatedIds.messagingId) {
              try {
                console.log('New messaging ID:', updatedIds.messagingId);
                console.log('Reload the page to see the new messaging');
                
                alert(
                  `New messaging generated! ID: ${updatedIds.messagingId}\n\nReload the page or navigate to the messaging list to view it.`
                );
              } catch (err) {
                console.error('Failed to reload messaging:', err);
              }
            }
          }}
        />
      )}
      <Toaster />
    </AppShell>
  );
}
