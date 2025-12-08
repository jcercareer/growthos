'use client';

import { useState } from 'react';
import { Clipboard, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

type OutputToolbarProps = {
  onCopy: () => void;
  onRegenerate?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
};

export function OutputToolbar({ onCopy, onRegenerate, onLike, onDislike }: OutputToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-3 text-slate-600">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold shadow-sm"
      >
        <Clipboard className="w-4 h-4" />
        {copied ? 'Copied' : 'Copy'}
      </button>

      {onLike && (
        <button onClick={onLike} className="p-1 rounded-full hover:bg-slate-100">
          <ThumbsUp className="w-5 h-5" />
        </button>
      )}

      {onDislike && (
        <button onClick={onDislike} className="p-1 rounded-full hover:bg-slate-100">
          <ThumbsDown className="w-5 h-5" />
        </button>
      )}

      {onRegenerate && (
        <button onClick={onRegenerate} className="p-1 rounded-full hover:bg-slate-100">
          <RefreshCw className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

