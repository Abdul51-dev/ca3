'use client';

import { useState } from 'react';
import { DAYS, Day, menu, categoryColor, MealCategory } from '@/data/canteen';

const today = DAYS[Math.min(new Date().getDay() - 1, 4)] ?? 'Monday';

const ALL_CATEGORIES: MealCategory[] = ['Hot Meal', 'Grill', 'Vegetarian', 'Vegan', 'Soup', 'Dessert'];

export default function CanteenPage() {
  const [activeDay, setActiveDay] = useState<Day>(today);
  const [activeCategory, setActiveCategory] = useState<MealCategory | 'All'>('All');

  const items = menu[activeDay].filter(
    item => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <main style={{ padding: '24px', maxWidth: '680px' }}>

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--hint)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>
          main canteen · grangegorman
        </p>
        <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Mon–Fri 8:00–19:00 · Hot food served 11:30–15:00</p>
      </div>

      {/* Day selector */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {DAYS.map(day => (
          <button key={day} onClick={() => setActiveDay(day)} style={{
            flex: 1, fontFamily: 'var(--mono)', fontSize: '11px',
            background: day === activeDay ? 'var(--text)' : 'var(--surface)',
            border: '1px solid var(--border)',
            color: day === activeDay ? 'var(--surface)' : 'var(--muted)',
            padding: '8px 4px', borderRadius: '8px', cursor: 'pointer',
            transition: 'all 0.12s',
          }}>
            {day.slice(0, 3).toUpperCase()}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
        {(['All', ...ALL_CATEGORIES] as const).map(cat => {
          const active = activeCategory === cat;
          const color = cat === 'All' ? 'var(--text)' : categoryColor[cat as MealCategory];
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              fontFamily: 'var(--mono)', fontSize: '11px',
              padding: '4px 12px', borderRadius: '20px', cursor: 'pointer',
              border: `1px solid ${active ? color : 'var(--border)'}`,
              background: active ? `${color}15` : 'var(--surface)',
              color: active ? color : 'var(--muted)',
              transition: 'all 0.12s',
            }}>
              {cat}
            </button>
          );
        })}
      </div>

      {/* Menu items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, i) => {
          const color = categoryColor[item.category];
          return (
            <div key={i} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
            }}>
              {/* colour bar */}
              <div style={{ width: '3px', borderRadius: '2px', alignSelf: 'stretch', flexShrink: 0, background: color, marginTop: '2px' }} />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em' }}>{item.name}</p>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 500, marginLeft: '12px', flexShrink: 0 }}>
                    €{item.price.toFixed(2)}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '8px' }}>{item.description}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* category badge */}
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '10px',
                    padding: '2px 8px', borderRadius: '4px',
                    background: `${color}15`, color,
                  }}>{item.category}</span>

                  {/* calories */}
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--hint)' }}>
                    {item.calories} kcal
                  </span>

                  {/* allergens */}
                  {item.allergens.length > 0 && (
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--hint)' }}>
                      ⚠ {item.allergens.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </main>
  );
}
