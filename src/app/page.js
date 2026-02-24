import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';

export default function Home() {
  const blogPosts = [
    {
      id: 1,
      title: "Zero-Trust Architecture for SMEs",
      category: "Infrastructure",
      excerpt: "Why the 'trust but verify' model is dead, and how continuous authentication prevents devastating lateral movement during a breach.",
      date: "Feb 18, 2026",
    },
    {
      id: 2,
      title: "Defeating Next-Gen Spear Phishing",
      category: "Human Firewall",
      excerpt: "AI is writing perfect phishing emails. Learn the new behavioral indicators your staff must recognize to stop credential harvesting.",
      date: "Feb 12, 2026",
    },
    {
      id: 3,
      title: "Ransomware: The 15-Minute Mitigation Rule",
      category: "Threat Intel",
      excerpt: "When encrypted files appear, every second counts. How our automated triage isolates compromised nodes before the network falls.",
      date: "Feb 05, 2026",
    }
  ];

  return (
    <main className="bg-slate-50 min-h-screen flex flex-col font-sans">
      
      {/* 1. Hero Section (Split Layout with Image) */}
      <section className="bg-slate-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-400 via-slate-900 to-slate-900"></div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 text-center md:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-semibold tracking-wider uppercase">
              Empowering African Enterprises
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Enterprise Security, <br />
              <span className="text-cyan-400">Scaled for Your Business.</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-lg mx-auto md:mx-0 leading-relaxed">
              CyberShield combines instant AI threat triage with elite human consultants to protect your operations, so you can focus on growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {/* Changed href to route to the client-specific login */}
              <Link href="/login?type=client" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg">
                Get Protected Today
              </Link>
              {/* Changed href to route to the consultant-specific login */}
              <Link href="/login?type=consultant" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all">
                Consultant Login
              </Link>
            </div>
          </div>
          
          {/* swapped out the static 500px div for the HeroSlider component right here! */}
          <HeroSlider />

        </div>
      </section>

      {/* 2. Impact Stats Bar */}
      <section className="bg-cyan-600 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-cyan-500/30">
          <div>
            <div className="text-4xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-cyan-100 font-medium uppercase tracking-wider">Active Monitoring</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">&lt;3s</div>
            <div className="text-sm text-cyan-100 font-medium uppercase tracking-wider">AI Triage Speed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">500+</div>
            <div className="text-sm text-cyan-100 font-medium uppercase tracking-wider">SMEs Protected</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">100%</div>
            <div className="text-sm text-cyan-100 font-medium uppercase tracking-wider">Compliance Support</div>
          </div>
        </div>
      </section>

      {/* 3. Core Services Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Managed Security</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">We bridge the gap between expensive in-house IT teams and vulnerable self-managed networks.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Powered Triage</h3>
            <p className="text-slate-600 leading-relaxed">Our proprietary AI acts as your first responder, analyzing anomalies in seconds and instantly isolating infected nodes.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-cyan-50 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Incident Response</h3>
            <p className="text-slate-600 leading-relaxed">When a threat requires a human touch, our certified consultants seamlessly take over via integrated high-priority scheduling.</p>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">NDPR & ISO Compliance</h3>
            <p className="text-slate-600 leading-relaxed">We ensure your business meets all local and international data protection regulations, protecting you from crippling fines.</p>
          </div>
        </div>
      </section>

      {/* 4. Mission Section */}
      <section className="bg-slate-900 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
             <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
              alt="Cybersecurity Team" 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Built for the Modern Workforce</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              We understand that true security isn't just about software; it's about people. Our platform integrates seamlessly with your existing workflow, providing your staff with the tools they need to recognize and report threats instantly.
            </p>
            <ul className="space-y-4 mt-8">
              <li className="flex items-center text-slate-200">
                <svg className="w-6 h-6 text-cyan-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Frictionless integration with existing databases
              </li>
              <li className="flex items-center text-slate-200">
                <svg className="w-6 h-6 text-cyan-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Bank-level encryption for all client communications
              </li>
              <li className="flex items-center text-slate-200">
                <svg className="w-6 h-6 text-cyan-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Dedicated support channels for critical escalations
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Logo Slider (Light Mode) */}
      <section className="w-full py-12 bg-white border-y border-slate-200 overflow-hidden">
        <h2 className="text-center text-slate-500 font-semibold mb-8 tracking-widest uppercase text-sm">
          Trusted by Nigeria's Fastest Growing Companies
        </h2>
        <div className="logo-slider-container">
          <div className="logo-track flex items-center gap-20 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="text-2xl font-bold text-slate-800">FinTech NG</div>
            <div className="text-2xl font-bold text-slate-800">AgroSecure</div>
            <div className="text-2xl font-bold text-slate-800">HealthData+</div>
            <div className="text-2xl font-bold text-slate-800">EduTrust</div>
            <div className="text-2xl font-bold text-slate-800">LogisticsPro</div>
            <div className="text-2xl font-bold text-slate-800">FinTech NG</div>
            <div className="text-2xl font-bold text-slate-800">AgroSecure</div>
            <div className="text-2xl font-bold text-slate-800">HealthData+</div>
            <div className="text-2xl font-bold text-slate-800">EduTrust</div>
            <div className="text-2xl font-bold text-slate-800">LogisticsPro</div>
          </div>
        </div>
      </section>

      {/* 6. Security Insights (Blog) Grid */}
      <section className="w-full max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Security Insights & Advisories</h2>
            <p className="text-slate-600 mt-2">Latest intelligence from our security operations center.</p>
          </div>
          <Link href="/insights" className="text-cyan-600 hover:text-cyan-700 font-bold transition-colors text-left">View All Reports &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link href={`/insights/${post.id}`} key={post.id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl block">
              <span className="text-xs font-bold tracking-widest text-cyan-600 uppercase mb-4 block">
                {post.category}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-cyan-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center text-sm text-slate-500 font-medium pt-6 border-t border-slate-100">
                <span>{post.date}</span>
                <span className="text-cyan-600 group-hover:translate-x-1 transition-transform font-semibold">Read Analysis &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="bg-cyan-600 py-20 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Fortify Your Business?</h2>
        <p className="text-cyan-100 mb-10 max-w-2xl mx-auto text-lg">
          Don't wait for a breach to realize the importance of proactive security. Partner with CyberShield today.
        </p>
        <Link href="/client" className="bg-white text-cyan-800 hover:bg-slate-100 px-10 py-4 rounded-lg font-bold text-lg shadow-xl transition-all inline-block">
          Start Your Free Trial
        </Link>
      </section>
    </main>
  );
}