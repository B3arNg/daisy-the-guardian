"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import Skeleton from './Skeleton';

interface EmotionLog {
  id: string;
  created_at: string;
  core_emotion: string;
  secondary_emotion: string;
  tertiary_emotion: string;
  notes: string | null;
}

interface EmotionConfig {
  icon: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

const config: Record<string, EmotionConfig> = {
  Joy: { icon: 'sunny', colorClass: 'text-yellow-500', bgClass: 'bg-yellow-100 dark:bg-yellow-900/30', borderClass: 'border-yellow-200 dark:border-yellow-900/50' },
  Sadness: { icon: 'water_drop', colorClass: 'text-blue-500', bgClass: 'bg-blue-100 dark:bg-blue-900/30', borderClass: 'border-blue-200 dark:border-blue-900/50' },
  Anger: { icon: 'local_fire_department', colorClass: 'text-red-500', bgClass: 'bg-red-100 dark:bg-red-900/30', borderClass: 'border-red-200 dark:border-red-900/50' },
  Fear: { icon: 'visibility_off', colorClass: 'text-purple-500', bgClass: 'bg-purple-100 dark:bg-purple-900/30', borderClass: 'border-purple-200 dark:border-purple-900/50' },
  Surprise: { icon: 'auto_awesome', colorClass: 'text-orange-500', bgClass: 'bg-orange-100 dark:bg-orange-900/30', borderClass: 'border-orange-200 dark:border-orange-900/50' },
  Disgust: { icon: 'sentiment_dissatisfied', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-100 dark:bg-emerald-900/30', borderClass: 'border-emerald-200 dark:border-emerald-900/50' },
};

export default function Dashboard({ limit, showFilters = false }: { limit?: number; showFilters?: boolean }) {
  const [logs, setLogs] = useState<EmotionLog[]>([]);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
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
    if (data) setLogs(data as EmotionLog[]);
    setIsLoading(false);
  }, [limit, timeframe]);

  useEffect(() => {
    fetchLogs();
    const channel = supabase.channel('dashboard_emotion_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'emotion_logs' }, () => {
        fetchLogs();
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLogs]);

  return (
    <section className={`p-8 md:p-12 rounded-[2.5rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white dark:border-slate-800 shadow-2xl shadow-primary/5 hover:border-primary/20 transition-all ${showFilters ? 'min-h-[600px]' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h3 className="text-3xl md:text-4xl font-serif italic text-slate-800 dark:text-white">
            {showFilters ? 'Your Emotions Log' : 'Recent Reflections'}
          </h3>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mt-2">Recorded Reflections</p>
        </div>

        {showFilters && (
          <div className="flex w-full md:w-auto p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
            <div className="flex flex-1 md:flex-none">
              {(['day', 'week', 'month', 'all'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`flex-1 md:flex-none px-3 md:px-6 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    timeframe === t 
                      ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: limit || 6 }).map((_, i) => (
            <div key={i} className="h-[280px] rounded-[2rem] bg-white/30 dark:bg-slate-800/20 border-2 border-dashed border-slate-200 dark:border-slate-700 p-6">
              <div className="flex justify-between mb-6">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <Skeleton className="w-20 h-8 rounded-lg" />
              </div>
              <Skeleton className="w-1/2 h-6 mb-2" />
              <Skeleton className="w-3/4 h-4 mb-6" />
              <Skeleton className="w-full h-20 rounded-2xl" />
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="col-span-full text-center py-24">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">history_toggle_off</span>
            <p className="text-slate-500 dark:text-slate-400 text-lg">No reflections found for this period.</p>
          </div>
        ) : (
          logs.map((log) => {
            const c = config[log.core_emotion] || { icon: 'pets', colorClass: 'text-slate-500', bgClass: 'bg-slate-100 dark:bg-slate-800', borderClass: 'border-slate-200 dark:border-slate-800' };
            
            return (
              <div 
                key={log.id} 
                className={`flex flex-col h-full rounded-[2rem] bg-white/50 dark:bg-slate-800/30 border-2 ${c.borderClass} p-6 hover:scale-[1.02] transition-all group shadow-sm hover:shadow-xl`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${c.bgClass} flex items-center justify-center shadow-inner`}>
                    <span className={`material-symbols-outlined text-2xl ${c.colorClass}`}>{c.icon}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      {new Date(log.created_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className={`text-xl font-bold ${c.colorClass} mb-1`}>{log.core_emotion}</h4>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 opacity-70">
                    {log.secondary_emotion} {log.tertiary_emotion ? `• ${log.tertiary_emotion}` : ''}
                  </p>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 min-h-[80px] border border-slate-100 dark:border-slate-800/50">
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                      {log.notes ? `"${log.notes}"` : "No notes recorded."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
