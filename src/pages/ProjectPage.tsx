import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Sparkles, 
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';

type AccentColor = {
  name: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  shadowClass: string;
  hex: string;
};

type Project = {
  id: number;
  name_ar: string;
  name_en: string;
  service_id: number | null;
  section_id: number | null;
};

type GalleryImage = { id: number; image: string };

const defaultAccent: AccentColor = {
  name: 'orange',
  textClass: 'text-orange-500',
  bgClass: 'bg-orange-500/15',
  borderClass: 'border-orange-500/40',
  shadowClass: 'shadow-[0_0_15px_rgba(249,115,22,0.25)]',
  hex: '#f97316',
};

export default function ProjectPage({
  isDark,
  accentColor = defaultAccent,
}: {
  isDark: boolean;
  accentColor?: AccentColor;
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, dir } = useLanguage();
  const isAr = lang !== 'en';
  const accentHex = accentColor.hex;

  const [project, setProject] = useState<Project | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [serviceTitle, setServiceTitle] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProjectData = async () => {
      setLoading(true);
      setErrorText('');
      setGallery([]);
      setServiceTitle('');
      setSectionTitle('');

      const projectId = Number(id);
      if (!projectId || Number.isNaN(projectId)) {
        setErrorText('invalid project id');
        setLoading(false);
        return;
      }

      const { data: proj, error: projErr } = await supabase
        .from('projects')
        .select('id, name_ar, name_en, service_id, section_id')
        .eq('id', projectId)
        .eq('is_published', true)
        .maybeSingle();

      if (cancelled) return;

      if (projErr) {
        setErrorText(projErr.message);
        setLoading(false);
        return;
      }

      if (!proj) {
        setProject(null);
        setLoading(false);
        return;
      }

      const p = proj as Project;
      setProject(p);

      const [imgRes, svcRes, secRes] = await Promise.all([
        supabase
          .from('project_images')
          .select('id, image')
          .eq('project_id', projectId)
          .order('sort_order', { ascending: false })
          .order('id', { ascending: true }),
        p.service_id
          ? supabase.from('services').select('title_ar, title_en').eq('id', p.service_id).maybeSingle()
          : Promise.resolve({ data: null, error: null } as any),
        p.section_id
          ? supabase.from('sections').select('title_ar, title_en').eq('id', p.section_id).maybeSingle()
          : Promise.resolve({ data: null, error: null } as any),
      ]);

      if (cancelled) return;

      if (!imgRes.error) setGallery((imgRes.data as GalleryImage[]) || []);
      if (svcRes?.data)
        setServiceTitle((isAr ? svcRes.data.title_ar : svcRes.data.title_en) || svcRes.data.title_ar || '');
      if (secRes?.data)
        setSectionTitle((isAr ? secRes.data.title_ar : secRes.data.title_en) || secRes.data.title_ar || '');

      setLoading(false);
    };

    loadProjectData();
    return () => {
      cancelled = true;
    };
  }, [id, isAr]);

  const allImages = gallery.map((img) => ({ id: img.id, image: img.image }));

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (delta: number) => {
      setLightbox((cur) => {
        if (cur === null || allImages.length === 0) return cur;
        return (cur + delta + allImages.length) % allImages.length;
      });
    },
    [allImages.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightbox, closeLightbox, step]);

  const translations = isAr
    ? {
        back: 'الرجوع للخدمات',
        notFound: 'المشروع غير موجود أو غير منشور.',
        gallery: 'معرض أعمال المشروع',
        error: 'تعذّر تحميل تفاصيل المشروع.',
        shots: 'لقطة توضيحية',
      }
    : {
        back: 'Back to Services',
        notFound: 'Project not found or unpublished.',
        gallery: 'Project Showcase',
        error: 'Could not load project details.',
        shots: 'Preview Shot',
      };

  const projectName = project ? (isAr ? project.name_ar : project.name_en) || project.name_ar : '';

  return (
    <div
      dir={dir}
      className={`min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        isDark ? 'bg-[#050508] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background Aesthetic Glows */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] opacity-10 pointer-events-none"
        style={{ backgroundColor: accentHex }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => (project?.service_id ? navigate(`/service/${project.service_id}`) : navigate('/'))}
          className={`inline-flex items-center gap-2.5 text-xs font-medium px-4 py-2.5 rounded-xl transition-all duration-300 border mb-10 group ${
            isDark 
              ? 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.08] hover:text-white' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
          }`}
        >
          {isAr ? <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> : <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />}
          <span>{serviceTitle ? `${serviceTitle} / ${translations.back}` : translations.back}</span>
        </button>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <div className={`h-8 w-48 rounded-full animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
            <div className={`h-16 w-3/4 rounded-2xl animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
            <div className={`h-[500px] rounded-3xl animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
          </div>
        )}

        {/* Error State */}
        {!loading && errorText && (
          <div className={`rounded-3xl border p-12 text-center max-w-lg mx-auto ${isDark ? 'border-rose-500/30 bg-[#0a0a0f]/90 backdrop-blur-xl' : 'border-rose-300 bg-white shadow-xl'}`}>
            <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-rose-500" />
            <p className="text-sm font-bold mb-2">{translations.error}</p>
            <p className="text-xs font-mono text-rose-400 bg-rose-500/10 py-1.5 px-3 rounded-lg inline-block" dir="ltr">{errorText}</p>
          </div>
        )}

        {/* Not Found State */}
        {!loading && !errorText && !project && (
          <div className="text-center py-24">
            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{translations.notFound}</p>
          </div>
        )}

        {/* Main Content Showcase */}
        {!loading && !errorText && project && (
          <div className="space-y-12 animate-fade-in">
            
            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 border-white/10">
              <div className="space-y-4">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {serviceTitle && (
                    <span
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md tracking-wide"
                      style={{ color: accentHex, borderColor: `${accentHex}40`, backgroundColor: `${accentHex}10` }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {serviceTitle}
                    </span>
                  )}
                  {sectionTitle && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md ${
                        isDark ? 'border-white/10 text-gray-300 bg-white/[0.03]' : 'border-slate-200 text-slate-700 bg-white shadow-sm'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 opacity-70" />
                      {sectionTitle}
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">{projectName}</h1>
              </div>

              {/* Gallery Counter Badge */}
              {gallery.length > 0 && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-medium ${
                  isDark ? 'bg-white/[0.02] border-white/10 text-gray-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <ImageIcon className="w-4 h-4" style={{ color: accentHex }} />
                  <span>{gallery.length} {isAr ? 'صور معروضة' : 'Showcase Shots'}</span>
                </div>
              )}
            </div>

            {/* Gallery Grid Section (Client Showcase) */}
            {gallery.length > 0 && (
              <div className="space-y-6">
                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                  {gallery.map((img, index) => (
                    <div
                      key={`${img.id}-${index}`}
                      onClick={() => setLightbox(index)}
                      className={`group relative rounded-3xl overflow-hidden border w-full cursor-pointer transition-all duration-500 shadow-xl break-inside-avoid p-3 ${
                        isDark 
                          ? 'border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-white/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xl'
                      }`}
                    >
                      <div className="overflow-hidden rounded-2xl w-full flex items-center justify-center bg-black/20">
                        <img
                          src={img.image}
                          alt=""
                          loading="lazy"
                          className="w-full h-auto object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-700"
                        />
                      </div>
                      
                      {/* Hover Overlay Badge */}
                      <div className="absolute inset-3 rounded-2xl bg-black/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 shadow-lg">
                          <Maximize2 className="w-4 h-4" />
                          {isAr ? 'تكبير الصورة' : 'Zoom Image'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightbox !== null && allImages[lightbox] && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 animate-fade-in" 
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 end-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10 shadow-xl"
          >
            <X className="w-6 h-6" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="absolute start-4 sm:start-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10 shadow-xl"
              >
                {isAr ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="absolute end-4 sm:end-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10 shadow-xl"
              >
                {isAr ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </button>
            </>
          )}

          <div className="max-w-7xl max-h-[90vh] flex flex-col items-center justify-center relative w-full h-full">
            <img
              src={allImages[lightbox].image}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[82vh] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <div className="mt-6 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-xs font-mono text-white/90 border border-white/15 shadow-xl" dir="ltr">
              {lightbox + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}