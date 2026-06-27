import { AlertCircle } from 'lucide-react';
import { MatchCard, MatchCardSkeleton } from '../components/MatchCard.jsx';
import { StatsBar } from '../components/StatsBar.jsx';

export function Dashboard({ isDark, matches, loading, notice, source, refreshedAt, onMatchClick }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 md:px-8 fade-in">
      <StatsBar count={matches.length} source={source} refreshedAt={refreshedAt} isDark={isDark} />

      {notice && (
        <div className={`mb-6 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-slate-700 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-amber-400" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <MatchCardSkeleton key={i} isDark={isDark} />)
          : matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              isDark={isDark}
              onClick={onMatchClick}
            />
          ))}

        {!loading && matches.length === 0 && (
          <div className={`col-span-full rounded-xl border py-16 text-center ${isDark ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}>
            <p className="text-lg font-semibold mb-1">No matches right now</p>
            <p className="text-sm">Check back later or hit Refresh to try again.</p>
          </div>
        )}
      </div>
    </section>
  );
}
