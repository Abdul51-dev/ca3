'use client';
// app/recommend/page.tsx

import { useState } from 'react';

type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const ALL_ALLERGENS = ['Gluten', 'Dairy', 'Egg', 'Fish', 'Sesame'];

interface Recommendation {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  calories: number;
  avg_rating: number;
  healthiness: number;
  score: number;
  allergens: string[];
}

export default function RecommendPage() {
  const [day, setDay] = useState<Day>('Monday');
  const [maxCalories, setMaxCalories] = useState(700);
  const [maxPrice, setMaxPrice] = useState(8);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [results, setResults] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleAllergen = (a: string) => {
    setAllergens(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxCalories, maxPrice, allergens, day }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.recommendations);
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        🍽️ Food Recommendation
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Tell us your preferences and we'll recommend the best meals for you today.
      </p>

      <label style={labelStyle}>Day</label>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {DAYS.map(d => (
          <button key={d} onClick={() => setDay(d)} style={{
            ...pillStyle,
            background: day === d ? '#1a1a18' : '#f3f4f6',
            color: day === d ? '#fff' : '#1a1a18',
          }}>{d}</button>
        ))}
      </div>

      <label style={labelStyle}>Max Calories: <strong>{maxCalories} kcal</strong></label>
      <input type="range" min={200} max={800} step={50} value={maxCalories}
        onChange={e => setMaxCalories(Number(e.target.value))}
        style={{ width: '100%', marginBottom: '1.5rem' }} />

      <label style={labelStyle}>Max Price: <strong>€{maxPrice.toFixed(2)}</strong></label>
      <input type="range" min={2} max={9} step={0.5} value={maxPrice}
        onChange={e => setMaxPrice(Number(e.target.value))}
        style={{ width: '100%', marginBottom: '1.5rem' }} />

      <label style={labelStyle}>Exclude Allergens</label>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {ALL_ALLERGENS.map(a => (
          <button key={a} onClick={() => toggleAllergen(a)} style={{
            ...pillStyle,
            background: allergens.includes(a) ? '#dc2626' : '#f3f4f6',
            color: allergens.includes(a) ? '#fff' : '#1a1a18',
          }}>{allergens.includes(a) ? '✕ ' : ''}{a}</button>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={loading} style={{
        width: '100%', padding: '0.85rem', background: '#1a1a18', color: '#fff',
        border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '2rem',
      }}>
        {loading ? 'Finding meals...' : 'Recommend meals'}
      </button>

      {error && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}

      {results.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
            Top picks for you on {day}
          </h2>
          {results.map((item, i) => (
            <div key={item.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>#{i + 1} · {item.category}</span>
                  <h3 style={{ margin: '0.25rem 0', fontSize: '1.1rem', fontWeight: 700 }}>{item.name}</h3>
                  <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>{item.description}</p>
                </div>
                <div style={{ textAlign: 'right', minWidth: 70 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>€{item.price.toFixed(2)}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{item.calories} kcal</div>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                  <span>Match score</span>
                  <span><strong>{item.score}%</strong></span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 99, height: 6, marginTop: 4 }}>
                  <div style={{ width: `${item.score}%`, height: '100%', background: '#16a34a', borderRadius: 99, transition: 'width 0.5s ease' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                <span style={tagStyle}>⭐ {item.avg_rating}</span>
                <span style={tagStyle}>💚 Health {item.healthiness}/10</span>
                {item.allergens.length === 0 && (
                  <span style={{ ...tagStyle, background: '#dcfce7', color: '#15803d' }}>Allergen free</span>
                )}
              </div>
            </div>
          ))}

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem', marginTop: '1.5rem', fontSize: '0.85rem', color: '#555' }}>
            <strong>How it works:</strong> This recommendation uses a weighted scoring model —
            rating (40%), popularity (30%), healthiness (20%), and value for money (10%).
            Items with your excluded allergens or outside your calorie/price limits are filtered out first.
          </div>
        </>
      )}

      {results.length === 0 && !loading && !error && (
        <p style={{ textAlign: 'center', color: '#888' }}>No results yet — set your preferences above.</p>
      )}
    </main>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' };
const pillStyle: React.CSSProperties = { padding: '0.4rem 0.9rem', borderRadius: 99, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', transition: 'all 0.15s' };
const cardStyle: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };
const tagStyle: React.CSSProperties = { background: '#f3f4f6', borderRadius: 99, padding: '0.2rem 0.6rem', fontSize: '0.8rem', color: '#444' };
