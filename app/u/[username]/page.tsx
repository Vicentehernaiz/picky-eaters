'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Avatar from '@/src/components/ui/Avatar';
import Badge from '@/src/components/ui/Badge';
import Button from '@/src/components/ui/Button';
import Spinner from '@/src/components/ui/Spinner';
import { ShareNetwork, UserPlus } from '@phosphor-icons/react';
import { RATING_EMOJIS, RATING_LABELS, RATING_COLORS, RATINGS } from '@/shared/constants';
import type { Rating } from '@/shared/constants';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  is_public: boolean;
}

interface Preference {
  id: string;
  rating: Rating;
  intensity: number;
  notes: string;
  foods: { name: string; emoji: string; category: string };
}

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [prefs, setPrefs] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${username}`).then(r => r.json()),
      fetch(`/api/users/${username}/preferences`).then(r => r.json()),
    ]).then(([user, pref]) => {
      setProfile(user.user);
      setPrefs(pref.preferences ?? []);
    }).finally(() => setLoading(false));
  }, [username]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `${profile?.display_name}'s food preferences`, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh', background: 'var(--color-bg-main)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{
        minHeight: '100dvh', background: 'var(--color-bg-main)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: 20,
      }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>😅</div>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 20, fontWeight: 700, color: 'var(--color-text-dark)' }}>
          User not found
        </h2>
      </div>
    );
  }

  // Group prefs by rating
  const grouped = RATINGS.reduce<Record<string, Preference[]>>((acc, r) => {
    acc[r] = prefs.filter(p => p.rating === r);
    return acc;
  }, {} as Record<string, Preference[]>);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-main)', padding: '0 0 32px' }}>
      {/* Header */}
      <div style={{
        background: 'var(--color-bg-white)',
        padding: '48px 20px 24px',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <Avatar src={profile.avatar_url} name={profile.display_name} size={80} />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
          color: 'var(--color-text-dark)', marginBottom: 4,
        }}>
          {profile.display_name}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 12 }}>
          @{profile.username}
        </p>
        {profile.bio && (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-body)',
            maxWidth: 300, margin: '0 auto 16px',
          }}>
            {profile.bio}
          </p>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Button onClick={handleShare} variant="ghost" style={{ padding: '8px 20px' }}>
            <ShareNetwork size={18} />
            {copied ? 'Copied!' : 'Share'}
          </Button>
          <Button style={{ padding: '8px 20px' }}>
            <UserPlus size={18} /> Follow
          </Button>
        </div>
      </div>

      {/* Preferences by rating */}
      <div style={{ padding: '20px' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700,
          color: 'var(--color-accent-orange)', marginBottom: 20,
        }}>
          {profile.display_name.split(' ')[0]}&apos;s Food Personality
        </h2>

        {RATINGS.filter(r => grouped[r].length > 0).map(r => {
          const { color, bg } = RATING_COLORS[r];
          return (
            <div key={r} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{RATING_EMOJIS[r]}</span>
                <h3 style={{
                  fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 700,
                  color,
                }}>
                  {RATING_LABELS[r]} ({grouped[r].length})
                </h3>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {grouped[r].map(p => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: bg,
                    borderRadius: 'var(--radius-full)',
                    padding: '6px 12px',
                    border: `1px solid ${color}22`,
                  }}>
                    <span style={{ fontSize: 16 }}>{p.foods.emoji}</span>
                    <span style={{
                      fontFamily: 'var(--font-ui)', fontSize: 13,
                      fontWeight: 500, color: 'var(--color-text-dark)',
                      textTransform: 'capitalize',
                    }}>
                      {p.foods.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {prefs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-muted)' }}>
              {profile.display_name} hasn&apos;t rated any foods yet.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
