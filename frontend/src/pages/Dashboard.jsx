import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import UserCard from '../components/UserCard.jsx';
import GameCard from '../components/GameCard.jsx';

// Constantes para no desplegar nombres de datos como aparecen en la Base de Datos

const ROLES = [
  { value: '',                    label: 'All Roles' },
  { value: 'estudiante',          label: 'Student' },
  { value: 'trabajador_rockwell', label: 'Rockwell Employee' },
  { value: 'otra_empresa',        label: 'External Partner' },
];

const ACTIVE_OPTS = [
  { value: '',      label: 'Any Status' },
  { value: 'true',  label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

const DIFFICULTY_OPTS = [
  { value: '',  label: 'Any' },
  { value: '1', label: 'Beginner' },
  { value: '2', label: 'Easy' },
  { value: '3', label: 'Intermediate' },
  { value: '4', label: 'Advanced' },
  { value: '5', label: 'Expert' },
];

const PAGE_SIZE = 10;

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-gray-100 text-gray-800 text-sm font-semibold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function FilterInput({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{label}</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-gray-100 text-gray-800 text-sm font-semibold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-300 w-28"
      />
    </div>
  );
}

function FilterDate({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{label}</span>
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-gray-100 text-gray-800 text-sm font-semibold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-300 w-36"
      />
    </div>
  );
}

// Filtro de texto para buscar por nombre de juego
function FilterText({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-gray-100 text-gray-800 text-sm font-semibold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-300 w-44"
      />
    </div>
  );
}

function KpiCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col gap-0.5">
      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{label}</span>
      <span className="text-xl font-extrabold text-[#1a1a1a]">
        {value ?? <span className="text-gray-300">—</span>}
      </span>
      {sub && <span className="text-[11px] text-gray-400 font-medium">{sub}</span>}
    </div>
  );
}

function KpiSection({ title, children, cols = 4 }) {
  return (
    <div className="flex flex-col gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 pt-3 pb-4">
      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{title}</span>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {children}
      </div>
    </div>
  );
}

