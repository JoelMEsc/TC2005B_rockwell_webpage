import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ROLE_LABELS = {
  estudiante: 'Student',
  trabajador_rockwell: 'Rockwell Employee',
  otra_empresa: 'External Partner',
};

function InfoCol({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-[#1a1a1a] break-all">
        {value !== null && value !== undefined && value !== '' ? value : '-'}
      </span>
    </div>
  );
}

function getMyId() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id;
  } catch { return null; }
}

export default function UserCard({ usuario, modo, onToggleAdmin, onToggleActive }) {
  const modoActual = modo || 'perfil';
  const navigate   = useNavigate();

  const [localIsAdmin,  setLocalIsAdmin]  = useState(usuario?.is_admin);
  const [localActive,   setLocalActive]   = useState(usuario?.active);
  const [loadingAdmin,  setLoadingAdmin]  = useState(false);
  const [loadingActive, setLoadingActive] = useState(false);

  if (!usuario) return null;

  const { name, surname, email, country, role, max_score, nickname, registration_date } = usuario;
  const is_admin = localIsAdmin;
  const active   = localActive;

  const isSelf = getMyId() === usuario.user_id;

  const initials = ((name?.[0] ?? '') + (surname?.[0] ?? '')).toUpperCase();
  const formattedDate = registration_date
    ? new Date(registration_date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : null;

  const handleToggleAdmin = async () => {
    setLoadingAdmin(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/${usuario.user_id}/toggle-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLocalIsAdmin(prev => !prev);
      onToggleAdmin?.();
    } catch (err) {
      alert(err?.response?.data?.error ?? 'Error al cambiar admin status');
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleToggleActive = async () => {
    setLoadingActive(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/${usuario.user_id}/toggle-active`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLocalActive(prev => !prev);
      onToggleActive?.();
    } catch (err) {
      alert(err?.response?.data?.error ?? 'Error al cambiar active status');
    } finally {
      setLoadingActive(false);
    }
  };

  /* ── MODO PERFIL ── */
  if (modoActual === 'perfil') {
    return (
      <div className="inline-flex flex-col bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #F58025, #CD163F)' }} />

        <div className="p-6 flex items-center gap-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-md"
            style={{ background: 'linear-gradient(to bottom right, #F58025, #CD163F)' }}
          >
            <span className="text-white font-extrabold text-xl tracking-tight">{initials}</span>
          </div>

          <div className="flex flex-col gap-3">
            <InfoCol label="Full Name" value={name + ' ' + surname} />
            <InfoCol label="Nickname"  value={nickname} />
            <InfoCol label="Email"     value={email} />
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <InfoCol label="Country"   value={country} />
            <InfoCol label="Role"      value={ROLE_LABELS[role] || role} />
            <InfoCol label="Max Score" value={max_score} />
          </div>
        </div>

        {is_admin && (
          <div className="px-6 pb-4">
            <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#003e7e] text-white">
              Admin
            </span>
          </div>
        )}
      </div>
    );
  }

  /* ── MODO DASHBOARD ── */
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #F58025, #CD163F)' }} />

      <div className="p-4 flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow"
          style={{ background: 'linear-gradient(to bottom right, #F58025, #CD163F)' }}
        >
          <span className="text-white font-extrabold text-sm">{initials}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex gap-6">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <InfoCol label="Full Name" value={name + ' ' + surname} />
            <InfoCol label="Nickname"  value={nickname} />
            <InfoCol label="Email"     value={email} />
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <InfoCol label="Country"    value={country} />
            <InfoCol label="Role"       value={ROLE_LABELS[role] || role} />
            <InfoCol label="Max Score"  value={max_score} />
            {formattedDate && <InfoCol label="Registered" value={formattedDate} />}
          </div>
        </div>

        {/* Badges + Botones */}
        <div className="flex flex-col gap-2 shrink-0 items-end">
          {/* Badge Admin */}
          <span className={
            'text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ' +
            (is_admin ? 'bg-[#003e7e] text-white' : 'bg-gray-100 text-gray-400')
          }>
            {is_admin ? 'Admin' : 'User'}
          </span>

          {/* Badge Active */}
          <span className={
            'text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ' +
            (active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')
          }>
            {active ? 'Active' : 'Inactive'}
          </span>

          {/* Botones — solo si no es el propio admin */}
          {!isSelf && (
            <div className="flex flex-col gap-1.5 mt-1">
              <button
                onClick={handleToggleAdmin}
                disabled={loadingAdmin}
                className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-[#003e7e] text-[#003e7e] hover:bg-[#003e7e] hover:text-white active:scale-95 transition-all disabled:opacity-40"
              >
                {loadingAdmin ? '...' : (is_admin ? 'Remove Admin' : 'Make Admin')}
              </button>
              <button
                onClick={handleToggleActive}
                disabled={loadingActive}
                className={
                  'text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border active:scale-95 transition-all disabled:opacity-40 ' +
                  (active
                    ? 'border-gray-400 text-gray-500 hover:bg-gray-100'
                    : 'border-green-600 text-green-700 hover:bg-green-50')
                }
              >
                {loadingActive ? '...' : (active ? 'Deactivate' : 'Activate')}
              </button>
              <button
                onClick={() => navigate(`/performance/${usuario.user_id}`)}
                className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-[#F58025] text-[#F58025] hover:bg-[#F58025] hover:text-white active:scale-95 transition-all"
              >
                Performance
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}