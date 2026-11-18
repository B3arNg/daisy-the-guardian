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
  Joy: { snackImg: '/pixel-assets/bear_toast.png', snackName: 'Cheddar Toast', badgeBg: 'bg-joy-badge text-joy-badge-ink', borderHex: '#EAB308', cardBg: 'bg-joy-soft' },
  Sadness: { snackImg: '/pixel-assets/iced_coffee.png', snackName: 'Iced Coffee', badgeBg: 'bg-sadness-badge text-sadness-badge-ink', borderHex: '#3B82F6', cardBg: 'bg-sadness-soft' },
  Anger: { snackImg: '/pixel-assets/coffee_cup.png', snackName: 'Hot Espresso', badgeBg: 'bg-anger-badge text-anger-badge-ink', borderHex: '#EF4444', cardBg: 'bg-anger-soft' },
  Fear: { snackImg: '/pixel-assets/boba_bottle.png', snackName: 'Boba Potion', badgeBg: 'bg-fear-badge text-fear-badge-ink', borderHex: '#A855F7', cardBg: 'bg-fear-soft' },
  Surprise: { snackImg: '/pixel-assets/strawberry_cake.png', snackName: 'Sweet Berry', badgeBg: 'bg-surprise-badge text-surprise-badge-ink', borderHex: '#F97316', cardBg: 'bg-surprise-soft' },
  Disgust: { snackImg: '/pixel-assets/bear_popsicle.png', snackName: 'Mint Ice', badgeBg: 'bg-disgust-badge text-disgust-badge-ink', borderHex: '#10B981', cardBg: 'bg-disgust-soft' },
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
    <section className="bg-canvas pixel-box-lg p-6 md:p-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-line pb-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h3 className="font-pixel text-sm md:text-lg text-ink">
              {showFilters ? 'QUEST ARCHIVE (ALL LOGS)' : 'RECENT REFLECTIONS'}
            </h3>
          </div>
          <p className="font-silk text-[10px] text-muted uppercase mt-1">
            Recorded memories &amp; emotional discoveries
          </p>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            {/* Timeframe selector */}
            <div className="flex bg-surface pixel-box p-1">
              {(['day', 'week', 'month', 'all'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 font-pixel text-[9px] uppercase transition-all ${
                    timeframe === t 
                      ? 'bg-gold text-on-gold pixel-box'
                      : 'text-muted hover:text-ink'
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
              className="px-3 py-1.5 bg-surface pixel-box font-pixel text-[9px] text-ink focus:outline-none"
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
            <div key={i} className="h-56 bg-surface pixel-box animate-pulse p-4 flex flex-col justify-between">
              <div className="w-1/2 h-4 bg-ink/10" />
              <div className="w-full h-16 bg-ink/10" />
              <div className="w-1/3 h-4 bg-ink/10" />
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-surface pixel-box">
            <img src="/pixel-assets/daisy_hamster.png" alt="Empty" className="w-16 h-16 pixel-art mx-auto mb-4 opacity-50" />
            <p className="font-pixel text-xs text-ink mb-2">NO QUEST LOGS FOUND</p>
            <p className="font-vt text-2xl text-muted">Log a new reflection to earn cheddar treats for Daisy!</p>
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
                  <div className="flex justify-between items-start mb-3 border-b-2 border-line pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-canvas/70 pixel-box flex items-center justify-center p-1">
                        <img src={c.snackImg} alt={log.core_emotion} className="w-8 h-8 object-contain pixel-art drop-shadow-[0_2px_0_rgba(0,0,0,0.15)]" />
                      </div>
                      <div>
                        <h4 className="font-pixel text-xs text-ink">
                          {log.core_emotion}
                        </h4>
                        <span className="font-silk text-[8px] uppercase tracking-wider text-muted">
                          {c.snackName}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-pixel text-[9px] text-ink">
                        {logDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="font-silk text-[8px] text-muted">
                        {logDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Nuance Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-0.5 bg-canvas pixel-box font-silk text-[8px] font-bold text-ink">
                      ▶ {log.secondary_emotion}
                    </span>
                    {log.tertiary_emotion && (
                      <span className="px-2 py-0.5 bg-cheddar text-cheddar-ink pixel-box font-silk text-[8px] font-bold">
                        ★ {log.tertiary_emotion}
                      </span>
                    )}
                  </div>

                  {/* Note Parchment Box */}
                  <div className="p-3 bg-canvas pixel-box pixel-inset min-h-[70px]">
                    <p className="font-vt text-2xl text-ink leading-relaxed">
                      {log.notes ? `"${log.notes}"` : <span className="opacity-40 italic">No notes attached.</span>}
                    </p>
                  </div>
                </div>

                {/* Bottom Reward Tag */}
                <div className="mt-4 pt-2 border-t-2 border-dashed border-line/30 flex items-center justify-between text-[9px] font-silk">
                  <span className="text-accent-ink flex items-center gap-1">
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
