'use client';

import { useState, useEffect } from 'react';
import { generateSocialProofPack, listSocialProofPacks } from '@/lib/api';
import type { SocialProofPack, Product } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function SocialProofPage() {
  const [product, setProduct] = useState<Product>('CareerScaleUp');
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socialProofPacks, setSocialProofPacks] = useState<SocialProofPack[]>([]);
  const [selectedPack, setSelectedPack] = useState<SocialProofPack | null>(null);

  useEffect(() => {
    const loadPacks = async () => {
      setLoadingPacks(true);
      try {
        const data = await listSocialProofPacks(product);
        setSocialProofPacks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load social proof packs');
        console.error('Error loading social proof packs:', err);
      } finally {
        setLoadingPacks(false);
      }
    };
    loadPacks();
  }, [product]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateSocialProofPack({
        product,
        customNotes: customNotes || undefined,
      });
      setSocialProofPacks([result, ...socialProofPacks]);
      setSelectedPack(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate social proof');
      console.error('Error generating social proof:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderSocialProofContent = (pack: SocialProofPack) => {
    return (
      <div className="space-y-6">
        {/* Testimonials */}
        {pack.testimonials && pack.testimonials.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Customer Testimonials</CardTitle>
              <CardDescription>{pack.testimonials.length} testimonials generated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pack.testimonials.map((testimonial: any, idx: number) => (
                <Card key={idx} className="bg-slate-50 dark:bg-slate-900">
                  <CardContent className="pt-4">
                    <p className="text-sm italic text-slate-700 dark:text-slate-300 mb-3">
                      &quot;{testimonial.quote || testimonial.text}&quot;
                    </p>
                    <div className="flex items-center gap-2">
                      {testimonial.name && (
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          - {testimonial.name}
                        </p>
                      )}
                      {testimonial.role && (
                        <Badge variant="outline" className="text-xs">
                          {testimonial.role}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Case Studies */}
        {pack.case_studies && pack.case_studies.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Case Studies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pack.case_studies.map((study: any, idx: number) => (
                <Card key={idx} className="border-l-4 border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-base">{study.title || `Case Study ${idx + 1}`}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {study.problem && (
                      <div>
                        <p className="text-xs font-medium text-slate-500">Problem:</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{study.problem}</p>
                      </div>
                    )}
                    {study.solution && (
                      <div>
                        <p className="text-xs font-medium text-slate-500">Solution:</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{study.solution}</p>
                      </div>
                    )}
                    {study.results && (
                      <div>
                        <p className="text-xs font-medium text-slate-500">Results:</p>
                        <p className="text-sm font-semibold text-green-600">{study.results}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Metrics */}
        {pack.metrics && pack.metrics.length > 0 && (
          <Card className="shadow-md bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pack.metrics.map((metric: any, idx: number) => (
                  <div key={idx} className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">{metric.value || metric}</p>
                    {metric.label && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{metric.label}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <AppShell title="Social Proof Generator" subtitle="Build trust with testimonials, case studies, and metrics">
      <div className="grid lg:grid-cols-2 gap-6">
        <PageCard
          title="Social Proof Configuration"
          subtitle="Generate credibility-building content"
          badgeLabel="AI Powered"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product" className="text-sm font-medium">
                Product
              </Label>
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

            <div className="space-y-2">
              <Label htmlFor="customNotes" className="text-sm font-medium">
                Custom Notes (optional)
              </Label>
              <Textarea
                id="customNotes"
                placeholder="Add specific results, industries, or testimonial types you want to highlight..."
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
              disabled={loading}
              className="w-full shadow-md"
              size="lg"
            >
              {loading ? 'Generating Social Proof...' : '✨ Generate Social Proof Pack'}
            </Button>
          </div>
        </PageCard>

        <div className="space-y-4">
          <PageCard
            title="Generated Social Proof"
            subtitle="Testimonials, case studies & metrics"
          >
            {loadingPacks ? (
              <Alert>
                <AlertDescription>Loading social proof packs...</AlertDescription>
              </Alert>
            ) : selectedPack ? (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4">
                  {renderSocialProofContent(selectedPack)}
                </TabsContent>
                <TabsContent value="history" className="space-y-3">
                  {socialProofPacks.map((pack) => (
                    <Card
                      key={pack.id}
                      className="cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedPack(pack)}
                    >
                      <CardHeader>
                        <CardTitle className="text-sm">{pack.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {pack.testimonials?.length || 0} testimonials
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No social proof generated yet.</p>
                <p className="text-sm mt-2">Fill out the form and click &quot;Generate Social Proof Pack&quot;</p>
              </div>
            )}
          </PageCard>
        </div>
      </div>
    </AppShell>
  );
}
