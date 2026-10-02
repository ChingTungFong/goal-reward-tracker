import React, { useState } from 'react';
import { X, Trophy, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AchievementCard } from './AchievementCard';
import { Achievement } from '../types';

export const TrophyShelfModal: React.FC = () => {
  const { isTrophyShelfOpen, setIsTrophyShelfOpen, achievements, lang } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  if (!isTrophyShelfOpen) return null;

  const filtered = achievements.filter((a) => {
    if (filterType === 'all') return true;
    if (filterType === 'goals') return a.type === 'goal_achieved';
    if (filterType === 'milestones') return a.type.startsWith('milestone');
    if (filterType === 'treats') return a.type === 'treat_earned';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Drawer Drag handle for mobile */}
        <div className="w-10 h-1.5 bg-stone-300 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-stone-900 leading-tight">
                {lang === 'zh' ? '個人獎牌櫃' : 'Trophy Shelf'}
              </h2>
              <span className="text-[11px] text-stone-400">
                {lang === 'zh'
                  ? `累積榮譽：${achievements.length} 枚徽章`
                  : `${achievements.length} achievements unlocked`}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsTrophyShelfOpen(false);
              setSelectedAchievement(null);
            }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar (Segmented control) */}
        <div className="px-4 py-2 border-b border-stone-100 bg-stone-50/50 flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'all', label: lang === 'zh' ? '全部' : 'All' },
            { id: 'goals', label: lang === 'zh' ? '目標達標 🏆' : 'Goals 🏆' },
            { id: 'milestones', label: lang === 'zh' ? '里程碑 🌟' : 'Milestones 🌟' },
            { id: 'treats', label: lang === 'zh' ? '獎賞 🎁' : 'Treats 🎁' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors min-h-[36px] ${
                filterType === tab.id
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60 font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedAchievement ? (
            <div className="animate-in fade-in duration-150">
              <button
                onClick={() => setSelectedAchievement(null)}
                className="mb-3 text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
              >
                ← {lang === 'zh' ? '返回清單' : 'Back to Shelf'}
              </button>
              <AchievementCard
                achievement={selectedAchievement}
                lang={lang}
                showClose={false}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-400 mx-auto flex items-center justify-center text-3xl mb-3">
                🏆
              </div>
              <h3 className="font-display text-sm font-bold text-stone-800">
                {lang === 'zh' ? '獎牌櫃暫時空空如也' : 'Your shelf is awaiting trophies'}
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                {lang === 'zh'
                  ? '只要堅持打卡、完成目標或累積獎賞，這裡就會珍藏你的每一張榮譽卡片！'
                  : 'Check in, hit your targets, and earn treats. Each milestone generates a keepsake card you can download anytime!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedAchievement(item)}
                  className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-2xl shrink-0">
                      {item.goalEmoji || item.treatEmoji || '🎉'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-semibold text-amber-600 block uppercase tracking-wider">
                        {item.periodLabel}
                      </span>
                      <h4 className="font-display text-xs font-bold text-stone-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span>
                      {lang === 'zh' ? `打卡 ${item.totalCheckIns} 次` : `${item.totalCheckIns} check-ins`}
                    </span>
                    <span className="text-rose-500 font-semibold flex items-center gap-0.5">
                      <span>+{item.treatsEarned}</span>
                      <span>{item.treatEmoji || '🎁'}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
