"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

interface EmotionLog {
  created_at: string;
  core_emotion: string;
  secondary_emotion: string;
}

const EMOTION_SNACKS: Record<string, { img: string; name: string; color: string }> = {
  Joy: { img: '/pixel-assets/bear_toast.png', name: 'Joy', color: '#FBBF24' },
  Sadness: { img: '/pixel-assets/iced_coffee.png', name: 'Sadness', color: '#60A5FA' },
  Anger: { img: '/pixel-assets/coffee_cup.png', name: 'Anger', color: '#F87171' },
  Fear: { img: '/pixel-assets/boba_bottle.png', name: 'Fear', color: '#C084FC' },
  Surprise: { img: '/pixel-assets/strawberry_cake.png', name: 'Surprise', color: '#FB923C' },
  Disgust: { img: '/pixel-assets/bear_popsicle.png', name: 'Disgust', color: '#4ADE80' }
};

interface DayStat {
  dayName: string;
  dateStr: string;
  total: number;
  dominantEmotion: string;
  counts: Record<string, number>;
}

export default function WeeklyChart() {
  const [logs, setLogs] = useState<EmotionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const fetchLogs = () => supabase.auth.getUser().then(async ({ data: { user } }) => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      return;
    }

    const { data } = await supabase
      .from('emotion_logs')
      .select('created_at, core_emotion, secondary_emotion')
      .eq('user_id', user.id);
      
    if (data) setLogs(data as EmotionLog[]);
    setCurrentTime(Date.now());
    setIsLoading(false);
  });

  useEffect(() => {
    fetchLogs();
    const channel = supabase.channel('weekly_emotion_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'emotion_logs' }, () => {
        fetchLogs(); 
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const getWeeklyDays = (): DayStat[] => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result: DayStat[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(currentTime);
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;

      const dayLogs = logs.filter(log => {
        const ld = new Date(log.created_at);
        return ld.toDateString() === d.toDateString();
      });

      const counts: Record<string, number> = { Joy: 0, Sadness: 0, Anger: 0, Fear: 0, Surprise: 0, Disgust: 0 };
      dayLogs.forEach(l => {
        if (counts[l.core_emotion] !== undefined) {
          counts[l.core_emotion]++;
        }
      });

      let dominant = 'Joy';
      let maxCount = 0;
      Object.entries(counts).forEach(([emo, cnt]) => {
        if (cnt > maxCount) {
          maxCount = cnt;
          dominant = emo;
        }
      });

      result.push({
        dayName,
        dateStr,
        total: dayLogs.length,
        dominantEmotion: dayLogs.length > 0 ? dominant : 'Joy',
        counts
      });
    }

    return result;
  };

  const weeklyDays = getWeeklyDays();
  const maxVolume = Math.max(1, ...weeklyDays.map(d => d.total));
  const totalWeeklyReflections = logs.filter(l => {
    const d = new Date(l.created_at);
    const diff = (currentTime - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  return (
    <div className="bg-[#FFFDF0] dark:bg-[#1A120C] pixel-box-lg p-6 md:p-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-[#2B1E16] dark:border-[#FDF6E2] pb-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h4 className="font-pixel text-sm md:text-lg text-[#2B1E16] dark:text-[#FDF6E2]">
              WEEKLY EMOTIONAL RHYTHM
            </h4>
          </div>
          <p className="font-silk text-[10px] text-[#785944] dark:text-[#C5AC97] uppercase mt-1">
            7-day battle volume &amp; dominant snacks
          </p>
        </div>

        <div className="flex items-center gap-3 px-3 py-2 bg-[#FDF6E2] dark:bg-[#251A12] pixel-box font-pixel text-[10px]">
          <span>FEED LEVEL:</span>
          <span className="text-[#CA8A04] dark:text-[#FBBF24] font-bold">
            {totalWeeklyReflections} TREATS THIS WEEK
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center font-vt text-3xl text-[#785944]">
          LOADING 16-BIT DATA CARTRIDGE...
        </div>
      ) : (
        <div>
          {/* Stepped Pixel Bar Graph */}
          <div className="grid grid-cols-7 gap-2 md:gap-4 h-64 items-end pb-4 pt-12 border-b-4 border-[#2B1E16] dark:border-[#FDF6E2] relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 border-b border-dashed border-[#2B1E16] dark:border-[#FDF6E2]">
              <div className="w-full border-b border-dashed border-[#2B1E16] dark:border-[#FDF6E2]" />
              <div className="w-full border-b border-dashed border-[#2B1E16] dark:border-[#FDF6E2]" />
              <div className="w-full border-b border-dashed border-[#2B1E16] dark:border-[#FDF6E2]" />
            </div>

            {weeklyDays.map((d, i) => {
              const heightPercent = d.total === 0 ? 12 : Math.max(20, Math.round((d.total / maxVolume) * 100));
              const emoConfig = EMOTION_SNACKS[d.dominantEmotion] || EMOTION_SNACKS.Joy;

              return (
                <div key={i} className="flex flex-col items-center h-full justify-end group relative">
                  {/* Floating Dominant Snack Marker */}
                  <div className="mb-2 transition-transform group-hover:scale-125 z-10">
                    <img
                      src={emoConfig.img}
                      alt={d.dominantEmotion}
                      className={`w-7 h-7 md:w-9 md:h-9 object-contain pixel-art ${d.total === 0 ? 'opacity-30 grayscale' : 'pixel-float drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]'}`}
                    />
                  </div>

                  {/* Pixel Stepped Bar */}
                  <div
                    className="w-full max-w-[48px] pixel-box transition-all group-hover:brightness-110 flex flex-col justify-between p-1"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: d.total === 0 ? '#E2E8F0' : emoConfig.color
                    }}
                  >
                    <div className="w-full h-1 bg-white/60" />
                    <span className="font-pixel text-[9px] text-[#2B1E16] text-center block">
                      {d.total > 0 ? d.total : '0'}
                    </span>
                  </div>

                  {/* Day Label */}
                  <div className="mt-3 text-center">
                    <p className="font-pixel text-[10px] text-[#2B1E16] dark:text-[#FDF6E2]">{d.dayName}</p>
                    <p className="font-silk text-[8px] text-[#785944] dark:text-[#C5AC97]">{d.dateStr}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Status Banner */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-[#FDF6E2] dark:bg-[#251A12] pixel-box text-xs">
            <div className="flex items-center gap-2">
              <img src="/pixel-assets/daisy_munching.gif" alt="Daisy" className="w-8 h-8 pixel-art" />
              <span className="font-vt text-2xl text-[#2B1E16] dark:text-[#FDF6E2]">
                Daisy says: &ldquo;Keep logging your journey! Consistency unlocks clarity.&rdquo;
              </span>
            </div>
            <div className="flex gap-2">
              {Object.entries(EMOTION_SNACKS).map(([name, conf]) => (
                <div key={name} className="flex items-center gap-1 font-silk text-[9px]">
                  <span className="w-2.5 h-2.5 pixel-box" style={{ backgroundColor: conf.color }} />
                  <span className="hidden sm:inline text-[#2B1E16] dark:text-[#FDF6E2]">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
