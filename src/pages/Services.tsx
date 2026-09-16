import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Command, Palette, Sparkles, Wand2, Layers, Flame, Trophy, ArrowUpLeft, Loader2, Sparkle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';

type ServicesProps = {
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

export default function Services({ isDark, accentColor = defaultAccent }: ServicesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang, dir } = useLanguage();

  const [sectionData, setSectionData] = useState({
    title: { 
      ar: "خدماتنا الاحترافية", 
      en: "Our Professional Services" 
    },
    description: { 
      ar: "نقدم باقة متكاملة من الخدمات الرقمية المصممة خصيصاً لتطوير أعمالك وتعزيز حضورك.", 
      en: "We offer an integrated package of digital services designed specifically to develop your business." 
    },
    btnText: { 
      ar: "اطلب تصميمك الخاص", 
      en: "Request Your Custom Design" 
    }
  });

  const [servicesList, setServicesList] = useState<any[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      setIsLoading(true);

      const { data: sData, error: sError } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: false });

      if (!sError && sData) {
        const formatted = sData.map((s: any) => {
          let parsedFeaturesAr: string[] = [];
          let parsedFeaturesEn: string[] = [];
          
          // معالجة الميزات العربية بشكل مرن (JSON أو نصوص مفصولة)
          try {
            if (typeof s.features_ar === 'string') {
              parsedFeaturesAr = s.features_ar.startsWith('[') 
                ? JSON.parse(s.features_ar) 
                : s.features_ar.split('•').map((f: string) => f.trim()).filter(Boolean);
            } else if (Array.isArray(s.features_ar)) {
              parsedFeaturesAr = s.features_ar;
            }
          } catch {
            parsedFeaturesAr = s.features_ar ? [s.features_ar] : [];
          }

          // معالجة الميزات الإنجليزية بشكل مرن (JSON أو نصوص مفصولة)
          const rawEn = s.features_en || s.feature_en;
          try {
            if (typeof rawEn === 'string') {
              parsedFeaturesEn = rawEn.startsWith('[') 
                ? JSON.parse(rawEn) 
                : rawEn.split('•').map((f: string) => f.trim()).filter(Boolean);
            } else if (Array.isArray(rawEn)) {
              parsedFeaturesEn = rawEn;
            }
          } catch {
            parsedFeaturesEn = rawEn ? [rawEn] : [];
          }

          return {
            id: s.id,
            title: { ar: s.title_ar || "", en: s.title_en || "" },
            description: { ar: s.description_ar || "", en: s.description_en || "" },
            icon: s.icon_url || "",
            features: { ar: parsedFeaturesAr, en: parsedFeaturesEn }
          };
        });
        setServicesList(formatted);
      }

      // جلب بيانات قسم الخدمات بشكل آمن لتجنب خطأ 406
      const { data: secData, error: secError } = await supabase
        .from('services_section')
        .select('*');

      if (!secError && secData && secData.length > 0) {
        const targetSec = secData[0];
        setSectionData({
          title: {
            ar: targetSec.section_title_ar || sectionData.title.ar,
            en: targetSec.section_title_en || sectionData.title.en
          },
          description: {
            ar: targetSec.section_description_ar || sectionData.description.ar,
            en: targetSec.section_description_en || sectionData.description.en
          },
          btnText: {
            ar: targetSec.section_btn_ar || sectionData.btnText.ar,
            en: targetSec.section_btn_en || sectionData.btnText.en
          }
        });
      }
    } catch (error) {
      console.error("Error fetching services for frontend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const icons = [
    <Palette className="w-7 h-7 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />,
    <Sparkles className="w-7 h-7 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />,
    <Layers className="w-7 h-7 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />,
    <Wand2 className="w-7 h-7 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-45" />,
    <Flame className="w-7 h-7 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12" />,
    <Trophy className="w-7 h-7 transition-transform duration-500 group-hover:scale-110 group-hover:scale-125" />
  ];

  const currentLangKey = lang === 'ar' ? 'ar' : 'en';

  return (
    <div 
      ref={sectionRef}
      dir={dir}
      id="services"
      className={`min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-[#030305] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: `radial-gradient(circle at 50% 15%, ${accentColor.hex}, transparent 65%)` }}
      ></div>
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e05_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none ${isDark ? 'opacity-100' : 'opacity-40'}`}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* شارة العنوان العلوي */}
        <div className={`flex justify-start mb-8 transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
          <div 
            className={`group relative inline-flex items-center gap-3 px-5 py-2 rounded-2xl border text-xs backdrop-blur-xl transition-all duration-300 ${
              isDark ? 'bg-[#0d0d12]/90 border-white/10 text-white shadow-lg' : 'bg-white/90 border-slate-200 text-slate-800 shadow-sm'
            }`}
            style={{ borderColor: `${accentColor.hex}40` }}
          >
            <Sparkle className="w-4 h-4 animate-pulse" style={{ color: accentColor.hex }} />
            <span className="tracking-wider uppercase font-extrabold relative z-10">
              {lang === 'ar' ? "استوديو التصميم الاحترافي // الخدمات الإبداعية" : "Professional Design Studio // Creative Services"}
            </span>
          </div>
        </div>

        {/* رأس الصفحة */}
        <div className={`relative max-w-4xl mb-16 transition-all duration-1000 delay-150 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.2]">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${accentColor.hex}, #f59e0b)` }}>
              {sectionData.title[currentLangKey]}
            </span>
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed max-w-3xl mb-8 font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
            {sectionData.description[currentLangKey]}
          </p>

          <div className="flex justify-start">
            <Link 
              to="#portfolio" 
            
              className="group relative px-8 py-3.5 text-white font-bold text-sm tracking-wider uppercase rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center gap-3 overflow-hidden"
              style={{ backgroundColor: accentColor.hex }}
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10">{sectionData.btnText[currentLangKey]}</span>
              <ArrowLeft className={`w-4 h-4 relative z-10 group-hover:-translate-x-2 transition-transform duration-300 ${lang === 'en' ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>

        {/* قائمة الخدمات */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            {servicesList.map((service, index) => {
              const displayTitle = service.title[currentLangKey] || service.title.ar;
              const displayDesc = service.description[currentLangKey] || service.description.ar;
              const displayFeatures = service.features[currentLangKey] || [];
              
              const dynamicTag = displayFeatures.length > 0 ? displayFeatures[0] : (currentLangKey === 'ar' ? "خدمة مميزة" : "FEATURE");

              return (
                <div 
                  key={service.id || index}
                  className={`group relative border p-8 rounded-3xl transition-all duration-500 overflow-hidden shadow-xl hover:-translate-y-2 flex flex-col justify-between ${
                    isDark ? 'bg-[#07070a]/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = accentColor.hex}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
                >
                  <div 
                    className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundImage: `linear-gradient(to bottom right, ${accentColor.hex}33, transparent, transparent)` }}
                  ></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-md relative overflow-hidden"
                        style={{ 
                          backgroundColor: isDark ? `${accentColor.hex}15` : `${accentColor.hex}10`, 
                          border: `1px solid ${accentColor.hex}40`,
                          color: accentColor.hex 
                        }}
                      >
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                          style={{ backgroundColor: accentColor.hex }}
                        ></div>
                        <div className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center justify-center w-full h-full">
                          {service.icon ? (
                            <img src={service.icon} alt="icon" className="w-8 h-8 object-contain" />
                          ) : (
                            icons[index % icons.length]
                          )}
                        </div>
                      </div>
                      
                      <span 
                        className="text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full border shadow-sm transition-colors duration-300"
                        style={{ 
                          backgroundColor: isDark ? `${accentColor.hex}15` : `${accentColor.hex}10`,
                          borderColor: `${accentColor.hex}40`,
                          color: accentColor.hex 
                        }}
                      >
                        {dynamicTag}
                      </span>
                    </div>

                    <h3 className={`text-xl font-bold mb-3 transition-colors flex items-center justify-between ${isDark ? 'text-white group-hover:text-orange-400' : 'text-slate-900 group-hover:text-orange-600'}`}>
                      {displayTitle}
                      <ArrowUpLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" style={{ color: accentColor.hex }} />
                    </h3>
                    
                    <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                      {displayDesc}
                    </p>

                    {displayFeatures.length > 1 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                        {displayFeatures.slice(1).map((feat: string, idx: number) => (
                          <span key={idx} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div 
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundImage: `linear-gradient(to right, transparent, ${accentColor.hex}, transparent)` }}
                  ></div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}