function Dashboard() {
  // Usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loadingU, setLoadingU] = useState(true);
  const [errorU, setErrorU]     = useState(false);
  const [page, setPage]         = useState(0);

  // Filtros usuarios
  const [role,              setRole]              = useState('');
  const [active,            setActive]            = useState('');
  const [scoreMin,          setScoreMin]          = useState('');
  const [scoreMax,          setScoreMax]          = useState('');
  const [registeredAfter,   setRegisteredAfter]   = useState('');
  const [registeredBefore,  setRegisteredBefore]  = useState('');

  // KPIs
  const [kpis, setKpis]         = useState(null);
  const [loadingK, setLoadingK] = useState(true);
  const [errorK, setErrorK]     = useState(false);

  // Juegos — guardamos TODOS los juegos cargados (sin paginar por nombre)
  // para poder filtrar por nombre en el frontend
  const [juegos, setJuegos]     = useState([]);
  const [totalJ, setTotalJ]     = useState(0);
  const [loadingJ, setLoadingJ] = useState(true);
  const [errorJ, setErrorJ]     = useState(false);
  const [pageJ, setPageJ]       = useState(0);

  // Filtros juegos
  const [diffMin,        setDiffMin]        = useState('');
  const [diffMax,        setDiffMax]        = useState('');
  const [completionMin,  setCompletionMin]  = useState('');
  const [completionMax,  setCompletionMax]  = useState('');

  // Filtro por nombre de juego (texto libre)
  const [gameNameFilter, setGameNameFilter] = useState('');

  const totalPages  = Math.ceil(total  / PAGE_SIZE);

  // ── Params ──
  const buildUserParams = useCallback(() => ({
    ...(role             && { role }),
    ...(active           && { active }),
    ...(scoreMin         && { score_min: scoreMin }),
    ...(scoreMax         && { score_max: scoreMax }),
    ...(registeredAfter  && { registered_after:  `${registeredAfter}T00:00:00` }),
    ...(registeredBefore && { registered_before: `${registeredBefore}T23:59:59` }),
  }), [role, active, scoreMin, scoreMax, registeredAfter, registeredBefore]);

  const buildGameParams = useCallback(() => ({
    ...(diffMin       && { difficulty_min: diffMin }),
    ...(diffMax       && { difficulty_max: diffMax }),
    ...(completionMin && { completion_min: completionMin }),
    ...(completionMax && { completion_max: completionMax }),
  }), [diffMin, diffMax, completionMin, completionMax]);

  // ── Fetches ──
  const fetchUsuarios = useCallback(async () => {
    setLoadingU(true); setErrorU(false);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        import.meta.env.VITE_API_URL + '/api/usuarios',
        { headers: { Authorization: `Bearer ${token}` },
          params: { limit: PAGE_SIZE, offset: page * PAGE_SIZE, ...buildUserParams() } }
      );
      setUsuarios(res.data.data);
      setTotal(res.data.total);
    } catch { setErrorU(true); }
    finally  { setLoadingU(false); }
  }, [page, buildUserParams]);

  const fetchKpis = useCallback(async () => {
    setLoadingK(true); setErrorK(false);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        import.meta.env.VITE_API_URL + '/api/usuarios/kpis',
        { headers: { Authorization: `Bearer ${token}` }, params: buildUserParams() }
      );
      setKpis(res.data);
    } catch { setErrorK(true); }
    finally  { setLoadingK(false); }
  }, [buildUserParams]);

  // FetchJuegos pide todos los juegos que pasen los filtros de dificultad
  // y win rate. El filtro por nombre se aplica después, en el frontend.
  // Pedimos un límite alto (999) para tener todos disponibles al filtrar por nombre.
  const fetchJuegos = useCallback(async () => {
    setLoadingJ(true); setErrorJ(false);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        import.meta.env.VITE_API_URL + '/api/juegos',
        { headers: { Authorization: `Bearer ${token}` },
          params: { limit: 999, offset: 0, ...buildGameParams() } }
      );
      setJuegos(res.data.data);
      setTotalJ(res.data.total);
    } catch { setErrorJ(true); }
    finally  { setLoadingJ(false); }
  }, [buildGameParams]);

  useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);
  useEffect(() => { fetchKpis();    }, [fetchKpis]);
  useEffect(() => { fetchJuegos();  }, [fetchJuegos]);

  // ── Handlers usuarios ──
  const handleUserFilter = (setter) => (val) => { setPage(0); setter(val); };
  const handleClearUserFilters = () => {
    setPage(0);
    setRole(''); setActive(''); setScoreMin(''); setScoreMax('');
    setRegisteredAfter(''); setRegisteredBefore('');
  };
  const hasUserFilters = role || active || scoreMin || scoreMax || registeredAfter || registeredBefore;

  // ── Handlers juegos ──
  const handleGameFilter = (setter) => (val) => { setPageJ(0); setter(val); };
  const handleClearGameFilters = () => {
    setPageJ(0); setDiffMin(''); setDiffMax('');
    setCompletionMin(''); setCompletionMax('');
    setGameNameFilter('');  
  };
  const hasGameFilters = diffMin || diffMax || completionMin || completionMax || gameNameFilter;

  // ── Filtrado por nombre en el frontend ──
  // Filtramos los juegos cargados por el texto escrito en el campo de nombre.
  // La búsqueda no distingue mayúsculas/minúsculas.
  const juegosFiltradosPorNombre = useMemo(() => {
    if (!gameNameFilter.trim()) return juegos;
    const termino = gameNameFilter.trim().toLowerCase();
    return juegos.filter(j => j.name.toLowerCase().includes(termino));
  }, [juegos, gameNameFilter]);

  // ── Paginación aplicada sobre los resultados ya filtrados por nombre ──
  const totalJFiltrados = juegosFiltradosPorNombre.length;
  const totalPagesJ     = Math.ceil(totalJFiltrados / PAGE_SIZE);

  // Si el filtro de nombre cambia y la página actual queda fuera de rango,
  // la reseteamos automáticamente.
  const paginaSegurajuegos = Math.min(pageJ, Math.max(0, totalPagesJ - 1));
  const juegosPagina = juegosFiltradosPorNombre.slice(
    paginaSegurajuegos * PAGE_SIZE,
    paginaSegurajuegos * PAGE_SIZE + PAGE_SIZE
  );

  const fmt = (val, decimals = 0) =>
    val != null ? Number(val).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : null;

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 72px)' }}>

      {/* Banner */}
      <div
        className="w-full py-8 flex items-center justify-center rounded-b-3xl shadow-md shrink-0"
        style={{ background: 'linear-gradient(to right, #F58025, #CD163F)' }}
      >
        <h1 className="text-white font-bold text-4xl tracking-wide">Dashboard</h1>
      </div>

      <div className="flex-1 flex flex-col px-6 py-6 gap-5">

        {/* KPIs */}
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-4">
          {loadingK && <p className="text-center text-gray-400 font-semibold animate-pulse text-sm py-2">Loading stats...</p>}
          {errorK   && <p className="text-center text-red-400 font-semibold text-sm py-2">Could not load stats.</p>}
          {!loadingK && !errorK && kpis && (
            <>
              <KpiSection title="Users" cols={4}>
                <KpiCard label="Total"     value={fmt(kpis.total_usuarios)} />
                <KpiCard label="Active"    value={fmt(kpis.usuarios_activos)} />
                <KpiCard label="Countries" value={fmt(kpis.paises_unicos)} />
                <KpiCard label="Avg Score" value={fmt(kpis.score_promedio, 1)} />
                <KpiCard label="Max Score" value={fmt(kpis.score_maximo)} />
                <KpiCard label="Min Score" value={fmt(kpis.score_minimo)} />
                <KpiCard label="Students"  value={fmt(kpis.total_estudiantes)} />
                <KpiCard label="Rockwell"  value={fmt(kpis.total_rockwell)} />
                <KpiCard label="External"  value={fmt(kpis.total_otras)} />
              </KpiSection>
              <KpiSection title="Games — global" cols={3}>
                <KpiCard label="Total Games"      value={fmt(kpis.total_juegos)} />
                <KpiCard label="Most Played"      value={kpis.juego_mas_jugado} />
                <KpiCard label="Overall Win Rate" value={kpis.tasa_victorias != null ? `${fmt(kpis.tasa_victorias, 1)}%` : null} />
              </KpiSection>
              <KpiSection title="Rounds — filtered users" cols={5}>
                <KpiCard label="Total Rounds"       value={fmt(kpis.total_rondas)} />
                <KpiCard label="Total Games Played" value={fmt(kpis.total_partidas)} />
                <KpiCard label="Avg Games / Round"  value={fmt(kpis.avg_juegos_por_ronda, 1)} />
                <KpiCard label="Max Games in Round" value={fmt(kpis.max_juegos_en_ronda)} />
                <KpiCard label="Min Games in Round" value={fmt(kpis.min_juegos_en_ronda)} />
              </KpiSection>
            </>
          )}
        </div>

        {/* ── DIVISOR ── */}
        <div className="max-w-5xl mx-auto w-full border-t border-gray-100" />

        {/* Filtros usuarios */}
        <div className="max-w-5xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-wrap items-end gap-4">
          <FilterSelect label="Role"       value={role}     onChange={handleUserFilter(setRole)}     options={ROLES} />
          <FilterSelect label="Status"     value={active}   onChange={handleUserFilter(setActive)}   options={ACTIVE_OPTS} />
          <FilterInput  label="Min Score"  value={scoreMin} onChange={handleUserFilter(setScoreMin)} placeholder="0" />
          <FilterInput  label="Max Score"  value={scoreMax} onChange={handleUserFilter(setScoreMax)} placeholder="9999" />
          <FilterDate   label="Registered After"  value={registeredAfter}  onChange={handleUserFilter(setRegisteredAfter)} />
          <FilterDate   label="Registered Before" value={registeredBefore} onChange={handleUserFilter(setRegisteredBefore)} />
          {hasUserFilters && (
            <button onClick={handleClearUserFilters} className="text-[#CD163F] text-xs font-bold tracking-widest uppercase border border-[#CD163F] rounded-full px-4 py-1.5 hover:bg-[#CD163F11] active:scale-95 transition-all">
              Clear
            </button>
          )}
          <div className="ml-auto">
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              {loadingU ? '...' : `${total} user${total !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* Lista usuarios */}
        <div className="max-w-5xl mx-auto w-full grid grid-cols-2 gap-3">
          {loadingU && <p className="col-span-2 text-center text-gray-400 font-semibold animate-pulse py-10">Loading...</p>}
          {errorU   && <p className="col-span-2 text-center text-red-500 font-semibold py-10">Could not load users. Please try again.</p>}
          {!loadingU && !errorU && usuarios.length === 0 && <p className="col-span-2 text-center text-gray-400 font-semibold py-10">No users match the current filters.</p>}
          {!loadingU && !errorU && usuarios.map(u => (
            <UserCard key={u.user_id} usuario={u} modo="dashboard" />
          ))}
        </div>

        {/* Paginacion usuarios */}
        {!loadingU && totalPages > 1 && (
          <div className="max-w-5xl mx-auto w-full flex items-center justify-center gap-3 pt-2">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
              className="bg-gray-100 text-gray-700 font-bold px-5 py-1.5 rounded-full text-sm disabled:opacity-30 hover:bg-gray-200 active:scale-95 transition-all">
              ← Prev
            </button>
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
              className="bg-gray-100 text-gray-700 font-bold px-5 py-1.5 rounded-full text-sm disabled:opacity-30 hover:bg-gray-200 active:scale-95 transition-all">
              Next →
            </button>
          </div>
        )}

        {/* ── DIVISOR ── */}
        <div className="max-w-5xl mx-auto w-full border-t border-gray-100" />

        {/* Filtros juegos */}
        <div className="max-w-5xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-wrap items-end gap-4">

          {/* NUEVO: campo de búsqueda por nombre */}
          <FilterText
            label="Game Name"
            value={gameNameFilter}
            onChange={(val) => { setPageJ(0); setGameNameFilter(val); }}
            placeholder="Search by name…"
          />

          <FilterSelect label="Min Difficulty" value={diffMin} onChange={handleGameFilter(setDiffMin)} options={DIFFICULTY_OPTS} />
          <FilterSelect label="Max Difficulty" value={diffMax} onChange={handleGameFilter(setDiffMax)} options={DIFFICULTY_OPTS} />
          <FilterInput  label="Min Win Rate %"  value={completionMin} onChange={handleGameFilter(setCompletionMin)} placeholder="0" />
          <FilterInput  label="Max Win Rate %"  value={completionMax} onChange={handleGameFilter(setCompletionMax)} placeholder="100" />
          {hasGameFilters && (
            <button onClick={handleClearGameFilters} className="text-[#CD163F] text-xs font-bold tracking-widest uppercase border border-[#CD163F] rounded-full px-4 py-1.5 hover:bg-[#CD163F11] active:scale-95 transition-all">
              Clear
            </button>
          )}
          <div className="ml-auto">
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              {/* Mostramos cuántos juegos quedan tras el filtro de nombre */}
              {loadingJ ? '...' : `${totalJFiltrados} game${totalJFiltrados !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* Lista juegos */}
        <div className="max-w-5xl mx-auto w-full grid grid-cols-2 gap-3">
          {loadingJ && <p className="col-span-2 text-center text-gray-400 font-semibold animate-pulse py-10">Loading...</p>}
          {errorJ   && <p className="col-span-2 text-center text-red-500 font-semibold py-10">Could not load games. Please try again.</p>}
          {!loadingJ && !errorJ && juegosPagina.length === 0 && (
            <p className="col-span-2 text-center text-gray-400 font-semibold py-10">No games match the current filters.</p>
          )}
          {!loadingJ && !errorJ && juegosPagina.map(j => (
            <GameCard key={j.game_id} juego={j} />
          ))}
        </div>

        {/* Paginacion juegos */}
        {!loadingJ && totalPagesJ > 1 && (
          <div className="max-w-5xl mx-auto w-full flex items-center justify-center gap-3 pt-2 pb-4">
            <button onClick={() => setPageJ(p => Math.max(0, p - 1))} disabled={paginaSegurajuegos === 0}
              className="bg-gray-100 text-gray-700 font-bold px-5 py-1.5 rounded-full text-sm disabled:opacity-30 hover:bg-gray-200 active:scale-95 transition-all">
              ← Prev
            </button>
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">{paginaSegurajuegos + 1} / {totalPagesJ}</span>
            <button onClick={() => setPageJ(p => Math.min(totalPagesJ - 1, p + 1))} disabled={paginaSegurajuegos >= totalPagesJ - 1}
              className="bg-gray-100 text-gray-700 font-bold px-5 py-1.5 rounded-full text-sm disabled:opacity-30 hover:bg-gray-200 active:scale-95 transition-all">
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;