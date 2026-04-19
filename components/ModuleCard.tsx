'use client';

import { useState } from 'react';
import { Module } from '@/data/modules';

interface Props {
  module: Module;
}

export default function ModuleCard({ module: m }: Props) {
  const [selected, setSelected] = useState(false);

  return (
    <div
      className={`card ${selected ? 'selected' : ''}`}
      onClick={() => setSelected(s => !s)}
    >
      <div className="top">
        <span className="code">{m.code}</span>
        <span className="letter" style={{ color: m.color }}>{m.letter}</span>
      </div>

      <p className="name">{m.name}</p>

      <div className="prog-bar">
        <div
          className="prog-fill"
          style={{ width: `${m.progress}%`, background: m.color }}
        />
      </div>

      <div className="prog-label">
        <span>progress</span>
        <span>{m.progress}%</span>
      </div>

      <style jsx>{`
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 14px;
          cursor: pointer;
          transition: border-color 0.12s;
          user-select: none;
        }
        .card:hover { border-color: var(--border2); }
        .card.selected { border-color: var(--text); }

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .code {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--muted);
        }
        .letter {
          font-family: var(--mono);
          font-size: 13px;
          font-weight: 500;
        }
        .name {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.01em;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .prog-bar {
          background: var(--surface2);
          border-radius: 3px;
          height: 3px;
          overflow: hidden;
          margin-bottom: 5px;
        }
        .prog-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.4s ease;
        }
        .prog-label {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--hint);
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
}
