'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggle } from './mode-toggle';

type NavItem = {
  name: string;
  href: string;
  icon: string; // emoji for lightweight icons (no extra deps)
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Personas', href: '/personas', icon: '🧠' },
  { name: 'Messaging', href: '/messaging', icon: '💬' },
  { name: 'Video Scripts', href: '/scripts', icon: '🎥' },
  { name: 'Viral Scripts', href: '/viral-scripts', icon: '⚡' },
  { name: 'LinkedIn Viral', href: '/linkedin-viral', icon: '🔗' },
  { name: 'Blog Outlines', href: '/blogs', icon: '📝' },
  { name: 'Lead Magnets', href: '/lead-magnets', icon: '🎁' },
  { name: 'Email/SMS', href: '/email-sequences', icon: '📧' },
  { name: 'Social Packs', href: '/social-packs', icon: '📱' },
  { name: 'Paid Ads', href: '/paid-ads', icon: '💵' },
  { name: 'Pricing Pages', href: '/pricing-pages', icon: '🏷️' },
  { name: 'Social Proof', href: '/social-proof', icon: '⭐' },
];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-950/95">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
              G
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Growth OS
              </h1>
              <p className="text-xs text-muted-foreground">JCER Marketing Platform</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <ModeToggle />
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              JC
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-white dark:bg-slate-950 h-[calc(100vh-4rem)] sticky top-16">
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <span className="text-base" aria-hidden>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold mb-1">Products:</p>
              <p>• CareerScaleUp</p>
              <p>• Zevaux</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

