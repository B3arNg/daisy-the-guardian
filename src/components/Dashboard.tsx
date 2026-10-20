"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';

interface EmotionLog {
  id: string;
  created_at: string;
  core_emotion: string;
  secondary_emotion: string;
  tertiary_emotion: string;
  notes: string | null;
}

interface EmotionConfig {
  snackImg: string;
  snackName: string;
  badgeBg: string;
  borderHex: string;
  cardBg: string;
}

const config: Record<string, EmotionConfig> = {
  Joy: { snackImg: '/pixel-assets/bear_toast.png', snackName: 'Cheddar Toast', badgeBg: 'bg-[#FEF08A] text-[#854D0E]', borderHex: '#EAB308', cardBg: 'bg-[#FEF9C3] dark:bg-[#422006]/40' },
  Sadness: { snackImg: '/pixel-assets/iced_coffee.png', snackName: 'Iced Coffee', badgeBg: 'bg-[#BFDBFE] text-[#1E40AF]', borderHex: '#3B82F6', cardBg: 'bg-[#DBEAFE] dark:bg-[#172554]/40' },
  Anger: { snackImg: '/pixel-assets/coffee_cup.png', snackName: 'Hot Espresso', badgeBg: 'bg-[#FECACA] text-[#991B1B]', borderHex: '#EF4444', cardBg: 'bg-[#FEE2E2] dark:bg-[#450A0A]/40' },
  Fear: { snackImg: '/pixel-assets/boba_bottle.png', snackName: 'Boba Potion', badgeBg: 'bg-[#E9D5FF] text-[#6B21A8]', borderHex: '#A855F7', cardBg: 'bg-[#F3E8FF] dark:bg-[#3B0764]/40' },
  Surprise: { snackImg: '/pixel-assets/strawberry_cake.png', snackName: 'Sweet Berry', badgeBg: 'bg-[#FFEDD5] text-[#9A3412]', borderHex: '#F97316', cardBg: 'bg-[#FFEDD5] dark:bg-[#431407]/40' },
  Disgust: { snackImg: '/pixel-assets/bear_popsicle.png', snackName: 'Mint Ice', badgeBg: 'bg-[#BBF7D0] text-[#166534]', borderHex: '#10B981', cardBg: 'bg-[#DCFCE7] dark:bg-[#052E16]/40' },
};

