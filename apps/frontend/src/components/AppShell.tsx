'use client';

import React from 'react';
import { ModeToggle } from './mode-toggle';

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-animated-gradient">
      <header className="border-b border-border-subtle/70 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Growth OS · <span className="font-normal opacity-70">{title}</span>
            </h1>
            {subtitle && (
              <p className="mt-1 text-xs text-foreground/60">
                {subtitle}
              </p>
            )}
          </div>
          <ModeToggle />
        </div>
      </header>
      
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {children}
      </main>
    </div>
  );
}

