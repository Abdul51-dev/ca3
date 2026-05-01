'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Module {
  id: number;
  name: string;
  code: string;
  credits: number;
  module_code: string | null;
}

interface Assessment {
  id: number;
  module_id: number;
  name: string;
  weight: number;
  grade: number | null;
}

function getLetterGrade(grade: number) {
  if (grade >= 70) return { letter: 'A', color: '#16a34a' };
  if (grade >= 60) return { letter: 'B', color: '#2563eb' };
  if (grade >= 50) return { letter: 'C', color: '#d97706' };
  if (grade >= 40) return { letter: 'D', color: '#ea580c' };
  return { letter: 'F', color: '#dc2626' };
}

function calcModuleGrade(assessments: Assessment[]) {
  const filled = assessments.filter(a => a.grade !== null && a.grade !== undefined);
  if (filled.length === 0) return null;
  const totalWeight = filled.reduce((s, a) => s + a.weight, 0);
  if (totalWeight === 0) return null;
  return filled.reduce((s, a) => s + (a.grade! * a.weight), 0) / totalWeight;
}

const MODULE_CODES = ['CS2101', 'CS2202', 'CS2303', 'CS2104', 'MA2205', 'CS2406'];

export default function GradesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const [newModName, setNewModName] = useState('');
  const [newModCode, setNewModCode] = useState('');
  const [newModCredits, setNewModCredits] = useState('5');
  const [newModuleCode, setNewModuleCode] = useState('');
  const [showModForm, setShowModForm] = useState(false);

  const [newAssName, setNewAssName] = useState('');
  const [newAssWeight, setNewAssWeight] = useState('');
  const [newAssGrade, setNewAssGrade] = useState('');
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    const [{ data: mods }, { data: ass }] = await Promise.all([
      supabase.from('user_modules').select('*').order('created_at'),
      supabase.from('user_assessments').select('*').order('created_at'),
    ]);
    setModules(mods || []);
    setAssessments(ass || []);
    setLoading(false);
  }

  async function addModule() {
    if (!newModName || !newModCode) return;
    await supabase.from('user_modules').insert({
      name: newModName,
      code: newModCode,
      credits: parseInt(newModCredits) || 5,
      module_code: newModuleCode || null,
    });
    setNewModName(''); setNewModCode(''); setNewModCredits('5'); setNewModuleCode('');
    setShowModForm(false);
    fetchAll();
  }

  async function deleteModule(id: number) {
    await supabase.from('user_modules').delete().eq('id', id);
    fetchAll();
  }

  async function addAssessment(moduleId: number) {
    if (!newAssName || !newAssWeight) return;
    const grade = newAssGrade ? parseFloat(newAssGrade) : null;
    await supabase.from('user_assessments').insert({
      module_id: moduleId,
      name: newAssName,
      weight: parseFloat(newAssWeight),
      grade,
    });

    // sync grade to modules table if linked
    const mod = modules.find(m => m.id === moduleId);
    if (mod?.module_code && grade !== null) {
      const modAssessments = [...assessments.filter(a => a.module_id === moduleId), { id: 0, module_id: moduleId, name: newAssName, weight: parseFloat(newAssWeight), grade }];
      const newGrade = calcModuleGrade(modAssessments);
      if (newGrade !== null) {
        const lg = getLetterGrade(newGrade);
        await supabase.from('modules').update({
          grade: Math.round(newGrade),
          letter: lg.letter,
        }).eq('code', mod.module_code);
      }
    }

    setNewAssName(''); setNewAssWeight(''); setNewAssGrade('');
    setActiveModuleId(null);
    fetchAll();
  }

  async function updateGrade(assessmentId: number, gradeStr: string, moduleId: number) {
    const grade = gradeStr ? parseFloat(gradeStr) : null;
    await supabase.from('user_assessments').update({ grade }).eq('id', assessmentId);

    // sync to modules table
    const mod = modules.find(m => m.id === moduleId);
    if (mod?.module_code) {
      const updatedAssessments = assessments.map(a =>
        a.id === assessmentId ? { ...a, grade } : a
      ).filter(a => a.module_id === moduleId);
      const newGrade = calcModuleGrade(updatedAssessments);
      if (newGrade !== null) {
        const lg = getLetterGrade(newGrade);
        await supabase.from('modules').update({
          grade: Math.round(newGrade),
          letter: lg.letter,
        }).eq('code', mod.module_code);
      }
    }
    fetchAll();
  }

  async function deleteAssessment(id: number) {
    await supabase.from('user_assessments').delete().eq('id', id);
    fetchAll();
  }

  const moduleGrades = modules.map(m => {
    const mAssessments = assessments.filter(a => a.module_id === m.id);
    const grade = calcModuleGrade(mAssessments);
    return { ...m, grade, assessments: mAssessments };
  });

  const validGrades = moduleGrades.filter(m => m.grade !== null);
  const overallAvg = validGrades.length
    ? validGrades.reduce((s, m) => s + m.grade! * m.credits, 0) / validGrades.reduce((s, m) => s + m.credits, 0)
    : null;

  const inputStyle = {
    fontFamily: 'var(--sans)', fontSize: '14px',
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '10px 14px', outline: 'none',
    color: 'var(--text)', width: '100%',
  };

  const noSpinInputStyle = {
    ...inputStyle,
    appearance: 'textfield',
    MozAppearance: 'textfield',
  };

  const btnStyle = (color = 'var(--text)') => ({
    fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500 as const,
    background: color, color: '#fff', border: 'none',
    borderRadius: '10px', padding: '10px 18px', cursor: 'pointer' as const,
  });

  return (
    <main style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '4px' }}>Grade Calculator</h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Add modules and assessments — grades sync to your Module Tracker automatically</p>
      </div>

      {/* Overall stats */}
      {overallAvg !== null && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          {[
            { val: `${overallAvg.toFixed(1)}%`, lbl: 'Overall Average', color: getLetterGrade(overallAvg).color },
            { val: getLetterGrade(overallAvg).letter, lbl: 'Overall Grade', color: getLetterGrade(overallAvg).color },
            { val: modules.length, lbl: 'Modules', color: '#2563eb' },
            { val: validGrades.length, lbl: 'Graded', color: '#16a34a' },
          ].map(({ val, lbl, color }) => (
            <div key={lbl} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.04em', color, marginBottom: '4px' }}>{val}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>{lbl}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add module */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em' }}>Your Modules</h2>
        <button onClick={() => setShowModForm(s => !s)} style={{ ...btnStyle(), background: showModForm ? '#888' : 'var(--text)' }}>
          {showModForm ? '✕ Cancel' : '+ Add Module'}
        </button>
      </div>

      {showModForm && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '14px' }}>New Module</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', gap: '10px', marginBottom: '10px' }}>
            <input placeholder="Module name" value={newModName} onChange={e => setNewModName(e.target.value)} style={inputStyle} />
            <input placeholder="Your code" value={newModCode} onChange={e => setNewModCode(e.target.value)} style={inputStyle} />
            <input placeholder="Credit per mod" value={newModCredits} onChange={e => setNewModCredits(e.target.value)} style={noSpinInputStyle} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Link to existing module (optional — syncs grade to Module Tracker):</p>
            <select value={newModuleCode} onChange={e => setNewModuleCode(e.target.value)} style={inputStyle}>
              <option value="">-- Don't link --</option>
              {MODULE_CODES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={addModule} style={btnStyle('#16a34a')}>Save Module</button>
        </div>
      )}

      {loading ? (
        <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)' }}>Loading...</p>
      ) : modules.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '16px', padding: '40px', textAlign: 'center' as const }}>
          <p style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '8px' }}>No modules yet</p>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--hint)' }}>Click "+ Add Module" to get started</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {moduleGrades.map((m) => {
            const isExpanded = expandedModule === m.id;
            const lg = m.grade !== null ? getLetterGrade(m.grade) : null;
            const totalWeight = m.assessments.reduce((s, a) => s + a.weight, 0);

            return (
              <div key={m.id} style={{
                background: 'var(--surface)',
                border: `1.5px solid ${isExpanded ? (lg?.color || 'var(--border)') : 'var(--border)'}`,
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}>
                <div onClick={() => setExpandedModule(isExpanded ? null : m.id)} style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', background: 'var(--surface2)', padding: '2px 8px', borderRadius: '6px' }}>{m.code}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)' }}>{m.credits} credits</span>
                      {m.module_code && (
                        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#16a34a', background: '#16a34a12', padding: '2px 8px', borderRadius: '6px' }}>
                          🔗 synced to {m.module_code}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.02em' }}>{m.name}</p>
                  </div>

                  <div style={{ textAlign: 'center' as const, minWidth: '64px' }}>
                    {m.grade !== null ? (
                      <>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: lg?.color, letterSpacing: '-0.03em' }}>{m.grade.toFixed(1)}%</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: lg?.color, fontWeight: 600 }}>{lg?.letter}</div>
                      </>
                    ) : (
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--hint)' }}>No grades</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={e => { e.stopPropagation(); deleteModule(m.id); }} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '13px', color: 'var(--muted)' }}>🗑</button>
                    <div style={{ fontSize: '18px', color: 'var(--hint)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>⌄</div>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', background: 'var(--bg)' }}>
                    {/* Weight bar */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>Weight assigned</span>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: totalWeight > 100 ? '#dc2626' : totalWeight === 100 ? '#16a34a' : 'var(--muted)' }}>{totalWeight}% / 100%</span>
                      </div>
                      <div style={{ background: 'var(--border)', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(totalWeight, 100)}%`, height: '100%', borderRadius: '4px', background: totalWeight > 100 ? '#dc2626' : totalWeight === 100 ? '#16a34a' : '#2563eb', transition: 'width 0.4s' }} />
                      </div>
                    </div>

                    {/* Assessments */}
                    {m.assessments.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '16px' }}>
                        {m.assessments.map(a => (
                          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 16px' }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{a.name}</p>
                              <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>{a.weight}% weight</p>
                            </div>
                            <input
                              type="number"
                              placeholder="Grade %"
                              defaultValue={a.grade ?? ''}
                              onBlur={e => updateGrade(a.id, e.target.value, m.id)}
                              style={{ ...inputStyle, width: '100px', textAlign: 'center' as const }}
                            />
                            {a.grade !== null && (
                              <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 700, color: getLetterGrade(a.grade).color, minWidth: '28px' }}>
                                {getLetterGrade(a.grade).letter}
                              </span>
                            )}
                            <button onClick={() => deleteAssessment(a.id)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', color: 'var(--muted)' }}>🗑</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add assessment */}
                    {activeModuleId === m.id ? (
                      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                        <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '12px' }}>New Assessment</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: '8px', marginBottom: '10px' }}>
                          <input placeholder="Name (e.g. Final Exam)" value={newAssName} onChange={e => setNewAssName(e.target.value)} style={inputStyle} />
                          <input placeholder="Weight %" type="number" value={newAssWeight} onChange={e => setNewAssWeight(e.target.value)} style={inputStyle} />
                          <input placeholder="Grade %" type="number" value={newAssGrade} onChange={e => setNewAssGrade(e.target.value)} style={inputStyle} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => addAssessment(m.id)} style={btnStyle('#16a34a')}>Save</button>
                          <button onClick={() => setActiveModuleId(null)} style={btnStyle('#888')}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setActiveModuleId(m.id)} style={{ ...btnStyle('#2563eb'), fontSize: '13px' }}>
                        + Add Assessment
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
