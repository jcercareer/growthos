'use client';

import { useState, useEffect } from 'react';
import { generatePaidAdsPack, listPersonas, listPaidAdsPacks } from '@/lib/api';
import type { PaidAdsPack, Persona } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function PaidAdsPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [adsPacks, setAdsPacks] = useState<PaidAdsPack[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const personasData = await listPersonas();
      setPersonas(personasData);
      if (personasData.length > 0) {
        setSelectedPersonaId(personasData[0].id);
        const data = await listPaidAdsPacks(personasData[0].id);
        setAdsPacks(data);
      }
    };
    loadData();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generatePaidAdsPack({ personaId: selectedPersonaId });
      setAdsPacks([result, ...adsPacks]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Paid Ads" subtitle="Cross-platform ad campaigns">
      <PageCard title="Paid Ads Generator" subtitle="TikTok, Google, LinkedIn, and more">
        <div className="space-y-4">
          <div>
            <Label>Persona</Label>
            <Select value={selectedPersonaId} onValueChange={setSelectedPersonaId}>
              {personas.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Ads Pack'}
          </Button>
        </div>
        <div className="mt-6 space-y-4">
          {adsPacks.map((pack) => (
            <Card key={pack.id}>
              <CardHeader>
                <CardTitle>{pack.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{pack.ads.length} ads</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageCard>
    </AppShell>
  );
}

