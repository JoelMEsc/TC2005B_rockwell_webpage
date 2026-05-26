import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/api/auth/login',
        { email, password }
      );
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('is_admin', res.data.is_admin);
      window.location.href = '/';
    } catch (err) {
      setEmail('');
      setPassword('');
      if (err?.response?.status === 403) {
        setError('Tu cuenta está desactivada. Contacta a un administrador.');
      } else {
        setError('Credenciales incorrectas. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (setter) => (e) => {
    setError('');
    setter(e.target.value);
  };

  const inputClass = `w-full rounded-lg px-4 py-2 text-black placeholder-gray-400 outline-none focus:ring-2 transition ${
    error
      ? 'bg-red-100 ring-2 ring-red-500'
      : 'bg-gray-100 focus:ring-orange-300'
  }`;

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-72px)]">

      {/* Banner */}
      <div
        className="w-full py-7 sm:py-8 flex items-center justify-center rounded-b-3xl shadow-md"
        style={{ background: 'linear-gradient(to right, #F58025, #CD163F)' }}
      >
        <h1 className="text-white font-bold text-3xl sm:text-4xl tracking-wide">Log In</h1>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-8">
        <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-5">

          {/* En móvil: label arriba, input abajo.
              En desktop: label izquierda, input derecha. */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="font-bold text-gray-800 sm:w-44 sm:text-right shrink-0">
              Email
            </label>
            <input
              type="text"
              placeholder="ex. user@email.com"
              value={email}
              onChange={handleChange(setEmail)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="font-bold text-gray-800 sm:w-44 sm:text-right shrink-0">
              Password
            </label>
            <input
              type="password"
              placeholder="ex. securePassword123"
              value={password}
              onChange={handleChange(setPassword)}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-semibold">
              {error}
            </p>
          )}

          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={handleLogin}
              className="bg-[#003e7e] text-white font-bold px-10 py-2 rounded-full
                         active:scale-95 transition-transform duration-150 w-full sm:w-auto"
            >
              {loading ? 'Loading...' : 'Log In'}
            </button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div
        className="w-full py-5 flex flex-col items-center justify-center gap-1 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
        style={{ background: 'linear-gradient(to right, #CD163F, #F58025)' }}
      >
        <p className="text-white font-bold text-sm">Don't Have an Account?</p>
        <Link to="/sign-up" className="text-white text-sm underline">
          Sign Up Here
        </Link>
      </div>

    </div>
  )
}

export default Login
