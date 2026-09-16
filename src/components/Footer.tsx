import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBehance,
  FaDribbble,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaDownload,
  FaExternalLinkAlt,
  FaArrowUp,
  FaPalette,
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext"; 
import { supabase } from '../lib/supabaseClient';

type FooterProps = {
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

export default function SleekModernFooter({ isDark, accentColor = defaultAccent }: FooterProps) {
  const { lang, dir } = useLanguage();
  const currentYear = new Date().getFullYear();

  const [siteData, setSiteData] = useState({
    logoUrl: "",
    email: "info@ahmed-design.com",
    phone: "+201001254587",
    address_ar: "القاهرة، مصر",
    address_en: "Cairo, Egypt",
    footer_desc_ar: "استوديو متخصص في صناعة الهويات البصرية، بناء العلامات التجارية، وتصميم واجهات المستخدم لتطوير حضورك الرقمي باحترافية تامة.",
    footer_desc_en: "A specialized studio crafting visual identities, building brands, and designing user interfaces to elevate your digital presence professionally.",
    attachmentPath: "/portfolio.pdf",
  });

  const [socialLinks, setSocialLinks] = useState<Array<{ platform_name: string; platform_url: string }>>([
    { platform_name: "Instagram", platform_url: "https://instagram.com/your_username" },
    { platform_name: "Behance", platform_url: "https://behance.net/your_username" },
    { platform_name: "Dribbble", platform_url: "https://dribbble.com/your_username" },
    { platform_name: "Twitter", platform_url: "https://twitter.com/your_username" },
  ]);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const { data: settings, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      const { data: heroData, error: heroError } = await supabase
        .from('hero_sections')
        .select('attachment_path')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (!settingsError && settings) {
        setSiteData(prev => ({
          ...prev,
          logoUrl: settings.logo_url || settings.logo || "",
          email: settings.email || prev.email,
          phone: settings.phone || prev.phone,
          address_ar: settings.address_ar || prev.address_ar,
          address_en: settings.address_en || prev.address_en,
          footer_desc_ar: settings.footer_desc_ar || prev.footer_desc_ar,
          footer_desc_en: settings.footer_desc_en || prev.footer_desc_en,
        }));

        const { data: socials, error: socialsError } = await supabase
          .from('social_links')
          .select('*')
          .eq('setting_id', settings.id);

        if (!socialsError && socials && socials.length > 0) {
          setSocialLinks(socials);
        }
      }

      if (!heroError && heroData && heroData.attachment_path) {
        setSiteData(prev => ({
          ...prev,
          attachmentPath: heroData.attachment_path
        }));
      }

    } catch (err) {
      console.error("Error fetching footer data from Supabase:", err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const translations = {
    ar: {
      studioBadge: "// استوديو إبداعي",
      bio: siteData.footer_desc_ar,
      contactTitle: "// تواصل معنا",
      available: "متاح للعمل",
      emailLabel: "البريد الإلكتروني",
      emailVal: siteData.email,
      whatsappLabel: "محادثة واتساب المباشرة",
      locationLabel: "مقر الاستوديو",
      locationVal: siteData.address_ar,
      portfolioTitle: "سابقة أعمال الجرافيك",
      portfolioDesc: "استعرض أعمالنا الإبداعية في تصميم الهويات البصرية للشركات، المطبوعات، وتصميمات السوشيال ميديا الاحترافية.",
      downloadBtn: "تحميل الملف",
      behanceBtn: "البورتفلييو",
      rights: "جميع الحقوق محفوظة لتصميم الهويات البصرية",
      privacy: "سياسة الخصوصية",
      terms: "شروط الاستخدام",
      backToTop: "العودة للأعلى",
      emailSubject: "طلب استفسار بخصوص تصميم هوية بصرية ومشروع جديد",
      emailBody: "مرحباً، أود الاستفسار عن خدمات الجرافيك ديزاين وبدء مشروع جديد لعلامتي التجارية.",
      waMessage: "مرحباً، أردت الاستفسار عن تصميم هوية بصرية لشركتي."
    },
    en: {
      studioBadge: "// Creative Studio",
      bio: siteData.footer_desc_en,
      contactTitle: "// Get In Touch",
      available: "Available for Work",
      emailLabel: "Email Address",
      emailVal: siteData.email,
      whatsappLabel: "Direct WhatsApp Chat",
      locationLabel: "Studio Location",
      locationVal: siteData.address_en,
      portfolioTitle: "Graphic Portfolio",
      portfolioDesc: "Explore our creative works in corporate visual identity design, print, and professional social media designs.",
      downloadBtn: "Download CV",
      behanceBtn: "Portfolio",
      rights: "All rights reserved for visual identity designs",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      backToTop: "Back to Top",
      emailSubject: "Inquiry regarding visual identity design and new project",
      emailBody: "Hello, I would like to inquire about your graphic design services and start a new project for my brand.",
      waMessage: "Hello, I wanted to inquire about a visual identity design for my company."
    }
  };

  const t = translations[lang] || translations.ar;

  const getSocialIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('insta')) return FaInstagram;
    if (lower.includes('behance')) return FaBehance;
    if (lower.includes('dribbble')) return FaDribbble;
    if (lower.includes('face') || lower.includes('fb')) return FaFacebook;
    if (lower.includes('linked')) return FaLinkedin;
    return FaTwitter;
  };

  // دالة لإرجاع اللون الرسمي لكل منصة عند الهوفر
  const getSocialBrandColor = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('insta')) return '#E1306C'; // لون إنستجرام الوردي/المميز
    if (lower.includes('behance')) return '#1769ff'; // لون بيانس الأزرق
    if (lower.includes('dribbble')) return '#ea4c89'; // لون دريبل الوردي
    if (lower.includes('face') || lower.includes('fb')) return '#1877f2'; // لون فيسبوك الأزرق
    if (lower.includes('linked')) return '#0a66c2'; // لون لينكد إن الأزرق
    return '#1da1f2'; // لون تويتر/إكس الافتراضي
  };

  return (
    <footer
      dir={dir}
      className={`pt-20 pb-10 px-6 lg:px-12 relative overflow-hidden transition-colors duration-500 ${
        isDark 
          ? "bg-[#030303] text-neutral-300 border-t border-white/5" 
          : "bg-slate-100 text-slate-700 border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]"
      }`}
      style={{ borderTopColor: `${accentColor.hex}33` }}
    >
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 blur-[120px] pointer-events-none opacity-20 transition-colors duration-500"
        style={{ backgroundColor: accentColor.hex }}
      />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50, y: 30 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`lg:col-span-4 relative rounded-[36px] p-[1px] transition-all duration-700 shadow-2xl ${
              isDark 
                ? "bg-gradient-to-br from-white/20 via-neutral-800/40 to-white/5" 
                : "bg-gradient-to-br from-black/15 via-slate-200 to-black/5"
            }`}
          >
            <div className={`relative h-full w-full rounded-[35px] p-7 overflow-hidden flex flex-col justify-between space-y-6 transition-colors duration-500 ${
              isDark ? "bg-[#070605]" : "bg-white"
            }`}>
              <div 
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-10"
                style={{ backgroundColor: accentColor.hex }}
              />
              <div 
                className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-2xl pointer-events-none opacity-10"
                style={{ backgroundColor: accentColor.hex }}
              />

              <div className={`relative z-10 space-y-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black tracking-widest uppercase transition-colors duration-300 ${accentColor.textClass}`}>
                    {t.studioBadge}
                  </span>
                  <div 
                    className="w-2 h-2 rounded-full animate-ping shadow-lg" 
                    style={{ backgroundColor: accentColor.hex }}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    {siteData.logoUrl ? (
                      <img 
                        src={siteData.logoUrl} 
                        alt="Studio Logo" 
                        className="h-10 max-h-12 object-contain filter transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <h2 className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                        Studio <span className={`transition-colors duration-300 ${accentColor.textClass}`}>Logo</span>
                      </h2>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed font-light ${isDark ? "text-neutral-400" : "text-slate-600"}`}>
                    {t.bio}
                  </p>
                </div>
              </div>

              <div className={`relative z-10 flex items-center justify-start gap-3 pt-4 border-t ${
                isDark ? "border-neutral-800/80" : "border-slate-100"
              }`}>
                {socialLinks.map((item, idx) => {
                  if (!item.platform_url || item.platform_url.trim() === "" || item.platform_url === "#") {
                    return null;
                  }

                  const IconComponent = getSocialIcon(item.platform_name);
                  const brandColor = getSocialBrandColor(item.platform_name);

                  return (
                    <a
                      key={idx}
                      href={item.platform_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.platform_name}
                      className={`group/icon relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md hover:-translate-y-1 overflow-hidden border ${
                        isDark 
                          ? "bg-neutral-900 border-neutral-800" 
                          : "bg-slate-50 border-slate-200 shadow-sm"
                      }`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = brandColor;
                        e.currentTarget.style.borderColor = brandColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.borderColor = '';
                      }}
                    >
                      <IconComponent className={`relative z-10 w-4 h-4 transition-colors duration-300 ${
                        isDark ? "text-neutral-300 group-hover/icon:text-white" : "text-slate-600 group-hover:text-white"
                      }`} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 relative group/box"
          >
            <div 
              className="absolute -inset-1 rounded-[32px] blur-xl opacity-0 group-hover/box:opacity-30 transition-opacity duration-700 pointer-events-none"
              style={{ backgroundColor: accentColor.hex }}
            />

            <div className={`relative space-y-4 p-6 rounded-[30px] border shadow-2xl backdrop-blur-xl transition-colors duration-500 ${
              isDark 
                ? "bg-gradient-to-b from-neutral-900/80 via-[#070605] to-[#050403] border-white/10" 
                : "bg-gradient-to-b from-white via-slate-50 to-white border-slate-200"
            }`}>
              <div className={`flex items-center justify-between pb-2 border-b ${
                isDark ? "border-neutral-800/80" : "border-slate-100"
              }`}>
                <span className={`text-[11px] font-black tracking-[0.25em] uppercase transition-colors duration-300 ${accentColor.textClass}`}>
                  {t.contactTitle}
                </span>
                <div className="flex items-center gap-1.5">
                  <span 
                    className="w-2 h-2 rounded-full animate-pulse" 
                    style={{ backgroundColor: accentColor.hex }}
                  />
                  <span className={`text-[10px] font-medium ${isDark ? "text-neutral-400" : "text-slate-500"}`}>{t.available}</span>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${siteData.email}?subject=${encodeURIComponent(t.emailSubject)}&body=${encodeURIComponent(t.emailBody)}`}
                  className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 shadow-lg ${
                    isDark 
                      ? "bg-neutral-900/60 border-neutral-800/80 hover:bg-neutral-900" 
                      : "bg-slate-50/80 border-slate-200 hover:bg-white shadow-sm"
                  }`}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = accentColor.hex)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                >
                  <div className={`truncate ${lang === 'ar' ? 'text-right pl-3' : 'text-left pr-3'}`}>
                    <span className={`text-[10px] tracking-wider font-bold block mb-0.5 uppercase transition-colors duration-300 ${accentColor.textClass}`}>
                      {t.emailLabel}
                    </span>
                    <span className={`text-xs font-extrabold transition-colors ${
                      isDark ? "text-neutral-100 group-hover:text-white" : "text-slate-800 group-hover:text-slate-950"
                    }`}>
                      {siteData.email}
                    </span>
                  </div>
                  <div 
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner border ${
                      isDark ? "bg-neutral-800/80 border-neutral-700/60 text-neutral-200" : "bg-white border-slate-200 text-slate-700"
                    }`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = accentColor.hex;
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '';
                    }}
                  >
                    <FaEnvelope className="w-4 h-4" />
                  </div>
                </a>

                <a
                  href={`https://wa.me/${siteData.phone}?text=${encodeURIComponent(t.waMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 shadow-lg ${
                    isDark 
                      ? "bg-neutral-900/60 border-neutral-800/80" 
                      : "bg-slate-50/80 border-slate-200 shadow-sm"
                  }`}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = accentColor.hex)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                >
                  <div className={`truncate ${lang === 'ar' ? 'text-right pl-3' : 'text-left pr-3'}`}>
                    <span className={`text-[10px] tracking-wider font-bold block mb-0.5 uppercase transition-colors duration-300 ${accentColor.textClass}`}>
                      {t.whatsappLabel}
                    </span>
                    <span className={`text-xs font-extrabold transition-colors ${
                      isDark ? "text-neutral-100 group-hover:text-white" : "text-slate-800 group-hover:text-slate-950"
                    }`} dir="ltr">
                      {siteData.phone}
                    </span>
                  </div>
                  <div 
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner border ${
                      isDark ? "bg-neutral-800/80 border-neutral-700/60 text-neutral-200" : "bg-white border-slate-200 text-slate-700"
                    }`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = accentColor.hex;
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '';
                    }}
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </div>
                </a>

                <div className={`flex items-center justify-between p-4 rounded-2xl border ${
                  isDark ? "bg-neutral-900/40 border-neutral-800/60" : "bg-slate-50/50 border-slate-200/80"
                }`}>
                  <div className={`truncate ${lang === 'ar' ? 'text-right pl-3' : 'text-left pr-3'}`}>
                    <span className={`text-[10px] tracking-wider font-bold block mb-0.5 uppercase ${isDark ? "text-neutral-500" : "text-slate-400"}`}>
                      {t.locationLabel}
                    </span>
                    <span className={`text-xs font-extrabold ${isDark ? "text-neutral-300" : "text-slate-800"}`}>
                      {t.locationVal}
                    </span>
                  </div>
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border ${
                    isDark ? "bg-neutral-800/50 border-neutral-700/40 text-neutral-400" : "bg-white border-slate-200 text-slate-500"
                  }`}>
                    <FaMapMarkerAlt className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className={`lg:col-span-4 relative rounded-[32px] p-[1px] group transition-all duration-700 shadow-2xl overflow-hidden ${
              isDark 
                ? "bg-gradient-to-br from-white/30 via-white/5 to-transparent" 
                : "bg-gradient-to-br from-black/20 via-black/5 to-transparent"
            }`}
          >
            <div className={`relative h-full w-full rounded-[31px] p-7 overflow-hidden flex flex-col justify-between transition-colors duration-500 ${
              isDark ? "bg-[#070605]" : "bg-white"
            }`}>
              <div 
                className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700 opacity-15"
                style={{ backgroundColor: accentColor.hex }}
              />
              <div 
                className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-2xl pointer-events-none opacity-10"
                style={{ backgroundColor: accentColor.hex }}
              />
              <div 
                className="absolute top-0 right-8 left-8 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500" 
                style={{ background: `linear-gradient(to right, transparent, ${accentColor.hex}, transparent)` }}
              />

              <div className={`relative z-10 space-y-5 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center justify-between">
                  <span 
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-inner transition-colors duration-300 ${accentColor.textClass}`}
                    style={{ backgroundColor: `${accentColor.hex}15`, borderColor: `${accentColor.hex}40` }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full animate-ping" 
                      style={{ backgroundColor: accentColor.hex }}
                    />
                    2026 Showcase
                  </span>
                  
                  <div 
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 ${
                      isDark ? "bg-neutral-900/90 border-white/10 text-neutral-200" : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = accentColor.hex;
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '';
                    }}
                  >
                    <FaPalette className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className={`text-xl font-black text-transparent bg-clip-text bg-gradient-to-l tracking-wide ${
                    isDark ? "from-white via-neutral-100 to-neutral-300" : "from-slate-900 via-slate-800 to-slate-700"
                  }`}>
                    {t.portfolioTitle}
                  </h3>
                  <p className={`text-xs leading-relaxed font-light ${isDark ? "text-neutral-400" : "text-slate-600"}`}>
                    {t.portfolioDesc}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-7 relative z-10">
                <a
                  href={siteData.attachmentPath}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className={`group/btn relative overflow-hidden flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border text-xs font-bold transition-all duration-300 shadow-lg hover:-translate-y-1 ${
                    isDark 
                      ? "border-white/15 bg-neutral-900/80 text-neutral-200 hover:text-white" 
                      : "border-slate-300 bg-slate-50 text-slate-700 hover:text-slate-900 shadow-sm"
                  }`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  <FaDownload className={`w-3.5 h-3.5 transition-transform group-hover/btn:-translate-y-0.5 ${accentColor.textClass}`} />
                  <span className="relative z-10">{t.downloadBtn}</span>
                </a>

                <a
                  href="https://behance.net"
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn relative overflow-hidden flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-neutral-950 text-xs font-black transition-all duration-300 shadow-lg hover:-translate-y-1"
                  style={{ backgroundColor: accentColor.hex }}
                >
                  <span className="relative z-10 flex items-center gap-1.5 text-neutral-950">
                    <span>{t.behanceBtn}</span>
                    <FaExternalLinkAlt className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors duration-500 ${
          isDark ? "border-neutral-800/80 text-neutral-500" : "border-slate-200 text-slate-500"
        }`}>
          <p>
            &copy; {currentYear} — {t.rights}
          </p>

          <div className="flex items-center gap-6">
            <a 
              href="#privacy" 
              className="transition-colors hover:opacity-100" 
              onMouseEnter={(e) => e.currentTarget.style.color = accentColor.hex} 
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
            >
              {t.privacy}
            </a>
            <a 
              href="#terms" 
              className="transition-colors hover:opacity-100" 
              onMouseEnter={(e) => e.currentTarget.style.color = accentColor.hex} 
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
            >
              {t.terms}
            </a>
            <button
              onClick={scrollToTop}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDark ? "text-neutral-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{t.backToTop}</span>
              <FaArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}