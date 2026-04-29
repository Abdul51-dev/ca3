'use client';

import { useState, useEffect } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

interface Slot {
  id: number;
  day: string;
  time: string;
  duration: string;
  name: string;
  room: string;
  type: string;
  color: string;
}

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState('Mon');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from('timetable_slots')
        .select('*')
        .eq('day', activeDay)
        .order('time');
      setSlots(data || []);
      setExpanded(null);
      setLoading(false);
    }
    fetchSlots();
  }, [activeDay]);

  const typeColors: Record<string, string> = {
    Lecture: '#2563eb', Lab: '#16a34a', Tutorial: '#d97706',
  };

  return (
    <main style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '4px' }}>Weekly Schedule</h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Your classes for the week — click a card to expand</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {DAYS.map(day => (
          <button key={day} onClick={() => setActiveDay(day)} style={{
            flex: 1, fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 500,
            background: day === activeDay ? 'var(--text)' : 'var(--surface)',
            border: `1px solid ${day === activeDay ? 'var(--text)' : 'var(--border)'}`,
            color: day === activeDay ? 'var(--surface)' : 'var(--muted)',
            padding: '12px 8px', borderRadius: '12px', cursor: 'pointer',
            transition: 'all 0.15s ease',
            transform: day === activeDay ? 'translateY(-1px)' : 'none',
            boxShadow: day === activeDay ? 'var(--shadow-md)' : 'none',
          }}>
            {day.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height: '80px', background: 'var(--surface2)', borderRadius: '16px', animation: 'pulse 1.5s ease infinite' }} />
          ))}
        </div>
      ) : (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {slots.map((slot) => {
            const isExpanded = expanded === slot.id;
            const tColor = typeColors[slot.type] || '#888';
            return (
              <div
                key={slot.id}
                onClick={() => setExpanded(isExpanded ? null : slot.id)}
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${isExpanded ? slot.color : 'var(--border)'}`,
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: isExpanded ? 'flex-start' : 'center',
                  gap: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transform: isExpanded ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{ width: '4px', borderRadius: '3px', alignSelf: 'stretch', flexShrink: 0, background: slot.color, minHeight: '28px' }} />

                <div style={{ minWidth: '52px', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 500, color: 'var(--muted)' }}>{slot.time}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)' }}>{slot.duration}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: isExpanded ? '10px' : '3px' }}>{slot.name}</p>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span>📍 {slot.room}</span>
                    {isExpanded && <span>⏱ {slot.duration}</span>}
                  </div>
                  {isExpanded && (
                    <div className="fade-in" style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', background: `${tColor}15`, color: tColor, border: `1px solid ${tColor}30` }}>
                        {slot.type}
                      </span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                        {slot.day}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '18px', color: 'var(--hint)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
                  ⌄
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
