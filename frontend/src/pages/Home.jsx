import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans">

      {/* Hero Banner */}
      <div
        className="w-full py-8 sm:py-10 flex items-center justify-center rounded-b-3xl shadow-xl"
        style={{ background: 'linear-gradient(to right, #F58025, #CD163F)' }}
      >
        <h1 className="text-white font-bold text-3xl sm:text-4xl tracking-widest uppercase">
          Secure Factory
        </h1>
      </div>

      {/* Section 1 — Main CTA */}
      <div className="max-w-5xl mx-auto px-5 sm:px-6 pt-12 sm:pt-24 pb-12 sm:pb-20 flex flex-col md:flex-row items-center gap-8 sm:gap-12">

        <div className="flex-1 space-y-5 sm:space-y-6">
          <div className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-[#F58025] border border-[#F58025] rounded-full px-4 py-1">
            Industrial Cybersecurity
          </div>

          {/* Título más pequeño en móvil */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
            style={{ background: 'linear-gradient(to right, #1a1a1a, #4a4a4a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Secure Your Operations.<br />Protect Your Future.
          </h2>

          {/* Texto más compacto en móvil */}
          <p className="text-[#555e6a] text-base sm:text-lg leading-relaxed max-w-xl">
            As industrial environments undergo digital transformation, the attack surface expands exponentially. Legacy OT systems are increasingly exposed to sophisticated, AI-driven threats — and without OT-specific security, manufacturers face catastrophic downtime, safety risks, and regulatory penalties. Staying ahead demands more than point solutions; it requires an integrated, industrial-first security strategy.
          </p>

          {/* Botones apilados en móvil, en fila en desktop */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 pt-2">
            <a
              href="https://www.rockwellautomation.com/en-us/capabilities/industrial-cybersecurity.html?utm_campaign=&gad_campaignid=23230566616"
              className="text-center bg-[#CD163F] text-white font-bold px-10 py-3 rounded-full active:scale-95 transition-transform duration-150 hover:bg-[#b01234] shadow-lg shadow-[#CD163F33]"
            >
              Visit Main Site
            </a>
            <Link
              to="/services"
              className="text-center bg-transparent text-[#CD163F] font-bold px-10 py-3 rounded-full border border-[#CD163F] active:scale-95 transition-transform duration-150 hover:bg-[#CD163F11] shadow-lg shadow-[#CD163F22]"
            >
              Our Services
            </Link>
          </div>
        </div>

        {/* Gráfico decorativo — oculto en móvil y tablet */}
        <div className="hidden md:flex flex-col items-center justify-center gap-3 opacity-20 select-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3">
              {[...Array(5)].map((_, j) => (
                <div
                  key={j}
                  className="w-2 h-2 rounded-full bg-[#F58025]"
                  style={{ opacity: (i + j) % 3 === 0 ? 1 : 0.3 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <div className="border-t border-[#e5e7eb]" />
      </div>

      {/* Section 2 — Game CTA */}
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-12 sm:py-20 flex flex-col md:flex-row-reverse items-center gap-8 sm:gap-12">

        <div className="flex-1 space-y-5 sm:space-y-6">
          <div className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-[#F58025] border border-[#F58025] rounded-full px-4 py-1">
            Interactive Learning
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
            style={{ background: 'linear-gradient(to right, #1a1a1a, #4a4a4a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Master OT Security<br />Through Hands-On Training.
          </h2>

          <p className="text-[#555e6a] text-base sm:text-lg leading-relaxed max-w-xl">
            Understanding what our specialists do to safeguard your plant and operations can be complex — but it doesn't have to be. We've developed an immersive, purpose-built experience that walks you through real-world industrial security scenarios, so you can see exactly how we protect what matters most.
          </p>

          <div className="pt-2">
            <Link
              to="/game"
              className="inline-block bg-[#CD163F] text-white font-bold px-10 py-3 rounded-full active:scale-95 transition-transform duration-150 hover:bg-[#b01234] shadow-lg shadow-[#CD163F33]"
            >
              Play Now
            </Link>
          </div>
        </div>

        {/* Ícono decorativo — oculto en móvil */}
        <div className="hidden md:flex items-center justify-center w-48 h-48 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] shadow-inner opacity-80 select-none">
          <svg viewBox="0 0 80 80" className="w-20 h-20 text-[#F58025]" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="10" y="28" width="60" height="36" rx="4" />
            <path d="M28 44h4M40 38v12M36 44h4M52 40l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M30 28V20a10 10 0 0120 0v8" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

    </div>
  )
}

export default Home
