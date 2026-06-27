import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose'; // <-- Added Mongoose import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CACHE_SECONDS = Number(process.env.CACHE_SECONDS || 120);
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'cricbuzz-cricket.p.rapidapi.com';
const CRICKET_API_KEY = process.env.CRICKET_API_KEY;

const cache = new NodeCache({ stdTTL: CACHE_SECONDS, checkperiod: CACHE_SECONDS * 2 });

app.use(cors({
  origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : '*',
}));

app.use(express.json());

// ─── Demo Data ──────────────────────────────────────────────────────────────

const demoMatches = [
  {
    id: 'demo-1',
    name: 'India vs Australia',
    team1: 'India',
    team2: 'Australia',
    team1Id: 't1',
    team2Id: 't2',
    team1Score: '286/7 (50 ov)',
    team2Score: '242/9 (50 ov)',
    matchType: 'ODI',
    status: 'India won by 44 runs',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    series: 'India vs Australia ODI Series 2025',
    toss: 'India won the toss and elected to bat',
    date: new Date().toISOString(),
    isLive: false,
  },
  {
    id: 'demo-2',
    name: 'England vs South Africa',
    team1: 'England',
    team2: 'South Africa',
    team1Id: 't3',
    team2Id: 't4',
    team1Score: '174/6 (20 ov)',
    team2Score: '68/2 (7.4 ov)',
    matchType: 'T20',
    status: 'South Africa need 107 runs from 54 balls',
    venue: "Lord's, London",
    series: 'England vs South Africa T20I Series 2025',
    toss: 'England won the toss and elected to bat',
    date: new Date().toISOString(),
    isLive: true,
  },
  {
    id: 'demo-3',
    name: 'Pakistan vs New Zealand',
    team1: 'Pakistan',
    team2: 'New Zealand',
    team1Id: 't5',
    team2Id: 't6',
    team1Score: '312 (102.4 ov)',
    team2Score: '104/3 (38 ov)',
    matchType: 'Test',
    status: 'Day 2: New Zealand trail by 208 runs',
    venue: 'National Stadium, Karachi',
    series: 'Pakistan vs New Zealand Test Series 2025',
    toss: 'Pakistan won the toss and elected to bat',
    date: new Date().toISOString(),
    isLive: true,
  },
  {
    id: 'demo-4',
    name: 'Sri Lanka vs Bangladesh',
    team1: 'Sri Lanka',
    team2: 'Bangladesh',
    team1Id: 't7',
    team2Id: 't8',
    team1Score: '198/8 (20 ov)',
    team2Score: null,
    matchType: 'T20',
    status: 'Bangladesh innings yet to start',
    venue: 'R. Premadasa Stadium, Colombo',
    series: 'Asia Cup T20 2025',
    toss: 'Sri Lanka won the toss and elected to bat',
    date: new Date().toISOString(),
    isLive: true,
  },
];

