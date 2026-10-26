import React, { useState } from 'react';
import { X, BookOpen, Zap, Shield, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { PowerUpType, BrickType } from '../game/types';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'fa' | 'en';
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, lang }) => {
  const [tab, setTab] = useState<'powers' | 'bricks' | 'controls'>('powers');
  if (!isOpen) return null;

  const isFa = lang === 'fa';

  const powerUpsList: { type: PowerUpType; key: string; nameEn: string; nameFa: string; color: string; descEn: string; descFa: string }[] = [
    {
      type: 'laser',
      key: 'L',
      nameEn: 'Laser Cannon',
      nameFa: 'توپ‌های لیزری دوقلو',
      color: 'bg-red-500 text-white',
      descEn: 'Equips twin laser blasters to your Vaus. Fire rapid laser bolts using Space, Left Click, or the Tap button to blast bricks from afar!',
      descFa: 'راکت شما را به توپ‌های دولول پرسرعت لیزری مجهز می‌کند. با کلیک، اسپیس یا دکمه لمسی شلیک کنید و آجرها را از فاصله دور پودر کنید!'
    },
    {
      type: 'expand',
      key: 'E',
      nameEn: 'Expand Vaus',
      nameFa: 'افزایش طول راکت',
      color: 'bg-blue-500 text-white',
      descEn: 'Expands the width of your paddle by 40%, giving you a wider defense field to catch fast balls.',
      descFa: 'طول راکت فضاپیما را ۴۰ درصد افزایش می‌دهد و منطقه دفاعی بزرگتری برای نجات توپ‌های سریع فراهم می‌سازد.'
    },
    {
      type: 'catch',
      key: 'C',
      nameEn: 'Magnet Catch',
      nameFa: 'گیرنده و آهن‌ربا',
      color: 'bg-emerald-500 text-white',
      descEn: 'Catches the ball upon landing. Allows you to reposition and re-aim your shot before pressing Launch.',
      descFa: 'توپ را پس از فرود روی راکت نگه می‌دارد تا بتوانید سر فرصت جابه‌جا شوید و زاویه پرتاب بعدی را با دقت تنظیم کنید.'
    },
    {
      type: 'slow',
      key: 'S',
      nameEn: 'Slow Motion',
      nameFa: 'کاهش سرعت توپ',
      color: 'bg-amber-500 text-white',
      descEn: 'Reduces the speed of all active balls by 25%, restoring tactical control during intense waves.',
      descFa: 'سرعت تمام توپ‌های در حال حرکت را ۲۵ درصد کاهش می‌دهد تا کنترل بازی در مراحل شلوغ و سریع بسیار آسان‌تر شود.'
    },
    {
      type: 'multiball',
      key: 'M',
      nameEn: 'Multi-Ball',
      nameFa: 'توپ‌های سه‌گانه',
      color: 'bg-cyan-500 text-slate-950',
      descEn: 'Splits your ball into 3 independent balls with separate physics. Triple your destruction rate!',
      descFa: 'توپ را فوراً به ۳ توپ مستقل با فیزیک مجزا تکثیر می‌کند. تا زمانی که حداقل ۱ توپ در زمین باشد جانی از دست نمی‌رود!'
    },
    {
      type: 'fireball',
      key: 'F',
      nameEn: 'Plasma Fireball',
      nameFa: 'توپ پلاسما و آتشین',
      color: 'bg-orange-500 text-white',
      descEn: 'Supercharges the ball with burning plasma that slices directly through standard and silver bricks without bouncing!',
      descFa: 'توپ را به یک گلوله گداخته پلاسمایی تبدیل می‌کند که بدون برگشتن، مستقیماً از دل آجرها عبور کرده و آن‌ها را ذوب می‌کند!'
    },
    {
      type: 'life',
      key: 'P',
      nameEn: '1-UP Extra Life',
      nameFa: 'یک جان اضافه (1-UP)',
      color: 'bg-slate-200 text-slate-900',
      descEn: 'Instantly awards one additional reserve Vaus spacecraft life.',
      descFa: 'فوراً یک جان ذخیره جدید به راکت‌های شما اضافه می‌کند.'
    },
    {
      type: 'warp',
      key: 'W',
      nameEn: 'Warp Portal',
      nameFa: 'پرتال جهش کیهانی',
      color: 'bg-purple-500 text-white',
      descEn: 'Opens a dimensional hyperspace conduit to instantly warp you to the next sector!',
      descFa: 'پرتال سرعت‌نور را باز می‌کند و شما را مستقیماً به بخش بعدی کهکشان منتقل می‌نماید!'
    }
  ];

  const bricksList: { type: BrickType; nameEn: string; nameFa: string; color: string; descEn: string; descFa: string }[] = [
    {
      type: 'cyan',
      nameEn: 'Colored Bricks (7 Colors)',
      nameFa: 'آجرهای رنگی استاندارد (۷ رنگ)',
      color: 'bg-cyan-500',
      descEn: 'Destructible with 1 hit. Consecutive hits create an escalating Combo Multiplier that multiplies your score!',
      descFa: 'با ۱ ضربه نابود می‌شوند. ضربات پیاپی بدون افتادن توپ، ضریب کمبو (Combo) و امتیاز فوق‌العاده تصاعدی به شما می‌دهند.'
    },
    {
      type: 'silver',
      nameEn: 'Silver Armored Bricks',
      nameFa: 'آجرهای نقره‌ای تقویت‌شده',
      color: 'bg-slate-400',
      descEn: 'Reinforced titanium alloy. Requires 2 to 4 hits to destroy. Shows dynamic cracks as structural damage increases.',
      descFa: 'آلیاژ تیتانیوم مقاوم که به ۲ الی ۴ ضربه برای انهدام نیاز دارد و با هر ضربه خطوط شکستگی روی آن پدیدار می‌شود.'
    },
    {
      type: 'gold',
      nameEn: 'Gold Indestructible Bricks',
      nameFa: 'آجرهای طلایی نفوذناپذیر',
      color: 'bg-amber-400',
      descEn: 'Deflects normal balls with a heavy metallic clang. Permanent barriers that can only be eroded by intense laser fire.',
      descFa: 'توپ معمولی را با صدای فلزی محکم بازتاب می‌دهند و سدهای پایداری هستند که فقط با شلیک مکرر لیزر از بین می‌روند.'
    },
    {
      type: 'tnt',
      nameEn: 'TNT Explosive Bricks',
      nameFa: 'آجرهای انفجاری (TNT)',
      color: 'bg-red-600',
      descEn: 'Triggers a massive radial explosion when hit, clearing all 8 adjacent bricks in a devastating chain reaction!',
      descFa: 'به محض برخورد، انفجار مهیبی ایجاد کرده و تمامی آجرهای اطراف را در یک واکنش زنجیره‌ای تکه‌تکه می‌کند!'
    },
    {
      type: 'boss',
      nameEn: 'D.O.H. Cyber Boss',
      nameFa: 'غول مرحله ۵: نگهبان سایبری D.O.H',
      color: 'bg-rose-500',
      descEn: 'Encountered at Sector 05. Moves across the arena and launches plasma energy orbs that must be dodged!',
      descFa: 'در بخش پنجم ظاهر می‌شود. به چپ و راست مانور می‌دهد و گوی‌های پلاسمایی به سمت راکت شلیک می‌کند که باید جاخالی دهید!'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto"
      dir={isFa ? 'rtl' : 'ltr'}
    >
      <div className={`w-full max-w-2xl bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${isFa ? 'font-vazir' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold text-slate-100 ${isFa ? 'font-vazir' : 'font-arcade tracking-wider'}`}>
                {isFa ? 'راهنمای جامع بازی پارانوئید' : 'HOW TO PLAY & INTEL'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isFa ? 'آشنایی با پاورآپ‌ها، انواع آجرها و کنترل‌های پیشرفته' : 'Vaus operations, power-up capsules & brick types'}
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setTab('powers')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              tab === 'powers' 
                ? 'border-cyan-400 text-cyan-400 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isFa ? 'پاورآپ‌ها (۸ نوع)' : 'Power-Ups'}</span>
          </button>

          <button
            onClick={() => setTab('bricks')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              tab === 'bricks' 
                ? 'border-cyan-400 text-cyan-400 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isFa ? 'انواع آجرها و غول' : 'Bricks & Boss'}</span>
          </button>

          <button
            onClick={() => setTab('controls')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              tab === 'controls' 
                ? 'border-cyan-400 text-cyan-400 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isFa ? 'کنترل دسکتاپ و لمسی' : 'Controls'}</span>
          </button>
        </div>

        {/* Tab Contents (Scrollable) */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs text-slate-300">
          {tab === 'powers' && (
            <div className="space-y-3">
              {powerUpsList.map((p) => (
                <div key={p.type} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold font-arcade shrink-0 shadow-md ${p.color}`}>
                    {p.key}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-100 text-sm">
                        {isFa ? p.nameFa : p.nameEn}
                      </span>
                      <span className="text-[10px] text-slate-400 font-arcade">
                        CAPSULE [{p.key}]
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                      {isFa ? p.descFa : p.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'bricks' && (
            <div className="space-y-3">
              {bricksList.map((b) => (
                <div key={b.type} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                  <div className={`w-9 h-5 rounded-sm shrink-0 border border-white/20 mt-0.5 shadow-sm ${b.color}`} />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-100 text-sm mb-1">
                      {isFa ? b.nameFa : b.nameEn}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                      {isFa ? b.descFa : b.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'controls' && (
            <div className="space-y-4">
              {/* Desktop Controls */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold text-sm">
                  <Monitor className="w-4 h-4" />
                  <span>{isFa ? 'کنترل‌های کامپیوتر و لپ‌تاپ' : 'Desktop & Laptop Controls'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 mb-1">{isFa ? 'حرکت راکت:' : 'Move Paddle:'}</div>
                    <div className="font-semibold text-slate-200">{isFa ? 'حرکت ماوس یا کلیدهای A/D یا جهت‌نما چپ و راست' : 'Mouse Movement or A / D or Arrow Keys'}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 mb-1">{isFa ? 'پرتاب توپ و شلیک لیزر:' : 'Launch & Fire:'}</div>
                    <div className="font-semibold text-slate-200">{isFa ? 'کلیک چپ ماوس یا کلید Space' : 'Left Click or Spacebar'}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 mb-1">{isFa ? 'توقف و ادامه:' : 'Pause / Resume:'}</div>
                    <div className="font-semibold text-slate-200">{isFa ? 'کلید P یا کلید Esc' : 'Key P or Escape'}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 mb-1">{isFa ? 'زاویه جهش توپ:' : 'Bounce Angles:'}</div>
                    <div className="font-semibold text-slate-200">{isFa ? 'ضربه به لبه‌های راکت زاویه تندتر می‌دهد' : 'Edges create sharp tactical angles'}</div>
                  </div>
                </div>
              </div>

              {/* Mobile Controls */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-3 text-pink-400 font-bold text-sm">
                  <Smartphone className="w-4 h-4" />
                  <span>{isFa ? 'کنترل‌های لمسی گوشی و تبلت' : 'Mobile & Tablet Touch Controls'}</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-[11px] leading-relaxed text-slate-300">
                  <li>{isFa ? 'کشیدن انگشت روی صفحه: راکت در لبه انتهایی صفحه کاملاً نرم و سریع زیر انگشت شما جابه‌جا می‌شود.' : 'Drag finger on screen: Paddle smoothly and swiftly tracks under your touch at the bottom edge.'}</li>
                  <li>{isFa ? 'ضربه روی صفحه (Tap): پرتاب توپ گیر کرده یا شلیک مسلسل لیزری با هر ضربه.' : 'Tap on screen: Instantly launches stuck balls or fires twin laser cannons.'}</li>
                  <li>{isFa ? 'بازی با دو انگشت: با یک انگشت راکت را هدایت کنید و با انگشت دیگر برای شلیک پیاپی لیزر روی صفحه ضربه بزنید.' : 'Multi-touch: Steer with one thumb and tap with the other for rapid laser fire.'}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
          >
            {isFa ? 'فهمیدم، بازگشت به بازی' : 'Got It, Return'}
          </button>
        </div>
      </div>
    </div>
  );
};
