import { Question } from './questions';

export const easyQuestions: Question[] = [
  // --- Work & Economy (کار و اقتصاد) ---
  {
    id: 'q_wise_01',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'easy',
    text: 'در مرحله امکان‌سنجی یک پروژه نیروگاهی، مدیر مالی پیشنهاد می‌کند توربین ارزان‌تر با هزینه اولیه (CAPEX) پایین‌تر خریداری شود که مصرف سوخت بالاتر و نرخ فرسودگی سریعتری در چرخه عمر ۲۰ ساله خواهد داشت. بر اساس بُعد «کار و اقتصاد (Work & Economy)» در مدل IPMA WISE، رویکرد صحیح مدیر پروژه چیست؟',
    textEn: 'During the feasibility phase of a power plant project, the CFO recommends purchasing a cheaper turbine with low upfront cost (CAPEX), but higher fuel consumption and faster wear over its 20-year lifecycle. Based on the "Work & Economy" dimension of the IPMA WISE model, what is the project manager\'s appropriate approach?',
    options: [
      {
        id: '1',
        text: 'انجام ارزیابی هزینه چرخه عمر (LCC) و تبیین هزینه‌های بلندمدت تعمیرات، سوخت و اثرات اقتصادی پنهان برای ذی‌نفعان جهت اتخاذ تصمیم پایدار',
        textEn: 'Perform a Life Cycle Costing (LCC) assessment and demonstrate long-term maintenance, fuel costs, and hidden financial impacts to stakeholders for a sustainable decision',
        isCorrect: true
      },
      {
        id: '2',
        text: 'اتکا به تحلیل ارزش فعلی خالص (NPV) اولیه دوره ساخت و پذیرش پیشنهاد مدیر مالی جهت کنترل انحراف بودجه سرمایه‌گذاری مصوب',
        textEn: 'Rely on short-term construction Net Present Value (NPV) and accept the CFO\'s proposal to prevent capital expenditure budget variances',
        isCorrect: false
      },
      {
        id: '3',
        text: 'درج بندهای انتقال ریسک نوسانات هزینه‌های سوخت و تعمیرات به تیم بهره‌برداری در سند تحویل پروژه بدون بازنگری در مدل مالی',
        textEn: 'Include standard risk-transfer clauses shifting operational fuel and maintenance cost spikes to the O&M team without revising the financial model',
        isCorrect: false
      },
      {
        id: '4',
        text: 'پایبندی به شاخص‌های عملکرد هزینه (CPI) فاز ساخت و اولویت دادن به صرفه‌جویی مالی در تدارکات اولیه بر اساس بودجه پایه مصوب',
        textEn: 'Adhere to construction phase Cost Performance Index (CPI) targets, prioritizing upfront procurement savings based on the baseline budget',
        isCorrect: false
      }
    ],
    explanation: 'در مدل IPMA WISE و پایداری اقتصادی، ارزیابی هزینه چرخه عمر (Life Cycle Costing - LCC) اصل محوری است. تمرکز کوتاه‌مدت بر CAPEX بدون لحاظ OPEX و هزینه‌های از رده خارج کردن، نقض صریح پایداری اقتصادی پروژه به شمار می‌رود.',
    explanationEn: 'In the IPMA WISE model and economic sustainability, Life Cycle Costing (LCC) is a core principle. A short-term focus on CAPEX without considering OPEX and decommissioning costs violates sustainable project economics.'
  },
  {
    id: 'q_wise_02',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'easy',
    text: 'تیم پروژه ساختمانی در حال انتخاب مصالح است. یک تامین‌کننده محلی مصالح بازیافتی با گواهینامه معتبر استاندارد و قیمت رقابتی ارائه می‌دهد، اما تامین‌کننده سنتی تخفیف نقدی تجاری پیشنهاد می‌کند. مدیر پروژه با رویکرد پایداری کار و اقتصاد چه تصمیمی باید بگیرد؟',
    textEn: 'A construction project team is procuring materials. A local certified supplier offers recycled materials at competitive prices, while a traditional supplier offers a commercial cash discount. What decision should the project manager make under the Work & Economy sustainability approach?',
    options: [
      {
        id: '1',
        text: 'خرید از تامین‌کننده محلی با مصالح بازیافتی در راستای اصول اقتصاد چرخشی (Circular Economy) و شفافیت مالی',
        textEn: 'Procure from the certified local supplier of recycled materials, adhering to Circular Economy principles and financial transparency',
        isCorrect: true
      },
      {
        id: '2',
        text: 'انتخاب تامین‌کننده سنتی بر اساس استعلام قیمت کمتر و اخذ تضمین‌های کیفی استاندارد برای کاهش ریسک‌های فنی کوتاه‌مدت',
        textEn: 'Select the traditional supplier based on lowest evaluated bid and standard quality warranties to minimize near-term technical risks',
        isCorrect: false
      },
      {
        id: '3',
        text: 'منوط کردن خرید مصالح بازیافتی به اخذ گواهینامه‌های تاییدیه بین‌المللی مضاعف توسط مشاور فنی، و خرید از تامین‌کننده سنتی در این اثنا',
        textEn: 'Condition the recycled purchase on additional international technical certifications, procuring from the traditional supplier in the interim',
        isCorrect: false
      },
      {
        id: '4',
        text: 'تقسیم سفارش خرید به صورت مساوی ۵۰٪ بین هر دو تامین‌کننده جهت کاهش ریسک انحصار تدارکات و حفظ تنوع زنجیره تامین',
        textEn: 'Split the purchase order equally 50/50 between both vendors to hedge supply chain concentration risks and preserve vendor diversity',
        isCorrect: false
      }
    ],
    explanation: 'بُعد Work & Economy در IPMA WISE بر حکمرانی شفاف، شیوه‌های تدارکات پایدار (Sustainable Procurement) و الگوهای اقتصاد چرخشی تاکید دارد که ارزش اقتصادی پاک و بلندمدت می‌آفریند.',
    explanationEn: 'The Work & Economy dimension of IPMA WISE emphasizes transparent governance, Sustainable Procurement, and Circular Economy models that create clean, long-term economic value.'
  },
  {
    id: 'q_wise_03',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'easy',
    text: 'در جلسه تدوین بیانیه منشور پروژه (Project Charter)، اسپانسر اعلام می‌کند تنها معیار موفقیت پروژه اتمام به موقع و زیر بودجه است. طبق مدل IPMA WISE، مدیر پروژه چگونه باید این دیدگاه را تکمیل کند؟',
    textEn: 'During the Project Charter development meeting, the sponsor asserts that the only success criteria are on-time and under-budget completion. According to the IPMA WISE model, how should the project manager complement this view?',
    options: [
      {
        id: '1',
        text: 'پیشنهاد افزودن شاخص‌های تحقق منافع بلندمدت (Benefits Realization)، بهره‌وری منابع و ارزش پایدار ایجاد شده برای کسب‌وکار و جامعه',
        textEn: 'Propose adding long-term Benefits Realization metrics, resource efficiency, and sustainable value created for business and society',
        isCorrect: true
      },
      {
        id: '2',
        text: 'پذیرش معیارهای مثلث سنتی مدیریت پروژه (زمان، هزینه، کیفیت) و تمرکز بر کنترل انحرافات زمان‌بندی و بودجه بر اساس خط بستر',
        textEn: 'Accept traditional Iron Triangle metrics (time, cost, scope) and focus on controlling baseline schedule and budget variances',
        isCorrect: false
      },
      {
        id: '3',
        text: 'درج شاخص‌های رضایت مشتری و مدیریت دانش در منشور پروژه به عنوان تنها معیارهای مکمل بدون تغییر در متدولوژی ارزیابی مالی',
        textEn: 'Include customer satisfaction and knowledge management metrics as sole complementary indicators without altering financial evaluation frameworks',
        isCorrect: false
      },
      {
        id: '4',
        text: 'تعریف ذخیره مدیریتی (Management Reserve) بزرگتر در بودجه جهت مواجهه با تغییرات احتمالی بدون تغییر در تعاریف اصلی موفقیت',
        textEn: 'Define a larger Management Reserve in the baseline budget to absorb potential changes without altering core success criteria definitions',
        isCorrect: false
      }
    ],
    explanation: 'در مدیریت پروژه پایدار بر اساس IPMA، موفقیت فراتر از مثلث آهن (Iron Triangle) سنجیده می‌شود و شامل ارزش تجاری بلندمدت، حفظ سرمایه و تاب‌آوری اقتصادی دارایی در طول زمان است.',
    explanationEn: 'In sustainable project management under IPMA, project success transcends the traditional Iron Triangle, encompassing long-term business value, asset preservation, and sustainable benefits realization.'
  },
  {
    id: 'q_wise_04',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'easy',
    text: 'در حین اجرای پروژه احداث یک خط ریلی، یک ریسک نوسان شدید قیمت انرژی پیش‌بینی می‌شود. کدام اقدام انطباق بیشتری با پایداری اقتصادی مدل WISE دارد؟',
    textEn: 'During the execution of a railway project, a severe energy price volatility risk is forecasted. Which action best aligns with the economic sustainability of the IPMA WISE model?',
    options: [
      {
        id: '1',
        text: 'تحلیل گزینه‌های بهینه‌سازی انرژی و استفاده از پیشرانه‌های هیبریدی یا انرژی‌های تجدیدپذیر برای مصون‌سازی مالی بلندمدت پروژه',
        textEn: 'Analyze energy optimization options and adopt hybrid or renewable propulsion to financially hedge the project over the long term',
        isCorrect: true
      },
      {
        id: '2',
        text: 'درج بند تعدیل قیمت سوخت در قرارداد کارفرما جهت پوشش کامل ریسک و انتقال هزینه‌های احتمالی به بودجه عمومی',
        textEn: 'Include standard fuel price adjustment clauses in the client contract to fully pass through cost risks to the sponsor\'s budget',
        isCorrect: false
      },
      {
        id: '3',
        text: 'استفاده از ابزارهای مشتقه مالی و قراردادهای پیش‌خرید سوخت (Hedging) جهت تثبیت هزینه‌های عملیاتی جاری در سقف بودجه مصوب',
        textEn: 'Utilize financial derivatives and commodity fuel hedging contracts to lock in operational fuel expenditures within approved budget caps',
        isCorrect: false
      },
      {
        id: '4',
        text: 'انتقال کامل ریسک نوسانات بهای سوخت به پیمانکاران فرعی از طریق انعقاد قراردادهای با قیمت مقطوع (Lump-Sum)',
        textEn: 'Transfer fuel price fluctuation risks entirely to subcontractors through fixed-price (Lump-Sum) contract structures',
        isCorrect: false
      }
    ],
    explanation: 'پایداری اقتصادی در IPMA WISE مستلزم مدیریت ریسک‌های سیستماتیک و اتخاذ تدابیر تاب‌آوری زنجیره ارزش نسبت به تکانه‌های بازار از طریق بهره‌وری منابع است.',
    explanationEn: 'Economic sustainability in IPMA WISE demands systematic risk management and building value chain resilience against market shocks via resource efficiency.'
  },

  // --- Individuals & People (افراد و منابع انسانی) ---
  {
    id: 'q_wise_05',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'easy',
    text: 'برای جبران تاخیر دو هفته‌ای در انتشار نرم‌افزار، سرپرست تیم فنی پیشنهاد می‌دهد اعضای تیم به مدت یک ماه هر روز ۱۴ ساعت بدون وقفه کار کنند. طبق بُعد «افراد (Individuals)» در IPMA WISE، واکنش مدیر پروژه چیست؟',
    textEn: 'To recover a two-week software release delay, the tech lead suggests that team members work 14 hours every day for a month without breaks. Under the "Individuals" dimension of IPMA WISE, how should the project manager respond?',
    options: [
      {
        id: '1',
        text: 'رد اضافه کاری فرساینده، بررسی علل ریشه‌ای تاخیر، بازنگری محدوده اولویت‌بندی‌شده و حفظ سلامت و بهداشت روانی تیم',
        textEn: 'Reject exhausting overtime, investigate root causes of delay, re-prioritize backlog scope, and protect team mental and physical health',
        isCorrect: true
      },
      {
        id: '2',
        text: 'تصویب برنامه اضافه کاری داوطلبانه همراه با نرخ جبرانی ۱.۵ برابر پایه و تخصیص پاداش شتاب‌دهی بر اساس میزان پیشرفت هفتگی',
        textEn: 'Approve voluntary overtime with a 1.5x pay multiplier and progress-based bonuses to offset fatigue while recovering schedule',
        isCorrect: false
      },
      {
        id: '3',
        text: 'جذب نیروهای پیمانکاری موقت و برون‌سپاری کارهای ثانویه جهت حفظ ساعات کار در سقف استاندارد قانون کار',
        textEn: 'Augment the team with temporary contractors and outsource non-core tasks to keep working hours within legal caps',
        isCorrect: false
      },
      {
        id: '4',
        text: 'اصلاح خط بستر زمان‌بندی از طریق فشرده‌سازی فعالیت‌ها (Crashing) با افزودن شیفت‌های کاری مکمل تخصصی',
        textEn: 'Compress the schedule baseline via formal project crashing, adding specialized secondary shifts to eliminate the delay',
        isCorrect: false
      }
    ],
    explanation: 'بُعد Individuals در مدل IPMA WISE بر سلامت جسمی و روانی، ایمنی، کار شایسته و پیشگیری از فرسودگی شغلی (Burnout) استوار است. دستاوردهای زمان‌بندی نباید به قیمت آسیب به سرمایه انسانی به دست آیند.',
    explanationEn: 'The Individuals dimension in IPMA WISE is founded on physical and mental well-being, safety, decent work, and burnout prevention. Schedule recovery must not occur at the expense of human capital.'
  },
  {
    id: 'q_wise_06',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'easy',
    text: 'در یک پروژه بین‌المللی سدسازی، پیمانکار فرعی تجهیزات حفاظت فردی (PPE) استاندارد برای کارگران فصلی محلی فراهم نکرده است با این توجیه که آنها کارگران موقت هستند. مدیر پروژه طبق IPMA WISE چه باید بکند؟',
    textEn: 'In an international dam construction project, a subcontractor fails to provide certified PPE for local seasonal workers, arguing that they are only temporary labor. What should the project manager do according to IPMA WISE?',
    options: [
      {
        id: '1',
        text: 'توقف فوری فعالیت‌های پرخطر تا زمان تامین کامل تجهیزات استاندارد و برابر برای تمامی کارکنان بدون استثنا',
        textEn: 'Immediately halt hazardous activities until certified, equal safety equipment is provided to all workers without exception',
        isCorrect: true
      },
      {
        id: '2',
        text: 'الزام پیمانکار به اخذ تعهدنامه مسئولیت ایمنی از کارگران موقت و ادامه فعالیت با رعایت احتیاط‌های عمومی کارگاهی',
        textEn: 'Require the contractor to secure safety liability waivers from temporary staff while proceeding under general site supervision',
        isCorrect: false
      },
      {
        id: '3',
        text: 'تخصیص تجهیزات ایمنی موجود در انبار کارگاه به صورت امانی تا زمان رسیدن محموله سفارش جدید پیمانکار فرعی',
        textEn: 'Loan temporary surplus PPE from the main warehouse inventory until the subcontractor\'s new equipment shipment arrives',
        isCorrect: false
      },
      {
        id: '4',
        text: 'کسر هزینه تجهیزات ایمنی از صورت‌وضعیت آتی پیمانکار و سفارش خرید از طریق واحد تدارکات پروژه بدون توقف کارگاه',
        textEn: 'Deduct PPE procurement costs from upcoming contractor invoices and procure through central purchasing without stopping site work',
        isCorrect: false
      }
    ],
    explanation: 'حقوق بنیادین ایمنی، بهداشت شغلی (HSE) و کرامت انسانی برای همه کارکنان فارغ از وضعیت استخدامی (رسمی، پیمانکاری یا فصلی) اصل غیرقابل مصالحه در بعد Individuals است.',
    explanationEn: 'Fundamental occupational health and safety (HSE) and human dignity apply equally to all workers regardless of contract type (full-time, contract, or seasonal) under the Individuals pillar.'
  },
  {
    id: 'q_wise_07',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'easy',
    text: 'مدیر پروژه متوجه می‌شود که اعضای جدید تیم پروژه مهارت‌های لازم برای رعایت استانداردهای مدیریت پسماند و پروتکل‌های سبز را ندارند. کدام اقدام با بُعد افراد در WISE منطبق است؟',
    textEn: 'The project manager observes that new team members lack necessary skills to comply with green protocols and waste management standards. Which action aligns with the Individuals pillar of WISE?',
    options: [
      {
        id: '1',
        text: 'برگزاری کارگاه‌های ارتقای شایستگی‌های سبز و توانمندسازی مستمر پرسنل همراه با مربی‌گری هدایت‌گر',
        textEn: 'Conduct green competence workshops, continuous empowerment programs, and guided coaching for the team',
        isCorrect: true
      },
      {
        id: '2',
        text: 'تدوین دستورالعمل‌های کتبی و چک‌لیست‌های الزامی استاندارد جهت اجرا توسط پرسنل تحت نظارت سوپروایزر کیفیت',
        textEn: 'Formulate mandatory written SOPs and compliance checklists for new hires to follow under QA supervisor monitoring',
        isCorrect: false
      },
      {
        id: '3',
        text: 'جذب کارشناسان تخصصی زیست‌محیطی خارج از سازمان برای هدایت مستقیم فرآیندهای سبز بدون تغییر در برنامه آموزشی تیم',
        textEn: 'Hire external environmental specialists to manage green workflows directly without altering core team training programs',
        isCorrect: false
      },
      {
        id: '4',
        text: 'ارزیابی صلاحیت پرسنل در پایان دوره آزمایشی ۳ ماهه و تصمیم‌گیری درباره جابه‌جایی شغلی آنها بر اساس عملکرد',
        textEn: 'Evaluate personnel competencies at the end of a 3-month probation period and reassign staff based on observed performance',
        isCorrect: false
      }
    ],
    explanation: 'توسعه شایستگی‌های فردی و یادگیری مادام‌العمر (Continuous Competence Development) در حوزه پایداری از ارکان بنیادین بعد Individuals در IPMA WISE و استاندارد ICB4 است.',
    explanationEn: 'Individual competence development and continuous learning in sustainability are cornerstone principles of the Individuals dimension in IPMA WISE and ICB4.'
  },
  {
    id: 'q_wise_08',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'easy',
    text: 'در ترکیب تیم مدیریت پروژه، تعادل جنسیتی و فرصت‌های برابر برای مشارکت متخصصان جوان و باسابقه نادیده گرفته شده است. این موضوع چه جنبه‌ای از مدل WISE را به چالش می‌کشد؟',
    textEn: 'In the project management team composition, gender diversity and equal opportunities for young and veteran professionals have been ignored. Which aspect of the WISE model is compromised?',
    options: [
      {
        id: '1',
        text: 'بُعد افراد (Individuals): از منظر تنوع، برابری، شمول (DEI) و فرصت‌های عادلانه رشد شغلی',
        textEn: 'The Individuals dimension: from the perspective of Diversity, Equity, Inclusion (DEI) and fair career growth',
        isCorrect: true
      },
      {
        id: '2',
        text: 'بُعد کار و اقتصاد (Work & Economy): صرفاً از منظر تخصیص کارآمد بودجه و بهره‌وری نیروی کار متخصص در ماتریس مسئولیت‌ها',
        textEn: 'The Work & Economy pillar: strictly regarding optimal budget allocation and skilled labor productivity within the RAM matrix',
        isCorrect: false
      },
      {
        id: '3',
        text: 'بُعد حاکمیت سازمانی (Governance): تنها در صورتی که عدم رعایت تنوع برخلاف الزامات قانونی منشور پروژه باشد',
        textEn: 'The Governance dimension: only if non-compliance with diversity breaches explicit legal covenants in the project charter',
        isCorrect: false
      },
      {
        id: '4',
        text: 'بُعد مدیریت ریسک: از نظر احتمال عدم تطابق شایستگی‌های فنی افراد با بسته‌های کاری ارجاع‌شده در WBS',
        textEn: 'The Risk Management dimension: in terms of potential misalignment between technical skills and assigned WBS work packages',
        isCorrect: false
      }
    ],
    explanation: 'تنوع، برابری و شمول (Diversity, Equity & Inclusion) بخشی تفکیک‌ناپذیر از شایستگی‌های رفتاری و بُعد Individuals در مدل IPMA WISE محسوب می‌شود.',
    explanationEn: 'Diversity, Equity, and Inclusion (DEI) are integral behavioral competencies and core components of the Individuals pillar in IPMA WISE.'
  },

  // --- Society & Community (جامعه و مسئولیت اجتماعی) ---
  {
    id: 'q_wise_09',
    topic: 'Society & Community',
    topicEn: 'Society & Community',
    difficulty: 'easy',
    text: 'عملیات خاکبرداری سنگین پروژه در نزدیکی یک منطقه مسکونی باعث شکایت ساکنان از گرد و غبار شدید و ایجاد ترافیک در ساعات تردد مدارس شده است. اقدام پایدار مدیر پروژه چیست؟',
    textEn: 'Heavy excavation operations near a residential neighborhood trigger complaints about dust clouds and traffic congestion during school hours. What is the sustainable action for the project manager?',
    options: [
      {
        id: '1',
        text: 'تعامل فعال با نمایندگان محلی، زمان‌بندی تردد ماشین‌آلات در ساعات غیرپیک و اجرای سیستم‌های آب‌پاشی و مهار غبار',
        textEn: 'Engage proactively with community leaders, reschedule heavy transport to off-peak hours, and deploy water spraying and dust suppression systems',
        isCorrect: true
      },
      {
        id: '2',
        text: 'ارائه مدارک و مجوزهای قانونی کارگاه به شهرداری منطقه و حفظ ساعات کاری مصوب بر اساس توافقات مصوب قبلی',
        textEn: 'Submit formal municipal permits to local authorities and maintain approved working hours based on pre-existing regulatory agreements',
        isCorrect: false
      },
      {
        id: '3',
        text: 'نصب تابلوهای هشداردهنده و دیوارهای حفاظتی در اطراف کارگاه جهت تسریع عملیات خاکبرداری و اتمام سریع‌تر این فاز',
        textEn: 'Erect site warning barriers and perimeter walls to accelerate excavation activities and complete the dusty phase faster',
        isCorrect: false
      },
      {
        id: '4',
        text: 'پرداخت خسارت مالی مستقیم به فرمانداری جهت توسعه فضاهای سبز شهری به عنوان اقدام جبرانی بدون تغییر در الگوی تردد',
        textEn: 'Disburse direct compensatory community funds to local government for green space development without altering transport schedules',
        isCorrect: false
      }
    ],
    explanation: 'بُعد Society در IPMA WISE بر کسب و حفظ «مجوز اجتماعی فعالیت» (Social License to Operate) و احترام به حقوق و آسایش جوامع محلی تاکید دارد.',
    explanationEn: 'The Society pillar in IPMA WISE emphasizes acquiring and sustaining a "Social License to Operate" (SLO) while respecting community well-being and local rights.'
  },
  {
    id: 'q_wise_10',
    topic: 'Society & Community',
    topicEn: 'Society & Community',
    difficulty: 'easy',
    text: 'واحد روابط عمومی پروژه قصد دارد کمپین تبلیغاتی گسترده‌ای درباره "پروژه کاملاً پاک و دوستدار محیط زیست" راه بیندازد، در حالی که هنوز ۷۰ درصد ارزیابی‌های محیط زیستی و فیلتراسیون اجرایی نشده است. مدیر پروژه اخلاق‌مدار چه موضعی می‌گیرد؟',
    textEn: 'The project PR team plans a massive promotional campaign touting a "100% Eco-Friendly Clean Project", while 70% of environmental filtration systems remain uninstalled. What stance should an ethical project manager take?',
    options: [
      {
        id: '1',
        text: 'مخالفت با کمپین و هشدار نسبت به پدیده سبزشویی (Greenwashing)، و الزام به ارائه اطلاعات شفاف و منطبق بر واقعیت پیشرفت',
        textEn: 'Oppose the campaign, warn against Greenwashing, and mandate transparent, factual reporting matching verified progress',
        isCorrect: true
      },
      {
        id: '2',
        text: 'تایید انتشار کمپین تبلیغاتی با اضافه کردن بند «در دست احداث بودن سامانه‌های زیست‌محیطی» در پیوست‌های فنی گزارش',
        textEn: 'Approve the promotional campaign provided a technical footnote clarifies that filtration systems are currently under construction',
        isCorrect: false
      },
      {
        id: '3',
        text: 'پیشنهاد تمرکز تبلیغات بر بخش‌های تکمیل‌شده پروژه و تعویق انعکاس بخش‌های زیست‌محیطی به فاز بهره‌برداری',
        textEn: 'Suggest focusing marketing materials on completed civil engineering milestones and deferring environmental metrics to the O&M phase',
        isCorrect: false
      },
      {
        id: '4',
        text: 'واگذاری تایید نهایی محتوای کمپین به واحد حقوقی و روابط عمومی سازمان جهت اطمینان از عدم مغایرت با قوانین تبلیغاتی',
        textEn: 'Refer final marketing content review to corporate legal and PR departments to ensure compliance with commercial advertising codes',
        isCorrect: false
      }
    ],
    explanation: 'مبارزه با سبزشویی (Greenwashing) و پایبندی به شفافیت، حاکمیت اخلاقی و گزارش‌دهی صادقانه به جامعه از ستون‌های اساسی بعد Society در IPMA WISE است.',
    explanationEn: 'Combatting Greenwashing and upholding transparency, ethical governance, and truthful stakeholder disclosure are fundamental pillars of the Society dimension.'
  },
  {
    id: 'q_wise_11',
    topic: 'Society & Community',
    topicEn: 'Society & Community',
    difficulty: 'easy',
    text: 'در جریان احداث یک کارخانه صنعتی، مشخص می‌شود که مسیر دسترسی عبوری پروژه از مجاورت یک اثر تاریخی و مذهبی بومی می‌گذرد. راهکار همسو با مدل IPMA WISE کدام است؟',
    textEn: 'During construction of an industrial plant, it is discovered that the project access corridor passes right beside a revered indigenous cultural site. Which solution aligns with the IPMA WISE model?',
    options: [
      {
        id: '1',
        text: 'مشاوره با متولیان میراث فرهنگی و ریش‌سفیدان محلی برای طراحی مسیر جایگزین با حفظ احترام به میراث فرهنگی جامعه',
        textEn: 'Consult heritage authorities and community elders to redesign an alternative route, safeguarding cultural identity',
        isCorrect: true
      },
      {
        id: '2',
        text: 'عقب‌نشینی محدود مسیر دسترسی تا حد فواصل ایمن قانونی تعیین‌شده توسط سازمان میراث فرهنگی بدون تغییر کلی در پلان طرح',
        textEn: 'Apply minor corridor set-backs meeting statutory minimum distance requirements set by cultural heritage departments',
        isCorrect: false
      },
      {
        id: '3',
        text: 'انعقاد قرارداد بیمه مسئولیت مدنی مضاعف برای جبران خسارات مالی احتمالی ناشی از لرزش ماشین‌آلات بر بنای تاریخی',
        textEn: 'Secure additional civil liability insurance policies to cover potential financial damages caused by heavy machinery vibration',
        isCorrect: false
      },
      {
        id: '4',
        text: 'اخذ استعلام رسمی از مراجع ذی‌صلاح شهری و تسلیم مسئولیت تعیین حریم به نهادهای دولتی مربوطه بدون تعامل بومی',
        textEn: 'Obtain formal municipal clearances and defer heritage zone management entirely to regulatory agencies without local consultation',
        isCorrect: false
      }
    ],
    explanation: 'حفظ میراث فرهنگی و هویت تاریخی جوامع میزبان (Cultural Heritage Preservation) از حقوق اجتماعی جوامع در مدل IPMA WISE محسوب می‌شود.',
    explanationEn: 'Preserving cultural heritage and historical identities of host communities is a core social responsibility in the IPMA WISE model.'
  },

  // --- Environment & Planet (محیط زیست و بوم‌شناسی) ---
  {
    id: 'q_wise_12',
    topic: 'Environment & Planet',
    topicEn: 'Environment & Planet',
    difficulty: 'easy',
    text: 'در کارگاه پروژه، حجم بالایی از ضایعات چوبی، فلزی و نخاله‌های ساختمانی تولید شده است. نخستین اقدام اصلاحی مدیر پروژه با رویکرد پایداری چیست؟',
    textEn: 'On a project site, large volumes of timber, scrap metal, and construction debris are generated. What is the project manager\'s primary corrective action under sustainability?',
    options: [
      {
        id: '1',
        text: 'استقرار برنامه تفکیک از مبدا، ممنوعیت روش‌های غیراصولی دفع و عقد قرارداد با مراکز مجاز بازیافت و بازکاربرد مواد',
        textEn: 'Enforce source waste segregation, ban unsustainable disposal practices, and partner with certified recycling and reuse centers',
        isCorrect: true
      },
      {
        id: '2',
        text: 'حمل هفتگی کلیه ضایعات به مراکز دفن پسماند شهری (Landfill) توسط پیمانکار تدارکات بر اساس استانداردهای عمومی شهرداری',
        textEn: 'Haul site debris weekly to municipal landfill facilities through licensed waste contractors following standard city guidelines',
        isCorrect: false
      },
      {
        id: '3',
        text: 'استفاده از سیستم‌های فشرده‌سازی و انبارداری موقت در بخش انتهایی سایت پروژه تا زمان اتخاذ تصمیم نهایی در پایان پروژه',
        textEn: 'Utilize waste compactors and set up temporary site containment areas until final disposal decisions are made at closeout',
        isCorrect: false
      },
      {
        id: '4',
        text: 'واگذاری کامل مسئولیت مدیریت پسماند به پیمانکاران فرعی در قالب بندهای عمومی قرارداد بدون ممیزی نحوه دفع',
        textEn: 'Delegate waste management liability entirely to sub-contractors through general contract clauses without auditing disposal methods',
        isCorrect: false
      }
    ],
    explanation: 'سوزاندن یا دفن غیراصولی پسماندها نقض مستقیم استانداردهای زیست‌محیطی و بعد Environment در IPMA WISE است. مدیریت پسماند بر پایه کاهش، بازکاربرد و بازیافت (3R) اصل ابتدایی پایداری است.',
    explanationEn: 'Open burning or dumping waste breaches core environmental standards. Waste stewardship grounded in the 3Rs (Reduce, Reuse, Recycle) is elemental to the Environment dimension.'
  },
  {
    id: 'q_wise_13',
    topic: 'Environment & Planet',
    topicEn: 'Environment & Planet',
    difficulty: 'easy',
    text: 'تیم طراحی پروژه ساختمانی بین دو سامانه روشنایی تردید دارد: لامپ‌های کم‌مصرف فلورسنت استاندارد و سیستم‌های هوشمند LED با حسگر نور طبیعی و مصرف ۷۰ درصد کمتر. بر اساس پایداری سیاره، انتخاب چیست؟',
    textEn: 'A design team debates between two lighting options: standard compact fluorescent lamps and smart LED fixtures with daylight sensors using 70% less energy. What is the choice based on planetary sustainability?',
    options: [
      {
        id: '1',
        text: 'انتخاب سیستم‌های هوشمند LED به دلیل کاهش چشمگیر انتشار گازهای گلخانه‌ای و صرفه‌جویی در مصرف برق در طول عمر محصول',
        textEn: 'Select smart LED systems due to substantial greenhouse gas emission reductions and lifetime electrical energy savings',
        isCorrect: true
      },
      {
        id: '2',
        text: 'انتخاب لامپ‌های فلورسنت استاندارد به عنوان راهکار میانه با هزینه خرید اولیه كمتر و هزینه‌های نگهداری پیش‌بینی‌پذیر',
        textEn: 'Select standard fluorescent lamps as a balanced option offering lower upfront acquisition cost and predictable maintenance',
        isCorrect: false
      },
      {
        id: '3',
        text: 'انتخاب تجهیزات LED ساده بدون حسگرهای هوشمند جهت کاهش هزینه‌های اولیه و پیچیدگی‌های فنی سامانه‌های اتوماسیون',
        textEn: 'Choose basic LED fixtures without smart sensors to lower initial capital expenditure and technical automation complexity',
        isCorrect: false
      },
      {
        id: '4',
        text: 'نصب سیستم‌های روشنایی پایه و واگذاری ارتقا به سامانه‌های هوشمند به خریداران نهایی در فاز بهره‌برداری',
        textEn: 'Install baseline lighting infrastructure and defer smart automation upgrades to end-users during occupancy',
        isCorrect: false
      }
    ],
    explanation: 'بهره‌وری انرژی و کاهش ردپای کربن (Carbon Footprint) رکن محوری بُعد Environment در مدل WISE است که به حفاظت از منابع اقلیمی کمک می‌کند.',
    explanationEn: 'Energy efficiency and carbon footprint reduction are central to the Environment dimension of the WISE model, protecting climate resources over the product life cycle.'
  },
  {
    id: 'q_wise_14',
    topic: 'Environment & Planet',
    topicEn: 'Environment & Planet',
    difficulty: 'easy',
    text: 'پروژه لوله‌گذاری گاز از یک زیستگاه حفاظت‌شده پرندگان مهاجر عبور می‌کند. ارزیابی اثرات زیست‌محیطی (EIA) نشان می‌دهد عملیات در فصل بهار زادآوری پرندگان را مختل می‌کند. اقدام پایدار چیست؟',
    textEn: 'A pipeline project crosses a protected migratory bird sanctuary. The Environmental Impact Assessment (EIA) indicates that spring construction disrupts bird breeding. What is the sustainable course of action?',
    options: [
      {
        id: '1',
        text: 'تعدیل زمان‌بندی پروژه و اجرای عملیات در خارج از فصل حساس آشیانه‌گزینی و زادآوری گونه‌های بومی',
        textEn: 'Adjust the project schedule to carry out corridor work outside the sensitive nesting and breeding season',
        isCorrect: true
      },
      {
        id: '2',
        text: 'استفاده از دیوارهای صوتی موقت و تجهیزات با صدای خفه‌شده جهت ادامه عملیات در فصل بهار طبق زمان‌بندی مصوب',
        textEn: 'Deploy temporary acoustic barrier panels and muffled machinery to proceed during spring within approved baseline schedules',
        isCorrect: false
      },
      {
        id: '3',
        text: 'جابه‌جایی موقت آشیانه پرندگان با هماهنگی محیط‌بانان محلی و ادامه کار با کنترل سرعت ماشین‌آلات کارگاهی',
        textEn: 'Relocate nesting zones temporarily in coordination with local rangers while regulating site transport speeds',
        isCorrect: false
      },
      {
        id: '4',
        text: 'تخصیص بودجه جبرانی زیست‌محیطی به اداره حفاظت محیط زیست منطقه برای احیای زیستگاه‌های جایگزین',
        textEn: 'Allocate environmental offset funds to regional conservation agencies to rehabilitate alternative habitats elsewhere',
        isCorrect: false
      }
    ],
    explanation: 'حفاظت از تنوع زیستی (Biodiversity Protection) و سازگاری برنامه‌های اجرایی با چرخه‌های طبیعی اکوسیستم‌ها از اصول اساسی بُعد Environment در IPMA WISE است.',
    explanationEn: 'Biodiversity preservation and synchronizing construction windows with ecosystem natural cycles are fundamental principles under the Environment pillar.'
  },
  {
    id: 'q_wise_15',
    topic: 'Environment & Planet',
    topicEn: 'Environment & Planet',
    difficulty: 'easy',
    text: 'کدام‌یک از شاخص‌های زیر نشان‌دهنده تعهد عملی یک پروژه فناورانه به کاهش ردپای کربن (Scope 2) بر اساس مدل IPMA WISE است؟',
    textEn: 'Which of the following indicators demonstrates a tech project\'s tangible commitment to reducing Scope 2 carbon footprint under the IPMA WISE model?',
    options: [
      {
        id: '1',
        text: 'تامین برق سرورها و دفاتر پروژه از طریق قرارداد خرید انرژی‌های تجدیدپذیر (خورشیدی/بادی) به جای سوخت‌های فسیلی',
        textEn: 'Powering project servers and facilities through Power Purchase Agreements (PPAs) for renewable solar/wind energy rather than fossil fuels',
        isCorrect: true
      },
      {
        id: '2',
        text: 'استفاده از دیزل ژنراتورهای کم‌مصرف جدید با گواهی یورو ۶ جهت تامین برق کارگاه در ساعات اوج مصرف شبکه',
        textEn: 'Utilizing modern low-emission Euro-6 diesel generators to power site facilities during peak grid tariff hours',
        isCorrect: false
      },
      {
        id: '3',
        text: 'بهینه‌سازی سیستم‌های سرمایشی موجود از طریق تنظیم هوشمند ترموستات‌ها بدون تغییر در منبع تامین برق شبکه',
        textEn: 'Optimizing existing HVAC cooling efficiency through smart thermostat scheduling without altering grid electricity sources',
        isCorrect: false
      },
      {
        id: '4',
        text: 'خرید گواهی‌های آفست کربن (Carbon Offset Credits) از بازار بورس برای جبران انتشار ناشی از برق شبکه سنتی',
        textEn: 'Purchasing unbundled Carbon Offset Credits on voluntary markets to offset indirect emissions from conventional grid electricity',
        isCorrect: false
      }
    ],
    explanation: 'انتشار کربن محدوده ۲ (Scope 2) ناشی از برق و انرژی مصرفی خریداری شده در پروژه است. تامین انرژی از منابع تجدیدپذیر گام عملیاتی کلیدی در بعد Environment است.',
    explanationEn: 'Scope 2 emissions stem from purchased electricity and utilities. Sourcing renewable energy represents a key operational milestone in the Environment pillar.'
  }
];
