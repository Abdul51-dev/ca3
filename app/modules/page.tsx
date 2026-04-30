'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Module {
  code: string;
  name: string;
  grade: number;
  letter: string;
  credits: number;
  progress: number;
  color: string;
}

interface Assignment {
  id: number;
  name: string;
  module_code: string;
  due: string;
  urgency: string;
}

const urgencyColor: Record<string, string> = {
  'urgent': '#dc2626', 'this week': '#d97706', 'on track': '#16a34a',
};

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [{ data: mods }, { data: assigns }] = await Promise.all([
        supabase.from('modules').select('*'),
        supabase.from('assignments').select('*'),
      ]);
      setModules(mods || []);
      setAssignments(assigns || []);
      setLoading(false);
    }
    fetchData();

    // realtime subscription — update when grades change
    const channel = supabase
      .channel('modules-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'modules' }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const avgGrade = modules.length ? Math.round(modules.reduce((s, m) => s + m.grade, 0) / modules.length) : 0;
  const totalCredits = modules.reduce((s, m) => s + m.credits, 0);
  const dueSoon = assignments.filter(a => a.urgency === 'urgent' || a.urgency === 'this week').length;
  const filteredAssignments = selected ? assignments.filter(a => a.module_code === selected) : assignments;

  if (loading) return (
    <main style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <p style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--muted)' }}>Loading...</p>
    </main>
  );

  return (
    <main style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '4px' }}>Module Tracker</h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Grades update automatically when you add assessments in the Grade Calculator</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        {[
          { val: `${avgGrade}%`, lbl: 'Average Grade', color: avgGrade >= 70 ? '#16a34a' : avgGrade >= 50 ? '#d97706' : '#dc2626' },
          { val: totalCredits, lbl: 'Total Credits', color: '#2563eb' },
          { val: dueSoon, lbl: 'Due Soon', color: '#dc2626' },
        ].map(({ val, lbl, color }) => (
          <div key={lbl} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px 24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.04em', color, marginBottom: '4px' }}>{val}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>{lbl}</div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--hint)', textTransform: 'uppercase' as const, letterSpacing: '0.12em', marginBottom: '16px' }}>semester 2 modules</p>

      {/* Module grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '36px' }}>
        {modules.map((m, i) => {
          const isSelected = selected === m.code;
          return (
            <div key={m.code} onClick={() => setSelected(isSelected ? null : m.code)} style={{
              background: 'var(--surface)',
              border: `1.5px solid ${isSelected ? m.color : 'var(--border)'}`,
              borderRadius: '16px', padding: '20px', cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isSelected ? `0 4px 20px ${m.color}25` : 'var(--shadow-sm)',
              transform: isSelected ? 'translateY(-3px)' : 'none',
              animationDelay: `${i * 0.05}s`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', background: 'var(--surface2)', padding: '3px 8px', borderRadius: '6px' }}>{m.code}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 700, color: m.color }}>{m.letter}</span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '14px', lineHeight: 1.3 }}>{m.name}</p>
              <div style={{ background: 'var(--surface2)', borderRadius: '4px', height: '5px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${m.progress}%`, height: '100%', borderRadius: '4px', background: m.color, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)' }}>
                <span>Grade</span>
                <span style={{ color: m.color, fontWeight: 600 }}>{m.grade}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignments */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em' }}>
          {selected ? `Assignments — ${selected}` : 'All Assignments'}
        </h2>
        {selected && (
          <button onClick={() => setSelected(null)} style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer' }}>
            Clear filter ✕
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
        {filteredAssignments.map(a => {
          const color = urgencyColor[a.urgency] || '#888';
          return (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', fontSize: '15px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontWeight: 500 }}>{a.name}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>{a.due}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', background: `${color}18`, color, fontWeight: 500 }}>{a.urgency}</span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
