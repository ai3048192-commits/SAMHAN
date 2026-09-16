import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Command,
  Palette,
  Eye,
  Play,
  Sparkles,
  Users,
  Award,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";

type AboutProps = {
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

export default function About({
  isDark,
  accentColor = defaultAccent,
}: AboutProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang, dir } = useLanguage();

  const [secOneData, setSecOneData] = useState<any>(null);
  const [expertItems, setExpertItems] = useState<any[]>([]);
  const [featureItems, setFeatureItems] = useState<any[]>([]);

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

    fetchSupabaseData();

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const fetchSupabaseData = async () => {
    try {
      const { data: sec1, error: sec1Err } = await supabase
        .from("section_one_items")
        .select("*")
        .order("id", { ascending: false })
        .limit(1);
      if (sec1Err) console.error("Error fetching section_one_items:", sec1Err);
      if (sec1 && sec1.length > 0) setSecOneData(sec1[0]);

      const { data: exp, error: expErr } = await supabase
        .from("expert_items")
        .select("*")
        .order("id", { ascending: true });
      if (expErr) console.error("Error fetching expert_items:", expErr);
      if (exp) setExpertItems(exp);

      const { data: feat, error: featErr } = await supabase
        .from("feature_items")
        .select("*")
        .order("id", { ascending: true });
      if (featErr) console.error("Error fetching feature_items:", featErr);
      if (feat) setFeatureItems(feat);
    } catch (error) {
      console.error("Error fetching about data:", error);
    }
  };

  const translations = {
    ar: {
      badge: "هوية النظام // بورتفيو التصميم الاحترافي",
      defaultTitle: "هندسة الواقع الرقمي للعلامات التجارية.",
      defaultDesc: "أنا أحمد إسماعيل. مهندس هويات بصرية ومصمم واجهات متقدم.",
      defaultBtn: "ابدأ مشروعك الآن",
    },
    en: {
      badge: "System Identity // Professional Design Portfolio",
      defaultTitle: "Engineering Digital Reality for Brands.",
      defaultDesc:
        "I am Ahmed Ismail. Brand identity engineer and advanced UI designer.",
      defaultBtn: "Start Your Project",
    },
  };

  const t = translations[lang] || translations.ar;

  const mainTitle =
    lang === "en"
      ? secOneData?.title_en || secOneData?.title || t.defaultTitle
      : secOneData?.title_ar || secOneData?.title || t.defaultTitle;

  const mainDesc =
    lang === "en"
      ? secOneData?.description_en || secOneData?.description || t.defaultDesc
      : secOneData?.description_ar || secOneData?.description || t.defaultDesc;

  const btnText =
    lang === "en"
      ? secOneData?.button_text_en || secOneData?.button_text || t.defaultBtn
      : secOneData?.button_text_ar || secOneData?.button_text || t.defaultBtn;

  return (
    <div
      ref={sectionRef}
      dir={dir}
      id="about"
      className={`min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500 ${
        isDark
          ? "bg-[#030305] text-white selection:bg-orange-500 selection:text-white"
          : "bg-white text-slate-900 selection:bg-orange-500 selection:text-white"
      }`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 15%, ${accentColor.hex}15, transparent 65%)`,
        }}
      ></div>
      <div
        className={`absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e06_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e06_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none ${isDark ? "opacity-100" : "opacity-40"}`}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`flex justify-start mb-12 transition-all duration-1000 transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}
        >
          <div
            className={`group relative inline-flex items-center gap-3 px-6 py-2.5 rounded-full border text-xs backdrop-blur-xl transition-all duration-300 shadow-sm ${
              isDark
                ? "bg-[#0d0d12]/95 border-white/10 text-white"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
            style={{ borderColor: `${accentColor.hex}40` }}
          >
            <Command
              className="w-4 h-4 animate-spin"
              style={{ color: accentColor.hex }}
            />
            <span className="tracking-widest uppercase font-bold relative z-10">
              {t.badge}
            </span>
            <span
              className="w-2 h-2 rounded-full animate-ping relative z-10"
              style={{ backgroundColor: accentColor.hex }}
            ></span>
          </div>
        </div>

        <div
          className={`text-start max-w-4xl mb-16 transition-all duration-1000 delay-150 transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${accentColor.hex}, #f59e0b)`,
              }}
            >
              {mainTitle}
            </span>
          </h1>
          <p
            className={`text-base sm:text-lg leading-relaxed max-w-2xl mb-8 ${isDark ? "text-gray-400" : "text-slate-600"}`}
          >
            {mainDesc}
          </p>
          <div className="flex justify-start">
            <Link
              to="#portfolio"
              className="group relative px-9 py-4 text-white font-bold text-sm tracking-wider uppercase rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center gap-3 overflow-hidden"
              style={{ backgroundColor: accentColor.hex }}
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10">{btnText}</span>
              <ArrowLeft
                className={`w-4 h-4 relative z-10 group-hover:-translate-x-2 transition-transform duration-300 ${lang === "en" ? "rotate-180" : ""}`}
              />
            </Link>
          </div>
        </div>

        <div
          className={`max-w-6xl mx-auto mb-20 transition-all duration-1000 delay-300 transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}
        >
          <div
            className="relative p-[1px] rounded-3xl shadow-xl"
            style={{
              backgroundImage: `linear-gradient(to right, ${accentColor.hex}33, ${accentColor.hex}11, ${accentColor.hex}33)`,
            }}
          >
            <div
              className={`relative rounded-[23px] px-6 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 backdrop-blur-2xl overflow-hidden transition-colors duration-500 ${
                isDark
                  ? "bg-[#07070a]/95 text-white"
                  : "bg-slate-50/95 text-slate-900"
              }`}
            >
              {expertItems.map((stat, index) => {
                const icons = [Users, Award, Briefcase, CheckCircle2];
                const IconComponent = icons[index % icons.length];
                const statTitle =
                  lang === "en"
                    ? stat.title_en || stat.title
                    : stat.title_ar || stat.title;
                const statDesc =
                  lang === "en"
                    ? stat.description_en || stat.description
                    : stat.description_ar || stat.description;

                return (
                  <div
                    key={stat.id || index}
                    className="relative flex flex-col items-center text-center group/item p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 group-hover/item:scale-110 transition-all duration-300 shadow-sm"
                      style={{
                        backgroundColor: `${accentColor.hex}15`,
                        borderColor: `${accentColor.hex}30`,
                        color: accentColor.hex,
                      }}
                    >
                      <IconComponent
                        className="w-6 h-6"
                        style={{ color: accentColor.hex }}
                      />
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span
                        className={`text-3xl sm:text-4xl font-black group-hover/item:scale-105 transition-transform ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {stat.number_value}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-800"} mb-1`}
                    >
                      {statTitle}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-widest ${isDark ? "text-gray-400" : "text-slate-500"}`}
                    >
                      {statDesc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-6 transition-all duration-1000 delay-500 transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}
        >
          {featureItems.map((card, index) => {
            const cardIcons = [Palette, Eye, Sparkles, Play];
            const CardIcon = cardIcons[index % cardIcons.length];
            const colSpanClass =
              index % 2 === 0 ? "md:col-span-7" : "md:col-span-5";

            const cardBadge =
              lang === "en"
                ? card.badge_en || card.badge
                : card.badge_ar || card.badge;
            const cardTitle =
              lang === "en"
                ? card.title_en || card.title
                : card.title_ar || card.title;
            const cardDesc =
              lang === "en"
                ? card.description_en || card.description
                : card.description_ar || card.description;

            return (
              <div
                key={card.id || index}
                className={`${colSpanClass} border p-8 sm:p-10 rounded-3xl transition-all duration-500 group relative overflow-hidden shadow-xl hover:-translate-y-1.5 ${
                  isDark
                    ? "bg-[#07070a] border-white/10 hover:border-white/30"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = accentColor.hex)
                }
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <div
                  className="absolute top-0 right-0 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-500"
                  style={{ backgroundColor: accentColor.hex }}
                ></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-16 h-16 border rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 overflow-hidden"
                      style={{
                        backgroundColor: `${accentColor.hex}15`,
                        borderColor: `${accentColor.hex}30`,
                        color: accentColor.hex,
                      }}
                    >
                      {card.icon_url ? (
                        <img
                          src={card.icon_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <CardIcon className="w-8 h-8" />
                      )}
                    </div>
                    {cardBadge && (
                      <span
                        className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                        style={{
                          backgroundColor: `${accentColor.hex}15`,
                          borderColor: `${accentColor.hex}30`,
                          color: accentColor.hex,
                        }}
                      >
                        {cardBadge}
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-2xl sm:text-3xl font-black mt-2 mb-4 tracking-tight group-hover:opacity-80 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {cardTitle}
                  </h3>
                  <p
                    className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-gray-400" : "text-slate-600"}`}
                  >
                    {cardDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
