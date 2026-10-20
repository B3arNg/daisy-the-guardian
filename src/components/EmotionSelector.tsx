"use client";

import { useState, useEffect } from 'react';
import { emotionWheel, CoreEmotion } from '../data/emotions';
import { supabase } from '../utils/supabase';
import { User } from '@supabase/supabase-js';

interface EmotionConfig {
  snackImg: string;
  snackName: string;
  subtitle: string;
  badgeBg: string;
  borderHex: string;
  textHex: string;
  bgHex: string;
}

const config: Record<CoreEmotion, EmotionConfig> = {
  Joy: {
    snackImg: '/pixel-assets/bear_toast.png',
    snackName: 'Cheddar Toast',
    subtitle: 'Radiant',
    badgeBg: 'bg-[#FEF08A] text-[#854D0E] dark:bg-[#854D0E] dark:text-[#FEF08A]',
    borderHex: '#EAB308',
    textHex: '#CA8A04',
    bgHex: 'bg-[#FEF9C3] dark:bg-[#422006]/50'
  },
  Sadness: {
    snackImg: '/pixel-assets/iced_coffee.png',
    snackName: 'Iced Coffee',
    subtitle: 'Reflective',
    badgeBg: 'bg-[#BFDBFE] text-[#1E40AF] dark:bg-[#1E40AF] dark:text-[#BFDBFE]',
    borderHex: '#3B82F6',
    textHex: '#2563EB',
    bgHex: 'bg-[#DBEAFE] dark:bg-[#172554]/50'
  },
  Anger: {
    snackImg: '/pixel-assets/coffee_cup.png',
    snackName: 'Hot Espresso',
    subtitle: 'Intense',
    badgeBg: 'bg-[#FECACA] text-[#991B1B] dark:bg-[#991B1B] dark:text-[#FECACA]',
    borderHex: '#EF4444',
    textHex: '#DC2626',
    bgHex: 'bg-[#FEE2E2] dark:bg-[#450A0A]/50'
  },
  Fear: {
    snackImg: '/pixel-assets/boba_bottle.png',
    snackName: 'Boba Potion',
    subtitle: 'Guarded',
    badgeBg: 'bg-[#E9D5FF] text-[#6B21A8] dark:bg-[#6B21A8] dark:text-[#E9D5FF]',
    borderHex: '#A855F7',
    textHex: '#9333EA',
    bgHex: 'bg-[#F3E8FF] dark:bg-[#3B0764]/50'
  },
  Surprise: {
    snackImg: '/pixel-assets/strawberry_cake.png',
    snackName: 'Sweet Berry',
    subtitle: 'Sparkling',
    badgeBg: 'bg-[#FFEDD5] text-[#9A3412] dark:bg-[#9A3412] dark:text-[#FFEDD5]',
    borderHex: '#F97316',
    textHex: '#EA580C',
    bgHex: 'bg-[#FFEDD5] dark:bg-[#431407]/50'
  },
  Disgust: {
    snackImg: '/pixel-assets/bear_popsicle.png',
    snackName: 'Mint Ice',
    subtitle: 'Cleansing',
    badgeBg: 'bg-[#BBF7D0] text-[#166534] dark:bg-[#166534] dark:text-[#BBF7D0]',
    borderHex: '#10B981',
    textHex: '#059669',
    bgHex: 'bg-[#DCFCE7] dark:bg-[#052E16]/50'
  }
};

