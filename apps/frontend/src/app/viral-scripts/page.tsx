'use client';

import { useState, useEffect } from 'react';
import { generateViralShortFormScript, listPersonas, listViralShortFormScripts } from '@/lib/api';
import type { ViralShortFormScript, Persona, ShortFormPlatform } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function ViralScriptsPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [platform, setPlatform] = useState<ShortFormPlatform>('tiktok');
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<ViralShortFormScript[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const personasData = await listPersonas();
      setPersonas(personasData);
      if (personasData.length > 0) {
        setSelectedPersonaId(personasData[0].id);
        const data = await listViralShortFormScripts(personasData[0].id);
        setScripts(data);
      }
    };
    loadData();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateViralShortFormScript({
        personaId: selectedPersonaId,
        platform,
      });
      setScripts([result, ...scripts]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Viral Scripts" subtitle="Short-form video scripts">
      <PageCard title="Viral Script Generator" subtitle="TikTok, Reels, Shorts">
        <div className="space-y-4">
          <div>
            <Label>Persona</Label>
            <Select value={selectedPersonaId} onValueChange={setSelectedPersonaId}>
              {personas.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Platform</Label>
            <Select value={platform} onValueChange={(val) => setPlatform(val as ShortFormPlatform)}>
              <option value="tiktok">TikTok</option>
              <option value="instagram_reel">Instagram Reel</option>
              <option value="youtube_short">YouTube Short</option>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Script'}
          </Button>
        </div>
        <div className="mt-6 space-y-4">
          {scripts.map((script) => (
            <Card key={script.id}>
              <CardHeader>
                <CardTitle>{script.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{script.hook}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageCard>
    </AppShell>
  );
}

