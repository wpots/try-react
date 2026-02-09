import type { AppLocale } from "@/i18n/config";

interface AboutTranslation {
  en: string;
  nl: string;
}

interface AboutArticle {
  heading: AboutTranslation;
  body: AboutTranslation;
}

export interface AboutChapter {
  title: AboutTranslation;
  intro: AboutTranslation;
  articles?: AboutArticle[];
}

export function translateAbout(
  value: AboutTranslation,
  locale: AppLocale,
): string {
  return value[locale];
}

export const aboutContent: AboutChapter[] = [
  {
    title: {
      en: "What is TRY?",
      nl: "Wat is TRY?",
    },
    intro: {
      en: "This tool is a helping hand in letting go of your eating disorder and finding the real you.",
      nl: "Deze app is er om je te helpen inzicht te krijgen in je eetprobleem en uiteindelijk je echte zelf terug te vinden.",
    },
  },
  {
    title: {
      en: "What TRY can do?",
      nl: "Wat kan TRY?",
    },
    intro: {
      en: "",
      nl: "",
    },
    articles: [
      {
        heading: {
          en: "Track:",
          nl: "Bijhouden:",
        },
        body: {
          en: "Add a picture, location, the company you were with, your emotions and behaviour. This app is web-based and your entries will be stored in your browser even if you do not have an account.",
          nl: "Voeg een foto toe, locatie, het gezelschap waar je mee was. Hoe voelde je je en heb je nog iets gedaan als gevolg van je eetmoment?",
        },
      },
      {
        heading: {
          en: "Export:",
          nl: "Exporteren:",
        },
        body: {
          en: "Choose which entries you want to export and download your overview in PDF format.",
          nl: "Kies welke dagen je wilt exporteren en download het overzicht in PDF-formaat.",
        },
      },
      {
        heading: {
          en: "Anytime and anywhere:",
          nl: "Altijd en overal:",
        },
        body: {
          en: "You can create an account with Google if you want to access your data from anywhere.",
          nl: "Je kunt meteen beginnen met het bijhouden van je dagboek. Als je je gegevens altijd bij je wilt hebben, kun je eenvoudig een account aanmaken met Google.",
        },
      },
      {
        heading: {
          en: "Improve:",
          nl: "Feedback geven:",
        },
        body: {
          en: "If you feel you are missing a feature you can let us know. We value feedback on how to improve this app.",
          nl: "Heb je een voorstel voor een verbetering of werkt er iets niet goed? Laat het ons weten.",
        },
      },
      {
        heading: {
          en: "Share:",
          nl: "Delen of aanbevelen:",
        },
        body: {
          en: "Recommend or share this app with someone you think might benefit from it, or because it helped you out.",
          nl: "Deze app kun je aanbevelen aan iemand die hem kan gebruiken, of delen met mensen omdat je er zelf iets aan hebt gehad.",
        },
      },
    ],
  },
  {
    title: {
      en: "What TRY is still working on?",
      nl: "Waar werken we nog aan voor TRY?",
    },
    intro: {
      en: "Our aim is to keep it simple, but there are some new features and improvements that we will keep implementing over time.",
      nl: "We willen het graag simpel houden, maar er zijn wat verbeteringen die we binnenkort gaan doorvoeren.",
    },
    articles: [
      {
        heading: {
          en: "Coping skills:",
          nl: "Hulp / handvatten:",
        },
        body: {
          en: "Having an off day or need some inspiration to get out of your own head? We will be adding tips pages and a meditation tool.",
          nl: "Heb je een slechte dag of afleiding nodig? We zullen een tipspagina maken en misschien zelf een meditatietool.",
        },
      },
      {
        heading: {
          en: "Flags and filters:",
          nl: "Vlaggen en filteren:",
        },
        body: {
          en: "Flag a moment so you can discuss it later with your physician.",
          nl: "Zet een vlag bij dagen die je met je begeleider of maatje wilt bespreken.",
        },
      },
      {
        heading: {
          en: "Notifications:",
          nl: "Notificaties:",
        },
        body: {
          en: "Want a friendly reminder to track your lunch? Maybe a weekly summary of your progress?",
          nl: "Wil je een notificatie krijgen dat je nog even je lunch moet noteren? Misschien vind je het fijn om een weekoverzicht te ontvangen.",
        },
      },
      {
        heading: {
          en: "Buddies:",
          nl: "Begeleiding:",
        },
        body: {
          en: "With flags and filters in place, you can connect a buddy (likely your physician, but it can be anyone you grant access). Your buddy can respond to your moments with messages, and you can ask for help directly.",
          nl: "Als we de vlaggen- en filterfunctie af hebben, is het handig als er voor je begeleider ook een inlogmogelijkheid is in jouw dagboek, zodat jullie directer contact kunnen hebben over moeilijke momenten.",
        },
      },
      {
        heading: {
          en: "Statistics:",
          nl: "Statistieken:",
        },
        body: {
          en: "See an overview of good and bad days, with graphs that show your progress toward your goals.",
          nl: "In een overzicht je goede en slechte dagen. Grafieken met je vooruitgang.",
        },
      },
      {
        heading: {
          en: "Epiphanies:",
          nl: "Inzichten:",
        },
        body: {
          en: "Alongside motivational quotes, your own healing thoughts can become part of your journey. Think yours might help others? Make them public.",
          nl: "Op de overzichtspagina willen we je meer verschillende helende gedachten toefluisteren. Eigen inzichten kunnen toevoegen die jou helpen bij het bereiken van je doel.",
        },
      },
      {
        heading: {
          en: "Customization:",
          nl: "Personaliseren:",
        },
        body: {
          en: "Would it not be helpful if you could add your own locations and company?",
          nl: "Zou het niet handig zijn als je bij bestaand gezelschap en locaties je eigen opties kunt toevoegen?",
        },
      },
    ],
  },
];
