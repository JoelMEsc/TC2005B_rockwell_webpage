import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/RockwellLogo.png';
import userIcon from '../assets/UserIcon.jpg';

function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3">

      {/* Logo — más pequeño en móvil */}
      <div className="flex items-center h-9 sm:h-12">
        <Link to="/" className="h-full flex items-center">
          <img
            src={logo}
            alt="Rockwell Logo"
            className="h-full w-auto object-contain"
          />
        </Link>
      </div>

      {/* Icono de usuario — más pequeño en móvil */}
      <div className="flex items-center h-9 sm:h-12">
        <Link to="/login" className="h-full flex items-center">
          <img
            src={userIcon}
            alt="User Icon"
            className="h-full w-auto object-contain rounded-full"
          />
        </Link>
      </div>

    </nav>
  )
}

export default Navbar
