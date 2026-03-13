'use client';

import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number | string;
  shadow?: boolean;
}

export default function Card({ children, padding = 16, shadow = true, style, ...props }: CardProps) {
  return (
    <div
      {...props}
      style={{
        background: 'var(--color-bg-white)',
        borderRadius: 'var(--radius-card)',
        padding: typeof padding === 'number' ? `${padding}px` : padding,
        boxShadow: shadow ? 'var(--shadow-card)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
