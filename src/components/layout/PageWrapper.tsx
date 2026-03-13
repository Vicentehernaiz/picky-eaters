'use client';

import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

export default function PageWrapper({ children, style }: PageWrapperProps) {
  return (
    <main style={{
      paddingBottom: 'calc(var(--nav-height) + 16px)',
      minHeight: '100dvh',
      background: 'var(--color-bg-main)',
      ...style,
    }}>
      {children}
    </main>
  );
}
