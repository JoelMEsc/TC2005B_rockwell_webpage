import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/RockwellLogo.png'

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const drawerRef = useRef(null)

  const token   = localStorage.getItem('token')
  const isAdmin = localStorage.getItem('is_admin') === 'true'

  // Cierra el drawer al cambiar de ruta
  useEffect(() => {
    setMenuAbierto(false)
  }, [location.pathname])

  // Cierra el drawer al hacer click fuera
  useEffect(() => {
    if (!menuAbierto) return
    const handleClickFuera = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [menuAbierto])

  // Bloquea el scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuAbierto])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('is_admin')
    setMenuAbierto(false)
    window.location.href = '/'
  }

  // Clase base para links de desktop
  const desktopLink = (path) =>
    `text-sm px-3 py-1.5 rounded-lg transition-colors duration-150 ${
      location.pathname === path
        ? 'text-[#CD163F] font-semibold bg-red-50'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
    }`

  // Clase base para links del drawer
  const drawerLink = (path) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
      location.pathname === path
        ? 'text-[#CD163F] bg-red-50 font-semibold'
        : 'text-gray-700 hover:bg-gray-50'
    }`

  return (
    <>
      <nav className="w-full bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 relative z-50">

        {/* Logo */}
        <div className="flex items-center h-9 sm:h-12">
          <Link to="/" className="h-full flex items-center">
            <img
              src={logo}
              alt="Rockwell Automation"
              className="h-full w-auto object-contain"
            />
          </Link>
        </div>

        {/* Links desktop — ocultos en móvil */}
        <div className="hidden md:flex items-center gap-1">

          {/* Rockwell.com — siempre visible */}
          <a
            href="https://www.rockwellautomation.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-150 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Rockwell.com
          </a>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          <Link to="/"        className={desktopLink('/')}>Home</Link>
          <Link to="/services" className={desktopLink('/services')}>Services</Link>

          {/* Game — solo con sesión */}
          {token && (
            <Link to="/game" className={desktopLink('/game')}>Game</Link>
          )}

          {/* Dashboard — solo admin */}
          {token && isAdmin && (
            <Link
              to="/dashboard"
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                location.pathname === '/dashboard'
                  ? 'text-[#003e7e] font-semibold bg-blue-50'
                  : 'text-[#003e7e] hover:bg-blue-50'
              }`}
            >
              Dashboard
            </Link>
          )}

          <div className="w-px h-4 bg-gray-200 mx-1" />

          {/* Sin sesión */}
          {!token && (
            <Link to="/login" className={desktopLink('/login')}>Login</Link>
          )}

          {/* Con sesión */}
          {token && (
            <>
              <Link to="/profile" className={desktopLink('/profile')}>Profile</Link>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-1.5 rounded-full border border-[#CD163F44] text-[#CD163F] hover:bg-red-50 transition-colors duration-150 ml-1"
              >
                Log out
              </button>
            </>
          )}
        </div>

        {/* Botón hamburguesa — solo en móvil */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuAbierto(v => !v)}
          aria-label="Abrir menú"
        >
          {menuAbierto ? (
            // X cuando está abierto
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburguesa cuando está cerrado
            <>
              <span className="block w-5 h-[1.5px] bg-gray-700 rounded" />
              <span className="block w-5 h-[1.5px] bg-gray-700 rounded" />
              <span className="block w-5 h-[1.5px] bg-gray-700 rounded" />
            </>
          )}
        </button>
      </nav>

      {/* Overlay oscuro detrás del drawer */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* Drawer lateral (móvil) */}
      <div
        ref={drawerRef}
        className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col
          transform transition-transform duration-250 ease-in-out md:hidden
          ${menuAbierto ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header del drawer */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-800">Menu</span>
          <button
            onClick={() => setMenuAbierto(false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Cerrar menú"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links del drawer */}
        <div className="flex-1 overflow-y-auto py-2">

          {/* Rockwell.com */}
          <a
            href="https://www.rockwellautomation.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Rockwell.com
          </a>

          <div className="h-px bg-gray-100 mx-4 my-1" />

          <Link to="/" className={drawerLink('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>

          <Link to="/services" className={drawerLink('/services')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Services
          </Link>

          {/* Game — solo con sesión */}
          {token && (
            <Link to="/game" className={drawerLink('/game')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Game
            </Link>
          )}

          {/* Profile — solo con sesión */}
          {token && (
            <Link to="/profile" className={drawerLink('/profile')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
          )}

          {/* Dashboard — solo admin */}
          {token && isAdmin && (
            <>
              <div className="h-px bg-gray-100 mx-4 my-1" />
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                  location.pathname === '/dashboard'
                    ? 'text-[#003e7e] bg-blue-50 font-semibold'
                    : 'text-[#003e7e] hover:bg-blue-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
                <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#003e7e] border border-[#003e7e22]">
                  Admin
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Footer del drawer */}
        <div className="border-t border-gray-100 py-2">
          {!token ? (
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#CD163F] hover:bg-red-50 transition-colors text-left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar