"use client";

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { supabase } from '../utils/supabase';

interface EmotionLog {
  created_at: string;
  core_emotion: string;
  secondary_emotion: string;
}

const COLORS: Record<string, string> = {
  Joy: '#eab308',
  Sadness: '#3b82f6',
  Anger: '#ef4444',
  Fear: '#a855f7',
  Surprise: '#f97316',
  Disgust: '#10b981',
};

interface TooltipEntry {
  value: number;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomAreaTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl shadow-xl">
        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
        {payload.map((entry, index) => {
          if (entry.value === 0) return null;
          return (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-white text-sm font-medium">{entry.name}: {entry.value}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function WeeklyChart() {
  const [logs, setLogs] = useState<EmotionLog[]>([]);

  const fetchLogs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('emotion_logs')
      .select('created_at, core_emotion, secondary_emotion')
      .eq('user_id', user.id);
      
    if (data) setLogs(data as EmotionLog[]);
  };

  useEffect(() => {
    fetchLogs();
    const channel = supabase.channel('weekly_emotion_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'emotion_logs' }, () => {
        fetchLogs(); 
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts: Record<string, Record<string, string | number>> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      counts[dayName] = { name: dayName, Joy: 0, Sadness: 0, Anger: 0, Fear: 0, Surprise: 0, Disgust: 0 };
    }
    logs.forEach(log => {
      const d = new Date(log.created_at);
      const dayName = days[d.getDay()];
      if (counts[dayName] && counts[dayName][log.core_emotion] !== undefined) {
        (counts[dayName][log.core_emotion] as number) += 1;
      }
    });
    return Object.values(counts);
  };

  const weeklyData = getWeeklyData();

  return (
    <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white dark:border-slate-800 shadow-2xl shadow-primary/5 hover:border-primary/20 transition-all">
      <h4 className="text-2xl font-serif italic mb-2 text-slate-800 dark:text-white">Emotional Volume</h4>
      <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Weekly Progress</p>
      
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData} margin={{ top: 10, right: 0, left: 0, bottom: 20 }}>
            <defs>
              {Object.entries(COLORS).map(([key, color]) => (
                <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} 
              dy={15} 
            />
            <Tooltip content={<CustomAreaTooltip />} cursor={{ stroke: 'rgba(148, 163, 184, 0.2)', strokeWidth: 2, strokeDasharray: '4 4' }} />
            
            <Area type="monotone" dataKey="Joy" stroke={COLORS.Joy} strokeWidth={3} fillOpacity={1} fill="url(#colorJoy)" />
            <Area type="monotone" dataKey="Sadness" stroke={COLORS.Sadness} strokeWidth={3} fillOpacity={1} fill="url(#colorSadness)" />
            <Area type="monotone" dataKey="Anger" stroke={COLORS.Anger} strokeWidth={3} fillOpacity={1} fill="url(#colorAnger)" />
            <Area type="monotone" dataKey="Fear" stroke={COLORS.Fear} strokeWidth={3} fillOpacity={1} fill="url(#colorFear)" />
            <Area type="monotone" dataKey="Surprise" stroke={COLORS.Surprise} strokeWidth={3} fillOpacity={1} fill="url(#colorSurprise)" />
            <Area type="monotone" dataKey="Disgust" stroke={COLORS.Disgust} strokeWidth={3} fillOpacity={1} fill="url(#colorDisgust)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
