'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LostItem {
  id: number;
  type: string;
  item_name: string;
  description: string;
  location: string;
  contact: string;
  status: string;
  created_at: string;
}

export default function LostFoundPage() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'lost', item_name: '', description: '', location: '', contact: '' });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const { data } = await supabase.from('lost_found').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  }

  async function addItem() {
    if (!form.item_name || !form.location) return;
    await supabase.from('lost_found').insert({ ...form, status: 'open' });
    setForm({ type: 'lost', item_name: '', description: '', location: '', contact: '' });
    setShowForm(false);
    fetchItems();
  }

  async function markResolved(id: number) {
    await supabase.from('lost_found').update({ status: 'resolved' }).eq('id', id);
    fetchItems();
  }

  async function deleteItem(id: number) {
    await supabase.from('lost_found').delete().eq('id', id);
    fetchItems();
  }

  const filtered = items.filter(i => {
    const matchSearch =
      i.item_name.toLowerCase().includes(search.toLowerCase()) ||
      i.description?.toLowerCase().includes(search.toLowerCase()) ||
      i.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || i.type === filterType;
    const matchStatus = filterStatus === 'All' || i.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const lostCount = items.filter(i => i.type === 'lost' && i.status === 'open').length;
  const foundCount = items.filter(i => i.type === 'found' && i.status === 'open').length;
  const resolvedCount = items.filter(i => i.status === 'resolved').length;

  const inputStyle = {
    fontFamily: 'var(--sans)', fontSize: '14px',
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '10px 14px', outline: 'none',
    color: 'var(--text)', width: '100%',
  };

  return (
    <main style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '4px' }}>Lost & Found</h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Report or search for lost items on campus</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{
          fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500,
          background: showForm ? '#888' : 'var(--text)', color: '#fff',
          border: 'none', borderRadius: '10px', padding: '10px 18px', cursor: 'pointer',
        }}>
          {showForm ? '✕ Cancel' : '+ Report Item'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '28px' }}>
        {[
          { val: lostCount, lbl: 'Lost Items', color: '#dc2626' },
          { val: foundCount, lbl: 'Found Items', color: '#16a34a' },
          { val: resolvedCount, lbl: 'Resolved', color: '#2563eb' },
        ].map(({ val, lbl, color }) => (
          <div key={lbl} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.04em', color, marginBottom: '4px' }}>{val}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Report Item</p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            {['lost', 'found'].map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{
                flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer',
                border: `1.5px solid ${form.type === t ? (t === 'lost' ? '#dc2626' : '#16a34a') : 'var(--border)'}`,
                background: form.type === t ? (t === 'lost' ? '#dc262612' : '#16a34a12') : 'var(--surface)',
                color: form.type === t ? (t === 'lost' ? '#dc2626' : '#16a34a') : 'var(--muted)',
                fontWeight: 600, fontSize: '14px', textTransform: 'capitalize',
              }}>
                {t === 'lost' ? '😟 I Lost Something' : '🎉 I Found Something'}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <input placeholder="Item name *" value={form.item_name} onChange={e => setForm(f => ({ ...f, item_name: e.target.value }))} style={inputStyle} />
            <input placeholder="Location *" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} style={inputStyle} />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, gridColumn: '1 / -1', resize: 'vertical', minHeight: '70px' }} />
            <input placeholder="Contact (email or phone)" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} style={{ ...inputStyle, gridColumn: '1 / -1' }} />
          </div>
          <button onClick={addItem} style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500, background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer' }}>
            Submit Report
          </button>
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--hint)', fontSize: '16px' }}>🔍</span>
        <input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['All', 'lost', 'found'].map(t => (
          <button key={t} onClick={() => setFilterType(t)} style={{
            fontFamily: 'var(--mono)', fontSize: '11px', padding: '5px 14px', borderRadius: '20px', cursor: 'pointer',
            border: `1.5px solid ${filterType === t ? (t === 'lost' ? '#dc2626' : t === 'found' ? '#16a34a' : 'var(--text)') : 'var(--border)'}`,
            background: filterType === t ? 'var(--surface2)' : 'var(--surface)',
            color: filterType === t ? (t === 'lost' ? '#dc2626' : t === 'found' ? '#16a34a' : 'var(--text)') : 'var(--muted)',
          }}>{t === 'All' ? 'All' : t === 'lost' ? 'Lost' : 'Found'}</button>
        ))}
        <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
        {['All', 'open', 'resolved'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
            fontFamily: 'var(--mono)', fontSize: '11px', padding: '5px 14px', borderRadius: '20px', cursor: 'pointer',
            border: `1.5px solid ${filterStatus === s ? 'var(--text)' : 'var(--border)'}`,
            background: filterStatus === s ? 'var(--surface2)' : 'var(--surface)',
            color: filterStatus === s ? 'var(--text)' : 'var(--muted)',
          }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      {/* Items list */}
      {loading ? (
        <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)' }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>{search ? 'No items match your search' : 'No items reported yet'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(item => {
            const isLost = item.type === 'lost';
            const isResolved = item.status === 'resolved';
            const color = isResolved ? '#888' : isLost ? '#dc2626' : '#16a34a';
            return (
              <div key={item.id} style={{
                background: 'var(--surface)', border: `1px solid ${isResolved ? 'var(--border)' : `${color}30`}`,
                borderRadius: '14px', padding: '18px 20px',
                opacity: isResolved ? 0.6 : 1,
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    {isResolved ? '✅' : isLost ? '😟' : '🎉'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <p style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>{item.item_name}</p>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: `${color}15`, color, fontWeight: 500 }}>
                        {isResolved ? 'Resolved' : isLost ? 'Lost' : 'Found'}
                      </span>
                    </div>
                    {item.description && <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px', lineHeight: 1.5 }}>{item.description}</p>}
                    <div style={{ display: 'flex', gap: '14px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)', flexWrap: 'wrap' }}>
                      <span>📍 {item.location}</span>
                      {item.contact && <span>📧 {item.contact}</span>}
                      <span>🕐 {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {!isResolved && (
                      <button onClick={() => markResolved(item.id)} style={{ background: '#16a34a15', border: '1px solid #16a34a30', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>
                        ✓ Resolved
                      </button>
                    )}
                    <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', color: 'var(--muted)' }}>🗑</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
