'use client';

import { useState, useEffect } from 'react';
import { generatePricingPagePack, listPricingPagePacks } from '@/lib/api';
import type { PricingPagePack, Product } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function PricingPagesPage() {
  const [product, setProduct] = useState<Product>('CareerScaleUp');
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pricingPages, setPricingPages] = useState<PricingPagePack[]>([]);
  const [selectedPage, setSelectedPage] = useState<PricingPagePack | null>(null);

  useEffect(() => {
    const loadPacks = async () => {
      setLoadingPacks(true);
      try {
        const data = await listPricingPagePacks(product);
        setPricingPages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pricing pages');
        console.error('Error loading pricing pages:', err);
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
      const result = await generatePricingPagePack({
        product,
        customNotes: customNotes || undefined,
      });
      setPricingPages([result, ...pricingPages]);
      setSelectedPage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate pricing page');
      console.error('Error generating pricing page:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderPricingContent = (page: PricingPagePack) => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
            <CardTitle className="text-2xl">{page.headline}</CardTitle>
            <CardDescription className="text-base">{page.subheadline}</CardDescription>
          </CardHeader>
        </Card>

        {/* Pricing Tiers */}
        {page.tiers && page.tiers.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4">
            {page.tiers.map((tier, idx) => (
              <Card key={idx} className={`shadow-md ${tier.highlighted ? 'border-2 border-blue-500' : ''}`}>
                <CardHeader>
                  {tier.highlighted && <Badge className="w-fit mb-2">Most Popular</Badge>}
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">{tier.price}</div>
                  <CardDescription>{tier.billing_period}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.features && tier.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start text-sm">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4">{tier.cta_text || `Choose ${tier.name}`}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* FAQ */}
        {page.faq && page.faq.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {page.faq.map((item, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{item.question}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Guarantee */}
        {page.guarantee_section && (
          <Alert className="bg-green-50 dark:bg-green-950 border-green-200">
            <AlertDescription>
              <h3 className="font-bold text-green-900 dark:text-green-100 mb-1">{page.guarantee_section.headline || 'Our Guarantee'}</h3>
              <p className="text-green-800 dark:text-green-200">{page.guarantee_section.body}</p>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <AppShell title="Pricing Page Generator" subtitle="Create compelling pricing pages with tiers, FAQ, and guarantees">
      <div className="grid lg:grid-cols-2 gap-6">
        <PageCard
          title="Pricing Configuration"
          subtitle="Generate product-level pricing content"
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
                placeholder="Add specific pricing strategy, discounts, or unique selling points..."
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
              {loading ? 'Generating Pricing Page...' : '✨ Generate Pricing Page'}
            </Button>
          </div>
        </PageCard>

        <div className="space-y-4">
          <PageCard
            title="Generated Pricing Pages"
            subtitle="View your pricing page content"
          >
            {loadingPacks ? (
              <Alert>
                <AlertDescription>Loading pricing pages...</AlertDescription>
              </Alert>
            ) : selectedPage ? (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4">
                  {renderPricingContent(selectedPage)}
                </TabsContent>
                <TabsContent value="history" className="space-y-3">
                  {pricingPages.map((page) => (
                    <Card
                      key={page.id}
                      className="cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedPage(page)}
                    >
                      <CardHeader>
                        <CardTitle className="text-sm">{page.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {page.headline}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No pricing page generated yet.</p>
                <p className="text-sm mt-2">Fill out the form and click &quot;Generate Pricing Page&quot;</p>
              </div>
            )}
          </PageCard>
        </div>
      </div>
    </AppShell>
  );
}
