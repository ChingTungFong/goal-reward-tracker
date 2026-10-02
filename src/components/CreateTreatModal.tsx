import React, { useState } from 'react';
import { X, Gift, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRESET_TREATS } from '../utils/presets';

interface CreateTreatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTreatModal: React.FC<CreateTreatModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang, addTreat } = useApp();

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🧋');
  const [monthlyCap, setMonthlyCap] = useState<number>(4);

  if (!isOpen) return null;

  const quickEmojis = ['🧋', '🥐', '🍜', '🍰', '☕', '🍦', '🛍️', '🎬', '💆', '🎮', '🍷', '🍣', '🍕'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addTreat({
      name: name.trim(),
      emoji: emoji.trim() || '🎁',
      monthlyCap: Math.max(1, monthlyCap),
    });

    setName('');
    setEmoji('🧋');
    setMonthlyCap(4);
    onClose();
  };

  const handleApplyPreset = (p: (typeof PRESET_TREATS)[0]) => {
    setName(p.name[lang]);
    setEmoji(p.emoji);
    setMonthlyCap(p.monthlyCap);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#FFFDF9] rounded-3xl p-5 shadow-2xl border border-stone-200 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-rose-500" />
            <h3 className="font-display text-base font-bold text-stone-900">
              {lang === 'zh' ? '新增獎賞' : 'Add New Treat'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="my-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'zh' ? '熱門範例 (點擊預填)' : 'Popular Ideas'}</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
            {PRESET_TREATS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1.5 bg-white border border-stone-200 hover:border-rose-400 rounded-xl text-xs font-medium text-stone-700 shrink-0 flex items-center gap-1 shadow-2xs hover:bg-rose-50/20"
              >
                <span>{p.emoji}</span>
                <span>{p.name[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Emoji & Quick Selector */}
          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">
              {lang === 'zh' ? '選擇圖標 (Emoji)' : 'Emoji'}
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-16 px-2 py-2 text-2xl text-center bg-white rounded-xl border border-stone-200 shadow-2xs"
              />
              <div className="flex-1 flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
                {quickEmojis.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    className="w-8 h-8 rounded-lg hover:bg-stone-100 text-lg flex items-center justify-center shrink-0"
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">
              {lang === 'zh' ? '獎賞名稱' : 'Treat Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'zh' ? '例如：珍珠奶茶、日式拉麵、買一件衣服' : 'e.g. Bubble Tea, Fancy Coffee'}
              className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Monthly Cap */}
          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">
              {lang === 'zh' ? '每月享受上限 (次)' : 'Monthly Cap (Times)'}
            </label>
            <input
              type="number"
              min="1"
              max="100"
              required
              value={monthlyCap}
              onChange={(e) => setMonthlyCap(parseInt(e.target.value, 10) || 1)}
              className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-400"
            />
            <span className="text-[11px] text-stone-400 mt-1 block">
              {lang === 'zh'
                ? '每月 1 號重設。即使賺取更多，亦受此上限保護，防止放縱過度！'
                : 'Resets on the 1st of each month. Keeps habits and rewards in harmonious balance.'}
            </span>
          </div>

          <button
            type="submit"
            className="w-full min-h-[44px] py-2.5 bg-stone-900 text-white font-semibold text-xs rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all shadow-sm"
          >
            {lang === 'zh' ? '儲存獎賞' : 'Save Treat'}
          </button>
        </form>
      </div>
    </div>
  );
};
