import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';

type FAQSectionProps = {
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

export default function FAQSection({ isDark, accentColor = defaultAccent }: FAQSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const sectionRef = useRef<HTMLElement>(null);
  const { lang, dir } = useLanguage();

  useEffect(() => {
    async function fetchFaqs() {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error("خطأ في جلب الأسئلة الشائعة:", error.message);
      } else if (data) {
        setFaqs(data);
      }
    }

    fetchFaqs();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const translations = {
    ar: {
      badge: "الأسئلة الشائعة // الاستفسارات العامة",
      titleStart: "كل ما تحتاج معرفته",
      titleHighlight: "بوضوح تام",
      description: "إجابات شاملة ومنظمة لكل ما يدور في ذهنك حول خدمات التصميم وهندسة الهويات البصرية المتميزة."
    },
    en: {
      badge: "FAQ // General Inquiries",
      titleStart: "Everything you need to know",
      titleHighlight: "with absolute clarity",
      description: "Comprehensive and organized answers to everything on your mind regarding design services and premium visual identity engineering."
    }
  };

  const t = translations[lang] || translations.ar;

  return (
    <section 
      id="faq"
      ref={sectionRef}
      dir={dir} 
      className={`min-h-screen pt-28 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-[#030305] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[200px] pointer-events-none opacity-15"
        style={{ backgroundColor: accentColor.hex }}
      ></div>
      <div className={`absolute inset-0 pointer-events-none ${
        isDark 
          ? 'bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)]' 
          : 'bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)]'
      } bg-[size:4rem_4rem]`}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className={`flex justify-center mb-6 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div 
            className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full border text-xs shadow-lg backdrop-blur-xl ${
              isDark ? 'bg-[#0d0d12] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}
            style={{ borderColor: `${accentColor.hex}40` }}
          >
            <Sparkles className={`w-3.5 h-3.5 ${accentColor.textClass}`} />
            <span className="tracking-wide font-medium">{t.badge}</span>
          </div>
        </div>

        <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-1000 delay-150 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
            {t.titleStart}{' '}
            <span 
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(to right, ${accentColor.hex}, #f59e0b)` }}
            >
              {t.titleHighlight}
            </span>
          </h2>
          <p className={`text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            {t.description}
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {faqs.map((faq, index) => {
            // اختيار الحقل بناءً على اللغة الحالية
            const currentTitle = lang === 'ar' ? (faq.title_ar || faq.title) : (faq.title_en || faq.title_ar || faq.title);
            const currentAnswer = lang === 'ar' ? (faq.answer_ar || faq.answer) : (faq.answer_en || faq.answer_ar || faq.answer);
            const currentFeature = lang === 'ar' ? (faq.feature_ar || faq.feature) : (faq.feature_en || faq.feature_ar || faq.feature);

            return (
              <div 
                key={faq.id || index}
                className={`group relative border rounded-3xl p-8 transition-all duration-500 shadow-xl flex flex-col justify-between overflow-hidden ${
                  isDark 
                    ? 'bg-[#07070a]/90 border-white/10 hover:border-white/30 text-white' 
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-slate-100'
                } ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                style={{ borderColor: `${accentColor.hex}33` }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = accentColor.hex}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = `${accentColor.hex}33`}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `linear-gradient(to bottom right, ${accentColor.hex}15, transparent, transparent)` }}
                ></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    {currentFeature && (
                      <span 
                        className={`text-[11px] font-semibold tracking-wide uppercase px-3.5 py-1.5 rounded-full border ${accentColor.textClass}`}
                        style={{ backgroundColor: `${accentColor.hex}15`, borderColor: `${accentColor.hex}30` }}
                      >
                        {currentFeature}
                      </span>
                    )}
                    <span className={`text-xs font-mono font-bold ${isDark ? 'text-gray-500' : 'text-slate-400'} ${!currentFeature ? 'mr-auto' : ''}`}>
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold mb-4 group-hover:${accentColor.textClass} transition-colors leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {currentTitle}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed font-normal ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    {currentAnswer}
                  </p>
                </div>

                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(to right, transparent, ${accentColor.hex}, transparent)` }}
                ></div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}