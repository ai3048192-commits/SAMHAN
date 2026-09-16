import React, { useEffect, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";

type SuccessPartnersProps = {
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
  name: "orange",
  textClass: "text-orange-500",
  bgClass: "bg-orange-500/15",
  borderClass: "border-orange-500/40",
  shadowClass: "shadow-[0_0_15px_rgba(249,115,22,0.25)]",
  hex: "#f97316",
};

export default function SuccessPartners({
  isDark,
  accentColor = defaultAccent,
}: SuccessPartnersProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [partners, setPartners] = useState<
    Array<{ id: number; name: string; image: string }>
  >([]);
  const [sectionData, setSectionData] = useState({
    titleAr: "شركاؤنا وعملاؤنا المميزون",
    titleEn: "Our Featured Partners & Clients",
    subtitleAr: "نفخر بالتعاون مع نخبة من الشركات والجهات الرائدة.",
    subtitleEn:
      "We are proud to collaborate with elite leading companies and organizations.",
  });

  const sectionRef = useRef<HTMLElement>(null);
  const { lang, dir } = useLanguage();

  // جلب البيانات مباشرة من Supabase عند التحميل أو تغيير اللغة بدون استخدام .single() لتجنب الأخطاء
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        // 1. جلب الشركاء من جدول partners
        const { data: partnersData, error: partnersError } = await supabase
          .from('partners')
          .select('*')
          .order('id', { ascending: false });

        if (partnersError) throw partnersError;

        if (partnersData) {
          const formatted = partnersData.map((p: any) => ({
            id: p.id,
            name: lang === "ar" ? p.name_ar || p.name_en : p.name_en || p.name_ar,
            image: p.image_url,
          }));
          setPartners(formatted);
        }

        // 2. جلب عناوين السكشن من جدول partners_section بطريقة آمنة باستخدام .limit(1)
        const { data: sectionDataResult, error: sectionError } = await supabase
          .from('partners_section')
          .select('*')
          .limit(1);

        if (!sectionError && sectionDataResult && sectionDataResult.length > 0) {
          setSectionData({
            titleAr: sectionDataResult[0].section_title_ar || "شركاؤنا وعملاؤنا المميزون",
            titleEn: sectionDataResult[0].section_title_en || "Our Featured Partners & Clients",
            subtitleAr: sectionDataResult[0].section_subtitle_ar || "نفخر بالتعاون مع نخبة من الشركات والجهات الرائدة.",
            subtitleEn: sectionDataResult[0].section_subtitle_en || "We are proud to collaborate with elite leading companies and organizations.",
          });
        }
      } catch (error) {
        console.error("Error fetching public partners from Supabase:", error);
      }
    };

    fetchPublicData();
  }, [lang]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
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

  const currentTitle =
    lang === "ar" ? sectionData.titleAr : sectionData.titleEn;
  const currentDesc =
    lang === "ar" ? sectionData.subtitleAr : sectionData.subtitleEn;

  return (
    <section
      id="partners"
      ref={sectionRef}
      dir={dir}
      className={`min-h-screen pt-28 pb-28 relative overflow-hidden flex flex-col justify-center transition-colors duration-500 ${
        isDark ? "bg-[#020204] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[240px] pointer-events-none animate-pulse opacity-15"
        style={{ backgroundColor: accentColor.hex }}
      ></div>

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, ${accentColor.hex}10 1px, transparent 1px), linear-gradient(to bottom, ${accentColor.hex}10 1px, transparent 1px)`,
          backgroundSize: "5rem 5rem",
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 mb-16 w-full">
        <div
          className={`flex justify-center mb-6 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div
            className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border text-xs backdrop-blur-xl ${
              isDark
                ? "bg-[#0a0a0f] border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-800 shadow-sm"
            }`}
            style={{ borderColor: `${accentColor.hex}40` }}
          >
            <Sparkles
              className={`w-4 h-4 animate-spin`}
              style={{ color: accentColor.hex }}
            />
            <span className="tracking-widest font-black uppercase">
              {lang === "ar"
                ? "شركاء النجاح والتميز"
                : "Success & Excellence Partners"}
            </span>
          </div>
        </div>

        <div
          className={`text-center max-w-3xl mx-auto transition-all duration-1000 delay-150 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 leading-tight">
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${accentColor.hex}, #f59e0b)`,
              }}
            >
              {currentTitle}
            </span>
          </h2>
          <p
            className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-gray-400" : "text-slate-600"}`}
          >
            {currentDesc}
          </p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden py-4">
        {partners.length === 0 ? (
          <div className="text-center text-neutral-500 text-sm">
            {lang === "ar"
              ? "لا توجد شركاء مضافة حالياً"
              : "No partners added yet"}
          </div>
        ) : (
          <div className="flex w-max animate-marquee space-x-6 space-x-reverse hover:[animation-play-state:paused]">
            {[...partners, ...partners].map((item, index) => (
              <div
                key={`partner-${index}`}
                onClick={() => setSelectedImage(item.image)}
                className={`w-56 sm:w-64 md:w-72 h-36 sm:h-40 md:h-44 group relative border rounded-3xl overflow-hidden transition-all duration-700 flex-shrink-0 cursor-pointer p-3 flex items-center justify-center ${
                  isDark
                    ? "bg-[#08080c] border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
                    : "bg-white border-slate-200 shadow-lg"
                }`}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = accentColor.hex)
                }
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <div className="absolute inset-0 rounded-3xl border border-transparent pointer-events-none transition-colors z-20"></div>

                <div
                  className={`relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center ${isDark ? "bg-black/40" : "bg-slate-50"}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-14 left-0 w-12 h-12 rounded-2xl text-neutral-950 flex items-center justify-center font-black shadow-xl hover:scale-110 transition-transform cursor-pointer z-50"
              style={{ backgroundColor: accentColor.hex }}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged Logo"
              className="max-w-full max-h-[85vh] object-contain rounded-3xl border shadow-2xl"
              style={{ borderColor: `${accentColor.hex}66` }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
}