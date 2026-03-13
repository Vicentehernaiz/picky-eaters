'use client';

interface SpinnerProps {
  size?: number;
  color?: string;
}

export default function Spinner({ size = 24, color = 'var(--color-accent-orange)' }: SpinnerProps) {
  return (
    <span style={{
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: '50%',
      border: `2px solid ${color}22`,
      borderTopColor: color,
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}
