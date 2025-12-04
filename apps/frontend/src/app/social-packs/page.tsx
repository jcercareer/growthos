'use client';

import { useState, useEffect } from 'react';
import { generateSocialPack, listPersonas, listSocialPacks, listMessagingForPersona } from '@/lib/api';
import type { SocialPack, Persona, Messaging } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function SocialPacksPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [messaging, setMessaging] = useState<Messaging[]>([]);
  const [selectedMessagingId, setSelectedMessagingId] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [loadingMessaging, setLoadingMessaging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socialPacks, setSocialPacks] = useState<SocialPack[]>([]);
  const [selectedPack, setSelectedPack] = useState<SocialPack | null>(null);

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
          listSocialPacks(selectedPersonaId),
        ]);
        setMessaging(messagingData);
        if (messagingData.length > 0) {
          setSelectedMessagingId(messagingData[0].id);
        }
        setSocialPacks(packsData);
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
      const result = await generateSocialPack({
        personaId: selectedPersonaId,
        messagingId: selectedMessagingId || undefined,
        customNotes: customNotes || undefined,
      });
      setSocialPacks([result, ...socialPacks]);
      setSelectedPack(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate social pack');
      console.error('Error generating social pack:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderPosts = (pack: SocialPack) => {
    if (!pack.posts || pack.posts.length === 0) {
      return <p className="text-slate-500">No posts in this pack.</p>;
    }

    return (
      <div className="space-y-4">
        {pack.posts.map((post: any, idx: number) => (
          <Card key={idx} className="shadow-md">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{post.platform || 'Social Post'} {idx + 1}</CardTitle>
                {post.platform && <Badge>{post.platform}</Badge>}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                <pre className="text-sm whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200">
                  {post.content || post.text}
                </pre>
              </div>
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.hashtags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AppShell title="Social Pack Generator" subtitle="Create cross-platform social media campaigns">
      <div className="grid lg:grid-cols-2 gap-6">
        <PageCard
          title="Social Pack Configuration"
          subtitle="Generate posts for LinkedIn, Instagram, TikTok, and more"
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
                    placeholder="Add specific campaign angles, promotional offers, or content themes..."
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
                  {loading ? 'Generating Social Pack...' : '✨ Generate Social Pack'}
                </Button>
              </>
            )}
          </div>
        </PageCard>

        <div className="space-y-4">
          <PageCard
            title="Generated Social Packs"
            subtitle="Multi-platform content ready to post"
          >
            {selectedPack ? (
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="posts">
                    Posts ({selectedPack.posts?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="posts" className="space-y-4">
                  {renderPosts(selectedPack)}
                </TabsContent>
                <TabsContent value="history" className="space-y-3">
                  {socialPacks.map((pack) => (
                    <Card
                      key={pack.id}
                      className="cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedPack(pack)}
                    >
                      <CardHeader>
                        <CardTitle className="text-sm">{pack.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {pack.posts?.length || 0} posts
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No social pack generated yet.</p>
                <p className="text-sm mt-2">Fill out the form and click &quot;Generate Social Pack&quot;</p>
              </div>
            )}
          </PageCard>
        </div>
      </div>
    </AppShell>
  );
}
