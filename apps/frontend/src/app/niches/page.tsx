'use client';

import { useState, useEffect } from 'react';
import { generateNicheVariant, listPersonas, listMessagingForPersona } from '@/lib/api';
import type { Persona, Messaging, Product, NicheVariantResponse } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CAREERSCALEUP_NICHES = [
  'Nurses / Healthcare Workers',
  'Software Engineers / Tech',
  'Finance / Accounting',
  'Students / Recent Grads',
  'Immigrants / Non-Native Speakers',
  'Project Managers',
  'Remote Workers',
  'Truck Drivers',
  'Career Changers',
  'Executives / C-Level',
  'Marketing Professionals',
  'Teachers / Educators',
  'Sales Professionals',
];

const ZEVAUX_NICHES = [
  'Dental Clinics',
  'Law Firms / Attorneys',
  'HVAC Repair Services',
  'Real Estate Agencies',
  'Coaches / Consultants',
  'Hair Salons / Barbershops',
  'Cleaning Companies',
  'Chiropractors',
  'Cosmetic Clinics / Med Spas',
  'Auto Repair Shops',
  'Plumbing Services',
  'Home Contractors',
  'Pet Groomers / Veterinarians',
];

export default function NichesPage() {
  const [product, setProduct] = useState<Product>('CareerScaleUp');
  const [niche, setNiche] = useState('');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [messagingPacks, setMessagingPacks] = useState<Messaging[]>([]);
  const [selectedMessagingId, setSelectedMessagingId] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [loadingMessaging, setLoadingMessaging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<NicheVariantResponse | null>(null);

  // Load personas on mount
  useEffect(() => {
    const loadPersonas = async () => {
      try {
        setLoadingPersonas(true);
        const data = await listPersonas(product);
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
  }, [product]);

  // Load messaging when persona changes
  useEffect(() => {
    if (selectedPersonaId) {
      const loadMessaging = async () => {
        setLoadingMessaging(true);
        try {
          const data = await listMessagingForPersona(selectedPersonaId);
          setMessagingPacks(data);
          if (data.length > 0) {
            setSelectedMessagingId(data[0].id);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load messaging');
          console.error('Error loading messaging:', err);
        } finally {
          setLoadingMessaging(false);
        }
      };
      loadMessaging();
    }
  }, [selectedPersonaId]);

  // Update niche when product changes
  useEffect(() => {
    const niches = product === 'CareerScaleUp' ? CAREERSCALEUP_NICHES : ZEVAUX_NICHES;
    setNiche(niches[0]);
  }, [product]);

  const getNiches = () => {
    return product === 'CareerScaleUp' ? CAREERSCALEUP_NICHES : ZEVAUX_NICHES;
  };

  const handleGenerate = async () => {
    if (!selectedPersonaId || !selectedMessagingId) {
      setError('Please select both persona and messaging pack');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateNicheVariant({
        product,
        niche,
        personaId: selectedPersonaId,
        messagingId: selectedMessagingId,
        notes: customNotes || undefined,
      });
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate niche variant');
    } finally {
      setLoading(false);
    }
  };

  const renderOutput = (data: NicheVariantResponse) => {
    return (
      <Tabs defaultValue="persona" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="persona">Persona</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="script">Script</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="ad">Ads</TabsTrigger>
          <TabsTrigger value="lead">Lead Magnet</TabsTrigger>
        </TabsList>

        <TabsContent value="persona" className="space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>{data.personaVariant.name}</CardTitle>
              <CardDescription>{data.personaVariant.ageRange}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Description:</strong>
                <p className="text-sm mt-1">{data.personaVariant.description}</p>
              </div>
              <div>
                <strong>Pain Points:</strong>
                <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                  {data.personaVariant.painPoints.map((pain, idx) => (
                    <li key={idx}>{pain}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Goals:</strong>
                <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                  {data.personaVariant.goals.map((goal, idx) => (
                    <li key={idx}>{goal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Buying Triggers:</strong>
                <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                  {data.personaVariant.buyingTriggers.map((trigger, idx) => (
                    <li key={idx}>{trigger}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messaging" className="space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Messaging Variant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Headline:</strong>
                <p className="text-lg font-semibold mt-1">{data.messagingVariant.headline}</p>
              </div>
              <div>
                <strong>Emotional Hook:</strong>
                <p className="text-sm mt-1">{data.messagingVariant.emotionalHook}</p>
              </div>
              <div>
                <strong>Elevator Pitch:</strong>
                <p className="text-sm mt-1">{data.messagingVariant.elevatorPitch}</p>
              </div>
              <div>
                <strong>Viral Taglines:</strong>
                <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                  {data.messagingVariant.viralTaglines.map((tagline, idx) => (
                    <li key={idx}>{tagline}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="script" className="space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Video Script</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Hook:</strong>
                <p className="text-sm mt-1 font-semibold text-blue-600">{data.scriptVariant.hook}</p>
              </div>
              <div>
                <strong>Body:</strong>
                <pre className="text-sm mt-1 whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded">
                  {data.scriptVariant.body}
                </pre>
              </div>
              <div>
                <strong>CTA:</strong>
                <p className="text-sm mt-1 font-semibold text-green-600">{data.scriptVariant.cta}</p>
              </div>
              {data.scriptVariant.notes && (
                <div>
                  <strong>Notes:</strong>
                  <p className="text-xs mt-1 text-slate-500">{data.scriptVariant.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <CardTitle>{data.funnelVariant.heroSection.hook}</CardTitle>
              <CardDescription>{data.funnelVariant.heroSection.subhook}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div>
                <Button size="lg">{data.funnelVariant.heroSection.ctaText}</Button>
              </div>

              <div>
                <strong>Feature Blocks:</strong>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {data.funnelVariant.featureBlocks.map((feature, idx) => (
                    <Card key={idx} className="shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-sm">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <strong>Value Stack:</strong>
                <ul className="space-y-1 mt-2">
                  {data.funnelVariant.valueStack.map((value, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ad" className="space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>TikTok Script</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded">
                {data.adVariant.tiktokScript}
              </pre>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Facebook Ad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{data.adVariant.facebookPrimaryText}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Google Search Headline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold text-blue-600">{data.adVariant.googleHeadline}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lead" className="space-y-4">
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
              <CardTitle>{data.leadMagnetVariant.title}</CardTitle>
              <CardDescription>{data.leadMagnetVariant.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div>
                <strong>Overview:</strong>
                <p className="text-sm mt-1">{data.leadMagnetVariant.overview}</p>
              </div>
              <div>
                <strong>Benefits:</strong>
                <ul className="space-y-1 mt-2">
                  {data.leadMagnetVariant.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <AppShell title="Niche Variant Engine" subtitle="Adapt content for specific industries">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <PageCard
          title="Niche Configuration"
          subtitle="Generate industry-specific variants"
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
                  No personas found for {product}. Please create a persona first from the Personas page.
                </AlertDescription>
              </Alert>
            ) : (
              <>
            {/* Product Selection */}
            <div className="space-y-2">
              <Label htmlFor="product" className="text-sm font-medium">Product</Label>
              <select
                id="product"
                value={product}
                onChange={(e) => setProduct(e.target.value as Product)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
              >
                <option value="CareerScaleUp">CareerScaleUp</option>
                <option value="Zevaux">Zevaux</option>
              </select>
            </div>

            {/* Niche Selection */}
            <div className="space-y-2">
              <Label htmlFor="niche" className="text-sm font-medium">Target Niche</Label>
              <select
                id="niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
              >
                {getNiches().map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Persona Selection */}
            <div className="space-y-2">
              <Label htmlFor="persona" className="text-sm font-medium">Base Persona</Label>
              <select
                id="persona"
                value={selectedPersonaId}
                onChange={(e) => setSelectedPersonaId(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
              >
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Messaging Pack Selection */}
            {selectedPersonaId && (
              <div className="space-y-2">
                <Label htmlFor="messaging" className="text-sm font-medium">Base Messaging Pack</Label>
                {loadingMessaging ? (
                  <p className="text-sm text-slate-600">Loading messaging packs...</p>
                ) : messagingPacks.length === 0 ? (
                  <Alert>
                    <AlertDescription>No messaging packs for this persona. Generate messaging first.</AlertDescription>
                  </Alert>
                ) : (
                  <select
                    id="messaging"
                    value={selectedMessagingId}
                    onChange={(e) => setSelectedMessagingId(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                  >
                    {messagingPacks.map((m) => (
                      <option key={m.id} value={m.id}>{m.headline}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Custom Angle */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">Custom Angle (optional)</Label>
              <Textarea
                id="notes"
                placeholder="e.g., 'Nurses in Texas tired of resume ATS failures' or 'Dental clinics losing patients to missed calls'"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={3}
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
              disabled={loading || !selectedPersonaId || !selectedMessagingId || loadingPersonas || loadingMessaging}
              className="w-full shadow-md"
              size="lg"
            >
              {loading ? 'Generating Niche Variant Pack...' : '✨ Generate Niche Variant Pack'}
            </Button>
              </>
            )}
          </div>
        </PageCard>

        {/* Output Preview */}
        <div className="space-y-4">
          <PageCard
            title="Niche Variant Output"
            subtitle={output ? `Adapted for: ${niche}` : 'Your niche-specific content'}
          >
            {output ? (
              renderOutput(output)
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No variant generated yet.</p>
                <p className="text-sm mt-2">
                  Select a niche, base persona, and messaging pack, then click &quot;Generate&quot;
                </p>
              </div>
            )}
          </PageCard>
        </div>
      </div>
    </AppShell>
  );
}

