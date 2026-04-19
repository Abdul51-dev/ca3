export default function Topbar() {
  return (
    <header style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em' }}>
        <div style={{
          width: '26px', height: '26px',
          background: 'var(--text)', borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--surface)', fontSize: '13px', fontWeight: 600,
        }}>C</div>
        Campus Companion
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)',
          background: 'var(--surface2)', border: '1px solid var(--border)',
          padding: '4px 10px', borderRadius: '20px',
        }}>Sem 2 · 2024/25</span>
        <div style={{
          width: '30px', height: '30px', borderRadius: '50%',
          background: 'var(--surface2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: 500, color: 'var(--muted)',
        }}>AB</div>
      </div>
    </header>
  );
}
