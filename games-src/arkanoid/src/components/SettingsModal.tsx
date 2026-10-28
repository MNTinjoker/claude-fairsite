import React from 'react';
import { X, Sliders, Palette, Sparkles, Tv, Eye, RotateCcw } from 'lucide-react';
import { GameSettings, VisualTheme } from '../game/types';
import { THEME_DETAILS, DEFAULT_SETTINGS } from '../game/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  lang: 'fa' | 'en';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  lang,
}) => {
  if (!isOpen) return null;
  const isFa = lang === 'fa';

  const themes: VisualTheme[] = ['nebula', 'cyber', 'solar', 'matrix', 'arcade'];

  const handleThemeChange = (t: VisualTheme) => {
    onUpdateSettings({ ...settings, theme: t });
  };

  const handleToggle = (key: keyof Pick<GameSettings, 'scanlines' | 'bloom' | 'trail'>) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
  };

  const handleParticlesChange = (val: 'high' | 'medium' | 'low') => {
    onUpdateSettings({ ...settings, particles: val });
  };

  const handleScreenShakeChange = (val: 'normal' | 'subtle' | 'off') => {
    onUpdateSettings({ ...settings, screenShake: val });
  };

  const handleResetDefaults = () => {
    onUpdateSettings({ ...DEFAULT_SETTINGS });
  };

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto"
      dir={isFa ? 'rtl' : 'ltr'}
    >
      <div className={`w-full max-w-xl bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${isFa ? 'font-vazir' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-950 border border-pink-500/50 flex items-center justify-center text-pink-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold text-slate-100 ${isFa ? 'font-vazir' : 'font-arcade tracking-wider'}`}>
                {isFa ? 'تنظیمات ظاهر و پس‌زمینه' : 'VISUAL & GAME SETTINGS'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isFa ? 'شخصی‌سازی تم فضا، افکت‌های نئون و جلوه‌های بصری' : 'Customize theme arena, neon glow & particle fidelity'}
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

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Background Theme Selector */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold text-sm">
              <Palette className="w-4 h-4" />
              <span>{isFa ? 'انتخاب پس‌زمینه و تم کهکشان' : 'Arena Background Theme'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {themes.map((t) => {
                const info = THEME_DETAILS[t];
                const isSelected = settings.theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`p-3 rounded-xl border text-start transition cursor-pointer flex flex-col gap-1.5 relative overflow-hidden ${
                      isSelected 
                        ? 'border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-950/50' 
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-950/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-white/40 shadow-xs"
                          style={{ backgroundColor: info.accentHex }}
                        />
                        <span className={`font-bold text-slate-100 ${isFa ? 'font-vazir text-xs' : 'font-arcade text-[11px]'}`}>
                          {isFa ? info.nameFa : info.nameEn}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] text-cyan-400 font-bold font-arcade">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">
                      {isFa ? info.descFa : info.descEn}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visual Polish Toggles */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-pink-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>{isFa ? 'جلوه‌های ویژه و رندرهای گرافیکی' : 'Visual & Motion Effects'}</span>
            </div>

            <div className="space-y-2">
              {/* Scanlines Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Tv className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-semibold text-slate-200">
                      {isFa ? 'خطوط اسکن تلویزیون قدیمی (CRT Scanlines)' : 'Retro CRT Scanlines'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isFa ? 'حس بازی روی نمایشگرهای رترو آرکید دهه ۸۰' : 'Authentic 80s phosphor arcade display overlay'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('scanlines')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.scanlines ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    settings.scanlines ? (isFa ? 'left-1' : 'right-1') : (isFa ? 'right-1' : 'left-1')
                  }`} />
                </button>
              </div>

              {/* Bloom Glow Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-semibold text-slate-200">
                      {isFa ? 'هاله نوری نئون و بلوم (Neon Glow & Bloom)' : 'Neon Glow & Ball Aura'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isFa ? 'درخشش نئونی دور توپ، گلوله‌های لیزر و پاورآپ‌ها' : 'Emissive glow aura on active balls and laser bolts'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('bloom')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.bloom ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    settings.bloom ? (isFa ? 'left-1' : 'right-1') : (isFa ? 'right-1' : 'left-1')
                  }`} />
                </button>
              </div>

              {/* Ball Trail Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-semibold text-slate-200">
                      {isFa ? 'دنباله محوشونده توپ (Ball Motion Trail)' : 'Ball Motion Trails'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isFa ? 'نمایش مسیر سرعت توپ با ذرات ردپا' : 'Dynamic speed trail particles behind active balls'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('trail')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.trail ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    settings.trail ? (isFa ? 'left-1' : 'right-1') : (isFa ? 'right-1' : 'left-1')
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Sliders / Discrete Options: Particles & Screen Shake */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Particle Density */}
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between">
              <span className="font-semibold text-slate-200 mb-2">
                {isFa ? 'تراکم ذرات و جرقه‌ها:' : 'Particle Intensity:'}
              </span>
              <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {(['high', 'medium', 'low'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleParticlesChange(lvl)}
                    className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${
                      settings.particles === lvl ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl === 'high' ? (isFa ? 'زیاد' : 'High') : lvl === 'medium' ? (isFa ? 'متوسط' : 'Med') : (isFa ? 'کم' : 'Low')}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Shake */}
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between">
              <span className="font-semibold text-slate-200 mb-2">
                {isFa ? 'شدت لرزش دوربین:' : 'Screen Shake:'}
              </span>
              <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {(['normal', 'subtle', 'off'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleScreenShakeChange(lvl)}
                    className={`py-1 rounded text-[10px] font-semibold transition cursor-pointer ${
                      settings.screenShake === lvl ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl === 'normal' ? (isFa ? 'طبیعی' : 'Normal') : lvl === 'subtle' ? (isFa ? 'ملایم' : 'Soft') : (isFa ? 'خاموش' : 'Off')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer px-2 py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isFa ? 'بازنشانی تنظیمات اولیه' : 'Reset Defaults'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
          >
            {isFa ? 'ذخیره و بازگشت' : 'Save & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
