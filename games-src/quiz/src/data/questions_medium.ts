import { Question } from './questions';

export const mediumQuestions: Question[] = [
  // --- Work & Economy (کار و اقتصاد) ---
  {
    id: 'q_wise_16',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'medium',
    text: 'در تحلیل اقتصادی یک طرح تصفیه‌خانه صنعتی، مشاور سنتی ادعا می‌کند سرمایه‌گذاری برای بازچرخانی ۱۰۰٪ آب و بازیابی لجن بیولوژیک، دوره بازگشت سرمایه (Payback Period) را ۲ سال طولانی‌تر می‌کند و باید لغو شود. مدیر پروژه چگونه باید این ادعا را بر مبنای بُعد Work & Economy مدل WISE به چالش بکشد؟',
    textEn: 'In an industrial wastewater treatment plant\'s financial analysis, a consultant claims that investing in 100% water recycling and biological sludge recovery extends the Payback Period by 2 years and should be cancelled. How should the project manager challenge this claim based on the Work & Economy pillar of WISE?',
    options: [
      {
        id: '1',
        text: 'با محاسبه بازگشت پایدار سرمایه (S-ROI)، ریسک جریمه‌های آتی کمبود آب، ارزش بازار پسماندهای بازیافتی و کاهش مالیات‌های کربن در طول چرخه عمر',
        textEn: 'By calculating Sustainable Return on Investment (S-ROI), future water scarcity penalty risks, commercial value of recovered byproducts, and lifetime carbon tax savings',
        isCorrect: true
      },
      {
        id: '2',
        text: 'با اتکا بر تحلیل ارزش فعلی خالص (NPV) با نرخ تنزیل استاندارد ۸٪ و پذیرش دوره بازگشت سرمایه به عنوان شاخص مبنای تصمیم‌گیری مالی',
        textEn: 'By relying on standard Net Present Value (NPV) modeling at a 8% discount rate, accepting payback period as the core financial hurdle metric',
        isCorrect: false
      },
      {
        id: '3',
        text: 'با پیشنهاد اجرای فازبندی‌شده بازچرخانی آب به شکلی که ۵0٪ ظرفیت در فاز اول احداث شده و مابقی منوط به سودآوری دوره بهره‌برداری گردد',
        textEn: 'By proposing a phased water recovery rollout where 50% capacity is built in Phase 1 and the remainder conditioned on operational profitability',
        isCorrect: false
      },
      {
        id: '4',
        text: 'با انتقال هزینه احداث واحد بازچرخانی به عنوان پروژه توسعه مجزا در فازهای آتی شرکت بهره‌بردار جهت حفظ بودجه اولیه پروژه',
        textEn: 'By shifting the water recovery unit costs into a separate future expansion project on the client\'s balance sheet to protect initial baseline budgets',
        isCorrect: false
      }
    ],
    explanation: 'در مدل IPMA WISE، ارزیابی اقتصادی فراتر از دوره‌های بازگشت سنتی کوتاه‌مدت است و بازگشت پایدار سرمایه (Social/Sustainable Return on Investment - S-ROI)، ریسک‌های قانون‌گذاری آتی، بازیافت منابع و ایجاد جریان‌های درآمدی چرخشی را شامل می‌شود.',
    explanationEn: 'In IPMA WISE, economic viability moves beyond short-term payback to Sustainable Return on Investment (S-ROI), regulatory risk mitigation, resource recovery, and circular cash flows.'
  },
  {
    id: 'q_wise_17',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'medium',
    text: 'یک پروژه توسعه نرم‌افزار لجستیک در حال انتخاب سرورها و مراکز داده است. انتخاب زیرساخت ابری کربن‌خنثی (Carbon-Neutral Cloud) هزینه اشتراک ماهانه را ۸٪ افزایش می‌دهد، اما مشتریان بین‌المللی پروژه شرط همکاری را داشتن رتبه پایداری ESG گذاشته‌اند. رویکرد صحیح اقتصادی چیست؟',
    textEn: 'A logistics software project is selecting data centers. Choosing carbon-neutral cloud infrastructure increases monthly subscription costs by 8%, but key international clients mandate proven ESG sustainability ratings. What is the sound economic strategy?',
    options: [
      {
        id: '1',
        text: 'انتخاب زیرساخت کربن‌خنثی با توجیه اقتصادی دسترسی به بازارهای جهانی، حفظ ارزش برند و ایجاد مزیت رقابتی پایدار بلندمدت',
        textEn: 'Adopt carbon-neutral cloud, justified by securing global market access, preserving brand equity, and building long-term competitive sustainability advantage',
        isCorrect: true
      },
      {
        id: '2',
        text: 'انتخاب زیرساخت ابری استاندارد با هزینه کمتر و خریداری کارت‌های آفست کربن جانبی برای تامین حداقل الزامات گواهینامه‌ها',
        textEn: 'Select lower-cost conventional cloud hosting and purchase ancillary unbundled offset certificates to meet minimum compliance thresholds',
        isCorrect: false
      },
      {
        id: '3',
        text: 'مذاکره با مشتریان بین‌المللی جهت پذیرش مهلت ۱۲ ماهه برای ارتقا به سرورهای کربن‌خنثی پس از رسیدن پروژه به نقطه‌سربه‌سر مالی',
        textEn: 'Negotiate a 12-month grace period with international clients to upgrade to green servers after the project hits its financial break-even point',
        isCorrect: false
      },
      {
        id: '4',
        text: 'بهینه‌سازی کدهای نرم‌افزار جهت کاهش مصرف پردازشی سرورهای سنتی و جبران عدم استفاده از زیرساخت ابری کربن‌خنثی',
        textEn: 'Optimize software code efficiency to minimize compute load on conventional servers, offsetting the decision not to deploy carbon-neutral cloud',
        isCorrect: false
      }
    ],
    explanation: 'سرمایه‌گذاری در فناوری‌های پایدار، ریسک‌های از دست دادن سهم بازار را از بین می‌برد و ارزش تجاری نامشهود (Intangible Business Value) و تاب‌آوری سازمان را تقویت می‌کند.',
    explanationEn: 'Investing in verified green tech eliminates market exclusion risks and strengthens intangible business value and corporate resilience under the Work & Economy pillar.'
  },
  {
    id: 'q_wise_18',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'medium',
    text: 'در یک پروژه عمرانی زیرساختی، پیمانکار اصلی برای برنده شدن در مناقصه، قیمتی به شدت غیرواقعی و پایین ارائه داده است. پس از شروع پروژه، پیمانکار ادعا می‌کند برای جبران کسری بودجه مجبور است از استاندارد کارهای خاکی و بتن‌ریزی بکاهد. اقدام مدیر پروژه چیست؟',
    textEn: 'In an infrastructure project, the prime contractor submitted an unrealistically dumped bid to win the tender. During execution, they claim they must cut back on earthwork and concrete standards to offset budget deficits. What should the project manager do?',
    options: [
      {
        id: '1',
        text: 'الزام قاطع به استانداردهای کیفیت و مشخصات فنی، شفاف‌سازی انحرافات مالی و جلوگیری از فدا کردن ارزش دارایی برای تبانی قیمتی',
        textEn: 'Strictly enforce technical specifications, escalate financial non-compliance transparently, and prevent sacrificing asset integrity for predatory bidding',
        isCorrect: true
      },
      {
        id: '2',
        text: 'موافقت با جایگزینی برندهای معادل مصالح با قیمت پایین‌تر و بازنگری در شیوه آزمایش‌های کنترل کیفیت با تایید مشاور پروژه',
        textEn: 'Agree to equivalent material substitutions at lower price points and adjust Quality Control inspection intervals with consultant approval',
        isCorrect: false
      },
      {
        id: '3',
        text: 'تعدیل قیمت قرارداد بر اساس نرخ تورم رسمی بخش عمرانی و اعطای پیش‌پرداخت اضافه جهت جبران کسری نقدینگی پیمانکار',
        textEn: 'Apply contract escalation adjustments based on official industry price indices and release advance payments to ease contractor liquidity',
        isCorrect: false
      },
      {
        id: '4',
        text: 'بازنگری در جدول زمان‌بندی و اعطای تمدید مجاز پیمان بدون جریمه تا پیمانکار بتواند هزینه‌های خود را مدیریت کند',
        textEn: 'Re-baseline project milestone schedules, granting non-penalty time extensions so the contractor can balance cash flow constraints',
        isCorrect: false
      }
    ],
    explanation: 'مدل IPMA WISE بر حکمرانی مالی صحیح و اصالت استانداردهای فنی تاکید دارد. کاهش کیفیت به دلیل تخمین‌های غیراخلاقی اولیه، خیانت به پایداری اقتصادی دارایی در چرخه بهره‌برداری است.',
    explanationEn: 'IPMA WISE mandates ethical financial governance and technical fidelity. Compromising quality due to underbidding destroys life-cycle asset value.'
  },
  {
    id: 'q_wise_19',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'medium',
    text: 'سازمان مادر تصمیم گرفته است برای اولین بار استاندارد خرید سبز (Green Procurement) را در تمام پروژه‌های جاری اعمال کند. مدیر پروژه برای استقرار این سیاست در بسته کاری تدارکات چه اقدامی باید انجام دهد؟',
    textEn: 'The parent enterprise mandates a Green Procurement policy across all active projects. What action must the project manager take to operationalize this policy in procurement work packages?',
    options: [
      {
        id: '1',
        text: 'تلفیق معیارهای زیست‌محیطی، حقوق کار و هزینه‌های چرخه عمر در اسناد مناقصه (RFP) با ضریب وزنی شفاف و قابل ارزیابی',
        textEn: 'Integrate environmental criteria, labor standards, and life cycle costs into RFP tenders with explicit, weighted evaluation scorecards',
        isCorrect: true
      },
      {
        id: '2',
        text: 'درج الزامات عمومی سبز در مقدمه اسناد مناقصه و واگذاری ارزیابی نهایی به پیشنهاد مشاور فنی بدون دستکاری جدول وزن‌دهی مالی',
        textEn: 'Add general sustainability clauses to RFP prefaces while leaving vendor scoring matrices strictly tied to traditional technical/price ratios',
        isCorrect: false
      },
      {
        id: '3',
        text: 'ارزیابی تامین‌کنندگان بر اساس گواهینامه‌های عمومی ISO 14001 و انتخاب ارزان‌ترین پیشنهاد مالی در میان دارندگان گواهینامه',
        textEn: 'Prequalify vendors based on generic ISO 14001 certifications and award contracts purely to the lowest financial bidder among certified firms',
        isCorrect: false
      },
      {
        id: '4',
        text: 'الزام پیمانکار برنده مناقصه به ارائه تعهدنامه کتبی رعایت الزامات سبز سازمان پس از امضای قرارداد سنتی',
        textEn: 'Mandate the winning vendor to sign a post-award environmental compliance pledge following conventional contract execution',
        isCorrect: false
      }
    ],
    explanation: 'تدارکات پایدار زمانی محقق می‌شود که شاخص‌های ESG و هزینه چرخه عمر به صورت شفاف و عینی در ماتریس تصمیم‌گیری و معیارهای انتخاب تامین‌کنندگان (Supplier Selection Criteria) گنجانده شوند.',
    explanationEn: 'Sustainable procurement is accomplished when ESG metrics and total cost of ownership are formally scored within vendor qualification criteria.'
  },
  {
    id: 'q_wise_20',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'medium',
    text: 'در یک پروژه تحول دیجیتال بانکی، پایان‌یافتن زودهنگام پروژه نیازمند دور انداختن ۵۰۰ دستگاه پوز و رایانه کارگاهی قدیمی است که هنوز کارایی دارند. رویکرد همسو با اقتصاد چرخشی در بعد Work & Economy چیست؟',
    textEn: 'In a banking digital transformation project, rollout completion renders 500 older functional POS units and PCs surplus. What is the circular economy approach under the Work & Economy pillar?',
    options: [
      {
        id: '1',
        text: 'تدوین برنامه بازیابی دارایی‌ها: ارتقا (Upcycling)، واگذاری به مدارس مناطق محروم یا بازفروش با بازیافت قطعات الکترونیکی',
        textEn: 'Establish an asset recovery plan: upcycling, certified donation to underserved community schools, or component resale and responsible recycling',
        isCorrect: true
      },
      {
        id: '2',
        text: 'حراج عمومی تجهیزات به بالاترین قیمت پیشنهادی بدون شرط ممیزی نحوه بازیافت قطعات الکترونیکی توسط خریدار',
        textEn: 'Auction equipment to the highest commercial bidder without stipulating e-waste recycling audit conditions on the buyer',
        isCorrect: false
      },
      {
        id: '3',
        text: 'نگهداری تجهیزات در انبار مرکزی سازمان به عنوان ذخیره استراتژیک تا زمان پایان عمر مفید دفتری آنها',
        textEn: 'Store hardware in central corporate warehouses as strategic spare inventory until full financial depreciation is written off',
        isCorrect: false
      },
      {
        id: '4',
        text: 'اسقاط دفتری دارایی‌ها و تحویل آنها به شرکت‌های پیمانکار ضایعات شهری بر اساس ضوابط اموال مازاد دولتی',
        textEn: 'Depreciate asset book values to zero and transfer units to certified municipal scrap handlers under standard surplus property codes',
        isCorrect: false
      }
    ],
    explanation: 'بُعد کار و اقتصاد در پایداری شامل مدیریت خروج از خدمت دارایی‌ها (Decommissioning & Asset Disposition) از طریق مدل‌های چرخشی و مسئولانه است.',
    explanationEn: 'Sustainable Work & Economy encompasses responsible asset disposition and circular decommissioning, turning potential e-waste into social or recovered capital.'
  },

  // --- Individuals & People (افراد و منابع انسانی) ---
  {
    id: 'q_wise_21',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'medium',
    text: 'یکی از کارشناسان کلیدی پروژه به صورت محرمانه گزارش می‌دهد که پیمانکار دست دوم برای تسریع کار، مقررات ایمنی داربست‌بندی را نادیده گرفته و کارگران فاقد کمربند مهار سقوط هستند. سرپرست کارگاه پیمانکار می‌گوید تاخیر در این بخش باعث جریمه دیرکرد می‌شود. تصمیم شما چیست؟',
    textEn: 'A project engineer confidentially reports that a subcontractor is bypassing scaffolding safety rules and working at heights without fall harnesses to speed up completion. The contractor warns that stoppage triggers delay penalties. What is your decision?',
    options: [
      {
        id: '1',
        text: 'حمایت از افشاگر ایمنی، توقف فوری عملیات تا بازرسی و نصب تجهیزات ایمنی تاییدشده، و هشدار کتبی قاطع به پیمانکار',
        textEn: 'Protect the safety whistleblower, halt hazardous work immediately until verified fall protections are installed, and issue a formal safety notice',
        isCorrect: true
      },
      {
        id: '2',
        text: 'ارسال اخطار کتبی ایمنی به پیمانکار و اعطای مهلت ۲۴ ساعته برای رفع نقص بدون توقف فوری عملیات جاری کارگاه',
        textEn: 'Issue a written safety cure notice granting the contractor 24 hours to rectify harnesses without ordering an immediate site stop',
        isCorrect: false
      },
      {
        id: '3',
        text: 'افزایش نظارت تیم HSE کارگاه بر بخش داربست‌بندی و الزام پیمانکار به امضای تعهدنامه مسئولیت حوادث احتمالی',
        textEn: 'Increase HSE inspector presence over the scaffolding zone while requiring the subcontractor to sign an indemnity bond',
        isCorrect: false
      },
      {
        id: '4',
        text: 'درخواست کتبی از سرپرست کارگاه برای توزیع فوری مهاربندهای انبار بین کارگران بدون تعطیلی شیفت کاری',
        textEn: 'Instruct the site superintendent to distribute stored safety harnesses immediately without shutting down the active shift',
        isCorrect: false
      }
    ],
    explanation: 'بر اساس مدل IPMA WISE، جان و ایمنی افراد خط قرمز مطلق است. ایمنی روانی افشاگران تخلفات ایمنی (Whistleblowing Protection) و توقف کارهای پرخطر از الزامات رهبری اخلاقی در بعد Individuals است.',
    explanationEn: 'In IPMA WISE, human safety is an absolute redline. Whistleblower protection and halting unsafe work are non-negotiable ethical duties under the Individuals pillar.'
  },
  {
    id: 'q_wise_22',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'medium',
    text: 'در تیم پروژه انرژی خورشیدی، نشانه‌های واضحی از استرس حاد، کاهش تمرکز و تعارضات شدید کلامی میان کارشناسان مشاهده می‌شود که ناشی از ضرب‌الاجل‌های غیرواقعی مدیریت ارشد است. واکنش پایدار مدیر پروژه چیست؟',
    textEn: 'In a solar energy team, clear symptoms of acute stress, cognitive fatigue, and verbal friction emerge due to unrealistic executive deadlines. What is the sustainable project management response?',
    options: [
      {
        id: '1',
        text: 'ارزیابی بار کاری واقعی، مذاکره شفاف با مدیریت ارشد برای تعدیل زمان‌بندی و پیاده‌سازی مداخلات حمایت از بهداشت روان و تاب‌آوری تیم',
        textEn: 'Assess realistic workload, negotiate transparently with executives for milestone re-baselining, and deploy mental health and resilience support systems',
        isCorrect: true
      },
      {
        id: '2',
        text: 'تنظیم جلسات روزانه مدیریتی جهت بازآرایی اولویت بسته‌های کاری WBS و تخصیص پاداش‌های مالی عملکردی به افراد پرتلاش',
        textEn: 'Institute daily standups to re-prioritize WBS packages and offer targeted performance bonuses to incentivize high-output staff',
        isCorrect: false
      },
      {
        id: '3',
        text: 'برگزاری کارگاه‌های مدیریت زمان و استرس برای اعضای تیم جهت افزایش توان انطباق فردی بدون تغییر در خط بستر زمان‌بندی',
        textEn: 'Conduct stress management and productivity workshops to enhance personal coping skills without modifying project baseline schedules',
        isCorrect: false
      },
      {
        id: '4',
        text: 'جذب نیروهای کمکی پیمانکاری موقت برای پشتیبانی از تیم در بخش‌های ثانویه و کاهش بار کاری اجرایی کارشناسان اصلی',
        textEn: 'Augment the team with contingent staff to assist core engineers with administrative burdens and absorb secondary tasks',
        isCorrect: false
      }
    ],
    explanation: 'پایداری سرمایه انسانی در مدل IPMA WISE شامل سلامت روان (Mental Health)، بار کاری انسانی و ایجاد محیط کار مبتنی بر ایمنی روانی (Psychological Safety) است.',
    explanationEn: 'Human capital sustainability in IPMA WISE encompasses mental health, humane workloads, and psychological safety, avoiding irreversible team burnout.'
  },
  {
    id: 'q_wise_23',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'medium',
    text: 'در ارزیابی تامین‌کنندگان بین‌المللی تجهیزات پروژه، مشخص می‌شود یکی از تولیدکنندگان عمده از کار کودکان و نیروی کار اجباری در معادن استخراج مواد اولیه استفاده می‌کند، اما قیمت آن ۳۰٪ پایین‌تر است. اقدام الزام‌آور مدیر پروژه چیست؟',
    textEn: 'When auditing international suppliers, it is discovered that a tier-1 vendor relies on child labor and forced labor in raw material extraction mines, but offers a 30% discount. What is the mandatory course of action?',
    options: [
      {
        id: '1',
        text: 'رد صلاحیت فوری تامین‌کننده بر اساس نقض کنوانسیون‌های بین‌المللی کار شایسته و حقوق بنیادین بشر در زنجیره تامین',
        textEn: 'Disqualify the supplier immediately based on severe violations of ILO Decent Work conventions and human rights in supply chains',
        isCorrect: true
      },
      {
        id: '2',
        text: 'الزام تامین‌کننده به ارایه طرح اصلاحی ۱۲ ماهه برای حذف کار اجباری و ادامه خرید تجهیزات تحت ممیزی‌های دوره‌ای',
        textEn: 'Require the vendor to submit a 12-month Corrective Action Plan (CAP) for labor compliance while continuing purchases under periodic audits',
        isCorrect: false
      },
      {
        id: '3',
        text: 'خرید از تامین‌کننده مشروط به تخصیص ۵٪ از مبلغ قرارداد به صندوق توسعه اجتماعی بومی در مناطق معدنی مربوطه',
        textEn: 'Procure from the supplier conditioned on allocating 5% of contract proceeds into local community development funds in mining regions',
        isCorrect: false
      },
      {
        id: '4',
        text: 'محدود کردن خرید به بسته‌های کاری غیراساسی و الزام به ارایه گواهینامه‌های ممیزی طرف ثالث توسط سازندگان ارشد',
        textEn: 'Restrict purchases to non-critical scope packages while requiring third-party audit credentials from primary component manufacturers',
        isCorrect: false
      }
    ],
    explanation: 'پایداری انسانی در مدل WISE به زنجیره تامین تسری می‌یابد (Human Rights in Supply Chains). چشم‌پوشی بر کار اجباری یا استثمار نیروی انسانی به بهانه صرفه‌جویی مالی غیرقابل قبول است.',
    explanationEn: 'Human sustainability in IPMA WISE extends throughout global supply tiers. Exploiting forced or child labor for financial savings is entirely unacceptable.'
  },
  {
    id: 'q_wise_24',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'medium',
    text: 'به منظور ارتقای فراگیری و نوآوری در پروژه، مدیر پروژه قصد دارد تیمی چندفرهنگی و با تنوع جنسیتی و سنی تشکیل دهد. برای تضمین عملکرد پایدار این تیم، چه اقدامی حیاتی است؟',
    textEn: 'To foster innovation and inclusion, the project manager builds a diverse cross-cultural, multigenerational, and gender-balanced team. What leadership step is essential to ensure sustainable performance?',
    options: [
      {
        id: '1',
        text: 'تدوین میثاق‌نامه تیمی اخلاقی، ترویج فرهنگ پذیرش نظرات دگراندیش و ایجاد بسترهای مشارکتی برابر برای تصمیم‌گیری',
        textEn: 'Establish an ethical team charter, cultivate psychological safety for dissenting perspectives, and implement equitable participatory decision-making',
        isCorrect: true
      },
      {
        id: '2',
        text: 'استقرار ساختار ساخت‌یافته ماتریسی با شرح وظایف شفاف و تعریف پروتکل‌های ارتباطی یک‌طرفه جهت اجتناب از تعارضات',
        textEn: 'Implement a structured matrix hierarchy with explicit role definitions and top-down communication protocols to minimize interpersonal friction',
        isCorrect: false
      },
      {
        id: '3',
        text: 'دسته‌بندی بسته‌های کاری بر اساس سطح سابقه افراد و تخصیص مسئولیت‌های کلیدی به متخصصان باسابقه جهت اطمینان از کنترل کیفیت',
        textEn: 'Segment work packages by seniority levels, assigning primary lead responsibilities to veteran experts to ensure quality control',
        isCorrect: false
      },
      {
        id: '4',
        text: 'تکیه بر سیستم‌های ارزیابی عملکرد فردی و رقابت سنتی بین اعضا جهت تحریک انگیزش کاری بر اساس KPIهای تخصصی',
        textEn: 'Rely on individual performance appraisal metrics and traditional internal competition to drive output aligned with technical KPIs',
        isCorrect: false
      }
    ],
    explanation: 'رهبری تیم پایدار مستلزم تسهیل شمول (Inclusion)، ایجاد میثاق اخلاقی و توانمندسازی تک‌تک اعضا جهت ابراز شایستگی‌های خود در محیطی محترمانه است.',
    explanationEn: 'Sustainable team leadership entails fostering true inclusion, collaborative team charters, and psychological safety for diverse contributors.'
  },
  {
    id: 'q_wise_25',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'medium',
    text: 'در یک پروژه عمرانی در منطقه بسیار گرمسیر، دمای هوا در تابستان به بالای ۵۰ درجه می‌رسد. پیمانکار برای عدم تاخیر، ساعات کار را در ظهر تغییر نداده است. مدیر پروژه بر اساس اصول HSE و بعد Individuals چه دستوری صادر می‌کند؟',
    textEn: 'In a tropical civil works project, summer temperatures exceed 50°C. To avoid delays, the contractor maintains peak noon shifts. What directive must the project manager issue under HSE and the Individuals pillar?',
    options: [
      {
        id: '1',
        text: 'تغییر ساعات شیفت به صبح زود و ساعات خنک شبانه، تامین سایبان‌ها و ایستگاه‌های آب‌رسانی و استراحت اجباری در ساعات اوج گرما',
        textEn: 'Shift work hours to early dawn and cooler evening shifts, mandate shaded hydration shelters, and institute mandatory halts during peak heat hours',
        isCorrect: true
      },
      {
        id: '2',
        text: 'افزایش فواصل استراحت کوتاه‌مدت ۲۰ دقیقه‌ای در طول شیفت ظهر و پرداخت اضافه کاری تشویقی گرما به کارگران میدان',
        textEn: 'Increase rest breaks to 20 minutes per hour during noon shifts and provide thermal hazard hazard pay adjustments',
        isCorrect: false
      },
      {
        id: '3',
        text: 'تامین کانکس‌های دارای کولر گازی در مجاورت جبهه‌های کاری و الزام کارگران به چرخش شیفتی بین کار و استراحت',
        textEn: 'Provide air-conditioned break trailers on active job sites and mandate rotating 30-minute shifts between outdoor work and cooling centers',
        isCorrect: false
      },
      {
        id: '4',
        text: 'الزام پیمانکار به استخدام نیروهای بومی سازگار با اقلیم منطقه و خرید تجهیزات تهویه فردی جهت ادامه فعالیت',
        textEn: 'Require the vendor to hire climate-acclimated local workers and equip crews with personal cooling vests to maintain baseline schedules',
        isCorrect: false
      }
    ],
    explanation: 'ایمنی شغلی و پیشگیری از آسیب‌های گرمای شدید (Heat Stress) از الزامات صریح بعد Individuals در مدیریت پروژه پایدار است.',
    explanationEn: 'Occupational safety and heat stress prevention represent explicit non-negotiable requirements under the IPMA WISE Individuals pillar.'
  },

  // --- Society & Community (جامعه و مسئولیت اجتماعی) ---
  {
    id: 'q_wise_26',
    topic: 'Society & Community',
    topicEn: 'Society & Community',
    difficulty: 'medium',
    text: 'احداث کارخانه سیمان جدید در منطقه‌ای روستایی باعث نگرانی اهالی درباره آلودگی هوا و افت سفره‌های آب زیرزمینی شده است. مدیر پروژه پایدار از چه ابزاری برای مدیریت تعاملات اجتماعی استفاده می‌کند؟',
    textEn: 'Building a cement plant in a rural area sparks community fears over air pollution and groundwater depletion. Which tool should a sustainable project manager deploy for community engagement?',
    options: [
      {
        id: '1',
        text: 'تشکیل کمیته پایش مشترک محلی، برگزاری جلسات پرسش و پاسخ شفاف، و ارائه آنلاین داده‌های سنسورهای آلایندگی محیط زیست',
        textEn: 'Establish a Joint Community Monitoring Committee, host transparent town halls, and publish live telemetric emission sensor data',
        isCorrect: true
      },
      {
        id: '2',
        text: 'راه‌اندازی سامانه ثبت شکایات الکترونیکی و ارسال پاسخ‌های رسمی حقوقی به درخواست‌های اهالی در مهلت مصوب قانونی',
        textEn: 'Deploy a formal digital grievance portal to process and respond to written community inquiries within statutory turnaround windows',
        isCorrect: false
      },
      {
        id: '3',
        text: 'انتشار کتابچه‌های توجیهی فنی درباره استانداردهای فیلتراسیون کارخانه و توزیع آن در میان بخشداری و اعضای شورای شهر',
        textEn: 'Publish technical compliance brochures explaining electrostatic precipitator standards and distribute them to local government councils',
        isCorrect: false
      },
      {
        id: '4',
        text: 'تخصیص بودجه مسئولیت اجتماعی (CSR) برای احداث درمانگاه بومی جهت جلب رضایت اهالی بدون تغییر در برنامه‌های پایش آب و هوا',
        textEn: 'Fund a local health clinic through CSR grants to build local goodwill without adjusting baseline water extraction and emissions monitoring plans',
        isCorrect: false
      }
    ],
    explanation: 'پایداری اجتماعی متکی بر شفافیت، تعامل دوسویه و کسب «مجوز اجتماعی فعالیت» (Social License to Operate) از طریق مشارکت مستقیم جوامع بومی است.',
    explanationEn: 'Social sustainability relies on transparency, two-way dialogue, and maintaining a Social License to Operate via direct community participation.'
  },
  {
    id: 'q_wise_27',
    topic: 'Society & Community',
    topicEn: 'Society & Community',
    difficulty: 'medium',
    text: 'در فاز طراحی یک سامانه هوش مصنوعی غربالگری پزشکی، مشخص می‌شود داده‌های آموزشی اولیه عمدتاً از یک گروه قومی جمع‌آوری شده و دقت آن برای سایر اقوام کمتر است. اقدام اخلاقی چیست؟',
    textEn: 'In designing a medical diagnostic AI system, training dataset auditing reveals heavy sampling bias toward a single ethnic group, dropping accuracy for other groups. What is the ethical requirement?',
    options: [
      {
        id: '1',
        text: 'توقف انتشار سامانه تا تکمیل داده‌های آموزشی جامع از تمام اقوام، ممیزی الگوریتم و تضمین دقت برابر برای همه اقشار جامعه',
        textEn: 'Halt model rollout until multi-ethnic training dataset augmentation, bias auditing, and equal diagnostic precision are verified',
        isCorrect: true
      },
      {
        id: '2',
        text: 'افزودن بند هشدار کتبی در راهنمای کاربر نرم‌افزار درباره محدودیت‌های قومیتی داده‌ها و ادامه انتشار فازبندی‌شده تجاری',
        textEn: 'Add explicit cautionary disclaimers in the user manual detailing demographic sampling constraints while proceeding with phased commercial release',
        isCorrect: false
      },
      {
        id: '3',
        text: 'محدود کردن دامنه کاربرد نرم‌افزار به مراکز درمانی مناطق شهری خاص و ارتقای الگوریتم در نسخه‌های آتی بر اساس داده‌های عملیاتی',
        textEn: 'Restrict system deployment to specific urban clinics while gathering field operational data to re-train neural weights in future software updates',
        isCorrect: false
      },
      {
        id: '4',
        text: 'استفاده از روش‌های ریاضی وزن‌دهی ترکیبی به داده‌های موجود جهت تعدیل برآوردهای آماری بدون جمع‌آوری نمونه‌های بومی جدید',
        textEn: 'Apply synthetic data weighting and statistical normalization techniques to existing data without collecting new representative field samples',
        isCorrect: false
      }
    ],
    explanation: 'عدالت اجتماعی در فناوری‌های نوین (Algorithmic Justice) مستلزم اجتناب از تبعیض ساختاری و تضمین دسترسی برابر و ایمن برای همه ذی‌نفعان است.',
    explanationEn: 'Social justice in emerging technologies mandates eradicating algorithmic bias and ensuring equitable, non-discriminatory access for all demographic groups.'
  },
  {
    id: 'q_wise_28',
    topic: 'Society & Community',
    topicEn: 'Society & Community',
    difficulty: 'medium',
    text: 'احداث یک بزرگراه جدید باعث دو نیم شدن یک روستای تاریخی و قطعی ارتباط اهالی با مزارع کشاورزی شده است. کدام راهکار با بعد Society مدل WISE منطبق است؟',
    textEn: 'A new highway project bisects a historical village, severing local farmer access to agricultural fields. Which engineering solution aligns with the WISE Society pillar?',
    options: [
      {
        id: '1',
        text: 'احداث پل‌ها و روگذرهای عریض چندمنظوره با گذرگاه‌های ایمن کشاورزی و دامداری با نظرسنجی از اهالی روستا',
        textEn: 'Construct wide multi-use overpasses with dedicated agricultural and livestock corridors designed in consultation with local villagers',
        isCorrect: true
      },
      {
        id: '2',
        text: 'احداث دوربرگردان استاندارد در فاصله ۳ کیلومتری بزرگراه و نصب زیرگذرهای پیاده ساده جهت عبور اهالی',
        textEn: 'Build a standard traffic U-turn 3 km down the highway and install basic pedestrian underpasses for village crossing',
        isCorrect: false
      },
      {
        id: '3',
        text: 'پرداخت غرامت مالی جبرانی به کشاورزان متضرر بابت افزایش مسافت تردد بر اساس ارزیابی رسمی کارشناسان دادگستری',
        textEn: 'Disburse monetary compensation to affected farmers for increased transit distances based on certified judicial appraisal reports',
        isCorrect: false
      },
      {
        id: '4',
        text: 'نصب تابلوهای راهنمایی و چراغ‌های راهنمایی هوشمند در تقاطع‌های هم‌سطح بزرگراه جهت تسهیل تردد ماشین‌آلات کشاورزی',
        textEn: 'Install at-grade signalized intersections and smart traffic lights on the highway to facilitate intermittent farm machinery crossings',
        isCorrect: false
      }
    ],
    explanation: 'پایداری اجتماعی مستلزم حفظ انسجام جوامع بومی (Social Cohesion) و جلوگیری از اختلال در معیشت و سبک زندگی آنان از طریق راهکارهای مهندسی مشارکتی است.',
    explanationEn: 'Social sustainability mandates preserving community cohesion and livelihoods through participatory infrastructure design.'
  },
  {
    id: 'q_wise_29',
    topic: 'Society & Community',
    topicEn: 'Society & Community',
    difficulty: 'medium',
    text: 'در یک پروژه سدسازی در منطقه محروم، پیمانکار قصد دارد تمام نیروی کار متخصص و ساده را از خارج استان وارد کند. مدیر پروژه با رویکرد مسئولیت اجتماعی چه برنامه‌ای ارائه می‌دهد؟',
    textEn: 'In a dam project located in an impoverished district, the contractor intends to import 100% of skilled and unskilled labor from other provinces. What program should a socially responsible project manager institute?',
    options: [
      {
        id: '1',
        text: 'الزام به جذب حداکثری نیروی کار بومی و راه‌اندازی دوره‌های فشرده آموزش مهارت‌های فنی کارگاهی برای ساکنان محلی',
        textEn: 'Mandate local hiring quotas combined with accelerated site technical vocational training programs for resident workers',
        isCorrect: true
      },
      {
        id: '2',
        text: 'الزام پیمانکار به استخدام ۵۰٪ نیروی کار ساده از اهالی بومی و تامین نیروهای متخصص از خارج استان جهت حفظ کیفیت فنی',
        textEn: 'Require the contractor to fill 50% of unskilled general labor roles from local communities while sourcing specialists externally to ensure QA',
        isCorrect: false
      },
      {
        id: '3',
        text: 'تخصیص درصدی از سود پروژه به صندوق‌های خدمات رفاهی و عمرانی روستا برای جبران عدم استخدام نیروهای بومی',
        textEn: 'Allocate a percentage of project profit margins to municipal rural development funds to offset the non-utilization of local labor',
        isCorrect: false
      },
      {
        id: '4',
        text: 'برگزاری مناقصات فرعی خرد برای پیمانکاران محلی در بخش‌های تدارکات و خدمات پشتیبانی کارگاه',
        textEn: 'Carve out small sub-contracting packages exclusively for local vendors in site catering, logistics, and facility management',
        isCorrect: false
      }
    ],
    explanation: 'توسعه ظرفیت‌های محلی (Local Capability Building) و اشتغال‌آفرینی شایسته در منطقه پروژه از ارکان اصلی ایجاد ارزش مشترک اجتماعی در مدل WISE است.',
    explanationEn: 'Local capacity building and decent employment creation are essential pillars of Creating Shared Value under IPMA WISE.'
  },
  {
    id: 'q_wise_30',
    topic: 'Society & Community',
    topicEn: 'Society & Community',
    difficulty: 'medium',
    text: 'در حین خاکبرداری یک پروژه برج‌سازی، شواهد اولیه از وجود آثار باستانی کشف می‌شود. سرپرست کارگاه پیشنهاد می‌کند بدون گزارش موضوع، خاکبرداری ادامه یابد تا پروژه تعطیل نشود. واکنش مدیر پروژه چیست؟',
    textEn: 'During tower foundations excavation, preliminary archaeological artifacts are unearthed. The site superintendent suggests continuing excavation unrecorded to prevent delays. What is the project manager\'s mandate?',
    options: [
      {
        id: '1',
        text: 'توقف فوری عملیات در بخش مربوطه، حصارکشی محدوده، اطلاع‌رسانی رسمی به میراث فرهنگی و همکاری برای کاوش نجات‌بخشی',
        textEn: 'Immediately halt excavation in the zone, secure the perimeter, notify cultural heritage authorities, and facilitate rescue archaeology',
        isCorrect: true
      },
      {
        id: '2',
        text: 'انتقال کشفیات به انبار امانی کارگاه و ارسال نامه رسمی به سازمان میراث فرهنگی جهت اعزام کارشناس ظرف مهلت ۴۸ ساعته',
        textEn: 'Transfer findings to secure site storage and issue a formal letter requesting heritage authority inspection within a 48-hour window',
        isCorrect: false
      },
      {
        id: '3',
        text: 'تغییر جزیی در پلان شمع‌کوب‌های ساختمان جهت دور زدن لایه تاریخی کشف‌شده و ادامه عملیات ساخت بر اساس اصلاحیه نقشه',
        textEn: 'Modify structural piling coordinates slightly to bypass the historical stratum while continuing civil works under revised shop drawings',
        isCorrect: false
      },
      {
        id: '4',
        text: 'استخدام کارشناس مستقل باستان‌شناسی برای تهیه شناسنامه تصویری از آثار قبل از ادامه عملیات خاکبرداری',
        textEn: 'Retain an independent archaeological consultant to document and photograph artifacts prior to resuming planned excavation',
        isCorrect: false
      }
    ],
    explanation: 'حفظ میراث فرهنگی و تاریخی (Cultural Heritage Preservation) تعهدی غیرقابل معامله در برابر جامعه و نسل‌های آینده در بعد Society است.',
    explanationEn: 'Cultural heritage preservation is a non-negotiable societal obligation under the IPMA WISE framework.'
  },

  // --- Environment & Planet (محیط زیست و بوم‌شناسی) ---
  {
    id: 'q_wise_31',
    topic: 'Environment & Planet',
    topicEn: 'Environment & Planet',
    difficulty: 'medium',
    text: 'در یک پروژه معدنی، زهاب اسیدی معادن (AMD) تهدیدی برای آلودگی آب‌های زیرزمینی منطقه است. بهترین راهکار پایدار مهندسی در مدل IPMA WISE کدام است؟',
    textEn: 'In a mining project, Acid Mine Drainage (AMD) threatens regional groundwater tables. What is the optimal sustainable engineering solution under IPMA WISE?',
    options: [
      {
        id: '1',
        text: 'استقرار سامانه‌های تصفیه فعال و غیرفعال تالابی (Wetlands)، خنثی‌سازی شیمیایی و مسدودسازی منبع با پوشش‌های غیرقابل نفوذ',
        textEn: 'Deploy active and passive constructed wetland treatment, chemical neutralization, and impermeable source capping',
        isCorrect: true
      },
      {
        id: '2',
        text: 'احداث حوضچه‌های تبخیر روباز استاندارد در محدوده معدن جهت هدایت زهاب و جلوگیری از ورود مستقیم به رودخانه',
        textEn: 'Construct open evaporation ponds within mining boundaries to contain runoff and prevent direct river discharges',
        isCorrect: false
      },
      {
        id: '3',
        text: 'ترکیب زهاب اسیدی با آب‌های سطحی عبوری جهت رقیق‌سازی غلظت آلاینده‌ها تا سطح استانداردهای مجاز پساب',
        textEn: 'Dilute acid drainage with high-volume surface water streams to reduce heavy metal concentrations to permissible discharge limits',
        isCorrect: false
      },
      {
        id: '4',
        text: 'تزریق پساب اسیدی به طبقات عمیق زمین از طریق چاه‌های جذبی تحت فشار با تایید مراجع محیط زیست',
        textEn: 'Inject acidic wastewater into deep geological formations via pressurized disposal wells under regulatory approvals',
        isCorrect: false
      }
    ],
    explanation: 'مدیریت آلودگی‌های زیست‌محیطی در مبدا و استفاده از راهکارهای مبتنی بر طبیعت (Constructed Wetlands) در کانون پایداری بوم‌شناختی قرار دارد.',
    explanationEn: 'Preventing pollution at the source using Nature-based Solutions (e.g., constructed wetlands) is central to ecological sustainability.'
  },
  {
    id: 'q_wise_32',
    topic: 'Environment & Planet',
    topicEn: 'Environment & Planet',
    difficulty: 'medium',
    text: 'یک کارخانه صنعتی در حال احداث قصد دارد آلاینده‌های خروجی دودکش‌ها را مدیریت کند. کدام رویکرد با اصل پیشگیری در بعد Environment منطبق است؟',
    textEn: 'An industrial plant under construction plans air emissions controls. Which approach aligns with the prevention principle in the Environment pillar?',
    options: [
      {
        id: '1',
        text: 'تغییر فرآیند تولید به فناوری‌های پاک‌تر (Cleaner Production)، نصب بویلرهای کم‌انتشار و سامانه‌های هوشمند پایش آنلاین لحظه‌ای',
        textEn: 'Shift production processes to Cleaner Technology, install low-NOx boilers, and integrate continuous real-time online monitoring',
        isCorrect: true
      },
      {
        id: '2',
        text: 'افزایش ارتفاع دودکش‌های صنعتی جهت توزیع و رقیق‌سازی آلاینده‌ها در طبقات بالایی جو بر اساس ضوابط فنی',
        textEn: 'Increase industrial stack heights to disperse and dilute atmospheric pollutants across higher atmospheric layers per engineering codes',
        isCorrect: false
      },
      {
        id: '3',
        text: 'نصب فیلترهای پارچه‌ای سنتی و انجام نمونه‌برداری‌های آزمایشگاهی دوره‌ای سه ماهه جهت ارائه به سازمان محیط زیست',
        textEn: 'Install conventional baghouse filters and conduct quarterly laboratory grab sampling to satisfy regulatory reporting schedules',
        isCorrect: false
      },
      {
        id: '4',
        text: 'خرید گواهی‌های انتشار آلودگی در بورس و جبران مالی فراتر رفتن از حدود مجاز آلاینده‌ها در فاز بهره‌برداری',
        textEn: 'Purchase tradeable pollution allowances on environmental exchanges to offset projected emissions over statutory thresholds during operation',
        isCorrect: false
      }
    ],
    explanation: 'اصل پیشگیری (Prevention Principle) بر اصلاح فرآیند و اجتناب از تولید آلاینده در مبدا (Cleaner Production) به جای کنترل انتهای خط (End-of-Pipe) تاکید دارد.',
    explanationEn: 'The Prevention Principle prioritizes cleaner process design over end-of-pipe controls or atmospheric dispersion strategies.'
  },
  {
    id: 'q_wise_33',
    topic: 'Environment & Planet',
    topicEn: 'Environment & Planet',
    difficulty: 'medium',
    text: 'در انتخاب مصالح سازه‌ای یک پروژه ساختمانی، تیم مهندسی بین بتن سنتی و بتن سبز پوزولانی با سیمان جایگزین سرباره (۴۰٪ کربن تجسم‌یافته کمتر) مردد است. کدام معیار تصمیم‌گیری منطبق بر IPMA WISE است؟',
    textEn: 'When specifying structural materials, an engineering team debates between standard OPC concrete and green slag-blended pozzolanic concrete (with 40% lower embodied carbon). Which decision criterion aligns with IPMA WISE?',
    options: [
      {
        id: '1',
        text: 'انتخاب بتن سبز با محاسبه کربن تجسم‌یافته (Embodied Carbon) به عنوان شاخص کلیدی تصمیم‌گیری زیست‌محیطی هم‌تراز با مقاومت سازه‌ای',
        textEn: 'Select green pozzolanic concrete, weighting Embodied Carbon as an equal decision metric alongside compressive structural strength',
        isCorrect: true
      },
      {
        id: '2',
        text: 'انتخاب بتن سنتی به دلیل قیمت ارزان‌تر و آشنایی کامل پیمانکاران با زمان‌بندی گیرش و عمل‌آوری آن در کارگاه',
        textEn: 'Select standard concrete due to lower purchase unit cost and contractor familiarity with cure times and field placement workflows',
        isCorrect: false
      },
      {
        id: '3',
        text: 'استفاده از ترکیب ۵۰٪ از هر کدام در مقاطع مختلف سازه جهت تعادل‌بخشی میان هزینه‌های اولیه و الزامات گواهی سبز',
        textEn: 'Specify a 50/50 split across non-critical structural elements to balance upfront material procurement budgets with green rating points',
        isCorrect: false
      },
      {
        id: '4',
        text: 'منوط کردن استفاده از بتن سبز به ارایه تخفیف قیمتی توسط کارخانه تولیدکننده جهت برابری هزینه خرید با بتن سنتی',
        textEn: 'Condition green concrete adoption on supplier price match discounts to equalize raw material invoices with standard mixes',
        isCorrect: false
      }
    ],
    explanation: 'کاهش کربن تجسم‌یافته (Embodied Carbon) در مصالح و محصولات ساختمانی از مهم‌ترین شاخص‌های کاهش اثرات گرمایش جهانی در بعد Environment است.',
    explanationEn: 'Accounting for and reducing Embodied Carbon in building materials is a critical decarbonization mechanism in the Environment pillar.'
  },
  {
    id: 'q_wise_34',
    topic: 'Environment & Planet',
    topicEn: 'Environment & Planet',
    difficulty: 'medium',
    text: 'در طول اجرای یک پروژه پایدار در منطقه‌ای خشک، شستشوی تجهیزات سنگین بتنی منجر به هدررفت روزانه ۲۰ هزار لیتر آب شرب شهری می‌شود. راهکار پایدار چیست؟',
    textEn: 'During construction in an arid region, transit mixer washing wastes 20,000 liters of treated municipal drinking water daily. What is the sustainable engineering solution?',
    options: [
      {
        id: '1',
        text: 'استقرار سامانه بازچرخانی بسته شستشو، حوضچه‌های ته‌نشینی لجن و استفاده مجدد از آب بازیافتی در فرآیندهای غیرشرب کارگاه',
        textEn: 'Install a closed-loop washout recycling system, settling basins, and recirculate reclaimed water into dust suppression and curing',
        isCorrect: true
      },
      {
        id: '2',
        text: 'خرید آب غیرشرب تانکری از بخش خصوصی جهت جایگزینی با آب شرب شهری و کاهش قبوض مصرفی کارگاه',
        textEn: 'Procure non-potable trucked industrial water from private suppliers to replace municipal drinking grid connections and lower utility bills',
        isCorrect: false
      },
      {
        id: '3',
        text: 'محدود کردن شستشوی تراک میکسرها به یک بار در پایان روز کاری جهت کاهش ۵۰ درصدی مصرف آب کارگاه',
        textEn: 'Restrict mixer drum washouts to a single end-of-day cycle to reduce overall site water consumption by 50%',
        isCorrect: false
      },
      {
        id: '4',
        text: 'احداث حوضچه‌های خنثی‌سازی اسیدی و تخلیه آب شستشو به چاه‌های جذبی کارگاه طبق ضوابط فنی استاندارد',
        textEn: 'Construct chemical neutralization pits and discharge treated washout water into site drainage sumps per general civil codes',
        isCorrect: false
      }
    ],
    explanation: 'مدیریت پایدار آب (Water Stewardship) و حرکت به سوی تخلیه صفر مایعات آلاینده (Zero Liquid Discharge) در کانون بُعد Environment مدل WISE قرار دارد.',
    explanationEn: 'Water stewardship and striving toward Zero Liquid Discharge (ZLD) closed-loop recycling are paramount in the Environment dimension of IPMA WISE.'
  },
  {
    id: 'q_wise_35',
    topic: 'Environment & Planet',
    topicEn: 'Environment & Planet',
    difficulty: 'medium',
    text: 'پروژه احداث یک برج مسکونی در حال تدوین شناسنامه پایان کار است. برای حصول اطمینان از بهینه‌سازی مصرف انرژی در فاز بهره‌برداری بلندمدت، اجرای کدام فرآیند پایدار در خاتمه پروژه ضروری است؟',
    textEn: 'A high-rise residential project is approaching completion. To ensure sustained energy optimization throughout the long-term occupancy lifecycle, which sustainable closeout protocol is essential?',
    options: [
      {
        id: '1',
        text: 'راه‌اندازی و آزمون جامع سیستم‌های انرژی (Building Commissioning) و تحویل دفترچه راهنمای بهره‌برداری پایدار به کاربران',
        textEn: 'Execute Whole-Building Commissioning (Cx), calibrate HVAC/energy automation systems, and handover Sustainable Facility Operating Manuals',
        isCorrect: true
      },
      {
        id: '2',
        text: 'اخذ گواهی‌نامه‌های فنی استاندارد تاسیسات و اعطای گارانتی ۲ ساله کیفیت تجهیزات مکانیکی و الکتریکی به خریداران',
        textEn: 'Obtain standard MEP statutory compliance certificates and issue a 2-year mechanical/electrical equipment warranty to buyers',
        isCorrect: false
      },
      {
        id: '3',
        text: 'تنظیم سیستم‌های حرارتی و برودتی روی حالت اقتصادی پایه و آموزش اولیه نگه‌داران تاسیسات برج در زمان تحویل',
        textEn: 'Set HVAC chillers and boilers to eco-mode baselines and deliver basic operational training to facility maintenance personnel at handover',
        isCorrect: false
      },
      {
        id: '4',
        text: 'انجام تست‌های ممیزی مصرف انرژی در دوره ۶ ماهه پس از تحویل و ارائه گزارش توصیه‌ای به هیئت مدیره برج',
        textEn: 'Conduct energy consumption audits 6 months post-handover and issue an advisory report to the building management board',
        isCorrect: false
      }
    ],
    explanation: 'فرآیند Commissioning تضمین می‌کند سامانه‌های مصرف انرژی مطابق مشخصات طراحی پایدار عمل کرده و از اتلاف شدید انرژی در دوره بهره‌برداری جلوگیری شود.',
    explanationEn: 'Building Commissioning (Cx) verifies that mechanical and energy systems operate to peak design efficiency, preventing operational energy waste.'
  }
];