const demoMatchDetails = {
  'demo-1': {
    matchInfo: {
      id: 'demo-1',
      name: 'India vs Australia',
      matchFormat: 'ODI',
      status: 'India won by 44 runs',
      team1: { name: 'India', shortName: 'IND' },
      team2: { name: 'Australia', shortName: 'AUS' },
      venue: 'Narendra Modi Stadium, Ahmedabad',
      series: 'India vs Australia ODI Series 2025',
      toss: 'India won the toss and elected to bat',
      umpire1: 'Richard Kettleborough',
      umpire2: 'Michael Gough',
      date: new Date().toISOString(),
      isLive: false,
    },
    innings: [
      {
        team: 'India',
        shortName: 'IND',
        inningsId: 1,
        runs: 286,
        wickets: 7,
        overs: '50.0',
        isDeclared: false,
        batters: [
          { name: 'Rohit Sharma', runs: 82, balls: 95, fours: 9, sixes: 2, strikeRate: '86.32', isOut: true, dismissal: 'c Smith b Starc' },
          { name: 'Shubman Gill', runs: 46, balls: 58, fours: 5, sixes: 1, strikeRate: '79.31', isOut: true, dismissal: 'c Warner b Hazlewood' },
          { name: 'Virat Kohli', runs: 71, balls: 83, fours: 7, sixes: 0, strikeRate: '85.54', isOut: true, dismissal: 'b Cummins' },
          { name: 'KL Rahul', runs: 38, balls: 42, fours: 4, sixes: 0, strikeRate: '90.48', isOut: true, dismissal: 'lbw b Zampa' },
          { name: 'Hardik Pandya', runs: 29, balls: 22, fours: 2, sixes: 2, strikeRate: '131.82', isOut: false, dismissal: 'not out' },
          { name: 'Ravindra Jadeja', runs: 14, balls: 12, fours: 1, sixes: 0, strikeRate: '116.67', isOut: false, dismissal: 'not out' },
        ],
        bowlers: [
          { name: 'Mitchell Starc', overs: '10', maidens: 0, runs: 56, wickets: 2, economy: '5.60' },
          { name: 'Josh Hazlewood', overs: '10', maidens: 1, runs: 48, wickets: 2, economy: '4.80' },
          { name: 'Pat Cummins', overs: '10', maidens: 0, runs: 62, wickets: 2, economy: '6.20' },
          { name: 'Adam Zampa', overs: '10', maidens: 0, runs: 54, wickets: 1, economy: '5.40' },
          { name: 'Glen Maxwell', overs: '10', maidens: 0, runs: 58, wickets: 0, economy: '5.80' },
        ],
      },
      {
        team: 'Australia',
        shortName: 'AUS',
        inningsId: 2,
        runs: 242,
        wickets: 9,
        overs: '50.0',
        isDeclared: false,
        batters: [
          { name: 'David Warner', runs: 34, balls: 41, fours: 4, sixes: 0, strikeRate: '82.93', isOut: true, dismissal: 'c Jadeja b Bumrah' },
          { name: 'Travis Head', runs: 68, balls: 72, fours: 8, sixes: 1, strikeRate: '94.44', isOut: true, dismissal: 'b Shami' },
          { name: 'Steve Smith', runs: 71, balls: 89, fours: 6, sixes: 1, strikeRate: '79.78', isOut: true, dismissal: 'lbw b Jadeja' },
          { name: 'Glen Maxwell', runs: 28, balls: 19, fours: 3, sixes: 1, strikeRate: '147.37', isOut: true, dismissal: 'c Kohli b Bumrah' },
          { name: 'Pat Cummins', runs: 21, balls: 18, fours: 2, sixes: 0, strikeRate: '116.67', isOut: false, dismissal: 'not out' },
        ],
        bowlers: [
          { name: 'Jasprit Bumrah', overs: '10', maidens: 2, runs: 38, wickets: 3, economy: '3.80' },
          { name: 'Mohammed Shami', overs: '10', maidens: 1, runs: 44, wickets: 2, economy: '4.40' },
          { name: 'Ravindra Jadeja', overs: '10', maidens: 0, runs: 48, wickets: 2, economy: '4.80' },
          { name: 'Hardik Pandya', overs: '10', maidens: 0, runs: 58, wickets: 1, economy: '5.80' },
          { name: 'Kuldeep Yadav', overs: '10', maidens: 0, runs: 54, wickets: 1, economy: '5.40' },
        ],
      },
    ],
    commentary: [
      { over: '49.6', event: 'WICKET', text: 'Bumrah to Hazlewood, OUT! Bowled him! Cleans up the tail. India win by 44 runs!' },
      { over: '49.3', event: 'FOUR', text: 'Bumrah to Cummins, FOUR! Driven beautifully through the covers.' },
      { over: '48.2', event: 'SIX', text: 'Shami to Starc, SIX! Huge shot over long-on!' },
    ],
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatScore(score = {}) {
  const innings = score.inngs1 || score.inngs2;
  if (!innings || innings.runs === undefined) return null;
  const wickets = innings.wickets !== undefined ? `/${innings.wickets}` : '';
  const overs = innings.overs ? ` (${innings.overs} ov)` : '';
  return `${innings.runs}${wickets}${overs}`;
}

function isMatchLive(status = '') {
  const lower = status.toLowerCase();
  return (
    lower.includes('live') ||
    lower.includes('in progress') ||
    lower.includes('need') ||
    lower.includes('trail') ||
    lower.includes('leads') ||
    lower.includes('day ')
  );
}

function normalizeCricbuzzResponse(apiData) {
  if (!apiData?.typeMatches) return [];
  return apiData.typeMatches.flatMap((typeGroup) =>
    (typeGroup.seriesMatches || []).flatMap((series) =>
      (series.seriesAdWrapper?.matches || []).map((match) => {
        const info = match.matchInfo || {};
        const score = match.matchScore || {};
        const team1 = info.team1?.teamName || 'Team 1';
        const team2 = info.team2?.teamName || 'Team 2';
        const status = info.status || 'Match info updating...';
        return {
          id: String(info.matchId || randomUUID()),
          name: `${team1} vs ${team2}`,
          team1,
          team2,
          team1Id: info.team1?.teamId,
          team2Id: info.team2?.teamId,
          team1ShortName: info.team1?.teamSName,
          team2ShortName: info.team2?.teamSName,
          team1Score: formatScore(score.team1Score),
          team2Score: formatScore(score.team2Score),
          matchType: info.matchFormat || typeGroup.matchType || 'Match',
          status,
          venue: info.venueInfo?.ground
            ? `${info.venueInfo.ground}${info.venueInfo.city ? ', ' + info.venueInfo.city : ''}`
            : 'Venue TBD',
          series: series.seriesAdWrapper?.seriesName || '',
          toss: info.tossResults
            ? `${info.tossResults.tossWinnerName} won the toss and elected to ${info.tossResults.decision}`
            : null,
          date: info.startDate ? new Date(Number(info.startDate)).toISOString() : new Date().toISOString(),
          isLive: isMatchLive(status),
        };
      })
    )
  );
}

function normalizeMatchDetails(apiData, matchId) {
  if (!apiData) return null;
  const info = apiData.matchInfo || apiData.matchHeader || {};
  const scorecard = apiData.scorecard || apiData.miniscore || {};
  const innings = [];

  // Parse innings from scorecard
  if (apiData.scorecard) {
    (apiData.scorecard || []).forEach((inning) => {
      const batters = (inning.batTeamDetails?.batsmenData || inning.batsman || []).map((b) => {
        const d = b.batTeamDetails ? b : null;
        if (!d) {
          return {
            name: b.name || b.batName || 'Unknown',
            runs: b.r ?? b.runs ?? 0,
            balls: b.b ?? b.balls ?? 0,
            fours: b.fo ?? b.fours ?? 0,
            sixes: b.si ?? b.sixes ?? 0,
            strikeRate: b.sr ?? b.strikeRate ?? '0.00',
            isOut: b.outDec !== 'not out' && b.outDec !== '',
            dismissal: b.outDec || 'not out',
          };
        }
        return d;
      });

      const bowlers = (inning.bowlTeamDetails?.bowlersData || inning.bowler || []).map((b) => ({
        name: b.bowlName || b.name || 'Unknown',
        overs: b.bowlOvs ?? b.overs ?? '0',
        maidens: b.bowlMaidens ?? b.maidens ?? 0,
        runs: b.bowlRuns ?? b.runs ?? 0,
        wickets: b.bowlWkts ?? b.wickets ?? 0,
        economy: b.bowlEcon ?? b.economy ?? '0.00',
      }));

      innings.push({
        team: inning.batTeamDetails?.batTeamName || inning.batTeam || 'Team',
        shortName: inning.batTeamDetails?.batTeamShortName || '',
        inningsId: inning.inningsId || 1,
        runs: inning.scoreDetails?.runs ?? inning.runs ?? 0,
        wickets: inning.scoreDetails?.wickets ?? inning.wickets ?? 0,
        overs: inning.scoreDetails?.overs ?? inning.overs ?? '0.0',
        isDeclared: inning.scoreDetails?.isDeclared ?? false,
        batters: batters.slice(0, 11),
        bowlers: bowlers.slice(0, 8),
      });
    });
  }

  const recentOvers = scorecard?.recentOvsStats || null;
  const commentary = (apiData.commentary || []).slice(0, 20).map((c) => ({
    over: c.overNumber ?? c.over ?? '',
    event: c.event || c.commentaryType || '',
    text: c.commText || c.commentary || c.text || '',
  }));

  return {
    matchInfo: {
      id: matchId,
      name: info.seriesName
        ? `${info.team1?.name || ''} vs ${info.team2?.name || ''}`
        : info.matchTitle || `Match ${matchId}`,
      matchFormat: info.matchFormat || info.matchType || 'Match',
      status: info.status || 'Status unavailable',
      team1: {
        name: info.team1?.name || 'Team 1',
        shortName: info.team1?.sName || info.team1?.shortName || 'T1',
      },
      team2: {
        name: info.team2?.name || 'Team 2',
        shortName: info.team2?.sName || info.team2?.shortName || 'T2',
      },
      venue: info.venue?.name
        ? `${info.venue.name}${info.venue.city ? ', ' + info.venue.city : ''}`
        : 'Venue TBD',
      series: info.seriesName || '',
      toss: info.tossResults
        ? `${info.tossResults.tossWinnerName} won the toss and elected to ${info.tossResults.decision}`
        : null,
      umpire1: info.umpire1?.name || null,
      umpire2: info.umpire2?.name || null,
      date: info.startDate ? new Date(Number(info.startDate)).toISOString() : new Date().toISOString(),
      isLive: isMatchLive(info.status || ''),
    },
    innings,
    recentOvers,
    commentary,
  };
}

function sendMatches(res, matches, source, message) {
  res.json({
    data: matches,
    meta: { source, message, count: matches.length, refreshedAt: new Date().toISOString(), cacheSeconds: CACHE_SECONDS },
  });
}

function apiHeaders() {
  return { 'X-RapidAPI-Key': CRICKET_API_KEY, 'X-RapidAPI-Host': RAPIDAPI_HOST };
}

// ─── Routes ─────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', cacheSeconds: CACHE_SECONDS, cricketApiConfigured: Boolean(CRICKET_API_KEY) });
});

