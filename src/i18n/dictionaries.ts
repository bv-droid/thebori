import type { Locale } from "./config";

// NOTE: KZ copy is best-effort and MUST be reviewed by a native Kazakh
// brand copywriter before launch (per spec §19). Flagged: // TODO(kz-native)

export type Dict = {
  signal: {
    status: string;
    protocol: string;
    instruction: string;
    holdHint: string;
    tapHint: string;
    enter: string;
    targeting: string;
    locked: string;
    soundOn: string;
    soundOff: string;
    valueProp: string;
    telemetry: {
      train: string;
      altitude: string;
      accl: string;
      load: string;
      oxygen: string;
      pace: string;
      sector: string;
    };
  };
  nav: {
    manifesto: string;
    fieldTest: string;
    territories: string;
    foundingPack: string;
    join: string;
  };
  hero: {
    brand: string;
    tagline: string;
    cta: string;
    scroll: string;
    micro: {
      detected: string;
      list: [string, string, string];
      protocol: string;
      activating: string;
      location: string;
      visibility: string;
    };
  };
  sound: { on: string; off: string; label: string };
  journey: {
    kicker: string;
    city: { t: string; s: string };
    road: { t: string; s: string };
    field: { t: string; s: string };
  };
  manifesto: {
    kicker: string;
    headline: string;
    lines: { em: string; rest: string }[];
  };
  fieldTest: {
    kicker: string;
    title: string;
    intro: string;
    modules: { id: string; name: string; caption: string; status: string }[];
  };
  founding: {
    kicker: string;
    title: string;
    lead: string;
    benefits: string[];
    cardLabel: string;
    cardStatus: string;
    note: string;
    counter: { label: string; remaining: string };
    pack: {
      title: string;
      lead: string;
      perYear: string;
      perSeason: string;
      deliveryLabel: string;
      deliveryValue: string;
      depositLabel: string;
      recommended: string;
      cta: string;
      ctaWaitlist: string;
      announce: string;
      tiers: {
        standard: { name: string; tagline: string; items: string[] };
        kokbori: { name: string; tagline: string; items: string[] };
        premium: { name: string; tagline: string; items: string[] };
      };
    };
  };
  waitlist: {
    kicker: string;
    title: string;
    lead: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    consent: string;
    policy: string;
    cta: string;
    submitting: string;
    errEmail: string;
    errConsent: string;
    errGeneric: string;
    success: {
      title: string;
      lead: string;
      idLabel: string;
      statusLabel: string;
      share: string;
      shareText: string;
      copied: string;
      nextTitle: string;
      steps: string[];
    };
  };
  footer: {
    statement: string;
    navTitle: string;
    connectTitle: string;
    followTitle: string;
    rights: string;
    location: string;
    backToTop: string;
  };
  cookies: {
    text: string;
    accept: string;
    essential: string;
    learn: string;
  };
};

