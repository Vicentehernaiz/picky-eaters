'use client';

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {label && (
          <label style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-body)',
            letterSpacing: '0.02em',
          }}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {leftIcon && (
            <span style={{
              position: 'absolute', left: 12,
              color: 'var(--color-text-muted)',
              display: 'flex', alignItems: 'center',
            }}>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            {...props}
            style={{
              width: '100%',
              background: 'var(--color-bg-contrast)',
              border: error ? '1.5px solid #D93025' : '1.5px solid transparent',
              borderRadius: 'var(--radius-input)',
              padding: `12px ${rightIcon ? '40px' : '16px'} 12px ${leftIcon ? '40px' : '16px'}`,
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--color-text-dark)',
              outline: 'none',
              transition: 'var(--transition-fast)',
              ...style,
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--color-accent-orange)';
              e.currentTarget.style.background = '#fff';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = error ? '#D93025' : 'transparent';
              e.currentTarget.style.background = 'var(--color-bg-contrast)';
            }}
          />
          {rightIcon && (
            <span style={{
              position: 'absolute', right: 12,
              color: 'var(--color-text-muted)',
              display: 'flex', alignItems: 'center',
            }}>
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: '#D93025',
          }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
