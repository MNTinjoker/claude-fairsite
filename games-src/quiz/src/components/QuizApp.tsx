import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { questionsBank, Question, Option } from '../data/questions';
import { shuffleArray, toPersianDigits, toEnglishDigits, formatDigits } from '../utils';

import { 
  CheckCircle2, XCircle, ArrowRight, ArrowLeft, Info, Grid, Bookmark, 
  User, Lock, Mail, LogOut, UserPlus, Loader2, RefreshCw, 
  Check, AlertCircle, Building2, Sliders, Calendar, Play, Sparkles, Languages, Phone,
  Activity, Shield, Users, FileText, Clock, Eye, EyeOff, Trash2, Sun, Moon, ChevronDown, ChevronUp
} from 'lucide-react';
import { 
  Radar as ReRadar, 
  RadarChart as ReRadarChart, 
  PolarGrid as RePolarGrid, 
  PolarAngleAxis as RePolarAngleAxis, 
  PolarRadiusAxis as RePolarRadiusAxis, 
  ResponsiveContainer as ReResponsiveContainer,
  BarChart as ReBarChart,
  Bar as ReBar,
  Cell as ReCell,
  XAxis as ReXAxis,
  YAxis as ReYAxis,
  CartesianGrid as ReCartesianGrid,
  Tooltip as ReTooltip,
  Legend as ReLegend
} from 'recharts';

const renderBoldText = (text: string) => {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="font-black text-blue-900 border-b border-blue-200/50 pb-0.5">{part}</strong>;
    }
    return part;
  });
};

