import React from 'react';
import { Trophy, Settings, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    achievements,
    setIsTrophyShelfOpen,
    setIsSettingsOpen,
  } = useApp();

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'zh' : 'en');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-stone-200/70 px-4 h-14 flex items-center justify-between transition-colors">
      {/* Zone 1: Brand title */}
      <div className="flex items-center gap-2">
        <span className="text-xl select-none" role="img" aria-label="treat logo">
          🍰
        </span>
        <h1 className="font-display text-lg font-bold text-stone-800 tracking-tight">
          {lang === 'zh' ? '獎賞日常' : 'Earn Your Treat'}
        </h1>
      </div>

      {/* Zone 2 & 3: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Language switch */}
        <button
          onClick={toggleLanguage}
          className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 flex items-center justify-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
          title={lang === 'en' ? '切換至繁體中文' : 'Switch to English'}
          aria-label="Toggle language"
        >
          <Globe className="w-3.5 h-3.5 text-stone-500" />
          <span>{lang === 'en' ? '中' : 'EN'}</span>
        </button>

        {/* Trophy shelf */}
        <button
          onClick={() => setIsTrophyShelfOpen(true)}
          className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center text-stone-600 hover:text-amber-600 rounded-xl hover:bg-amber-50/70 transition-colors relative"
          title={lang === 'zh' ? '獎牌櫃' : 'Trophy Shelf'}
          aria-label="Trophy Shelf"
        >
          <Trophy className="w-5 h-5" />
          {achievements.length > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
          title={lang === 'zh' ? '設定' : 'Settings'}
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
