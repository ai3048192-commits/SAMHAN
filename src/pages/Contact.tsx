import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, Mail, Phone, MapPin, CheckCircle2, MessageSquare, ShieldCheck, User, Star, Briefcase, Award, Globe, Headphones, Lock, Building2, Palette } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';

type ContactProps = {
  isDark?: boolean;
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

export default function UltimateContactAndReviewsSection({ isDark = true, accentColor = defaultAccent }: ContactProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  
  const { lang, dir } = useLanguage();
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    service: 'هوية بصرية', 
    message: '' 
  });

  const t = {
    ar: {
      badge: "منصة طلبات التصميم والهوية البصرية",
      titlePart1: "اطلب تصميمك أو",
      titlePart2: "شاركنا برأيك",
      desc: "استوديو إبداعي متكامل مصمم خصيصاً لتحويل أفكارك إلى هويات بصرية وتصاميم تخطف الأنظار.",
      tabContact: "طلب تصميم جديد وتواصل",
      tabReviews: "آراء العملاء المميزين",
      emailLabel: "البريد الإلكتروني",
      supportLabel: "الدعم المباشر",
      locationLabel: "المقر الرئيسي",
      locationVal: "القاهرة، مصر",
      securityText: "جميع بيانات مشاريعك ومعلوماتك محمية بأعلى معايير السرية",
      successMsgTitle: "تم إرسال طلبك بنجاح!",
      successMsgDesc: "سيقوم مصمم الهويات بدراسة طلبك والتواصل معك عبر البريد أو الهاتف خلال أقل من ساعتين.",
      fullNameLabel: "الاسم بالكامل *",
      fullNamePh: "أدخل اسمك الكريم...",
      emailInputLabel: "البريد الإلكتروني *",
      phoneLabel: "رقم الهاتف / واتساب",
      serviceLabel: "اختر نوع خدمة التصميم *",
      msgLabel: "تفاصيل المشروع الفني أو فكرة الشعار *",
      msgPh: "اكتب تفاصيل البراند الخاص بك، الألوان المفضلة، أو فكرة التصميم هنا...",
      submitBtn: "إرسال طلب التصميم الآن",
      reviewsTitle: "آراء العملاء المميزين",
      reviewsDesc: "تجارب حقيقية لشركات وعلامات تجارية طورت هويتها معنا.",
      evalTitle: "رأيك يُحدث فرقاً",
      shareExpTitle: "شاركنا تجربتك",
      shareExpDesc: "نحن نرحب بأي تقييم يسهم في الارتقاء بمستوى التصاميم المقدمة.",
      thanksReview: "شكراً لتقييمك الرائع!",
      publishedReview: "تم إرسال تعليقك بنجاح وسيتم مراجعته ونشره قريباً.",
      nameReviewLabel: "الاسم الكريم",
      nameReviewPh: "أدخل اسمك الكامل",
      emailReviewLabel: "البريد الإلكتروني",
      emailReviewOpt: "(اختياري)",
      generalRating: "التقييم العام",
      commentLabel: "انطباعك عن جودة التصاميم",
      commentPh: "اكتب تفاصيل تجربتك بكل صراحة...",
      publishBtn: "إرسال التقييم للمراجعة",
      services: [
        { id: 'هوية بصرية', label: 'هوية بصرية متكاملة', icon: Sparkles },
        { id: 'سوشيال ميديا', label: 'تصاميم سوشيال ميديا', icon: Palette },
        { id: 'مطبوعات وتغليف', label: 'المطبوعات والتغليف', icon: Briefcase },
        { id: 'موشن جرافيك', label: 'موشن جرافيك وإعلانات', icon: Award }
      ]
    },
    en: {
      badge: "Design & Visual Identity Platform",
      titlePart1: "Request Your Design or",
      titlePart2: "Share Your Feedback",
      desc: "An integrated creative studio built to transform your brand identity into stunning visuals.",
      tabContact: "Request Design & Contact",
      tabReviews: "Featured Client Reviews",
      emailLabel: "Email Address",
      supportLabel: "Direct Support",
      locationLabel: "Main Headquarters",
      locationVal: "Cairo, Egypt",
      securityText: "All project data and information are protected with high confidentiality",
      successMsgTitle: "Your request has been sent successfully!",
      successMsgDesc: "Our designer will review your request and contact you within two hours.",
      fullNameLabel: "Full Name *",
      fullNamePh: "Enter your full name...",
      emailInputLabel: "Email Address *",
      phoneLabel: "Phone / WhatsApp",
      serviceLabel: "Select Design Service *",
      msgLabel: "Project Details or Brand Vision *",
      msgPh: "Write details about your brand, preferred colors, or design idea...",
      submitBtn: "Send Design Request Now",
      reviewsTitle: "Featured Client Reviews",
      reviewsDesc: "Real experiences from brands that leveled up their identity with us.",
      evalTitle: "Your Opinion Matters",
      shareExpTitle: "Share Your Experience",
      shareExpDesc: "We welcome every review that helps us improve our creative services.",
      thanksReview: "Thank you for your rating!",
      publishedReview: "Your comment has been submitted and will be published soon.",
      nameReviewLabel: "Your Name",
      nameReviewPh: "Enter your full name",
      emailReviewLabel: "Email Address",
      emailReviewOpt: "(optional)",
      generalRating: "General Rating",
      commentLabel: "Your Impression",
      commentPh: "Write the details of your experience...",
      publishBtn: "Submit Review for Review",
      services: [
        { id: 'هوية بصرية', label: 'Visual Identity', icon: Sparkles },
        { id: 'سوشيال ميديا', label: 'Social Media Design', icon: Palette },
        { id: 'مطبوعات وتغليف', label: 'Print & Packaging', icon: Briefcase },
        { id: 'موشن جرافيك', label: 'Motion & Ads', icon: Award }
      ]
    }
  };

  const currentText = t[lang] || t.ar;

  const [reviews, setReviews] = useState([]);

  const [newReview, setNewReview] = useState({
    name: '',
    email: '',
    role: lang === 'en' ? 'Verified Client' : 'عميل معتمد',
    rating: 5,
    comment: ''
  });

  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const sectionRef = useRef(null);

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

  // جلب التقييمات المعتمدة فقط من Supabase
  useEffect(() => {
    const fetchApprovedReviews = async () => {
      const { data, error } = await supabase
        .from('client_reviews')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setReviews(data);
      }
    };

    fetchApprovedReviews();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    try {
      const { error } = await supabase
        .from('client_requests')
        .insert([
          {
            full_name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service_type: formData.service,
            message: formData.message,
          }
        ]);

      if (error) {
        console.error("Error inserting data into Supabase:", error);
        return;
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', service: currentText.services[0].id, message: '' });
      }, 4500);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    try {
      const { error } = await supabase
        .from('client_reviews')
        .insert([
          {
            name: newReview.name,
            email: newReview.email,
            role: newReview.role || (lang === 'en' ? 'Verified Client' : 'عميل معتمد'),
            rating: Number(newReview.rating),
            comment: newReview.comment,
            is_published: false // معلق للمراجعة في الداشبورد ولا يظهر تلقائياً
          }
        ]);

      if (error) {
        console.error("Error inserting review:", error);
        return;
      }

      setNewReview({ name: '', email: '', role: lang === 'en' ? 'Verified Client' : 'عميل معتمد', rating: 5, comment: '' });
      setReviewSubmitted(true);
      setTimeout(() => {
        setReviewSubmitted(false);
      }, 4000);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <section 
      id="contact"
      ref={sectionRef}
      dir={dir} 
      className={`min-h-screen pt-28 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center transition-colors duration-500 ${
        isDark ? 'bg-[#010103] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[240px] pointer-events-none opacity-15 transition-colors duration-500"
        style={{ backgroundColor: accentColor.hex }}
      ></div>
      <div className="absolute inset-0 bg-[radial-gradient(#ff7d0012_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40"></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        <div className={`flex justify-center mb-6 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div 
            className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border text-xs backdrop-blur-2xl shadow-sm ${
              isDark ? 'bg-[#0a0a0f]/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}
            style={{ borderColor: `${accentColor.hex}40` }}
          >
            <Sparkles className="w-4 h-4 animate-spin" style={{ color: accentColor.hex }} />
            <span className="tracking-widest font-black uppercase">{currentText.badge}</span>
          </div>
        </div>

        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-1000 delay-150 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 leading-tight">
            {currentText.titlePart1}{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${accentColor.hex}, #f59e0b)` }}>
              {currentText.titlePart2}
            </span>
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            {currentText.desc}
          </p>
        </div>

        <div className={`flex justify-center gap-4 mb-14 transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 cursor-pointer flex items-center gap-3 ${
              activeTab === 'contact' 
                ? 'text-neutral-950 shadow-lg scale-105' 
                : isDark ? 'bg-[#060609] border border-white/10 text-gray-300 hover:border-white/30' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
            style={activeTab === 'contact' ? { backgroundColor: accentColor.hex } : {}}
          >
            <Send className="w-4 h-4" />
            <span>{currentText.tabContact}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 cursor-pointer flex items-center gap-3 ${
              activeTab === 'reviews' 
                ? 'text-neutral-950 shadow-lg scale-105' 
                : isDark ? 'bg-[#060609] border border-white/10 text-gray-300 hover:border-white/30' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
            style={activeTab === 'reviews' ? { backgroundColor: accentColor.hex } : {}}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{currentText.tabReviews} ({reviews.length})</span>
          </button>
        </div>

        {activeTab === 'contact' ? (
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            <div className="lg:col-span-4 flex flex-col gap-5">
              
              <div className={`group relative border rounded-[2rem] p-6 transition-all duration-500 shadow-md overflow-hidden ${
                isDark ? 'bg-gradient-to-br from-[#0c0c12] to-[#050508] border-white/10 hover:border-white/30' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform opacity-10" style={{ backgroundColor: accentColor.hex }}></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div 
                    className="w-12 h-12 rounded-2xl text-neutral-950 flex items-center justify-center shadow-md flex-shrink-0"
                    style={{ backgroundColor: accentColor.hex }}
                  >
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold block mb-0.5 tracking-wider uppercase" style={{ color: accentColor.hex }}>{currentText.emailLabel}</span>
                    <span className={`text-xs sm:text-sm font-black tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`} dir="ltr">samhan@design-studio.com</span>
                  </div>
                </div>
              </div>

              <div className={`group relative border rounded-[2rem] p-6 transition-all duration-500 shadow-md overflow-hidden ${
                isDark ? 'bg-gradient-to-br from-[#0c0c12] to-[#050508] border-white/10 hover:border-white/30' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform opacity-10" style={{ backgroundColor: accentColor.hex }}></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div 
                    className="w-12 h-12 rounded-2xl text-neutral-950 flex items-center justify-center shadow-md flex-shrink-0"
                    style={{ backgroundColor: accentColor.hex }}
                  >
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold block mb-0.5 tracking-wider uppercase" style={{ color: accentColor.hex }}>{currentText.supportLabel}</span>
                    <span className={`text-sm font-black tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`} dir="ltr">+20 100 123 4567</span>
                  </div>
                </div>
              </div>

              <div className={`group relative border rounded-[2rem] p-6 transition-all duration-500 shadow-md overflow-hidden ${
                isDark ? 'bg-gradient-to-br from-[#0c0c12] to-[#050508] border-white/10 hover:border-white/30' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform opacity-10" style={{ backgroundColor: accentColor.hex }}></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div 
                    className="w-12 h-12 rounded-2xl text-neutral-950 flex items-center justify-center shadow-md flex-shrink-0"
                    style={{ backgroundColor: accentColor.hex }}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold block mb-0.5 tracking-wider uppercase" style={{ color: accentColor.hex }}>{currentText.locationLabel}</span>
                    <span className={`text-xs sm:text-sm font-black tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}>{currentText.locationVal}</span>
                  </div>
                </div>
              </div>

              <div className={`border rounded-[2rem] p-5 shadow-sm flex items-center gap-3 ${
                isDark ? 'bg-[#08080c] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center flex-shrink-0" style={{ color: accentColor.hex }}>
                  <Lock className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-bold leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{currentText.securityText}</span>
              </div>

            </div>

            <div className={`lg:col-span-8 border rounded-[3rem] p-8 sm:p-12 shadow-xl relative overflow-hidden ${
              isDark ? 'bg-[#060609]/95 border-white/10' : 'bg-white border-slate-200'
            }`}>
              {isSubmitted ? (
                <div className="h-[400px] flex flex-col items-center justify-center text-center py-12 animate-fadeIn">
                  <div 
                    className="w-20 h-20 rounded-3xl text-neutral-950 flex items-center justify-center mb-6 shadow-lg"
                    style={{ backgroundColor: accentColor.hex }}
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentText.successMsgTitle}</h3>
                  <p className={`text-sm max-w-md ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{currentText.successMsgDesc}</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black tracking-wider uppercase" style={{ color: accentColor.hex }}>{currentText.fullNameLabel}</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder={currentText.fullNamePh}
                          className={`w-full border rounded-2xl pl-12 pr-5 py-4 text-sm outline-none transition-all shadow-inner ${
                            isDark ? 'bg-[#020204] border-white/10 text-white focus:border-white/40' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                          }`}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" style={{ color: accentColor.hex }}>
                          <User className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black tracking-wider uppercase" style={{ color: accentColor.hex }}>{currentText.emailInputLabel}</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="name@example.com"
                          className={`w-full border rounded-2xl pl-12 pr-5 py-4 text-sm outline-none transition-all shadow-inner ${
                            isDark ? 'bg-[#020204] border-white/10 text-white focus:border-white/40' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                          }`}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" style={{ color: accentColor.hex }}>
                          <Mail className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black tracking-wider uppercase" style={{ color: accentColor.hex }}>{currentText.phoneLabel}</label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+20 123 456 7890"
                        className={`w-full border rounded-2xl pl-12 pr-5 py-4 text-sm outline-none transition-all shadow-inner ${
                          isDark ? 'bg-[#020204] border-white/10 text-white focus:border-white/40' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                        }`}
                        dir="ltr"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" style={{ color: accentColor.hex }}>
                        <Phone className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-black tracking-wider uppercase" style={{ color: accentColor.hex }}>{currentText.serviceLabel}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {currentText.services.map((serv) => {
                        const IconComp = serv.icon;
                        const isSelected = formData.service === serv.id;
                        return (
                          <button
                            type="button"
                            key={serv.id}
                            onClick={() => setFormData({...formData, service: serv.id})}
                            className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
                              isSelected 
                                ? 'text-neutral-950 font-black shadow-md scale-105' 
                                : isDark ? 'bg-[#020204] border-white/10 text-gray-300 hover:border-white/30' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                            style={isSelected ? { backgroundColor: accentColor.hex, borderColor: accentColor.hex } : {}}
                          >
                            <IconComp className={`w-5 h-5 ${isSelected ? 'text-neutral-950' : ''}`} style={!isSelected ? { color: accentColor.hex } : {}} />
                            <span className="text-xs text-center">{serv.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black tracking-wider uppercase" style={{ color: accentColor.hex }}>{currentText.msgLabel}</label>
                    <div className="relative">
                      <textarea 
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder={currentText.msgPh}
                        className={`w-full border rounded-2xl pl-12 pr-5 py-4 text-sm outline-none transition-all shadow-inner resize-none ${
                          isDark ? 'bg-[#020204] border-white/10 text-white focus:border-white/40' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                        }`}
                      ></textarea>
                      <div className="absolute left-4 top-4 pointer-events-none opacity-70" style={{ color: accentColor.hex }}>
                        <MessageSquare className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full group text-neutral-950 font-black py-5 px-8 rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3 cursor-pointer text-base"
                    style={{ backgroundColor: accentColor.hex }}
                  >
                    <span>{currentText.submitBtn}</span>
                    <Send className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>

                </form>
              )}
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-all duration-700">
            
            <div className="lg:col-span-7 space-y-6">
              <div className={`flex items-center justify-between border rounded-[2.5rem] px-8 py-6 shadow-md ${
                isDark ? 'bg-[#060609]/90 border-white/10' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <h3 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentText.reviewsTitle}</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{currentText.reviewsDesc}</p>
                </div>
                <div className="px-4 py-2 rounded-xl border text-xs font-bold" style={{ backgroundColor: `${accentColor.hex}15`, borderColor: `${accentColor.hex}40`, color: accentColor.hex }}>
                  {reviews.length} {lang === 'en' ? 'Reviews' : 'تقييم'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {reviews.map((rev: any) => (
                  <div 
                    key={rev.id} 
                    className={`border rounded-[2rem] p-5 transition-all shadow-md flex flex-col justify-between ${
                      isDark ? 'bg-[#060609]/95 border-white/10 hover:border-white/30' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 text-right">
                        <div className="w-10 h-10 rounded-full border flex items-center justify-center font-bold overflow-hidden flex-shrink-0" style={{ backgroundColor: `${accentColor.hex}15`, borderColor: `${accentColor.hex}40`, color: accentColor.hex }}>
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{rev.name}</h4>
                          <span className="text-[10px] block opacity-80" style={{ color: accentColor.hex }}>{rev.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[...Array(Number(rev.rating))].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: accentColor.hex }} />
                        ))}
                      </div>
                    </div>

                    <div className={`border rounded-2xl p-3.5 text-center ${isDark ? 'bg-[#020204] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
                        {rev.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`lg:col-span-5 border rounded-[3rem] p-8 sm:p-10 shadow-xl relative overflow-hidden ${
              isDark ? 'bg-[#060609]/95 border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor.hex }}></span>
                <span className="text-xs font-bold tracking-wider" style={{ color: accentColor.hex }}>{currentText.evalTitle}</span>
              </div>

              <h3 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentText.shareExpTitle}</h3>
              <p className={`text-xs mb-8 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{currentText.shareExpDesc}</p>

              {reviewSubmitted ? (
                <div className="border rounded-2xl p-6 text-center my-12" style={{ backgroundColor: `${accentColor.hex}15`, borderColor: `${accentColor.hex}40` }}>
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2" style={{ color: accentColor.hex }} />
                  <h4 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentText.thanksReview}</h4>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{currentText.publishedReview}</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  
                  <div>
                    <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{currentText.nameReviewLabel}</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        value={newReview.name}
                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                        placeholder={currentText.nameReviewPh}
                        className={`w-full border rounded-2xl pl-12 pr-5 py-4 text-xs outline-none transition-all shadow-inner ${
                          isDark ? 'bg-[#020204] border-white/10 text-white focus:border-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                        }`}
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" style={{ color: accentColor.hex }}>
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{currentText.emailReviewLabel} <span className="text-gray-500 font-normal">{currentText.emailReviewOpt}</span></label>
                    <div className="relative">
                      <input 
                        type="email" 
                        value={newReview.email}
                        onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                        placeholder="name@example.com"
                        className={`w-full border rounded-2xl pl-12 pr-5 py-4 text-xs outline-none transition-all shadow-inner ${
                          isDark ? 'bg-[#020204] border-white/10 text-white focus:border-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                        }`}
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" style={{ color: accentColor.hex }}>
                        <Mail className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{currentText.generalRating}</span>
                      <span className="px-3 py-1 rounded-xl border text-[10px] font-bold" style={{ backgroundColor: `${accentColor.hex}15`, borderColor: `${accentColor.hex}40`, color: accentColor.hex }}>{newReview.rating} / 5</span>
                    </div>
                    <div className={`border rounded-2xl p-3.5 flex items-center justify-center gap-2 ${isDark ? 'bg-[#020204] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          onClick={() => setNewReview({...newReview, rating: i + 1})}
                          className={`w-5 h-5 fill-current cursor-pointer hover:scale-110 transition-transform ${i < newReview.rating ? '' : 'opacity-30'}`} 
                          style={{ color: accentColor.hex }} 
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{currentText.commentLabel}</label>
                    <div className="relative">
                      <textarea 
                        rows={4}
                        required
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder={currentText.commentPh}
                        className={`w-full border rounded-2xl pl-12 pr-5 py-4 text-xs outline-none transition-all shadow-inner resize-none ${
                          isDark ? 'bg-[#020204] border-white/10 text-white focus:border-white/30' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                        }`}
                      ></textarea>
                      <div className="absolute left-4 top-4 pointer-events-none opacity-70" style={{ color: accentColor.hex }}>
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full text-neutral-950 font-black py-4 px-6 rounded-2xl text-sm transition-all shadow-lg cursor-pointer"
                    style={{ backgroundColor: accentColor.hex }}
                  >
                    {currentText.publishBtn}
                  </button>

                </form>
              )}

            </div>

          </div>
        )}

      </div>
    </section>
  );
}