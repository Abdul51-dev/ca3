'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Ticket {
  id: number;
  title: string;
  category: string;
  description: string;
  status: string;
  priority: string;
  admin_response: string | null;
  student_name: string;
  student_email: string;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = ['IT Support', 'Timetable Issue', 'Module Query', 'Accommodation', 'Finance', 'Wellbeing', 'Other'];
const PRIORITIES = ['low', 'normal', 'high', 'urgent'];

const statusColor: Record<string, string> = {
  open: '#2563eb', 'in progress': '#d97706', resolved: '#16a34a', closed: '#888',
};

const priorityColor: Record<string, string> = {
  low: '#888', normal: '#2563eb', high: '#d97706', urgent: '#dc2626',
};

export default function HelpdeskPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'student' | 'admin'>('student');
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [form, setForm] = useState({
    title: '', category: 'IT Support', description: '',
    student_name: '', student_email: '', priority: 'normal',
  });

  const [adminResponse, setAdminResponse] = useState('');
  const [adminStatus, setAdminStatus] = useState('');
  const [adminPriority, setAdminPriority] = useState('');

  useEffect(() => { fetchTickets(); }, []);

  async function fetchTickets() {
    setLoading(true);
    const { data } = await supabase.from('helpdesk_tickets').select('*').order('created_at', { ascending: false });
    setTickets(data || []);
    setLoading(false);
  }

  async function submitTicket() {
    if (!form.title || !form.description || !form.student_name) return;
    await supabase.from('helpdesk_tickets').insert(form);
    setForm({ title: '', category: 'IT Support', description: '', student_name: '', student_email: '', priority: 'normal' });
    setShowForm(false);
    fetchTickets();
  }

  async function updateTicket(id: number) {
    const updates: Record<string, string> = { updated_at: new Date().toISOString() };
    if (adminResponse) updates.admin_response = adminResponse;
    if (adminStatus) updates.status = adminStatus;
    if (adminPriority) updates.priority = adminPriority;
    await supabase.from('helpdesk_tickets').update(updates).eq('id', id);
    setAdminResponse(''); setAdminStatus(''); setAdminPriority('');
    setExpandedId(null);
    fetchTickets();
  }

  async function deleteTicket(id: number) {
    await supabase.from('helpdesk_tickets').delete().eq('id', id);
    fetchTickets();
  }

  const filtered = tickets.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.student_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  const inputStyle = {
    fontFamily: 'var(--sans)', fontSize: '14px',
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '10px 14px', outline: 'none',
    color: 'var(--text)', width: '100%',
  };

  return (
    <main style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '4px' }}>Help Desk</h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Submit a support ticket or get help from staff</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '3px', gap: '3px' }}>
            {(['student', 'admin'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500,
                padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', border: 'none',
                background: view === v ? 'var(--text)' : 'transparent',
                color: view === v ? '#fff' : 'var(--muted)',
                transition: 'all 0.15s',
              }}>
                {v === 'student' ? '👤 Student' : '🔧 Admin'}
              </button>
            ))}
          </div>
          {view === 'student' && (
            <button onClick={() => setShowForm(s => !s)} style={{
              fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500,
              background: showForm ? '#888' : 'var(--text)', color: '#fff',
              border: 'none', borderRadius: '10px', padding: '10px 18px', cursor: 'pointer',
            }}>
              {showForm ? '✕ Cancel' : '+ New Ticket'}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '28px' }}>
        {[
          { val: openCount, lbl: 'Open', color: '#2563eb' },
          { val: inProgressCount, lbl: 'In Progress', color: '#d97706' },
          { val: resolvedCount, lbl: 'Resolved', color: '#16a34a' },
          { val: tickets.length, lbl: 'Total', color: 'var(--text)' },
        ].map(({ val, lbl, color }) => (
          <div key={lbl} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.04em', color, marginBottom: '4px' }}>{val}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Student form */}
      {view === 'student' && showForm && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Submit Ticket</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <input placeholder="Your name *" value={form.student_name} onChange={e => setForm(f => ({ ...f, student_name: e.target.value }))} style={inputStyle} />
            <input placeholder="Your email" value={form.student_email} onChange={e => setForm(f => ({ ...f, student_email: e.target.value }))} style={inputStyle} />
            <input placeholder="Ticket Reason *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} style={inputStyle}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)} Priority</option>)}
            </select>
            <textarea placeholder="Describe your issue *" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, gridColumn: '1 / -1', resize: 'vertical', minHeight: '100px' }} />
          </div>
          <button onClick={submitTicket} style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500, background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer' }}>
            Submit Ticket
          </button>
        </div>
      )}

      {/* Search + filter */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--hint)', fontSize: '16px' }}>🔍</span>
        <input placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} />
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['All', 'open', 'in progress', 'resolved', 'closed'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
            fontFamily: 'var(--mono)', fontSize: '11px', padding: '5px 14px', borderRadius: '20px', cursor: 'pointer',
            border: `1.5px solid ${filterStatus === s ? (statusColor[s] || 'var(--text)') : 'var(--border)'}`,
            background: filterStatus === s ? 'var(--surface2)' : 'var(--surface)',
            color: filterStatus === s ? (statusColor[s] || 'var(--text)') : 'var(--muted)',
          }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      {/* Tickets */}
      {loading ? (
        <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)' }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>No tickets found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(t => {
            const isExpanded = expandedId === t.id;
            const sColor = statusColor[t.status] || '#888';
            const pColor = priorityColor[t.priority] || '#888';
            return (
              <div key={t.id} style={{
                background: 'var(--surface)', border: `1px solid ${isExpanded ? sColor : 'var(--border)'}`,
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transition: 'all 0.2s',
              }}>
                {/* Ticket header */}
                <div onClick={() => setExpandedId(isExpanded ? null : t.id)} style={{ padding: '18px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <p style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>{t.title}</p>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: `${sColor}15`, color: sColor, fontWeight: 500 }}>{t.status}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: `${pColor}15`, color: pColor, fontWeight: 500 }}>{t.priority}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '14px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)', flexWrap: 'wrap' }}>
                      <span>📁 {t.category}</span>
                      {t.student_name && <span>👤 {t.student_name}</span>}
                      <span>🕐 {new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '18px', color: 'var(--hint)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>⌄</div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '20px', background: 'var(--bg)' }}>
                    <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '16px' }}>{t.description}</p>

                    {/* Admin response display */}
                    {t.admin_response && (
                      <div style={{ background: '#2563eb08', border: '1px solid #2563eb20', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
                        <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#2563eb', marginBottom: '6px', fontWeight: 500 }}>🔧 STAFF RESPONSE</p>
                        <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.6 }}>{t.admin_response}</p>
                      </div>
                    )}

                    {/* Admin controls */}
                    {view === 'admin' && (
                      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                        <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Admin Controls</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                          <select defaultValue={t.status} onChange={e => setAdminStatus(e.target.value)} style={inputStyle}>
                            {['open', 'in progress', 'resolved', 'closed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                          <select defaultValue={t.priority} onChange={e => setAdminPriority(e.target.value)} style={inputStyle}>
                            {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)} Priority</option>)}
                          </select>
                          <textarea placeholder="Write a response to the student..." value={adminResponse} onChange={e => setAdminResponse(e.target.value)} style={{ ...inputStyle, gridColumn: '1 / -1', resize: 'vertical', minHeight: '80px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => updateTicket(t.id)} style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500, background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', cursor: 'pointer' }}>
                            Update Ticket
                          </button>
                          <button onClick={() => deleteTicket(t.id)} style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500, background: '#dc262615', color: '#dc2626', border: '1px solid #dc262630', borderRadius: '10px', padding: '10px 18px', cursor: 'pointer' }}>
                            Delete
                          </button>
                        </div>
                      </div>
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
