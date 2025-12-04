'use client';

import { useState, useEffect } from 'react';
import { generateFunnel, listPersonas, listFunnels } from '@/lib/api';
import type { Funnel, Persona, FunnelType, ToneType, Product, AudienceType } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function FunnelsPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [product, setProduct] = useState<Product>('CareerScaleUp');
  const [audienceType, setAudienceType] = useState<AudienceType>('jobseeker');
  const [funnelType, setFunnelType] = useState<FunnelType>('landing_page');
  const [tone, setTone] = useState<ToneType>('bold');
  const [customNotes, setCustomNotes] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingPersonas(true);
        const personasData = await listPersonas();
        setPersonas(personasData);
        if (personasData.length > 0) {
          setSelectedPersonaId(personasData[0].id);
          setProduct(personasData[0].product);
          setAudienceType(personasData[0].audience_type);
          const funnelsData = await listFunnels(personasData[0].id);
          setFunnels(funnelsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoadingPersonas(false);
      }
    };
    loadData();
  }, []);

  const handlePersonaChange = (personaId: string) => {
    setSelectedPersonaId(personaId);
    const persona = personas.find(p => p.id === personaId);
    if (persona) {
      setProduct(persona.product);
      setAudienceType(persona.audience_type);
    }
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const updateImageUrl = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!selectedPersonaId) {
      setError('Please select a persona');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateFunnel({
        personaId: selectedPersonaId,
        funnelType,
        tone,
        customNotes: customNotes || undefined,
      });
      setFunnels([result, ...funnels]);
      setSelectedFunnel(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate funnel');
    } finally {
      setLoading(false);
    }
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const renderFunnelOutput = (funnel: Funnel) => {
    const content = funnel.content as any;
    
    return (
      <div className="space-y-6">
        {/* Hero Section */}
        {content.hero_section && (
          <Card>
            <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  {content.hero_section.hook}
                </h1>
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300">
                  {content.hero_section.subhook}
                </p>
                {videoUrl && isYouTubeUrl(videoUrl) && (
                  <div className="mt-4 aspect-video rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src={getYouTubeEmbedUrl(videoUrl)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                <Button size="lg" className="mt-4 shadow-md">
                  {ctaText || content.hero_section.cta_text}
                </Button>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Feature Blocks */}
        {content.feature_blocks && content.feature_blocks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              How It Works
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.feature_blocks.map((feature: any, idx: number) => (
                <Card key={idx} className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Value Stack */}
        {content.value_stack && content.value_stack.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Why Choose Us?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {content.value_stack.map((value: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">{value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Social Proof */}
        {content.social_proof && (
          <Card className="shadow-md bg-slate-50 dark:bg-slate-900">
            <CardHeader>
              <CardTitle>What People Are Saying</CardTitle>
            </CardHeader>
            <CardContent>
              {content.social_proof.testimonials && (
                <div className="space-y-3">
                  {content.social_proof.testimonials.slice(0, 3).map((testimonial: string, idx: number) => (
                    <p key={idx} className="italic text-slate-600 dark:text-slate-400 border-l-4 border-blue-500 pl-4">
                      &quot;{testimonial}&quot;
                    </p>
                  ))}
                </div>
              )}
              {content.social_proof.metrics && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {content.social_proof.metrics.map((metric: string, idx: number) => (
                    <div key={idx} className="text-center">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{metric}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Urgency Section */}
        {content.urgency_section && (
          <Alert className="bg-red-50 dark:bg-red-950 border-red-200">
            <AlertDescription>
              <h3 className="font-bold text-red-900 dark:text-red-100 mb-1">
                {content.urgency_section.headline}
              </h3>
              <p className="text-red-800 dark:text-red-200">{content.urgency_section.copy}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Final CTA */}
        {content.final_cta && (
          <Card className="shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <CardContent className="pt-6 text-center">
              <Button size="lg" variant="secondary" className="shadow-md">
                {ctaText || content.final_cta.text}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Color Scheme */}
        {content.color_scheme && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-sm">Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div
                    className="h-12 rounded-lg shadow-sm"
                    style={{ backgroundColor: content.color_scheme.primary }}
                  />
                  <p className="text-xs mt-1 text-center text-slate-600">Primary</p>
                </div>
                <div className="flex-1">
                  <div
                    className="h-12 rounded-lg shadow-sm"
                    style={{ backgroundColor: content.color_scheme.secondary }}
                  />
                  <p className="text-xs mt-1 text-center text-slate-600">Secondary</p>
                </div>
                <div className="flex-1">
                  <div
                    className="h-12 rounded-lg shadow-sm"
                    style={{ backgroundColor: content.color_scheme.accent }}
                  />
                  <p className="text-xs mt-1 text-center text-slate-600">Accent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <AppShell title="Funnel Builder" subtitle="Generate high-converting funnel pages">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <PageCard
          title="Funnel Configuration"
          subtitle="Configure your high-converting funnel"
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
            {/* Persona Selection */}
            <div className="space-y-2">
              <Label htmlFor="persona" className="text-sm font-medium">
                Select Persona
              </Label>
              <select
                id="persona"
                value={selectedPersonaId}
                onChange={(e) => handlePersonaChange(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
              >
                <option value="">-- Select Persona --</option>
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.product} - {p.audience_type})
                  </option>
                ))}
              </select>
            </div>

            {/* Product & Audience (Auto-filled) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Product</Label>
                <Input value={product} disabled className="bg-slate-100 dark:bg-slate-700" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Audience</Label>
                <Input value={audienceType} disabled className="bg-slate-100 dark:bg-slate-700" />
              </div>
            </div>

            {/* Funnel Type */}
            <div className="space-y-2">
              <Label htmlFor="funnelType" className="text-sm font-medium">
                Funnel Type
              </Label>
              <select
                id="funnelType"
                value={funnelType}
                onChange={(e) => setFunnelType(e.target.value as FunnelType)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
              >
                <option value="landing_page">Landing Page</option>
                <option value="vsl">VSL (Video Sales Letter)</option>
                <option value="webinar">Webinar Registration</option>
                <option value="squeeze_page">Squeeze Page</option>
                <option value="sales_page">Sales Page</option>
              </select>
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <Label htmlFor="tone" className="text-sm font-medium">
                Tone
              </Label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneType)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
              >
                <option value="professional">Professional</option>
                <option value="bold">Bold</option>
                <option value="friendly">Friendly</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <Label htmlFor="videoUrl" className="text-sm font-medium">
                Video URL (optional)
              </Label>
              <Input
                id="videoUrl"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <p className="text-xs text-slate-500">YouTube or direct video URL</p>
            </div>

            {/* Image URLs */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Hero/Feature Images (optional)</Label>
              <p className="text-xs text-slate-500 mb-2">
                📌 Paste image URLs from your hosting (e.g., Imgur, Cloudinary, or your CDN). The funnel will reference these images. File upload coming soon!
              </p>
              {imageUrls.map((url, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    placeholder="https://i.imgur.com/yourimage.jpg"
                    value={url}
                    onChange={(e) => updateImageUrl(idx, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImageUrl(idx)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
                + Add Image URL
              </Button>
            </div>

            {/* Custom CTA */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaText" className="text-sm font-medium">
                  CTA Text (optional)
                </Label>
                <Input
                  id="ctaText"
                  placeholder="Get Started Free"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaUrl" className="text-sm font-medium">
                  CTA URL (optional)
                </Label>
                <Input
                  id="ctaUrl"
                  placeholder="https://..."
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Custom Notes */}
            <div className="space-y-2">
              <Label htmlFor="customNotes" className="text-sm font-medium">
                Custom Notes (optional)
              </Label>
              <Textarea
                id="customNotes"
                placeholder="Additional context, specific pain points, goals, or requirements..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={4}
              />
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !selectedPersonaId || loadingPersonas}
              className="w-full shadow-md"
              size="lg"
            >
              {loading ? 'Generating Funnel...' : '✨ Generate Funnel'}
            </Button>
              </>
            )}
          </div>
        </PageCard>

        {/* Output Preview */}
        <div className="space-y-4">
          <PageCard title="Funnel Preview" subtitle="Live preview of your generated funnel">
            {selectedFunnel ? (
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="space-y-4">
                  {renderFunnelOutput(selectedFunnel)}
                </TabsContent>
                <TabsContent value="json">
                  <pre className="text-xs bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-auto max-h-96">
                    {JSON.stringify(selectedFunnel.content, null, 2)}
                  </pre>
                </TabsContent>
                <TabsContent value="history" className="space-y-3">
                  {funnels.map((funnel) => (
                    <Card
                      key={funnel.id}
                      className="cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedFunnel(funnel)}
                    >
                      <CardHeader>
                        <CardTitle className="text-sm">{funnel.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {funnel.funnel_type} · {funnel.tone}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No funnel generated yet.</p>
                <p className="text-sm mt-2">Fill out the form and click &quot;Generate Funnel&quot;</p>
              </div>
            )}
          </PageCard>
        </div>
      </div>
    </AppShell>
  );
}

