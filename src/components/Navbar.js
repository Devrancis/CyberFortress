"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

function NavbarContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isClientDashboard = pathname?.startsWith('/client');
  const isConsultantDashboard = pathname?.startsWith('/consultant');
  
  const isClientLogin = pathname === '/login' && searchParams?.get('type') !== 'consultant';

  const isInsightsPage = pathname?.startsWith('/insights');
  
  if (isClientDashboard || isConsultantDashboard) {
    return null;
  }

  const isWhiteTheme = isClientDashboard || isClientLogin || isInsightsPage;

  const theme = {
    navBg: isWhiteTheme ? "bg-white/90 border-slate-200" : "bg-slate-950/80 border-cyan-900/50",
    logoText: isWhiteTheme ? "text-slate-900" : "text-white",
    logoAccent: isWhiteTheme ? "text-cyan-600" : "text-cyan-500",
    linkText: isWhiteTheme ? "text-slate-600 hover:text-cyan-600" : "text-slate-300 hover:text-cyan-400",
    divider: isWhiteTheme ? "bg-slate-300" : "bg-slate-700",
    clientBtn: isWhiteTheme ? "text-cyan-700 hover:text-cyan-600" : "text-cyan-400 hover:text-cyan-300",
    consultantBtn: isWhiteTheme 
      ? "text-white bg-slate-900 hover:bg-slate-800 border-slate-800 shadow-slate-900/10" 
      : "text-cyan-400 bg-cyan-950/30 hover:bg-cyan-900/50 border-cyan-700 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
    hamburger: isWhiteTheme ? "text-slate-600 hover:text-slate-900" : "text-slate-300 hover:text-white",
    mobileBg: isWhiteTheme ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800",
    mobileLinkText: isWhiteTheme ? "text-slate-700 hover:bg-slate-50" : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
  };

  return (
    <nav className={`backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-500 ${theme.navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className={`text-2xl font-black tracking-tighter transition-colors ${theme.logoText}`}>
              Cyber<span className={theme.logoAccent}>Shield</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`text-sm font-semibold transition-colors ${theme.linkText}`}>
              Home
            </Link>
            <Link href="/insights" className={`text-sm font-semibold transition-colors ${theme.linkText}`}>
              Advisories
            </Link>
            
            <div className={`h-6 w-px transition-colors ${theme.divider}`}></div>

            <Link href="/login?type=client" className={`text-sm font-bold transition-colors ${theme.clientBtn}`}>
              Client Portal
            </Link>
            
            <Link href="/login?type=consultant" className={`px-5 py-2 text-sm font-bold border rounded-lg transition-all ${theme.consultantBtn}`}>
              Consultant Login
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`focus:outline-none transition-colors ${theme.hamburger}`}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={`md:hidden border-b px-4 pt-2 pb-6 space-y-3 shadow-2xl transition-colors duration-500 ${theme.mobileBg}`}>
          <Link href="/" className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${theme.mobileLinkText}`}>
            Home
          </Link>
          <Link href="/insights" className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${theme.mobileLinkText}`}>
            Advisories
          </Link>
          <Link href="/login?type=client" className={`block px-3 py-2 text-base font-bold rounded-md transition-colors ${theme.clientBtn}`}>
            Client Portal
          </Link>
          <Link href="/login?type=consultant" className={`block px-3 py-2 mt-4 text-center text-base font-bold border rounded-md transition-all ${theme.consultantBtn}`}>
            Consultant Login
          </Link>
        </div>
      )}
    </nav>
  );
}

// Wrap the entire component in Suspense to prevent Next.js build errors from useSearchParams
export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-20 bg-slate-950 border-b border-cyan-900/50 sticky top-0 z-50"></div>}>
      <NavbarContent />
    </Suspense>
  );
}