'use client';

import { useState, useEffect } from 'react';
import {
  generateBlogOutline,
  listPersonas,
  listMessagingForPersona,
} from '@/lib/api';
import type { BlogOutline, Persona, Messaging } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function BlogsPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [messaging, setMessaging] = useState<Messaging[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [selectedMessagingId, setSelectedMessagingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [loadingMessaging, setLoadingMessaging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blogOutline, setBlogOutline] = useState<BlogOutline | null>(null);

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
      const result = await generateBlogOutline({
        personaId: selectedPersonaId,
        messagingId: selectedMessagingId,
      });
      setBlogOutline(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate blog outline'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedPersona = personas.find((p) => p.id === selectedPersonaId);
  const selectedMsg = messaging.find((m) => m.id === selectedMessagingId);

  return (
    <AppShell
      title="Blog Outlines"
      subtitle="Generate SEO-optimized blog post outlines with AI."
    >
      <PageCard
        title="Generate Blog Outline"
        subtitle="Select a persona and messaging to generate an SEO-driven blog outline."
        badgeLabel="Content Engine"
        iconSlot={
          <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-alt text-white shadow-lg shadow-brand-soft/30">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

              <div className="space-y-2">
                <Label htmlFor="messaging" className="text-sm font-medium text-slate-800">Select Messaging</Label>
                {loadingMessaging ? (
                  <p className="text-sm text-slate-600">
                    Loading messaging...
                  </p>
                ) : messaging.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No messaging found for this persona. Generate messaging first.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Select
                      id="messaging"
                      value={selectedMessagingId}
                      onValueChange={setSelectedMessagingId}
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
                          {selectedMsg.elevator_pitch}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <Button
                onClick={handleGenerate}
                disabled={
                  loading ||
                  !selectedPersonaId ||
                  !selectedMessagingId ||
                  loadingMessaging
                }
                className="w-full btn-brand"
                size="lg"
              >
                {loading ? 'Generating...' : 'Generate Blog Outline'}
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
      {blogOutline && (
        <Card className="border-0 shadow-xl rounded-3xl">
          <CardHeader className="border-b border-slate-200/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">{blogOutline.title}</CardTitle>
                <CardDescription className="text-slate-600">
                  For {selectedPersona?.name} • {selectedPersona?.product}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Meta Description */}
            {blogOutline.outline.meta_description && (
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <h3 className="text-sm font-semibold text-indigo-900 mb-1">Meta Description</h3>
                <p className="text-sm text-indigo-800">
                  {blogOutline.outline.meta_description}
                </p>
              </div>
            )}

            {/* Sections */}
            <div className="space-y-6">
              <h3 className="font-semibold text-slate-900">Outline</h3>
              {blogOutline.outline.sections?.map((section, i) => (
                <div key={i} className="border-l-2 border-indigo-500 pl-4 py-1">
                  <h4 className="font-medium text-slate-900 mb-2">
                    {i + 1}. {section.title}
                  </h4>
                  <ul className="space-y-1.5">
                    {section.points.map((bullet, j) => (
                      <li key={j} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-slate-400">→</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* SEO Keywords */}
            {blogOutline.outline.seo_keywords &&
              blogOutline.outline.seo_keywords.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">SEO Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogOutline.outline.seo_keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">ID: {blogOutline.id}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
