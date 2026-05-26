import React from 'react'
import strategicAdvisory from '../assets/workers-industrial-plant-check-systems.webp';
import networkSecurity from '../assets/automotive-plant-floor-cybersecurity-tablet.webp';
import assetInventory from '../assets/Process-Control-room-and-Industrial-Automation.webp';
import riskManagement from '../assets/Senior-and-junior-engineers-discussing-work-together.webp';
import securityMonitoring from '../assets/plant-floor-engineer-tablet-security-monitoring-response.webp';
import responseRecovery from '../assets/technicians-pipelines-oil-and-gas.webp';

function Services() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-72px)]">

      {/* Banner */}
      <div
        className="w-full py-7 sm:py-8 flex items-center justify-center rounded-b-3xl shadow-md"
        style={{ background: 'linear-gradient(to right, #F58025, #CD163F)' }}
      >
        <h1 className="text-white font-bold text-3xl sm:text-4xl tracking-wide">Services</h1>
      </div>

      {/*
        Móvil (< sm): 1 columna, scroll vertical, altura automática.
        Desktop (sm+): grid 3x2 que llena la pantalla, sin scroll.
      */}
      <div className="flex-1 sm:grid sm:grid-cols-3 sm:grid-rows-2 flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 sm:min-h-0 overflow-y-auto sm:overflow-hidden">

        <a
          href="https://www.rockwellautomation.com/en-us/capabilities/industrial-cybersecurity/products-services/risk-assessment.html"
          target="_blank" rel="noreferrer"
          className="rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform duration-200 hover:scale-95 sm:min-h-0"
        >
          {/* En móvil la imagen tiene altura fija; en desktop se expande */}
          <img src={strategicAdvisory} alt="Strategic Advisory" className="w-full object-cover h-36 sm:h-auto sm:flex-1 sm:min-h-0" />
          <p className="font-bold text-center px-3 py-2 text-gray-800 text-sm shrink-0">Strategic Advisory</p>
        </a>

        <a
          href="https://www.rockwellautomation.com/en-us/capabilities/industrial-cybersecurity/products-services/network-security.html"
          target="_blank" rel="noreferrer"
          className="rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform duration-200 hover:scale-95 sm:min-h-0"
        >
          <img src={networkSecurity} alt="Network Security" className="w-full object-cover h-36 sm:h-auto sm:flex-1 sm:min-h-0" />
          <p className="font-bold text-center px-3 py-2 text-gray-800 text-sm shrink-0">Comprehensive Security for Industrial Networks</p>
        </a>

        <a
          href="https://www.rockwellautomation.com/en-us/capabilities/industrial-cybersecurity/secureot-asset-inventory-and-lifecycle-management.html"
          target="_blank" rel="noreferrer"
          className="rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform duration-200 hover:scale-95 sm:min-h-0"
        >
          <img src={assetInventory} alt="Asset Inventory" className="w-full object-cover h-36 sm:h-auto sm:flex-1 sm:min-h-0" />
          <p className="font-bold text-center px-3 py-2 text-gray-800 text-sm shrink-0">SecureOT Asset Inventory and Lifecycle Management</p>
        </a>

        <a
          href="https://www.rockwellautomation.com/en-us/capabilities/industrial-cybersecurity/secureot-risk-and-vulnerability-management.html"
          target="_blank" rel="noreferrer"
          className="rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform duration-200 hover:scale-95 sm:min-h-0"
        >
          <img src={riskManagement} alt="Risk Management" className="w-full object-cover h-36 sm:h-auto sm:flex-1 sm:min-h-0" />
          <p className="font-bold text-center px-3 py-2 text-gray-800 text-sm shrink-0">SecureOT Risk & Vulnerability Management</p>
        </a>

        <a
          href="https://www.rockwellautomation.com/en-us/capabilities/industrial-cybersecurity/managed-services/security-monitoring-response.html"
          target="_blank" rel="noreferrer"
          className="rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform duration-200 hover:scale-95 sm:min-h-0"
        >
          <img src={securityMonitoring} alt="Security Monitoring" className="w-full object-cover h-36 sm:h-auto sm:flex-1 sm:min-h-0" />
          <p className="font-bold text-center px-3 py-2 text-gray-800 text-sm shrink-0">Security Monitoring and Response</p>
        </a>

        <a
          href="https://www.rockwellautomation.com/en-us/capabilities/industrial-cybersecurity/products-services/response-recovery.html"
          target="_blank" rel="noreferrer"
          className="rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform duration-200 hover:scale-95 sm:min-h-0"
        >
          <img src={responseRecovery} alt="Response and Recovery" className="w-full object-cover h-36 sm:h-auto sm:flex-1 sm:min-h-0" />
          <p className="font-bold text-center px-3 py-2 text-gray-800 text-sm shrink-0">Cyber Incident Response and Recovery</p>
        </a>

      </div>
    </div>
  )
}

export default Services
