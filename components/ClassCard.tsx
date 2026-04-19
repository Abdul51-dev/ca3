import { ClassSlot } from '@/data/timetable';

interface Props { slot: ClassSlot; }

export default function ClassCard({ slot }: Props) {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', alignItems: 'flex-start' }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--hint)', minWidth: '40px', paddingTop: '11px', textAlign: 'right', flexShrink: 0 }}>
        {slot.time}
      </span>
      <div style={{
        flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '11px 15px',
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        <div style={{ width: '3px', borderRadius: '2px', alignSelf: 'stretch', flexShrink: 0, background: slot.color }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em', marginBottom: '3px' }}>{slot.name}</p>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', display: 'flex', gap: '12px' }}>
            <span>{slot.room}</span><span>{slot.duration}</span>
          </div>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
          {slot.type}
        </span>
      </div>
    </div>
  );
}
