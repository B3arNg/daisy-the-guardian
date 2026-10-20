"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import EmotionSelector from '../components/EmotionSelector';
import WeeklyChart from '../components/WeeklyChart';
import Dashboard from '../components/Dashboard';
import Auth from '../components/Auth';
import { Session } from '@supabase/supabase-js';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs'>('dashboard');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF0] dark:bg-[#150F0B]">
        <div className="w-16 h-16 bg-[#FDF6E2] dark:bg-[#251A12] pixel-box flex items-center justify-center mb-4 p-2">
          <img src="/pixel-assets/daisy_munching.gif" alt="Loading" className="w-full h-full object-contain pixel-art animate-bounce" />
        </div>
        <p className="font-pixel text-xs text-[#2B1E16] dark:text-[#FDF6E2]">
          LOADING SANCTUARY...
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <div className="retro-bg-pattern" />
        <Auth />
      </>
    );
  }

  const username = session.user.email?.split('@')[0] || 'Traveler';

  return (
    <>
      <div className="retro-bg-pattern" />
      <div className="min-h-screen flex flex-col">
        {/* Top 16-Bit HUD Header */}
        <header className="sticky top-0 z-50 bg-[#FFFDF0]/95 dark:bg-[#1A120C]/95 backdrop-blur-sm border-b-4 border-[#2B1E16] dark:border-[#FDF6E2] shadow-[0_4px_0_0_#2B1E16] dark:shadow-[0_4px_0_0_#FDF6E2]">
          <div className="max-w-6xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
            {/* Brand / Logo */}
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-12 h-12 bg-[#FDF6E2] dark:bg-[#251A12] pixel-box flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                <img
                  src="/pixel-assets/daisy_munching.gif"
                  alt="Daisy"
                  className="w-full h-full object-contain pixel-art"
                />
              </div>
              <div>
                <h1 className="font-pixel text-xs md:text-sm text-[#2B1E16] dark:text-[#FDF6E2]">
                  DAISY THE GUARDIAN
                </h1>
                <p className="font-silk text-[9px] uppercase tracking-wider text-[#854D0E] dark:text-[#FBBF24]">
                  LVL 1 EMOTIONAL SANCTUARY
                </p>
              </div>
            </button>

            {/* HUD Status Bar & Controls */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Stats badges */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#FEF08A] text-[#713F12] pixel-box font-pixel text-[9px]">
                <span>🧀</span>
                <span>128 CHEDDAR</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#FEE2E2] text-[#991B1B] pixel-box font-pixel text-[9px]">
                <span>🔥</span>
                <span>7 DAY STREAK</span>
              </div>

              {/* Navigation toggle */}
              <button 
                onClick={() => setActiveTab(activeTab === 'dashboard' ? 'logs' : 'dashboard')}
                className="px-3 md:px-4 py-2 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#2B1E16] pixel-btn font-pixel text-[9px] md:text-[10px] flex items-center gap-1.5"
              >
                <span>{activeTab === 'dashboard' ? '📜' : '🏠'}</span>
                <span>{activeTab === 'dashboard' ? 'QUEST ARCHIVE' : 'HOME'}</span>
              </button>

              {/* Sign Out */}
              <button 
                onClick={() => supabase.auth.signOut()}
                className="p-2 bg-[#FDF6E2] dark:bg-[#251A12] pixel-btn font-pixel text-[10px] text-[#2B1E16] dark:text-[#FDF6E2] hover:bg-[#FEE2E2] dark:hover:bg-[#450A0A]"
                title="Sign Out"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Marquee Ticker */}
        <div className="bg-[#2B1E16] text-[#FFFDF0] dark:bg-[#FDF6E2] dark:text-[#2B1E16] py-2 border-b-4 border-[#2B1E16] dark:border-[#FDF6E2] marquee select-none">
          <div className="marquee-content font-silk text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase">
            ★ REFLECTION BREEDS CLARITY ★ TRACE YOUR EMOTIONAL JOURNEY ★ DAISY GUARDS YOUR PEACE ★ MINDFULNESS IS GROWTH ★
            ★ REFLECTION BREEDS CLARITY ★ TRACE YOUR EMOTIONAL JOURNEY ★ DAISY GUARDS YOUR PEACE ★ MINDFULNESS IS GROWTH ★
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 flex-grow w-full space-y-12">
          {activeTab === 'dashboard' ? (
            <div className="space-y-12">
              {/* RPG Dialogue Box (Hero Greeting) */}
              <section className="bg-[#FDF6E2] dark:bg-[#251A12] pixel-box-lg p-6 md:p-8 relative flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-white/90 dark:bg-black/40 pixel-box flex-shrink-0 flex items-center justify-center p-2">
                  <img
                    src="/pixel-assets/daisy_munching.gif"
                    alt="Daisy Companion"
                    className="w-full h-full object-contain pixel-art"
                  />
                </div>
                <div className="flex-grow text-center md:text-left space-y-2">
                  <div className="inline-block px-2.5 py-0.5 bg-[#FBBF24] text-[#2B1E16] pixel-box font-pixel text-[9px]">
                    GUARDIAN DAISY
                  </div>
                  <p className="font-vt text-2xl md:text-3xl text-[#2B1E16] dark:text-[#FDF6E2] leading-relaxed">
                    &ldquo;Welcome back, Traveler <span className="font-bold underline text-[#CA8A04] dark:text-[#FBBF24]">{username}</span>! Take a deep breath, log your heart&apos;s weather, and earn a sweet cheese treat.&rdquo;
                  </p>
                </div>
                <div className="absolute bottom-3 right-4 font-pixel text-xs text-[#2B1E16] dark:text-[#FDF6E2] pixel-blink">
                  ▼
                </div>
              </section>

              {/* Treat Crafter (Emotion Wheel) */}
              <EmotionSelector />

              {/* Weekly Emotional Rhythm */}
              <WeeklyChart />

              {/* Recent Reflections */}
              <Dashboard limit={3} />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Archive Header */}
              <div className="bg-[#FDF6E2] dark:bg-[#251A12] pixel-box p-6 text-center">
                <h2 className="font-pixel text-sm md:text-base text-[#2B1E16] dark:text-[#FDF6E2] mb-2">
                  ★ TRAVELER&apos;S QUEST ARCHIVE ★
                </h2>
                <p className="font-vt text-2xl text-[#785944] dark:text-[#C5AC97]">
                  Every reflection logged is a permanent step towards clarity. Browse your complete timeline below.
                </p>
              </div>

              {/* Full Filterable Logs */}
              <Dashboard showFilters={true} />
            </div>
          )}
        </main>

        {/* Retro Pixel Footer */}
        <footer className="mt-16 py-8 border-t-4 border-[#2B1E16] dark:border-[#FDF6E2] bg-[#FDF6E2]/80 dark:bg-[#1A120C]/80 text-center">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/pixel-assets/daisy_hamster.png" alt="Daisy" className="w-6 h-6 pixel-art" />
              <span className="font-pixel text-[10px] text-[#2B1E16] dark:text-[#FDF6E2]">
                DAISY THE GUARDIAN
              </span>
            </div>
            <p className="font-silk text-[9px] text-[#785944] dark:text-[#C5AC97]">
              © 2026 • CRAFTED WITH 16-BIT LOVE &amp; MINDFULNESS
            </p>
            <div className="flex items-center gap-3">
              <img src="/pixel-assets/bear_toast.png" alt="Toast" className="w-5 h-5 pixel-art" />
              <img src="/pixel-assets/iced_coffee.png" alt="Coffee" className="w-5 h-5 pixel-art" />
              <img src="/pixel-assets/strawberry_cake.png" alt="Cake" className="w-5 h-5 pixel-art" />
              <img src="/pixel-assets/boba_bottle.png" alt="Boba" className="w-5 h-5 pixel-art" />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
