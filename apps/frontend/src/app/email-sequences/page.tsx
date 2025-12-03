'use client';

import { useState, useEffect } from 'react';
import { generateEmailSmsSequence, listPersonas, listEmailSmsSequences } from '@/lib/api';
import type { EmailSmsSequence, Persona, SequenceType } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function EmailSequencesPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [sequenceType, setSequenceType] = useState<SequenceType>('welcome');
  const [loading, setLoading] = useState(false);
  const [sequences, setSequences] = useState<EmailSmsSequence[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const personasData = await listPersonas();
      setPersonas(personasData);
      if (personasData.length > 0) {
        setSelectedPersonaId(personasData[0].id);
        const data = await listEmailSmsSequences(personasData[0].id);
        setSequences(data);
      }
    };
    loadData();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateEmailSmsSequence({
        personaId: selectedPersonaId,
        sequenceType,
      });
      setSequences([result, ...sequences]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Email & SMS Sequences" subtitle="Automated drip campaigns">
      <PageCard title="Sequence Builder" subtitle="Create nurture sequences">
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
            <Label>Sequence Type</Label>
            <Select value={sequenceType} onValueChange={(val) => setSequenceType(val as SequenceType)}>
              <option value="welcome">Welcome</option>
              <option value="nurture">Nurture</option>
              <option value="cart_abandonment">Cart Abandonment</option>
              <option value="re_engagement">Re-engagement</option>
              <option value="product_launch">Product Launch</option>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Sequence'}
          </Button>
        </div>
        <div className="mt-6 space-y-4">
          {sequences.map((seq) => (
            <Card key={seq.id}>
              <CardHeader>
                <CardTitle>{seq.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{seq.emails.length} emails</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageCard>
    </AppShell>
  );
}

