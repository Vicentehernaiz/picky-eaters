'use client';

import { FOOD_CATEGORIES, CATEGORY_EMOJIS } from '@/shared/constants';
import type { FoodCategory } from '@/shared/constants';

const ALL = 'all';

interface CategoryFilterProps {
  value: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const items = [ALL, ...FOOD_CATEGORIES];

  return (
    <div style={{
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      padding: '4px 0 8px',
      scrollbarWidth: 'none',
    }}>
      {items.map(cat => {
        const active = value === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: active ? '1.5px solid var(--color-accent-orange)' : '1.5px solid var(--color-border)',
              background: active ? 'var(--color-accent-orange)' : 'var(--color-bg-white)',
              color: active ? '#fff' : 'var(--color-text-body)',
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: active ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-fast)',
              flexShrink: 0,
            }}
          >
            {cat !== ALL && <span>{CATEGORY_EMOJIS[cat as FoodCategory]}</span>}
            <span style={{ textTransform: cat === ALL ? 'none' : 'capitalize' }}>
              {cat === ALL ? 'All' : cat}
            </span>
          </button>
        );
      })}
    </div>
  );
}
