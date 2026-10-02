import React, { useState } from 'react';
import { Target, Gift, ShieldAlert, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, loadDemoData, lang, setLang } = useApp();
  const [step, setStep] = useState(0);

  if (!isOnboardingOpen) return null;

  const slides = [
    {
      icon: Target,
      iconBg: 'bg-rose-100 text-rose-600',
      title: lang === 'zh' ? '1. 設定日常目標' : '1. Set Your Goals',
      desc:
        lang === 'zh'
          ? '想建立好習慣？每週去 3 次健身、每月讀 15 次書。為每個目標自訂心儀獎勵！'
          : 'Choose habits you want to cultivate (gym 3x/week, read 15x/month). Link each goal to a reward you love.',
      highlight:
        lang === 'zh' ? '每 3 次打卡 = 賺取 1 杯珍珠奶茶 🧋' : 'e.g. Every 3 gym sessions = 1 Bubble tea 🧋',
    },
    {
      icon: Gift,
      iconBg: 'bg-amber-100 text-amber-600',
      title: lang === 'zh' ? '2. 努力賺取享受' : '2. Earn Real Treats',
      desc:
        lang === 'zh'
          ? '打卡即時累積印花，儲夠即自動解鎖獎賞存入專屬獎賞庫，每一口甜美都名正言順！'
          : 'Check-ins automatically earn treats according to your reward rules. Effort feels sweeter when earned!',
      highlight:
        lang === 'zh' ? '自動解鎖獎牌與慶祝卡片 🏆' : 'Earned treats stored in your treat bank 🎁',
    },
    {
      icon: ShieldAlert,
      iconBg: 'bg-emerald-100 text-emerald-700',
      title: lang === 'zh' ? '3. 每月上限，自律有度' : '3. Enjoy Within Limits',
      desc:
        lang === 'zh'
          ? '每個獎賞均設有每月享受上限。就算賺多了，也不能超標放縱。如偶爾超額，我們也會溫和誠實記錄！'
          : 'Every treat has a monthly cap. You can never over-indulge. And if you have an extra treat, we log it honestly with zero guilt.',
      highlight:
        lang === 'zh' ? '極簡純本地儲存，無任何 AI 與 API ✨' : '100% private, runs entirely in your browser 🛡️',
    },
  ];

  const currentSlide = slides[step];
  const Icon = currentSlide.icon;

  const handleFinishFresh = () => {
    localStorage.setItem('eyt_onboarding_seen', 'true');
    setIsOnboardingOpen(false);
  };

  const handleFinishDemo = () => {
    loadDemoData();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#FFFDF9] rounded-3xl p-6 shadow-2xl border border-stone-200 flex flex-col items-center text-center">
        {/* Step indicator dots */}
        <div className="flex items-center gap-1.5 mb-6">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === step ? 'w-6 bg-rose-500' : 'w-1.5 bg-stone-200'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl ${currentSlide.iconBg} flex items-center justify-center mb-4 shadow-xs`}
        >
          <Icon className="w-8 h-8" />
        </div>

        {/* Title & Desc */}
        <h2 className="font-display text-lg font-bold text-stone-900 mb-2">
          {currentSlide.title}
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed max-w-xs mb-4">
          {currentSlide.desc}
        </p>

        {/* Highlight pill */}
        <div className="bg-stone-50 border border-stone-200/80 rounded-xl py-2 px-3 text-xs font-semibold text-stone-700 mb-6">
          {currentSlide.highlight}
        </div>

        {/* Navigation buttons */}
        {step < slides.length - 1 ? (
          <div className="w-full flex items-center gap-2">
            <button
              onClick={() => setStep(step + 1)}
              className="w-full min-h-[44px] py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{lang === 'zh' ? '下一步' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full space-y-2">
            <button
              onClick={handleFinishDemo}
              className="w-full min-h-[44px] py-2.5 bg-rose-500 text-white text-xs font-semibold rounded-xl hover:bg-rose-600 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'zh' ? '載入 2 個月範例探索' : 'Explore with Demo Data'}</span>
            </button>
            <button
              onClick={handleFinishFresh}
              className="w-full min-h-[44px] py-2.5 bg-white text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <span>{lang === 'zh' ? '全新開始 (乾淨空白)' : 'Start Fresh'}</span>
            </button>
          </div>
        )}

        {/* Language switch shortcut */}
        <div className="mt-4 pt-3 border-t border-stone-100 w-full flex items-center justify-center gap-2 text-[11px] text-stone-400">
          <button
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="hover:text-stone-700 font-medium underline"
          >
            {lang === 'en' ? '切換至繁體中文' : 'Switch to English'}
          </button>
        </div>
      </div>
    </div>
  );
};
