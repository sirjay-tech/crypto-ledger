/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';

interface LoginViewProps {
  onSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      let readableError = err.message || 'Authentication failed. Please verify credentials.';
      // Supply user-friendly firebase auth mappings
      if (err.code === 'auth/invalid-credential') {
        readableError = 'Invalid email or password combination.';
      } else if (err.code === 'auth/email-already-in-use') {
        readableError = 'This email address is already registered.';
      } else if (err.code === 'auth/weak-password') {
        readableError = 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        readableError = 'Please enter a valid email address.';
      }
      setErrorMsg(readableError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Dynamic ambient grid overlay backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>

      {/* Cybernetic decorative items */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10" id="login-card-container">
        {/* Sleek outer glass panel card */}
        <div className="bg-[#0b1325]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative">
          
          {/* Neon banner separator top border */}
          <div className="absolute top-0 inset-x-20 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

          {/* Heading */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-2">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
              P2P Journal <span className="text-cyan-400 font-mono text-[11px] align-super tracking-normal border border-cyan-500/30 px-1.5 py-0.5 rounded ml-1 bg-cyan-950/40">CLOUD v2</span>
            </h1>
            <p className="text-[10px] uppercase tracking-wider font-mono text-slate-500">
              {isSignUp ? 'Establish a secure multi-device profile' : 'Authorized Personnel Session Access'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" id="login-view-form">
            {errorMsg && (
              <div 
                className="bg-rose-950/40 border border-rose-500/30 p-3.5 rounded-xl text-rose-300 text-[11px] font-mono leading-relaxed"
                id="login-error-toast"
              >
                <span className="font-bold uppercase tracking-wider mr-1 text-rose-400">Security Fault:</span>
                {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#080d1a] border border-slate-800/80 rounded-xl px-4 py-3 pl-11 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono font-bold"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Password Key</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#080d1a] border border-slate-800/80 rounded-xl px-4 py-3 pl-11 pr-11 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono font-bold"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Glowing CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative mt-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:from-amber-700 text-slate-950 font-bold uppercase tracking-widest text-[11px] py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.30)] transition-all cursor-pointer flex items-center justify-center gap-2"
              id="submit-auth-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create New Account' : 'Log In'}</span>
              )}
            </button>
          </form>

          {/* Toggle View */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
              }}
              className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 cursor-pointer transition-all uppercase tracking-wider"
            >
              {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Create New Account"}
            </button>
          </div>

          {/* Help notice */}
          <div className="mt-6 pt-5 border-t border-slate-950 flex items-center gap-2 justify-center text-slate-600 text-[9px] font-mono">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Encrypted cloud sandbox syncing with SSL protocol.</span>
          </div>

        </div>
      </div>
    </div>
  );
};
