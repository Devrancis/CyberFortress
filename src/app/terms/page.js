import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Posh Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-sm tracking-wide uppercase mb-6 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            Legal Agreement
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-500">
            Effective Date: February 23, 2026
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
                Acceptance of Terms
              </h2>
              <p>
                By accessing and utilizing the CyberShield Security Operations Center (SOC) dashboard, threat intelligence feeds, and consultancy services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from utilizing our infrastructure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-sm">2</span>
                Service Level Agreement (SLA)
              </h2>
              <p>
                CyberShield commits to a 99.9% uptime for our AI triage systems. However, critical threat neutralization times may vary based on the complexity of the zero-day exploit or lateral movement within your specific network architecture. We are not liable for data loss resulting from breaches that occurred prior to the deployment of our continuous monitoring agents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-sm">3</span>
                Client Responsibilities
              </h2>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-600">
                <li>Maintain the confidentiality of all API keys and NextAuth session tokens provided by CyberShield.</li>
                <li>Immediately report any suspected compromise of Lead Consultant or standard Client credentials.</li>
                <li>Ensure that all endpoints connected to the CyberShield node have the latest OS patches applied.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-sm">4</span>
                Termination of Service
              </h2>
              <p>
                We reserve the right to immediately suspend or terminate your access to the SOC Command Center if we detect reverse-engineering attempts, unauthorized penetration testing against our servers, or violations of acceptable use policies.
              </p>
            </section>

          </div>
          
          {/* Footer Action Area */}
          <div className="bg-slate-50 p-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 mb-6">Have questions about our terms or compliance standards?</p>
            <Link href="/login?type=client" className="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/20">
              Return to Client Portal
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}