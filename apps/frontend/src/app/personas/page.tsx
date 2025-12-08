'use client';

import { useState } from 'react';
import { generatePersona } from '@/lib/api';
import type { Persona, Product, AudienceType } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LayoutShell } from '@/components/LayoutShell';
import { Users, Sparkles } from 'lucide-react';

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
    <LayoutShell>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Personas</h1>
            <p className="text-sm text-muted-foreground">Generate detailed customer personas for your products</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input Form */}
        <div>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Generate New Persona</h2>
            </div>

            <div className="space-y-4">
              {/* Product */}
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select
                  id="product"
                  value={product}
                  onValueChange={(value) => {
                    const newProduct = value as Product;
                    setProduct(newProduct);
                    setAudienceType(getDefaultAudienceType(newProduct));
                  }}
                >
                  <option value="CareerScaleUp">CareerScaleUp</option>
                  <option value="Zevaux">Zevaux</option>
                </Select>
              </div>

              {/* Audience Type */}
              {product === 'CareerScaleUp' && (
                <div className="space-y-2">
                  <Label htmlFor="audience-type">Audience Type</Label>
                  <Select
                    id="audience-type"
                    value={audienceType}
                    onValueChange={(value) => setAudienceType(value as AudienceType)}
                  >
                    <option value="jobseeker">Job Seeker</option>
                    <option value="recruiter">Recruiter / Hiring Team</option>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {audienceType === 'jobseeker'
                      ? 'Persona for job seekers or career advancers'
                      : 'Persona for recruiters, hiring managers, or HR professionals'}
                  </p>
                </div>
              )}

              {/* Zevaux Info */}
              {product === 'Zevaux' && (
                <Alert className="bg-purple-50 border-purple-200 dark:bg-purple-950/20">
                  <AlertDescription className="text-sm">
                    <strong>Zevaux AI Receptionist:</strong> Personas will be for SMB owners, operations managers, or agencies needing 24/7 call handling and lead capture.
                  </AlertDescription>
                </Alert>
              )}

              {/* Seed Notes */}
              <div className="space-y-2">
                <Label htmlFor="seed-notes">
                  Seed Notes <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Textarea
                  id="seed-notes"
                  placeholder={product === 'Zevaux' 
                    ? "e.g., Dentist practice losing calls after hours, HVAC contractor missing leads..." 
                    : "e.g., Mid-career professionals who feel stuck, nurses looking for remote work..."}
                  value={seedNotes}
                  onChange={(e) => setSeedNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate} 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                size="lg"
              >
                {loading ? 'Generating...' : 'Generate Persona'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: Results Panel */}
        <div>
          <Card className="p-6 min-h-[400px]">
            <h2 className="text-lg font-semibold mb-4">Generated Persona</h2>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!persona && !error && (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <Users className="h-12 w-12 mb-3 opacity-20" />
                <p>No persona generated yet</p>
                <p className="text-sm">Fill out the form and click Generate</p>
              </div>
            )}

            {persona && (
              <div className="space-y-4">
                {/* Name and Basic Info */}
                <div className="pb-4 border-b">
                  <h3 className="text-2xl font-bold text-blue-600 mb-1">{persona.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {persona.product} • {persona.audience_type}
                  </p>
                  {persona.age_range && (
                    <p className="text-sm text-muted-foreground">Age: {persona.age_range}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm uppercase text-muted-foreground">Description</h4>
                  <p className="text-sm leading-relaxed">{persona.description}</p>
                </div>

                {/* Pain Points */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm uppercase text-muted-foreground">Pain Points</h4>
                  <ul className="space-y-1">
                    {persona.pain_points.map((point, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Goals */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm uppercase text-muted-foreground">Goals</h4>
                  <ul className="space-y-1">
                    {persona.goals.map((goal, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buying Triggers */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm uppercase text-muted-foreground">Buying Triggers</h4>
                  <ul className="space-y-1">
                    {persona.buying_triggers.map((trigger, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{trigger}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </LayoutShell>
  );
}
