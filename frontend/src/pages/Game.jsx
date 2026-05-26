import React from 'react';
import { useNavigate } from 'react-router-dom';

function Game() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-72px)]">

      {/* Banner */}
      <div
        className="w-full py-7 sm:py-8 flex items-center justify-center rounded-b-3xl shadow-md"
        style={{ background: 'linear-gradient(to right, #F58025, #CD163F)' }}
      >
        <h1 className="text-white font-bold text-3xl sm:text-4xl tracking-wide">Game</h1>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 gap-6 py-6">

        {/* Placeholder — aspect-video en desktop, altura fija más compacta en móvil */}
        <div className="w-full max-w-3xl sm:aspect-video rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center shadow-inner"
          style={{ minHeight: '200px' }}>
          <div className="flex flex-col items-center gap-3 text-gray-300 select-none">
            <svg viewBox="0 0 80 80" className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="10" y="28" width="60" height="36" rx="4" />
              <path d="M28 44h4M40 38v12M36 44h4M52 40l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30 28V20a10 10 0 0120 0v8" strokeLinecap="round"/>
            </svg>
            <span className="font-bold tracking-widest uppercase text-xs sm:text-sm">Game Coming Soon</span>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[#003e7e] text-white font-bold px-10 py-2 rounded-full active:scale-95 transition-transform duration-150 hover:bg-[#002d5c] w-full sm:w-auto"
          >
            Go to Dashboard
          </button>
        )}

      </div>
    </div>
  );
}

export default Game;
