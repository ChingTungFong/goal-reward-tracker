import React from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Gift, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, lang, treats, getTreatStats } = useApp();

  // Calculate if there are treats currently available to redeem
  const totalAvailableTreats = treats.reduce((acc, t) => {
    const stats = getTreatStats(t.id);
    return acc + stats.availableToRedeem;
  }, 0);

  const tabs = [
    {
      id: 'today' as const,
      label: lang === 'zh' ? '今日' : 'Today',
      icon: CheckCircle2,
    },
    {
      id: 'calendar' as const,
      label: lang === 'zh' ? '月曆' : 'Calendar',
      icon: CalendarIcon,
    },
    {
      id: 'treats' as const,
      label: lang === 'zh' ? '獎賞' : 'Treats',
      icon: Gift,
      badge: totalAvailableTreats > 0 ? totalAvailableTreats : null,
    },
    {
      id: 'goals' as const,
      label: lang === 'zh' ? '目標' : 'Goals',
      icon: Target,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-stone-200/70 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center relative transition-colors ${
                isActive
                  ? 'text-rose-500 font-semibold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-1">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
