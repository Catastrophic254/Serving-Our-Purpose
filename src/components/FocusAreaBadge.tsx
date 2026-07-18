import React from 'react';
import { FocusArea } from '../types';
import { FOCUS_AREAS } from '../data';
import * as Icons from 'lucide-react';

interface FocusAreaBadgeProps {
  area: FocusArea;
  showIcon?: boolean;
  className?: string;
}

export default function FocusAreaBadge({ area, showIcon = true, className = '' }: FocusAreaBadgeProps) {
  const meta = FOCUS_AREAS[area];
  if (!meta) return null;

  // Dynamically resolve icon from Lucide
  const iconName = meta.icon as keyof typeof Icons;
  const IconComponent = (Icons[iconName] || Icons.Music) as React.ComponentType<any>;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-widest font-mono font-bold bg-zinc-900 text-white border border-zinc-700/80 rounded-none ${className}`}
    >
      {showIcon && <IconComponent className="w-3 h-3 text-[#ff4d00]" />}
      {meta.label}
    </span>
  );
}

