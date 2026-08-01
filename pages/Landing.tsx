import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Rocket,
  Star,
  ChevronLeft,
  Shield,
  FileText,
  Video,
  BookOpen,
  PenTool,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { useStore } from "../services/store";
import { useI18n } from "../services/i18n";
import TermsAndPrivacy from "../components/TermsAndPrivacy";

// Space Particle Canvas
export const SpaceCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      twinkleSpeed: number;
      twinklePhase: number;
    }[] = [];
    const shootingStars: {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      angle: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create star particles
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Shooting star spawn
    const spawnShootingStar = () => {
      if (shootingStars.length < 2 && Math.random() < 0.01) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.4,
          length: Math.random() * 80 + 40,
          speed: Math.random() * 6 + 4,
          opacity: 1,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        });
      }
    };

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      // Draw stars
      particles.forEach((p) => {
        const twinkle =
          Math.sin(time * p.twinkleSpeed * 60 + p.twinklePhase) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * twinkle})`;
        ctx.fill();

        // Plus-shaped glow for bigger stars
        if (p.size > 1.5) {
          ctx.strokeStyle = `rgba(253, 184, 19, ${p.opacity * twinkle * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size * 2, p.y);
          ctx.lineTo(p.x + p.size * 2, p.y);
          ctx.moveTo(p.x, p.y - p.size * 2);
          ctx.lineTo(p.x, p.y + p.size * 2);
          ctx.stroke();
        }

        p.y += p.speed;
        if (p.y > canvas.height) {
          p.y = 0;
          p.x = Math.random() * canvas.width;
        }
      });

      // Draw shooting stars
      spawnShootingStar();
      shootingStars.forEach((s, i) => {
        const grad = ctx.createLinearGradient(
          s.x,
          s.y,
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length,
        );
        grad.addColorStop(0, `rgba(253, 184, 19, ${s.opacity})`);
        grad.addColorStop(1, "rgba(253, 184, 19, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length,
        );
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.008;

        if (s.opacity <= 0 || s.x > canvas.width || s.y > canvas.height) {
          shootingStars.splice(i, 1);
        }
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};

// SVG Astronaut Component
const Astronaut: React.FC = () => (
  <div className="absolute top-[15%] left-[8%] md:left-[12%] animate-astronaut z-0 pointer-events-none opacity-60 md:opacity-80">
    <svg
      width="80"
      height="100"
      viewBox="0 0 80 100"
      fill="none"
      className="md:w-[120px] md:h-[150px]"
    >
      {/* Helmet */}
      <ellipse
        cx="40"
        cy="28"
        rx="18"
        ry="20"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <ellipse cx="40" cy="26" rx="12" ry="14" fill="#1e293b" opacity="0.8" />
      <ellipse cx="36" cy="23" rx="3" ry="4" fill="rgba(253,184,19,0.3)" />
      {/* Body */}
      <rect
        x="24"
        y="46"
        width="32"
        height="30"
        rx="8"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      {/* Backpack */}
      <rect
        x="18"
        y="50"
        width="8"
        height="20"
        rx="3"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      {/* Arms */}
      <rect
        x="10"
        y="52"
        width="14"
        height="6"
        rx="3"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1"
        transform="rotate(-20 10 52)"
      />
      <rect
        x="56"
        y="50"
        width="14"
        height="6"
        rx="3"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1"
        transform="rotate(15 56 50)"
      />
      {/* Legs */}
      <rect
        x="28"
        y="74"
        width="8"
        height="18"
        rx="3"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1"
        transform="rotate(-5 28 74)"
      />
      <rect
        x="44"
        y="74"
        width="8"
        height="18"
        rx="3"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1"
        transform="rotate(5 44 74)"
      />
      {/* Chest panel */}
      <rect x="32" y="52" width="16" height="10" rx="2" fill="#475569" />
      <circle cx="36" cy="57" r="2" fill="#22c55e" />
      <circle cx="44" cy="57" r="2" fill="#ef4444" />
    </svg>
  </div>
);

// Floating Planet
const Planet: React.FC<{
  className?: string;
  color1: string;
  color2: string;
  size: number;
}> = ({ className, color1, color2, size }) => (
  <div className={`absolute animate-float pointer-events-none ${className}`}>
    <div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${color1}, ${color2})`,
        boxShadow: `0 0 ${size / 2}px ${color2}40`,
      }}
    >
      {/* Ring for Saturn-like effect */}
      {size > 30 && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 opacity-30"
          style={{
            width: size * 1.6,
            height: size * 0.4,
            borderColor: color1,
            transform: "translate(-50%, -50%) rotate(-15deg)",
          }}
        />
      )}
    </div>
  </div>
);

const Landing: React.FC = () => {
  const { toggleTheme, theme } = useStore();
  const { t, lang, setLang } = useI18n();

  return (
    <div className="min-h-screen bg-space-900 flex flex-col items-center justify-center relative overflow-hidden text-center p-4 md:p-6">
      {/* Space Canvas Background */}
      <SpaceCanvas />

      {/* Nebula Glows */}
      <div className="absolute top-[5%] right-[5%] w-40 h-40 md:w-64 md:h-64 bg-purple-600/20 rounded-full blur-3xl animate-nebula pointer-events-none"></div>
      <div
        className="absolute bottom-[5%] left-[5%] w-48 h-48 md:w-72 md:h-72 bg-blue-600/20 rounded-full blur-3xl animate-nebula pointer-events-none"
        style={{ animationDelay: "4s" }}
      ></div>
      <div
        className="absolute top-[40%] left-[50%] w-32 h-32 bg-pink-600/10 rounded-full blur-3xl animate-nebula pointer-events-none"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Floating Planets */}
      <Planet
        className="top-[10%] right-[15%] md:right-[20%]"
        color1="#FDB813"
        color2="#ea580c"
        size={24}
      />
      <Planet
        className="bottom-[15%] right-[10%]"
        color1="#3b82f6"
        color2="#1e3a5f"
        size={36}
      />
      <Planet
        className="top-[60%] left-[8%]"
        color1="#a855f7"
        color2="#581c87"
        size={18}
      />

      {/* Astronaut */}
      <Astronaut />

      {/* Top Controls */}
      <div
        className={`absolute top-4 ${lang === "ar" ? "left-4 md:left-6" : "right-4 md:right-6"} md:top-6 z-20 flex items-center gap-2`}
      >
        <button
          onClick={toggleTheme}
          className="p-2 md:p-3 bg-space-800 rounded-full border border-space-700 text-main hover:bg-space-700 transition-all btn-shadow btn-ripple"
          title={t("changeTheme")}
        >
          {theme === "dark" ? (
            <Sun size={18} className="text-yellow-400 md:w-5 md:h-5" />
          ) : (
            <Moon size={18} className="md:w-5 md:h-5" />
          )}
        </button>
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="p-2 md:p-3 bg-space-800 rounded-full border border-space-700 text-main hover:bg-space-700 transition-all btn-shadow btn-ripple flex items-center gap-1"
        >
          <Globe size={16} className="md:w-5 md:h-5" />
          <span className="text-xs font-bold">{t("language")}</span>
        </button>
      </div>

      {/* Developer Portal Link (Desktop) */}
      <div
        className={`hidden md:block absolute bottom-6 ${lang === "ar" ? "left-6" : "right-6"} z-20`}
      >
        <Link
          to="/developer-login"
          className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors text-sm text-glow-red"
        >
          <Shield size={16} />
          <span>{t("devPortal")}</span>
        </Link>
      </div>

      {/* Terms and Privacy */}
      <TermsAndPrivacy />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6 md:mb-8 animate-float">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-space-accent to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30 btn-glow">
            <Rocket size={48} className="text-white md:w-16 md:h-16" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-7xl font-bold text-main mb-4 md:mb-6 tracking-tight animate-fade-in-up">
          {t("platform")}{" "}
          <span className="text-space-accent">{t("almozakra")}</span>
        </h1>

        {/* Description */}
        <p
          className="text-base md:text-xl text-muted mb-4 leading-relaxed max-w-2xl px-2 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {t("landing.desc")}
        </p>

        {/* Encouragement */}
        <p className="text-sm md:text-base text-space-accent font-bold mb-8 animate-bounce-short px-4">
          {t("encouragement")}
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10 text-muted text-xs md:text-sm w-full px-2 stagger-children">
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 md:p-3 bg-space-800 rounded-lg text-red-400 btn-shadow">
              <FileText size={20} className="md:w-6 md:h-6" />
            </div>
            <span>{t("pdfFiles")}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 md:p-3 bg-space-800 rounded-lg text-blue-400 btn-shadow">
              <Video size={20} className="md:w-6 md:h-6" />
            </div>
            <span>{t("videoLectures")}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 md:p-3 bg-space-800 rounded-lg text-green-400 btn-shadow">
              <BookOpen size={20} className="md:w-6 md:h-6" />
            </div>
            <span>{t("summaries")}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 md:p-3 bg-space-800 rounded-lg text-purple-400 btn-shadow">
              <PenTool size={20} className="md:w-6 md:h-6" />
            </div>
            <span>{t("questionBank")}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full max-w-md mb-8 px-2">
          <Link
            to="/login"
            className="flex-1 px-6 py-3 md:px-8 md:py-4 bg-space-accent text-space-900 font-bold rounded-full text-base md:text-lg hover:bg-yellow-400 transition-all shadow-lg flex items-center justify-center gap-2 btn-glow btn-ripple"
          >
            {t("login")} <ChevronLeft size={18} className="md:w-5 md:h-5" />
          </Link>
          <Link
            to="/register"
            className="flex-1 px-6 py-3 md:px-8 md:py-4 bg-space-800 text-main font-bold rounded-full text-base md:text-lg border border-space-700 hover:bg-space-700 transition-all flex items-center justify-center btn-shadow btn-ripple"
          >
            {t("register")}
          </Link>
        </div>

        {/* Developer Portal Link (Mobile) */}
        <Link
          to="/developer-login"
          className="flex md:hidden items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm mb-8"
        >
          <Shield size={16} />
          <span>{t("devPortal")}</span>
        </Link>
      </div>

      <div className="absolute bottom-4 w-full px-6 text-center text-muted text-xs md:text-sm pointer-events-none z-10">
        <span>{t("allRights")}</span>
      </div>
    </div>
  );
};

export default Landing;