export default function Dashboard({ limit, showFilters = false }: { limit?: number; showFilters?: boolean }) {
  const [logs, setLogs] = useState<EmotionLog[]>([]);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'all'>('all');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(() => supabase.auth.getUser().then(async ({ data: { user } }) => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      return;
    }

    let query = supabase
      .from('emotion_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    } else if (timeframe !== 'all') {
      const date = new Date();
      if (timeframe === 'day') date.setDate(date.getDate() - 1);
      if (timeframe === 'week') date.setDate(date.getDate() - 7);
      if (timeframe === 'month') date.setMonth(date.getMonth() - 1);
      query = query.gte('created_at', date.toISOString());
    }

    const { data } = await query;
    if (data) {
      let filtered = data as EmotionLog[];
      if (selectedEmotion !== 'all') {
        filtered = filtered.filter(l => l.core_emotion === selectedEmotion);
      }
      setLogs(filtered);
    }
    setIsLoading(false);
  }), [limit, timeframe, selectedEmotion]);

  useEffect(() => {
    fetchLogs();
    const channel = supabase.channel('dashboard_emotion_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'emotion_logs' }, () => {
        fetchLogs();
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLogs]);

  return (
    <section className="bg-[#FFFDF0] dark:bg-[#1A120C] pixel-box-lg p-6 md:p-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-[#2B1E16] dark:border-[#FDF6E2] pb-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h3 className="font-pixel text-sm md:text-lg text-[#2B1E16] dark:text-[#FDF6E2]">
              {showFilters ? 'QUEST ARCHIVE (ALL LOGS)' : 'RECENT REFLECTIONS'}
            </h3>
          </div>
          <p className="font-silk text-[10px] text-[#785944] dark:text-[#C5AC97] uppercase mt-1">
            Recorded memories &amp; emotional discoveries
          </p>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            {/* Timeframe selector */}
            <div className="flex bg-[#FDF6E2] dark:bg-[#251A12] pixel-box p-1">
              {(['day', 'week', 'month', 'all'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 font-pixel text-[9px] uppercase transition-all ${
                    timeframe === t 
                      ? 'bg-[#FBBF24] text-[#2B1E16] pixel-box'
                      : 'text-[#785944] dark:text-[#C5AC97] hover:text-[#2B1E16]'
                  }`}
                >
                  {t === 'day' ? 'Today' : t === 'week' ? '7 Days' : t === 'month' ? '30 Days' : 'All'}
                </button>
              ))}
            </div>

            {/* Emotion filter chips */}
            <select
              value={selectedEmotion}
              onChange={e => setSelectedEmotion(e.target.value)}
              className="px-3 py-1.5 bg-[#FDF6E2] dark:bg-[#251A12] pixel-box font-pixel text-[9px] text-[#2B1E16] dark:text-[#FDF6E2] focus:outline-none"
            >
              <option value="all">★ All Moods</option>
              <option value="Joy">🧀 Joy (Toast)</option>
              <option value="Sadness">☕ Sadness (Iced Coffee)</option>
              <option value="Anger">🔥 Anger (Espresso)</option>
              <option value="Fear">🧋 Fear (Potion)</option>
              <option value="Surprise">🍰 Surprise (Berry)</option>
              <option value="Disgust">🍧 Disgust (Mint)</option>
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: limit || 3 }).map((_, i) => (
            <div key={i} className="h-56 bg-[#FDF6E2] dark:bg-[#251A12] pixel-box animate-pulse p-4 flex flex-col justify-between">
              <div className="w-1/2 h-4 bg-black/10 dark:bg-white/10" />
              <div className="w-full h-16 bg-black/10 dark:bg-white/10" />
              <div className="w-1/3 h-4 bg-black/10 dark:bg-white/10" />
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-[#FDF6E2] dark:bg-[#251A12] pixel-box">
            <img src="/pixel-assets/daisy_hamster.png" alt="Empty" className="w-16 h-16 pixel-art mx-auto mb-4 opacity-50" />
            <p className="font-pixel text-xs text-[#2B1E16] dark:text-[#FDF6E2] mb-2">NO QUEST LOGS FOUND</p>
            <p className="font-vt text-2xl text-[#785944] dark:text-[#C5AC97]">Log a new reflection to earn cheddar treats for Daisy!</p>
          </div>
        ) : (
          logs.map((log) => {
            const c = config[log.core_emotion] || config.Joy;
            const logDate = new Date(log.created_at);

            return (
              <div 
                key={log.id}
                className={`pixel-box flex flex-col justify-between ${c.cardBg} p-5 hover:translate-y-[-2px] transition-transform relative group`}
              >
                <div>
                  {/* Top Bar: Icon + Timestamps */}
                  <div className="flex justify-between items-start mb-3 border-b-2 border-[#2B1E16] dark:border-[#FDF6E2] pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/80 dark:bg-black/40 pixel-box flex items-center justify-center p-1">
                        <img src={c.snackImg} alt={log.core_emotion} className="w-8 h-8 object-contain pixel-art drop-shadow-[0_2px_0_rgba(0,0,0,0.15)]" />
                      </div>
                      <div>
                        <h4 className="font-pixel text-xs text-[#2B1E16] dark:text-[#FDF6E2]">
                          {log.core_emotion}
                        </h4>
                        <span className="font-silk text-[8px] uppercase tracking-wider text-[#785944] dark:text-[#C5AC97]">
                          {c.snackName}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-pixel text-[9px] text-[#2B1E16] dark:text-[#FDF6E2]">
                        {logDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="font-silk text-[8px] text-[#785944] dark:text-[#C5AC97]">
                        {logDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Nuance Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-0.5 bg-[#FFFDF0] dark:bg-[#1A120C] pixel-box font-silk text-[8px] font-bold text-[#2B1E16] dark:text-[#FDF6E2]">
                      ▶ {log.secondary_emotion}
                    </span>
                    {log.tertiary_emotion && (
                      <span className="px-2 py-0.5 bg-[#FEF08A] text-[#713F12] pixel-box font-silk text-[8px] font-bold">
                        ★ {log.tertiary_emotion}
                      </span>
                    )}
                  </div>

                  {/* Note Parchment Box */}
                  <div className="p-3 bg-[#FFFDF0] dark:bg-[#150F0B] pixel-box pixel-inset min-h-[70px]">
                    <p className="font-vt text-2xl text-[#2B1E16] dark:text-[#FDF6E2] leading-relaxed">
                      {log.notes ? `"${log.notes}"` : <span className="opacity-40 italic">No notes attached.</span>}
                    </p>
                  </div>
                </div>

                {/* Bottom Reward Tag */}
                <div className="mt-4 pt-2 border-t-2 border-dashed border-[#2B1E16]/30 dark:border-[#FDF6E2]/30 flex items-center justify-between text-[9px] font-silk">
                  <span className="text-[#854D0E] dark:text-[#FBBF24] flex items-center gap-1">
                    <span>🧀</span>
                    <span>Daisy rewarded: +1 Treat</span>
                  </span>
                  <span className="opacity-50">#LOG-{log.id.slice(0, 4)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
