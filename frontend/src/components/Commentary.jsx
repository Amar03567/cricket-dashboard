const eventStyles = {
  FOUR: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  SIX: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  WICKET: 'bg-red-500/20 text-red-400 border-red-500/30',
  NO_BALL: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  WIDE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  default: 'bg-slate-800 text-slate-400 border-slate-700',
};

function EventBadge({ event }) {
  if (!event) return null;
  const label = event.replace(/_/g, ' ');
  const style = eventStyles[event.toUpperCase()] || eventStyles.default;
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-bold ${style}`}>
      {label}
    </span>
  );
}

export function Commentary({ entries, isDark }) {
  if (!entries || entries.length === 0) {
    return (
      <div className={`rounded-xl border px-4 py-8 text-center ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Commentary not available for this match.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className={`border-b px-4 py-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>Live Commentary</h3>
      </div>
      <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
        {entries.map((entry, i) => (
          <div key={i} className={`flex gap-3 px-4 py-3 ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
            {entry.over && (
              <span className={`shrink-0 text-xs font-mono font-bold pt-0.5 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>
                {entry.over}
              </span>
            )}
            <div className="flex flex-col gap-1 min-w-0">
              <EventBadge event={entry.event} />
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {entry.text || 'No commentary text.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
