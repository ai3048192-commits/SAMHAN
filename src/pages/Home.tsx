import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, FileText, CheckCircle2, Compass, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import About from '../pages/About';
import Services from './Services';
import Portfolio from './Portfolio';
import ClientsAndPartners from './ClientsAndPartners';
import ClientPage from './ClientPage';
import Contact from './Contact';

type HeroSectionProps = {
  isDark: boolean;
  accentColor?: { 
    name: string; 
    textClass: string; 
    bgClass: string; 
    borderClass: string; 
    shadowClass: string; 
    hex: string; 
  };
};

const defaultAccent = {
  name: 'orange', 
  textClass: 'text-orange-500', 
  bgClass: 'bg-orange-500/15', 
  borderClass: 'border-orange-500/40', 
  shadowClass: 'shadow-[0_0_15px_rgba(249,115,22,0.25)]', 
  hex: '#f97316' 
};

export default function HeroSection({ isDark, accentColor = defaultAccent }: HeroSectionProps) {
  const { lang, dir } = useLanguage();

  const [heroData, setHeroData] = useState({
    title_ar: "أهندسة الهويات البصرية لترسخ في الذاكرة.",
    description_ar: "أنا أحمد إسماعيل، مصمم جرافيك ومبتكر علامات تجارية. أدمج الاستراتيجية بالإبداع لأصنع لك تصاميم تنبض بالحياة وترفع القيمة السوقية لشركتك.",
    btn1_text_ar: "استكشف أعمالي",
    btn2_text_ar: "تحميل السيرة الذاتية",
    features_ar: "تصاميم فريدة 100% • احترافية عالية الدقة",

    title_en: "Engineering Visual Identities That Last in Memory.",
    description_en: "I am Ahmed Ismail, a graphic designer and brand creator. I combine strategy with creativity to craft designs that breathe life and elevate your market value.",
    btn1_text_en: "Explore Portfolio",
    btn2_text_en: "Download CV",
    features_en: "100% Unique Designs • High Precision",

    image_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    attachment_path: ""
  });

  useEffect(() => {
    async function fetchHero() {
      const { data, error } = await supabase
        .from('hero_sections')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error("خطأ في جلب بيانات الهيرو:", error.message);
      } else if (data && data.length > 0) {
        const item = data[0];
        setHeroData({
          title_ar: item.title_ar || heroData.title_ar,
          description_ar: item.description_ar || heroData.description_ar,
          btn1_text_ar: item.btn1_text_ar || heroData.btn1_text_ar,
          btn2_text_ar: item.btn2_text_ar || heroData.btn2_text_ar,
          features_ar: item.features_ar || heroData.features_ar,

          title_en: item.title_en || heroData.title_en,
          description_en: item.description_en || heroData.description_en,
          btn1_text_en: item.btn1_text_en || heroData.btn1_text_en,
          btn2_text_en: item.btn2_text_en || heroData.btn2_text_en,
          features_en: item.features_en || heroData.features_en,

          image_path: item.image_path || heroData.image_path,
          attachment_path: item.attachment_path || ""
        });
      }
    }

    fetchHero();
  }, []);

  const translations = {
    ar: {
      badge: "متاح لاستلام مشاريع الهوية البصرية الجديدة",
      floating1: "Brand Identity",
      floating2: "UI/UX & Art",
      title: heroData.title_ar,
      description: heroData.description_ar,
      btn1: heroData.btn1_text_ar,
      btn2: heroData.btn2_text_ar,
      features: heroData.features_ar
    },
    en: {
      badge: "Available for New Brand Identity Projects",
      floating1: "Brand Identity",
      floating2: "UI/UX & Art",
      title: heroData.title_en,
      description: heroData.description_en,
      btn1: heroData.btn1_text_en,
      btn2: heroData.btn2_text_en,
      features: heroData.features_en
    }
  };

  const t = translations[lang] || translations.ar;

  const titleWords = (t.title || "").split(' ');
  const headingStart = titleWords.slice(0, 2).join(' ');
  const headingHighlight = titleWords.slice(2, 4).join(' ');
  const headingEnd = titleWords.slice(4).join(' ');

  return (
    <>
      <section 
        id="home" 
        dir={dir} 
        className={`min-h-[90vh] flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 transition-colors duration-500 ${
          isDark ? 'bg-[#070709] text-white' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <div 
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none opacity-20 transition-colors duration-500"
          style={{ backgroundColor: accentColor.hex }}
        ></div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          <div className={`lg:col-span-7 flex flex-col items-start ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            
            <div className="flex items-center gap-3 mb-5">
              <div 
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs shadow-sm ${
                  isDark ? 'bg-[#121216] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}
                style={{ borderColor: `${accentColor.hex}40` }}
              >
                <span 
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: accentColor.hex }}
                ></span>
                <Sparkles className={`w-3.5 h-3.5 ${accentColor.textClass}`} />
                <span>{t.badge}</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-5">
              {headingStart}{' '}
              <span className={`text-transparent bg-clip-text transition-colors duration-300`} style={{ backgroundImage: `linear-gradient(to right, ${accentColor.hex}, #f59e0b)` }}>
                {headingHighlight}
              </span>{' '}
              {headingEnd}
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed mb-8 max-w-xl ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              {t.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              
              <a 
                href="#portfolio" 
                className="relative group overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm text-neutral-950 transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-xl"
                style={{ 
                  backgroundColor: accentColor.hex,
                  boxShadow: `0 10px 25px -5px ${accentColor.hex}66`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                <span className="relative z-10">{t.btn1}</span>
                
                <div className="relative z-10 w-7 h-7 rounded-xl bg-neutral-950/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {lang === 'ar' ? (
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  )}
                </div>
              </a>

              <a 
                href={heroData.attachment_path || "#contact"} 
                target="_blank" 
                rel="noreferrer"
                download={heroData.attachment_path ? true : undefined}
                className={`relative group overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border font-bold text-sm transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-lg ${
                  isDark ? 'bg-[#121216]/90 text-neutral-200 border-white/10 backdrop-blur-xl' : 'bg-white/90 text-slate-800 border-slate-200 backdrop-blur-xl'
                }`}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: accentColor.hex }}
                ></div>

                <div 
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    isDark ? 'bg-white/5 group-hover:bg-white/10' : 'bg-slate-100 group-hover:bg-slate-200'
                  }`}
                >
                  <FileText className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-6 ${accentColor.textClass}`} />
                </div>
                
                <span className="relative z-10">{t.btn2}</span>
              </a>

            </div>

            <div className={`flex items-center gap-6 mt-10 pt-6 border-t text-xs w-full justify-start ${
              isDark ? 'border-white/5 text-gray-400' : 'border-slate-200 text-slate-500'
            }`}>
              {(t.features || "").split('•').map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${accentColor.textClass}`} />
                  <span>{feat.trim()}</span>
                </div>
              ))}
            </div>

          </div>

          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-[280px] sm:w-[350px] lg:w-[380px] aspect-square flex items-center justify-center">
              
              <div 
                className="absolute inset-0 rounded-full border animate-[spin_15s_linear_infinite] border-dashed pointer-events-none opacity-40"
                style={{ borderColor: accentColor.hex }}
              ></div>
              
              <div className="absolute inset-3 rounded-full border border-amber-400/20 animate-[spin_20s_linear_infinite_reverse] pointer-events-none"></div>

              <div 
                className="absolute inset-10 rounded-full blur-2xl animate-pulse opacity-20"
                style={{ backgroundColor: accentColor.hex }}
              ></div>

              <div 
                className={`relative w-[240px] sm:w-[300px] lg:w-[320px] aspect-square rounded-full p-2 border shadow-xl overflow-hidden group transition-colors duration-500 ${
                  isDark ? 'bg-[#121216] border-white/10' : 'bg-white border-slate-200'
                }`}
                style={{ borderColor: `${accentColor.hex}66` }}
              >
                <img 
                  src={heroData.image_path} 
                  alt="Ahmed Ismail" 
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700"
                />
                <div className={`absolute inset-0 rounded-full bg-gradient-to-t ${isDark ? 'from-[#070709]/60' : 'from-black/40'} via-transparent to-transparent`}></div>
              </div>

              <div className={`absolute top-2 right-0 backdrop-blur-md border px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce duration-1000 ${
                isDark ? 'bg-[#121216]/90 border-white/10 text-gray-200' : 'bg-white/90 border-slate-200 text-slate-800'
              }`}>
                <Layers className={`w-3.5 h-3.5 ${accentColor.textClass}`} />
                <span className="text-[10px] font-bold">{t.floating1}</span>
              </div>

              <div className={`absolute bottom-4 left-0 backdrop-blur-md border px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 animate-pulse ${
                isDark ? 'bg-[#121216]/90 border-white/10 text-gray-200' : 'bg-white/90 border-slate-200 text-slate-800'
              }`}>
                <Compass className={`w-3.5 h-3.5 ${accentColor.textClass}`} />
                <span className="text-[10px] font-bold">{t.floating2}</span>
              </div>

            </div>
          </div>

        </div>

      </section>

      <About isDark={isDark} accentColor={accentColor} />
      <Services isDark={isDark} accentColor={accentColor} />
      <Portfolio isDark={isDark} accentColor={accentColor} />
      <ClientsAndPartners isDark={isDark} accentColor={accentColor} />
      <ClientPage isDark={isDark} accentColor={accentColor} />
      <Contact isDark={isDark} accentColor={accentColor} />
    </>
  );
}