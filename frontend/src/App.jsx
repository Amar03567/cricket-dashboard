import { useState } from 'react';
import { useDarkMode } from './hooks/useDarkMode.js';
import { useMatches } from './hooks/useMatches.js';
import { Header } from './components/Header.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { MatchDetail } from './pages/MatchDetail.jsx';

export default function App() {
  const { isDark, toggle: toggleTheme } = useDarkMode();
  const { matches, loading, notice, source, refreshedAt, fetchMatches, refreshing } = useMatches();

  // Simple client-side navigation state (no router needed for SPA)
  const [selectedMatch, setSelectedMatch] = useState(null); // { id, preview }

  const handleMatchClick = (match) => {
    setSelectedMatch({ id: match.id, preview: match });
  };

  const handleBack = () => {
    setSelectedMatch(null);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-700'}`}>
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onRefresh={selectedMatch ? null : () => fetchMatches({ silent: true })}
        refreshing={refreshing}
      />

      {selectedMatch ? (
        <MatchDetail
          matchId={selectedMatch.id}
          matchPreview={selectedMatch.preview}
          isDark={isDark}
          onBack={handleBack}
        />
      ) : (
        <Dashboard
          isDark={isDark}
          matches={matches}
          loading={loading}
          notice={notice}
          source={source}
          refreshedAt={refreshedAt}
          onMatchClick={handleMatchClick}
        />
      )}
    </div>
  );
}
