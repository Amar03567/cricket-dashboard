import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const clientFallbackMatches = [
  {
    id: 'client-demo-1',
    name: 'India vs Australia',
    team1: 'India',
    team2: 'Australia',
    team1Score: '286/7 (50 ov)',
    team2Score: '242/9 (50 ov)',
    matchType: 'ODI',
    status: 'Sample scorecard (backend offline)',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    series: 'Demo Series',
    date: new Date().toISOString(),
    isLive: false,
  },
  {
    id: 'client-demo-2',
    name: 'England vs South Africa',
    team1: 'England',
    team2: 'South Africa',
    team1Score: '174/6 (20 ov)',
    team2Score: '68/2 (7.4 ov)',
    matchType: 'T20',
    status: 'Sample scorecard (backend offline)',
    venue: "Lord's, London",
    series: 'Demo Series',
    date: new Date().toISOString(),
    isLive: true,
  },
];

export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState('');
  const [source, setSource] = useState('demo');
  const [refreshedAt, setRefreshedAt] = useState('');
  const [error, setError] = useState(null);

  const fetchMatches = useCallback(async ({ silent = false } = {}) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/live`);
      const json = await response.json();

      if (!response.ok) throw new Error(json.error || 'Unable to load cricket scores');

      setMatches(Array.isArray(json.data) ? json.data : []);
      setNotice(json.meta?.message || '');
      setSource(json.meta?.source || 'live');
      setRefreshedAt(json.meta?.refreshedAt || new Date().toISOString());
    } catch (err) {
      setError(err.message || 'Unable to connect to the score service.');
      setNotice('Unable to connect to the backend. Showing client-side demo data.');
      setSource('demo');
      setMatches(clientFallbackMatches);
      setRefreshedAt(new Date().toISOString());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => fetchMatches({ silent: true }), 120_000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  return { matches, loading, refreshing, notice, source, refreshedAt, error, fetchMatches };
}

export function useMatchDetail(matchId) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('');

  const fetchDetail = useCallback(async () => {
    if (!matchId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/match/${matchId}`);
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Unable to load match details');
      setDetail(json.data);
      setSource(json.meta?.source || '');
    } catch (err) {
      setError(err.message || 'Failed to load match details.');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { detail, loading, error, source, refetch: fetchDetail };
}
