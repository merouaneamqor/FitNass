'use client';

import { FiCpu, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

type Feature = {
  icon: JSX.Element;
  title: string;
  description: string;
};

type FeaturesSectionProps = {
  features?: Feature[];
  title?: string;
  subtitle?: string;
};

// Get current locale from cookie
function getCurrentLocale(): string {
  if (typeof window !== 'undefined') {
    return Cookies.get('NEXT_LOCALE') || 'en';
  }
  return 'en';
}

// Translation function for features section
const t = (key: string): string => {
  const translations: Record<string, Record<string, string>> = {
    en: {
      "home.features.title": "Data-Driven Fitness Optimization",
      "home.features.subtitle": "FitNass leverages machine learning to transform your fitness journey through intelligent data analysis and personalized insights.",
      "home.features.findCourt": "Find Your Court",
      "home.features.findCourtDescription": "Search thousands of Padel & Tennis courts by location, time, and sport.",
      "home.features.joinMatches": "Join Matches & Find Players",
      "home.features.joinMatchesDescription": "Connect with players of your level and join public or private matches instantly.",
      "home.features.easyBooking": "Easy Booking",
      "home.features.easyBookingDescription": "Reserve your court or spot in a match with just a few clicks. Manage bookings easily."
    },
    fr: {
      "home.features.title": "Optimisation du fitness basée sur les données",
      "home.features.subtitle": "FitNass utilise l'apprentissage automatique pour transformer votre parcours de fitness grâce à l'analyse intelligente des données et des informations personnalisées.",
      "home.features.findCourt": "Trouvez Votre Terrain",
      "home.features.findCourtDescription": "Recherchez des milliers de terrains de Padel et de Tennis par lieu, heure et sport.",
      "home.features.joinMatches": "Rejoignez des Matchs & Trouvez des Joueurs",
      "home.features.joinMatchesDescription": "Connectez-vous avec des joueurs de votre niveau et rejoignez instantanément des matchs publics ou privés.",
      "home.features.easyBooking": "Réservation Facile",
      "home.features.easyBookingDescription": "Réservez votre terrain ou votre place dans un match en quelques clics. Gérez facilement vos réservations."
    },
    ar: {
      "home.features.title": "تحسين اللياقة البدنية القائم على البيانات",
      "home.features.subtitle": "تستخدم فتنس التعلم الآلي لتحويل رحلة اللياقة البدنية من خلال التحليل الذكي للبيانات والرؤى الشخصية.",
      "home.features.findCourt": "ابحث عن ملعبك",
      "home.features.findCourtDescription": "ابحث عن آلاف ملاعب البادل والتنس حسب الموقع والوقت والرياضة.",
      "home.features.joinMatches": "انضم إلى المباريات وابحث عن اللاعبين",
      "home.features.joinMatchesDescription": "تواصل مع لاعبين من مستواك وانضم إلى المباريات العامة أو الخاصة فوراً.",
      "home.features.easyBooking": "حجز سهل",
      "home.features.easyBookingDescription": "احجز ملعبك أو مكانك في مباراة بنقرات قليلة. إدارة الحجوزات بسهولة."
    }
  };

  const locale = getCurrentLocale();
  return translations[locale]?.[key] || translations.en[key] || key;
};

export default function FeaturesSection({ features, title, subtitle }: FeaturesSectionProps) {
  // Default features with translations
  const defaultFeatures = [
    {
      icon: <FiCpu className="h-8 w-8 text-red-500 dark:text-red-600 transition-colors" />,
      title: t("home.features.findCourt"),
      description: t("home.features.findCourtDescription")
    },
    {
      icon: <FiBarChart2 className="h-8 w-8 text-red-500 dark:text-red-600 transition-colors" />,
      title: t("home.features.joinMatches"),
      description: t("home.features.joinMatchesDescription")
    },
    {
      icon: <FiTrendingUp className="h-8 w-8 text-red-500 dark:text-red-600 transition-colors" />,
      title: t("home.features.easyBooking"),
      description: t("home.features.easyBookingDescription")
    }
  ];

  // If features are provided with translation keys, resolve them
  const displayFeatures = features ? features.map(feature => ({
    icon: feature.icon,
    title: t(feature.title),
    description: t(feature.description)
  })) : defaultFeatures;

  const isRTL = getCurrentLocale() === 'ar';

  return (
    // Conditional background with RTL support
    <section className={`py-16 md:py-24 bg-white dark:bg-gray-950 transition-colors duration-300 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          {/* Conditional heading text color */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase tracking-wider mb-4 transition-colors">
            {title || t("home.features.title")}
          </h2>
          {/* Conditional paragraph text color */}
          <p className="text-base md:text-lg text-gray-700 dark:text-neutral-300 font-inter font-medium max-w-2xl mx-auto transition-colors">
            {subtitle || t("home.features.subtitle")}
          </p>
        </div>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {displayFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              // Conditional card styles: background, border, shadow, hover border
              className="flex flex-col items-center text-center p-6 md:p-8 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl hover:border-yellow-400 dark:hover:border-yellow-500"
            >
              {/* Conditional icon background and border */}
              <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-700 transition-colors">
                {feature.icon}
              </div>
              {/* Conditional title text color */}
              <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-2 text-center transition-colors">{feature.title}</h3>
              {/* Conditional description text color */}
              <p className="text-gray-600 dark:text-neutral-400 text-sm font-inter text-center transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 