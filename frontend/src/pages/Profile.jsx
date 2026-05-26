import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserCard from '../components/UserCard.jsx';

function Profile() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    window.location.href = '/';
  };

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          import.meta.env.VITE_API_URL + '/api/usuarios/perfil',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsuario(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-72px)]">

      {/* Banner */}
      <div
        className="w-full py-7 sm:py-8 flex items-center justify-center rounded-b-3xl shadow-md"
        style={{ background: 'linear-gradient(to right, #F58025, #CD163F)' }}
      >
        <h1 className="text-white font-bold text-3xl sm:text-4xl tracking-wide">Profile</h1>
      </div>

      {/* Contenido — centrado verticalmente en desktop, scroll en móvil */}
      <div className="flex-1 flex flex-col items-center justify-start sm:justify-center px-4 sm:px-6 py-8 gap-4 overflow-y-auto">
        {loading && (
          <p className="text-gray-400 font-semibold animate-pulse">Loading...</p>
        )}
        {error && (
          <p className="text-red-500 font-semibold text-center">
            Could not load profile. Please try again.
          </p>
        )}
        {!loading && !error && (
          <>
            {/* Wrapper que centra la tarjeta en móvil sin estirarla */}
            <div className="w-full flex justify-center">
              <UserCard usuario={usuario} modo="perfil" />
            </div>
            <button
              onClick={() => navigate(`/performance/${usuario.user_id}`)}
              className="bg-[#003e7e] text-white font-bold px-10 py-2 rounded-full active:scale-95 transition-transform duration-150 hover:bg-[#002d5c] w-full sm:w-auto"
            >
              View Performance
            </button>
          </>
        )}
        <button
          onClick={handleLogout}
          className="bg-[#CD163F] text-white font-bold px-10 py-2 rounded-full active:scale-95 transition-transform duration-150 hover:bg-[#b01234] w-full sm:w-auto"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Profile;
