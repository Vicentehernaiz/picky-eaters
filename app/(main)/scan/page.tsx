'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Sparkle, ArrowRight } from '@phosphor-icons/react';
import Header from '@/src/components/layout/Header';
import PageWrapper from '@/src/components/layout/PageWrapper';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Spinner from '@/src/components/ui/Spinner';
import { useToast } from '@/src/components/ui/Toast';

interface Ingredient {
  name: string;
  emoji: string;
  category: string;
  confidence: number;
}

export default function ScanPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (!file.type.match(/image\//)) {
      toast('Please select an image file', 'error');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setIngredients([]);

    const reader = new FileReader();
    reader.onload = async e => {
      const base64 = (e.target?.result as string).split(',')[1];
      setLoading(true);
      try {
        const res = await fetch('/api/foods/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setIngredients(data.ingredients ?? []);
        toast(`Found ${data.ingredients?.length ?? 0} ingredients!`, 'success');
      } catch (err: any) {
        toast(err.message ?? 'Failed to analyze image', 'error');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <PageWrapper>
      <Header title="Scan Food 📷" />

      <div style={{ padding: '20px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Take a photo of a dish, menu, or recipe — AI will identify all the ingredients.
        </p>

        {/* Upload Zone */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          style={{ display: 'none' }}
        />

        {!preview ? (
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-card)',
              padding: '48px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
              marginBottom: 20,
              background: 'var(--color-bg-white)',
              transition: 'var(--transition-fast)',
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--color-bg-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Camera size={32} color="var(--color-accent-orange)" weight="fill" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: 4 }}>
                Tap to take a photo
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}>
                or choose from gallery
              </p>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 20 }}>
            <img
              src={preview}
              alt="preview"
              style={{
                width: '100%', borderRadius: 'var(--radius-card)',
                objectFit: 'cover', maxHeight: 240,
              }}
            />
            <Button
              variant="secondary"
              onClick={() => { setPreview(null); setIngredients([]); }}
              style={{ marginTop: 12, width: '100%' }}
            >
              <Upload size={16} /> Try another
            </Button>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '32px 0' }}>
            <Spinner size={36} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-text-muted)' }}>
              AI is analyzing your image...
            </p>
          </div>
        )}

        {ingredients.length > 0 && (
          <div>
            <h3 style={{
              fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 700,
              color: 'var(--color-text-dark)', marginBottom: 12,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Sparkle weight="fill" color="var(--color-accent-orange)" />
              Detected Ingredients
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {ingredients.map((ing, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'var(--color-bg-white)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  boxShadow: 'var(--shadow-xs)',
                  border: '1px solid var(--color-border)',
                }}>
                  <span style={{ fontSize: 18 }}>{ing.emoji}</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--color-text-dark)', textTransform: 'capitalize' }}>
                    {ing.name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: 10,
                    color: 'var(--color-text-muted)',
                    background: 'var(--color-bg-contrast)',
                    borderRadius: 4, padding: '1px 4px',
                  }}>
                    {Math.round(ing.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>

            <Button fullWidth>
              <ArrowRight size={16} /> Add to My List
            </Button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
