import { Calendar, ChevronRight, MapPin } from 'lucide-react';

function formatDate(value) {
  if (!value) return 'Today';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function TeamRow({ team, score, isDark }) {
  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${isDark ? 'bg-slate-950/60' : 'bg-slate-50'}`}>
      <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{team}</span>
      <span className={`text-sm font-bold tabular-nums ${score ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {score || 'Yet to bat'}
      </span>
    </div>
  );
}

export function MatchCard({ match, isDark, onClick }) {
  return (
    <article
      onClick={() => onClick(match)}
      className={`group relative flex min-h-64 cursor-pointer flex-col rounded-xl border p-5 shadow-sm card-hover focus-visible:outline-2 focus-visible:outline-emerald-500 ${isDark ? 'border-slate-800 bg-slate-900 hover:border-emerald-500/60 hover:bg-slate-900/80' : 'border-slate-200 bg-white hover:border-emerald-400/60 hover:bg-slate-50/80'}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(match)}
      aria-label={`View details for ${match.name}`}
    >
      {/* Header row */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-slate-800 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
            {match.matchType || 'Match'}
          </span>
          {match.isLive && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-bold text-red-400">
              <span className="live-dot" />
              LIVE
            </span>
          )}
        </div>
        <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <Calendar className="h-3 w-3" />
          <span>{formatDate(match.date)}</span>
        </div>
      </div>

      {/* Match name */}
      <h2 className={`text-lg font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-950'}`}>
        {match.name}
      </h2>

      {/* Venue */}
      <div className={`mt-1.5 flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        <MapPin className="h-3 w-3 flex-none" />
        <span className="truncate">{match.venue || 'Venue TBD'}</span>
      </div>

      {/* Scores */}
      <div className="mt-4 grid gap-2">
        <TeamRow team={match.team1 || 'Team 1'} score={match.team1Score} isDark={isDark} />
        <TeamRow team={match.team2 || 'Team 2'} score={match.team2Score} isDark={isDark} />
      </div>

      {/* Status */}
      <div className={`mt-auto pt-4`}>
        <div className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'}`}>
          <p className={`text-xs font-semibold leading-snug ${match.isLive ? 'text-emerald-400' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {match.status || 'Match info updating...'}
          </p>
          <ChevronRight className={`h-4 w-4 flex-none transition-transform group-hover:translate-x-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
        </div>
      </div>
    </article>
  );
}

// Skeleton loading version
export function MatchCardSkeleton({ isDark }) {
  const cls = isDark ? 'skeleton' : 'skeleton-light';
  return (
    <div className={`flex min-h-64 flex-col rounded-xl border p-5 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className="mb-4 flex justify-between">
        <div className={`h-5 w-16 ${cls}`} />
        <div className={`h-4 w-20 ${cls}`} />
      </div>
      <div className={`h-6 w-3/4 ${cls} mb-2`} />
      <div className={`h-4 w-1/2 ${cls} mb-5`} />
      <div className="grid gap-2">
        <div className={`h-10 ${cls}`} />
        <div className={`h-10 ${cls}`} />
      </div>
      <div className={`mt-4 h-10 ${cls}`} />
    </div>
  );
}
