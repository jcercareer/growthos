'use client';

import { useState, useEffect } from 'react';
import { generateLinkedInViralPack, listPersonas, listLinkedInViralPacks } from '@/lib/api';
import type { LinkedInViralPack, Persona } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function LinkedInViralPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkedInPacks, setLinkedInPacks] = useState<LinkedInViralPack[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const personasData = await listPersonas();
      setPersonas(personasData);
      if (personasData.length > 0) {
        setSelectedPersonaId(personasData[0].id);
        const data = await listLinkedInViralPacks(personasData[0].id);
        setLinkedInPacks(data);
      }
    };
    loadData();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateLinkedInViralPack({ personaId: selectedPersonaId });
      setLinkedInPacks([result, ...linkedInPacks]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="LinkedIn Viral" subtitle="High-engagement LinkedIn content">
      <PageCard title="LinkedIn Viral Pack" subtitle="Carousels, text posts, videos">
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
            {loading ? 'Generating...' : 'Generate LinkedIn Pack'}
          </Button>
        </div>
        <div className="mt-6 space-y-4">
          {linkedInPacks.map((pack) => (
            <Card key={pack.id}>
              <CardHeader>
                <CardTitle>{pack.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{pack.posts.length} posts</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageCard>
    </AppShell>
  );
}

