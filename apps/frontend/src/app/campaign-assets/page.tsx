'use client';

import { useState, useEffect } from 'react';
import {
  generateAdsPack,
  generateSocialProofPackLive,
  generatePricingPackLive,
  listPersonas,
  listMessagingForPersona,
} from '@/lib/api';
import type {
  Persona,
  Messaging,
  Product,
  AudienceType,
  AdsPackResponse,
  SocialProofPackResponse,
  PricingPackResponse,
} from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

type GeneratorType = 'ads' | 'social-proof' | 'pricing';

export default function CampaignAssetsPage() {
  // Form state
  const [product, setProduct] = useState<Product>('CareerScaleUp');
  const [audienceType, setAudienceType] = useState<AudienceType>('jobseeker');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [filteredPersonas, setFilteredPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [messagingPacks, setMessagingPacks] = useState<Messaging[]>([]);
  const [selectedMessagingId, setSelectedMessagingId] = useState('');
  const [campaignAngle, setCampaignAngle] = useState('');
  
  // UI state
  const [activeGenerator, setActiveGenerator] = useState<GeneratorType>('ads');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Output state
  const [adsPackOutput, setAdsPackOutput] = useState<AdsPackResponse | null>(null);
  const [socialProofOutput, setSocialProofOutput] = useState<SocialProofPackResponse | null>(null);
  const [pricingOutput, setPricingOutput] = useState<PricingPackResponse | null>(null);

  // Load personas on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const personasData = await listPersonas();
        setPersonas(personasData);
        filterPersonasByProductAndAudience(personasData, product, audienceType);
      } catch (err) {
        setError('Failed to load personas');
      }
    };
    loadData();
  }, []);

  // Filter personas when product/audience changes
  useEffect(() => {
    filterPersonasByProductAndAudience(personas, product, audienceType);
  }, [product, audienceType, personas]);

  // Load messaging packs when persona changes
  useEffect(() => {
    if (selectedPersonaId) {
      loadMessagingPacks(selectedPersonaId);
    }
  }, [selectedPersonaId]);

  const filterPersonasByProductAndAudience = (
    allPersonas: Persona[],
    prod: Product,
    aud: AudienceType
  ) => {
    const filtered = allPersonas.filter(
      (p) => p.product === prod && p.audience_type === aud
    );
    setFilteredPersonas(filtered);
    
    if (filtered.length > 0 && !selectedPersonaId) {
      setSelectedPersonaId(filtered[0].id);
    }
  };

  const loadMessagingPacks = async (personaId: string) => {
    try {
      const messaging = await listMessagingForPersona(personaId);
      setMessagingPacks(messaging);
      if (messaging.length > 0) {
        setSelectedMessagingId(messaging[0].id);
      }
    } catch (err) {
      console.error('Failed to load messaging packs:', err);
    }
  };

  const getAudienceOptions = () => {
    if (product === 'CareerScaleUp') {
      return [
        { value: 'jobseeker', label: 'Job Seeker' },
        { value: 'recruiter', label: 'Recruiter' },
      ];
    }
    return [{ value: 'smb_owner', label: 'SMB Owner' }];
  };

  const handleGenerate = async () => {
    if (!selectedPersonaId || !selectedMessagingId) {
      setError('Please select both persona and messaging pack');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const input = {
        product,
        audience: audienceType,
        personaId: selectedPersonaId,
        messagingId: selectedMessagingId,
        campaignAngle: campaignAngle || undefined,
      };

      if (activeGenerator === 'ads') {
        const result = await generateAdsPack(input);
        setAdsPackOutput(result);
      } else if (activeGenerator === 'social-proof') {
        const result = await generateSocialProofPackLive(input);
        setSocialProofOutput(result);
      } else if (activeGenerator === 'pricing') {
        const result = await generatePricingPackLive(input);
        setPricingOutput(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate campaign asset');
    } finally {
      setLoading(false);
    }
  };

  const renderAdsPackOutput = (output: AdsPackResponse) => {
    return (
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Campaign Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Product:</strong> {output.meta.product}</p>
            <p><strong>Audience:</strong> {output.meta.audience}</p>
            {output.meta.campaignAngle && (
              <p><strong>Angle:</strong> {output.meta.campaignAngle}</p>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="tiktok" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="retargeting">Retargeting</TabsTrigger>
          </TabsList>

          <TabsContent value="tiktok" className="space-y-4">
            {output.tiktokAds.map((ad, idx) => (
              <Card key={idx} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">TikTok Ad {idx + 1}</CardTitle>
                  <Badge>{ad.durationSeconds}s</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Hook:</strong>
                    <p className="mt-1 text-sm">{ad.hook}</p>
                  </div>
                  <div>
                    <strong>Script:</strong>
                    <pre className="mt-1 text-sm whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-3 rounded">
                      {ad.script}
                    </pre>
                  </div>
                  <div>
                    <strong>Caption:</strong>
                    <p className="mt-1 text-sm">{ad.caption}</p>
                  </div>
                  <div>
                    <strong>Hashtags:</strong>
                    <p className="mt-1 text-sm">{ad.hashtags.join(' ')}</p>
                  </div>
                  <div>
                    <strong>CTA:</strong>
                    <p className="mt-1 text-sm font-semibold">{ad.cta}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="instagram" className="space-y-4">
            {output.instagramReelsAds.map((ad, idx) => (
              <Card key={idx} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Instagram Reel Ad {idx + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Headline:</strong>
                    <p className="mt-1 text-sm font-semibold">{ad.headline}</p>
                  </div>
                  <div>
                    <strong>Primary Text:</strong>
                    <p className="mt-1 text-sm">{ad.primaryText}</p>
                  </div>
                  <div>
                    <strong>Script:</strong>
                    <pre className="mt-1 text-sm whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-3 rounded">
                      {ad.script}
                    </pre>
                  </div>
                  <div>
                    <strong>Caption:</strong>
                    <p className="mt-1 text-sm">{ad.caption}</p>
                  </div>
                  <div>
                    <strong>Hashtags:</strong>
                    <p className="mt-1 text-sm">{ad.hashtags.join(' ')}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="facebook" className="space-y-4">
            {output.facebookAds.map((ad, idx) => (
              <Card key={idx} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{ad.headline}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Primary Text:</strong>
                    <p className="mt-1 text-sm">{ad.primaryText}</p>
                  </div>
                  <div>
                    <strong>Description:</strong>
                    <p className="mt-1 text-sm">{ad.description}</p>
                  </div>
                  <Button size="sm">{ad.cta}</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="google" className="space-y-4">
            {output.googleSearchAds.map((ad, idx) => (
              <Card key={idx} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm">Google Search Ad {idx + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded">
                    <p className="text-blue-600 font-semibold">{ad.headline1}</p>
                    <p className="text-blue-600">{ad.headline2}</p>
                    {ad.headline3 && <p className="text-blue-600">{ad.headline3}</p>}
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      {ad.description1}
                    </p>
                    {ad.description2 && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {ad.description2}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="linkedin" className="space-y-4">
            {output.linkedinAds.map((ad, idx) => (
              <Card key={idx} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{ad.headline}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Intro:</strong>
                    <p className="mt-1 text-sm">{ad.intro}</p>
                  </div>
                  <div>
                    <strong>Body:</strong>
                    <p className="mt-1 text-sm whitespace-pre-wrap">{ad.body}</p>
                  </div>
                  <Button size="sm">{ad.cta}</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="retargeting" className="space-y-4">
            {output.retargetingSnippets.map((snippet, idx) => (
              <Card key={idx} className="shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Retargeting {idx + 1}</CardTitle>
                    <Badge>{snippet.platform}</Badge>
                  </div>
                  <CardDescription>{snippet.angle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{snippet.copy}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const renderSocialProofOutput = (output: SocialProofPackResponse) => {
    return (
      <div className="space-y-6">
        {/* Testimonials */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>{output.testimonialCards.length} customer testimonials</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {output.testimonialCards.map((testimonial, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                <p className="text-sm italic mb-3">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold">{testimonial.displayName}</p>
                    <p className="text-slate-500">{testimonial.roleOrLabel}</p>
                  </div>
                  {testimonial.styleTag && (
                    <Badge variant="outline" className="text-xs">{testimonial.styleTag}</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Case Studies */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Case Studies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {output.miniCaseStudies.map((study, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-lg mb-2">{study.title}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Before:</strong>
                    <p className="text-slate-600 dark:text-slate-400">{study.scenario}</p>
                  </div>
                  <div>
                    <strong>How We Helped:</strong>
                    <p className="text-slate-600 dark:text-slate-400">{study.intervention}</p>
                  </div>
                  <div>
                    <strong>After:</strong>
                    <p className="text-slate-600 dark:text-slate-400">{study.outcome}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded italic">
                    &quot;{study.pullQuote}&quot;
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Proof Bullets */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Trust Builders</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {output.proofBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-sm">{bullet}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Founder Note */}
        <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardHeader>
            <CardTitle>{output.founderNote.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{output.founderNote.body}</p>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Trust Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {output.trustBadges.map((badge, idx) => (
                <Badge key={idx} variant="secondary">{badge}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPricingOutput = (output: PricingPackResponse) => {
    return (
      <div className="space-y-6">
        {/* Hero */}
        <Card className="shadow-md bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardContent className="pt-6 text-center">
            <h2 className="text-3xl font-bold mb-2">{output.hero.title}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">{output.hero.subtitle}</p>
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {output.plans.map((plan, idx) => (
            <Card
              key={idx}
              className={`shadow-md ${
                plan.highlight
                  ? 'border-2 border-blue-500 shadow-lg'
                  : ''
              }`}
            >
              <CardHeader>
                {plan.highlight && (
                  <Badge className="w-fit mb-2">Recommended</Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.tagline}</CardDescription>
                <p className="text-2xl font-bold mt-2">{plan.pricePlaceholder}</p>
                {plan.billingNotes && (
                  <p className="text-xs text-slate-500">{plan.billingNotes}</p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {plan.idealFor}
                </p>
                <ul className="space-y-1">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="text-sm flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Feature</th>
                    {output.comparisonTable.rows[0]?.jobSeekerValue !== undefined && (
                      <th className="text-center p-2">Job Seeker</th>
                    )}
                    {output.comparisonTable.rows[0]?.recruiterValue !== undefined && (
                      <th className="text-center p-2">Recruiter</th>
                    )}
                    {output.comparisonTable.rows[0]?.smbValue !== undefined && (
                      <th className="text-center p-2">SMB</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {output.comparisonTable.rows.map((row, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{row.label}</td>
                      {row.jobSeekerValue !== undefined && (
                        <td className="text-center p-2">{row.jobSeekerValue}</td>
                      )}
                      {row.recruiterValue !== undefined && (
                        <td className="text-center p-2">{row.recruiterValue}</td>
                      )}
                      {row.smbValue !== undefined && (
                        <td className="text-center p-2">{row.smbValue}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {output.faq.map((item, idx) => (
              <div key={idx}>
                <h4 className="font-semibold text-sm mb-1">{item.question}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Guarantee */}
        <Card className="shadow-lg bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle>{output.guaranteeSection.headline}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{output.guaranteeSection.body}</p>
          </CardContent>
        </Card>

        {/* Who This Is For / Not For */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Who This Is For</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {output.whoThisIsFor.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Who This Is NOT For</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {output.whoThisIsNotFor.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <AppShell title="Campaign Assets" subtitle="Generate ads, social proof, and pricing pages">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <PageCard
          title="Campaign Configuration"
          subtitle="Generate comprehensive campaign assets"
          badgeLabel="AI Powered"
        >
          <div className="space-y-4">
            {/* Generator Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">What do you want to generate?</Label>
              <Tabs value={activeGenerator} onValueChange={(val) => setActiveGenerator(val as GeneratorType)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ads">Ads Pack</TabsTrigger>
                  <TabsTrigger value="social-proof">Social Proof</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Product Selection */}
            <div className="space-y-2">
              <Label htmlFor="product" className="text-sm font-medium">Product</Label>
              <select
                id="product"
                value={product}
                onChange={(e) => {
                  setProduct(e.target.value as Product);
                  setSelectedPersonaId('');
                  setMessagingPacks([]);
                }}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
              >
                <option value="CareerScaleUp">CareerScaleUp</option>
                <option value="Zevaux">Zevaux</option>
              </select>
            </div>

            {/* Audience Selection */}
            <div className="space-y-2">
              <Label htmlFor="audience" className="text-sm font-medium">Audience</Label>
              <select
                id="audience"
                value={audienceType}
                onChange={(e) => {
                  setAudienceType(e.target.value as AudienceType);
                  setSelectedPersonaId('');
                  setMessagingPacks([]);
                }}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
              >
                {getAudienceOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Persona Selection */}
            <div className="space-y-2">
              <Label htmlFor="persona" className="text-sm font-medium">Persona</Label>
              {filteredPersonas.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No personas found for {product} - {audienceType}. Create one first.
                  </AlertDescription>
                </Alert>
              ) : (
                <select
                  id="persona"
                  value={selectedPersonaId}
                  onChange={(e) => setSelectedPersonaId(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                >
                  {filteredPersonas.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Messaging Pack Selection */}
            {selectedPersonaId && (
              <div className="space-y-2">
                <Label htmlFor="messaging" className="text-sm font-medium">Messaging Pack</Label>
                {messagingPacks.length === 0 ? (
                  <p className="text-xs text-slate-500">No messaging packs for this persona</p>
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

            {/* Campaign Angle */}
            <div className="space-y-2">
              <Label htmlFor="angle" className="text-sm font-medium">Campaign Angle (optional)</Label>
              <Textarea
                id="angle"
                placeholder="e.g., Focus on remote workers, emphasize speed, highlight cost savings..."
                value={campaignAngle}
                onChange={(e) => setCampaignAngle(e.target.value)}
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
              disabled={loading || !selectedPersonaId || !selectedMessagingId}
              className="w-full shadow-md"
              size="lg"
            >
              {loading
                ? 'Generating...'
                : `✨ Generate ${activeGenerator === 'ads' ? 'Ads Pack' : activeGenerator === 'social-proof' ? 'Social Proof' : 'Pricing Page'}`}
            </Button>
          </div>
        </PageCard>

        {/* Output Preview */}
        <div className="space-y-4">
          <PageCard title="Generated Output" subtitle="Your campaign assets">
            {activeGenerator === 'ads' && adsPackOutput ? (
              renderAdsPackOutput(adsPackOutput)
            ) : activeGenerator === 'social-proof' && socialProofOutput ? (
              renderSocialProofOutput(socialProofOutput)
            ) : activeGenerator === 'pricing' && pricingOutput ? (
              renderPricingOutput(pricingOutput)
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No output generated yet.</p>
                <p className="text-sm mt-2">
                  Select a generator type, fill out the form, and click "Generate"
                </p>
              </div>
            )}
          </PageCard>
        </div>
      </div>
    </AppShell>
  );
}

