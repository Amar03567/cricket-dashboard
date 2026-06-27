import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  RefreshCw,
  Shield,
  Trophy,
  Users,
  AlertCircle,
} from 'lucide-react';
import { useMatchDetail } from '../hooks/useMatches.js';
import { InningsScorecard } from '../components/Scorecard.jsx';
import { Commentary } from '../components/Commentary.jsx';

function InfoPill({ icon: Icon, label, value, isDark }) {
  if (!value) return null;
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <Icon className={`mt-0.5 h-4 w-4 flex-none ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
      <div className="min-w-0">
        <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
        <p className={`mt-0.5 text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{value}</p>
      </div>
    </div>
  );
}

function TeamScoreCard({ team, score, wickets, overs, isDark, isLive }) {
  return (
    <div className={`flex-1 rounded-xl border px-4 py-4 text-center ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className={`mb-1 text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{team}</div>
      {score !== null && score !== undefined ? (
        <>
          <div className={`text-3xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {score}/{wickets}
          </div>
          <div className={`mt-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{overs} overs</div>
        </>
      ) : (
        <div className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Yet to bat</div>
      )}
    </div>
  );
}

function MatchDetailSkeleton({ isDark }) {
  const cls = isDark ? 'skeleton' : 'skeleton-light';
  return (
    <div className="space-y-5 fade-in">
      <div className={`h-8 w-2/3 ${cls}`} />
      <div className={`h-5 w-1/3 ${cls}`} />
      <div className="flex gap-4">
        <div className={`h-24 flex-1 ${cls}`} />
        <div className={`h-24 flex-1 ${cls}`} />
      </div>
      <div className={`h-10 ${cls}`} />
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => <div key={i} className={`h-16 ${cls}`} />)}
      </div>
      <div className={`h-64 ${cls}`} />
    </div>
  );
}

const TABS = [
  { id: 'scorecard', label: '🏏 Scorecard' },
  { id: 'commentary', label: '📢 Commentary' },
  { id: 'info', label: 'ℹ️ Match Info' },
];

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(value));
}

export function MatchDetail({ matchId, matchPreview, isDark, onBack }) {
  const { detail, loading, error, source, refetch } = useMatchDetail(matchId);
  const [tab, setTab] = useState('scorecard');

  // Resolve display data: prefer fetched detail, fallback to preview
  const info = detail?.matchInfo;
  const displayName = info?.name || matchPreview?.name || 'Match Details';
  const displayStatus = info?.status || matchPreview?.status || '';
  const displayFormat = info?.matchFormat || matchPreview?.matchType || '';
  const isLive = info?.isLive ?? matchPreview?.isLive ?? false;

  return (
    <section className="mx-auto max-w-4xl px-4 py-6 md:px-8 fade-in">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className={`mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to matches
      </button>

      {/* Page heading */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            {displayFormat && (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-slate-800 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                {displayFormat}
              </span>
            )}
            {isLive && (
              <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-bold text-red-400">
                <span className="live-dot" />
                LIVE
              </span>
            )}
            {source && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                {source}
              </span>
            )}
          </div>
          <h1 className={`text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {displayName}
          </h1>
          {(info?.series || matchPreview?.series) && (
            <p className={`mt-1 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {info?.series || matchPreview?.series}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={refetch}
          title="Refresh"
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-colors ${isDark ? 'border-slate-700 bg-slate-900 text-slate-400 hover:border-emerald-500 hover:text-emerald-400' : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-500 hover:text-emerald-600'}`}
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className={`mb-6 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-red-900 bg-red-950/40 text-red-300' : 'border-red-200 bg-red-50 text-red-700'}`}>
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && <MatchDetailSkeleton isDark={isDark} />}

      {/* Content */}
      {!loading && (
        <>
          {/* Status banner */}
          {displayStatus && (
            <div className={`mb-5 rounded-xl border px-4 py-3 text-center text-sm font-semibold ${isLive ? 'border-emerald-800 bg-emerald-950/40 text-emerald-400' : isDark ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-700'}`}>
              {displayStatus}
            </div>
          )}

          {/* Live scores from innings */}
          {detail?.innings && detail.innings.length > 0 ? (
            <div className="mb-5 flex gap-3 flex-wrap sm:flex-nowrap">
              {detail.innings.map((inn) => (
                <TeamScoreCard
                  key={inn.inningsId}
                  team={`${inn.team} (Inn ${inn.inningsId})`}
                  score={inn.runs}
                  wickets={inn.wickets}
                  overs={inn.overs}
                  isDark={isDark}
                  isLive={isLive}
                />
              ))}
            </div>
          ) : matchPreview && (
            /* Fallback: use match preview scores */
            <div className="mb-5 flex gap-3 flex-wrap sm:flex-nowrap">
              <div className={`flex-1 rounded-xl border px-4 py-4 text-center ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className={`mb-1 text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{matchPreview.team1}</div>
                <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>{matchPreview.team1Score || 'Yet to bat'}</div>
              </div>
              <div className={`flex-1 rounded-xl border px-4 py-4 text-center ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className={`mb-1 text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{matchPreview.team2}</div>
                <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>{matchPreview.team2Score || 'Yet to bat'}</div>
              </div>
            </div>
          )}

          {/* Info pills */}
          {info && (
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <InfoPill icon={MapPin} label="Venue" value={info.venue} isDark={isDark} />
              <InfoPill icon={Calendar} label="Date & Time" value={formatDate(info.date)} isDark={isDark} />
              <InfoPill icon={Shield} label="Toss" value={info.toss} isDark={isDark} />
              <InfoPill icon={Trophy} label="Series" value={info.series} isDark={isDark} />
              {info.umpire1 && (
                <InfoPill icon={Users} label="Umpires" value={[info.umpire1, info.umpire2].filter(Boolean).join(' & ')} isDark={isDark} />
              )}
            </div>
          )}

          {/* Tabs */}
          <div className={`mb-5 flex rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex-1 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-xl ${
                  tab === t.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="space-y-5 fade-in">
            {tab === 'scorecard' && (
              detail?.innings && detail.innings.length > 0
                ? detail.innings.map((inn) => (
                  <InningsScorecard key={inn.inningsId} inning={inn} isDark={isDark} />
                ))
                : (
                  <div className={`rounded-xl border px-4 py-10 text-center ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                    <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Scorecard data is not available for this match yet.
                      {info?.isLive ? ' Check back once the match starts.' : ''}
                    </p>
                  </div>
                )
            )}

            {tab === 'commentary' && (
              <Commentary entries={detail?.commentary} isDark={isDark} />
            )}

            {tab === 'info' && info && (
              <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className={`border-b px-4 py-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>Match Information</h3>
                </div>
                <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  {[
                    ['Match Format', info.matchFormat],
                    ['Series', info.series],
                    ['Venue', info.venue],
                    ['Date', formatDate(info.date)],
                    ['Toss', info.toss],
                    ['Team 1', `${info.team1?.name}${info.team1?.shortName ? ` (${info.team1.shortName})` : ''}`],
                    ['Team 2', `${info.team2?.name}${info.team2?.shortName ? ` (${info.team2.shortName})` : ''}`],
                    ['Umpire 1', info.umpire1],
                    ['Umpire 2', info.umpire2],
                    ['Status', info.status],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label} className="flex gap-4 px-4 py-3">
                      <span className={`w-28 shrink-0 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