// GET /api/live — list of live/recent matches
app.get('/api/live', async (_req, res) => {
  const cachedMatches = cache.get('liveMatches');

  if (!CRICKET_API_KEY) {
    return sendMatches(res, demoMatches, 'demo', 'No cricket API key configured. Showing demo scorecards.');
  }

  if (cachedMatches) {
    return sendMatches(res, cachedMatches, 'cache', 'Showing recently fetched live cricket data.');
  }

  try {
    const response = await axios.get(`https://${RAPIDAPI_HOST}/matches/v1/live`, {
      timeout: 10000,
      headers: apiHeaders(),
    });

    const formattedMatches = normalizeCricbuzzResponse(response.data);
    cache.set('liveMatches', formattedMatches);

    return sendMatches(
      res,
      formattedMatches,
      'live',
      formattedMatches.length ? 'Showing live cricket data.' : 'No live matches right now.',
    );
  } catch (error) {
    const fallback = cache.get('liveMatches') || demoMatches;
    const src = cache.has('liveMatches') ? 'cache' : 'demo';
    console.error('Error fetching cricket data:', error.response?.status || error.message);
    return sendMatches(res, fallback, src, 'Live provider unavailable. Showing fallback scorecards.');
  }
});

// GET /api/match/:id — detailed match info + scorecard + commentary
app.get('/api/match/:id', async (req, res) => {
  const { id } = req.params;

  // Return demo data for demo IDs
  if (id.startsWith('demo-')) {
    const demo = demoMatchDetails[id];
    if (demo) return res.json({ data: demo, meta: { source: 'demo' } });
    // Generic demo fallback for other demo IDs
    return res.json({
      data: {
        matchInfo: {
          id,
          name: 'Demo Match',
          matchFormat: 'T20',
          status: 'Demo data only',
          team1: { name: 'Team A', shortName: 'TMA' },
          team2: { name: 'Team B', shortName: 'TMB' },
          venue: 'Demo Stadium',
          series: 'Demo Series',
          toss: null,
          date: new Date().toISOString(),
          isLive: false,
        },
        innings: [],
        commentary: [],
      },
      meta: { source: 'demo' },
    });
  }

  if (!CRICKET_API_KEY) {
    return res.status(503).json({ error: 'No API key configured. Cannot fetch live match details.' });
  }

  const cacheKey = `match-${id}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json({ data: cached, meta: { source: 'cache' } });

  try {
    // Try scorecard endpoint first (has most detail)
    const [scorecardRes, infoRes] = await Promise.allSettled([
      axios.get(`https://${RAPIDAPI_HOST}/mcenter/v1/${id}/scard`, { timeout: 10000, headers: apiHeaders() }),
      axios.get(`https://${RAPIDAPI_HOST}/mcenter/v1/${id}`, { timeout: 10000, headers: apiHeaders() }),
    ]);

    const scorecard = scorecardRes.status === 'fulfilled' ? scorecardRes.value.data : null;
    const info = infoRes.status === 'fulfilled' ? infoRes.value.data : null;

    if (!scorecard && !info) {
      return res.status(404).json({ error: 'Match details not found.' });
    }

    // Merge data: info provides matchInfo, scorecard provides batting/bowling
    const merged = {
      matchInfo: info?.matchInfo || scorecard?.matchHeader || {},
      scorecard: scorecard?.scorecard || [],
      commentary: scorecard?.commentary || [],
    };

    const normalized = normalizeMatchDetails(merged, id);
    cache.set(cacheKey, normalized, 60); // Cache for 60s (shorter for live detail)

    return res.json({ data: normalized, meta: { source: 'live' } });
  } catch (error) {
    console.error(`Error fetching match ${id}:`, error.response?.status || error.message);
    return res.status(500).json({ error: 'Failed to fetch match details. Please try again.' });
  }
});

// GET /api/recent — recently completed matches
app.get('/api/recent', async (_req, res) => {
  if (!CRICKET_API_KEY) {
    return sendMatches(res, demoMatches, 'demo', 'No API key. Showing demo matches.');
  }

  const cached = cache.get('recentMatches');
  if (cached) return sendMatches(res, cached, 'cache', 'Showing cached recent matches.');

  try {
    const response = await axios.get(`https://${RAPIDAPI_HOST}/matches/v1/recent`, {
      timeout: 10000,
      headers: apiHeaders(),
    });
    const matches = normalizeCricbuzzResponse(response.data);
    cache.set('recentMatches', matches, 300);
    return sendMatches(res, matches, 'live', 'Showing recent matches.');
  } catch (error) {
    console.error('Error fetching recent matches:', error.response?.status || error.message);
    return sendMatches(res, demoMatches, 'demo', 'Unable to fetch recent matches.');
  }
});

// ─── Database Connection ────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('🍃 MongoDB connected successfully!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
} else {
  console.log('⚠️ No MONGO_URI found in .env. Skipping MongoDB connection.');
}

// ─── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🏏 Cricket Hub backend running on http://localhost:${PORT}`);
});