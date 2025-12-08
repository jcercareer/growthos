'use client';

import { LayoutShell } from '@/components/LayoutShell';
import { ToolCard } from '@/components/ToolCard';

const tools = [
  {
    title: 'Personas',
    description: 'Create detailed customer personas for CareerScaleUp and Zevaux audiences',
    href: '/personas',
    icon: '🧠',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Messaging',
    description: 'Generate compelling value propositions and marketing messaging',
    href: '/messaging',
    icon: '💬',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Video Scripts',
    description: 'AI-generated scripts for short-form video content and ads',
    href: '/scripts',
    icon: '🎥',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Viral Scripts',
    description: 'Create viral short-form content for TikTok, Instagram Reels, and YouTube Shorts',
    href: '/viral-scripts',
    icon: '⚡',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'LinkedIn Viral',
    description: 'Generate viral LinkedIn posts, carousels, and thought leadership content',
    href: '/linkedin-viral',
    icon: '🔗',
    gradient: 'from-blue-600 to-blue-700',
  },
  {
    title: 'Blog Outlines',
    description: 'Structured outlines for SEO-optimized blog posts and articles',
    href: '/blogs',
    icon: '📝',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Lead Magnets',
    description: 'Create PDFs, checklists, templates, and downloadable assets',
    href: '/lead-magnets',
    icon: '🎁',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Email/SMS Sequences',
    description: 'Build automated drip campaigns and nurture sequences',
    href: '/email-sequences',
    icon: '📧',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    title: 'Social Packs',
    description: 'Multi-platform social media content packs with copy and hashtags',
    href: '/social-packs',
    icon: '📱',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Paid Ads',
    description: 'Google, Facebook, LinkedIn, and TikTok ad copy and creative direction',
    href: '/paid-ads',
    icon: '💵',
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    title: 'Pricing Pages',
    description: 'High-converting pricing page copy, tiers, and FAQs',
    href: '/pricing-pages',
    icon: '🏷️',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Social Proof',
    description: 'Testimonials, case studies, and trust-building content',
    href: '/social-proof',
    icon: '⭐',
    gradient: 'from-amber-500 to-yellow-500',
  },
];

export default function Home() {
  return (
    <LayoutShell>
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to Growth OS
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Internal marketing tool for JCER LLC – AI-powered content generation for CareerScaleUp and
          Zevaux.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.href}
            title={tool.title}
            description={tool.description}
            href={tool.href}
            icon={tool.icon}
            gradient={tool.gradient}
          />
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-16 p-6 rounded-xl border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <h3 className="font-semibold mb-2 text-lg">🎯 What is Growth OS?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Growth OS is JCER's internal AI marketing engine designed to generate high-performance marketing
          assets for CareerScaleUp (Career AI Platform) and Zevaux (AI Receptionist for SMBs).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">CareerScaleUp</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• AI Resume Optimizer & ATS Scanner</li>
              <li>• Job Match Engine & Application Tracker</li>
              <li>• AI Interview Trainer & Career Coaches</li>
              <li>• Personal Portfolio Websites (username.careerscaleup.com)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-600 mb-2">Zevaux</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• 24/7 AI Receptionist for SMBs</li>
              <li>• Appointment Booking & Lead Capture</li>
              <li>• Multi-language Support & SMS Follow-ups</li>
              <li>• Workflow Automation & CRM Integration</li>
            </ul>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
