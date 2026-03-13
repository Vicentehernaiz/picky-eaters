'use client';

import { RATINGS, RATING_LABELS, RATING_EMOJIS, RATING_COLORS } from '@/shared/constants';
import type { Rating } from '@/shared/constants';

interface FoodRatingPickerProps {
  value?: Rating;
  onChange: (rating: Rating) => void;
}

export default function FoodRatingPicker({ value, onChange }: FoodRatingPickerProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: 8,
    }}>
      {RATINGS.map(rating => {
        const { color, bg } = RATING_COLORS[rating];
        const active = value === rating;
        return (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '10px 4px',
              borderRadius: 12,
              border: active ? `2px solid ${color}` : '2px solid transparent',
              background: active ? bg : 'var(--color-bg-contrast)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              transform: active ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <span style={{ fontSize: 22 }}>{RATING_EMOJIS[rating]}</span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '9px',
              fontWeight: 600,
              color: active ? color : 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}>
              {RATING_LABELS[rating]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
