import { Question } from './questions';

export const hardQuestions: Question[] = [
  // --- Work & Economy (کار و اقتصاد) ---
  {
    id: 'q_wise_36',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'hard',
    text: 'در میانه فاز اجرای یک پروژه نیروگاهی تجدیدپذیر، بحران ژئوپلیتیک باعث افزایش ۳۵ درصدی بهای اینورترهای دارای گواهی بازیافت و استاندارد بالای اتحادیه اروپا شده است. پیمانکار EPC پیشنهاد می‌کند اینورترهای تجاری متداول از کشوری با شفافیت کمتر زنجیره ارزش و راندمان ۱.۵٪ کمتر خریداری شود تا شاخص SPI و CPI پروژه حفظ گردد. با رویکرد سیستمی IPMA WISE، جامع‌ترین اقدام مدیر پروژه چیست؟',
    textEn: 'Midway through a utility-scale renewable energy project, geopolitical turmoil causes a 35% price hike in certified high-efficiency, recyclable inverters. The EPC contractor suggests purchasing conventional inverters from a less transparent supply chain with 1.5% lower efficiency to preserve project SPI and CPI. Under the IPMA WISE systems approach, what is the most comprehensive response?',
    options: [
      {
        id: '1',
        text: 'تحلیل جامع هزینه چرخه عمر (LCC) با احتساب افت راندمان ۲۰ ساله و عوارض کربن، بازنگری قرارداد با کارفرما بر مبنای تقسیم ریسک تغییرات کلان بازار، و پایبندی به کیفیت پایدار دارایی',
        textEn: 'Perform a comprehensive Life Cycle Costing (LCC) including 20-year power degradation and carbon tariffs, negotiate macroeconomic risk-sharing with the client, and preserve long-term asset value',
        isCorrect: true
      },
      {
        id: '2',
        text: 'پذیرش پیشنهاد پیمانکار EPC مبنی بر تغییر برند اینورترها مشروط به دریافت ضمانت‌نامه عملکردی ۵ ساله اضافی و ثبت انحراف کیفیت در ماتریس ریسک',
        textEn: 'Approve the EPC contractor\'s vendor switch conditioned on obtaining a 5-year extended performance warranty bond and logging quality variance in the risk register',
        isCorrect: false
      },
      {
        id: '3',
        text: 'استفاده از ذخیره مدیریتی (Management Reserve) پروژه برای پوشش ۳۵٪ مابه‌التفاوت قیمت و حفظ خط بستر زمان‌بندی بدون بازنگری در مدل مالی چرخه عمر',
        textEn: 'Draw upon Management Reserves to absorb the 35% price spike, keeping baseline schedule intact without re-evaluating long-term lifecycle economics',
        isCorrect: false
      },
      {
        id: '4',
        text: 'فازبندی خرید اینورترها به شکلی که ۵۰٪ نیاز اولیه خریداری شده و خرید مابقی به امید کاهش قیمت‌های جهانی بازار ارزی تعویق افتد',
        textEn: 'Phase inverter procurement by purchasing 50% immediately and deferring the remainder in anticipation of favorable forex market corrections',
        isCorrect: false
      }
    ],
    explanation: 'در مدل IPMA WISE، افت راندمان انرژی و ردپای کربن نامشخص زنجیره تامین طی چرخه ۲۰ ساله، خسارت اقتصادی به مراتب سنگین‌تری از اضافه هزینه اولیه وارد می‌کند. راهکار پایدار، تحلیل LCC، مذاکره شفاف ذی‌نفعان و حفظ ارزش بلندمدت است.',
    explanationEn: 'In IPMA WISE, efficiency degradation and opaque supply chains over a 20-year horizon inflict far heavier economic losses than initial cost premiums. Sound LCC and equitable risk-sharing protect true lifecycle value.'
  },
  {
    id: 'q_wise_37',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'hard',
    text: 'هیئت مدیره سازمان قصد دارد پروژه‌ای برای استخراج لیتیوم آغاز کند. مدل‌های مالی سنتی نرخ بازده داخلی (IRR) را ۲۸٪ نشان می‌دهند، اما ارزیابی ریسک‌های اقلیمی نشان می‌دهد که در صورت خشکسالی شدید، مصرف بالای آب فرآیند باعث توقف تولید و جریمه‌های زیست‌محیطی سنگین خواهد شد. مدیر پروژه بر اساس چه ابزاری باید ابعاد مالی را بازتعریف کند؟',
    textEn: 'An executive board plans a lithium brine extraction venture. Standard financial models project a 28% IRR, but climate risk modeling indicates that under severe drought scenarios, extreme water consumption will trigger plant shutdowns and statutory environmental fines. Which analytical tool should the project manager deploy to re-evaluate financial viability?',
    options: [
      {
        id: '1',
        text: 'تحلیل سناریوهای تنش اقلیمی و قیمت‌گذاری درونی کربن و آب (Internal Carbon/Water Pricing) جهت سنجش تاب‌آوری اقتصادی پروژه در برابر تکانه‌های زیست‌محیطی',
        textEn: 'Climate stress-testing and Internal Carbon/Water Shadow Pricing to stress-test project financial resilience against environmental disruptions and stranded asset risks',
        isCorrect: true
      },
      {
        id: '2',
        text: 'تحلیل حساسیت مالی مونت‌کارلو با متغیرهای سنتی هزینه سرمایه‌ای (CAPEX) و قیمت جهانی لیتیوم بدون دستکاری نرخ‌های تنزیل آب',
        textEn: 'Execute Monte Carlo financial sensitivity analysis varying traditional CAPEX and global lithium prices without adjusting shadow water discount rates',
        isCorrect: false
      },
      {
        id: '3',
        text: 'خرید بیمه‌نامه‌های عدم نفع ناشی از خشکسالی و تخصیص بودجه پیش‌بینی‌نشده برای جبران جریمه‌های زیست‌محیطی احتمالی در مدل cash flow',
        textEn: 'Procure drought business interruption insurance policies and build contingent liabilities into cash flow projections to absorb environmental fines',
        isCorrect: false
      },
      {
        id: '4',
        text: 'افزایش نرخ تنزیل (Discount Rate) مدل IRR از ۱۰٪ به ۱۵٪ برای انعکاس مخاطرات کلی پروژه در ارزیابی‌های مالی هیئت مدیره',
        textEn: 'Increase the internal hurdle discount rate from 10% to 15% to reflect general project risk premiums in executive board appraisal submissions',
        isCorrect: false
      }
    ],
    explanation: 'پایداری اقتصادی در IPMA WISE مستلزم قیمت‌گذاری درونی منابع کمیاب (آب و کربن) و سناریونویسی اقلیمی است تا از شکل‌گیری «دارایی‌های به گل نشسته» (Stranded Assets) جلوگیری شود.',
    explanationEn: 'Economic sustainability under IPMA WISE mandates internal shadow pricing of scarce natural capital (water and carbon) to prevent premature stranded asset creation.'
  },
  {
    id: 'q_wise_38',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'hard',
    text: 'یک شرکت خودروسازی پروژه‌ای برای طراحی باتری خودروهای برقی آغاز کرده است. تیم مهندسی با دو انتخاب روبروست: طراحی یکپارچه چسبی (ارزان در تولید، غیرقابل تعمیر و غیرقابل جداسازی) در برابر «طراحی برای بازیافت و بازکردن قطعات (Design for Disassembly - DfD)» که هزینه اولیه تحقیق و توسعه را ۱۲٪ افزایش می‌دهد اما مواد ارزشمند در انتهای عمر بازیافت می‌شوند. موضع مدیر پروژه WISE چیست؟',
    textEn: 'An EV battery engineering project faces an architectural fork: adhesive potted cell integration (cheaper assembly, unserviceable, impossible to shred safely) versus "Design for Disassembly (DfD)" which raises upfront R&D costs by 12% but allows modular cell salvage and rare metal recovery at end-of-life. What is the WISE project manager\'s position?',
    options: [
      {
        id: '1',
        text: 'حمایت از مدل طراحی برای جداسازی قطعات (DfD) در راستای اقتصاد چرخشی، کاهش وابستگی به واردات مواد خام کمیاب و خلق زنجیره ارزش ثانویه در آینده',
        textEn: 'Champion Design for Disassembly (DfD) to embody Circular Economy tenets, hedge critical mineral dependencies, and unlock secondary battery value chains',
        isCorrect: true
      },
      {
        id: '2',
        text: 'پذیرش طراحی یکپارچه چسبی به دلیل تسریع ۳ ماهه زمان عرضه به بازار (Time-to-Market) و انتقال مسئولیت بازیافت به شرکت‌های تخصصی بازیافت در آینده',
        textEn: 'Adopt bonded potted pack design to gain a 3-month time-to-market advantage, shifting future recycling duties to downstream specialized processors',
        isCorrect: false
      },
      {
        id: '3',
        text: 'پیشنهاد طراحی ترکیبی ماژولار با هزینه R&D ۶٪ که قابلیت تعمیر جزیی را فراهم کرده اما الزام بازیافت ۱۰۰٪ قطعات را معلق می‌سازد',
        textEn: 'Propose a hybrid semi-modular architecture at a 6% R&D cost increment, enabling partial servicing while waiving mandatory 100% material recyclability',
        isCorrect: false
      },
      {
        id: '4',
        text: 'منوط کردن پذیرش DfD به دریافت یارانه‌های دولتی توسعه فناوری سبز جهت پوشش کامل ۱۲٪ اضافه هزینه تحقیق و توسعه',
        textEn: 'Condition DfD adoption on securing government green technology innovation subsidies to fully offset the 12% upfront R&D cost premium',
        isCorrect: false
      }
    ],
    explanation: 'طراحی برای بازیافت و جداسازی قطعات (DfD) نمونه بارز تلفیق اقتصاد چرخشی با فناوری است که هزینه‌های محیط زیستی پایان عمر را به سرمایه اقتصادی جدید تبدیل می‌کند.',
    explanationEn: 'Design for Disassembly (DfD) is a foundational circular economy strategy that transforms end-of-life liabilities into regenerative economic capital.'
  },
  {
    id: 'q_wise_39',
    topic: 'Work & Economy',
    topicEn: 'Work & Economy',
    difficulty: 'hard',
    text: 'در یک پروژه بین‌المللی سدسازی، تامین‌کننده مالی پروژه را مشروط به رعایت «اصول اکواتور (Equator Principles)» و استانداردهای عملکردی IFC کرده است. اسپانسر داخلی برای تسریع فرآیند و فرار از حسابرسی‌های پایداری، پیشنهاد می‌کند وام را با نرخ بهره بالاتر از یک موسسه بدون مقررات ESG دریافت کنند. دفاعیه حرفه‌ای مدیر پروژه چیست؟',
    textEn: 'In a major dam project, multilateral lenders condition financing on strict adherence to the Equator Principles and IFC Performance Standards. The internal sponsor suggests refinancing through an unregulated high-interest lender to bypass ESG audits and expedite execution. What is the project manager\'s professional defense?',
    options: [
      {
        id: '1',
        text: 'تبیین این واقعیت که رعایت چارچوب‌های استاندارد ESG نه تنها هزینه نیست، بلکه ریسک‌های توقف پروژه، شکایات بین‌المللی و بحران‌های اعتباری را خنثی کرده و هزینه سرمایه را پایدار می‌سازد',
        textEn: 'Demonstrate that robust ESG compliance is an essential risk-mitigation framework that prevents project injunctions, international sanctions, and reputational contagion, ultimately lowering the weighted cost of capital',
        isCorrect: true
      },
      {
        id: '2',
        text: 'پذیرش پیشنهاد اسپانسر مشروط به انجام ممیزی‌های زیست‌محیطی داخلی توسط مشاور پروژه جهت کاهش احتمال بروز مخاطرات اجرایی',
        textEn: 'Agree to the sponsor\'s refinancing proposal conditioned on retaining internal environmental consultants to conduct self-directed audits',
        isCorrect: false
      },
      {
        id: '3',
        text: 'پیشنهاد ساختار تامین مالی ترکیبی (Blended Finance) که بخشی از وام از طریق موسسه بدون مقررات و بخشی از طریق بانک دارنده استاندارد ESG تامین گردد',
        textEn: 'Propose a Blended Finance structure sourcing capital partially from unregulated lenders and partially from ESG-compliant banks',
        isCorrect: false
      },
      {
        id: '4',
        text: 'درخواست مهلت ۶ ماهه از تامین‌کننده مالی اول برای اصلاح اسناد ESG بدون تغییر در ساختار وام‌دهی و زمان‌بندی پروژه',
        textEn: 'Request a 6-month extension from multilateral lenders to refine ESG documentation without adjusting overall credit structures or project baselines',
        isCorrect: false
      }
    ],
    explanation: 'تامین مالی پایدار (Sustainable Finance) و همسویی با اصول Equator و IFC تضمین‌کننده بقا و تاب‌آوری پروژه‌های بزرگ در مقیاس بین‌المللی است.',
    explanationEn: 'Sustainable finance governed by Equator Principles and IFC Performance Standards hedges capital-intensive megaprojects against catastrophic sociopolitical derailments.'
  },

  // --- Individuals & People (افراد و منابع انسانی) ---
  {
    id: 'q_wise_40',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'hard',
    text: 'در جریان گذار عادلانه (Just Transition) و تغییر فناوری یک پالایشگاه نفت به هاب سوخت‌های زیستی و هیدروژن سبز، ۵۰۰ نفر از تکنسین‌های قدیمی با خطر اخراج ناگهانی به دلیل عدم تطابق مهارت روبرو هستند. بر اساس بُعد Individuals مدل IPMA WISE، راهبرد اخلاقی و پایدار چیست؟',
    textEn: 'During a Just Transition converting an oil refinery into a green hydrogen hub, 500 legacy operating technicians face immediate redundancy due to skill obsolescence. Under the Individuals pillar of IPMA WISE, what is the ethical and sustainable human capital strategy?',
    options: [
      {
        id: '1',
        text: 'طراحی برنامه جامع بازآموزی و ارتقای شایستگی‌های سبز (Reskilling & Upskilling) با حفظ امنیت شغلی و کرامت انسانی کارکنان در فاز گذار تکنولوژیک',
        textEn: 'Design structured green reskilling and upskilling pathways, safeguarding employment security, wage equity, and human dignity throughout the technological shift',
        isCorrect: true
      },
      {
        id: '2',
        text: 'ارائه بسته‌های بازنشستگی پیش از موعد و سنوات تشویقی تعدیل نیرو جهت خروج داوطلبانه تکنسین‌های قدیمی و جذب نیروهای جوان متخصص هیدروژن',
        textEn: 'Offer attractive voluntary early retirement packages and severance buyouts to transition legacy technicians out, recruiting specialized green hydrogen graduates',
        isCorrect: false
      },
      {
        id: '3',
        text: 'برون‌سپاری فرآیندهای فنی هیدروژن به پیمانکاران تخصصی و انتقال تکنسین‌های قدیمی به بخش‌های عمومی و پشتیبانی پالایشگاه',
        textEn: 'Outsource green hydrogen process operations to specialized contractors while reassigning legacy technicians to general facility maintenance teams',
        isCorrect: false
      },
      {
        id: '4',
        text: 'انعقاد تفاهم‌نامه با سازمان فنی و حرفه‌ای جهت آموزش تکنسین‌ها پس از اتمام فاز تعدیل ساختاری پالایشگاه',
        textEn: 'Sign vocational training MOUs to offer technical courses to technicians following the structural completion of the refinery conversion phase',
        isCorrect: false
      }
    ],
    explanation: 'اصل «گذار عادلانه (Just Transition)» در مدل IPMA WISE تاکید دارد که تحولات سبز نباید به بهای تباهی معیشت و کرامت کارگران صنایع سنتی انجام شود، بلکه توانمندسازی و بازآموزی وظیفه حاکمیت پروژه است.',
    explanationEn: 'The Just Transition principle in IPMA WISE asserts that climate transitions must not disenfranchise legacy industrial workers; continuous competence upskilling is an institutional duty.'
  },
  {
    id: 'q_wise_41',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'hard',
    text: 'یک پروژه استقرار هوش مصنوعی در بخش منابع انسانی در حال پیاده‌سازی است. در مرحله آزمایشی، مشخص می‌شود الگوریتم غربالگری رزومه‌ها به دلیل سوگیری در داده‌های گذشته، زنان و متقاضیان اقوام خاص را به طور سیستماتیک رد می‌کند. مدیر فنی اصرار دارد الگوریتم را متوقف نکنند چون سرعت گزینش را ۱۰ برابر کرده است. موضع مدیر پروژه چیست؟',
    textEn: 'An HR artificial intelligence pilot deploys an automated CV screening engine. Audit data reveals the model systematically discriminates against female candidates and ethnic minorities due to historical training bias. The CTO insists on keeping it active because it accelerates screening 10-fold. What is the project manager\'s ethical stance?',
    options: [
      {
        id: '1',
        text: 'توقف استقرار سامانه تا اصلاح سوگیری‌های الگوریتمی، ممیزی داده‌های آموزشی و استقرار سازوکارهای نظارت انسانی جهت تضمین برابری و عدالت استخدامی',
        textEn: 'Halt model deployment immediately until algorithmic bias is debugged, training data is audited, and human-in-the-loop governance guarantees recruitment equity',
        isCorrect: true
      },
      {
        id: '2',
        text: 'ادامه فاز آزمایشی الگوریتم هوش مصنوعی همراه با ممیزی انسانی تصادفی ۲۰٪ رزومه‌های ردشده جهت شناسایی و اصلاح خطاهای احتمالی سیستم',
        textEn: 'Continue the AI pilot while instituting a random 20% human sample audit over rejected CVs to identify and correct systematic model errors',
        isCorrect: false
      },
      {
        id: '3',
        text: 'تعدیل وزن‌دهی الگوریتم بر اساس متغیرهای خنثی تحصیلی و سابقه کاری بدون توقف کامل سامانه اجرایی غربالگری هوشمند',
        textEn: 'Adjust neural model weighting toward neutral academic and experience variables without initiating a complete operational system shutdown',
        isCorrect: false
      },
      {
        id: '4',
        text: 'محدود کردن استفاده از هوش مصنوعی به مرحله ابتدایی دسته‌بندی مدارک و الزام کارشناسان HR به انجام مصاحبه نهایی حضوری',
        textEn: 'Restrict AI usage to initial document categorization while requiring HR staff to conduct mandatory final interviews for shortlisted applicants',
        isCorrect: false
      }
    ],
    explanation: 'پایداری انسانی در عصر دیجیتال شامل «اخلاق هوش مصنوعی»، پیشگیری از سوگیری‌های ساختاری و حفظ عدالت و برابری برای همه آحاد جامعه در بعد Individuals است.',
    explanationEn: 'Digital human sustainability mandates responsible AI ethics, algorithmic fairness, and human oversight to eradicate systemic prejudice under the Individuals pillar.'
  },
  {
    id: 'q_wise_42',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'hard',
    text: 'مدیر پروژه متوجه می‌شود که نرخ حوادث شبه‌خطر (Near-Misses) در کارگاه به دلیل فرهنگ سازمانی سرزنش‌گر به شدت کم گزارش می‌شود و کارگران از ترس توبیخ یا اخراج، خطرات را پنهان می‌کنند. اقدام ریشه‌ای و پایدار رهبری در این شرایط چیست؟',
    textEn: 'A project manager observes that site Near-Miss safety reports have dropped to near-zero because of a punitive blame culture where workers conceal hazards fearing disciplinary termination. What is the sustainable leadership intervention?',
    options: [
      {
        id: '1',
        text: 'ایجاد سیستم گزارش‌دهی بدون نام و بدون سرزنش (Just Culture / Psychological Safety) و پاداش‌دهی به شناسایی خطرات قبل از وقوع حوادث ناگوار',
        textEn: 'Institute an anonymous, non-punitive Just Culture framework anchored in Psychological Safety, rewarding proactive hazard identification before accidents materialize',
        isCorrect: true
      },
      {
        id: '2',
        text: 'افزایش ممیزی‌های سرزده سرپرستان HSE و تعیینKPIهای الزامی برای ارزیابی عملکرد سرپرستان بر اساس تعداد ثبت حوادث شبه‌خطر',
        textEn: 'Increase unannounced HSE supervisor audits and tie supervisor performance KPIs directly to minimum required monthly near-miss logging targets',
        isCorrect: false
      },
      {
        id: '3',
        text: 'برگزاری کارگاه‌های آموزشی مجدد ایمنی کارگاهی برای کلیه پرسنل و تشریح اهمیت آمار شبه‌حوادث در بهبود شاخص‌های ریسک',
        textEn: 'Conduct mandatory site safety refresher workshops for all personnel, explaining the statistical importance of near-miss logging for risk management',
        isCorrect: false
      },
      {
        id: '4',
        text: 'الزام پیمانکاران فرعی به انتصاب کارشناسان ایمنی مجزا در هر جبهه کاری جهت شناسایی مستقیم مخاطرات بدون اتکا به گزارش کارگران',
        textEn: 'Require subcontractors to assign dedicated HSE safety officers to each active work front to identify hazards directly without relying on worker self-reporting',
        isCorrect: false
      }
    ],
    explanation: 'فرهنگ ایمنی پایدار متکی بر ایمنی روانی (Psychological Safety) و فرهنگ عادلانه (Just Culture) است که در آن یادگیری از خطاها بدون ترس از مجازات ترویج می‌شود.',
    explanationEn: 'Sustainable safety leadership relies on Psychological Safety and a "Just Culture" where hazard transparency is celebrated rather than punished.'
  },
  {
    id: 'q_wise_43',
    topic: 'Individuals & People',
    topicEn: 'Individuals & People',
    difficulty: 'hard',
    text: 'در یک پروژه فراملیتی زیرساختی، پیمانکار دسته چندم پاسپورت‌های کارگران مهاجر را ضبط کرده و آنها را در کانکس‌های بدون تهویه با شرایط غیربهداشتی اسکان داده است. مدیر پیمانکار می‌گوید این عرف محلی منطقه است و دخالت در امور پیمانکار فرعی خارج از محدوده مدیریت پروژه است. رویکرد قاطع مدیر پروژه چیست؟',
    textEn: 'In a multinational infrastructure megaproject, a sub-tier subcontractor confiscates migrant workers\' passports and confines them in unventilated, squalid shacks. The vendor manager dismisses complaints as standard regional practice outside prime project jurisdiction. What is the project manager\'s unequivocal duty?',
    options: [
      {
        id: '1',
        text: 'دخالت فوری و بدون مماشات بر اساس موازین حقوق بشر سازمان ملل، الزام به استرداد فوری مدارک هویتی، اصلاح وضعیت اسکان و در صورت امتناع فسخ قرارداد پیمانکار متخلف',
        textEn: 'Intervene immediately under UN Guiding Principles on Human Rights, mandate instant passport restoration and dignified housing, and terminate the contract if non-compliance persists',
        isCorrect: true
      },
      {
        id: '2',
        text: 'صدور اخطار کتبی ۴۸ ساعته به پیمانکار اصلی جهت اصلاح شرایط اسکان و ارجاع موضوع به واحد حقوقی سازمان برای ارزیابی مسئولیت‌های قراردادی',
        textEn: 'Issue a 48-hour cure notice to the prime contractor to rectify housing conditions, referring the matter to legal counsel for liability appraisal',
        isCorrect: false
      },
      {
        id: '3',
        text: 'تخصیص بودجه اضطراری از محل ذخیره احتیاطی پروژه برای اجاره اقامتگاه‌های کارگاهی جدید جهت اسکان نیروهای مهاجر',
        textEn: 'Allocate emergency contingency funds to lease new compliant site housing units for affected migrant labor crews',
        isCorrect: false
      },
      {
        id: '4',
        text: 'درخواست ممیزی طرف ثالث از نهادهای نظارتی کار بومی جهت تایید تطابق شرایط اسکان با حداقل قوانین استانی',
        textEn: 'Commission an independent third-party audit from local labor inspectors to verify if housing meets statutory minimum regional codes',
        isCorrect: false
      }
    ],
    explanation: 'تعهد به حقوق بنیادین انسان و مبارزه با کار اجباری (Modern Slavery) در تمام زنجیره ارزش پروژه، اصلی غیرقابل تفویض و غیرقابل چشم‌پوشی در مدل IPMA WISE است.',
    explanationEn: 'Eradicating modern slavery and upholding human dignity across all supply tiers is a non-delegable duty in the IPMA WISE Individuals dimension.'
  },

  // --- Society & Community (جامعه و مسئولیت اجتماعی) ---
  {
    id: 'q_wise_44',
    topic: 'Society & Community',
    topicEn: 'Society & Community',
    difficulty: 'hard',
    text: 'در یک پروژه شهر هوشمند، شهرداری قصد دارد داده‌های مکانی، عادات رفتاری و ترددهای شهروندان را بدون اخذ رضایت آگاهانه جمع‌آوری کرده و برای کسب درآمد به شرکت‌های تجاری بفروشد. تیم پروژه متوجه نقض حریم خصوصی و تبعات منفی اجتماعی این تصمیم می‌شود. بر اساس بعد Society، مدیر پروژه چگونه باید عمل کند؟',
    textEn: 'In a smart city municipal IoT deployment, authorities plan to harvest citizen geolocation traces and foot-traffic behaviors without informed consent, monetizing data streams to commercial ad networks. The project team identifies severe civil liberty breaches. Under the Society pillar, what must the project manager do?',
    options: [
      {
        id: '1',
        text: 'دفاع از اصول حاکمیت داده اخلاقی (Data Governance)، الزام به گمنام‌سازی داده‌ها (Anonymization) و رعایت حقوق حریم خصوصی شهروندان به عنوان ذی‌نفعان اصلی جامعه',
        textEn: 'Champion ethical data governance, enforce differential privacy and irrevocable anonymization, and defend citizen civil liberties as primary societal stakeholders',
        isCorrect: true
      },
      {
        id: '2',
        text: 'پیشنهاد اجرای طرح رضایت‌گیری دیجیتالی (Opt-out) در سامانه جهت امکان انصراف شهروندان از فروش داده‌ها، همراه با ادامه جمع‌آوری عمومی',
        textEn: 'Propose an Opt-out digital consent toggle allowing citizens to withdraw from commercial monetization while retaining default mass telemetry collection',
        isCorrect: false
      },
      {
        id: '3',
        text: 'منوط کردن تجاری‌سازی داده‌ها به تصویب شورای اسلامی شهر و اخذ تاییدیه صریح از کارگروه حقوقی مدیریت شهری',
        textEn: 'Condition commercial data sales on city council legislative ratifications and formal clearances from municipal legal task forces',
        isCorrect: false
      },
      {
        id: '4',
        text: 'محدود کردن فروش داده‌ها به داده‌های تجمیعی منطقه ای و تخصیص بخشی از درآمدهای حاصله به توسعه خدمات هوشمند عمومی شهر',
        textEn: 'Restrict data sales to aggregated neighborhood-level analytics, earmarking revenue shares for public smart utility expansion',
        isCorrect: false
      }
    ],
    explanation: 'پایداری اجتماعی در پروژه‌های دیجیتال و داده‌محور شامل حفاظت از حریم خصوصی، شفافیت و حاکمیت اخلاقی بر داده‌های عمومی شهروندان است.',
    explanationEn: 'Societal sustainability in digital smart ventures requires ethical data stewardship, privacy-by-design, and transparent citizen protection under IPMA WISE.'
  },
  {
    id: 'q_wise_45',
    topic: 'Society & Community',
    topicEn: 'Society & Community',
    difficulty: 'hard',
    text: 'یک پروژه پتروشیمی در منطقه‌ای با نرخ بیکاری ۳۵٪ احداث می‌شود. اگرچه پروژه طبق قانون ملزم به استخدام حداقل است، اما بیکاران محلی تخصص لازم برای کارهای پیچیده ابزاردقیق را ندارند. رویکرد پیشرو در ایجاد ارزش مشترک (Creating Shared Value - CSV) چیست؟',
    textEn: 'A petrochemical project is sited in a municipality with 35% chronic youth unemployment. While the project satisfies baseline legal recruitment quotas, local jobseekers lack technical qualifications for sophisticated process instrumentation. What is the progressive Creating Shared Value (CSV) strategy?',
    options: [
      {
        id: '1',
        text: 'تاسیس مرکز فنی و حرفه‌ای پیش از موعد در منطقه با همکاری سازمان‌های محلی جهت آموزش مهارت‌های ابزاردقیق به جوانان بومی برای فازهای بعدی و بهره‌برداری',
        textEn: 'Co-sponsor an advance vocational academy with community polytechnics to train local youth in industrial automation, staffing subsequent operational phases sustainably',
        isCorrect: true
      },
      {
        id: '2',
        text: 'تخصیص بودجه مسئولیت اجتماعی به صندوق اشتغال‌زایی استان جهت پرداخت تسهیلات خوداشتغالی به جوانان بومی فاقد مهارت',
        textEn: 'Allocate corporate CSR grants into regional micro-loan funds to support local non-technical self-employment ventures',
        isCorrect: false
      },
      {
        id: '3',
        text: 'استخدام کارجویان بومی در بخش‌های خدمات عمومی، حراست و پشتیبانی کارگاه همراه با اعطای پاداش‌های ترغیبی به شهرداری',
        textEn: 'Fulfill local quotas by employing residents in general facility services, logistics, and site security alongside municipal goodwill grants',
        isCorrect: false
      },
      {
        id: '4',
        text: 'الزام پیمانکاران فرعی به استخدام حداقل ۳۰٪ نیروی ساده بومی در فاز ساخت و اعطای مدرک سابقه کار صنعتی در پایان پروژه',
        textEn: 'Require sub-tier contractors to maintain a 30% local unskilled labor quota during civil construction, issuing trade certificates at closeout',
        isCorrect: false
      }
    ],
    explanation: 'ارزش‌آفرینی مشترک (CSV) فراتر از امور خیریه منفعلانه است و با توانمندسازی پایدار، توسعه سرمایه انسانی محلی و ایجاد اشتغال شایسته، آینده جامعه و پایداری پروژه را تضمین می‌کند.',
    explanationEn: 'Creating Shared Value (CSV) supersedes passive philanthropy by investing in local technical capacity building, securing genuine community prosperity and a resilient social license.'
  },
  {
    id: 'q_wise_46',
    topic: 'Society & Community',
    topicEn: 'Society & Community',
    difficulty: 'hard',
    text: 'در فاز ارزیابی پیامدهای اجتماعی (SIA) یک طرح سدسازی، مشخص می‌شود که آبگیری سد منجر به زیر آب رفتن روستایی با قدمت تاریخی و کوچ اجباری ۸۰ خانوار می‌شود. راه‌حل همگام با اخلاق و مدل IPMA WISE کدام است؟',
    textEn: 'A Social Impact Assessment (SIA) for a reservoir dam reveals that reservoir impoundment will inundate a centuries-old village, displacing 80 households. What is the ethically compliant solution under IPMA WISE?',
    options: [
      {
        id: '1',
        text: 'تدوین برنامه جامع اسکان مجدد مشارکتی با تامین زمین‌های حاصلخیز معادل، زیرساخت‌های نوین زندگی، پرداخت غرامت عادلانه و حفظ پیوندهای اجتماعی اهالی',
        textEn: 'Develop a participatory resettlement action plan (RAP) providing equivalent arable lands, modern community infrastructure, full economic compensation, and social cohesion safeguards',
        isCorrect: true
      },
      {
        id: '2',
        text: 'پرداخت ۱.۵ برابر قیمت کارشناسی روز املاک روستاییان به صورت نقدی جهت استملاک اراضی و واگذاری انتخاب محل سکونت جدید به خود اهالی',
        textEn: 'Disburse 1.5x judicial appraisal value as cash buyouts for property, leaving the selection and purchase of new homes entirely to displaced families',
        isCorrect: false
      },
      {
        id: '3',
        text: 'احداث شهرک مسکونی جدید در مجاورت نزدیک‌ترین مرکز شهری و واگذاری واحدهای آپارتمانی به روستاییان بر اساس سرانه خانوار',
        textEn: 'Construct a new urban housing estate near the closest township and assign apartment units to displaced families based on household size',
        isCorrect: false
      },
      {
        id: '4',
        text: 'تعویق زمان آبگیری سد به مدت ۱۲ ماه جهت اعطای مهلت کافی به روستاییان برای برداشت آخرین محصولات کشاورزی و تخلیه منطقه',
        textEn: 'Delay reservoir impoundment by 12 months to grant villagers sufficient time to harvest seasonal crops and voluntarily vacate the basin',
        isCorrect: false
      }
    ],
    explanation: 'اسکان مجدد غیراصولی یکی از فاجعه‌بارترین ابعاد اجتماعی پروژه‌هاست. مدل WISE بر مشارکت فعال، جبران کامل خسارت مادی و معنوی و بازسازی زیرساخت‌های پایدار برای جوامع تاکید دارد.',
    explanationEn: 'Involuntary resettlement is one of the highest social risks in project delivery. IPMA WISE requires participatory planning, full restorative restitution, and durable community rebuilding.'
  },
  {
    id: 'q_wise_47',
    topic: 'Society & Community',
    topicEn: 'Society & Community',
    difficulty: 'hard',
    text: 'در فرآیند تصمیم‌گیری درباره مکانیابی احداث کارخانه بازیافت زباله‌های ویژه، مدیران تصمیم می‌گیرند آن را در محروم‌ترین محله حاشیه شهر که فاقد تشکل‌های مدنی و قدرت چانه‌زنی سیاسی است مستقر کنند. این تصمیم چه اصل پایداری اجتماعی را نقض می‌کند؟',
    textEn: 'In selecting a hazardous waste processing facility site, executives resolve to locate it in the poorest peri-urban district due to its lack of civic associations and political clout. Which social sustainability doctrine does this violate?',
    options: [
      {
        id: '1',
        text: 'عدالت زیست‌محیطی و اجتماعی (Environmental & Social Justice) و عدم تحمیل نابرابر بارهای نامطلوب بر اقشار آسیب‌پذیر',
        textEn: 'Environmental & Social Justice, prohibiting the disproportionate dumping of hazardous burdens on marginalized communities',
        isCorrect: true
      },
      {
        id: '2',
        text: 'اصل مدیریت ریسک ذی‌نفعان به دلیل احتمال شکل‌گیری اعتراضات محلی برنامه‌ریزی‌نشده در فازهای آتی بهره‌برداری',
        textEn: 'The Stakeholder Risk Management doctrine regarding potential unmitigated local unrest during future facility operation',
        isCorrect: false
      },
      {
        id: '3',
        text: 'اصل شفافیت در حاکمیت شرکتی به دلیل عدم افشای دلایل واقعی مکانیابی در اسناد رسمی ارزیابی اثرات توسعه',
        textEn: 'The Corporate Governance Transparency principle due to non-disclosure of true siting rationales in development SIA reports',
        isCorrect: false
      },
      {
        id: '4',
        text: 'اصل مسئولیت‌پذیری در تدارکات به دلیل عدم انجام مناقصه آزاد برای انتخاب اراضی صنعتی در پهنه‌های پهنه‌بندی شهری',
        textEn: 'The Procurement Accountability doctrine concerning non-competitive land acquisition across municipal industrial zones',
        isCorrect: false
      }
    ],
    explanation: 'عدالت زیست‌محیطی (Environmental Justice) تصریح می‌کند که آلودگی‌ها و اثرات نامطلوب پروژه‌ها نباید به صورت نابرابر به جوامع فرودست یا حاشیه‌نشین تحمیل شود.',
    explanationEn: 'Environmental Justice dictates that systemic ecological hazards and project burdens must never be disproportionately thrust onto politically vulnerable populations.'
  },

  // --- Environment & Planet (محیط زیست و بوم‌شناسی) ---
  {
    id: 'q_wise_48',
    topic: 'Environment & Planet',
    topicEn: 'Environment & Planet',
    difficulty: 'hard',
    text: 'یک شرکت بزرگ چندملیتی ادعا می‌کند پروژه جدیدش «کربن خنثی (Net Zero)» است زیرا برای تمام انتشارات خود اعتبارات کربن جنگل‌کاری ارزان‌قیمت (Carbon Offsets) خریداری کرده است، بدون اینکه هیچ تلاشی برای کاهش انتشارات مستقیم خود (Decarbonization) انجام دهد. ارزیابی علمی مدیر پروژه چیست؟',
    textEn: 'A multinational claims its megaproject is "Net Zero" because it bought cheap unverified forestry carbon offsets matching all projected emissions, without implementing any direct operational decarbonization. What is the project manager\'s scientific assessment?',
    options: [
      {
        id: '1',
        text: 'رد ادعای پایداری واقعی؛ بر اساس نردبان کربن‌زدایی (Decarbonization Hierarchy)، ابتدا باید انتشارات را در مبدا اجتناب و کاهش داد و جبران‌سازی تنها آخرین راهکار برای انتشارات اجتناب‌ناپذیر است',
        textEn: 'Reject the claim as greenwashing; per the Carbon Management Hierarchy, direct abatement (Avoid, Reduce) must take absolute precedence, with offsets reserved strictly for residual unmitigated emissions',
        isCorrect: true
      },
      {
        id: '2',
        text: 'تایید ادعا با شرط ممیزی طرف ثالث از پروژه جنگل‌کاری و ثبت اعتبارات کربن در بازارهای رسمی بین‌المللی',
        textEn: 'Validate the Net Zero claim provided a third-party audit verifies that forestry offset credits are registered on international carbon exchanges',
        isCorrect: false
      },
      {
        id: '3',
        text: 'پذیرش رویکرد جبرانی به عنوان راهکار فاز گذار ۵ ساله تا زمان بلوغ فناوری‌های کربن‌زدایی مستقیم در صنعت مربوطه',
        textEn: 'Accept offset purchasing as a legitimate 5-year transition strategy while awaiting commercial maturity in direct decarbonization tech',
        isCorrect: false
      },
      {
        id: '4',
        text: 'توصیه به ترکیب خریدهای آفست جنگل‌کاری با پروژه‌های جذب مستقیم کربن از هوا (DAC) جهت ارتقای اعتبارات پایداری',
        textEn: 'Recommend combining forestry offsets with Direct Air Capture (DAC) credits to elevate the scientific credibility of the company\'s Net Zero claims',
        isCorrect: false
      }
    ],
    explanation: 'در سلسله‌مراتب کاهش کربن استاندارد IPMA WISE و استانداردهای بین‌المللی GHG، گام اول «اجتناب (Avoid)»، گام دوم «کاهش مستقیم (Reduce)» و گام آخر «جبران‌سازی (Offset)» است. اتکای صِرف به جبران بدون کربن‌زدایی مصداق سبزشویی است.',
    explanationEn: 'Under international carbon protocols and IPMA WISE, the mitigation hierarchy demands Avoidance and Reduction first; relying solely on offsets without direct abatement is textbook greenwashing.'
  },
  {
    id: 'q_wise_49',
    topic: 'Environment & Planet',
    topicEn: 'Environment & Planet',
    difficulty: 'hard',
    text: 'در محاسبه ردپای کربن یک پروژه عظیم ساخت خطوط ریلی سریع‌السیر، تیم مشاور تنها مصرف سوخت ماشین‌آلات کارگاهی در حین ساخت (Scope 1) را گزارش کرده و از محاسبه کربن تجسم‌یافته تولید ریل‌های فولادی و تراورس‌های بتنی (Scope 3) به دلیل دشواری محاسبات خودداری کرده است. پیامد این اقدام چیست؟',
    textEn: 'In greenhouse gas accounting for a high-speed rail megaproject, the consulting team reports only diesel consumed by site excavators (Scope 1), omitting upstream embodied carbon in steel tracks and concrete sleepers (Scope 3) due to calculation complexity. What is the ramification?',
    options: [
      {
        id: '1',
        text: 'پنهان‌سازی تا ۸۰ درصد از کل بار آلایندگی اقلیمی پروژه، که منجر به برآوردهای گمراه‌کننده، ارزیابی غلط اثرات زیست‌محیطی و نقض اصول گزارش‌دهی معتبر پایداری می‌شود',
        textEn: 'Concealing up to 80% of the project\'s true lifecycle climate burden, resulting in misleading environmental statements and violating GHG Protocol transparency standards',
        isCorrect: true
      },
      {
        id: '2',
        text: 'دست‌کم گرفتن ۲۰ درصدی ردپای کربن که با اعمال ضرایب عدم قطعیت در مدل‌های گزارش‌دهی سالانه قابل تعدیل است',
        textEn: 'Underestimating total carbon footprints by roughly 20%, which can be adjusted via general uncertainty multipliers in annual ESG reports',
        isCorrect: false
      },
      {
        id: '3',
        text: 'انحراف محدود در شاخص‌های Scope 3 که به دلیل خارج بودن تولید فولاد و بتن از مرز سازمان قابل اغماض تلقی می‌شود',
        textEn: 'Minor variance in Scope 3 accounting that is deemed acceptable since raw material processing falls outside primary site boundaries',
        isCorrect: false
      },
      {
        id: '4',
        text: 'تسهیل دریافت گواهی پایداری فاز ساخت با تعویق گزارش‌دهی کربن مصالح به دوره بهره‌برداری پروژه',
        textEn: 'Expediting construction phase green certification approvals by deferring supply chain material accounting to the O&M phase',
        isCorrect: false
      }
    ],
    explanation: 'در پروژه‌های عمرانی و صنعتی، انتشار محدوده ۳ (Scope 3 - کربن تجسم‌یافته در مصالح و زنجیره تامین) معمولاً بیش از ۷۰ تا ۸۰ درصد از کل ردپای کربن را تشکیل می‌دهد. حذف آن، گزارش‌دهی پایداری را بی‌اعتبار می‌کند.',
    explanationEn: 'In infrastructure, Scope 3 embodied carbon in steel and cement often exceeds 70-80% of total footprint. Omitting it invalidates sustainable project reporting.'
  },
  {
    id: 'q_wise_50',
    topic: 'Environment & Planet',
    topicEn: 'Environment & Planet',
    difficulty: 'hard',
    text: 'در جریان ساخت یک بندر تجاری، مشخص می‌شود که لایروبی حوضچه آرامش باعث تخریب ۱۰۰ هکتار از تپه‌های مرجانی کم‌نظیر خلیج خواهد شد. مهندسان دو راهکار پیش رو دارند: گزینه A لایروبی مستقیم با نابودی مرجان‌ها، و گزینه B تغییر هندسه بازوها و انتقال دقیق کلونی‌های مرجانی به سایت جدید به همراه رصد ۳ ساله با افزایش ۱۸٪ هزینه لایروبی. بر اساس موازنه ۴ بُعدی مدل IPMA WISE، تصمیم نهایی چیست؟',
    textEn: 'Harbor basin dredging will obliterate 100 hectares of pristine coral reef. Marine engineers present two options: Option A executes rapid dredging with total reef eradication; Option B re-engineers breakwater geometry, transplants living coral colonies to a protected marine sanctuary, and funds a 3-year ecological monitoring program at an 18% cost premium. Under the 4-pillar balance of IPMA WISE, what is the decision?',
    options: [
      {
        id: '1',
        text: 'انتخاب گزینه B با رویکرد «عدم اتلاف خالص تنوع زیستی (No Net Loss of Biodiversity)»، طراحی بودجه حفاظتی و تضمین پایداری اکوسیستم دریایی در کنار توجیه اقتصادی و اجتماعی بلندمدت بندر',
        textEn: 'Select Option B embodying the "No Net Loss of Biodiversity" principle, investing in ecological transplantation and securing marine resilience alongside long-term maritime port viability',
        isCorrect: true
      },
      {
        id: '2',
        text: 'انتخاب گزینه A مشروط به تخصیص ۱۸٪ صرفه‌جویی مالی به صندوق‌های ملی توسعه سواحل و احیای زیستگاه‌های جایگزین در استان دیگر',
        textEn: 'Adopt Option A on the condition that the 18% financial savings are funneled into national coastal conservation funds for off-site habitat rehabilitation',
        isCorrect: false
      },
      {
        id: '3',
        text: 'پیشنهاد راهکار ثالث شامل اجرای فازبندی‌شده لایروبی مستقیم به همراه جابه‌جایی محدود ۲0٪ از کلونی‌های مرجانی با ارزش‌تر',
        textEn: 'Propose a compromised Option C executing phased direct dredging alongside partial transplantation of the top 20% highest-value coral clusters',
        isCorrect: false
      },
      {
        id: '4',
        text: 'منوط کردن اجرای گزینه B به دریافت مشارکت مالی ۵۰ درصدی از سازمان محیط زیست جهت پوشش اضافه هزینه ۱۸ درصدی پروژه',
        textEn: 'Condition Option B execution on securing a 50% co-funding grant from environmental protection agencies to cover the 18% cost overrun',
        isCorrect: false
      }
    ],
    explanation: 'مدل IPMA WISE بر راهکارهای مهندسی مبتنی بر طبیعت (Nature-based Solutions) و تعهد به «عدم کاهش خالص تنوع زیستی (No Net Loss)» تاکید دارد. گزینه B پیوند بهینه میان کار و اقتصاد، محیط زیست و مسئولیت اجتماعی در قبال نسل‌های آینده است.',
    explanationEn: 'The IPMA WISE model advocates Nature-based Solutions and strict commitment to "No Net Loss of Biodiversity". Option B establishes the optimal balance between economic viability, planetary health, and intergenerational social equity.'
  }
];
