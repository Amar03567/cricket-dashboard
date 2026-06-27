import { CloudOff, Clock, Hash, Wifi } from 'lucide-react';

const sourceStyles = {
  live: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  cache: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  demo: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
};

const sourceLabels = { live: 'Live API', cache: 'Cached', demo: 'Demo Mode' };

function formatTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function StatCard({ label, children, isDark }) {
  return (
    <div className={`rounded-xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
      {children}
    </div>
  );
}

export function StatsBar({ count, source, refreshedAt, isDark }) {
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      <StatCard label="Matches" isDark={isDark}>
        <div className="flex items-end gap-2">
          <span className={`text-3xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-950'}`}>{count}</span>
          <Hash className={`mb-1 h-4 w-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
        </div>
      </StatCard>

      <StatCard label="Data Source" isDark={isDark}>
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${sourceStyles[source] || sourceStyles.demo}`}>
          {source === 'demo' ? <CloudOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
          {sourceLabels[source] || 'Score API'}
        </div>
      </StatCard>

      <StatCard label="Last Updated" isDark={isDark}>
        <div className="flex items-end gap-2">
          <span className={`text-2xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-950'}`}>{formatTime(refreshedAt)}</span>
          <Clock className={`mb-1 h-4 w-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
        </div>
      </StatCard>
    </div>
  );
}
