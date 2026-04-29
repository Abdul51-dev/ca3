export default function Topbar() {
  return (
    <header style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '16px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', fontWeight: 600, letterSpacing: '-0.03em' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'var(--text)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--surface)',
          fontSize: '16px', fontWeight: 700,
        }}>C</div>
        Campus Companion
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)',
          background: 'var(--surface2)', border: '1px solid var(--border)',
          padding: '5px 14px', borderRadius: '20px',
        }}>Sem 2 · 2024/25</span>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'var(--surface2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 500, color: 'var(--muted)',
        }}>AB</div>
      </div>
    </header>
  );
}
