'use client';

import { useState, useEffect } from 'react';
import { generatePricingPagePack, listPricingPagePacks } from '@/lib/api';
import type { PricingPagePack, Product } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function PricingPagesPage() {
  const [product, setProduct] = useState<Product>('CareerScaleUp');
  const [loading, setLoading] = useState(false);
  const [pricingPages, setPricingPages] = useState<PricingPagePack[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await listPricingPagePacks(product);
      setPricingPages(data);
    };
    loadData();
  }, [product]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generatePricingPagePack({ product });
      setPricingPages([result, ...pricingPages]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Pricing Pages" subtitle="Generate pricing page content">
      <PageCard title="Pricing Page Generator" subtitle="Tiers, FAQ, and guarantees">
        <div className="space-y-4">
          <div>
            <Label>Product</Label>
            <Select value={product} onValueChange={(val) => setProduct(val as Product)}>
              <option value="CareerScaleUp">CareerScaleUp</option>
              <option value="Zevaux">Zevaux</option>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Pricing Page'}
          </Button>
        </div>
        <div className="mt-6 space-y-4">
          {pricingPages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <CardTitle>{page.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{page.headline}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageCard>
    </AppShell>
  );
}

