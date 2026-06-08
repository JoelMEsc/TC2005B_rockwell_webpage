import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Game() {
  const token = localStorage.getItem('token');

  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  const iframeRef = useRef(null);

  const handleFullscreen = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
      iframe.mozRequestFullScreen();
    }
  };

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
      <div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 gap-4 py-6">

        {/* Contenedor del juego */}
        <div className="relative w-full max-w-6xl rounded-2xl overflow-hidden shadow-lg border border-gray-200"
          style={{ aspectRatio: '16/9' }}>
          
          <iframe
            ref={iframeRef}
            src={`${import.meta.env.VITE_API_URL}/secure-factory-game/index.html?token=${encodeURIComponent(token)}`}
            title="Game"
            className="w-full h-full border-0"
            allow="autoplay; fullscreen"
          />

          {/* Botón pantalla completa */}
          <button
            onClick={handleFullscreen}
            className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/75 text-white rounded-lg p-2 transition-colors duration-150"
            title="Pantalla completa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>

        {/* Botones */}
        <div className="flex gap-3 w-full max-w-6xl justify-end">
          {isAdmin && (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#003e7e] text-white font-bold px-10 py-2 rounded-full active:scale-95 transition-transform duration-150 hover:bg-[#002d5c]"
            >
              Go to Dashboard
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Game;