import React, { useRef, useState } from 'react';
import {
  X,
  Download,
  Upload,
  Sparkles,
  Trash2,
  ShieldCheck,
  Check,
  AlertTriangle,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    lang,
    setLang,
    exportDataJSON,
    importDataJSON,
    loadDemoData,
    clearAllData,
    setIsOnboardingOpen,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [pendingImport, setPendingImport] = useState<{ content: string; filename: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!isSettingsOpen) return null;

  const showTemporaryNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `earn-your-treat-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showTemporaryNotice(lang === 'zh' ? '資料已成功匯出！' : 'Data exported successfully!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPendingImport({
        content,
        filename: file.name,
      });
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = () => {
    if (!pendingImport) return;
    const success = importDataJSON(pendingImport.content);
    if (success) {
      setImportStatus('success');
      showTemporaryNotice(lang === 'zh' ? '資料已成功匯入！' : 'Data imported successfully!');
    } else {
      setImportStatus('error');
      showTemporaryNotice(
        lang === 'zh'
          ? '匯入失敗：檔案格式不正確'
          : 'Import failed: invalid JSON format'
      );
    }
    setPendingImport(null);
  };

  const handleCancelImport = () => {
    setPendingImport(null);
  };

  const handleLoadDemo = () => {
    loadDemoData();
    showTemporaryNotice(
      lang === 'zh'
        ? '已載入 2 個月真實範例資料！'
        : 'Loaded 2 months of sample data!'
    );
  };

  const handleConfirmClear = () => {
    clearAllData();
    setShowClearConfirm(false);
    showTemporaryNotice(
      lang === 'zh' ? '所有資料已清空' : 'All data has been cleared'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#FFFDF9] rounded-3xl p-5 shadow-2xl border border-stone-200 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="font-display text-base font-bold text-stone-900">
            {lang === 'zh' ? '設定與備份' : 'Settings & Data'}
          </h2>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Temporary Notice Banner */}
        {notice && (
          <div className="mt-3 py-2 px-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{notice}</span>
          </div>
        )}

        <div className="py-4 space-y-4">
          {/* Language Selection */}
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-stone-400" />
              <span>{lang === 'zh' ? '語言設定' : 'Language'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2 bg-stone-100/70 p-1 rounded-xl">
              <button
                onClick={() => setLang('en')}
                className={`py-2 text-xs font-medium rounded-lg transition-colors min-h-[40px] ${
                  lang === 'en'
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('zh')}
                className={`py-2 text-xs font-medium rounded-lg transition-colors min-h-[40px] ${
                  lang === 'zh'
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                繁體中文 (香港)
              </button>
            </div>
          </div>

          {/* Quick Guide & Onboarding */}
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
              <span>{lang === 'zh' ? '新手導覽' : 'App Guide'}</span>
            </label>
            <button
              onClick={() => {
                setIsSettingsOpen(false);
                setIsOnboardingOpen(true);
              }}
              className="w-full min-h-[44px] py-2 px-3 bg-white text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors flex items-center justify-between"
            >
              <span>{lang === 'zh' ? '重溫核心玩法與概念' : 'Review 3-Step Guide'}</span>
              <span className="text-stone-400">→</span>
            </button>
          </div>

          {/* Data Backup & Restore */}
          <div>
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
              {lang === 'zh' ? '資料備份與還原' : 'Data Storage & Backup'}
            </label>
            <div className="space-y-2">
              {/* Export Button */}
              <button
                onClick={handleExport}
                className="w-full min-h-[44px] py-2 px-3 bg-white text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-stone-500" />
                <span>{lang === 'zh' ? '匯出備份 (JSON 下載)' : 'Export Data (JSON)'}</span>
              </button>

              {/* Import Button */}
              {/* Import Button & Confirmation */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
              {pendingImport ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{lang === 'zh' ? '確定匯入備份資料？' : 'Import backup data?'}</span>
                  </div>
                  <p className="text-[11px] text-rose-600 leading-normal">
                    {lang === 'zh'
                      ? `此操作無法還原，匯入將會取代現有的所有目標、獎賞、打卡及獎牌紀錄（檔案：${pendingImport.filename}）。`
                      : `This action cannot be undone. Importing "${pendingImport.filename}" will replace all your current goals, treats, check-ins, and trophies.`}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleConfirmImport}
                      className="flex-1 min-h-[36px] bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      {lang === 'zh' ? '確認覆蓋匯入' : 'Yes, Import & Replace'}
                    </button>
                    <button
                      onClick={handleCancelImport}
                      className="flex-1 min-h-[36px] bg-white text-stone-600 text-xs font-medium rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                    >
                      {lang === 'zh' ? '取消' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full min-h-[44px] py-2 px-3 bg-white text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4 text-stone-500" />
                  <span>{lang === 'zh' ? '匯入資料 (選擇 JSON 檔案)' : 'Import Data (JSON file)'}</span>
                </button>
              )}

              {/* Load Demo Data */}
              <button
                onClick={handleLoadDemo}
                className="w-full min-h-[44px] py-2 px-3 bg-amber-50/80 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200/80 hover:bg-amber-100/70 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{lang === 'zh' ? '載入 2 個月真實範例資料' : 'Load 2-Month Demo Data'}</span>
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/60 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-stone-600 leading-relaxed">
              {lang === 'zh'
                ? '溫馨提示：你的所有資料均只儲存於此裝置的瀏覽器本地，無需登入，亦絕不連繫任何伺服器或外部 API。'
                : 'Notice: All your data is stored locally in this browser. No login, no server, and no external APIs.'}
            </p>
          </div>

          {/* Destructive Zone: Clear Data */}
          <div className="pt-2 border-t border-stone-100">
            {showClearConfirm ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{lang === 'zh' ? '確定清空所有記錄？' : 'Clear all data?'}</span>
                </div>
                <p className="text-[11px] text-rose-600 leading-normal">
                  {lang === 'zh'
                    ? '此操作無法還原，包括所有目標、獎賞、打卡及獎牌紀錄。'
                    : 'This action cannot be undone. All your goals, treats, check-ins, and trophies will be deleted.'}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleConfirmClear}
                    className="flex-1 min-h-[36px] bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    {lang === 'zh' ? '確認清空' : 'Yes, Clear All'}
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 min-h-[36px] bg-white text-stone-600 text-xs font-medium rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                  >
                    {lang === 'zh' ? '取消' : 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full min-h-[44px] py-2 px-3 text-rose-500 hover:text-rose-600 text-xs font-semibold rounded-xl hover:bg-rose-50/60 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'zh' ? '清空所有資料' : 'Clear All Data'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
