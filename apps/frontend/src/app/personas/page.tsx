'use client';

import { useState } from 'react';
import { generatePersona } from '@/lib/api';
import type { Persona, Product, AudienceType } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function PersonasPage() {
  const [product, setProduct] = useState<Product>('CareerScaleUp');
  const [audienceType, setAudienceType] = useState<AudienceType>('jobseeker');
  const [seedNotes, setSeedNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);

  // Helper to get default audience type for product
  const getDefaultAudienceType = (prod: Product): AudienceType => {
    return prod === 'Zevaux' ? 'smb_owner' : 'jobseeker';
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePersona({
        product,
        audienceType,
        seed_notes: seedNotes || undefined,
      });
      setPersona(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate persona');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Personas"
      subtitle="Generate AI-powered customer personas for CareerScaleUp, Zevaux, and JCER-level campaigns."
    >
      <PageCard
        title="Generate New Persona"
        subtitle="AI will create a detailed customer persona based on the selected product and audience type."
        badgeLabel="Persona Engine"
        iconSlot={
          <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-alt text-white shadow-lg shadow-brand-soft/30">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product" className="text-sm font-medium text-slate-800">Product</Label>
            <Select
              id="product"
              value={product}
              onValueChange={(value) => {
                const newProduct = value as Product;
                setProduct(newProduct);
                // Auto-set appropriate audience type for each product
                setAudienceType(getDefaultAudienceType(newProduct));
              }}
            >
              <option value="CareerScaleUp">CareerScaleUp</option>
              <option value="Zevaux">Zevaux</option>
            </Select>
          </div>

          {/* Show Audience Type selector only for CareerScaleUp */}
          {product === 'CareerScaleUp' && (
            <div className="space-y-2">
              <Label htmlFor="audience-type" className="text-sm font-medium text-slate-800">Audience Type</Label>
              <Select
                id="audience-type"
                value={audienceType}
                onValueChange={(value) => setAudienceType(value as AudienceType)}
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="recruiter">Recruiter / Hiring Team</option>
              </Select>
              <p className="text-xs text-slate-500">
                {audienceType === 'jobseeker'
                  ? 'Persona represents someone looking for a job or advancing their career'
                  : 'Persona represents a recruiter, hiring manager, or HR professional'}
              </p>
            </div>
          )}

          {/* Show info for Zevaux */}
          {product === 'Zevaux' && (
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200">
              <AlertDescription className="text-sm">
                <strong>Zevaux AI Receptionist:</strong> Personas will be generated for small/mid-size business owners, operations managers, or agency owners who need 24/7 call handling, lead qualification, and appointment scheduling.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="seed-notes" className="text-sm font-medium text-slate-800">
              Seed Notes (Optional)
            </Label>
            <Textarea
              id="seed-notes"
              placeholder={product === 'Zevaux' 
                ? "e.g., ai receptionist helping smbs, dentist practice losing calls after hours, HVAC contractor missing leads..." 
                : "e.g., Focus on mid-career professionals who feel stuck..."}
              value={seedNotes}
              onChange={(e) => setSeedNotes(e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={loading} 
            className="w-full btn-brand"
            size="lg"
          >
            {loading ? 'Generating...' : 'Generate Persona'}
          </Button>
        </div>
      </PageCard>

      {/* Error */}
      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Result */}
      {persona && (
        <Card className="border-0 shadow-xl rounded-3xl">
          <CardHeader className="border-b border-slate-200/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">{persona.name}</CardTitle>
                <CardDescription className="text-slate-600">
                  {persona.product} • 
                  {persona.audience_type === 'recruiter' ? ' Recruiter' : 
                   persona.audience_type === 'smb_owner' ? ' SMB Owner' :
                   persona.audience_type === 'agency_owner' ? ' Agency Owner' : ' Job Seeker'} • 
                  {persona.age_range || (persona as any).ageRange}
                  {(persona as any).location && ` • ${(persona as any).location}`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Role and Industry */}
            {((persona as any).roleOrTitle || (persona as any).industry) && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                {(persona as any).roleOrTitle && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-500 mb-1">
                      Role
                    </h4>
                    <p className="text-sm font-medium text-slate-900">{(persona as any).roleOrTitle}</p>
                  </div>
                )}
                {(persona as any).industry && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-500 mb-1">
                      Industry
                    </h4>
                    <p className="text-sm font-medium text-slate-900">{(persona as any).industry}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{persona.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Pain Points</h3>
              <ul className="space-y-2">
                {persona.pain_points.map((point, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Goals</h3>
              <ul className="space-y-2">
                {persona.goals.map((goal, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Buying Triggers</h3>
              <ul className="space-y-2">
                {persona.buying_triggers.map((trigger, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{trigger}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">ID: {persona.id}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
