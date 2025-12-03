import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Growth OS</h1>
        <p className="text-lg text-muted-foreground">
          Internal marketing tool for JCER LLC - AI-powered content generation
          for CareerScaleUp and Zevaux
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Core Modules */}
        <Link
          href="/personas"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">Personas</h2>
          <p className="text-muted-foreground">
            Define and manage customer personas for your products
          </p>
        </Link>

        <Link
          href="/messaging"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">Messaging</h2>
          <p className="text-muted-foreground">
            Generate value messaging and positioning statements
          </p>
        </Link>

        <Link
          href="/scripts"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">Video Scripts</h2>
          <p className="text-muted-foreground">
            Create AI-generated scripts for short-form video content
          </p>
        </Link>

        <Link
          href="/blogs"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">Blog Outlines</h2>
          <p className="text-muted-foreground">
            Generate structured outlines for blog posts and articles
          </p>
        </Link>

        {/* Growth OS New Modules */}
        <Link
          href="/funnels"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">Funnels</h2>
          <p className="text-muted-foreground">
            Generate landing pages, VSLs, and high-converting funnels
          </p>
        </Link>

        <Link
          href="/lead-magnets"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">Lead Magnets</h2>
          <p className="text-muted-foreground">
            Create PDFs, checklists, templates, and downloadable assets
          </p>
        </Link>

        <Link
          href="/email-sequences"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">Email/SMS Sequences</h2>
          <p className="text-muted-foreground">
            Build automated drip campaigns and nurture sequences
          </p>
        </Link>

        <Link
          href="/social-packs"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">Social Packs</h2>
          <p className="text-muted-foreground">
            Multi-platform social media content packs
          </p>
        </Link>

        <Link
          href="/paid-ads"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">Paid Ads</h2>
          <p className="text-muted-foreground">
            Cross-platform ad campaigns (TikTok, Google, LinkedIn, etc.)
          </p>
        </Link>

        <Link
          href="/pricing-pages"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">Pricing Pages</h2>
          <p className="text-muted-foreground">
            Generate pricing tiers, FAQ, and guarantee sections
          </p>
        </Link>

        <Link
          href="/social-proof"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">Social Proof</h2>
          <p className="text-muted-foreground">
            Testimonials, case studies, metrics, and reviews
          </p>
        </Link>

        <Link
          href="/viral-scripts"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">Viral Scripts</h2>
          <p className="text-muted-foreground">
            Short-form scripts for TikTok, Reels, and YouTube Shorts
          </p>
        </Link>

        <Link
          href="/linkedin-viral"
          className="block p-6 border rounded-lg hover:border-primary hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold mb-2">LinkedIn Viral</h2>
          <p className="text-muted-foreground">
            High-engagement LinkedIn content (carousels, text, video)
          </p>
        </Link>

        {/* Campaign Assets (Special) */}
        <Link
          href="/campaign-assets"
          className="block p-6 border-2 border-purple-500 rounded-lg hover:border-purple-600 hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950"
        >
          <h2 className="text-2xl font-semibold mb-2">🚀 Campaign Assets</h2>
          <p className="text-muted-foreground">
            Complete campaign generator: ads, social proof, pricing (all-in-one)
          </p>
        </Link>

        {/* Analytics Dashboard */}
        <Link
          href="/analytics"
          className="block p-6 border-2 border-green-500 rounded-lg hover:border-green-600 hover:shadow-lg transition-all bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950"
        >
          <h2 className="text-2xl font-semibold mb-2">📊 Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Manual input + AI-powered insights and recommendations
          </p>
        </Link>

        {/* Niche Variant Engine */}
        <Link
          href="/niches"
          className="block p-6 border-2 border-orange-500 rounded-lg hover:border-orange-600 hover:shadow-lg transition-all bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950"
        >
          <h2 className="text-2xl font-semibold mb-2">🎯 Niche Variant Engine</h2>
          <p className="text-muted-foreground">
            Adapt content for specific industries (nurses, dentists, etc.)
          </p>
        </Link>
      </div>
    </div>
  );
}