export default function EmotionSelector() {
  const [core, setCore] = useState<CoreEmotion | null>(null);
  const [secondary, setSecondary] = useState<string | null>(null);
  const [tertiary, setTertiary] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setCore(null);
        setSecondary(null);
        setTertiary(null);
        setNote('');
      }, 1500);
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
    <section className="bg-[#FFFDF0] dark:bg-[#1A120C] pixel-box-lg p-6 md:p-10 relative">
      <div className="flex items-center justify-between border-b-4 border-[#2B1E16] dark:border-[#FDF6E2] pb-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FBBF24] pixel-box flex items-center justify-center text-xs font-pixel">
            ★
          </div>
          <div>
            <h3 className="font-pixel text-sm md:text-lg tracking-tight text-[#2B1E16] dark:text-[#FDF6E2]">
              TREAT CRAFTER (LOG MOOD)
            </h3>
            <p className="font-silk text-[10px] text-[#785944] dark:text-[#C5AC97] uppercase">
              Step-by-step emotional reflection
            </p>
          </div>
        </div>

        {core && (
          <button
            onClick={() => { setCore(null); setSecondary(null); setTertiary(null); }}
            className="px-3 py-1 bg-[#FDF6E2] dark:bg-[#2B1E16] pixel-btn font-pixel text-[10px] hover:bg-[#FDE68A]"
          >
            ↺ RESET
          </button>
        )}
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-[#FEF08A] text-[#713F12] pixel-box flex items-center justify-center gap-3 font-pixel text-xs animate-bounce">
          <img src="/pixel-assets/daisy_munching.gif" alt="Daisy" className="w-8 h-8 pixel-art" />
          <span>+1 CHEESE REWARDED! DAISY IS HAPPY!</span>
        </div>
      )}

      {!core ? (
        <div>
          <p className="font-vt text-2xl md:text-3xl text-center mb-6 text-[#2B1E16] dark:text-[#FDF6E2]">
            &ldquo;Which snack matches your heart today?&rdquo;
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {(Object.keys(emotionWheel) as CoreEmotion[]).map(emotion => {
              const c = config[emotion];
              return (
                <button 
                  key={emotion}
                  onClick={() => setCore(emotion)}
                  className={`pixel-btn ${c.bgHex} p-4 flex flex-col items-center justify-between min-h-[160px] group transition-all`}
                >
                  <div className="w-16 h-16 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <img
                      src={c.snackImg}
                      alt={emotion}
                      className="w-14 h-14 object-contain pixel-art drop-shadow-[0_4px_0_rgba(0,0,0,0.15)]"
                    />
                  </div>
                  <div className="text-center w-full">
                    <span className="font-pixel text-[11px] block text-[#2B1E16] dark:text-[#FDF6E2]">
                      {emotion}
                    </span>
                    <span className="font-silk text-[9px] uppercase tracking-wider opacity-80 block text-[#5C3D2E] dark:text-[#D1B9A6]">
                      {c.snackName}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 p-3 bg-[#FDF6E2] dark:bg-[#251A12] pixel-box text-xs font-pixel">
            <span className="text-[#854D0E] dark:text-[#FBBF24]">PATH:</span>
            <span className={`px-2 py-1 ${activeConfig?.badgeBg} pixel-box`}>{core}</span>
            {secondary && (
              <>
                <span>▶</span>
                <span className="px-2 py-1 bg-[#E2E8F0] dark:bg-[#334155] pixel-box">{secondary}</span>
              </>
            )}
            {tertiary && (
              <>
                <span>▶</span>
                <span className="px-2 py-1 bg-[#FEF08A] text-[#713F12] pixel-box">{tertiary}</span>
              </>
            )}
          </div>

          {!secondary ? (
            <div>
              <h4 className="font-pixel text-xs md:text-sm text-[#2B1E16] dark:text-[#FDF6E2] mb-4">
                STEP 2: CHOOSE SECONDARY NUANCE
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {Object.keys(emotionWheel[core]).map(sec => (
                  <button 
                    key={sec}
                    onClick={() => setSecondary(sec)}
                    className="p-3 bg-[#FFFDF0] dark:bg-[#251A12] pixel-btn font-vt text-2xl text-left hover:bg-[#FEF08A] dark:hover:bg-[#854D0E] transition-colors"
                  >
                    ▶ {sec}
                  </button>
                ))}
              </div>
            </div>
          ) : !tertiary ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-pixel text-xs md:text-sm text-[#2B1E16] dark:text-[#FDF6E2]">
                  STEP 3: SPECIFIC EMOTION
                </h4>
                <button
                  onClick={() => setSecondary(null)}
                  className="font-silk text-[10px] text-[#854D0E] dark:text-[#FBBF24] hover:underline"
                >
                  ◀ Back to {core}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {emotionWheel[core][secondary].map(ter => (
                  <button 
                    key={ter}
                    onClick={() => setTertiary(ter)}
                    className="p-3 bg-[#FFFDF0] dark:bg-[#251A12] pixel-btn font-vt text-2xl text-left hover:bg-[#FEF08A] dark:hover:bg-[#854D0E] transition-colors"
                  >
                    ★ {ter}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-pixel text-xs md:text-sm text-[#2B1E16] dark:text-[#FDF6E2]">
                  STEP 4: TRAVELER&apos;S JOURNAL (OPTIONAL)
                </h4>
                <button
                  onClick={() => setTertiary(null)}
                  className="font-silk text-[10px] text-[#854D0E] dark:text-[#FBBF24] hover:underline"
                >
                  ◀ Back to nuances
                </button>
              </div>

              <div className="p-4 bg-[#FDF6E2] dark:bg-[#251A12] pixel-box mb-4">
                <p className="font-vt text-2xl text-[#2B1E16] dark:text-[#FDF6E2] mb-2">
                  You are reflecting on <span className="font-bold text-[#CA8A04] underline">{tertiary}</span> ({core} / {secondary}).
                </p>
                <textarea
                  className="w-full bg-[#FFFDF0] dark:bg-[#1A120C] pixel-box pixel-inset p-3 font-vt text-2xl text-[#2B1E16] dark:text-[#FDF6E2] focus:outline-none placeholder:text-[#9C8271]"
                  rows={3}
                  placeholder="Record your thoughts or what triggered this feeling..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>

              <button 
                onClick={handleSave}
                disabled={isSubmitting || !user}
                className="w-full py-4 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#2B1E16] font-pixel text-xs md:text-sm pixel-btn flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <img src="/pixel-assets/daisy_hamster.png" alt="Cheese" className="w-6 h-6 pixel-art" />
                <span>{isSubmitting ? 'SAVING TO ARCHIVE...' : 'LOG EMOTION & FEED DAISY (+1 🧀)'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
