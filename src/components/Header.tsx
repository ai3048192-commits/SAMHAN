import React, { useState, useEffect } from 'react';
import { 
  Home, 
  User,
  Palette, 
  Briefcase, 
  Mail, 
  Languages 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; 
import ThemeToggle from './ThemeToggle'; 
import { supabase } from '../lib/supabaseClient';

type HeaderProps = {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  logoUrl?: string; // يمكنك استقباله كخاصية أو جلبه تلقائياً
};

const accent = {
  textClass: 'text-orange-500', 
  bgClass: 'bg-orange-500/15', 
  borderClass: 'border-orange-500/40', 
  shadowClass: 'shadow-[0_0_15px_rgba(249,115,22,0.25)]', 
  hex: '#f97316' 
};

export default function GraphicDesignerHeader({ isDark, setIsDark, logoUrl: propLogoUrl }: HeaderProps) {
  const [activeHash, setActiveHash] = useState('#home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [dynamicLogo, setDynamicLogo] = useState<string>('');
  
  const { lang, toggleLang, dir } = useLanguage();

  // جلب الشعار من Supabase مباشرة عند تحميل الهيدر إذا لم يتم تمريره كـ prop
  useEffect(() => {
    if (!propLogoUrl) {
      fetchLogoFromSupabase();
    }
  }, [propLogoUrl]);

  const fetchLogoFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('logo_url')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (!error && data?.logo_url) {
        setDynamicLogo(data.logo_url);
      }
    } catch (err) {
      console.error('Error fetching logo:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const translations = {
    ar: {
      items: [
        { name: 'الرئيسية', targetId: 'home', icon: Home, num: '01' },
        { name: 'من أنا', targetId: 'about', icon: User, num: '02' },
        { name: 'الخدمات', targetId: 'services', icon: Palette, num: '03' },
        { name: 'أعمالي', targetId: 'portfolio', icon: Briefcase, num: '04' },
        { name: 'تواصل', targetId: 'contact', icon: Mail, num: '05' },
      ]
    },
    en: {
      items: [
        { name: 'Home', targetId: 'home', icon: Home, num: '01' },
        { name: 'About', targetId: 'about', icon: User, num: '02' },
        { name: 'Services', targetId: 'services', icon: Palette, num: '03' },
        { name: 'Portfolio', targetId: 'portfolio', icon: Briefcase, num: '04' },
        { name: 'Contact', targetId: 'contact', icon: Mail, num: '05' },
      ]
    }
  };

  const t = translations[lang] || translations.ar;

  const scrollToSection = (targetId: string) => {
    setActiveHash(`#${targetId}`);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // الشعار النهائي (المرسل عبر الـ props أو المجلوب من قاعدة البيانات أو الافتراضي كاحتياط)
  const defaultLogo = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80";
  const finalLogoUrl = propLogoUrl || dynamicLogo || defaultLogo;

  return (
    <div dir={dir} className="select-none w-full">
      
      {/* 🖥️ هيدر الديسكتوب الثابت */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'pt-3 px-4 sm:px-6' : 'pt-6 px-4 sm:px-6'
      }`}>
        <header className={`max-w-5xl mx-auto hidden md:flex items-center justify-between transition-all duration-300 ${
          isDark 
            ? (isScrolled ? 'bg-[#0a0a0e]/95 backdrop-blur-2xl' : 'bg-[#121216]/90 backdrop-blur-xl') + ` border ${accent.borderClass} shadow-[0_10px_30px_rgba(0,0,0,0.8)]`
            : (isScrolled ? 'bg-white/90 backdrop-blur-2xl' : 'bg-slate-100/90 backdrop-blur-xl') + ` border ${accent.borderClass} shadow-xl`
        } rounded-2xl px-6 py-3`}>
          
          <div className="flex items-center">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="cursor-pointer">
              <img 
                src={finalLogoUrl} 
                alt="Logo" 
                className="h-8 w-8 rounded-lg object-cover"
              />
            </a>
          </div>

          <nav className={`flex items-center gap-1.5 p-1 rounded-xl border ${isDark ? 'bg-[#09090b]/80 border-white/5' : 'bg-slate-200/60 border-slate-300/40'}`}>
            {t.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeHash === `#${item.targetId}`;
              return (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.targetId)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-300 group cursor-pointer ${
                    isActive
                      ? `${accent.bgClass} ${accent.textClass} border ${accent.borderClass} font-bold ${accent.shadowClass} scale-[1.02]`
                      : isDark 
                        ? 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-black/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? accent.textClass : (isDark ? 'text-gray-400' : 'text-slate-500')}`} />
                  <span>{item.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive 
                      ? `${accent.bgClass} ${accent.textClass}` 
                      : isDark ? 'bg-white/5 text-gray-500' : 'bg-black/5 text-slate-500'
                  }`}>
                    {item.num}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />

            <button
              onClick={toggleLang}
              className={`relative group overflow-hidden flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10' 
                  : 'bg-black/[0.03] hover:bg-black/[0.06] text-slate-800 border border-black/10'
              } hover:scale-105 active:scale-95 shadow-sm`}
              type="button"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Languages className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-12 ${accent.textClass}`} />
              <div className="flex items-center gap-1 text-xs font-bold font-mono tracking-wider">
                <span className={lang === 'ar' ? accent.textClass : 'opacity-40'}>AR</span>
                <span className="opacity-30">/</span>
                <span className={lang === 'en' ? accent.textClass : 'opacity-40'}>EN</span>
              </div>
            </button>
          </div>

        </header>
      </div>

      {/* 📱 هيدر الموبايل السفلي */}
      <div className="md:hidden fixed bottom-5 left-3 right-3 z-50">
        <nav className={`backdrop-blur-2xl ${
          isDark ? 'bg-[#121216]/95 border-white/10' : 'bg-white/95 border-slate-200'
        } border ${accent.borderClass} rounded-2xl p-1.5 flex items-center justify-around shadow-2xl`}>
          {t.items.map((item) => {
            const Icon = item.icon;
            const isActive = activeHash === `#${item.targetId}`;
            return (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.targetId)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? `${accent.textClass} ${accent.bgClass} scale-105 border ${accent.borderClass} font-bold -translate-y-0.5 ${accent.shadowClass}` 
                    : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[8px] mt-0.5 tracking-tight">{item.name}</span>
              </button>
            );
          })}
          
          <div className="flex items-center justify-center p-1">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          </div>

          <button
            onClick={toggleLang}
            className={`relative flex items-center p-1 rounded-xl border ${accent.borderClass} ${
              isDark ? 'bg-white/5' : 'bg-slate-100'
            } transition-all duration-300 cursor-pointer active:scale-95`}
            type="button"
            title="Change Language"
          >
            <div className={`flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all duration-300 ${
              lang === 'ar' ? `${accent.bgClass} ${accent.textClass} shadow-sm` : isDark ? 'text-gray-400' : 'text-slate-500'
            }`}>
              AR
            </div>
            <div className={`flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all duration-300 ${
              lang === 'en' ? `${accent.bgClass} ${accent.textClass} shadow-sm` : isDark ? 'text-gray-400' : 'text-slate-500'
            }`}>
              EN
            </div>
          </button>
        </nav>
      </div>

    </div>
  );
}