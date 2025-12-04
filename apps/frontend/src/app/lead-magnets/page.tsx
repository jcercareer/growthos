'use client';

import { useState, useEffect } from 'react';
import { generateLeadMagnet, listPersonas, listMessagingForPersona, listLeadMagnets } from '@/lib/api';
import type { LeadMagnet, Persona, Messaging, LeadMagnetType, Product, AudienceType } from '@growth-os/shared';
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

export default function LeadMagnetsPage() {
  // Form state
  const [product, setProduct] = useState<Product>('CareerScaleUp');
  const [audienceType, setAudienceType] = useState<AudienceType>('jobseeker');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [filteredPersonas, setFilteredPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [messagingPacks, setMessagingPacks] = useState<Messaging[]>([]);
  const [selectedMessagingId, setSelectedMessagingId] = useState('');
  const [leadMagnetName, setLeadMagnetName] = useState('');
  const [leadMagnetType, setLeadMagnetType] = useState<LeadMagnetType>('pdf_guide');
  const [customNotes, setCustomNotes] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>([]);
  const [selectedLeadMagnet, setSelectedLeadMagnet] = useState<LeadMagnet | null>(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter personas when product/audience changes
  useEffect(() => {
    filterPersonasByProductAndAudience(personas, product, audienceType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, audienceType, personas]);

  // Load messaging packs when persona changes
  useEffect(() => {
    if (selectedPersonaId) {
      loadMessagingPacks(selectedPersonaId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    
    // Auto-select first persona if available
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
    if (!selectedPersonaId) {
      setError('Please select a persona');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateLeadMagnet({
        personaId: selectedPersonaId,
        messagingId: selectedMessagingId || undefined,
        leadMagnetType,
        customNotes: customNotes || undefined,
      });
      setLeadMagnets([result, ...leadMagnets]);
      setSelectedLeadMagnet(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate lead magnet pack');
    } finally {
      setLoading(false);
    }
  };

  const renderLeadMagnetContent = (lm: LeadMagnet) => {
    const content = lm.content as any;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <div className="space-y-2">
              <Badge className="w-fit">{lm.lead_magnet_type.replace('_', ' ').toUpperCase()}</Badge>
              <CardTitle className="text-2xl">{lm.title}</CardTitle>
              <CardDescription className="text-base">{lm.subtitle}</CardDescription>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                {content.overview}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Outline/Sections */}
        {content.pages && content.pages.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Content Outline</CardTitle>
              <CardDescription>Page-by-page breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.pages.map((page: any, idx: number) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    Page {page.page_number}: {page.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {page.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        {content.benefits && content.benefits.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Key Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {content.benefits.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-semibold mb-4">{content.cta_copy}</p>
            <Button size="lg" variant="secondary">
              Download {lm.lead_magnet_type.replace('_', ' ')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderEmailScripts = (lm: LeadMagnet) => {
    if (!lm.email_scripts || lm.email_scripts.length === 0) {
      return <p className="text-slate-500">No email scripts generated.</p>;
    }

    return (
      <div className="space-y-4">
        {lm.email_scripts.map((email: any, idx: number) => (
          <Card key={idx} className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Email {idx + 1}</CardTitle>
                <Badge>Day {idx === 0 ? 0 : idx * 2}</Badge>
              </div>
              <CardDescription>
                <strong>Subject:</strong> {email.subject}
              </CardDescription>
              <p className="text-xs text-slate-500 mt-1">
                Preview: {email.preview_text}
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {email.body}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderSocialScripts = (lm: LeadMagnet) => {
    if (!lm.social_posting_scripts || lm.social_posting_scripts.length === 0) {
      return <p className="text-slate-500">No social posting scripts generated.</p>;
    }

    return (
      <div className="space-y-4">
        {lm.social_posting_scripts.map((script: string, idx: number) => (
          <Card key={idx} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-sm">Social Post {idx + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{script}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const selectedPersona = filteredPersonas.find(p => p.id === selectedPersonaId);
  const selectedMessaging = messagingPacks.find(m => m.id === selectedMessagingId);
  const hasSmsSupport = product === 'Zevaux' && audienceType === 'smb_owner';

  return (
    <AppShell title="Lead Magnet Generator" subtitle="Create valuable lead magnets with email/SMS sequences">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <PageCard
          title="Lead Magnet Configuration"
          subtitle="Generate downloadable assets with follow-up sequences"
          badgeLabel="AI Powered"
        >
          <div className="space-y-4">
            {/* Product Selection */}
            <div className="space-y-2">
              <Label htmlFor="product" className="text-sm font-medium">
                Product
              </Label>
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
              <Label htmlFor="audience" className="text-sm font-medium">
                Audience
              </Label>
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
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Persona Selection */}
            <div className="space-y-2">
              <Label htmlFor="persona" className="text-sm font-medium">
                Persona
              </Label>
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
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Messaging Pack Selection */}
            {selectedPersonaId && (
              <div className="space-y-2">
                <Label htmlFor="messaging" className="text-sm font-medium">
                  Messaging Pack (optional)
                </Label>
                {messagingPacks.length === 0 ? (
                  <p className="text-xs text-slate-500">No messaging packs for this persona</p>
                ) : (
                  <select
                    id="messaging"
                    value={selectedMessagingId}
                    onChange={(e) => setSelectedMessagingId(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                  >
                    <option value="">-- None --</option>
                    {messagingPacks.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.headline}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Lead Magnet Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Lead Magnet Type
              </Label>
              <select
                id="type"
                value={leadMagnetType}
                onChange={(e) => setLeadMagnetType(e.target.value as LeadMagnetType)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
              >
                <option value="pdf_guide">PDF Guide</option>
                <option value="checklist">Checklist</option>
                <option value="template">Template</option>
                <option value="ebook">eBook</option>
                <option value="cheatsheet">Cheatsheet</option>
                <option value="swipe_file">Swipe File</option>
              </select>
            </div>

            {/* Lead Magnet Name (optional) */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Lead Magnet Name (optional)
              </Label>
              <Input
                id="name"
                placeholder="e.g., ATS Resume Fix Report, Missed Calls Loss Report"
                value={leadMagnetName}
                onChange={(e) => setLeadMagnetName(e.target.value)}
              />
            </div>

            {/* Custom Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Custom Notes (optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Any special angle, niche (e.g., nurses, IT workers, dentists), or specific pain points to address..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={4}
              />
            </div>

            {/* SMS Notice */}
            {hasSmsSupport && (
              <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                <AlertDescription className="text-sm">
                  📱 <strong>SMS sequences included:</strong> Zevaux SMB leads will receive follow-up text messages.
                </AlertDescription>
              </Alert>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !selectedPersonaId}
              className="w-full shadow-md"
              size="lg"
            >
              {loading ? 'Generating Lead Magnet Pack...' : '✨ Generate Lead Magnet Pack'}
            </Button>
          </div>
        </PageCard>

        {/* Output Preview */}
        <div className="space-y-4">
          <PageCard
            title="Generated Output"
            subtitle="Lead magnet content + email/SMS sequences"
          >
            {selectedLeadMagnet ? (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Lead Magnet</TabsTrigger>
                  <TabsTrigger value="email">Email Sequence</TabsTrigger>
                  <TabsTrigger value="social">Social Posts</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4">
                  {renderLeadMagnetContent(selectedLeadMagnet)}
                </TabsContent>
                <TabsContent value="email" className="space-y-4">
                  {renderEmailScripts(selectedLeadMagnet)}
                </TabsContent>
                <TabsContent value="social" className="space-y-4">
                  {renderSocialScripts(selectedLeadMagnet)}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No lead magnet generated yet.</p>
                <p className="text-sm mt-2">Fill out the form and click &quot;Generate Lead Magnet Pack&quot;</p>
              </div>
            )}
          </PageCard>
        </div>
      </div>
    </AppShell>
  );
}

