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

  useEffect(() => {
    const glow = document.getElementById('cursor-glow');
    const cursor = document.getElementById('custom-cursor');
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!glow || !cursor) return;
      const x = e.clientX;
      const y = e.clientY;
      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
      cursor.style.left = x + 'px';
      cursor.style.top = y + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);

    const updateInteractives = () => {
      const interactives = document.querySelectorAll('button, a');
      const handleMouseEnter = () => {
        if (!cursor || !glow) return;
        cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
        cursor.style.opacity = '0.5';
        glow.style.width = '600px';
        glow.style.height = '600px';
      };
      const handleMouseLeave = () => {
        if (!cursor || !glow) return;
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.opacity = '1';
        glow.style.width = '400px';
        glow.style.height = '400px';
      };

      interactives.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });

      return () => {
        interactives.forEach(el => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    };

    const cleanupInteractives = updateInteractives();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cleanupInteractives();
    };
  }, [activeTab, session, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <div className="pattern-bg"></div>
        <div id="cursor-glow"></div>
        <div id="custom-cursor"></div>
        <Auth />
      </>
    );
  }

  return (
    <>
      <div className="pattern-bg"></div>
      <div id="cursor-glow"></div>
      <div id="custom-cursor"></div>
      <div className="main-content min-h-screen">
        <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 overflow-hidden rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10">
                <img src="/brand-icon.jpg" alt="Daisy" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">Daisy the Guardian</h1>
            </button>
            <nav className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab(activeTab === 'dashboard' ? 'logs' : 'dashboard')}
                className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10"
              >
                {activeTab === 'dashboard' ? 'Emotions Log' : 'Back to Home'}
              </button>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 rounded-full transition-colors group relative"
                title="Sign Out"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </nav>
          </div>
        </header>

        <div className="bg-slate-900 text-white py-3 border-y border-slate-800 marquee">
          <div className="marquee-content uppercase text-xs font-bold tracking-[0.2em]">
            Reflection Breeds Clarity • Trace Your Emotional Journey • Mindfulness is Growth • Daisy the Guardian • 
            Reflection Breeds Clarity • Trace Your Emotional Journey • Mindfulness is Growth • Daisy the Guardian • 
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
          {activeTab === 'dashboard' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                  Today's Intention
                </span>
                <h2 className="text-5xl md:text-7xl font-serif italic mb-4">Dashboard</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                  Welcome back, <span className="text-primary font-bold">{session.user.email?.split('@')[0]}</span>. Take a moment to check in with yourself.
                </p>
              </div>

              <EmotionSelector />
              <WeeklyChart />
              <Dashboard limit={3} />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                  History
                </span>
                <h2 className="text-5xl md:text-7xl font-serif italic mb-4">Your Logs</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                  Every reflection is a step towards understanding. Here is your full emotional journey.
                </p>
              </div>
              <Dashboard showFilters={true} />
            </div>
          )}
        </main>

        <footer className="mt-20 py-12 border-t border-slate-200 dark:border-slate-800 text-center bg-white/30 backdrop-blur-sm">
          <p className="text-slate-400 text-sm">© 2026 Daisy the Guardian. Your companion in clarity.</p>
        </footer>
      </div>
    </>
  );
}
