import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Sparkles,
  Archive,
  ArchiveRestore,
  Trash2,
  Edit2,
  Gift,
  Calendar,
  CheckCircle2,
  X,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Goal, DurationType } from '../types';
import { PRESET_GOALS } from '../utils/presets';
import {
  getTodayDateString,
  getPeriodDateRange,
  getPeriodLabel,
} from '../utils/dateUtils';

interface GoalsViewProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  onOpenCreateTreat: () => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  onOpenCreateTreat,
}) => {
  const {
    goals,
    treats,
    checkIns,
    lang,
    addGoal,
    updateGoal,
    archiveGoal,
    unarchiveGoal,
    deleteGoal,
    deleteGoalRewardRule,
    addTreat,
    deleteTreat,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // New Goal Form State
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [durationType, setDurationType] = useState<DurationType>('weekly');
  const [target, setTarget] = useState<number>(3);
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [hasRewardRule, setHasRewardRule] = useState<boolean>(true);
  const [checkInsRequired, setCheckInsRequired] = useState<number>(3);
  const [treatsEarned, setTreatsEarned] = useState<number>(1);
  const [selectedTreatId, setSelectedTreatId] = useState<string>(
    treats[0]?.id || ''
  );

  // Confirmation state for deleting treats
  const [confirmDeleteTreatId, setConfirmDeleteTreatId] = useState<string | null>(null);
  const [editingConfirmDeleteTreatId, setEditingConfirmDeleteTreatId] = useState<string | null>(null);

  const activeGoals = goals.filter((g) => !g.isArchived);
  const archivedGoals = goals.filter((g) => g.isArchived);

  // Keep selectedTreatId synchronized with available treats
  useEffect(() => {
    if (treats.length > 0 && (!selectedTreatId || !treats.some((t) => t.id === selectedTreatId))) {
      setSelectedTreatId(treats[0].id);
    }
  }, [treats, selectedTreatId]);

  const handleDeleteSelectedTreat = (treatIdToDelete: string) => {
    if (!treatIdToDelete) return;
    if (confirmDeleteTreatId === treatIdToDelete) {
      deleteTreat(treatIdToDelete);
      setConfirmDeleteTreatId(null);
      const remaining = treats.filter((t) => t.id !== treatIdToDelete);
      if (remaining.length > 0) {
        setSelectedTreatId(remaining[0].id);
      } else {
        setSelectedTreatId('');
      }
    } else {
      setConfirmDeleteTreatId(treatIdToDelete);
      setTimeout(() => {
        setConfirmDeleteTreatId((curr) => (curr === treatIdToDelete ? null : curr));
      }, 3500);
    }
  };

  const handleDeleteEditingTreat = (treatIdToDelete: string) => {
    if (!treatIdToDelete || !editingGoal?.rewardRule) return;
    if (editingConfirmDeleteTreatId === treatIdToDelete) {
      deleteTreat(treatIdToDelete);
      setEditingConfirmDeleteTreatId(null);
      const remaining = treats.filter((t) => t.id !== treatIdToDelete);
      if (remaining.length > 0) {
        setEditingGoal({
          ...editingGoal,
          rewardRule: {
            ...editingGoal.rewardRule,
            treatId: remaining[0].id,
          },
        });
      } else {
        setEditingGoal({
          ...editingGoal,
          rewardRule: undefined,
        });
      }
    } else {
      setEditingConfirmDeleteTreatId(treatIdToDelete);
      setTimeout(() => {
        setEditingConfirmDeleteTreatId((curr) => (curr === treatIdToDelete ? null : curr));
      }, 3500);
    }
  };

  const resetForm = () => {
    setName('');
    setEmoji('🎯');
    setDurationType('weekly');
    setTarget(3);
    setStartDate(getTodayDateString());
    setHasRewardRule(true);
    setCheckInsRequired(3);
    setTreatsEarned(1);
    setSelectedTreatId(treats[0]?.id || '');
    setConfirmDeleteTreatId(null);
  };

  const handleApplyPreset = (preset: (typeof PRESET_GOALS)[0]) => {
    setName(preset.name[lang]);
    setEmoji(preset.emoji);
    setDurationType(preset.durationType);
    setTarget(preset.target);
    setHasRewardRule(true);
    setCheckInsRequired(preset.rewardRule.checkInsRequired);
    setTreatsEarned(preset.rewardRule.treatsEarned);

    // Check if matching treat exists, otherwise create it
    const existingTreat = treats.find(
      (t) => t.name.toLowerCase() === preset.rewardRule.defaultTreatName[lang].toLowerCase()
    );

    if (existingTreat) {
      setSelectedTreatId(existingTreat.id);
    } else {
      // Auto-create matching treat for seamless quick start
      const newTreatId = addTreat({
        name: preset.rewardRule.defaultTreatName[lang],
        emoji: preset.rewardRule.defaultTreatEmoji,
        monthlyCap: preset.rewardRule.defaultMonthlyCap,
      });
      setSelectedTreatId(newTreatId);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let rewardRule = undefined;
    if (hasRewardRule) {
      let treatId = selectedTreatId;
      if (!treatId && treats.length > 0) {
        treatId = treats[0].id;
      } else if (!treatId) {
        treatId = addTreat({
          name: lang === 'zh' ? '珍珠奶茶' : 'Bubble Tea',
          emoji: '🧋',
          monthlyCap: 4,
        });
      }
      rewardRule = {
        checkInsRequired: Math.max(1, checkInsRequired),
        treatsEarned: Math.max(1, treatsEarned),
        treatId,
      };
    }

    addGoal({
      name: name.trim(),
      emoji: emoji.trim() || '🎯',
      durationType,
      target: Math.max(1, target),
      startDate,
      rewardRule,
      isArchived: false,
    });

    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !editingGoal.name.trim()) return;

    updateGoal(editingGoal.id, {
      name: editingGoal.name,
      emoji: editingGoal.emoji,
      durationType: editingGoal.durationType,
      target: editingGoal.target,
      startDate: editingGoal.startDate,
      rewardRule: editingGoal.rewardRule,
    });
    setEditingGoal(null);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header & New Goal Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900 leading-tight">
            {lang === 'zh' ? '目標管理' : 'Habit Goals'}
          </h2>
          <span className="text-xs text-stone-500">
            {lang === 'zh'
              ? `${activeGoals.length} 個進行中目標`
              : `${activeGoals.length} active goals`}
          </span>
        </div>

        <button
          onClick={() => {
            resetForm();
            if (treats.length > 0) setSelectedTreatId(treats[0].id);
            setIsCreateModalOpen(true);
          }}
          className="min-h-[44px] px-3.5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'zh' ? '新增目標' : 'New Goal'}</span>
        </button>
      </div>

      {/* Tabs: Active vs Archived */}
      <div className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[38px] ${
            activeTab === 'active'
              ? 'bg-white text-stone-900 font-semibold shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          {lang === 'zh' ? `進行中 (${activeGoals.length})` : `Active (${activeGoals.length})`}
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[38px] ${
            activeTab === 'archived'
              ? 'bg-white text-stone-900 font-semibold shadow-xs'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          {lang === 'zh' ? `已封存 (${archivedGoals.length})` : `Archived (${archivedGoals.length})`}
        </button>
      </div>

      {/* Goals List */}
      {(activeTab === 'active' ? activeGoals : archivedGoals).length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-dashed border-stone-200 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center text-3xl mb-3">
            {activeTab === 'active' ? '🎯' : '📦'}
          </div>
          <h4 className="font-display text-sm font-bold text-stone-800">
            {activeTab === 'active'
              ? lang === 'zh'
                ? '目前沒有進行中的目標'
                : 'No active goals'
              : lang === 'zh'
              ? '沒有已封存的目標'
              : 'No archived goals'}
          </h4>
          {activeTab === 'active' && (
            <button
              onClick={() => {
                resetForm();
                setIsCreateModalOpen(true);
              }}
              className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'zh' ? '立即新增目標' : 'Add First Goal'}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {(activeTab === 'active' ? activeGoals : archivedGoals).map((goal) => {
            const linkedTreat = goal.rewardRule ? treats.find((t) => t.id === goal.rewardRule?.treatId) : undefined;
            const today = new Date();
            const { start, end } = getPeriodDateRange(today, goal.durationType);
            const periodCheckIns = checkIns.filter(
              (c) => c.goalId === goal.id && c.date >= start && c.date <= end
            );
            const periodCount = periodCheckIns.length;
            const isTargetReached = periodCount >= goal.target;
            const progressPercent = Math.min(100, Math.round((periodCount / goal.target) * 100));

            return (
              <div
                key={goal.id}
                className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-3xl shrink-0">
                      {goal.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display text-base font-bold text-stone-900 truncate">
                          {goal.name}
                        </h3>
                        {isTargetReached && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-500" />
                            <span>{lang === 'zh' ? '本期達標' : 'Achieved'}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span className="capitalize font-medium">
                          {goal.durationType === 'weekly'
                            ? lang === 'zh'
                              ? '每週目標'
                              : 'Weekly Target'
                            : goal.durationType === 'monthly'
                            ? lang === 'zh'
                              ? '每月目標'
                              : 'Monthly Target'
                            : lang === 'zh'
                            ? '每年目標'
                            : 'Yearly Target'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {goal.target} {lang === 'zh' ? '次' : 'times'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                      title={lang === 'zh' ? '編輯' : 'Edit'}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {goal.isArchived ? (
                      <button
                        onClick={() => unarchiveGoal(goal.id)}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                        title={lang === 'zh' ? '取消封存' : 'Unarchive'}
                      >
                        <ArchiveRestore className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => archiveGoal(goal.id)}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                        title={lang === 'zh' ? '封存' : 'Archive'}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title={lang === 'zh' ? '刪除' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-stone-500">
                    <span>{lang === 'zh' ? '本期打卡進度' : 'Current Progress'}</span>
                    <span className="font-bold text-stone-800 tabular-nums">
                      {periodCount} / {goal.target} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isTargetReached ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Reward Rule Description */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  {goal.rewardRule ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Gift className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">
                          {lang === 'zh'
                            ? `每 ${goal.rewardRule.checkInsRequired} 次打卡 = 1 份 ${linkedTreat?.emoji || '🎁'} ${linkedTreat?.name || '獎賞'}`
                            : `Every ${goal.rewardRule.checkInsRequired} check-ins = 1 ${linkedTreat?.emoji || ''} ${linkedTreat?.name || 'treat'}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => deleteGoalRewardRule(goal.id)}
                          className="text-[11px] text-stone-400 hover:text-rose-500 flex items-center gap-1 hover:bg-rose-50 px-2 py-0.5 rounded-lg transition-colors"
                          title={lang === 'zh' ? '刪除此目標的獎賞規則' : 'Delete reward rule'}
                          aria-label="Delete reward rule"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{lang === 'zh' ? '刪除規則' : 'Delete rule'}</span>
                        </button>
                        <span className="text-[10px] text-stone-400">
                          {lang === 'zh' ? '始於' : 'Since'} {goal.startDate}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] text-stone-400">
                        {lang === 'zh' ? '未綁定獎賞規則（純習慣打卡）' : 'No reward rule (pure habit tracking)'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingGoal(goal)}
                        className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 px-2 py-0.5 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        + {lang === 'zh' ? '新增規則' : 'Add Rule'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal with Quick-Start Presets */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl p-5 shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display text-base font-bold text-stone-900">
                {lang === 'zh' ? '新增生活目標' : 'Create New Goal'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Start Presets */}
            <div className="my-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'zh' ? '點擊一鍵套用範例 (Quick Start)' : 'Quick-Start Presets'}</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {PRESET_GOALS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="p-2.5 bg-white border border-stone-200/90 hover:border-rose-400 hover:bg-rose-50/30 rounded-2xl shrink-0 text-left w-48 shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{p.emoji}</span>
                      <h5 className="font-display text-xs font-bold text-stone-900 truncate">
                        {p.name[lang]}
                      </h5>
                    </div>
                    <span className="text-[10px] text-stone-500 block truncate">
                      {p.target}x / {p.durationType} → {p.rewardRule.defaultTreatEmoji}{' '}
                      {p.rewardRule.defaultTreatName[lang]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              {/* Name & Emoji */}
              <div className="flex items-center gap-2">
                <div className="w-16">
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    {lang === 'zh' ? '圖標' : 'Emoji'}
                  </label>
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="w-full px-2 py-2 text-xl text-center bg-white rounded-xl border border-stone-200"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    {lang === 'zh' ? '目標名稱' : 'Goal Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'zh' ? '例如：健身運動、每日閱讀' : 'e.g. Gym Workout, Reading'}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              {/* Duration Type */}
              <div>
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  {lang === 'zh' ? '目標週期' : 'Duration Type'}
                </label>
                <div className="grid grid-cols-3 gap-2 bg-stone-100/70 p-1 rounded-xl">
                  {(['weekly', 'monthly', 'yearly'] as DurationType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDurationType(type)}
                      className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                        durationType === type
                          ? 'bg-white text-stone-900 font-semibold shadow-xs'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      {type === 'weekly'
                        ? lang === 'zh'
                          ? '每週'
                          : 'Weekly'
                        : type === 'monthly'
                        ? lang === 'zh'
                          ? '每月'
                          : 'Monthly'
                        : lang === 'zh'
                        ? '每年'
                        : 'Yearly'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target & Start Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    {lang === 'zh' ? '週期打卡目標 (次)' : 'Target Check-ins'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    required
                    value={target}
                    onChange={(e) => setTarget(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    {lang === 'zh' ? '開始日期' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              {/* Linked Treat & Reward Rule */}
              {hasRewardRule ? (
                <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-rose-500" />
                      <span>{lang === 'zh' ? '綁定獎賞與規則' : 'Reward Rule'}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onOpenCreateTreat}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-700"
                      >
                        + {lang === 'zh' ? '新建自訂獎賞' : 'New Treat'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasRewardRule(false)}
                        className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-rose-100/70 transition-colors"
                        title={lang === 'zh' ? '刪除此獎賞規則' : 'Delete reward rule'}
                        aria-label="Delete reward rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{lang === 'zh' ? '刪除規則' : 'Delete Rule'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      {lang === 'zh' ? '選擇獎賞' : 'Select Treat'}
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedTreatId}
                        onChange={(e) => {
                          setSelectedTreatId(e.target.value);
                          setConfirmDeleteTreatId(null);
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-400 min-w-0"
                      >
                        {treats.length === 0 ? (
                          <option value="">
                            {lang === 'zh' ? '（無可用獎賞，請先新增）' : '(No treats available, please add one)'}
                          </option>
                        ) : (
                          treats.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.emoji} {t.name} (Cap: {t.monthlyCap}/mo)
                            </option>
                          ))
                        )}
                      </select>
                      {selectedTreatId ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteSelectedTreat(selectedTreatId)}
                          className={`min-h-[36px] px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shrink-0 shadow-2xs ${
                            confirmDeleteTreatId === selectedTreatId
                              ? 'bg-rose-600 border border-rose-600 text-white hover:bg-rose-700 animate-pulse'
                              : 'bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                          title={
                            confirmDeleteTreatId === selectedTreatId
                              ? lang === 'zh'
                                ? '再次點擊確認刪除此獎賞'
                                : 'Click again to confirm deleting treat'
                              : lang === 'zh'
                              ? '從獎賞清單刪除此獎賞'
                              : 'Delete this treat'
                          }
                          aria-label={lang === 'zh' ? '刪除獎賞' : 'Delete treat'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>
                            {confirmDeleteTreatId === selectedTreatId
                              ? lang === 'zh'
                                ? '確認刪除？'
                                : 'Confirm?'
                              : lang === 'zh'
                              ? '刪除獎賞'
                              : 'Delete Treat'}
                          </span>
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <span>{lang === 'zh' ? '每打卡' : 'Every'}</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={checkInsRequired}
                      onChange={(e) => setCheckInsRequired(parseInt(e.target.value, 10) || 1)}
                      className="w-16 px-2 py-1 text-center bg-white rounded-lg border border-stone-200 font-bold"
                    />
                    <span>{lang === 'zh' ? '次 = 賺取' : 'check-ins = earn'}</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={treatsEarned}
                      onChange={(e) => setTreatsEarned(parseInt(e.target.value, 10) || 1)}
                      className="w-14 px-2 py-1 text-center bg-white rounded-lg border border-stone-200 font-bold"
                    />
                    <span>{lang === 'zh' ? '份享受' : 'treat(s)'}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-dashed border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-stone-400" />
                    <div>
                      <span className="text-xs font-semibold text-stone-700 block">
                        {lang === 'zh' ? '未設定獎賞規則' : 'No reward rule attached'}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {lang === 'zh' ? '純習慣打卡，無需賺取獎賞' : 'Habit tracking only, no treats attached'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHasRewardRule(true);
                      if (!selectedTreatId && treats.length > 0) setSelectedTreatId(treats[0].id);
                    }}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 bg-white border border-stone-200 px-3 py-1.5 rounded-xl hover:bg-rose-50/40 transition-colors shadow-2xs"
                  >
                    + {lang === 'zh' ? '新增獎賞規則' : 'Add Rule'}
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 bg-stone-900 text-white font-semibold text-xs rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all shadow-sm"
              >
                {lang === 'zh' ? '建立目標' : 'Create Goal'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#FFFDF9] rounded-3xl p-5 shadow-2xl border border-stone-200 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display text-base font-bold text-stone-900">
                {lang === 'zh' ? '編輯目標' : 'Edit Goal'}
              </h3>
              <button
                onClick={() => setEditingGoal(null)}
                className="text-stone-400 hover:text-stone-700 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="py-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  {lang === 'zh' ? '目標名稱' : 'Name'}
                </label>
                <input
                  type="text"
                  required
                  value={editingGoal.name}
                  onChange={(e) =>
                    setEditingGoal({ ...editingGoal, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  {lang === 'zh' ? '圖標' : 'Emoji'}
                </label>
                <input
                  type="text"
                  value={editingGoal.emoji}
                  onChange={(e) =>
                    setEditingGoal({ ...editingGoal, emoji: e.target.value })
                  }
                  className="w-16 px-3 py-2 text-xl text-center bg-white rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1">
                  {lang === 'zh' ? '目標次數' : 'Target'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  required
                  value={editingGoal.target}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      target: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              {/* Linked Treat & Reward Rule in Edit Modal */}
              {editingGoal.rewardRule ? (
                <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-rose-500" />
                      <span>{lang === 'zh' ? '綁定獎賞與規則' : 'Reward Rule'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingGoal({
                          ...editingGoal,
                          rewardRule: undefined,
                        })
                      }
                      className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-rose-100/70 transition-colors"
                      title={lang === 'zh' ? '刪除此獎賞規則' : 'Delete reward rule'}
                      aria-label="Delete reward rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'zh' ? '刪除規則' : 'Delete Rule'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      {lang === 'zh' ? '選擇獎賞' : 'Select Treat'}
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={editingGoal.rewardRule.treatId}
                        onChange={(e) => {
                          setEditingGoal({
                            ...editingGoal,
                            rewardRule: {
                              ...editingGoal.rewardRule!,
                              treatId: e.target.value,
                            },
                          });
                          setEditingConfirmDeleteTreatId(null);
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:ring-2 focus:ring-rose-400 min-w-0"
                      >
                        {treats.length === 0 ? (
                          <option value="">
                            {lang === 'zh' ? '（無可用獎賞，請先新增）' : '(No treats available, please add one)'}
                          </option>
                        ) : (
                          treats.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.emoji} {t.name} (Cap: {t.monthlyCap}/mo)
                            </option>
                          ))
                        )}
                      </select>
                      {editingGoal.rewardRule.treatId ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteEditingTreat(editingGoal.rewardRule!.treatId)}
                          className={`min-h-[36px] px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shrink-0 shadow-2xs ${
                            editingConfirmDeleteTreatId === editingGoal.rewardRule.treatId
                              ? 'bg-rose-600 border border-rose-600 text-white hover:bg-rose-700 animate-pulse'
                              : 'bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                          title={
                            editingConfirmDeleteTreatId === editingGoal.rewardRule.treatId
                              ? lang === 'zh'
                                ? '再次點擊確認刪除此獎賞'
                                : 'Click again to confirm deleting treat'
                              : lang === 'zh'
                              ? '從獎賞清單刪除此獎賞'
                              : 'Delete this treat'
                          }
                          aria-label={lang === 'zh' ? '刪除獎賞' : 'Delete treat'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>
                            {editingConfirmDeleteTreatId === editingGoal.rewardRule.treatId
                              ? lang === 'zh'
                                ? '確認刪除？'
                                : 'Confirm?'
                              : lang === 'zh'
                              ? '刪除獎賞'
                              : 'Delete Treat'}
                          </span>
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <span>{lang === 'zh' ? '每打卡' : 'Every'}</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={editingGoal.rewardRule.checkInsRequired}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          rewardRule: {
                            ...editingGoal.rewardRule!,
                            checkInsRequired: parseInt(e.target.value, 10) || 1,
                          },
                        })
                      }
                      className="w-16 px-2 py-1 text-center bg-white rounded-lg border border-stone-200 font-bold"
                    />
                    <span>{lang === 'zh' ? '次 = 賺取' : 'check-ins = earn'}</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editingGoal.rewardRule.treatsEarned}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          rewardRule: {
                            ...editingGoal.rewardRule!,
                            treatsEarned: parseInt(e.target.value, 10) || 1,
                          },
                        })
                      }
                      className="w-14 px-2 py-1 text-center bg-white rounded-lg border border-stone-200 font-bold"
                    />
                    <span>{lang === 'zh' ? '份享受' : 'treat(s)'}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-dashed border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-stone-400" />
                    <div>
                      <span className="text-xs font-semibold text-stone-700 block">
                        {lang === 'zh' ? '未設定獎賞規則' : 'No reward rule attached'}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {lang === 'zh' ? '純習慣打卡，無需賺取獎賞' : 'Habit tracking only, no treats attached'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingGoal({
                        ...editingGoal,
                        rewardRule: {
                          checkInsRequired: 3,
                          treatsEarned: 1,
                          treatId: treats[0]?.id || '',
                        },
                      })
                    }
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 bg-white border border-stone-200 px-3 py-1.5 rounded-xl hover:bg-rose-50/40 transition-colors shadow-2xs"
                  >
                    + {lang === 'zh' ? '新增獎賞規則' : 'Add Rule'}
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full min-h-[44px] mt-2 py-2.5 bg-stone-900 text-white font-semibold text-xs rounded-xl hover:bg-stone-800 transition-colors"
              >
                {lang === 'zh' ? '儲存變更' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
