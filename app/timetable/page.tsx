'use client';

import { useState } from 'react';
import { DAYS, Day, timetable } from '@/data/timetable';
import ClassCard from '@/components/ClassCard';

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState<Day>('Mon');
  const slots = timetable[activeDay];

  return (
    <main className="content">
      <p className="section-label">weekly schedule</p>

      {/* Day selector */}
      <div className="day-strip">
        {DAYS.map(day => (
          <button
            key={day}
            className={`day-btn ${day === activeDay ? 'active' : ''}`}
            onClick={() => setActiveDay(day)}
          >
            {day.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Slots */}
      <div className="timeline">
        {slots.map((slot, i) => (
          <div key={i}>
            <ClassCard slot={slot} />
            {i < slots.length - 1 && (
              <div className="divider">
                <div className="divider-line" />
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .content {
          padding: 24px;
          max-width: 680px;
        }
        .section-label {
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 500;
          color: var(--hint);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 16px;
        }
        .day-strip {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
        }
        .day-btn {
          flex: 1;
          font-family: var(--mono);
          font-size: 11px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--muted);
          padding: 8px 4px;
          border-radius: var(--radius-md);
          text-align: center;
          transition: all 0.12s;
        }
        .day-btn:hover {
          border-color: var(--border2);
          color: var(--text);
        }
        .day-btn.active {
          background: var(--text);
          border-color: var(--text);
          color: var(--surface);
        }
        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 4px 0 4px 56px;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          border-top: 1px dashed var(--border);
        }
      `}</style>
    </main>
  );
}
