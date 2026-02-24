import Link from 'next/link';

export default function InsightsArchive() {
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
    <main className="bg-slate-50 min-h-screen py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-cyan-600 font-bold hover:text-cyan-800 mb-6 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900">Security Insights Archive</h1>
          <p className="text-slate-600 mt-4 text-lg max-w-2xl">Browse our complete database of threat intelligence reports, security advisories, and SME best practices.</p>
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
      </div>
    </main>
  );
}