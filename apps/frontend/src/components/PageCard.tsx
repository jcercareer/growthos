import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type PageCardProps = {
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  iconSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function PageCard({
  title,
  subtitle,
  badgeLabel,
  iconSlot,
  children,
  className,
}: PageCardProps) {
  return (
    <Card className={cn('glass-card', className)}>
      <CardHeader className="border-b border-border-subtle/60 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            {badgeLabel && (
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
                {badgeLabel}
              </div>
            )}
            <CardTitle className="mt-3 text-2xl font-semibold text-foreground">
              {title}
            </CardTitle>
            {subtitle && (
              <CardDescription className="mt-1 text-foreground/70">
                {subtitle}
              </CardDescription>
            )}
          </div>
          {iconSlot}
        </div>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}

