import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, AlertTriangle, Images, Sparkles, FolderKanban, Compass } from 'lucide-react';
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

type Service = {
  id: number;
  title_ar: string | null;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
};

type Section = { id: number; title_ar: string; title_en: string | null; sort_order: number };

type Project = {
  id: number;
  name_ar: string;
  name_en: string;
  desc_ar: string | null;
  desc_en: string | null;
  image: string | null;
  section_id: number | null;
};

const defaultAccent: AccentColor = {
  name: 'orange',
  textClass: 'text-orange-500',
  bgClass: 'bg-orange-500/15',
  borderClass: 'border-orange-500/40',
  shadowClass: 'shadow-[0_0_15px_rgba(249,115,22,0.25)]',
  hex: '#f97316',
};

export default function ServicePage({
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

  const [service, setService] = useState<Service | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [imageCounts, setImageCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setErrorText('');

      const serviceId = Number(id);
      if (!serviceId || Number.isNaN(serviceId)) {
        setErrorText('invalid service id');
        setLoading(false);
        return;
      }

      const [svcRes, secRes, projRes] = await Promise.all([
        supabase
          .from('services')
          .select('id, title_ar, title_en, description_ar, description_en')
          .eq('id', serviceId)
          .maybeSingle(),
        supabase
          .from('sections')
          .select('id, title_ar, title_en, sort_order')
          .eq('service_id', serviceId)
          .order('sort_order', { ascending: false }),
        supabase
          .from('projects')
          .select('id, name_ar, name_en, desc_ar, desc_en, image, section_id')
          .eq('service_id', serviceId)
          .eq('is_published', true)
          .order('sort_order', { ascending: false })
          .order('id', { ascending: false }),
      ]);

      if (cancelled) return;

      if (svcRes.error) {
        setErrorText(svcRes.error.message);
        setLoading(false);
        return;
      }

      setService(svcRes.data as Service | null);
      if (!secRes.error) setSections((secRes.data as Section[]) || []);

      if (projRes.error) {
        setErrorText(projRes.error.message);
        setLoading(false);
        return;
      }

      const list = (projRes.data as Project[]) || [];
      setProjects(list);

      if (list.length > 0) {
        const { data: imgs } = await supabase
          .from('project_images')
          .select('project_id')
          .in('project_id', list.map((p) => p.id));

        if (!cancelled && imgs) {
          const counts: Record<number, number> = {};
          (imgs as { project_id: number }[]).forEach((r) => {
            counts[r.project_id] = (counts[r.project_id] || 0) + 1;
          });
          setImageCounts(counts);
        }
      }

      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const t = isAr
    ? {
        back: 'العودة لمعرض الأعمال',
        empty: 'لا توجد مشاريع منشورة في هذه الخدمة حالياً.',
        notFound: 'الخدمة غير موجودة.',
        other: 'مشاريع متنوعة',
        error: 'تعذّر تحميل البيانات بنجاح.',
        images: 'صور',
        explore: 'استكشاف المشروع',
        totalProjects: 'إجمالي المشاريع',
      }
    : {
        back: 'Back to Portfolio',
        empty: 'No published projects in this service yet.',
        notFound: 'Service not found.',
        other: 'Other Works',
        error: 'Could not load data.',
        images: 'photos',
        explore: 'Explore Project',
        totalProjects: 'Total Projects',
      };

  const title = (isAr ? service?.title_ar : service?.title_en) || service?.title_ar || service?.title_en || '';
  const desc = (isAr ? service?.description_ar : service?.description_en) || '';

  const sectionTitle = (s: Section) => (isAr ? s.title_ar : s.title_en) || s.title_ar;
  const projectName = (p: Project) => (isAr ? p.name_ar : p.name_en) || p.name_ar;
  const projectDesc = (p: Project) => (isAr ? p.desc_ar : p.desc_en) || '';

  const usedSections = sections.filter((s) => projects.some((p) => p.section_id === s.id));
  const ungrouped = projects.filter((p) => !p.section_id || !usedSections.some((s) => s.id === p.section_id));

  const ProjectCard = ({ p }: { p: Project }) => {
    const count = (imageCounts[p.id] || 0) + (p.image ? 1 : 0);

    return (
      <div
        onClick={() => navigate(`/projects/${p.id}`)}
        className={`group cursor-pointer rounded-3xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between relative ${
          isDark 
            ? 'bg-gradient-to-b from-white/[0.07] to-white/[0.02] border-white/10 hover:border-white/30 backdrop-blur-2xl shadow-2xl shadow-black/50' 
            : 'bg-white/80 border-slate-200/80 hover:border-slate-300 backdrop-blur-xl shadow-xl shadow-slate-200/50'
        }`}
      >
        {/* Image Container */}
        <div className={`relative w-full aspect-[16/10] overflow-hidden ${isDark ? 'bg-black/40' : 'bg-slate-100'}`}>
          {p.image ? (
            <img
              src={p.image}
              alt={projectName(p)}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-gray-400">
              <Images className="w-10 h-10 opacity-30" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {count > 0 && (
            <div className="absolute top-3 end-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/15 shadow-lg">
              <Images className="w-3.5 h-3.5" style={{ color: accentHex }} />
              <span>{count} {t.images}</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
          <div className="space-y-2">
            <h3 className={`text-lg font-bold tracking-tight transition-colors group-hover:text-[${accentHex}] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {projectName(p)}
            </h3>
            {projectDesc(p) && (
              <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                {projectDesc(p)}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wide flex items-center gap-2" style={{ color: accentHex }}>
              <span>{t.explore}</span>
              {isAr ? <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1.5" /> : <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />}
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 bg-white/5 group-hover:scale-110 transition-transform" style={{ color: accentHex }}>
              <Compass className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      dir={dir}
      className={`min-h-screen pt-36 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        isDark ? 'bg-[#030305] text-white' : 'bg-slate-50/50 text-slate-900'
      }`}
    >
      {/* Dynamic Background Glow Blobs */}
      <div 
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[160px] opacity-15 pointer-events-none"
        style={{ backgroundColor: accentHex }}
      />
      <div 
        className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] rounded-full blur-[180px] opacity-10 pointer-events-none"
        style={{ backgroundColor: accentHex }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <Link
          to={{ pathname: '/', hash: '#portfolio' }}
          className={`inline-flex items-center gap-2.5 text-xs font-semibold px-5 py-2.5 rounded-2xl transition-all duration-300 border mb-12 backdrop-blur-xl ${
            isDark 
              ? 'bg-white/[0.04] border-white/10 text-gray-300 hover:bg-white/[0.08] hover:text-white shadow-lg' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
          }`}
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t.back}</span>
        </Link>

        {loading && (
          <div className="space-y-10">
            <div className={`h-40 w-full rounded-3xl animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-96 rounded-3xl animate-pulse ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>
        )}

        {!loading && errorText && (
          <div className={`rounded-3xl border p-12 text-center max-w-md mx-auto backdrop-blur-2xl ${isDark ? 'border-rose-500/30 bg-rose-950/10' : 'border-rose-200 bg-white shadow-2xl'}`}>
            <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-rose-400 animate-bounce" />
            <p className="text-base mb-2 font-bold">{t.error}</p>
            <p className="text-xs font-mono text-rose-400 bg-rose-500/10 px-4 py-1.5 rounded-xl inline-block" dir="ltr">{errorText}</p>
          </div>
        )}

        {!loading && !errorText && !service && (
          <div className="text-center py-32">
            <p className={`text-base font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{t.notFound}</p>
          </div>
        )}

        {!loading && !errorText && service && (
          <>
            {/* Bento Header Box */}
            <div className={`p-8 sm:p-12 rounded-[2.5rem] border mb-16 relative overflow-hidden backdrop-blur-2xl shadow-2xl ${
              isDark ? 'bg-gradient-to-br from-white/[0.06] to-white/[0.01] border-white/10' : 'bg-white border-slate-200/80 shadow-slate-200/60'
            }`}>
              <div className="absolute -end-10 -bottom-10 opacity-10 pointer-events-none">
                <FolderKanban className="w-64 h-64" style={{ color: accentHex }} />
              </div>

              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border backdrop-blur-xl"
                  style={{ color: accentHex, borderColor: `${accentHex}40`, backgroundColor: `${accentHex}15` }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{title}</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">{title}</h1>

                {desc && (
                  <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    {desc}
                  </p>
                )}

                <div className="pt-4 flex items-center gap-6">
                  <div className={`px-5 py-2.5 rounded-2xl border flex items-center gap-3 backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: accentHex }} />
                    <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      {projects.length} {t.totalProjects}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {projects.length === 0 && (
              <div className={`text-center py-28 rounded-3xl border border-dashed ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-300 bg-slate-50'}`}>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{t.empty}</p>
              </div>
            )}

            {/* Sections Grid */}
            {usedSections.map((section) => {
              const list = projects.filter((p) => p.section_id === section.id);
              return (
                <div key={section.id} className="mb-20">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg backdrop-blur-xl"
                        style={{ color: accentHex, borderColor: `${accentHex}40`, backgroundColor: `${accentHex}15` }}
                      >
                        <FolderKanban className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{sectionTitle(section)}</h2>
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                          {list.length} {isAr ? 'مشاريع متوفرة ضمن هذا القسم' : 'projects available in this section'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {list.map((p) => (
                      <ProjectCard key={p.id} p={p} />
                    ))}
                  </div>
                </div>
              );
            })}

            {ungrouped.length > 0 && (
              <div className="mb-16">
                {usedSections.length > 0 && (
                  <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/10">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg backdrop-blur-xl"
                      style={{ color: accentHex, borderColor: `${accentHex}40`, backgroundColor: `${accentHex}15` }}
                    >
                      <FolderKanban className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t.other}</h2>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {ungrouped.map((p) => (
                    <ProjectCard key={p.id} p={p} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}