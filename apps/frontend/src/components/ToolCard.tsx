import Link from 'next/link';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: string; // emoji string for lightweight icons
  gradient?: string;
}

export function ToolCard({
  title,
  description,
  href,
  icon,
  gradient = 'from-blue-500 to-purple-600',
}: ToolCardProps) {
  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-xl border bg-white dark:bg-slate-900 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
        {/* Gradient Border Effect on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
        />

        <div className="relative">
          {/* Icon */}
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white mb-4 text-xl`}
            aria-hidden
          >
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
}

