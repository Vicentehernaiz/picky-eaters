'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: {
    background: 'var(--color-accent-orange)',
    color: '#fff',
    border: 'none',
    boxShadow: 'var(--shadow-button)',
  },
  secondary: {
    background: 'var(--color-bg-contrast)',
    color: 'var(--color-text-dark)',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-accent-orange)',
    border: '1.5px solid var(--color-accent-orange)',
  },
  danger: {
    background: '#D93025',
    color: '#fff',
    border: 'none',
  },
};

const sizes = {
  sm: { padding: '8px 16px', fontSize: '13px', borderRadius: 'var(--radius-button)' },
  md: { padding: '12px 24px', fontSize: 'var(--text-button)', borderRadius: 'var(--radius-button)' },
  lg: { padding: '16px 32px', fontSize: '17px', borderRadius: 'var(--radius-button)' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        ...variants[variant],
        ...sizes[size],
        fontFamily: 'var(--font-ui)',
        fontWeight: 700,
        letterSpacing: '0.01em',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'var(--transition-fast)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: fullWidth ? '100%' : 'auto',
        ...style,
      }}
    >
      {loading && (
        <span style={{
          width: 16, height: 16, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff',
          animation: 'spin 0.7s linear infinite',
          flexShrink: 0,
        }} />
      )}
      {children}
    </button>
  );
}
