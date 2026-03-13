'use client';

import { ReactNode } from 'react';
import { RATING_COLORS } from '@/shared/constants';
import type { Rating } from '@/shared/constants';

interface BadgeProps {
  rating: Rating;
  children?: ReactNode;
  size?: 'sm' | 'md';
}

export default function Badge({ rating, children, size = 'md' }: BadgeProps) {
  const { color, bg } = RATING_COLORS[rating];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: size === 'sm' ? '2px 8px' : '4px 10px',
      borderRadius: 'var(--radius-tag)',
      background: bg,
      color,
      fontFamily: 'var(--font-ui)',
      fontSize: size === 'sm' ? '10px' : '11px',
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}
