import React from 'react';
import { X, Activity, ShieldCheck, Cpu, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { GameMetrics } from '../game/types';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: GameMetrics;
  onAutoRecover?: () => void;
  lang: 'fa' | 'en';
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  isOpen,
  onClose,
  metrics,
  onAutoRecover,
  lang
}) => {
  if (!isOpen) return null;

  const isFa = lang === 'fa';
  const diag = metrics.diagnostics || {
    fps: 60,
    canvasMode: 'native_roundrect',
    lastError: null,
    recoveryCount: 0,
    nanGuardedCount: 0,
    statusMessageFa: 'سیستم کاملاً پایدار و فعال است'
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto ${isFa ? 'font-vazir' : ''}`}
      dir={isFa ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                {isFa ? 'پایش هوشمند و عیب‌یابی پایداری بازی' : 'Real-time System Diagnostics'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isFa ? 'شناسایی علل هنگ و عملکرد مکانیزم ضد-توقف (Anti-Freeze Guard)' : 'Freeze root-cause identification & self-healing physics log'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Live Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* FPS */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center">
              <Cpu className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-[10px] text-slate-400 mb-0.5">{isFa ? 'نرخ فریم (FPS)' : 'Frame Rate'}</span>
              <span className="font-arcade text-sm font-bold text-cyan-400 arcade-num">{diag.fps} FPS</span>
            </div>

            {/* Canvas Mode */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[10px] text-slate-400 mb-0.5">{isFa ? 'موتور رندر Canvas' : 'Render Engine'}</span>
              <span className="font-semibold text-[11px] text-emerald-300">
                {diag.canvasMode === 'native_roundrect' ? (isFa ? 'بومی (Native)' : 'Native Canvas') : (isFa ? 'پلی‌فیل (Polyfill)' : 'Safe Polyfill')}
              </span>
            </div>

            {/* Recovery Count */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center">
              <RefreshCw className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[10px] text-slate-400 mb-0.5">{isFa ? 'بازیابی‌های موفق' : 'Auto Recoveries'}</span>
              <span className="font-arcade text-sm font-bold text-amber-400 arcade-num">{diag.recoveryCount}</span>
            </div>

            {/* NaN Guards */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center">
              <CheckCircle2 className="w-4 h-4 text-blue-400 mb-1" />
              <span className="text-[10px] text-slate-400 mb-0.5">{isFa ? 'حفاظت فیزیک' : 'Physics Guards'}</span>
              <span className="font-arcade text-sm font-bold text-blue-400 arcade-num">{diag.nanGuardedCount}</span>
            </div>
          </div>

          {/* Current System Status Banner */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            diag.lastError 
              ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' 
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
          }`}>
            {diag.lastError ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-bold text-sm mb-0.5">
                {diag.lastError ? (isFa ? 'گزارش عیب‌یابی سیستمی' : 'System Diagnostic Alert') : (isFa ? 'وضعیت پایداری موتور:' : 'Engine Status:')}
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {diag.statusMessageFa}
              </p>
            </div>
          </div>

          {/* Detailed Explanation of Fixed Causes */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-cyan-300 text-xs sm:text-sm border-b border-slate-800 pb-2">
              {isFa ? '🔍 بررسی و رفع علل اصلی هنگ کردن بازی (Freeze Root-Causes Fixed):' : '🔍 Resolved Root Causes & Technical Fixes:'}
            </h3>

            <div className="space-y-2.5 text-[11px] leading-relaxed">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-amber-300 block mb-0.5">
                  {isFa ? '۱. عدم پشتیبانی Canvas roundRect در برخی مرورگرها:' : '1. Canvas roundRect API incompatibility:'}
                </span>
                <p className="text-slate-300">
                  {isFa 
                    ? 'در برخی گوشی‌ها و مرورگرهای قدیمی، متد بومی roundRect وجود نداشت و فراخوانی آن باعث بروز خطای TypeError و توقف کامل حلقه رندر می‌شد. با افزودن تابع پد پشتیبان (Polyfill) جهانی، این مشکل کاملاً رفع گردید.'
                    : 'On older devices or WebViews, native Canvas roundRect threw TypeErrors crashing the loop. Replaced with a universal cross-browser fallback polyfill.'}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-amber-300 block mb-0.5">
                  {isFa ? '۲. قفل شدن حرکتی و گیر افتادن در آجرهای چندگانه:' : '2. Physics trajectory trapping & collision locks:'}
                </span>
                <p className="text-slate-300">
                  {isFa 
                    ? 'اگر سرعت عمودی توپ بسیار کم می‌شد، توپ بین دیواره‌ها به صورت افقی نوسان نامحدود پیدا می‌کرد یا در بین آجرهای متراکم گیر می‌افتاد. اکنون سقف ۳ برخورد در فریم و اصلاح خودکار بردار سرعت عمودی مانع از هنگ یا گیر کردن توپ می‌شود.'
                    : 'Near-zero vertical velocities caused horizontal bounce locks. Added automatic angular velocity nudges and 3-collision per frame safety caps.'}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-amber-300 block mb-0.5">
                  {isFa ? '۳. توقف حلقه requestAnimationFrame در اثر خطاهای ناخواسته:' : '3. Unhandled exceptions terminating requestAnimationFrame:'}
                </span>
                <p className="text-slate-300">
                  {isFa 
                    ? 'قبلاً بروز هرگونه خطای کوچک رندر باعث خروج از حلقه انیمیشن می‌شد. اکنون با ساختار try-catch-finally تضمین شده که حلقه انیمیشن بازی تحت هیچ شرایطی قطع نمی‌شود و سیستم خودکار بازیابی (Self-Healing) فیزیک را بازنشانی می‌کند.'
                    : 'Wrapped the rendering loop in try-catch-finally blocks guaranteeing that requestAnimationFrame is always re-scheduled.'}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-amber-300 block mb-0.5">
                  {isFa ? '۴. خطاهای پردازشگر صوتی Web Audio API:' : '4. Web Audio Context crashes:'}
                </span>
                <p className="text-slate-300">
                  {isFa 
                    ? 'در زمان قرار گرفتن گوشی در حالت خواب یا غیرفعال شدن صدای مرورگر، تولید نوت‌ها خطای غیرمنتظره می‌داد. تمام متدهای صوتی به صورت کامل در بلوک‌های محافظت‌شده قرار گرفتند.'
                    : 'Audio context exceptions on suspended mobile devices are now safely caught without disrupting the game logic.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
          {onAutoRecover && (
            <button
              onClick={onAutoRecover}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isFa ? 'تست و بازنشانی خودکار فیزیک' : 'Run Self-Healing Test'}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
          >
            {isFa ? 'متوجه شدم، بازگشت' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
