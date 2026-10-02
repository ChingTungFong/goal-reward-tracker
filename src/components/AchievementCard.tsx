import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, Sparkles, Trophy, Check, Award } from 'lucide-react';
import { Achievement, Language } from '../types';

interface AchievementCardProps {
  achievement: Achievement;
  lang: Language;
  onClose?: () => void;
  showClose?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  lang,
  onClose,
  showClose = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const getGradientAndBorder = () => {
    switch (achievement.type) {
      case 'goal_achieved':
        return 'from-amber-50 via-rose-50 to-orange-50 border-amber-200/80';
      case 'milestone_75':
        return 'from-purple-50 via-pink-50 to-rose-50 border-purple-200/80';
      case 'milestone_50':
        return 'from-sky-50 via-indigo-50 to-teal-50 border-sky-200/80';
      case 'milestone_25':
        return 'from-emerald-50 via-teal-50 to-lime-50 border-emerald-200/80';
      case 'treat_earned':
      default:
        return 'from-rose-50 via-amber-50 to-peach-50 border-rose-200/80';
    }
  };

  const getTypeBadgeLabel = () => {
    switch (achievement.type) {
      case 'goal_achieved':
        return lang === 'zh' ? '🏆 目標圓滿達成' : '🏆 Goal Completed';
      case 'milestone_75':
        return lang === 'zh' ? '⭐ 75% 衝刺里程碑' : '⭐ 75% Milestone';
      case 'milestone_50':
        return lang === 'zh' ? '🌟 50% 半程里程碑' : '🌟 50% Milestone';
      case 'milestone_25':
        return lang === 'zh' ? '🌱 25% 起步里程碑' : '🌱 25% Milestone';
      case 'treat_earned':
      default:
        return lang === 'zh' ? '🎁 獎賞解鎖' : '🎁 Treat Unlocked';
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#FFFDF9',
      });
      const link = document.createElement('a');
      link.download = `earn-your-treat-${achievement.type}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const shareText = `${achievement.title}\n${achievement.message}\n— Earn Your Treat (獎賞日常)`;
    
    // Check if Web Share API with files or text is supported
    if (navigator.share) {
      try {
        if (cardRef.current) {
          setIsExporting(true);
          const dataUrl = await toPng(cardRef.current, {
            cacheBust: true,
            pixelRatio: 2,
          });
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], 'achievement.png', { type: 'image/png' });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: achievement.title,
              text: shareText,
              files: [file],
            });
            setIsExporting(false);
            return;
          }
        }
        await navigator.share({
          title: achievement.title,
          text: shareText,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await handleDownloadImage();
        }
      } finally {
        setIsExporting(false);
      }
    } else {
      // Fallback: copy text and trigger download
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore
      }
      await handleDownloadImage();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      {/* Printable Card Area */}
      <div
        ref={cardRef}
        className={`w-full bg-gradient-to-br ${getGradientAndBorder()} border rounded-3xl p-6 shadow-sm text-stone-800 relative overflow-hidden`}
      >
        {/* Decorative corner sparkles */}
        <div className="absolute top-3 right-3 text-stone-300 pointer-events-none opacity-40">
          <Sparkles className="w-8 h-8 text-amber-400" />
        </div>

        {/* Card Header & Type Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-semibold tracking-wide text-stone-600 bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-stone-200/50">
            {getTypeBadgeLabel()}
          </span>
          <span className="text-[11px] font-medium text-stone-400">
            {achievement.periodLabel}
          </span>
        </div>

        {/* Big Icon / Badge */}
        <div className="flex justify-center my-3">
          <div className="w-20 h-20 rounded-2xl bg-white/90 shadow-sm border border-stone-100 flex items-center justify-center text-4xl transform hover:scale-105 transition-transform">
            {achievement.goalEmoji || achievement.treatEmoji || '🎉'}
          </div>
        </div>

        {/* Title & Cheerful Body */}
        <div className="text-center mt-3 mb-5 px-1">
          <h3 className="font-display text-lg font-bold text-stone-900 leading-snug">
            {achievement.title}
          </h3>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed font-normal">
            {achievement.message}
          </p>
        </div>

        {/* Real Data Highlights */}
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 border border-stone-100/80 grid grid-cols-2 divide-x divide-stone-100 text-center my-3">
          <div className="px-2">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-medium">
              {lang === 'zh' ? '打卡次數' : 'Check-ins'}
            </span>
            <span className="font-display text-base font-bold text-stone-800 tabular-nums">
              {achievement.totalCheckIns}
              {achievement.target ? ` / ${achievement.target}` : ''}
            </span>
          </div>
          <div className="px-2">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-medium">
              {lang === 'zh' ? '累積獎賞' : 'Treats Earned'}
            </span>
            <span className="font-display text-base font-bold text-rose-500 tabular-nums flex items-center justify-center gap-1">
              <span>+{achievement.treatsEarned}</span>
              <span className="text-xs">{achievement.treatEmoji || '🎁'}</span>
            </span>
          </div>
        </div>

        {/* Footer brand stamp */}
        <div className="mt-4 pt-3 border-t border-stone-200/40 flex items-center justify-between text-[10px] text-stone-400">
          <span className="flex items-center gap-1 font-medium text-stone-500">
            <Award className="w-3 h-3 text-amber-500" />
            <span>Earn Your Treat</span>
          </span>
          <span>{new Date(achievement.unlockedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2 mt-4 w-full px-2">
        <button
          onClick={handleDownloadImage}
          disabled={isExporting}
          className="flex-1 min-h-[44px] py-2.5 px-3 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? (lang === 'zh' ? '產生中...' : 'Saving...') : (lang === 'zh' ? '下載圖片 (PNG)' : 'Download PNG')}</span>
        </button>

        <button
          onClick={handleShare}
          disabled={isExporting}
          className="min-h-[44px] py-2.5 px-4 bg-white text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 hover:bg-stone-50 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'zh' ? '已複製！' : 'Copied!'}</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-stone-600" />
              <span>{lang === 'zh' ? '分享' : 'Share'}</span>
            </>
          )}
        </button>

        {showClose && onClose && (
          <button
            onClick={onClose}
            className="min-h-[44px] px-3 text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            {lang === 'zh' ? '關閉' : 'Close'}
          </button>
        )}
      </div>
    </div>
  );
};
