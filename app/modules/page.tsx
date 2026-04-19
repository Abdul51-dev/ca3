import { modules, assignments, moduleStats } from '@/data/modules';
import ModuleCard from '@/components/ModuleCard';
import AssignmentItem from '@/components/AssignmentItem';

export default function ModulesPage() {
  return (
    <main style={{ padding: '24px', maxWidth: '680px' }}>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {[
          { val: `${moduleStats.avgGrade}%`, lbl: 'avg grade' },
          { val: moduleStats.totalCredits,   lbl: 'credits' },
          { val: moduleStats.dueSoon,        lbl: 'due soon' },
        ].map(({ val, lbl }) => (
          <div key={lbl} style={{
            flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '10px', padding: '12px 14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.03em' }}>{val}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>{lbl}</div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--hint)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
        semester 2 modules
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '4px' }}>
        {modules.map(m => <ModuleCard key={m.code} module={m} />)}
      </div>

      <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--hint)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '20px 0 16px' }}>
        upcoming assignments
      </p>

      <div>
        {assignments.map((a, i) => <AssignmentItem key={i} assignment={a} />)}
      </div>

    </main>
  );
}
