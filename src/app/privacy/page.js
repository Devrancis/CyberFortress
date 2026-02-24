import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Posh Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm tracking-wide uppercase mb-6 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Data Protection
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-500">
            Last Updated: February 23, 2026
          </p>
        </div>

        {/* The Document Body */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-200 overflow-hidden">
          {/* Decorative Top Border */}
          <div className="h-2 w-full bg-blue-600"></div>
          
          <div className="p-8 md:p-12 space-y-10 text-slate-600 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-sm">1</span>
                Data Collection Architecture
              </h2>
              <p>
                CyberShield operates on a zero-trust, privacy-first architecture. When you register via our NextAuth portal, we collect only strictly necessary cryptographic identifiers, including your hashed credentials, professional email, and designated role (Client or Consultant). We do not store plaintext passwords under any circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-sm">2</span>
                Telemetry & Anomaly Detection
              </h2>
              <p>
                To provide real-time threat neutralization, our platform ingests network telemetry from your linked endpoints. This data is strictly sandboxed, anonymized in transit using AES-256 encryption, and is automatically purged from our Prisma-managed databases after 90 days in compliance with international retention standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-sm">3</span>
                Third-Party Integrations
              </h2>
              <p>
                If you authenticate using external providers (such as Google OAuth), we process your public profile data solely for session validation. CyberShield will never sell, lease, or distribute your corporate telemetry or personal data to unauthorized third-party marketing entities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-sm">4</span>
                Your Access Rights
              </h2>
              <p>
                Under modern data protection frameworks, you maintain absolute sovereignty over your digital footprint. You may request a complete export of your SOC activity logs or demand full cryptographic deletion of your account from our Supabase clusters at any time via your Client Dashboard.
              </p>
            </section>

          </div>
          
          {/* Footer Action Area */}
          <div className="bg-slate-50 p-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 mb-6">Ready to secure your network with peace of mind?</p>
            <Link href="/" className="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/20">
              Return to Homepage
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}