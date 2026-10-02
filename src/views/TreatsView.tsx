import React, { useState } from 'react';
import {
  Gift,
  Plus,
  Sparkles,
  Undo2,
  Trash2,
  Edit2,
  AlertCircle,
  Check,
  Heart,
  HelpCircle,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Treat } from '../types';
import { PRESET_TREATS } from '../utils/presets';
import { getCurrentMonthString, getPeriodLabel } from '../utils/dateUtils';

interface TreatsViewProps {
  onOpenCreateTreat: () => void;
  redeemModalTreatId: string | null;
  setRedeemModalTreatId: (id: string | null) => void;
}

export const TreatsView: React.FC<TreatsViewProps> = ({
  onOpenCreateTreat,
  redeemModalTreatId,
  setRedeemModalTreatId,
}) => {
  const {
    treats,
    redemptions,
    lang,
    getTreatStats,
    redeemTreat,
    undoRedemption,
    deleteTreat,
    updateTreat,
  } = useApp();

  const currentMonth = getCurrentMonthString();
  const currentMonthLabel = getPeriodLabel(currentMonth, 'monthly', lang);

  const [editingTreat, setEditingTreat] = useState<Treat | null>(null);
  const [redemptionNote, setRedemptionNote] = useState('');

  // Find active treat for redemption modal
  const activeTreat = treats.find((t) => t.id === redeemModalTreatId);
  const activeTreatStats = activeTreat ? getTreatStats(activeTreat.id) : null;

  // Redemptions for the current month
  const currentMonthRedemptions = redemptions.filter((r) =>
    r.date.startsWith(currentMonth)
  );

  const handleConfirmRedeem = (isExtra: boolean) => {
    if (!activeTreat) return;
    redeemTreat(activeTreat.id, isExtra, redemptionNote.trim() || undefined);
    setRedemptionNote('');
    setRedeemModalTreatId(null);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider block">
            {currentMonthLabel}
          </span>
          <h2 className="font-display text-2xl font-bold text-stone-900 leading-tight">
            {lang === 'zh' ? '獎賞銀行' : 'Treat Bank'}
          </h2>
        </div>

        <button
          onClick={onOpenCreateTreat}
          className="min-h-[44px] px-3.5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'zh' ? '新增獎賞' : 'New Treat'}</span>
        </button>
      </div>

      {/* Monthly Reset & Loyalty Rule Banner */}
      <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-stone-600 leading-relaxed">
          {lang === 'zh'
            ? '每月 1 號重設上限。當月賺取的享受需在當月享用（不會結轉至下月），助你維持平衡節奏，自律無負擔！'
            : 'Caps reset on the 1st of each month. Unredeemed treats do not roll over, encouraging healthy balance without over-indulging.'}
        </p>
      </div>

      {/* Treats Cards List */}
      {treats.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-dashed border-stone-200 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center text-3xl mb-3">
            🧋
          </div>
          <h4 className="font-display text-sm font-bold text-stone-800">
            {lang === 'zh' ? '未有任何獎賞' : 'No treats created yet'}
          </h4>
          <p className="text-xs text-stone-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
            {lang === 'zh'
              ? '設定你想享受的美好事物（如珍珠奶茶、日式拉麵、網購心願），並設每月上限！'
              : 'Add things you love (bubble tea, desserts, dining out) with a healthy monthly limit!'}
          </p>
          <button
            onClick={onOpenCreateTreat}
            className="mt-4 px-4 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'zh' ? '新增第一個獎賞' : 'Add First Treat'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {treats.map((treat) => {
            const stats = getTreatStats(treat.id);
            // Cap progress percentage
            const capPercent = Math.min(100, Math.round((stats.redeemedThisMonth / treat.monthlyCap) * 100));
            const earnedPercent = Math.min(100, Math.round((stats.earnedThisMonth / treat.monthlyCap) * 100));

            return (
              <div
                key={treat.id}
                className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                {/* Top Row: Emoji, Name, Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-center text-3xl shrink-0">
                      {treat.emoji}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-bold text-stone-900 truncate">
                        {treat.name}
                      </h3>
                      <span className="text-[11px] text-stone-500 font-medium">
                        {lang === 'zh'
                          ? `每月上限：${treat.monthlyCap} 次`
                          : `Monthly Cap: ${treat.monthlyCap}`}
                      </span>
                    </div>
                  </div>

                  {/* Edit / Delete actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingTreat(treat)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                      title={lang === 'zh' ? '編輯' : 'Edit'}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTreat(treat.id)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title={lang === 'zh' ? '刪除' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Over-achieving badge if earned > cap */}
                {stats.isOverAchieving && (
                  <div className="mt-3 py-1.5 px-2.5 bg-amber-50 rounded-xl border border-amber-200/70 text-[11px] text-amber-800 font-semibold flex items-center gap-1.5">
                    <span>🎉</span>
                    <span>
                      {lang === 'zh'
                        ? '努力爆燈！本月已超標賺取（已達每月上限）'
                        : "You're over-achieving! Cap reached this month 🎉"}
                    </span>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 bg-stone-50/70 rounded-2xl p-2.5 border border-stone-100 text-center">
                  <div>
                    <span className="text-[10px] text-stone-400 font-semibold block uppercase tracking-wider">
                      {lang === 'zh' ? '本月賺取' : 'Earned'}
                    </span>
                    <span className="font-display text-base font-bold text-stone-800 tabular-nums">
                      {stats.earnedThisMonth}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 font-semibold block uppercase tracking-wider">
                      {lang === 'zh' ? '已享用' : 'Redeemed'}
                    </span>
                    <span className="font-display text-base font-bold text-stone-800 tabular-nums">
                      {stats.redeemedThisMonth}
                      <span className="text-xs font-normal text-stone-400">/{treat.monthlyCap}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 font-semibold block uppercase tracking-wider">
                      {lang === 'zh' ? '可兌換' : 'Available'}
                    </span>
                    <span
                      className={`font-display text-base font-bold tabular-nums ${
                        stats.availableToRedeem > 0 ? 'text-rose-500' : 'text-stone-400'
                      }`}
                    >
                      {stats.availableToRedeem}
                    </span>
                  </div>
                </div>

                {/* Dual Progress Bar: Redeemed vs Cap */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] font-medium text-stone-400">
                    <span>{lang === 'zh' ? '上限配額消耗' : 'Cap Consumed'}</span>
                    <span>
                      {stats.redeemedThisMonth} / {treat.monthlyCap}
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        stats.isCapReached ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${capPercent}%` }}
                    />
                  </div>
                </div>

                {/* Action: Redeem Button */}
                <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-stone-400 font-medium">
                    {stats.availableToRedeem > 0 ? (
                      <span className="text-emerald-600 font-semibold">
                        {lang === 'zh'
                          ? `✨ 有 ${stats.availableToRedeem} 次享受額度可用！`
                          : `✨ ${stats.availableToRedeem} treats ready to enjoy!`}
                      </span>
                    ) : stats.isCapReached ? (
                      <span className="text-amber-700">
                        {lang === 'zh' ? '本月已達上限' : 'Monthly cap reached'}
                      </span>
                    ) : (
                      <span>{lang === 'zh' ? '繼續打卡即可賺取' : 'Check in to earn more'}</span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setRedemptionNote('');
                      setRedeemModalTreatId(treat.id);
                    }}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs ${
                      stats.availableToRedeem > 0
                        ? 'bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98]'
                        : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 active:scale-[0.98]'
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>
                      {stats.availableToRedeem > 0
                        ? lang === 'zh'
                          ? '享受獎賞'
                          : 'Redeem'
                        : lang === 'zh'
                        ? '外加享受'
                        : 'Extra Treat'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Monthly Redemptions History */}
      {currentMonthRedemptions.length > 0 && (
        <div className="pt-2">
          <h3 className="font-display text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            {lang === 'zh' ? '本月享受歷史紀錄' : 'This Month Redemptions'}
          </h3>
          <div className="bg-white rounded-2xl border border-stone-200/80 p-2 divide-y divide-stone-100">
            {currentMonthRedemptions.map((red) => {
              const treat = treats.find((t) => t.id === red.treatId);
              return (
                <div
                  key={red.id}
                  className="py-2.5 px-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{treat?.emoji || '🎁'}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900">
                          {treat?.name}
                        </span>
                        {red.isExtra ? (
                          <span className="text-[10px] text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded-md font-semibold">
                            {lang === 'zh' ? '外加享受' : 'Extra Treat'}
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-md font-semibold">
                            {lang === 'zh' ? '依約兌換' : 'Earned'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        <span>{red.date}</span>
                        {red.note && <span className="ml-1.5 text-stone-600">· {red.note}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Undo Button */}
                  <button
                    onClick={() => undoRedemption(red.id)}
                    className="min-h-[36px] px-2 text-[11px] text-stone-400 hover:text-rose-500 font-medium flex items-center gap-1"
                    title={lang === 'zh' ? '還原此次兌換' : 'Undo this redemption'}
                  >
                    <Undo2 className="w-3 h-3" />
                    <span>{lang === 'zh' ? '取消' : 'Undo'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Redeem Modal: Standard vs Honest Extra Treat */}
      {activeTreat && activeTreatStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#FFFDF9] rounded-3xl p-5 shadow-2xl border border-stone-200 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeTreat.emoji}</span>
                <h3 className="font-display text-base font-bold text-stone-900">
                  {activeTreat.name}
                </h3>
              </div>
              <button
                onClick={() => setRedeemModalTreatId(null)}
                className="text-stone-400 hover:text-stone-700 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {activeTreatStats.availableToRedeem > 0 ? (
                /* Standard Redemption */
                <div>
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-center mb-3">
                    <span className="text-xs font-semibold text-emerald-800 block">
                      {lang === 'zh' ? '名正言順，好好享受！ 🎉' : 'Well Earned! Enjoy Your Treat! 🎉'}
                    </span>
                    <p className="text-[11px] text-emerald-600 mt-1">
                      {lang === 'zh'
                        ? `你本月尚有 ${activeTreatStats.availableToRedeem} 次兌換額度。點擊確認即可記錄！`
                        : `You have ${activeTreatStats.availableToRedeem} available treats left this month.`}
                    </p>
                  </div>

                  {/* Optional Note */}
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                      {lang === 'zh' ? '添加享受心得 / 備忘 (可選)' : 'Note (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={redemptionNote}
                      onChange={(e) => setRedemptionNote(e.target.value)}
                      placeholder={lang === 'zh' ? '例如：微糖微冰，同朋友一齊飲！' : 'e.g. Celebrated with friends!'}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  <button
                    onClick={() => handleConfirmRedeem(false)}
                    className="w-full min-h-[44px] mt-4 py-2.5 bg-rose-500 text-white font-medium text-xs rounded-xl hover:bg-rose-600 active:scale-[0.98] transition-all shadow-sm"
                  >
                    {lang === 'zh' ? '確認享受 (扣減 1 次餘額)' : 'Confirm Redemption (-1 Treat)'}
                  </button>
                </div>
              ) : (
                /* Honest Extra Treat (Over-cap or No Balance) */
                <div>
                  <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-left space-y-1 mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>
                        {lang === 'zh'
                          ? '人生本該有彈性，享受無須內疚 ✨'
                          : 'Life deserves sweet surprises ✨'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {activeTreatStats.isCapReached
                        ? lang === 'zh'
                          ? `你本月已經達到 ${activeTreat.monthlyCap} 次上限，或者目前沒有可扣減餘額。但生活不需過度嚴苛，我們會為你誠實記錄為「外加享受」，絕不阻擋！`
                          : `You've reached your monthly cap of ${activeTreat.monthlyCap}, but perfection isn't the goal! We'll honestly log this as an "extra treat" with no guilt.`
                        : lang === 'zh'
                        ? '你目前尚未儲夠打卡次數來換取此獎賞。不過想犒賞自己？我們一樣幫你如實記錄！'
                        : "You haven't earned a treat balance yet, but you can still log it honestly as an extra treat!"}
                    </p>
                  </div>

                  {/* Optional Note */}
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                      {lang === 'zh' ? '記錄原因 (例如：朋友請客、落雨放縱一下)' : 'Reason (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={redemptionNote}
                      onChange={(e) => setRedemptionNote(e.target.value)}
                      placeholder={lang === 'zh' ? '例如：落雨心情差，想飲杯珍奶治癒下' : 'e.g. Rainy day comfort'}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <button
                    onClick={() => handleConfirmRedeem(true)}
                    className="w-full min-h-[44px] mt-4 py-2.5 bg-amber-600 text-white font-medium text-xs rounded-xl hover:bg-amber-700 active:scale-[0.98] transition-all shadow-sm"
                  >
                    {lang === 'zh' ? '如實記錄「外加享受」' : 'Log as Honest Extra Treat'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Treat Modal */}
      {editingTreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#FFFDF9] rounded-3xl p-5 shadow-2xl border border-stone-200 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display text-base font-bold text-stone-900">
                {lang === 'zh' ? '編輯獎賞' : 'Edit Treat'}
              </h3>
              <button
                onClick={() => setEditingTreat(null)}
                className="text-stone-400 hover:text-stone-700 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  {lang === 'zh' ? '獎賞名稱' : 'Name'}
                </label>
                <input
                  type="text"
                  value={editingTreat.name}
                  onChange={(e) =>
                    setEditingTreat({ ...editingTreat, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  {lang === 'zh' ? '圖標 (Emoji)' : 'Emoji'}
                </label>
                <input
                  type="text"
                  value={editingTreat.emoji}
                  onChange={(e) =>
                    setEditingTreat({ ...editingTreat, emoji: e.target.value })
                  }
                  className="w-16 px-3 py-2 text-xl text-center bg-white rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  {lang === 'zh' ? '每月享受上限 (次)' : 'Monthly Cap'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editingTreat.monthlyCap}
                  onChange={(e) =>
                    setEditingTreat({
                      ...editingTreat,
                      monthlyCap: Math.max(1, parseInt(e.target.value, 10) || 1),
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <button
                onClick={() => {
                  updateTreat(editingTreat.id, {
                    name: editingTreat.name,
                    emoji: editingTreat.emoji,
                    monthlyCap: editingTreat.monthlyCap,
                  });
                  setEditingTreat(null);
                }}
                className="w-full min-h-[44px] mt-2 py-2.5 bg-stone-900 text-white font-semibold text-xs rounded-xl hover:bg-stone-800 transition-colors"
              >
                {lang === 'zh' ? '儲存變更' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
