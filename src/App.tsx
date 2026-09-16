import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProjectPage from "./pages/ProjectPage";
import ServicePage from "./pages/ServicePage";

const accentColors = [
  {
    name: "orange",
    textClass: "text-orange-500",
    bgClass: "bg-orange-500/15",
    borderClass: "border-orange-500/40",
    shadowClass: "shadow-[0_0_15px_rgba(249,115,22,0.25)]",
    hex: "#f97316",
  },
  {
    name: "emerald",
    textClass: "text-emerald-500",
    bgClass: "bg-emerald-500/15",
    borderClass: "border-emerald-500/40",
    shadowClass: "shadow-[0_0_15px_rgba(16,185,129,0.25)]",
    hex: "#10b981",
  },
];

/**
 * من غير ده، لما تدوس على مشروع وانت في نص الصفحة الرئيسية،
 * الصفحة الجديدة بتفتح وانت في نفس مكان الـ scroll.
 * وبيتعامل كمان مع /#portfolio عشان الرجوع للمعرض.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  const [colorIndex, setColorIndex] = useState(0);
  const currentAccent = accentColors[colorIndex];

  const toggleAccentColor = () => {
    setColorIndex((prev) => (prev + 1) % accentColors.length);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollManager />
        <div
          className={`min-h-screen transition-colors duration-300 ${
            isDark ? "bg-[#030305] text-white" : "bg-white text-gray-900"
          }`}
        >
          <Header
            isDark={isDark}
            setIsDark={setIsDark}
            accentColor={currentAccent}
            onToggleColor={toggleAccentColor}
          />

          <Routes>
            <Route path="/" element={<Home isDark={isDark} accentColor={currentAccent} />} />

            <Route
              path="/service/:id"
              element={<ServicePage isDark={isDark} accentColor={currentAccent} />}
            />

            <Route
              path="/projects/:id"
              element={<ProjectPage isDark={isDark} accentColor={currentAccent} />}
            />

            {/* من غير ده أي رابط غلط بيدي هيدر وفوتر وفراغ بينهم */}
            <Route
              path="*"
              element={
                <div className="min-h-[60vh] flex items-center justify-center px-6">
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                    الصفحة غير موجودة.
                  </p>
                </div>
              }
            />
          </Routes>

          <Footer isDark={isDark} accentColor={currentAccent} />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}