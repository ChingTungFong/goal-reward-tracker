import React from 'react';
import { X, Sparkles, Trophy, Gift, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AchievementCard } from './AchievementCard';

export const CelebrationModal: React.FC = () => {
  const { celebration, dismissCelebration, lang, setIsTrophyShelfOpen } = useApp();

  if (!celebration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-xl border border-stone-100 flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={dismissCelebration}
          className="absolute top-4 right-4 min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {celebration.achievement ? (
          <div className="w-full pt-1">
            <AchievementCard
              achievement={celebration.achievement}
              lang={lang}
              onClose={dismissCelebration}
              showClose={false}
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  dismissCelebration();
                  setIsTrophyShelfOpen(true);
                }}
                className="text-xs font-medium text-stone-500 hover:text-rose-600 transition-colors inline-flex items-center gap-1"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>{lang === 'zh' ? '前往獎牌櫃查看全部' : 'View all in Trophy Shelf'} →</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">{celebration.emoji}</div>
            <h3 className="font-display text-lg font-bold text-stone-900 mb-2">
              {celebration.title}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto mb-6">
              {celebration.message}
            </p>
            <button
              onClick={dismissCelebration}
              className="w-full min-h-[44px] py-2.5 bg-rose-500 text-white font-medium text-xs rounded-xl hover:bg-rose-600 active:scale-[0.98] transition-all shadow-sm"
            >
              {lang === 'zh' ? '太正喇！繼續努力' : 'Yay! Keep Going'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
