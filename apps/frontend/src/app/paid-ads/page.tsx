'use client';

import { useState, useEffect } from 'react';
import { generatePaidAdsPack, listPersonas, listPaidAdsPacks, listMessagingForPersona } from '@/lib/api';
import type { PaidAdsPack, Persona, Messaging } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function PaidAdsPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [messaging, setMessaging] = useState<Messaging[]>([]);
  const [selectedMessagingId, setSelectedMessagingId] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [loadingMessaging, setLoadingMessaging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adsPacks, setAdsPacks] = useState<PaidAdsPack[]>([]);
  const [selectedPack, setSelectedPack] = useState<PaidAdsPack | null>(null);

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
        const [messagingData, packsData] = await Promise.all([
          listMessagingForPersona(selectedPersonaId),
          listPaidAdsPacks(selectedPersonaId),
        ]);
        setMessaging(messagingData);
        if (messagingData.length > 0) {
          setSelectedMessagingId(messagingData[0].id);
        }
        setAdsPacks(packsData);
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
      const result = await generatePaidAdsPack({
        personaId: selectedPersonaId,
        messagingId: selectedMessagingId || undefined,
        customNotes: customNotes || undefined,
      });
      setAdsPacks([result, ...adsPacks]);
      setSelectedPack(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ads pack');
      console.error('Error generating ads pack:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderAds = (pack: PaidAdsPack) => {
    if (!pack.ads || pack.ads.length === 0) {
      return <p className="text-slate-500">No ads in this pack.</p>;
    }

    return (
      <div className="space-y-4">
        {pack.ads.map((ad: any, idx: number) => (
          <Card key={idx} className="shadow-md">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{ad.platform || 'Ad'} {idx + 1}</CardTitle>
                {ad.platform && <Badge>{ad.platform}</Badge>}
              </div>
              {ad.headline && (
                <CardDescription className="text-sm font-semibold">
                  {ad.headline}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {ad.primary_text && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Primary Text:</p>
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border">
                    <p className="text-sm text-slate-800 dark:text-slate-200">{ad.primary_text}</p>
                  </div>
                </div>
              )}
              {ad.body && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Body:</p>
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border">
                    <p className="text-sm text-slate-800 dark:text-slate-200">{ad.body}</p>
                  </div>
                </div>
              )}
              {ad.cta && (
                <div className="pt-2">
                  <Button size="sm" className="shadow-sm">
                    {ad.cta}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AppShell title="Paid Ads Generator" subtitle="Create high-converting ad campaigns across platforms">
      <div className="grid lg:grid-cols-2 gap-6">
        <PageCard
          title="Ads Configuration"
          subtitle="Generate TikTok, Google, Facebook, LinkedIn ads"
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
                  <Label htmlFor="customNotes" className="text-sm font-medium">
                    Custom Notes (optional)
                  </Label>
                  <Textarea
                    id="customNotes"
                    placeholder="Add specific campaign objectives, budget considerations, or target demographics..."
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
                  {loading ? 'Generating Ads Pack...' : '✨ Generate Paid Ads Pack'}
                </Button>
              </>
            )}
          </div>
        </PageCard>

        <div className="space-y-4">
          <PageCard
            title="Generated Ads"
            subtitle="Cross-platform advertising copy"
          >
            {selectedPack ? (
              <Tabs defaultValue="ads" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ads">
                    Ads ({selectedPack.ads?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="ads" className="space-y-4">
                  {renderAds(selectedPack)}
                </TabsContent>
                <TabsContent value="history" className="space-y-3">
                  {adsPacks.map((pack) => (
                    <Card
                      key={pack.id}
                      className="cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedPack(pack)}
                    >
                      <CardHeader>
                        <CardTitle className="text-sm">{pack.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {pack.ads?.length || 0} ads
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No ads pack generated yet.</p>
                <p className="text-sm mt-2">Fill out the form and click &quot;Generate Paid Ads Pack&quot;</p>
              </div>
            )}
          </PageCard>
        </div>
      </div>
    </AppShell>
  );
}
