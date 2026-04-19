'use client';

import { useState } from 'react';
import { buildings, Building, categoryColor } from '@/data/buildings';
import MapPin from '@/components/MapPin';

export default function MapPage() {
  const [active, setActive] = useState<Building>(
    buildings.find(b => b.id === 'CS')!
  );

  return (
    <main className="content">
      <p className="section-label">grangegorman campus</p>

      {/* Map */}
      <div className="map-wrap">
        <div className="map-canvas">
          <svg
            width="100%"
            height="260"
            viewBox="0 0 480 260"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <rect width="480" height="260" fill="#f7f7f5" />
            {/* Roads */}
            <rect x="176" y="0"  width="12" height="260" fill="#ebebea" />
            <rect x="0"   y="120" width="480" height="10" fill="#ebebea" />
            <rect x="278" y="0"  width="9"  height="260" fill="#f0f0ee" />
            {/* Buildings */}
            <rect x="28"  y="26"  width="112" height="68" rx="6" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
            <text x="84"  y="65"  fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="9">Block A</text>
            <rect x="28"  y="148" width="112" height="68" rx="6" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
            <text x="84"  y="187" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="9">Block B</text>
            <rect x="206" y="26"  width="58"  height="44" rx="6" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
            <text x="235" y="52"  fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="8">Library</text>
            <rect x="206" y="148" width="58"  height="58" rx="6" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
            <text x="235" y="178" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="8">Student</text>
            <text x="235" y="190" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="8">Hub</text>
            <rect x="302" y="26"  width="144" height="98" rx="6" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
            <text x="374" y="78"  fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="9">Computing</text>
            <text x="374" y="90"  fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="8">Faculty</text>
            <rect x="302" y="158" width="64"  height="58" rx="6" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
            <text x="334" y="190" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="8">Sports</text>
            <rect x="382" y="158" width="64"  height="58" rx="6" fill="#e8e8e4" stroke="#d8d8d2" strokeWidth="1" />
            <text x="414" y="190" fill="#b8b8b2" textAnchor="middle" fontFamily="DM Mono" fontSize="8">Canteen</text>
            <ellipse cx="235" cy="112" rx="22" ry="14" fill="#e2ede4" stroke="#c8dccb" strokeWidth="1" />
          </svg>

          {/* Pins */}
          {buildings.map(b => (
            <MapPin
              key={b.id}
              building={b}
              isActive={active.id === b.id}
              onClick={() => setActive(b)}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="legend">
          {(Object.entries(categoryColor) as [string, string][]).map(([cat, color]) => (
            <div key={cat} className="leg-item">
              <div className="leg-dot" style={{ background: color }} />
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Detail card */}
      <div className="detail">
        <h2 className="detail-name">{active.name}</h2>
        <p className="detail-desc">{active.description}</p>
        <div className="pills">
          {active.pills.map(p => (
            <span key={p} className="pill">{p}</span>
          ))}
        </div>
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
        .map-wrap {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 14px;
        }
        .map-canvas {
          position: relative;
          height: 260px;
          background: #f7f7f5;
        }
        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 12px 16px;
          border-top: 1px solid var(--border);
        }
        .leg-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: var(--mono);
          font-size: 11px;
          color: var(--muted);
        }
        .leg-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .detail {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 16px;
        }
        .detail-name {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .detail-desc {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .pill {
          font-family: var(--mono);
          font-size: 11px;
          background: var(--surface2);
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 3px 10px;
          border-radius: 20px;
        }
      `}</style>
    </main>
  );
}
