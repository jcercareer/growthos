'use client';

import { useState, useEffect } from 'react';
import { generateEmailSmsSequence, listPersonas, listEmailSmsSequences, listMessagingForPersona } from '@/lib/api';
import type { EmailSmsSequence, Persona, SequenceType, Messaging } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function EmailSequencesPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [messaging, setMessaging] = useState<Messaging[]>([]);
  const [selectedMessagingId, setSelectedMessagingId] = useState('');
  const [sequenceType, setSequenceType] = useState<SequenceType>('welcome');
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [loadingMessaging, setLoadingMessaging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sequences, setSequences] = useState<EmailSmsSequence[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<EmailSmsSequence | null>(null);

  // Load personas on mount
  useEffect(() => {
    const loadPersonas = async () => {
      try {
        const data = await listPersonas();
        setPersonas(data);
        if (data.length > 0) {
          setSelectedPersonaId(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load personas');
        console.error('Error loading personas:', err);
      } finally {
        setLoadingPersonas(false);
      }
    };
    loadPersonas();
  }, []);

  // Load messaging when persona changes
  useEffect(() => {
    if (!selectedPersonaId) return;

    const loadMessaging = async () => {
      setLoadingMessaging(true);
      try {
        const data = await listMessagingForPersona(selectedPersonaId);
        setMessaging(data);
        if (data.length > 0) {
          setSelectedMessagingId(data[0].id);
        } else {
          setSelectedMessagingId('');
        }
        // Load sequences for this persona
        const sequencesData = await listEmailSmsSequences(selectedPersonaId);
        setSequences(sequencesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load messaging');
        console.error('Error loading messaging:', err);
      } finally {
        setLoadingMessaging(false);
      }
    };
    loadMessaging();
  }, [selectedPersonaId]);

  const handleGenerate = async () => {
    if (!selectedPersonaId) {
      setError('Please select a persona');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateEmailSmsSequence({
        personaId: selectedPersonaId,
        messagingId: selectedMessagingId || undefined,
        sequenceType,
        customNotes: customNotes || undefined,
      });
      setSequences([result, ...sequences]);
      setSelectedSequence(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate sequence');
      console.error('Error generating sequence:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderEmailContent = (seq: EmailSmsSequence) => {
    if (!seq.emails || seq.emails.length === 0) {
      return <p className="text-slate-500">No emails in this sequence.</p>;
    }

    return (
      <div className="space-y-4">
        {seq.emails.map((email: any, idx: number) => (
          <Card key={idx} className="shadow-md">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Email {idx + 1}</CardTitle>
                <Badge>Day {email.day || idx}</Badge>
              </div>
              <CardDescription>
                <strong>Subject:</strong> {email.subject}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {email.preview_text && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Preview Text:</p>
                    <p className="text-sm text-slate-600">{email.preview_text}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Email Body:</p>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                    <pre className="text-sm whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200">
                      {email.body}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderSmsContent = (seq: EmailSmsSequence) => {
    if (!seq.sms_messages || seq.sms_messages.length === 0) {
      return <p className="text-slate-500">No SMS messages in this sequence.</p>;
    }

    return (
      <div className="space-y-4">
        {seq.sms_messages.map((sms: any, idx: number) => (
          <Card key={idx} className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">SMS {idx + 1}</CardTitle>
                <Badge variant="outline">Day {sms.day || idx}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200">
                <p className="text-sm">{sms.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AppShell title="Email & SMS Sequences" subtitle="Create automated nurture sequences that convert">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <PageCard
          title="Sequence Configuration"
          subtitle="Generate multi-step email/SMS campaigns"
          badgeLabel="AI Powered"
        >
          <div className="space-y-4">
            {loadingPersonas ? (
              <Alert>
                <AlertDescription>Loading personas...</AlertDescription>
              </Alert>
            ) : personas.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No personas found. Please create a persona first from the Personas page.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Persona Selection */}
                <div className="space-y-2">
                  <Label htmlFor="persona" className="text-sm font-medium">
                    Select Persona
                  </Label>
                  <select
                    id="persona"
                    value={selectedPersonaId}
                    onChange={(e) => setSelectedPersonaId(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                  >
                    {personas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.product})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Messaging Pack Selection */}
                {selectedPersonaId && (
                  <div className="space-y-2">
                    <Label htmlFor="messaging" className="text-sm font-medium">
                      Messaging Pack (optional)
                    </Label>
                    {loadingMessaging ? (
                      <p className="text-sm text-slate-600">Loading messaging...</p>
                    ) : messaging.length === 0 ? (
                      <Alert>
                        <AlertDescription>
                          No messaging found for this persona. Generate messaging first for better results.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <select
                        id="messaging"
                        value={selectedMessagingId}
                        onChange={(e) => setSelectedMessagingId(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                      >
                        <option value="">-- None --</option>
                        {messaging.map((msg) => (
                          <option key={msg.id} value={msg.id}>
                            {msg.headline}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* Sequence Type */}
                <div className="space-y-2">
                  <Label htmlFor="sequenceType" className="text-sm font-medium">
                    Sequence Type
                  </Label>
                  <select
                    id="sequenceType"
                    value={sequenceType}
                    onChange={(e) => setSequenceType(e.target.value as SequenceType)}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                  >
                    <option value="welcome">Welcome Sequence</option>
                    <option value="nurture">Nurture Sequence</option>
                    <option value="cart_abandonment">Cart Abandonment</option>
                    <option value="re_engagement">Re-engagement</option>
                    <option value="product_launch">Product Launch</option>
                  </select>
                </div>

                {/* Custom Notes */}
                <div className="space-y-2">
                  <Label htmlFor="customNotes" className="text-sm font-medium">
                    Custom Notes (optional)
                  </Label>
                  <Textarea
                    id="customNotes"
                    placeholder="Add any specific angles, offers, or campaign goals..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Error Display */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !selectedPersonaId || loadingPersonas || loadingMessaging}
                  className="w-full shadow-md"
                  size="lg"
                >
                  {loading ? 'Generating Sequence...' : '✨ Generate Email/SMS Sequence'}
                </Button>
              </>
            )}
          </div>
        </PageCard>

        {/* Output Preview */}
        <div className="space-y-4">
          <PageCard
            title="Generated Sequences"
            subtitle="View your email and SMS campaigns"
          >
            {selectedSequence ? (
              <Tabs defaultValue="emails" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="emails">
                    Emails ({selectedSequence.emails?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="sms">
                    SMS ({selectedSequence.sms_messages?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="emails" className="space-y-4">
                  {renderEmailContent(selectedSequence)}
                </TabsContent>
                <TabsContent value="sms" className="space-y-4">
                  {renderSmsContent(selectedSequence)}
                </TabsContent>
                <TabsContent value="history" className="space-y-3">
                  {sequences.map((seq) => (
                    <Card
                      key={seq.id}
                      className="cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedSequence(seq)}
                    >
                      <CardHeader>
                        <CardTitle className="text-sm">{seq.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {seq.sequence_type} • {seq.emails?.length || 0} emails
                          {seq.sms_messages && seq.sms_messages.length > 0 && ` • ${seq.sms_messages.length} SMS`}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No sequence generated yet.</p>
                <p className="text-sm mt-2">Fill out the form and click &quot;Generate Email/SMS Sequence&quot;</p>
              </div>
            )}
          </PageCard>
        </div>
      </div>
    </AppShell>
  );
}
