'use client';

import { useState, useEffect } from 'react';

interface Building {
  id: string; label: string; name: string; description: string;
  category: string; color: string; left_pct: number; top_pct: number; pills: string[];
}

export default function MapPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [active, setActive] = useState<Building | null>(null);

  useEffect(() => {
    async function fetchBuildings() {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase.from('buildings').select('*');
      setBuildings(data || []);
      const cs = (data || []).find((b: Building) => b.id === 'CS');
      if (cs) setActive(cs);
    }
    fetchBuildings();
  }, []);

  return (
    <main style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '4px' }}>Campus Map</h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Click a building to see details</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* Map */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ position: 'relative', height: '380px', background: '#f7f7f5' }}>
            <svg width="100%" height="380" viewBox="0 0 480 380" style={{ position: 'absolute', top: 0, left: 0 }}>
              <rect width="480" height="380" fill="#f7f7f5" />
              <rect x="176" y="0" width="12" height="380" fill="#ebebea" />
              <rect x="0" y="180" width="480" height="12" fill="#ebebea" />
              <rect x="278" y="0" width="9" height="380" fill="#f0f0ee" />
              <rect x="28" y="30" width="120" height="100" rx="8" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
              <text x="88" y="85" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="10">Block A</text>
              <rect x="28" y="210" width="120" height="100" rx="8" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
              <text x="88" y="265" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="10">Block B</text>
              <rect x="204" y="30" width="66" height="60" rx="8" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
              <text x="237" y="65" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="9">Library</text>
              <rect x="204" y="210" width="66" height="80" rx="8" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
              <text x="237" y="248" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="9">Student</text>
              <text x="237" y="262" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="9">Hub</text>
              <rect x="300" y="30" width="152" height="140" rx="8" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
              <text x="376" y="103" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="10">Computing</text>
              <text x="376" y="118" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="9">Faculty</text>
              <rect x="300" y="222" width="70" height="80" rx="8" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
              <text x="335" y="266" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="9">Sports</text>
              <rect x="382" y="222" width="70" height="80" rx="8" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
              <text x="417" y="266" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="9">Canteen</text>
              <ellipse cx="237" cy="162" rx="26" ry="18" fill="#e2ede4" stroke="#c8dccb" strokeWidth="1" />
            </svg>

            {buildings.map(b => (
              <button key={b.id} onClick={() => setActive(b)} style={{
                position: 'absolute',
                left: `${b.left_pct}%`, top: `${b.top_pct}%`,
                transform: `translate(-50%,-50%) scale(${active?.id === b.id ? 1.25 : 1})`,
                width: '36px', height: '36px', borderRadius: '50%',
                border: `2px solid ${active?.id === b.id ? b.color : 'rgba(0,0,0,0.1)'}`,
                background: active?.id === b.id ? b.color : '#ffffff',
                color: active?.id === b.id ? '#ffffff' : b.color,
                cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 600,
                transition: 'all 0.2s ease',
                zIndex: 2,
                boxShadow: active?.id === b.id ? `0 4px 16px ${b.color}40` : '0 2px 6px rgba(0,0,0,0.08)',
              }}>
                {b.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
            {[['academic','#1a1a18'],['library','#2563eb'],['social','#d97706'],['sports','#16a34a'],['food','#dc2626']].map(([cat, color]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />{cat}
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {active && (
          <div className="fade-up" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '100px' }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: active.color, marginBottom: '16px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '10px' }}>{active.name}</h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '20px' }}>{active.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(active.pills || []).map((p: string) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--surface2)', borderRadius: '10px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>
                  {p}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
