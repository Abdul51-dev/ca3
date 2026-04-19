import { Assignment, urgencyColor } from '@/data/modules';

interface Props {
  assignment: Assignment;
}

export default function AssignmentItem({ assignment: a }: Props) {
  const color = urgencyColor[a.urgency];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '11px 14px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      marginBottom: '6px',
      fontSize: '13px',
    }}>
      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{a.name}</span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>{a.due}</span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: `${color}18`, color }}>{a.urgency}</span>
    </div>
  );
}
