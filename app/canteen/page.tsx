'use client';

import { useState, useEffect } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const ALL_CATEGORIES = ['All', 'Hot Meal', 'Grill', 'Vegetarian', 'Vegan', 'Soup', 'Dessert'];

const categoryColor: Record<string, string> = {
  'Hot Meal': '#1a1a18', 'Grill': '#dc2626', 'Vegetarian': '#16a34a',
  'Vegan': '#15803d', 'Soup': '#d97706', 'Dessert': '#7c3aed',
};

interface CanteenItem {
  id: number; day: string; name: string; description: string;
  price: number; category: string; calories: number; allergens: string[];
}

const today = DAYS[Math.min(new Date().getDay() - 1, 4)] ?? 'Monday';

export default function CanteenPage() {
  const [activeDay, setActiveDay] = useState(today);
  const [activeCategory, setActiveCategory] = useState('All');
  const [items, setItems] = useState<CanteenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase.from('canteen_items').select('*').eq('day', activeDay);
      setItems(data || []);
      setExpanded(null);
      setLoading(false);
    }
    fetchItems();
  }, [activeDay]);

  const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  return (
    <main style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '4px' }}>Canteen Menu</h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Mon–Fri 8:00–19:00 · Hot food served 11:30–15:00</p>
      </div>

      {/* Day selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {DAYS.map(day => (
          <button key={day} onClick={() => setActiveDay(day)} style={{
            flex: 1, fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 500,
            background: day === activeDay ? 'var(--text)' : 'var(--surface)',
            border: `1px solid ${day === activeDay ? 'var(--text)' : 'var(--border)'}`,
            color: day === activeDay ? 'var(--surface)' : 'var(--muted)',
            padding: '12px 8px', borderRadius: '12px', cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: day === activeDay ? 'var(--shadow-md)' : 'none',
            transform: day === activeDay ? 'translateY(-1px)' : 'none',
          }}>
            {day.slice(0, 3).toUpperCase()}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
        {ALL_CATEGORIES.map(cat => {
          const active = activeCategory === cat;
          const color = cat === 'All' ? 'var(--text)' : categoryColor[cat];
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 500,
              padding: '7px 16px', borderRadius: '20px', cursor: 'pointer',
              border: `1.5px solid ${active ? color : 'var(--border)'}`,
              background: active ? `${color}12` : 'var(--surface)',
              color: active ? color : 'var(--muted)',
              transition: 'all 0.15s ease',
              boxShadow: active ? `0 2px 8px ${color}20` : 'none',
            }}>
              {cat}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: '90px', background: 'var(--surface2)', borderRadius: '16px' }} />
          ))}
        </div>
      ) : (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((item) => {
            const color = categoryColor[item.category] || '#888';
            const isExpanded = expanded === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setExpanded(isExpanded ? null : item.id)}
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${isExpanded ? color : 'var(--border)'}`,
                  borderRadius: '16px', padding: '20px 24px',
                  display: 'flex', alignItems: isExpanded ? 'flex-start' : 'center',
                  gap: '20px', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transform: isExpanded ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{ width: '4px', borderRadius: '3px', alignSelf: 'stretch', flexShrink: 0, background: color, minHeight: '28px' }} />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isExpanded ? '8px' : '0' }}>
                    <p style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em' }}>{item.name}</p>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 600, marginLeft: '16px', flexShrink: 0 }}>€{Number(item.price).toFixed(2)}</span>
                  </div>

                  {isExpanded && (
                    <div className="fade-in">
                      <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '12px' }}>{item.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: `${color}15`, color, border: `1px solid ${color}30` }}>{item.category}</span>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', background: 'var(--surface2)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--border)' }}>{item.calories} kcal</span>
                        {item.allergens?.length > 0 && (
                          <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#d97706', background: '#d9770610', padding: '4px 12px', borderRadius: '20px', border: '1px solid #d9770630' }}>⚠ {item.allergens.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {!isExpanded && (
                    <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>{item.description.slice(0, 60)}...</p>
                  )}
                </div>

                <div style={{ fontSize: '18px', color: 'var(--hint)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>⌄</div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
