'use client';

import { useState, useEffect } from 'react';
import { generateSocialPack, listPersonas, listSocialPacks } from '@/lib/api';
import type { SocialPack, Persona } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function SocialPacksPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialPacks, setSocialPacks] = useState<SocialPack[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const personasData = await listPersonas();
      setPersonas(personasData);
      if (personasData.length > 0) {
        setSelectedPersonaId(personasData[0].id);
        const data = await listSocialPacks(personasData[0].id);
        setSocialPacks(data);
      }
    };
    loadData();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateSocialPack({ personaId: selectedPersonaId });
      setSocialPacks([result, ...socialPacks]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Social Packs" subtitle="Multi-platform social content">
      <PageCard title="Social Pack Generator" subtitle="LinkedIn, TikTok, Instagram, and more">
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
            {loading ? 'Generating...' : 'Generate Social Pack'}
          </Button>
        </div>
        <div className="mt-6 space-y-4">
          {socialPacks.map((pack) => (
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

