'use client';

import { useState, useEffect } from 'react';
import { generateViralShortFormScript, listPersonas, listViralShortFormScripts, listMessagingForPersona } from '@/lib/api';
import type { ViralShortFormScript, Persona, ShortFormPlatform, Messaging } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function ViralScriptsPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [messaging, setMessaging] = useState<Messaging[]>([]);
  const [selectedMessagingId, setSelectedMessagingId] = useState('');
  const [platform, setPlatform] = useState<ShortFormPlatform>('tiktok');
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [loadingMessaging, setLoadingMessaging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scripts, setScripts] = useState<ViralShortFormScript[]>([]);
  const [selectedScript, setSelectedScript] = useState<ViralShortFormScript | null>(null);

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
        console.error('Error loading personas:', err);
      } finally {
        setLoadingPersonas(false);
      }
    };
    loadPersonas();
  }, []);

  useEffect(() => {
    if (!selectedPersonaId) return;

    const loadData = async () => {
      setLoadingMessaging(true);
      try {
        const [messagingData, scriptsData] = await Promise.all([
          listMessagingForPersona(selectedPersonaId),
          listViralShortFormScripts(selectedPersonaId),
        ]);
        setMessaging(messagingData);
        if (messagingData.length > 0) {
          setSelectedMessagingId(messagingData[0].id);
        }
        setScripts(scriptsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoadingMessaging(false);
      }
    };
    loadData();
  }, [selectedPersonaId]);

  const handleGenerate = async () => {
    if (!selectedPersonaId) {
      setError('Please select a persona');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateViralShortFormScript({
        personaId: selectedPersonaId,
        messagingId: selectedMessagingId || undefined,
        platform,
        customNotes: customNotes || undefined,
      });
      setScripts([result, ...scripts]);
      setSelectedScript(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate viral script');
      console.error('Error generating viral script:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderScriptContent = (script: ViralShortFormScript) => {
    return (
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{script.title}</CardTitle>
              <Badge>{script.platform}</Badge>
            </div>
            {script.hook && (
              <CardDescription className="text-base font-semibold text-slate-700 dark:text-slate-300">
                Hook: {script.hook}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* Script Body */}
            <div>
              <Label className="text-sm font-medium text-slate-500">Script:</Label>
              <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-lg mt-2">
                <pre className="text-sm whitespace-pre-wrap font-mono text-slate-100 leading-relaxed">
                  {script.script}
                </pre>
              </div>
            </div>

            {/* CTA */}
            {script.cta && (
              <div>
                <Label className="text-sm font-medium text-slate-500">Call to Action:</Label>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg mt-2 border border-green-200">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100">{script.cta}</p>
                </div>
              </div>
            )}

            {/* Visual Prompts */}
            {script.visual_prompts && script.visual_prompts.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-slate-500">Visual Prompts:</Label>
                <ul className="mt-2 space-y-1">
                  {script.visual_prompts.map((prompt, idx) => (
                    <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>{prompt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hashtags */}
            {script.hashtags && script.hashtags.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-slate-500">Hashtags:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {script.hashtags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Duration */}
            {script.duration_seconds && (
              <Alert className="mt-2">
                <AlertDescription className="text-sm">
                  ⏱️ Duration: {script.duration_seconds} seconds
                </AlertDescription>
              </Alert>
            )}

            {/* Copy Button */}
            <Button
              onClick={() => {
                navigator.clipboard.writeText(script.script);
                alert('Script copied to clipboard!');
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              📋 Copy Script
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <AppShell title="Viral Script Generator" subtitle="Create short-form video scripts optimized for virality">
      <div className="grid lg:grid-cols-2 gap-6">
        <PageCard
          title="Viral Script Configuration"
          subtitle="Generate TikTok, Reels, and YouTube Shorts scripts"
          badgeLabel="AI Powered"
        >
          <div className="space-y-4">
            {loadingPersonas ? (
              <Alert>
                <AlertDescription>Loading personas...</AlertDescription>
              </Alert>
            ) : personas.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No personas found. Please create a persona first from the Personas page.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="persona" className="text-sm font-medium">
                    Select Persona
                  </Label>
                  <select
                    id="persona"
                    value={selectedPersonaId}
                    onChange={(e) => setSelectedPersonaId(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                  >
                    {personas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.product})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPersonaId && (
                  <div className="space-y-2">
                    <Label htmlFor="messaging" className="text-sm font-medium">
                      Messaging Pack (optional)
                    </Label>
                    {loadingMessaging ? (
                      <p className="text-sm text-slate-600">Loading messaging...</p>
                    ) : messaging.length === 0 ? (
                      <Alert>
                        <AlertDescription>
                          No messaging found. Generate messaging first for better results.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <select
                        id="messaging"
                        value={selectedMessagingId}
                        onChange={(e) => setSelectedMessagingId(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                      >
                        <option value="">-- None --</option>
                        {messaging.map((msg) => (
                          <option key={msg.id} value={msg.id}>
                            {msg.headline}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="platform" className="text-sm font-medium">
                    Platform
                  </Label>
                  <select
                    id="platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as ShortFormPlatform)}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="instagram_reel">Instagram Reel</option>
                    <option value="youtube_short">YouTube Short</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customNotes" className="text-sm font-medium">
                    Custom Notes (optional)
                  </Label>
                  <Textarea
                    id="customNotes"
                    placeholder="Add specific viral angles, trending topics, or unique hooks..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={loading || !selectedPersonaId || loadingPersonas || loadingMessaging}
                  className="w-full shadow-md"
                  size="lg"
                >
                  {loading ? 'Generating Viral Script...' : '✨ Generate Viral Script'}
                </Button>
              </>
            )}
          </div>
        </PageCard>

        <div className="space-y-4">
          <PageCard
            title="Generated Viral Scripts"
            subtitle="Ready-to-film short-form content"
          >
            {selectedScript ? (
              <Tabs defaultValue="script" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="script">Script</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="script" className="space-y-4">
                  {renderScriptContent(selectedScript)}
                </TabsContent>
                <TabsContent value="history" className="space-y-3">
                  {scripts.map((script) => (
                    <Card
                      key={script.id}
                      className="cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedScript(script)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{script.title}</CardTitle>
                          <Badge variant="outline">{script.platform}</Badge>
                        </div>
                        <CardDescription className="text-xs">
                          {script.hook}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No viral script generated yet.</p>
                <p className="text-sm mt-2">Fill out the form and click &quot;Generate Viral Script&quot;</p>
              </div>
            )}
          </PageCard>
        </div>
      </div>
    </AppShell>
  );
}
