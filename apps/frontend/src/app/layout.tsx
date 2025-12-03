import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Growth OS - JCER Marketing Hub',
  description: 'Internal marketing tool for JCER LLC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="text-2xl font-bold">
                    Growth OS
                  </Link>
                  <div className="flex gap-6">
                    <Link
                      href="/personas"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Personas
                    </Link>
                    <Link
                      href="/messaging"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Messaging
                    </Link>
                    <Link
                      href="/scripts"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Scripts
                    </Link>
                    <Link
                      href="/blogs"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Blogs
                    </Link>
                    <Link
                      href="/social"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Social Analytics
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

