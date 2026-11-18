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
  const [profileName, setProfileName] = useState<string | null>(null);

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

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    supabase
      .from('profiles')
      .select('username')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfileName(data?.username ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas">
        <div className="w-16 h-16 bg-surface pixel-box flex items-center justify-center mb-4 p-2">
          <img src="/pixel-assets/daisy_munching.gif" alt="Loading" className="w-full h-full object-contain pixel-art animate-bounce" />
        </div>
        <p className="font-pixel text-xs text-ink">
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

  const username = profileName || session.user.email?.split('@')[0] || 'Traveler';

  return (
    <>
      <div className="retro-bg-pattern" />
      <div className="min-h-screen flex flex-col">
        {/* Top 16-Bit HUD Header */}
        <header className="sticky top-0 z-50 bg-panel/95 backdrop-blur-sm border-b-4 border-line shadow-[0_4px_0_0_var(--shade)]">
          <div className="max-w-6xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
            {/* Brand / Logo */}
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-12 h-12 bg-surface pixel-box flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                <img
                  src="/pixel-assets/daisy_munching.gif"
                  alt="Daisy"
                  className="w-full h-full object-contain pixel-art"
                />
              </div>
              <div>
                <h1 className="font-pixel text-xs md:text-sm text-ink">
                  DAISY THE GUARDIAN
                </h1>
                <p className="font-silk text-[9px] uppercase tracking-wider text-accent-ink">
                  LVL 1 EMOTIONAL SANCTUARY
                </p>
              </div>
            </button>

            {/* HUD Status Bar & Controls */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Stats badges */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-cheddar text-cheddar-ink pixel-box font-pixel text-[9px]">
                <span>🧀</span>
                <span>128 CHEDDAR</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-danger-soft text-danger-ink pixel-box font-pixel text-[9px]">
                <span>🔥</span>
                <span>7 DAY STREAK</span>
              </div>

              {/* Navigation toggle */}
              <button 
                onClick={() => setActiveTab(activeTab === 'dashboard' ? 'logs' : 'dashboard')}
                className="px-3 md:px-4 py-2 bg-gold hover:bg-gold-strong text-on-gold pixel-btn font-pixel text-[9px] md:text-[10px] flex items-center gap-1.5"
              >
                <span>{activeTab === 'dashboard' ? '📜' : '🏠'}</span>
                <span>{activeTab === 'dashboard' ? 'QUEST ARCHIVE' : 'HOME'}</span>
              </button>

              {/* Sign Out */}
              <button 
                onClick={() => supabase.auth.signOut()}
                className="p-2 bg-surface pixel-btn font-pixel text-[10px] text-ink hover:bg-hover-danger"
                title="Sign Out"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Marquee Ticker */}
        <div className="bg-ink text-canvas py-2 border-b-4 border-line marquee select-none">
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
              <section className="bg-surface pixel-box-lg p-6 md:p-8 relative flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-canvas/70 pixel-box flex-shrink-0 flex items-center justify-center p-2">
                  <img
                    src="/pixel-assets/daisy_munching.gif"
                    alt="Daisy Companion"
                    className="w-full h-full object-contain pixel-art"
                  />
                </div>
                <div className="flex-grow text-center md:text-left space-y-2">
                  <div className="inline-block px-2.5 py-0.5 bg-gold text-on-gold pixel-box font-pixel text-[9px]">
                    GUARDIAN DAISY
                  </div>
                  <p className="font-vt text-2xl md:text-3xl text-ink leading-relaxed">
                    &ldquo;Welcome back, Traveler <span className="font-bold underline text-accent-ink">{username}</span>! Take a deep breath, log your heart&apos;s weather, and earn a sweet cheese treat.&rdquo;
                  </p>
                </div>
                <div className="absolute bottom-3 right-4 font-pixel text-xs text-ink pixel-blink">
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
              <div className="bg-surface pixel-box p-6 text-center">
                <h2 className="font-pixel text-sm md:text-base text-ink mb-2">
                  ★ TRAVELER&apos;S QUEST ARCHIVE ★
                </h2>
                <p className="font-vt text-2xl text-muted">
                  Every reflection logged is a permanent step towards clarity. Browse your complete timeline below.
                </p>
              </div>

              {/* Full Filterable Logs */}
              <Dashboard showFilters={true} />
            </div>
          )}
        </main>

        {/* Retro Pixel Footer */}
        <footer className="mt-16 py-8 border-t-4 border-line bg-panel/80 text-center">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/pixel-assets/daisy_hamster.png" alt="Daisy" className="w-6 h-6 pixel-art" />
              <span className="font-pixel text-[10px] text-ink">
                DAISY THE GUARDIAN
              </span>
            </div>
            <p className="font-silk text-[9px] text-muted">
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
