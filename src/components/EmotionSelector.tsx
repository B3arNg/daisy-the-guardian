"use client";

import { useState, useEffect } from 'react';
import { emotionWheel, CoreEmotion } from '../data/emotions';
import { supabase } from '../utils/supabase';
import { User } from '@supabase/supabase-js';

interface EmotionConfig {
  icon: string;
  subtitle: string;
  btnClass: string;
  iconClass: string;
  titleClass: string;
  subClass: string;
}

// Map colors based on the user's new Tailwind design classes
const config: Record<string, EmotionConfig> = {
  Joy: {
    icon: 'sunny', subtitle: 'Radiant',
    btnClass: 'bg-yellow-100 dark:bg-yellow-900/30 hover:border-yellow-400',
    iconClass: 'text-yellow-500', titleClass: 'text-yellow-800 dark:text-yellow-300', subClass: 'text-yellow-600 dark:text-yellow-400'
  },
  Sadness: {
    icon: 'water_drop', subtitle: 'Reflective',
    btnClass: 'bg-blue-100 dark:bg-blue-900/30 hover:border-blue-400',
    iconClass: 'text-blue-500', titleClass: 'text-blue-800 dark:text-blue-300', subClass: 'text-blue-600 dark:text-blue-400'
  },
  Anger: {
    icon: 'local_fire_department', subtitle: 'Intense',
    btnClass: 'bg-red-100 dark:bg-red-900/30 hover:border-red-400',
    iconClass: 'text-red-500', titleClass: 'text-red-800 dark:text-red-300', subClass: 'text-red-600 dark:text-red-400'
  },
  Fear: {
    icon: 'visibility_off', subtitle: 'Guarded',
    btnClass: 'bg-purple-100 dark:bg-purple-900/30 hover:border-purple-400',
    iconClass: 'text-purple-500', titleClass: 'text-purple-800 dark:text-purple-300', subClass: 'text-purple-600 dark:text-purple-400'
  },
  Surprise: {
    icon: 'auto_awesome', subtitle: 'Stunned',
    btnClass: 'bg-orange-100 dark:bg-orange-900/30 hover:border-orange-400',
    iconClass: 'text-orange-500', titleClass: 'text-orange-800 dark:text-orange-300', subClass: 'text-orange-600 dark:text-orange-400'
  },
  Disgust: {
    icon: 'sentiment_dissatisfied', subtitle: 'Averse',
    btnClass: 'bg-emerald-100 dark:bg-emerald-900/30 hover:border-emerald-400',
    iconClass: 'text-emerald-500', titleClass: 'text-emerald-800 dark:text-emerald-300', subClass: 'text-emerald-600 dark:text-emerald-400'
  }
};

export default function EmotionSelector() {
  const [core, setCore] = useState<CoreEmotion | null>(null);
  const [secondary, setSecondary] = useState<string | null>(null);
  const [tertiary, setTertiary] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSave = async () => {
    if (!core || !secondary || !tertiary || !user) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('emotion_logs').insert([{
        user_id: user.id,
        core_emotion: core,
        secondary_emotion: secondary,
        tertiary_emotion: tertiary,
        notes: note
      }]);
      
      if (error) throw error;

      // Reset flow
      setCore(null);
      setSecondary(null);
      setTertiary(null);
      setNote('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error saving emotion log:', error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeConfig = core ? config[core] : null;

  return (
    <section className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white dark:border-slate-800 shadow-2xl shadow-primary/5">
      
      {!core ? (
        <>
          <h3 className="text-3xl md:text-4xl font-semibold mb-10 text-center">How are you feeling?</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(Object.keys(emotionWheel) as CoreEmotion[]).map(emotion => {
              const c = config[emotion];
              return (
                <button 
                  key={emotion}
                  onClick={() => setCore(emotion)}
                  className={`group relative overflow-hidden p-6 rounded-3xl border-2 border-transparent transition-all text-left flex flex-col justify-between h-48 ${c.btnClass}`}
                >
                  <span className={`material-symbols-outlined text-4xl mb-4 group-hover:scale-110 transition-transform ${c.iconClass}`}>
                    {c.icon}
                  </span>
                  <div>
                    <p className={`text-lg font-bold ${c.titleClass}`}>{emotion}</p>
                    <p className={`text-[10px] opacity-80 uppercase tracking-wider font-bold ${c.subClass}`}>{c.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => { setCore(null); setSecondary(null); setTertiary(null); }}
              className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="font-semibold tracking-wide">Back to Core</span>
            </button>
            {activeConfig && (
              <div className={`px-4 py-1 border-2 border-transparent rounded-full text-xs font-bold uppercase tracking-widest ${activeConfig.btnClass} ${activeConfig.subClass}`}>
                {core} Emotion
              </div>
            )}
          </div>

          {!secondary ? (
            <div>
              <h3 className="text-2xl md:text-3xl font-serif italic mb-6 text-slate-800 dark:text-white">Can you be more specific?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(emotionWheel[core]).map(sec => (
                  <button 
                    key={sec}
                    onClick={() => setSecondary(sec)}
                    className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all text-left font-bold text-slate-800 dark:text-slate-200"
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>
          ) : !tertiary ? (
            <div>
              <h3 className="text-2xl md:text-3xl font-serif italic mb-6 text-slate-800 dark:text-white">Digging deeper into {secondary}...</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {emotionWheel[core][secondary].map(ter => (
                  <button 
                    key={ter}
                    onClick={() => setTertiary(ter)}
                    className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all text-left font-bold text-slate-800 dark:text-slate-200"
                  >
                    {ter}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl md:text-3xl font-serif italic mb-6 text-slate-800 dark:text-white">You&apos;re feeling {tertiary}.</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Take a moment to reflect. What triggered this feeling?</p>
              <textarea 
                className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-6 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-800 dark:text-white"
                rows={4}
                placeholder="Optional: write down your thoughts..."
                value={note}
                onChange={e => setNote(e.target.value)}
              />
              <button 
                onClick={handleSave}
                disabled={isSubmitting || !user}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Emotion Log'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
