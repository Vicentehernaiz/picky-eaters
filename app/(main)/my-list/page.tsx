'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, MagnifyingGlass } from '@phosphor-icons/react';
import Header from '@/src/components/layout/Header';
import PageWrapper from '@/src/components/layout/PageWrapper';
import FoodCard from '@/src/components/food/FoodCard';
import FoodRatingPicker from '@/src/components/food/FoodRatingPicker';
import CategoryFilter from '@/src/components/food/CategoryFilter';
import Modal from '@/src/components/ui/Modal';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';
import Spinner from '@/src/components/ui/Spinner';
import { useToast } from '@/src/components/ui/Toast';
import { useAuth } from '@/src/context/AuthContext';
import { RATINGS, RATING_LABELS, RATING_EMOJIS, RATING_COLORS } from '@/shared/constants';
import type { Rating } from '@/shared/constants';

interface FoodPref {
  id: string;
  food_id: string;
  rating: Rating;
  intensity: number;
  notes: string;
  foods: {
    id: string;
    name: string;
    emoji: string;
    category: string;
  };
}

interface FoodLibItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

const RATING_FILTER_TABS = ['all', ...RATINGS] as const;

export default function MyListPage() {
  const { session } = useAuth();
  const { toast } = useToast();

  const [prefs, setPrefs] = useState<FoodPref[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FoodPref | null>(null);
  const [foodSearch, setFoodSearch] = useState('');
  const [foodResults, setFoodResults] = useState<FoodLibItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodLibItem | null>(null);
  const [pickedRating, setPickedRating] = useState<Rating | undefined>(undefined);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchingFoods, setSearchingFoods] = useState(false);

  const token = session?.access_token;

  const fetchPrefs = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch('/api/preferences', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPrefs(data.preferences ?? []);
    } catch {
      toast('Could not load your list', 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchPrefs(); }, [fetchPrefs]);

  // Search food library
  useEffect(() => {
    if (!foodSearch.trim()) { setFoodResults([]); return; }
    const t = setTimeout(async () => {
      setSearchingFoods(true);
      try {
        const res = await fetch(`/api/foods/library?search=${encodeURIComponent(foodSearch)}&limit=10`);
        const data = await res.json();
        setFoodResults(data.foods ?? []);
      } finally {
        setSearchingFoods(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [foodSearch]);

  const openAdd = () => {
    setEditing(null);
    setSelectedFood(null);
    setFoodSearch('');
    setFoodResults([]);
    setPickedRating(undefined);
    setIntensity(3);
    setNotes('');
    setModalOpen(true);
  };

  const openEdit = (pref: FoodPref) => {
    setEditing(pref);
    setSelectedFood(pref.foods);
    setFoodSearch(pref.foods.name);
    setPickedRating(pref.rating);
    setIntensity(pref.intensity ?? 3);
    setNotes(pref.notes ?? '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedFood && !foodSearch.trim()) {
      toast('Select or type a food name', 'error');
      return;
    }
    if (!pickedRating) {
      toast('Pick a rating', 'error');
      return;
    }
    if (!token) { toast('Please log in', 'error'); return; }
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/preferences/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ rating: pickedRating, intensity, notes }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast('Updated!', 'success');
      } else {
        const res = await fetch('/api/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            foodId: selectedFood?.id,
            foodName: !selectedFood ? foodSearch.trim() : undefined,
            foodEmoji: !selectedFood ? '🍴' : undefined,
            rating: pickedRating,
            intensity,
            notes,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast('Added to your list!', 'success');
      }
      setModalOpen(false);
      fetchPrefs();
    } catch (err: any) {
      toast(err.message ?? 'Could not save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pref: FoodPref) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/preferences/${pref.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast('Removed from your list', 'info');
      fetchPrefs();
    } catch {
      toast('Could not delete', 'error');
    }
  };

  // Filter
  const filtered = prefs.filter(p => {
    if (ratingFilter !== 'all' && p.rating !== ratingFilter) return false;
    if (categoryFilter !== 'all' && p.foods.category !== categoryFilter) return false;
    if (searchQuery && !p.foods.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <PageWrapper>
      <Header title="My Food List" />

      <div style={{ padding: '16px 20px 0' }}>
        {/* Rating filter pills */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
          {RATING_FILTER_TABS.map(r => {
            const active = ratingFilter === r;
            const { color, bg } = r !== 'all' ? RATING_COLORS[r as Rating] : { color: '#fff', bg: 'var(--color-accent-orange)' };
            return (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: active ? (r === 'all' ? 'var(--color-accent-orange)' : bg) : 'var(--color-bg-white)',
                  color: active ? (r === 'all' ? '#fff' : color) : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'var(--transition-fast)',
                }}
              >
                {r !== 'all' && <span>{RATING_EMOJIS[r as Rating]}</span>}
                {r === 'all' ? 'All' : RATING_LABELS[r as Rating]}
              </button>
            );
          })}
        </div>

        {/* Category filter */}
        <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search foods..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlass size={18} />}
          />
        </div>

        {/* Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}>
            {filtered.length} food{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Food list */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 100 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <Spinner size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '48px 20px', textAlign: 'center',
          }}>
            <div style={{
              fontSize: 56, marginBottom: 16, lineHeight: 1,
            }}>🥗</div>
            <h4 style={{
              fontFamily: 'var(--font-ui)', fontSize: 17, fontWeight: 600,
              color: 'var(--color-text-dark)', marginBottom: 8,
            }}>
              {prefs.length === 0 ? 'Start building your list!' : 'No foods match your filter'}
            </h4>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 14,
              color: 'var(--color-text-muted)', maxWidth: 240,
            }}>
              {prefs.length === 0
                ? 'Add foods you love, like, or hate to share your taste personality'
                : 'Try adjusting the filters above'}
            </p>
          </div>
        ) : (
          filtered.map(pref => (
            <FoodCard
              key={pref.id}
              emoji={pref.foods.emoji}
              name={pref.foods.name}
              category={pref.foods.category}
              rating={pref.rating}
              intensity={pref.intensity}
              notes={pref.notes}
              onEdit={() => openEdit(pref)}
              onDelete={() => handleDelete(pref)}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={openAdd}
        style={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          width: 56, height: 56,
          borderRadius: '50%',
          background: 'var(--color-accent-orange)',
          border: 'none',
          boxShadow: 'var(--shadow-button)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 200,
          transition: 'var(--transition-spring)',
        }}
      >
        <Plus size={28} weight="bold" color="#fff" />
      </button>

      {/* Add/Edit Bottom Sheet */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Food' : 'Add Food'}
        bottomSheet
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Food search */}
          <div>
            <Input
              label={editing ? 'Food' : 'Search food library'}
              placeholder="e.g. avocado, salmon..."
              value={editing ? selectedFood?.name ?? '' : foodSearch}
              onChange={e => { if (!editing) setFoodSearch(e.target.value); }}
              disabled={!!editing}
              leftIcon={<MagnifyingGlass size={18} />}
            />

            {/* Results dropdown */}
            {!editing && foodResults.length > 0 && (
              <div style={{
                background: 'var(--color-bg-white)',
                borderRadius: 12,
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
                marginTop: 4,
                border: '1px solid var(--color-border)',
              }}>
                {foodResults.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { setSelectedFood(f); setFoodSearch(f.name); setFoodResults([]); }}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: selectedFood?.id === f.id ? 'var(--color-bg-contrast)' : 'none',
                      border: 'none', borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{f.emoji}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, color: 'var(--color-text-dark)', textTransform: 'capitalize' }}>
                      {f.name}
                    </span>
                    <span style={{
                      marginLeft: 'auto',
                      fontFamily: 'var(--font-body)', fontSize: 11,
                      color: 'var(--color-text-muted)',
                      background: 'var(--color-bg-contrast)',
                      borderRadius: 4, padding: '2px 6px',
                    }}>
                      {f.category}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {!editing && searchingFoods && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                <Spinner size={20} />
              </div>
            )}
          </div>

          {/* Rating picker */}
          <div>
            <p style={{
              fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
              color: 'var(--color-text-body)', letterSpacing: '0.02em',
              marginBottom: 10,
            }}>
              How do you feel about it?
            </p>
            <FoodRatingPicker value={pickedRating} onChange={setPickedRating} />
          </div>

          {/* Intensity */}
          {pickedRating && ['love', 'like', 'dislike', 'hate'].includes(pickedRating) && (
            <div>
              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
                color: 'var(--color-text-body)', marginBottom: 8,
              }}>
                Intensity: {intensity}/5
              </p>
              <input
                type="range"
                min={1} max={5}
                value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-accent-orange)' }}
              />
            </div>
          )}

          {/* Notes */}
          <Input
            label="Notes (optional)"
            placeholder="e.g. only if well cooked"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />

          <Button
            fullWidth
            onClick={handleSave}
            loading={saving}
            disabled={!pickedRating || (!selectedFood && !foodSearch.trim())}
          >
            {editing ? 'Save Changes' : 'Add to My List'}
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