export const dictionaries: Record<Locale, Dict> = {
  ru: {
    signal: {
      status: "СИГНАЛ ОБНАРУЖЕН",
      protocol: "STEPPE PROTOCOL",
      instruction: "Нажми и удерживай, чтобы войти",
      holdHint: "Удерживай",
      tapHint: "или нажми, чтобы войти",
      enter: "Войти в протокол",
      targeting: "Наведение",
      locked: "Захват",
      soundOn: "Звук вкл",
      soundOff: "Звук выкл",
      valueProp: "Функциональная одежда из Казахстана",
      telemetry: {
        train: "ГОРНАЯ ПОДГОТОВКА",
        altitude: "ВЫСОТА",
        accl: "АККЛИМАТИЗАЦИЯ",
        load: "НАГРУЗКА",
        oxygen: "КИСЛОРОД",
        pace: "ТЕМП",
        sector: "СЕКТОР",
      },
    },
    nav: {
      manifesto: "Манифест",
      fieldTest: "Полевые испытания",
      territories: "Территории",
      foundingPack: "Founding Pack",
      join: "Присоединиться",
    },
    hero: {
      brand: "BØRI",
      tagline: "Сила внутри",
      cta: "Присоединись к стае",
      scroll: "листай",
      micro: {
        detected: "СИГНАЛ ОБНАРУЖЕН",
        list: ["ГОРОД", "ДОРОГА", "ПОЛЕ"],
        protocol: "STEPPE PROTOCOL",
        activating: "ПРОТОКОЛ АКТИВИРУЕТСЯ",
        location: "KZ // АСТАНА",
        visibility: "ВИДИМОСТЬ: ОГРАНИЧЕНА",
      },
    },
    sound: { on: "ЗВУК ВКЛ", off: "ЗВУК ВЫКЛ", label: "Звук" },
    journey: {
      kicker: "ТРИ ТЕРРИТОРИИ",
      city: { t: "ГОРОД", s: "Движение · Ритм · Адаптация" },
      road: { t: "ДОРОГА", s: "Дистанция · Защита · Универсальность" },
      field: { t: "ПОЛЕ", s: "Выносливость · Свобода · Территория" },
    },
    manifesto: {
      kicker: "МАНИФЕСТ",
      headline: "Мы создаём одежду для тех, кто движется вперёд",
      lines: [
        { em: "Сила", rest: " не требует шума." },
        { em: "Интеллект", rest: " проявляется в деталях." },
        { em: "Победа", rest: " любит подготовленных." },
      ],
    },
    fieldTest: {
      kicker: "ПОЛЕВЫЕ ИСПЫТАНИЯ",
      title: "FIELD TEST PROGRAM",
      intro: "Коллекция раскрыта не полностью. Испытания уже идут.",
      modules: [
        { id: "01", name: "SHELL", caption: "Влагозащита · дыхание · лёгкая защита", status: "ТЕСТОВАЯ СЕРИЯ" },
        { id: "02", name: "HARDWARE", caption: "Молнии · пряжки · фиксаторы", status: "АКТИВНАЯ РАЗРАБОТКА" },
        { id: "03", name: "CONSTRUCTION", caption: "Усиленные швы · мобильность", status: "РЕВИЗИЯ ПРОТОТИПА" },
        { id: "04", name: "MODULARITY", caption: "Стропы · карманы · адаптивность", status: "ОГРАНИЧЕННЫЙ ПРОГОН" },
      ],
    },
    founding: {
      kicker: "FOUNDING PACK",
      title: "Стая начинается с первого круга",
      lead: "Стань частью основания BORI. Приоритетный доступ к первой коллекции, прототипам и эксклюзивным материалам — и право влиять на то, каким будет бренд.",
      benefits: [
        "Ранний доступ к первым релизам",
        "Обновления прототипов и разработки",
        "Эксклюзивные материалы",
        "Личный Pack ID",
        "Приоритетные уведомления",
      ],
      cardLabel: "BORI PACK ID",
      cardStatus: "STATUS: FOUNDING MEMBER",
      note: "Часть привилегий — планируется и может уточняться.",
      counter: { label: "уже в стае", remaining: "осталось {n} из 500 мест" },
      pack: {
        title: "Протокол основателя",
        lead: "500 мест. 4 сезонных комплекта в год — осень, зима, весна, лето. Полная экипировка от головы до ног.",
        perYear: "в год",
        perSeason: "за сезон",
        deliveryLabel: "Первая поставка",
        deliveryValue: "сентябрь 2026",
        depositLabel: "Бронь — возвратный депозит",
        recommended: "Рекомендуем",
        cta: "Забронировать место",
        ctaWaitlist: "Войти в лист ожидания",
        announce: "Анонс · цены и старт — при запуске",
        tiers: {
          standard: {
            name: "СТАНДАРТ · СҰР",
            tagline: "Полный сезонный комплект в фирменном цвете СҰР",
            items: [
              "4 сезонных комплекта в год",
              "Верхний слой + средний слой + база + низ",
              "Носки и аксессуар каждого сезона",
              "Фирменный цвет СҰР, базовая фурнитура",
              "Личный нумерованный Pack ID",
            ],
          },
          kokbori: {
            name: "КӨКБӨРІ",
            tagline: "Стандарт + эксклюзивный камуфляж КӨКБӨРІ и приоритет",
            items: [
              "Всё из «Стандарт»",
              "Геройские вещи в камуфляже КӨКБӨРІ (верх + головной убор)",
              "Нижнее бельё и термослой в комплекте",
              "Приоритетные размеры и обмен",
              "Именная фурнитура",
            ],
          },
          premium: {
            name: "ПРЕМИУМ",
            tagline: "Только 50 мест. Расширенный набор и консьерж",
            items: [
              "Всё из «КӨКБӨРІ», расширенный комплект",
              "Доп. сезонные дропы аксессуаров КӨКБӨРІ",
              "Персональная примерка (консьерж, Астана)",
              "Пожизненная фиксация цены",
              "Первый доступ к будущим коллекциям",
            ],
          },
        },
      },
    },
    waitlist: {
      kicker: "ПРИСОЕДИНИСЬ К СТАЕ",
      title: "Войди в первый состав",
      lead: "Оставь контакт — получишь личный Pack ID, приоритетный доступ к первым релизам и статус founding member.",
      namePlaceholder: "Имя",
      emailPlaceholder: "Email",
      consent: "Согласен на обработку данных",
      policy: "Политика конфиденциальности",
      cta: "Получить Pack ID",
      submitting: "Активация…",
      errEmail: "Введите корректный email",
      errConsent: "Нужно согласие на обработку данных",
      errGeneric: "Что-то пошло не так. Попробуй ещё раз.",
      success: {
        title: "Добро пожаловать в стаю",
        lead: "Твой Pack ID закреплён. Скоро пришлём первые сигналы.",
        idLabel: "BORI PACK ID",
        statusLabel: "STATUS: FOUNDING MEMBER",
        share: "Пригласить своих",
        shareText: "Я в стае BØRI. STEPPE PROTOCOL. Заходи первым:",
        copied: "Ссылка скопирована",
        nextTitle: "Что дальше",
        steps: [
          "Твой Pack ID закреплён за тобой.",
          "Перед стартом founding-доступа пришлём первый сигнал.",
          "Точные даты и цены — при запуске.",
        ],
      },
    },
    footer: {
      statement: "Сила внутри. Стая — снаружи.",
      navTitle: "Навигация",
      connectTitle: "Связь",
      followTitle: "Соцсети",
      rights: "© 2026 BØRI. Все права защищены.",
      location: "Астана · Казахстан",
      backToTop: "Наверх",
    },
    cookies: {
      text: "Мы используем cookies — для языка по региону и аналитики опыта.",
      accept: "Принять",
      essential: "Только необходимые",
      learn: "Подробнее",
    },
  },

  en: {
    signal: {
      status: "SIGNAL DETECTED",
      protocol: "STEPPE PROTOCOL",
      instruction: "Press and hold to enter",
      holdHint: "Hold",
      tapHint: "or tap to enter",
      enter: "Enter the protocol",
      targeting: "Targeting",
      locked: "Locked",
      soundOn: "Sound on",
      soundOff: "Sound off",
      valueProp: "Functional apparel from Kazakhstan",
      telemetry: {
        train: "ALTITUDE TRAINING",
        altitude: "ALTITUDE",
        accl: "ACCLIMATIZATION",
        load: "PACK LOAD",
        oxygen: "OXYGEN",
        pace: "PACE",
        sector: "SECTOR",
      },
    },
    nav: {
      manifesto: "Manifesto",
      fieldTest: "Field Test",
      territories: "Territories",
      foundingPack: "Founding Pack",
      join: "Join",
    },
    hero: {
      brand: "BØRI",
      tagline: "Strength within",
      cta: "Join the pack",
      scroll: "scroll",
      micro: {
        detected: "SIGNAL DETECTED",
        list: ["CITY", "ROAD", "FIELD"],
        protocol: "STEPPE PROTOCOL",
        activating: "PROTOCOL ACTIVATING",
        location: "KZ // ASTANA",
        visibility: "VISIBILITY: LIMITED",
      },
    },
    sound: { on: "SOUND ON", off: "SOUND OFF", label: "Sound" },
    journey: {
      kicker: "THREE TERRITORIES",
      city: { t: "CITY", s: "Movement · Rhythm · Adaptation" },
      road: { t: "ROAD", s: "Distance · Protection · Universality" },
      field: { t: "FIELD", s: "Endurance · Freedom · Territory" },
    },
    manifesto: {
      kicker: "MANIFESTO",
      headline: "We create clothing for those who move forward",
      lines: [
        { em: "Strength", rest: " does not require noise." },
        { em: "Intelligence", rest: " reveals itself in detail." },
        { em: "Victory", rest: " favors the prepared." },
      ],
    },
    fieldTest: {
      kicker: "FIELD TEST",
      title: "FIELD TEST PROGRAM",
      intro: "The collection is not fully revealed. The testing has already begun.",
      modules: [
        { id: "01", name: "SHELL", caption: "Water-repellent · breathable · light armor", status: "TEST SERIES" },
        { id: "02", name: "HARDWARE", caption: "Zippers · buckles · pulls", status: "ACTIVE DEVELOPMENT" },
        { id: "03", name: "CONSTRUCTION", caption: "Reinforced seams · mobility", status: "PROTOTYPE REVISION" },
        { id: "04", name: "MODULARITY", caption: "Straps · pockets · adaptability", status: "LIMITED TEST RUN" },
      ],
    },
    founding: {
      kicker: "FOUNDING PACK",
      title: "The pack begins with the first circle",
      lead: "Become part of BORI's founding. Priority access to the first collection, prototypes and exclusive materials — and a say in what the brand becomes.",
      benefits: [
        "Early access to first releases",
        "Prototype & development updates",
        "Exclusive materials",
        "Personal Pack ID",
        "Priority notifications",
      ],
      cardLabel: "BORI PACK ID",
      cardStatus: "STATUS: FOUNDING MEMBER",
      note: "Some privileges are planned and may change.",
      counter: { label: "already in the pack", remaining: "{n} of 500 seats left" },
      pack: {
        title: "The Founder's Protocol",
        lead: "500 seats. 4 seasonal kits a year — autumn, winter, spring, summer. Full head-to-toe outfit.",
        perYear: "per year",
        perSeason: "per season",
        deliveryLabel: "First delivery",
        deliveryValue: "September 2026",
        depositLabel: "Reserve — refundable deposit",
        recommended: "Recommended",
        cta: "Reserve your seat",
        ctaWaitlist: "Join the waitlist",
        announce: "Announcement · pricing & launch at release",
        tiers: {
          standard: {
            name: "STANDARD · СҰР",
            tagline: "A full seasonal kit in the signature СҰР colourway",
            items: [
              "4 seasonal kits a year",
              "Outer + mid layer + base + bottoms",
              "Socks and an accessory each season",
              "Signature СҰР colourway, standard hardware",
              "Personal numbered Pack ID",
            ],
          },
          kokbori: {
            name: "KÖKBÖRI",
            tagline: "Standard + exclusive KÖKBÖRI camo and priority",
            items: [
              "Everything in Standard",
              "Hero pieces in KÖKBÖRI camo (outerwear + headwear)",
              "Underwear and thermal layer included",
              "Priority sizing and exchange",
              "Named hardware",
            ],
          },
          premium: {
            name: "PREMIUM",
            tagline: "Only 50 seats. Enriched kit and concierge",
            items: [
              "Everything in KÖKBÖRI, enriched kit",
              "Extra seasonal KÖKBÖRI accessory drops",
              "In-person concierge fitting (Astana)",
              "Lifetime price-lock",
              "First access to future collections",
            ],
          },
        },
      },
    },
    waitlist: {
      kicker: "JOIN THE PACK",
      title: "Enter the first circle",
      lead: "Leave your contact — get a personal Pack ID, priority access to the first releases and founding-member status.",
      namePlaceholder: "Name",
      emailPlaceholder: "Email",
      consent: "I agree to data processing",
      policy: "Privacy policy",
      cta: "Get my Pack ID",
      submitting: "Activating…",
      errEmail: "Enter a valid email",
      errConsent: "Consent to data processing is required",
      errGeneric: "Something went wrong. Try again.",
      success: {
        title: "Welcome to the pack",
        lead: "Your Pack ID is locked in. The first signals are coming soon.",
        idLabel: "BORI PACK ID",
        statusLabel: "STATUS: FOUNDING MEMBER",
        share: "Invite your own",
        shareText: "I'm in the BØRI pack. STEPPE PROTOCOL. Get in first:",
        copied: "Link copied",
        nextTitle: "What happens next",
        steps: [
          "Your Pack ID is reserved for you.",
          "We'll send the first signal before founding access opens.",
          "Exact dates and pricing — at launch.",
        ],
      },
    },
    footer: {
      statement: "The strength is within. The pack is around you.",
      navTitle: "Navigate",
      connectTitle: "Contact",
      followTitle: "Follow",
      rights: "© 2026 BØRI. All rights reserved.",
      location: "Astana · Kazakhstan",
      backToTop: "Back to top",
    },
    cookies: {
      text: "We use cookies — for regional language and experience analytics.",
      accept: "Accept",
      essential: "Essential only",
      learn: "Learn more",
    },
  },

  kz: {
    signal: {
      status: "СИГНАЛ АНЫҚТАЛДЫ", // TODO(kz-native)
      protocol: "STEPPE PROTOCOL",
      instruction: "Кіру үшін басып ұста", // TODO(kz-native)
      holdHint: "Ұста",
      tapHint: "немесе кіру үшін бас",
      enter: "Хаттамаға кіру",
      targeting: "Нысана алу", // TODO(kz-native)
      locked: "Бекітілді", // TODO(kz-native)
      soundOn: "Дыбыс қосулы", // TODO(kz-native)
      soundOff: "Дыбыс өшірулі", // TODO(kz-native)
      valueProp: "Қазақстаннан функционалды киім", // TODO(kz-native)
      telemetry: {
        train: "ТАУ ДАЙЫНДЫҒЫ", // TODO(kz-native)
        altitude: "БИІКТІК",
        accl: "БЕЙІМДЕЛУ", // TODO(kz-native)
        load: "ЖҮКТЕМЕ",
        oxygen: "ОТТЕГІ",
        pace: "ҚАРҚЫН",
        sector: "СЕКТОР",
      },
    },
    nav: {
      manifesto: "Манифест",
      fieldTest: "Дала сынағы",
      territories: "Аумақтар",
      foundingPack: "Founding Pack",
      join: "Қосылу",
    },
    hero: {
      brand: "BØRI",
      tagline: "Күш — ішінде", // TODO(kz-native)
      cta: "Үйірге қосыл", // TODO(kz-native)
      scroll: "төмен",
      micro: {
        detected: "СИГНАЛ АНЫҚТАЛДЫ",
        list: ["ҚАЛА", "ЖОЛ", "ДАЛА"],
        protocol: "STEPPE PROTOCOL",
        activating: "ХАТТАМА ІСКЕ ҚОСЫЛУДА",
        location: "KZ // АСТАНА",
        visibility: "КӨРІНУ: ШЕКТЕУЛІ",
      },
    },
    sound: { on: "ДЫБЫС ҚОСУЛЫ", off: "ДЫБЫС ӨШІРУЛІ", label: "Дыбыс" },
    journey: {
      kicker: "ҮШ АУМАҚ",
      city: { t: "ҚАЛА", s: "Қозғалыс · Ырғақ · Бейімделу" }, // TODO(kz-native)
      road: { t: "ЖОЛ", s: "Қашықтық · Қорғаныс · Әмбебаптық" }, // TODO(kz-native)
      field: { t: "ДАЛА", s: "Төзімділік · Еркіндік · Аумақ" }, // TODO(kz-native)
    },
    manifesto: {
      kicker: "МАНИФЕСТ",
      headline: "Біз алға ұмтылғандарға арнап киім жасаймыз", // TODO(kz-native)
      lines: [
        { em: "Күш", rest: " шуды қажет етпейді." }, // TODO(kz-native)
        { em: "Зерде", rest: " бөлшекте көрінеді." },
        { em: "Жеңіс", rest: " дайын болғандарды жақсы көреді." }, // TODO(kz-native)
      ],
    },
    fieldTest: {
      kicker: "ДАЛА СЫНАҒЫ",
      title: "FIELD TEST PROGRAM",
      intro: "Коллекция толық ашылмаған. Сынақтар басталып кетті.", // TODO(kz-native)
      modules: [
        { id: "01", name: "SHELL", caption: "Ылғалдан қорғау · тыныс · жеңіл қорған", status: "СЫНАҚ СЕРИЯСЫ" }, // TODO(kz-native)
        { id: "02", name: "HARDWARE", caption: "Сыдырмалар · тоғалар · бекіткіштер", status: "БЕЛСЕНДІ ӘЗІРЛЕУ" },
        { id: "03", name: "CONSTRUCTION", caption: "Күшейтілген тігістер · қозғалғыштық", status: "ПРОТОТИП ТҮЗЕТУІ" },
        { id: "04", name: "MODULARITY", caption: "Баулар · қалталар · бейімделу", status: "ШЕКТЕУЛІ СЫНАҚ" },
      ],
    },
    founding: {
      kicker: "FOUNDING PACK",
      title: "Үйір алғашқы шеңберден басталады", // TODO(kz-native)
      lead: "BORI негізін қалаушылардың бірі бол. Алғашқы коллекцияға, прототиптерге және эксклюзив материалдарға басым қол жеткізу — әрі бренд қандай болатынына ықпал ету.", // TODO(kz-native)
      benefits: [
        "Алғашқы релиздерге ерте қол жеткізу",
        "Прототип пен әзірлеу жаңалықтары",
        "Эксклюзив материалдар",
        "Жеке Pack ID",
        "Басым хабарландырулар",
      ],
      cardLabel: "BORI PACK ID",
      cardStatus: "STATUS: FOUNDING MEMBER",
      note: "Кейбір артықшылықтар жоспарлануда және өзгеруі мүмкін.", // TODO(kz-native)
      counter: { label: "үйірде", remaining: "500 орынның {n} қалды" }, // TODO(kz-native)
      pack: {
        // TODO(kz-native): review all Kazakh copy below
        title: "Құрылтайшы хаттамасы",
        lead: "500 орын. Жылына 4 маусымдық жинақ — күз, қыс, көктем, жаз. Бастан-аяқ толық жабдық.",
        perYear: "жылына",
        perSeason: "маусымына",
        deliveryLabel: "Алғашқы жеткізу",
        deliveryValue: "қыркүйек 2026",
        depositLabel: "Брондау — қайтарымды депозит",
        recommended: "Ұсынамыз",
        cta: "Орынды брондау",
        ctaWaitlist: "Күту тізіміне кіру",
        announce: "Анонс · баға мен старт — шығарылымда", // TODO(kz-native)
        tiers: {
          standard: {
            name: "СТАНДАРТ · СҰР",
            tagline: "Фирмалық СҰР түсіндегі толық маусымдық жинақ",
            items: [
              "Жылына 4 маусымдық жинақ",
              "Сыртқы + орта қабат + база + төменгі",
              "Әр маусымда шұлық пен аксессуар",
              "Фирмалық СҰР түсі, базалық фурнитура",
              "Жеке нөмірленген Pack ID",
            ],
          },
          kokbori: {
            name: "КӨКБӨРІ",
            tagline: "Стандарт + эксклюзив КӨКБӨРІ камуфляжы және басымдық",
            items: [
              "«Стандарттағы» барлығы",
              "КӨКБӨРІ камуфляжындағы герой-заттар (сырт + бас киім)",
              "Іш киім мен термоқабат жинақта",
              "Басым өлшемдер мен айырбас",
              "Атаулы фурнитура",
            ],
          },
          premium: {
            name: "ПРЕМИУМ",
            tagline: "Тек 50 орын. Кеңейтілген жинақ және консьерж",
            items: [
              "«КӨКБӨРІ» барлығы, кеңейтілген жинақ",
              "Қосымша маусымдық КӨКБӨРІ аксессуар дроптары",
              "Жеке өлшеу (консьерж, Астана)",
              "Бағаны өмірлік бекіту",
              "Болашақ коллекцияларға бірінші қол жеткізу",
            ],
          },
        },
      },
    },
    waitlist: {
      kicker: "ҮЙІРГЕ ҚОСЫЛ",
      title: "Алғашқы құрамға кір", // TODO(kz-native)
      lead: "Байланысыңды қалдыр — жеке Pack ID, алғашқы релиздерге басым қол жеткізу және founding member мәртебесін аласың.", // TODO(kz-native)
      namePlaceholder: "Аты",
      emailPlaceholder: "Email",
      consent: "Деректерді өңдеуге келісемін",
      policy: "Құпиялылық саясаты", // TODO(kz-native)
      cta: "Pack ID алу",
      submitting: "Іске қосылуда…",
      errEmail: "Дұрыс email енгізіңіз",
      errConsent: "Деректерді өңдеуге келісім қажет",
      errGeneric: "Бірдеңе дұрыс болмады. Қайталап көріңіз.",
      success: {
        title: "Үйірге қош келдің", // TODO(kz-native)
        lead: "Pack ID-ің бекітілді. Жақында алғашқы сигналдар келеді.",
        idLabel: "BORI PACK ID",
        statusLabel: "STATUS: FOUNDING MEMBER",
        share: "Өзіңдікілерді шақыр",
        shareText: "Мен BØRI үйіріндемін. STEPPE PROTOCOL. Бірінші бол:", // TODO(kz-native)
        copied: "Сілтеме көшірілді",
        nextTitle: "Әрі қарай не болады", // TODO(kz-native)
        steps: [
          "Pack ID-ің саған бекітілді.",
          "Founding-қол жеткізу басталар алдында алғашқы сигналды жібереміз.",
          "Нақты күндер мен бағалар — іске қосылғанда.",
        ], // TODO(kz-native)
      },
    },
    footer: {
      statement: "Күш — ішінде. Қасқыр үйірі — сыртында.", // TODO(kz-native)
      navTitle: "Навигация", // TODO(kz-native)
      connectTitle: "Байланыс",
      followTitle: "Әлеуметтік желілер",
      rights: "© 2026 BØRI. Барлық құқықтар қорғалған.",
      location: "Астана · Қазақстан",
      backToTop: "Жоғарыға",
    },
    cookies: {
      text: "Біз cookie қолданамыз — аймақтық тіл және тәжірибе аналитикасы үшін.", // TODO(kz-native)
      accept: "Қабылдау",
      essential: "Тек қажеттілер",
      learn: "Толығырақ",
    },
  },
};
