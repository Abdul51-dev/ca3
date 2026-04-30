'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

const CATEGORIES = ['General', 'Society', 'Sports', 'Academic', 'Social', 'Career'];
const categoryColor: Record<string, string> = {
  General: '#888884', Society: '#7c3aed', Sports: '#16a34a',
  Academic: '#2563eb', Social: '#d97706', Career: '#dc2626',
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date());

  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', location: '', category: 'General' });

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    setLoading(true);
    const { data } = await supabase.from('events').select('*').order('date');
    setEvents(data || []);
    setLoading(false);
  }

  async function addEvent() {
    if (!form.title || !form.date) return;
    await supabase.from('events').insert(form);
    setForm({ title: '', description: '', date: '', time: '', location: '', category: 'General' });
    setShowForm(false);
    fetchEvents();
  }

  async function deleteEvent(id: number) {
    await supabase.from('events').delete().eq('id', id);
    fetchEvents();
  }

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || e.category === filterCat;
    return matchSearch && matchCat;
  });

  // Calendar helpers
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  function eventsOnDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  }

  const inputStyle = {
    fontFamily: 'var(--sans)', fontSize: '14px',
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '10px 14px', outline: 'none',
    color: 'var(--text)', width: '100%',
  };

  return (
    <main style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '4px' }}>Events</h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Campus events, society meetups and more</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{
          fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500,
          background: showForm ? '#888' : 'var(--text)', color: '#fff', border: 'none',
          borderRadius: '10px', padding: '10px 18px', cursor: 'pointer',
        }}>
          {showForm ? '✕ Cancel' : '+ Add Event'}
        </button>
      </div>

      {/* Add event form */}
      {showForm && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>New Event</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <input placeholder="Event title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
            <input placeholder="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} style={inputStyle} />
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
            <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={inputStyle} />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, gridColumn: '1 / -1', resize: 'vertical', minHeight: '80px' }} />
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={addEvent} style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500, background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer' }}>
            Save Event
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
        {/* Left — search + list */}
        <div>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--hint)', fontSize: '16px' }}>🔍</span>
            <input
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '40px' }}
            />
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
            {['All', ...CATEGORIES].map(cat => {
              const active = filterCat === cat;
              const color = cat === 'All' ? 'var(--text)' : categoryColor[cat];
              return (
                <button key={cat} onClick={() => setFilterCat(cat)} style={{
                  fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 500,
                  padding: '5px 14px', borderRadius: '20px', cursor: 'pointer',
                  border: `1.5px solid ${active ? color : 'var(--border)'}`,
                  background: active ? `${color}12` : 'var(--surface)',
                  color: active ? color : 'var(--muted)',
                  transition: 'all 0.15s',
                }}>{cat}</button>
              );
            })}
          </div>

          {/* Events list */}
          {loading ? (
            <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)' }}>Loading...</p>
          ) : filtered.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--muted)', fontSize: '15px' }}>{search ? 'No events match your search' : 'No events yet'}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(e => {
                const color = categoryColor[e.category] || '#888';
                const dateObj = new Date(e.date + 'T00:00:00');
                return (
                  <div key={e.id} style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '14px', padding: '18px 20px',
                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                    boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.15s',
                  }}>
                    <div style={{ textAlign: 'center', minWidth: '48px', background: `${color}12`, borderRadius: '10px', padding: '8px 6px', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color, fontWeight: 600, textTransform: 'uppercase' }}>
                        {MONTHS[dateObj.getMonth()].slice(0, 3)}
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: 700, color, letterSpacing: '-0.03em', lineHeight: 1 }}>
                        {dateObj.getDate()}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <p style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>{e.title}</p>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: `${color}15`, color }}>{e.category}</span>
                      </div>
                      {e.description && <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px', lineHeight: 1.5 }}>{e.description}</p>}
                      <div style={{ display: 'flex', gap: '14px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)' }}>
                        {e.location && <span>📍 {e.location}</span>}
                        {e.time && <span>🕐 {e.time}</span>}
                      </div>
                    </div>
                    <button onClick={() => deleteEvent(e.id)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', color: 'var(--muted)', flexShrink: 0 }}>🗑</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right — calendar */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '20px', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <button onClick={() => setViewMonth(new Date(year, month - 1))} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }}>‹</button>
            <p style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em' }}>{MONTHS[month]} {year}</p>
            <button onClick={() => setViewMonth(new Date(year, month + 1))} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }}>›</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '8px' }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--hint)', padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {calendarDays.map((day, i) => {
              if (!day) return <div key={i} />;
              const dayEvents = eventsOnDay(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
              return (
                <div key={i} style={{
                  textAlign: 'center', padding: '6px 2px', borderRadius: '8px',
                  background: isToday ? 'var(--text)' : 'transparent',
                  position: 'relative',
                }}>
                  <span style={{ fontSize: '12px', fontWeight: isToday ? 600 : 400, color: isToday ? '#fff' : 'var(--text)' }}>{day}</span>
                  {dayEvents.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '2px', flexWrap: 'wrap' }}>
                      {dayEvents.slice(0, 3).map(e => (
                        <div key={e.id} style={{ width: '5px', height: '5px', borderRadius: '50%', background: categoryColor[e.category] || '#888' }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Upcoming */}
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--hint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Upcoming</p>
            {events.filter(e => new Date(e.date) >= new Date()).slice(0, 3).map(e => (
              <div key={e.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: categoryColor[e.category] || '#888', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500 }}>{e.title}</p>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>{e.date} {e.time && `· ${e.time}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
