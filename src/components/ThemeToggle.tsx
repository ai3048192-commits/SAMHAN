import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

type Props = {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  className?: string;
};

export default function ThemeToggle({ isDark, setIsDark, className = "" }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => setIsDark(!isDark)}
      className={`relative p-2.5 rounded-2xl border cursor-pointer shadow-lg flex items-center justify-center z-50 transition-all duration-500 overflow-hidden group ${
        isDark 
          ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-amber-500/30 text-amber-400 hover:border-amber-500/60 shadow-amber-500/10 hover:shadow-amber-500/20" 
          : "bg-gradient-to-br from-white via-slate-100 to-slate-200 border-blue-500/30 text-blue-600 hover:border-blue-500/60 shadow-blue-500/10 hover:shadow-blue-500/20"
      } ${className}`}
      aria-label="Toggle Theme"
      type="button"
    >
      {/* خلفية مضيئة متحركة عند التحويم */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
        isDark ? "bg-amber-400/5" : "bg-blue-500/5"
      }`} />

      {isDark ? (
        <Sun size={19} className="text-amber-400 transition-transform duration-500 rotate-0 hover:rotate-90 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
      ) : (
        <Moon size={19} className="text-blue-600 transition-transform duration-500 -rotate-12 hover:rotate-12 drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]" />
      )}
    </motion.button>
  );
}