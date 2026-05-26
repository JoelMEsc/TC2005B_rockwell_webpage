import React from 'react';

const DIFFICULTY_LABELS = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

const DIFFICULTY_COLORS = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-lime-100 text-lime-700',
  3: 'bg-yellow-100 text-yellow-700',
  4: 'bg-orange-100 text-orange-700',
  5: 'bg-red-100 text-red-700',
};

function InfoCol({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-[#1a1a1a]">
        {value !== null && value !== undefined && value !== '' ? value : '-'}
      </span>
    </div>
  );
}

function WinRateBar({ completion }) {
  const pct = completion != null ? Math.round(Number(completion) * 100) : null;
  if (pct === null) return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Win Rate</span>
      <span className="text-sm font-semibold text-[#1a1a1a]">-</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Win Rate</span>
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(to right, #F58025, #CD163F)',
            }}
          />
        </div>
        <span className="text-sm font-semibold text-[#1a1a1a] w-8">{pct}%</span>
      </div>
    </div>
  );
}

export default function GameCard({ juego }) {
  if (!juego) return null;

  const { name, difficulty, times_played, completion } = juego;

  const diffLabel = DIFFICULTY_LABELS[difficulty] ?? `Lv ${difficulty}`;
  const diffColor = DIFFICULTY_COLORS[difficulty] ?? 'bg-gray-100 text-gray-500';

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div
        className="h-1.5 w-full"
        style={{ background: 'linear-gradient(to right, #F58025, #CD163F)' }}
      />

      <div className="p-4 flex items-center gap-6">

        {/* Nombre + Times Played — ancho fijo para consistencia */}
        <div className="flex flex-col gap-2 w-40 shrink-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Game</span>
            <span className="text-sm font-semibold text-[#1a1a1a] leading-tight">{name}</span>
          </div>
          <InfoCol label="Times Played" value={times_played?.toLocaleString('en-US')} />
        </div>

        {/* Win Rate — ancho fijo */}
        <div className="w-44 shrink-0">
          <WinRateBar completion={completion} />
        </div>

        {/* Badge dificultad — ancho fijo para que no desplace nada */}
        <div className="w-24 shrink-0 flex justify-end">
          <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${diffColor}`}>
            {diffLabel}
          </span>
        </div>

      </div>
    </div>
  );
}