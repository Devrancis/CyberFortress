"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// --- THE CORE LOGIN FORM ---
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if the URL says ?type=consultant. If not, default to client!
  const isConsultant = searchParams.get("type") === "consultant";

  // Consultants can ONLY login. Clients can toggle between login and register.
  const [isLogin, setIsLogin] = useState(true); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const theme = {
    bgMain: isConsultant ? "bg-slate-950" : "bg-slate-50",
    bgCard: isConsultant ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
    textPrimary: isConsultant ? "text-cyan-400" : "text-slate-900",
    textSecondary: isConsultant ? "text-slate-400" : "text-slate-500",
    inputBg: isConsultant ? "bg-slate-950 border-slate-700 text-slate-200 focus:border-cyan-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600",
    buttonPrimary: isConsultant ? "bg-cyan-700 hover:bg-cyan-600" : "bg-cyan-600 hover:bg-cyan-700",
    googleBtn: isConsultant ? "bg-white text-slate-900 hover:bg-slate-200" : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50",
    divider: isConsultant ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError(""); setMessage("");

    if (isLogin) {
      // LOGIN
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError("Invalid credentials. Access denied.");
        setIsLoading(false);
      } else {
        // Route them to their correct dashboard!
        router.push(isConsultant ? "/consultant" : "/client");
      }
    } else {
      // REGISTRATION (Clients Only)
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Registration failed.");
        
        setMessage("Account secured! You may now authenticate.");
        setIsLogin(true);
        setFormData({ ...formData, password: "" });
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${theme.bgMain}`}>
      <div className={`max-w-md w-full border rounded-2xl p-8 shadow-2xl transition-colors duration-500 ${theme.bgCard}`}>
        
        {/* Dynamic Header */}
        <div className="text-center mb-8">
          <h2 className={`text-2xl font-extrabold ${theme.textPrimary}`}>
            {isConsultant ? "Command Center Access" : (isLogin ? "Client Portal Login" : "Initialize Protection")}
          </h2>
          <p className={`text-sm mt-2 ${theme.textSecondary}`}>
            {isConsultant 
              ? "Authorized SOC personnel only." 
              : (isLogin ? "Secure access to your enterprise dashboard." : "Register to deploy CyberFortress for your SME.")}
          </p>
        </div>

        {/* Alerts */}
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg font-medium">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Only show if registering (which is only possible for clients) */}
          {!isLogin && !isConsultant && (
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${theme.textSecondary}`}>Company Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors ${theme.inputBg}`}
                placeholder="e.g., OfflineConnect" />
            </div>
          )}

          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${theme.textSecondary}`}>Official Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors ${theme.inputBg}`}
              placeholder={isConsultant ? "analyst@cyberfortress.com" : "admin@company.com"} />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${theme.textSecondary}`}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors ${theme.inputBg}`}
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isLoading}
            className={`w-full text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 ${theme.buttonPrimary}`}>
            {isLoading ? "Authenticating..." : (isLogin ? "Authenticate" : "Create Account")}
          </button>
        </form>

        <div className={`my-6 flex items-center before:flex-1 before:border-t after:flex-1 after:border-t ${theme.divider}`}>
          <span className="px-4 text-xs uppercase tracking-wider font-semibold">Or continue with</span>
        </div>

        <button onClick={() => signIn("google", { callbackUrl: isConsultant ? "/consultant" : "/client" })} type="button"
          className={`w-full font-bold py-3 rounded-lg flex items-center justify-center gap-3 transition-all shadow-sm ${theme.googleBtn}`}>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        {/* SECURITY ENFORCEMENT: Only show the "Sign Up" toggle if they are a Client */}
        {!isConsultant && (
          <div className="mt-8 text-center text-sm font-medium">
            <span className={theme.textSecondary}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-600 hover:text-cyan-700 transition-colors">
              {isLogin ? "Start free trial" : "Sign in securely"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// --- THE MAIN PAGE COMPONENT ---
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-cyan-500 font-bold">Loading Security Protocols...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}