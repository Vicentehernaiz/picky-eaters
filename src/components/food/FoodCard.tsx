'use client';

import { Pencil, Trash } from '@phosphor-icons/react';
import Badge from '@/src/components/ui/Badge';
import { RATING_EMOJIS, RATING_COLORS } from '@/shared/constants';
import type { Rating } from '@/shared/constants';

interface FoodCardProps {
  emoji?: string;
  name: string;
  category?: string;
  rating: Rating;
  intensity?: number;
  notes?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function FoodCard({
  emoji, name, category, rating, intensity = 3, notes, onEdit, onDelete,
}: FoodCardProps) {
  const { color } = RATING_COLORS[rating];
  return (
    <div style={{
      background: 'var(--color-bg-white)',
      borderRadius: 'var(--radius-card)',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Emoji */}
      <div style={{
        width: 48, height: 48,
        borderRadius: 12,
        background: 'var(--color-bg-main)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26,
        flexShrink: 0,
      }}>
        {emoji || '🍴'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--color-text-dark)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {name}
          </span>
          <Badge rating={rating} size="sm">
            {RATING_EMOJIS[rating]} {rating}
          </Badge>
        </div>

        {/* Intensity dots */}
        {intensity && ['love', 'like', 'dislike', 'hate'].includes(rating) && (
          <div style={{ display: 'flex', gap: 3, marginBottom: notes ? 4 : 0 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i <= intensity ? color : 'var(--color-bg-contrast)',
              }} />
            ))}
          </div>
        )}

        {notes && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontStyle: 'italic',
          }}>
            {notes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {onEdit && (
          <button
            onClick={onEdit}
            style={{
              background: 'var(--color-bg-contrast)',
              border: 'none',
              borderRadius: 8,
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-body)',
            }}
          >
            <Pencil size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            style={{
              background: '#FDECEA',
              border: 'none',
              borderRadius: 8,
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: '#D93025',
            }}
          >
            <Trash size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
