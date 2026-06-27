import { Moon, RefreshCw, Sun, Trophy } from 'lucide-react';

export function Header({ isDark, onToggleTheme, onRefresh, refreshing }) {
  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-sm ${isDark ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-white/90'}`}>
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/15 p-2.5">
              <Trophy className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight md:text-2xl ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Live Cricket Hub
              </h1>
              <p className={`hidden text-xs md:block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Scores · Scorecards · Commentary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors disabled:opacity-50 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-500 hover:text-emerald-400' : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-600'}`}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
            <button
              type="button"
              aria-label="Toggle color theme"
              onClick={onToggleTheme}
              className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors ${isDark ? 'border-slate-700 bg-slate-900 text-amber-300 hover:border-amber-300' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