const MarkdownRenderer = ({ text, isEn }: { text: string; isEn?: boolean }) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  return (
    <div className={`space-y-4 leading-relaxed text-slate-700 dark:text-slate-200 font-sans ${isEn ? 'text-left' : 'text-right'}`} dir={isEn ? 'ltr' : 'rtl'}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;
        
        // Headers ###
        if (trimmed.startsWith('###')) {
          const content = trimmed.substring(3).trim();
          return (
            <h4 key={idx} className={`text-base sm:text-lg font-black text-blue-900 mt-6 mb-2 ${isEn ? 'border-l-4 border-blue-600 pl-2.5' : 'border-r-4 border-blue-600 pr-2.5'}`}>
              {renderBoldText(content)}
            </h4>
          );
        }
        
        // Headers ##
        if (trimmed.startsWith('##')) {
          const content = trimmed.substring(2).trim();
          return (
            <h3 key={idx} className="text-lg sm:text-xl font-black text-indigo-950 mt-8 mb-3 pb-1.5 border-b border-indigo-150">
              {renderBoldText(content)}
            </h3>
          );
        }
        
        // Headers #
        if (trimmed.startsWith('#')) {
          const content = trimmed.substring(1).trim();
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 mt-10 mb-4 pb-2 border-b-2 border-slate-200 dark:border-slate-800">
              {renderBoldText(content)}
            </h2>
          );
        }
        
        // Lists with - or *
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.substring(2).trim();
          return (
            <div key={idx} className={`flex items-start gap-2.5 my-1.5 ${isEn ? 'pl-2' : 'pr-4'}`}>
              <span className="shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2.5"></span>
              <p className="font-bold text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed flex-1">
                {renderBoldText(content)}
              </p>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-sm sm:text-base text-slate-750 font-bold leading-relaxed">
            {renderBoldText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

type QuizState = 'start' | 'playing' | 'result';

const lettersFa = ['الف', 'ب', 'ج', 'د'];
const lettersEn = ['A', 'B', 'C', 'D'];
const getLetter = (index: number, lang: 'fa' | 'en' = 'fa') => {
  return lang === 'en' ? (lettersEn[index] || '-') : (lettersFa[index] || '-');
};

const formatNumber = (val: number | string | null | undefined, lang: 'fa' | 'en' = 'fa') => {
  return formatDigits(val, lang);
};

const getDifficultyLabel = (diff: string, lang: 'fa' | 'en' = 'fa') => {
  if (diff === 'easy') return lang === 'en' ? 'Easy' : 'آسان';
  if (diff === 'medium') return lang === 'en' ? 'Medium' : 'متوسط';
  if (diff === 'hard') return lang === 'en' ? 'Hard' : 'سخت';
  return diff;
};

const getTopicBadgeColor = (topic: string) => {
  const t = (topic || '').trim().toLowerCase();
  if (t.includes('work') || t.includes('economy') || t.includes('کار')) {
    return 'bg-blue-600 text-white shadow-blue-500/20';
  }
  if (t.includes('individual') || t.includes('people') || t.includes('افراد')) {
    return 'bg-purple-600 text-white shadow-purple-500/20';
  }
  if (t.includes('society') || t.includes('community') || t.includes('جامعه')) {
    return 'bg-amber-600 text-white shadow-amber-500/20';
  }
  if (t.includes('environment') || t.includes('planet') || t.includes('محیط')) {
    return 'bg-emerald-600 text-white shadow-emerald-500/20';
  }
  return 'bg-indigo-600 text-white shadow-indigo-500/20';
};

const getTopicCardStyle = (topic: string) => {
  const t = (topic || '').trim().toLowerCase();
  if (t.includes('environment') || t.includes('planet') || t.includes('محیط')) {
    return 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/90 dark:border-emerald-800/50 shadow-sm';
  }
  if (t.includes('work') || t.includes('economy') || t.includes('کار')) {
    return 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-200/90 dark:border-blue-800/50 shadow-sm';
  }
  if (t.includes('individual') || t.includes('people') || t.includes('افراد')) {
    return 'bg-purple-50/30 dark:bg-purple-950/20 border-purple-200/90 dark:border-purple-800/50 shadow-sm';
  }
  if (t.includes('society') || t.includes('community') || t.includes('جامعه')) {
    return 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/90 dark:border-amber-800/50 shadow-sm';
  }
  return 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm';
};

const isAgileOrWaterfallTopic = (topic: string) => {
  const lower = (topic || '').toLowerCase();
  return lower.includes('work') || lower.includes('economy') || lower.includes('environment') || lower.includes('society') || lower.includes('individual');
};

const translateTopic = (topic: string, lang: 'fa' | 'en' = 'fa') => {
  const t = (topic || '').trim().toLowerCase();
  if (t.includes('work') || t.includes('economy') || t.includes('کار')) {
    return lang === 'en' ? 'Work & Economy' : 'کار و اقتصاد';
  }
  if (t.includes('individual') || t.includes('people') || t.includes('افراد')) {
    return lang === 'en' ? 'Individuals & People' : 'افراد و سرمایه انسانی';
  }
  if (t.includes('society') || t.includes('community') || t.includes('جامعه')) {
    return lang === 'en' ? 'Society & Community' : 'جامعه و مسئولیت اجتماعی';
  }
  if (t.includes('environment') || t.includes('planet') || t.includes('محیط')) {
    return lang === 'en' ? 'Environment & Planet' : 'محیط زیست و سیاره';
  }
  if (t === 'definition') return lang === 'en' ? 'Definitions' : 'تعاریف پایه‌ای';
  if (t === 'concepts') return lang === 'en' ? 'Key Concepts' : 'مفاهیم کلیدی';
  if (t === 'approaches') return lang === 'en' ? 'Approaches' : 'رویکردها';
  if (t === 'waterfall') return lang === 'en' ? 'Waterfall' : 'آبشاری (Waterfall)';
  if (t === 'agile') return lang === 'en' ? 'Agile' : 'چابک (Agile)';
  return topic;
};

const normalizePersianText = (str: string) => {
  if (!str) return '';
  return str
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .trim()
    .toLowerCase();
};

const getRoleLabel = (role: string, lang: 'fa' | 'en' = 'fa') => {
  const r = normalizePersianText(role);
  if (r === 'super_admin' || r === 'superadmin' || r === 'ادمین کل' || r === 'کل') return lang === 'en' ? 'Super Admin' : 'ادمین کل';
  if (r === 'company_admin' || r === 'companyadmin' || r === 'ادمین شرکت' || r === 'شرکت') return lang === 'en' ? 'Company Admin' : 'ادمین شرکت';
  return lang === 'en' ? 'Standard' : 'عادی';
};

const formatTime = (seconds: number, lang: 'fa' | 'en' = 'fa') => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  const secsStr = secs < 10 ? `0${secs}` : `${secs}`;
  return formatDigits(`${minsStr}:${secsStr}`, lang);
};
const QuizAnalytics = ({ questions, selectedAnswers, lang }: { questions: Question[], selectedAnswers: Record<string, string>, lang: string }) => {
  const t = (fa: string, en: string) => (lang === 'fa' ? fa : en);

  // 1. Dimensional Stats (IPMA WISE)
  const statsByTopic: Record<string, { total: number, correct: number }> = {};
  // 2. Difficulty Stats
  const statsByDifficulty: Record<string, { total: number, correct: number }> = {
    easy: { total: 0, correct: 0 },
    medium: { total: 0, correct: 0 },
    hard: { total: 0, correct: 0 }
  };

  questions.forEach(q => {
    const topic = q.topic;
    const diff = q.difficulty || 'medium';
    
    if (!statsByTopic[topic]) statsByTopic[topic] = { total: 0, correct: 0 };
    statsByTopic[topic].total++;
    if (statsByDifficulty[diff]) statsByDifficulty[diff].total++;

    const selId = selectedAnswers[q.id];
    const opt = q.options.find(o => o.id === selId);
    if (opt?.isCorrect) {
      statsByTopic[topic].correct++;
      if (statsByDifficulty[diff]) statsByDifficulty[diff].correct++;
    }
  });

  // Ensure all 4 IPMA WISE dimensions are always included even if no questions exist for them
  const wiseTopics = ['work', 'individual', 'society', 'environment'];
  
  const radarData = wiseTopics.map(topicKey => {
    // Find if we have real stats for this topic key (handling various string forms)
    const realTopicKey = Object.keys(statsByTopic).find(k => {
      const lowerK = k.toLowerCase();
      if (topicKey === 'work') return lowerK.includes('work') || lowerK.includes('economy') || lowerK.includes('کار');
      if (topicKey === 'individual') return lowerK.includes('individual') || lowerK.includes('people') || lowerK.includes('افراد');
      if (topicKey === 'society') return lowerK.includes('society') || lowerK.includes('community') || lowerK.includes('جامعه');
      if (topicKey === 'environment') return lowerK.includes('environment') || lowerK.includes('planet') || lowerK.includes('محیط') || lowerK.includes('governance') || lowerK.includes('حکمرانی');
      return lowerK.includes(topicKey);
    });
    
    const stats = realTopicKey ? statsByTopic[realTopicKey] : { total: 0, correct: 0 };
    
    return {
      subject: translateTopic(topicKey, lang as any),
      A: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      fullMark: 100
    };
  });

  const difficultyData = [
    { name: t('آسان', 'Easy'), percentage: Math.round((statsByDifficulty.easy.correct / (statsByDifficulty.easy.total || 1)) * 100) },
    { name: t('متوسط', 'Medium'), percentage: Math.round((statsByDifficulty.medium.correct / (statsByDifficulty.medium.total || 1)) * 100) },
    { name: t('سخت', 'Hard'), percentage: Math.round((statsByDifficulty.hard.correct / (statsByDifficulty.hard.total || 1)) * 100) }
  ];

  const renderPolarAngleAxisTick = ({ payload, x, y, cx, cy, ...rest }: any) => {
    const parts = payload.value.split(' ');
    let line1 = payload.value;
    let line2 = "";
    
    if (parts.length > 2) {
      line1 = parts.slice(0, 2).join(' ');
      line2 = parts.slice(2).join(' ');
    } else if (parts.length === 2) {
      line1 = parts[0];
      line2 = parts[1];
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
          fill="#d4d4d8"
          fontSize="9px"
          fontWeight="800"
        >
          <tspan x={0} dy="0em">{line1}</tspan>
          {line2 && <tspan x={0} dy="1.1em">{line2}</tspan>}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-10 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Radar Chart for Dimensions */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-md flex flex-col items-center">
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 text-center">
            <Activity size={18} className="text-indigo-600" />
            {t('تحلیل گرافیکی ابعاد IPMA WISE', 'IPMA WISE Dimensions Analysis')}
          </h4>
          <div className="w-full h-72">
            <ReResponsiveContainer width="100%" height="100%">
              <ReRadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                <RePolarGrid stroke="#2a2a2d" strokeDasharray="3 3" />
                <RePolarAngleAxis 
                  dataKey="subject" 
                  tick={renderPolarAngleAxisTick}
                />
                <RePolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: '#8e8e93' }} stroke="#2a2a2d" />
                <ReTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: '700' }}
                />
                <ReRadar
                  name={t('درصد تسلط', 'Mastery %')}
                  dataKey="A"
                  stroke="#39ff6a"
                  strokeWidth={3}
                  fill="#5cff8a"
                  fillOpacity={0.5}
                  animationDuration={1500}
                />
              </ReRadarChart>
            </ReResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center leading-relaxed italic">
            {t('نمودار راداری فوق، توازن تصمیم‌گیری شما را در ابعاد چهارگانه پایداری نمایش می‌دهد.', 'The radar chart visualizes your decision-making balance across the four sustainability dimensions.')}
          </p>
        </div>

        {/* Bar Chart for Difficulty */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-md flex flex-col items-center">
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 text-center">
            <Sliders size={18} className="text-blue-600" />
            {t('دقت پاسخ‌دهی بر اساس درجه سختی', 'Accuracy by Difficulty Level')}
          </h4>
          <div className="w-full h-72">
            <ReResponsiveContainer width="100%" height="100%">
              <ReBarChart data={difficultyData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradientEasy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.9}/>
                  </linearGradient>
                  <linearGradient id="barGradientMedium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.9}/>
                  </linearGradient>
                  <linearGradient id="barGradientHard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0.9}/>
                  </linearGradient>
                </defs>
                <ReCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2d" />
                <ReXAxis dataKey="name" tick={{ fill: '#b4b4b8', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <ReYAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8e8e93' }} />
                <ReTooltip 
                   cursor={{ fill: '#232325' }}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: '700' }}
                />
                <ReBar dataKey="percentage" radius={[8, 8, 0, 0]} barSize={45} animationDuration={1500}>
                  {difficultyData.map((entry, index) => (
                    <ReCell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? 'url(#barGradientEasy)' : index === 1 ? 'url(#barGradientMedium)' : 'url(#barGradientHard)'} 
                    />
                  ))}
                </ReBar>
              </ReBarChart>
            </ReResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
             <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>
               {t('آسان', 'Easy')}
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
               <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></div>
               {t('متوسط', 'Medium')}
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
               <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm"></div>
               {t('سخت', 'Hard')}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Standalone exam: no login, admin or result storage. The host site records the score.
