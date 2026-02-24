"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function FooterContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isClientDashboard = pathname?.startsWith('/client');
  const isConsultantDashboard = pathname?.startsWith('/consultant');
  const isInsightsPage = pathname?.startsWith('/insights');
  const isLegalPage = pathname?.startsWith('/terms') || pathname?.startsWith('/privacy');
  const isClientLogin = pathname === '/login' && searchParams?.get('type') !== 'consultant';

  if (isClientDashboard || isConsultantDashboard) {
    return null; 
  }

  const isWhiteTheme = isClientLogin || isInsightsPage || isLegalPage;

  const theme = {
    bg: isWhiteTheme ? "bg-white border-slate-200" : "bg-slate-950 border-slate-800",
    text: isWhiteTheme ? "text-slate-500" : "text-slate-400",
    hover: isWhiteTheme ? "hover:text-cyan-600" : "hover:text-cyan-400",
  };

  return (
    <footer className={`border-t py-8 transition-colors duration-500 mt-auto ${theme.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className={`text-sm font-medium ${theme.text}`}>
          &copy; {new Date().getFullYear()} CyberShield. Empowering African Enterprises.
        </div>
        
        <div className="flex gap-8">
          <Link href="/terms" className={`text-sm font-bold transition-colors ${theme.text} ${theme.hover}`}>
            Terms of Service
          </Link>
          <Link href="/privacy" className={`text-sm font-bold transition-colors ${theme.text} ${theme.hover}`}>
            Privacy Policy
          </Link>
        </div>

      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <Suspense fallback={<footer className="py-8 bg-slate-950 border-t border-slate-800"></footer>}>
      <FooterContent />
    </Suspense>
  );
}