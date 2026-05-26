import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ── Helpers ──────────────────────────────────────────────────────────────────

const DIFFICULTY_LABELS = {
  1: 'Beginner', 2: 'Easy', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert',
};
const DIFFICULTY_COLORS = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-lime-100  text-lime-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-orange-100 text-orange-700',
  5: 'bg-red-100   text-red-700',
};

function calcStats(rondas) {
  if (!rondas.length) return null;

  const scores       = rondas.map(r => r.score);
  const maxScore     = Math.max(...scores);
  const avgScore     = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const totalRondas  = rondas.length;

  // Aplanar todos los juegos de todas las rondas
  const allGames = rondas.flatMap(r =>
    Array.isArray(r.juegos) ? r.juegos : JSON.parse(r.juegos ?? '[]')
  );
  const totalGames = allGames.length;
  const wonGames   = allGames.filter(g => g.won).length;
  const winRate    = totalGames ? Math.round((wonGames / totalGames) * 100) : 0;

  // Frecuencia por juego
  const freq = {};
  const wins = {};
  allGames.forEach(g => {
    freq[g.name] = (freq[g.name] ?? 0) + 1;
    if (g.won) wins[g.name] = (wins[g.name] ?? 0) + 1;
  });
  const mostPlayed = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  const mostWon    = Object.entries(wins).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  return { maxScore, avgScore, totalRondas, winRate, wonGames, totalGames, mostPlayed, mostWon };
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-4 flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{label}</span>
      <span className="text-2xl font-extrabold text-[#1a1a1a]">{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

function WinRateBar({ pct }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(to right, #F58025, #CD163F)' }}
        />
      </div>
      <span className="text-sm font-bold text-[#1a1a1a] w-10 text-right">{pct}%</span>
    </div>
  );
}

function RoundCard({ ronda }) {
  const [open, setOpen] = useState(false);

  const juegos = Array.isArray(ronda.juegos)
    ? ronda.juegos
    : JSON.parse(ronda.juegos ?? '[]');

  const fecha = ronda.primera_jugada
    ? new Date(ronda.primera_jugada).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : '—';

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-shadow duration-200 hover:shadow-lg">
      {/* Barra superior */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #F58025, #CD163F)' }} />

      {/* Header clickable */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full p-4 flex items-center gap-6 text-left"
      >
        {/* Score */}
        <div className="flex flex-col gap-0.5 w-28 shrink-0">
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Score</span>
          <span className="text-xl font-extrabold text-[#1a1a1a]">{ronda.score.toLocaleString('en-US')}</span>
        </div>

        {/* Fecha */}
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Date</span>
          <span className="text-sm font-semibold text-[#1a1a1a]">{fecha}</span>
        </div>

        {/* Juegos ganados */}
        <div className="flex flex-col gap-0.5 shrink-0 items-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Won</span>
          <span className="text-sm font-semibold text-[#1a1a1a]">
            {ronda.juegos_ganados} / {ronda.total_juegos}
          </span>
        </div>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Juegos expandibles */}
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-2 border-t border-gray-100 pt-3">
          {juegos.map(g => (
            <div key={g.round_game_id} className="flex items-center gap-4 py-1.5">
              {/* Resultado */}
              <span className={`w-2 h-2 rounded-full shrink-0 ${g.won ? 'bg-green-400' : 'bg-red-300'}`} />

              {/* Nombre */}
              <span className="text-sm font-semibold text-[#1a1a1a] flex-1">{g.name}</span>

              {/* Dificultad */}
              <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full shrink-0 ${DIFFICULTY_COLORS[g.difficulty] ?? 'bg-gray-100 text-gray-400'}`}>
                {DIFFICULTY_LABELS[g.difficulty] ?? `Lv ${g.difficulty}`}
              </span>

              {/* Won/Lost */}
              <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full shrink-0 ${g.won ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                {g.won ? 'Won' : 'Lost'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

function Performance() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [rondas,   setRondas]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rondas/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRondas(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const stats = calcStats(rondas);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Banner */}
      <div
        className="w-full py-8 flex items-center justify-center rounded-b-3xl shadow-md relative"
        style={{ background: 'linear-gradient(to right, #F58025, #CD163F)' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 text-white/80 hover:text-white transition flex items-center gap-1.5 text-sm font-semibold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-white font-bold text-4xl tracking-wide">Performance</h1>
      </div>

      <div className="max-w-3xl mx-auto w-full px-6 py-8 flex flex-col gap-8">

        {/* Loading / Error */}
        {loading && <p className="text-gray-400 font-semibold animate-pulse text-center">Loading...</p>}
        {error   && <p className="text-red-500 font-semibold text-center">Could not load performance data.</p>}

        {/* Sin rondas */}
        {!loading && !error && !rondas.length && (
          <p className="text-gray-400 font-semibold text-center">No rounds played yet.</p>
        )}

        {/* Stats */}
        {stats && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">Overview</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard label="Max Score"    value={stats.maxScore.toLocaleString('en-US')} />
              <StatCard label="Avg Score"    value={stats.avgScore.toLocaleString('en-US')} />
              <StatCard label="Total Rounds" value={stats.totalRondas} />
              <StatCard label="Most Played"  value={stats.mostPlayed} />
              <StatCard label="Most Won"     value={stats.mostWon} />
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-4 flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Win Rate</span>
                <WinRateBar pct={stats.winRate} />
                <span className="text-xs text-gray-400">{stats.wonGames} won of {stats.totalGames} games</span>
              </div>
            </div>
          </div>
        )}

        {/* Historial */}
        {!loading && !error && rondas.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">Round History</h2>
            {rondas.map(r => <RoundCard key={r.round_id} ronda={r} />)}
          </div>
        )}

      </div>
    </div>
  );
}

export default Performance;