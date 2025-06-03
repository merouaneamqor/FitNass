import { use } from 'react';
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';

export const getTranslations = async (locale: string, namespaces: string[]) => {
  const i18nInstance = createInstance();
  
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: 'en',
      supportedLngs: ['en', 'fr', 'ar'],
      defaultNS: 'common',
      fallbackNS: 'common',
      ns: namespaces,
      react: { useSuspense: false },
    });
  
  return {
    i18n: i18nInstance,
    resources: namespaces.reduce((acc, ns) => {
      acc[ns] = i18nInstance.getResourceBundle(locale, ns);
      return acc;
    }, {} as Record<string, any>),
    t: (key: string, options?: any) => i18nInstance.t(key, options) as string,
  };
};

export function useTranslation(namespace: string | string[] = 'common') {
  const ns = Array.isArray(namespace) ? namespace : [namespace];
  return use(getTranslations('en', ns));
} 

// Get current locale from cookie
export function getCurrentLocale(): string {
  if (typeof window !== 'undefined') {
    return Cookies.get('NEXT_LOCALE') || 'en';
  }
  return 'en';
}

// Check if the current language is RTL
export function isRTL(): boolean {
  return getCurrentLocale() === 'ar';
} 