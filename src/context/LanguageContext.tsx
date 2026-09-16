import React, { createContext, useContext, useState } from 'react';
import { dictionary } from '../useTranslation'; // مسار ملف القاموس الخاص بك

type LangType = 'ar' | 'en';

interface LanguageContextType {
  lang: LangType;
  toggleLang: () => void;
  t: typeof dictionary.ar;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  toggleLang: () => {},
  t: dictionary.ar,
  dir: 'rtl',
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<LangType>('ar');

  const toggleLang = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      toggleLang, 
      t: dictionary[lang], 
      dir: lang === 'ar' ? 'rtl' : 'ltr' 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);