'use client';

import { useState } from 'react';
import { analyzeAnalytics } from '@/lib/api';
import type { AnalyticsInput, AnalyticsResponse } from '@growth-os/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DEFAULT_PLATFORMS = [
  'TikTok',
  'Instagram',
  'LinkedIn',
  'Reddit',
  'YouTube',
  'Facebook',
];

export default function AnalyticsPage() {
  const [platformData, setPlatformData] = useState<AnalyticsInput[]>(
    DEFAULT_PLATFORMS.map(platform => ({
      platform,
      followers: 0,
      views: 0,
      engagements: 0,
      clicks: 0,
      notes: '',
    }))
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<AnalyticsResponse | null>(null);

  const updatePlatform = (index: number, field: keyof AnalyticsInput, value: any) => {
    const updated = [...platformData];
    updated[index] = { ...updated[index], [field]: value };
    setPlatformData(updated);
  };

  const calculateEngagementRate = (platform: AnalyticsInput) => {
    if (platform.views === 0) return '0%';
    return ((platform.engagements / platform.views) * 100).toFixed(2) + '%';
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeAnalytics({
        analytics: platformData,
      });
      setInsights(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Analytics Dashboard" subtitle="Manual input + AI-powered insights">
      <div className="space-y-6">
        {/* Performance Table */}
        <PageCard
          title="Channel Performance (Last 7 Days)"
          subtitle="Enter your social media metrics manually"
          badgeLabel="Manual Entry"
        >
          <div className="space-y-6">
            {platformData.map((platform, idx) => (
              <Card key={idx} className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{platform.platform}</CardTitle>
                    <Badge variant="outline">
                      ER: {calculateEngagementRate(platform)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Followers</Label>
                      <Input
                        type="number"
                        value={platform.followers}
                        onChange={(e) =>
                          updatePlatform(idx, 'followers', parseInt(e.target.value) || 0)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Views (7d)</Label>
                      <Input
                        type="number"
                        value={platform.views}
                        onChange={(e) =>
                          updatePlatform(idx, 'views', parseInt(e.target.value) || 0)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Engagements</Label>
                      <Input
                        type="number"
                        value={platform.engagements}
                        onChange={(e) =>
                          updatePlatform(idx, 'engagements', parseInt(e.target.value) || 0)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Link Clicks</Label>
                      <Input
                        type="number"
                        value={platform.clicks}
                        onChange={(e) =>
                          updatePlatform(idx, 'clicks', parseInt(e.target.value) || 0)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-3 lg:col-span-1">
                      <Label className="text-xs">Notes</Label>
                      <Textarea
                        value={platform.notes || ''}
                        onChange={(e) => updatePlatform(idx, 'notes', e.target.value)}
                        placeholder="Optional notes..."
                        rows={1}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={loading}
              size="lg"
              className="w-full shadow-md"
            >
              {loading ? 'Analyzing Performance...' : '🔍 Analyze Performance with AI'}
            </Button>
          </div>
        </PageCard>

        {/* AI Insights Output */}
        {insights && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Summary & Rankings */}
            <div className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{insights.summary}</p>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Platform Rankings</CardTitle>
                  <CardDescription>Ordered by performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {insights.platformRankings.map((ranking, idx) => (
                      <li key={idx} className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          #{idx + 1}
                        </Badge>
                        <span className="text-sm">{ranking}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-md border-orange-200">
                <CardHeader>
                  <CardTitle>Weaknesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-orange-600 mr-2">⚠</span>
                        <span className="text-sm">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <div className="space-y-6">
              <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <CardHeader>
                  <CardTitle>🎬 Video Ideas</CardTitle>
                  <CardDescription>Ready-to-produce content</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.recommendations.videoIdeas.map((idea, idx) => (
                      <li key={idx} className="text-sm border-l-4 border-blue-500 pl-3 py-1">
                        {idea}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>💼 LinkedIn Post Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.recommendations.linkedinPosts.map((post, idx) => (
                      <li key={idx} className="text-sm border-l-4 border-blue-700 pl-3 py-1">
                        {post}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>🎯 Funnel Angles</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.recommendations.funnelAngles.map((angle, idx) => (
                      <li key={idx} className="text-sm border-l-4 border-purple-500 pl-3 py-1">
                        {angle}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>📥 Lead Magnet Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.recommendations.leadMagnetIdeas.map((idea, idx) => (
                      <li key={idx} className="text-sm border-l-4 border-green-500 pl-3 py-1">
                        {idea}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>💰 Ad Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.recommendations.adIdeas.map((ad, idx) => (
                      <li key={idx} className="text-sm border-l-4 border-red-500 pl-3 py-1">
                        {ad}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

