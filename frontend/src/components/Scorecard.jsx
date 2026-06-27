import { useState } from 'react';

function BattingTable({ batters, isDark }) {
  if (!batters || batters.length === 0) {
    return (
      <p className={`py-6 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        Batting data not available
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className={`text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <th className="pb-2 pr-4 min-w-36">Batter</th>
            <th className="pb-2 px-3 text-right">R</th>
            <th className="pb-2 px-3 text-right">B</th>
            <th className="pb-2 px-3 text-right">4s</th>
            <th className="pb-2 px-3 text-right">6s</th>
            <th className="pb-2 pl-3 text-right">SR</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
          {batters.map((b, i) => (
            <tr key={i} className={`text-xs transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
              <td className="py-2.5 pr-4">
                <div className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{b.name}</div>
                {b.dismissal && (
                  <div className={`mt-0.5 text-xs leading-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {b.dismissal}
                  </div>
                )}
              </td>
              <td className={`py-2.5 px-3 text-right font-bold tabular-nums ${b.isOut === false ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {b.runs ?? '–'}
              </td>
              <td className={`py-2.5 px-3 text-right tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{b.balls ?? '–'}</td>
              <td className={`py-2.5 px-3 text-right tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{b.fours ?? '–'}</td>
              <td className={`py-2.5 px-3 text-right tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{b.sixes ?? '–'}</td>
              <td className={`py-2.5 pl-3 text-right tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{b.strikeRate ?? '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BowlingTable({ bowlers, isDark }) {
  if (!bowlers || bowlers.length === 0) {
    return (
      <p className={`py-6 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        Bowling data not available
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className={`text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <th className="pb-2 pr-4 min-w-36">Bowler</th>
            <th className="pb-2 px-3 text-right">O</th>
            <th className="pb-2 px-3 text-right">M</th>
            <th className="pb-2 px-3 text-right">R</th>
            <th className="pb-2 px-3 text-right">W</th>
            <th className="pb-2 pl-3 text-right">Econ</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
          {bowlers.map((b, i) => (
            <tr key={i} className={`text-xs transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
              <td className={`py-2.5 pr-4 font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{b.name}</td>
              <td className={`py-2.5 px-3 text-right tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{b.overs ?? '–'}</td>
              <td className={`py-2.5 px-3 text-right tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{b.maidens ?? '–'}</td>
              <td className={`py-2.5 px-3 text-right tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{b.runs ?? '–'}</td>
              <td className={`py-2.5 px-3 text-right font-bold tabular-nums ${b.wickets > 0 ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {b.wickets ?? '–'}
              </td>
              <td className={`py-2.5 pl-3 text-right tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{b.economy ?? '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InningsScorecard({ inning, isDark }) {
  const [tab, setTab] = useState('batting');

  const totalScore = `${inning.runs ?? 0}/${inning.wickets ?? 0}${inning.isDeclared ? ' d' : ''} (${inning.overs ?? '0'} ov)`;

  return (
    <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      {/* Innings header */}
      <div className={`border-b px-4 py-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {inning.team}
              {inning.shortName && inning.shortName !== inning.team && (
                <span className={`ml-2 text-sm font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  ({inning.shortName})
                </span>
              )}
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Innings {inning.inningsId}
            </p>
          </div>
          <div className={`text-right`}>
            <p className={`text-xl font-bold tabular-nums ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {inning.runs ?? '–'}/{inning.wickets ?? '–'}
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {inning.overs ?? '–'} overs
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        {['batting', 'bowling'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              tab === t
                ? 'border-b-2 border-emerald-500 text-emerald-400'
                : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {t === 'batting' ? '🏏 Batting' : '🎯 Bowling'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="p-4">
        {tab === 'batting'
          ? <BattingTable batters={inning.batters} isDark={isDark} />
          : <BowlingTable bowlers={inning.bowlers} isDark={isDark} />}
      </div>
    </div>
  );
}
