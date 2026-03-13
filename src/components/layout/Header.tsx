'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell } from '@phosphor-icons/react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  rightAction?: ReactNode;
}

export default function Header({ title, showBack = false, showNotifications = false, rightAction }: HeaderProps) {
  const router = useRouter();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      height: 'var(--header-height)',
      background: 'var(--color-bg-white)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 'var(--z-sticky)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {showBack && (
          <button
            onClick={() => router.back()}
            style={{
              background: 'var(--color-bg-contrast)',
              border: 'none',
              borderRadius: '50%',
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-dark)',
            }}
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
        )}
        {title && (
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--color-accent-orange)',
            letterSpacing: '-0.01em',
            lineHeight: 1,
          }}>
            {title}
          </h1>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {rightAction}
        {showNotifications && (
          <button style={{
            background: 'var(--color-bg-contrast)',
            border: 'none',
            borderRadius: '50%',
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text-dark)',
          }}>
            <Bell size={20} weight="regular" />
          </button>
        )}
      </div>
    </header>
  );
}
