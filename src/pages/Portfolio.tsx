import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, ExternalLink, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';

type PortfolioProps = {
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

type ServiceRow = {
  id: number;
  title_ar: string | null;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
};

type ProjectRow = {
  id: number;
  name_ar: string;
  name_en: string;
  image: string | null;
  service_id: number | null;
};

const defaultAccent = {
  name: 'orange',
  textClass: 'text-orange-500',
  bgClass: 'bg-orange-500/15',
  borderClass: 'border-orange-500/40',
  shadowClass: 'shadow-[0_0_15px_rgba(249,115,22,0.25)]',
  hex: '#f97316',
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';

export default function Portfolio({ isDark, accentColor = defaultAccent }: PortfolioProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang, dir } = useLanguage();
  const navigate = useNavigate();

  const [services, setServices] = useState<ServiceRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  const debugMode =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [svcRes, projRes] = await Promise.all([
        supabase
          .from('services')
          .select('id, title_ar, title_en, description_ar, description_en')
          .order('id'),
        // المشاريع بتتجاب عشان نعرف عدد كل خدمة ونجيب صورة غلاف لها
        supabase
          .from('projects')
          .select('id, name_ar, name_en, image, service_id')
          .eq('is_published', true)
          .order('sort_order', { ascending: false })
          .order('id', { ascending: false }),
      ]);

      if (cancelled) return;

      if (svcRes.error) {
        console.error('Portfolio services error:', svcRes.error);
        setErrorText(svcRes.error.message);
        setLoading(false);
        return;
      }

      if (projRes.error) {
        console.warn('Portfolio projects error:', projRes.error.message);
      } else {
        setProjects((projRes.data as ProjectRow[]) || []);
      }

      setServices((svcRes.data as ServiceRow[]) || []);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const dict = {
    ar: {
      badge: 'خدماتنا والأعمال المرتبطة بها',
      headingStart: 'معرض',
      headingHighlight: 'أعمالنا الإبداعية',
      description:
        'اختر الخدمة لتستعرض كل المشاريع التي نفّذناها ضمنها، وتفاصيل كل مشروع بالصور.',
      detailsText: 'تصفّح كل المشاريع',
      projectsWord: 'مشروع',
      noProjects: 'قريباً',
      empty: 'لا توجد خدمات منشورة حالياً.',
      error: 'تعذّر تحميل الخدمات.',
      untitled: 'خدمة',
    },
    en: {
      badge: 'Our services and related work',
      headingStart: 'Our Creative',
      headingHighlight: 'Portfolio',
      description:
        'Pick a service to browse every project delivered under it, with full image details.',
      detailsText: 'Browse all projects',
      projectsWord: 'projects',
      noProjects: 'Coming soon',
      empty: 'No published services yet.',
      error: 'Could not load services.',
      untitled: 'Service',
    },
  };

  const t = dict[lang as 'ar' | 'en'] || dict.ar;
  const isAr = lang !== 'en';

  const getTitle = (s: ServiceRow) =>
    (isAr ? s.title_ar : s.title_en) || s.title_ar || s.title_en || t.untitled;
  const getDesc = (s: ServiceRow) => (isAr ? s.description_ar : s.description_en) || '';

  const projectsOf = (serviceId: number) => projects.filter((p) => p.service_id === serviceId);

  // صورة الغلاف = صورة أحدث مشروع في الخدمة، لأن جدول الخدمات مفيهوش صورة
  const coverOf = (serviceId: number) =>
    projectsOf(serviceId).find((p) => p.image)?.image || FALLBACK_IMAGE;

  return (
    <div
      id="portfolio"
      ref={sectionRef}
      dir={dir}
      className={`min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-[#030305] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: `radial-gradient(circle at 50% 15%, ${accentColor.hex}, transparent 65%)` }}
      ></div>
      <div
        className={`absolute inset-0 bg-[size:4rem_4rem] pointer-events-none ${
          isDark
            ? 'bg-[linear-gradient(to_right,#1f1f2e05_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e05_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#e2e8f005_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f005_1px,transparent_1px)]'
        }`}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {debugMode && (
          <div
            className="mb-8 p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 text-[11px] font-mono space-y-1"
            dir="ltr"
          >
            <div>loading: {String(loading)}</div>
            <div>services fetched: {services.length}</div>
            <div>projects fetched: {projects.length}</div>
            <div>error: {errorText || 'none'}</div>
            <div>lang: {String(lang)}</div>
          </div>
        )}

        <div
          className={`flex justify-start mb-12 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div
            className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full border text-xs backdrop-blur-xl shadow-sm ${
              isDark ? 'bg-[#0d0d12]/90 border-white/10 text-white' : 'bg-white/90 border-slate-200 text-slate-800'
            }`}
            style={{ borderColor: `${accentColor.hex}40` }}
          >
            <Command className="w-3.5 h-3.5 animate-pulse" style={{ color: accentColor.hex }} />
            <span className="tracking-wide font-semibold">{t.badge}</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor.hex }}></span>
          </div>
        </div>

        <div
          className={`text-start max-w-3xl mb-16 transition-all duration-1000 delay-150 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
            {t.headingStart}{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(to right, ${accentColor.hex}, #f59e0b)` }}
            >
              {t.headingHighlight}
            </span>
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            {t.description}
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-3xl border h-[480px] animate-pulse ${
                  isDark ? 'bg-[#0a0a0f] border-white/10' : 'bg-white border-slate-200'
                }`}
              />
            ))}
          </div>
        )}

        {!loading && errorText && (
          <div
            className={`rounded-3xl border p-8 text-center ${
              isDark ? 'bg-[#0a0a0f] border-rose-500/30' : 'bg-white border-rose-300'
            }`}
          >
            <AlertTriangle className="w-6 h-6 mx-auto mb-3 text-rose-400" />
            <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{t.error}</p>
            <p className="text-[11px] font-mono text-rose-400/80" dir="ltr">
              {errorText}
            </p>
          </div>
        )}

        {!loading && !errorText && services.length === 0 && (
          <div
            className={`rounded-3xl border p-16 text-center text-sm ${
              isDark ? 'bg-[#0a0a0f] border-white/10 text-gray-400' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            {t.empty}
          </div>
        )}

        {!loading && !errorText && services.length > 0 && (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {services.map((service) => {
              const list = projectsOf(service.id);

              return (
                <div
                  key={service.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/service/${service.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/service/${service.id}`);
                    }
                  }}
                  className={`group relative rounded-3xl overflow-hidden border transition-all duration-500 shadow-xl hover:-translate-y-2 h-[480px] flex flex-col justify-between cursor-pointer outline-none ${
                    isDark ? 'bg-[#0a0a0f] border-white/10' : 'bg-white border-slate-200 shadow-slate-200/50'
                  }`}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = accentColor.hex)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                >
                  <div className="absolute inset-0 z-0">
                    <img
                      src={coverOf(service.id)}
                      alt={getTitle(service)}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-55 group-hover:opacity-70"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        isDark ? 'from-[#050508] via-[#050508]/80' : 'from-slate-900/90 via-slate-900/60'
                      } to-transparent`}
                    ></div>
                  </div>

                  <div className="relative z-10 p-6 flex justify-between items-start">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-medium backdrop-blur-md border ${
                        isDark ? 'bg-black/50 border-white/10' : 'bg-white/70 border-slate-200'
                      }`}
                      style={{ color: accentColor.hex }}
                    >
                      {list.length > 0 ? `${list.length} ${t.projectsWord}` : t.noProjects}
                    </span>

                    <div
                      className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 ${
                        isDark
                          ? 'bg-black/40 border-white/10 text-gray-300'
                          : 'bg-white/70 border-slate-200 text-slate-700'
                      }`}
                    >
                      {isAr ? (
                        <ArrowLeft className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      ) : (
                        <ArrowRight className="w-4 h-4 rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      )}
                    </div>
                  </div>

                  <div className="relative z-10 p-6 pt-0 flex flex-col justify-end">
                    {list.length > 0 && (
                      <span className="text-xs font-medium mb-1.5 block opacity-90" style={{ color: accentColor.hex }}>
                        {list
                          .slice(0, 2)
                          .map((p) => (isAr ? p.name_ar : p.name_en) || p.name_ar)
                          .join(' • ')}
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-white mb-2.5">{getTitle(service)}</h3>

                    {getDesc(service) && (
                      <p className="text-gray-300 text-xs leading-relaxed mb-6 line-clamp-2">
                        {getDesc(service)}
                      </p>
                    )}

                    <div
                      className={`pt-4 border-t flex items-center justify-between text-xs ${
                        isDark ? 'border-white/10 text-gray-400' : 'border-white/20 text-gray-300'
                      }`}
                    >
                      <span className="font-medium">{t.detailsText}</span>
                      <span
                        className="font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                        style={{ color: accentColor.hex }}
                      >
                        {getTitle(service)} <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
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