export default function QuizApp() {
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const t = (fa: string, en: string) => (lang === 'fa' ? fa : en);
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [reviewMarks, setReviewMarks] = useState<Record<string, boolean>>({});
  const [showAnswerSheet, setShowAnswerSheet] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const isSubmittingExam = false;

  const getUserDisplayName = () => t('آزمون دانش', 'Knowledge Test');

  const startQuiz = () => {
    const easyPool = questionsBank.filter(q => q.difficulty === 'easy');
    const mediumPool = questionsBank.filter(q => q.difficulty === 'medium');
    const hardPool = questionsBank.filter(q => q.difficulty === 'hard');

    // Select 5 questions with balanced difficulty (1 easy, 2 medium, 2 hard)
    const selectedEasy = shuffleArray(easyPool).slice(0, 1);
    const selectedMedium = shuffleArray(mediumPool).slice(0, 2);
    const selectedHard = shuffleArray(hardPool).slice(0, 2);

    // Combine and shuffle the final 5 questions so they aren't ordered by difficulty
    const combinedQuestions = shuffleArray([
      ...selectedEasy,
      ...selectedMedium,
      ...selectedHard
    ]);

    // Shuffle options for each selected question
    const questionsWithOptionsShuffled = combinedQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setQuestions(questionsWithOptionsShuffled);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setReviewMarks({});
    setShowAnswerSheet(false);
    setTimeLeft(600);
    setQuizState('playing');
  };

  const handleSelectOption = (optionId: string) => {
    const q = questions[currentIndex];
    if (!q) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [q.id]: optionId
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1));
    } else {
      triggerSubmitQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    questions.forEach(q => {
      const selectedOptionId = selectedAnswers[q.id];
      if (!selectedOptionId) {
        unanswered++;
      } else {
        const option = q.options.find(o => o.id === selectedOptionId);
        if (option?.isCorrect) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    // Negative marking: Every 3 wrong answers deduct 1 correct answer (1/3 penalty)
    const netCorrect = correct - (incorrect / 3);
    const percentage = questions.length > 0 ? Math.max(0, Math.round((netCorrect / questions.length) * 100)) : 0;

    return { correct, incorrect, unanswered, percentage };
  };

  const toggleReviewMark = (id: string) => {
    setReviewMarks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const triggerSubmitQuiz = () => {
    if (quizState !== 'playing') return;
    setShowAnswerSheet(false);
    setQuizState('result');
    window.parent?.postMessage({ type: 'game-result', percent: calculateScore().percentage }, '*');
  };

  useEffect(() => {
    if (quizState !== 'playing') return;
    if (timeLeft <= 0) { triggerSubmitQuiz(); return; }
    const id = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [quizState, timeLeft]);

  const langToggle = (
    <div className="flex items-center gap-1 bg-black/35 p-1 rounded-xl border border-white/20 shadow-inner">
      <Languages size={13} className="text-amber-300 ml-1.5 mr-0.5 hidden xs:inline-block shrink-0" />
      {(['fa', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
            lang === l ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-200 hover:text-white hover:bg-white/10'
          }`}
        >
          {l === 'fa' ? 'فارسی' : 'EN'}
        </button>
      ))}
    </div>
  );

  const header = (
    <header className="bg-slate-100 border-b border-slate-200 text-slate-900 py-3 px-4 sm:px-6 shadow-md sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 p-1 rounded-lg shadow-sm">
            <img src="https://parspmi.ir/uploads/1415f666299340028696c2a8f118f236.png" alt="Pars PMI Logo" className="h-8 sm:h-10 object-contain" />
          </div>
          <div className="font-bold text-slate-900 text-sm sm:text-base leading-normal">
            {t('سامانه آزمون مدیریت پروژه پایدار', 'Sustainable Project Management Exam')}
          </div>
        </div>
        {langToggle}
      </div>
    </header>
  );

  if (quizState === 'start') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
        {header}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center border border-slate-100 dark:border-slate-800/50">
            <div className="mb-6 flex justify-center">
              <img src="https://parspmi.ir/uploads/1415f666299340028696c2a8f118f236.png" alt="Pars PMI Logo" className="h-20 object-contain" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-2 text-slate-900 dark:text-white">
              {t('آزمون جامع مدیریت پروژه پایدار', 'Comprehensive Sustainable Project Management Exam')}
            </h1>
            <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold mb-4">
              {t('الگوگیری از چارچوب بین‌المللی IPMA WISE', 'Based on IPMA WISE International Framework')}
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-sm sm:text-base">
              {lang === 'fa'
                ? `این آزمون شامل ${formatNumber(5, lang)} سوال موقعیتی و چالشی با مدت زمان ${formatNumber(10, lang)} دقیقه در ${formatNumber(4, lang)} بعد کلیدی مدل IPMA WISE (کار و اقتصاد، افراد و سرمایه انسانی، جامعه و مسئولیت مدنی، محیط زیست و سیاره) برگزار می‌شود.`
                : `This exam consists of ${formatNumber(5, lang)} situational and challenging questions with a ${formatNumber(10, lang)}-minute time limit across the ${formatNumber(4, lang)} key dimensions of the IPMA WISE model (Work & Economy, Individuals & People, Society & Community, and Environment & Planet).`
              }
            </p>
            <button
              type="button"
              onClick={startQuiz}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-100 cursor-pointer"
            >
              {t('شروع آزمون', 'Start Exam')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizState === 'result') {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
        {header}
        <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 text-center border border-slate-100 dark:border-slate-800/50">
            <h1 className="text-xl sm:text-2xl font-black mb-4 text-slate-900 dark:text-white">{t('کارنامه آزمون', 'Exam Scorecard')}</h1>
            <div className="text-5xl font-black text-blue-600 mb-4">{formatNumber(score.percentage, lang)}٪</div>
            <div className="flex justify-center gap-3 text-xs sm:text-sm font-bold">
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">{t('درست', 'Correct')}: {formatNumber(score.correct, lang)}</span>
              <span className="px-3 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">{t('غلط', 'Incorrect')}: {formatNumber(score.incorrect, lang)}</span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">{t('بدون پاسخ', 'Unanswered')}: {formatNumber(score.unanswered, lang)}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-3">{t('هر ۳ پاسخ غلط، ۱ پاسخ درست را حذف می‌کند.', 'Every 3 wrong answers cancel 1 correct answer.')}</p>
          </div>
          <QuizAnalytics questions={questions} selectedAnswers={selectedAnswers} lang={lang} />
          <div className="space-y-3">
            {questions.map((q, idx) => {
              const chosen = selectedAnswers[q.id];
              const explanationText = lang === 'en' && q.explanationEn ? q.explanationEn : q.explanation;
              return (
                <div key={q.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                  <p className="text-xs sm:text-sm font-bold mb-2">
                    <span className="text-blue-600">{t('سوال', 'Question')} {formatNumber(idx + 1, lang)}: </span>
                    {lang === 'en' && q.textEn ? q.textEn : q.text}
                  </p>
                  <div className="space-y-1">
                    {q.options.map((o, oi) => (
                      <div key={o.id} className={`text-[11px] sm:text-xs px-2 py-1 rounded-lg border ${
                        o.isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold'
                        : chosen === o.id ? 'border-rose-300 bg-rose-50 text-rose-900' : 'border-slate-100 dark:border-slate-800'
                      }`}>
                        {getLetter(oi, lang)}) {lang === 'en' && o.textEn ? o.textEn : o.text}
                      </div>
                    ))}
                  </div>
                  {explanationText && <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{explanationText}</p>}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex] || { id: '', text: '', topic: '', options: [], difficulty: 'easy' as const };
  const selectedOptionId = currentQuestion.id ? selectedAnswers[currentQuestion.id] : undefined;
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const currentQuestionText = lang === 'en' && currentQuestion.textEn ? currentQuestion.textEn : currentQuestion.text;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      {header}
      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-2 sm:p-6 py-2 md:py-4 flex flex-col">
        {/* Timer & Progress Row */}
        <div className="flex justify-between items-center mb-2.5 sm:mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-200">
              {lang === 'fa'
                ? `سوال ${formatNumber(currentIndex + 1, lang)} از ${formatNumber(questions.length, lang)}`
                : `Question ${formatNumber(currentIndex + 1, lang)} of ${formatNumber(questions.length, lang)}`
              }
            </span>
          </div>
          
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-all duration-300 ${
            timeLeft < 300 
              ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse shadow-sm shadow-rose-105' 
              : 'bg-emerald-50 border-emerald-250 text-emerald-800 shadow-sm shadow-emerald-50'
          }`}>
            <Clock size={14} className={timeLeft < 300 ? 'text-rose-600 animate-spin' : 'text-emerald-600'} style={{ animationDuration: '4s' }} />
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              {t('زمان باقی‌مانده:', 'Time Left:')}
            </span>
            <span className={`text-xs sm:text-sm font-extrabold font-mono tracking-wider bg-white dark:bg-slate-900 rounded-lg px-2 py-0.5 border ${
              timeLeft < 300 ? 'border-rose-150 text-rose-700' : 'border-emerald-150 text-emerald-850'
            }`}>
              {formatTime(timeLeft, lang)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 border border-slate-300/30 rounded-full h-2.5 sm:h-3 relative mb-4 sm:mb-6 overflow-hidden shadow-inner flex items-center justify-center">
          <div 
            className={`bg-blue-600 h-full transition-all duration-300 ease-out absolute ${lang === 'fa' ? 'right-0' : 'left-0'} top-0 rounded-full`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className={`rounded-xl sm:rounded-2xl border p-3 sm:p-6 w-full relative flex flex-col gap-2.5 sm:gap-4 transition-all duration-300 ${
          getTopicCardStyle(currentQuestion.topic)
        }`}>
          <div>
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <div className="flex gap-1.5 sm:gap-2">
                <span className={`inline-block px-3 py-1 text-[10px] sm:text-[11px] font-black rounded-md ${getTopicBadgeColor(currentQuestion.topic)}`}>
                  {translateTopic(currentQuestion.topic, lang)}
                </span>
                {currentQuestion.difficulty && (
                  <span className={`inline-block px-3 py-1 text-[10px] sm:text-[11px] font-black rounded-md shadow-sm ${
                    currentQuestion.difficulty === 'easy' 
                      ? 'bg-emerald-500 text-white shadow-emerald-500/15'
                      : currentQuestion.difficulty === 'medium'
                      ? 'bg-amber-500 text-white shadow-amber-500/15'
                      : 'bg-rose-500 text-white shadow-rose-500/15'
                  }`}>
                    {getDifficultyLabel(currentQuestion.difficulty, lang)}
                  </span>
                )}
              </div>
              <label className="flex items-center gap-1 cursor-pointer text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors bg-slate-50 dark:bg-slate-950 border border-slate-205 px-1.5 py-0.5 rounded-md">
                <input 
                  type="checkbox" 
                  checked={!!reviewMarks[currentQuestion.id]}
                  onChange={() => toggleReviewMark(currentQuestion.id)}
                  className="w-3 h-3 rounded border-slate-350 text-amber-500 focus:ring-amber-500 cursor-pointer text-xs"
                />
                <Bookmark className={`${reviewMarks[currentQuestion.id] ? "text-amber-500 fill-amber-500" : "text-slate-450"} w-3 h-3`} />
                {t('بازبینی', 'Review')}
              </label>
            </div>
            <h2 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-2 sm:mb-2.5 leading-normal sm:leading-relaxed flex items-start gap-1.5 sm:gap-2">
              <span className="text-blue-600 shrink-0 select-none font-bold text-[11px] sm:text-xs md:text-sm">
                {lang === 'fa' ? `سوال ${formatNumber(currentIndex + 1, lang)}:` : `Question ${formatNumber(currentIndex + 1, lang)}:`}
              </span>
              <span className={`font-bold ${lang === 'fa' ? 'text-right' : 'text-left'}`}>{currentQuestionText}</span>
            </h2>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            {currentQuestion.options.map((opt, optIdx) => {
              const letter = getLetter(optIdx, lang);
              const optText = lang === 'en' && opt.textEn ? opt.textEn : opt.text;
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full ${lang === 'fa' ? 'text-right' : 'text-left'} py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-lg sm:rounded-xl border-2 transition-all flex items-start gap-2 sm:gap-2.5 group cursor-pointer ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/40 shadow-sm' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 hover:bg-slate-50 dark:bg-slate-950'
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 w-4.5 h-4.5 sm:w-5 sm:h-5 text-[10px] sm:text-[11px] rounded-md sm:rounded-lg flex items-center justify-center font-bold transition-colors ${
                    isSelected ? 'bg-blue-600 text-white shadow-sm font-bold' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}>
                    {letter}
                  </div>
                  <span className={`text-[11px] sm:text-xs leading-normal sm:leading-relaxed pt-0.5 ${isSelected ? 'text-blue-900 font-bold' : 'text-slate-700 dark:text-slate-200 font-medium'}`}>
                    {optText}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-1.5 sm:mt-3 flex flex-col gap-1.5 sm:gap-2.5">
          {/* Main Equal-Sized Navigation Buttons in the Center */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-md mx-auto">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0 || isSubmittingExam}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2.5 px-3 sm:px-4 rounded-md sm:rounded-xl font-semibold text-xs sm:text-base transition-all shadow-sm ${
                currentIndex === 0 || isSubmittingExam
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50 border border-slate-200 dark:border-slate-800/50' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 active:scale-95 cursor-pointer'
              }`}
            >
              {lang === 'fa' ? <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> : <ArrowLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />}
              {t('قبلی', 'Previous')}
            </button>
            
            <button
              type="button"
              disabled={isSubmittingExam}
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2.5 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-md sm:rounded-xl font-semibold text-xs sm:text-base transition-all border border-blue-600 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmittingExam ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{t('در حال ثبت...', 'Submitting...')}</span>
                </>
              ) : (
                <>
                  {currentIndex === questions.length - 1 ? t('ثبت و پایان', 'Submit & Finish') : t('بعدی', 'Next')}
                  {currentIndex !== questions.length - 1 && (
                    lang === 'fa' ? <ArrowLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> : <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  )}
                </>
              )}
            </button>
          </div>

          {/* Secondary Actions: Answer Sheet and End Quiz */}
          <div className="flex items-center justify-between gap-2 w-full border-t border-slate-150 pt-1.5 mt-0.5">
            <button
              type="button"
              onClick={() => setShowAnswerSheet(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold text-[10px] sm:text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors shadow-sm cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5" />
              {t('پاسخنامه', 'Answer Sheet')}
            </button>

            <button
              type="button"
              disabled={isSubmittingExam}
              onClick={triggerSubmitQuiz}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium text-xs sm:text-sm text-red-650 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmittingExam && <Loader2 className="w-3.5 h-3.5 animate-spin text-red-650" />}
              <span>{t('پایان آزمون', 'End Exam')}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Answer Sheet Modal */}
      {showAnswerSheet && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800/50">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Grid className="text-blue-600" />
                  {t('وضعیت پاسخنامه', 'Exam Answer Sheet')}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {t('با کلیک روی هر شماره، به آن سوال منتقل می‌شوید.', 'Click on any number to jump directly to that question.')}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setShowAnswerSheet(false)} 
                className="text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
                aria-label={t('بستن', 'Close')}
              >
                <XCircle size={28} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 gap-3">
                {questions.map((q, idx) => {
                  const isAnswered = !!selectedAnswers[q.id];
                  const isMarked = !!reviewMarks[q.id];
                  
                  let selectedLetter = '';
                  if (isAnswered) {
                    const selectedIdx = q.options.findIndex(o => o.id === selectedAnswers[q.id]);
                    if (selectedIdx !== -1) selectedLetter = getLetter(selectedIdx, lang);
                  }

                  return (
                    <button 
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowAnswerSheet(false);
                      }}
                      className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all group cursor-pointer ${
                        currentIndex === idx ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100 dark:border-slate-800/50 hover:border-blue-300'
                      } ${isAnswered ? 'bg-blue-50 text-blue-800 font-semibold' : 'bg-slate-50 dark:bg-slate-950/50 text-slate-500'}`}
                    >
                      <span className="text-lg mb-1 font-bold">{formatNumber(idx + 1, lang)}</span>
                      <span className={`text-[11px] w-full text-center truncate px-1 font-medium rounded py-0.5 ${isAnswered ? 'bg-white dark:bg-slate-900/60 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>
                        {isAnswered ? (lang === 'fa' ? `گزینه ${selectedLetter}` : `Option ${selectedLetter}`) : t('بدون پاسخ', 'Unanswered')}
                      </span>
                      {isMarked && (
                        <div className={`absolute -top-1.5 ${lang === 'fa' ? '-right-1.5' : '-left-1.5'} text-amber-500 bg-white dark:bg-slate-900 rounded-full shadow-sm`}>
                          <Bookmark size={18} className="fill-amber-500" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm px-4 py-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-2 text-blue-800 font-medium">
                  <div className="w-4 h-4 bg-blue-50 border-2 border-blue-200 rounded"></div>
                  {t('پاسخ داده شده', 'Answered')}
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-4 h-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800/50 rounded"></div>
                  {t('پاسخ داده نشده', 'Unanswered')}
                </div>
                <div className="flex items-center gap-2 text-amber-600 font-medium tracking-wide">
                  <Bookmark size={16} className="fill-amber-500" />
                  {t('نشاندار برای بازبینی', 'Marked for Review')}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950 flex justify-end">
               <button
                 type="button"
                 onClick={() => setShowAnswerSheet(false)}
                 className="px-6 py-2.5 bg-slate-800 text-white hover:bg-slate-900 rounded-xl font-medium transition-colors shadow-sm cursor-pointer"
               >
                 {t('بستن و ادامه آزمون', 'Close & Resume Exam')}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
