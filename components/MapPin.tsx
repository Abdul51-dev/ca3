'use client';

import { Building } from '@/data/buildings';

interface Props {
  building: Building;
  isActive: boolean;
  onClick: () => void;
}

export default function MapPin({ building: b, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`pin ${isActive ? 'active' : ''}`}
      style={{
        left: `${b.left}%`,
        top: `${b.top}%`,
        background: isActive ? b.color : '#ffffff',
        color: isActive ? '#ffffff' : b.color,
      }}
      aria-label={b.name}
    >
      {b.label}

      <style jsx>{`
        .pin {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1.5px solid rgba(0,0,0,0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--mono);
          font-size: 9px;
          font-weight: 500;
          transition: transform 0.15s, box-shadow 0.15s;
          z-index: 2;
          box-shadow: var(--shadow-sm);
        }
        .pin:hover,
        .pin.active {
          transform: translate(-50%, -50%) scale(1.2);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </button>
  );
}
