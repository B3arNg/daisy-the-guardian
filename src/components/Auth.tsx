"use client";

import { useState } from 'react';
import { supabase } from '../utils/supabase';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Check your email for the confirmation scroll!' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: unknown) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'The request could not be completed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="bg-[#FFFDF0] dark:bg-[#1A120C] pixel-box-lg p-8 md:p-10 relative">
          {/* Header & Mascot */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-[#FDF6E2] dark:bg-[#251A12] pixel-box flex items-center justify-center mx-auto mb-4 p-2 shadow-[4px_4px_0px_#2B1E16]">
              <img
                src="/pixel-assets/daisy_munching.gif"
                alt="Daisy the Guardian"
                className="w-full h-full object-contain pixel-art"
              />
            </div>
            <h2 className="font-pixel text-base md:text-lg text-[#2B1E16] dark:text-[#FDF6E2] mb-1">
              DAISY THE GUARDIAN
            </h2>
            <p className="font-silk text-[10px] uppercase tracking-wider text-[#785944] dark:text-[#C5AC97]">
              {mode === 'login' ? '★ Resume Your 16-Bit Journey ★' : '★ Begin A New Quest ★'}
            </p>
          </div>

          {/* Google OAuth Pixel Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 mb-6 flex items-center justify-center gap-3 bg-[#FDF6E2] dark:bg-[#251A12] pixel-btn font-pixel text-[10px] text-[#2B1E16] dark:text-[#FDF6E2] hover:bg-[#FEF08A] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>CONTINUE WITH GOOGLE</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6 text-center border-b-2 border-dashed border-[#2B1E16] dark:border-[#FDF6E2]">
            <span className="bg-[#FFFDF0] dark:bg-[#1A120C] px-3 font-silk text-[9px] uppercase tracking-widest text-[#785944] dark:text-[#C5AC97] relative top-2">
              OR INSERT PASSKEY
            </span>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block font-silk text-[10px] uppercase text-[#785944] dark:text-[#C5AC97] mb-1">
                Traveler Email
              </label>
              <input
                type="email"
                placeholder="traveler@sanctuary.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#FFFDF0] dark:bg-[#150F0B] pixel-box pixel-inset font-vt text-2xl text-[#2B1E16] dark:text-[#FDF6E2] focus:outline-none placeholder:text-[#9C8271]"
              />
            </div>
            <div>
              <label className="block font-silk text-[10px] uppercase text-[#785944] dark:text-[#C5AC97] mb-1">
                Secret Passkey
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#FFFDF0] dark:bg-[#150F0B] pixel-box pixel-inset font-vt text-2xl text-[#2B1E16] dark:text-[#FDF6E2] focus:outline-none placeholder:text-[#9C8271]"
              />
            </div>

            {message && (
              <div className={`p-3 pixel-box text-xs font-vt text-2xl ${message.type === 'error' ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-[#DCFCE7] text-[#166534]'}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#2B1E16] font-pixel text-xs pixel-btn mt-2 transition-all disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : mode === 'login' ? 'ENTER SANCTUARY ▶' : 'JOIN SANCTUARY ★'}
            </button>
          </form>

          <div className="mt-6 text-center border-t-2 border-dashed border-[#2B1E16]/30 dark:border-[#FDF6E2]/30 pt-4">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-silk text-[10px] text-[#785944] dark:text-[#C5AC97] hover:text-[#2B1E16] dark:hover:text-[#FDF6E2] transition-colors"
            >
              {mode === 'login' ? "New adventurer? Create account" : "Have a key? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
