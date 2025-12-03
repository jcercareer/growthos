'use client';

import { useState, useEffect } from 'react';
import { generateSocialProofPack, listSocialProofPacks } from '@/lib/api';
import type { SocialProofPack, Product } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function SocialProofPage() {
  const [product, setProduct] = useState<Product>('CareerScaleUp');
  const [loading, setLoading] = useState(false);
  const [socialProofPacks, setSocialProofPacks] = useState<SocialProofPack[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await listSocialProofPacks(product);
      setSocialProofPacks(data);
    };
    loadData();
  }, [product]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateSocialProofPack({ product });
      setSocialProofPacks([result, ...socialProofPacks]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Social Proof" subtitle="Testimonials, case studies, metrics">
      <PageCard title="Social Proof Generator" subtitle="Build trust and credibility">
        <div className="space-y-4">
          <div>
            <Label>Product</Label>
            <Select value={product} onValueChange={(val) => setProduct(val as Product)}>
              <option value="CareerScaleUp">CareerScaleUp</option>
              <option value="Zevaux">Zevaux</option>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Social Proof'}
          </Button>
        </div>
        <div className="mt-6 space-y-4">
          {socialProofPacks.map((pack) => (
            <Card key={pack.id}>
              <CardHeader>
                <CardTitle>{pack.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{pack.testimonials.length} testimonials</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageCard>
    </AppShell>
  );
}

