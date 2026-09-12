export type Locale = "en" | "ar";

export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  ar: "AR",
};

type Dict = Record<string, string>;

export const TRANSLATIONS: Record<Locale, Dict> = {
  en: {
    appName: "BerthIQ",
    tagline: "Port Traffic Reports",
    toggleLanguage: "Switch language",

    homeEyebrow: "Live port traffic",
    homeTitle: "Which ports are backed up right now?",
    homeDescription:
      "We track real ships near five major ports to see how many are stuck waiting. Pick a port below to see how bad it is, and get plain-English advice for shipping companies, trucking companies, and the port itself.",

    shipsWaitingRightNow: "ships waiting right now",
    live: "Live",
    connecting: "Connecting",
    noLiveData: "No live data",
    seeRecommendations: "See recommendations",
    noPortsTitle: "No ports available",
    noPortsDescription: "The backend didn't return any tracked ports.",

    allPorts: "All ports",
    portStatusEyebrow: "Port status",
    portStatusTitle: "How congested is this port?",
    portStatusDescription:
      "We look at how many ships are waiting, check how serious it is, and write specific advice for the people who deal with this every day.",

    tierLow: "Low",
    tierMedium: "Medium",
    tierHigh: "High",
    tierCritical: "Critical",

    liveShipTracking: "Live ship tracking",
    shipsNearby: "Ships nearby",
    shipsWaiting: "Ships waiting",
    shipsAtBerth: "Ships at berth",
    usedBelow: "Used below — from live tracking",
    warmingUp:
      "We just started watching this port, so the count of waiting ships will fill in over the next couple of minutes.",
    waiting: "Waiting",
    moving: "Moving",
    atBerth: "At berth",
    shipsShown: "ships shown",

    fillInWhatYouKnow: "Fill in what you know",
    fillInDescription:
      "Ports don't publish how full their berths are or how long ships actually wait, so those two numbers are your best estimate — adjust them if you know better. The number of ships waiting comes straight from live tracking.",
    howFullThePort: "How full the port is",
    averageDelay: "Average delay",
    getRecommendations: "Get recommendations",

    whatEachGroupShouldDo: "What each group should do",
    why: "Why?",

    personaCarrier: "Shipping Company",
    personaCarrierSub: "Owns or runs the ships",
    personaTrucking: "Trucking Company",
    personaTruckingSub: "Picks up containers by truck",
    personaTerminal: "Port Operator",
    personaTerminalSub: "Runs the port itself",

    loadingStep1: "Checking current conditions",
    loadingStep2: "Figuring out how serious it is",
    loadingStep3: "Writing advice for shipping companies",
    loadingStep4: "Writing advice for trucking companies",
    loadingStep5: "Writing advice for the port operator",
    loadingNote: "This takes about 20–30 seconds — an AI is thinking through it.",

    failedToLoad: "Failed to load live port data",
    somethingWentWrong: "Something went wrong while getting recommendations.",
  },
  ar: {
    appName: "BerthIQ",
    tagline: "تقارير حركة الموانئ",
    toggleLanguage: "تغيير اللغة",

    homeEyebrow: "حركة الموانئ المباشرة",
    homeTitle: "ما هي الموانئ المزدحمة الآن؟",
    homeDescription:
      "نتابع السفن الحقيقية القريبة من خمسة موانئ رئيسية لمعرفة عدد السفن العالقة في الانتظار. اختر ميناءً أدناه لمعرفة مدى سوء الوضع، والحصول على نصائح واضحة لشركات الشحن، وشركات النقل البري، والميناء نفسه.",

    shipsWaitingRightNow: "سفينة تنتظر الآن",
    live: "مباشر",
    connecting: "جارٍ الاتصال",
    noLiveData: "لا توجد بيانات مباشرة",
    seeRecommendations: "عرض التوصيات",
    noPortsTitle: "لا توجد موانئ متاحة",
    noPortsDescription: "لم يُرجع الخادم أي موانئ متابَعة.",

    allPorts: "كل الموانئ",
    portStatusEyebrow: "حالة الميناء",
    portStatusTitle: "ما مدى ازدحام هذا الميناء؟",
    portStatusDescription:
      "ننظر إلى عدد السفن المنتظرة، ونحدد مدى خطورة الوضع، ونكتب نصائح محددة للأشخاص الذين يتعاملون مع هذا يوميًا.",

    tierLow: "منخفض",
    tierMedium: "متوسط",
    tierHigh: "مرتفع",
    tierCritical: "حرج",

    liveShipTracking: "تتبع السفن المباشر",
    shipsNearby: "السفن القريبة",
    shipsWaiting: "السفن المنتظرة",
    shipsAtBerth: "السفن الراسية",
    usedBelow: "تُستخدم أدناه — من التتبع المباشر",
    warmingUp: "بدأنا للتو بمراقبة هذا الميناء، لذا سيكتمل عدد السفن المنتظرة خلال الدقائق القليلة القادمة.",
    waiting: "منتظرة",
    moving: "متحركة",
    atBerth: "راسية",
    shipsShown: "سفينة معروضة",

    fillInWhatYouKnow: "أدخل ما تعرفه",
    fillInDescription:
      "لا تنشر الموانئ نسبة امتلاء أرصفتها أو مدة انتظار السفن الفعلية، لذا فإن هذين الرقمين هما أفضل تقدير لديك — عدّلهما إذا كانت لديك معلومات أدق. عدد السفن المنتظرة يأتي مباشرة من التتبع المباشر.",
    howFullThePort: "نسبة امتلاء الميناء",
    averageDelay: "متوسط التأخير",
    getRecommendations: "احصل على التوصيات",

    whatEachGroupShouldDo: "ما الذي يجب أن تفعله كل جهة",
    why: "لماذا؟",

    personaCarrier: "شركة الشحن",
    personaCarrierSub: "تمتلك السفن أو تديرها",
    personaTrucking: "شركة النقل البري",
    personaTruckingSub: "تستلم الحاويات بالشاحنات",
    personaTerminal: "مشغّل الميناء",
    personaTerminalSub: "يدير الميناء نفسه",

    loadingStep1: "جارٍ التحقق من الأوضاع الحالية",
    loadingStep2: "جارٍ تحديد مدى خطورة الوضع",
    loadingStep3: "جارٍ كتابة نصائح لشركات الشحن",
    loadingStep4: "جارٍ كتابة نصائح لشركات النقل البري",
    loadingStep5: "جارٍ كتابة نصائح لمشغّل الميناء",
    loadingNote: "يستغرق هذا حوالي 20–30 ثانية — الذكاء الاصطناعي يفكر في الأمر.",

    failedToLoad: "تعذّر تحميل بيانات الميناء المباشرة",
    somethingWentWrong: "حدث خطأ أثناء الحصول على التوصيات.",
  },
};

export function translate(locale: Locale, key: keyof typeof TRANSLATIONS["en"]): string {
  return TRANSLATIONS[locale][key] ?? TRANSLATIONS.en[key] ?? key;
}
