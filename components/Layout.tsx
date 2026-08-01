import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../services/store";
import { useI18n } from "../services/i18n";
import { UserRole } from "../types";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  Home,
  Users,
  FileText,
  BarChart,
  Settings,
  Menu,
  X,
  Rocket,
  ZoomIn,
  ZoomOut,
  Eye,
  Save,
  AlertTriangle,
  Sun,
  Moon,
  Key,
  ChevronLeft,
  ChevronRight,
  User,
  Lock,
  Phone,
  Wand2,
  Globe,
  PenTool,
  Newspaper,
  GraduationCap,
  HeadphonesIcon,
  Music,
  Volume2,
  VolumeX,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  LifeBuoy,
} from "lucide-react";
import GlobalChat from "./GlobalChat";
import { FloatingStudentTools } from "./StudentTools";

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem = ({
  to,
  icon: Icon,
  label,
  active,
  collapsed,
  onClick,
  isHorizontal,
}: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`sidebar-btn flex items-center gap-3 px-3 transition-all duration-300 ${active ? "active-btn text-space-accent shadow-md" : "text-muted hover:bg-space-800 hover:text-main"} ${collapsed ? "justify-center px-0" : ""} ${isHorizontal ? "h-10 py-1.5" : "py-2.5"}`}
    title={collapsed ? label : ""}
  >
    <Icon size={18} className="shrink-0" />
    {(!collapsed || isHorizontal) && (
      <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300 text-sm">
        {label}
      </span>
    )}
  </Link>
);

const CompleteProfileForm: React.FC = () => {
  const {
    completeUserProfile,
    currentUser,
    phoneNumberLength,
    sections,
    codeGetUrl,
    globalPasswordLength,
    passwordPrefix,
    enablePrefixInAuto,
    generateAlphanumericPasswords,
    verificationCodesEnabled,
  } = useStore();
  const { t } = useI18n();
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(
    currentUser?.phone === "0" ? "" : currentUser?.phone || "",
  );
  const [sectionId, setSectionId] = useState(currentUser?.sectionId || "");
  const [password, setPassword] = useState(currentUser?.password || "");
  const [gender, setGender] = useState(currentUser?.gender || "");
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate || "");
  const [verificationCode, setVerificationCode] = useState("");

  const [error, setError] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^[\p{L}\s]+$/u.test(name)) {
      setError(t("nameLettersOnly"));
      return;
    }
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 3) {
      setError(t("nameTripartite"));
      return;
    }
    if (!sectionId) {
      setError(t("sectionRequired"));
      return;
    }
    if (!gender) {
      setError(t("genderRequired"));
      return;
    }
    if (!birthDate) {
      setError(t("birthDateRequired"));
      return;
    }
    if (!password || password.length !== globalPasswordLength) {
      setError(
        `${t("passwordLengthReq1")} ${globalPasswordLength} ${t("passwordLengthReq2")}`,
      );
      return;
    }

    if (verificationCodesEnabled) {
      setShowCodeModal(true);
    } else {
      handleFinalSubmit();
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, "");
    setVerificationCode(rawValue);
  };

  const handleFinalSubmit = async () => {
    if (
      verificationCodesEnabled &&
      (!verificationCode || verificationCode.length < 3)
    ) {
      setError(t("wrongCode"));
      return;
    }
    setLoading(true);
    try {
      await completeUserProfile(
        {
          name,
          phone,
          sectionId,
          gender: gender as "MALE" | "FEMALE",
          birthDate,
        },
        password,
        verificationCodesEnabled ? verificationCode : undefined,
      );
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const generatePass = (e: React.MouseEvent) => {
    e.preventDefault();
    let pass = "";
    if (enablePrefixInAuto && passwordPrefix) {
      const remaining = Math.max(
        0,
        globalPasswordLength - passwordPrefix.length,
      );
      let randomPart = "";
      if (generateAlphanumericPasswords) {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < remaining; i++)
          randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      } else {
        randomPart = Math.floor(Math.random() * 10 ** remaining)
          .toString()
          .padStart(remaining, "0");
      }
      pass = passwordPrefix + randomPart;
    } else {
      if (generateAlphanumericPasswords) {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < globalPasswordLength; i++)
          pass += chars.charAt(Math.floor(Math.random() * chars.length));
      } else {
        pass = Math.floor(Math.random() * 10 ** globalPasswordLength)
          .toString()
          .padStart(globalPasswordLength, "0");
      }
    }
    setPassword(pass.substring(0, globalPasswordLength));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-space-800 p-8 rounded-2xl border-2 border-space-accent w-full max-w-md shadow-2xl animate-fade-in-scale overflow-y-auto max-h-[90vh]">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="text-red-500" size={64} />
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          {t("dataUpdateRequired")}
        </h2>
        <p className="text-center text-slate-400 mb-6">{t("dataUpdateDesc")}</p>
        {error && !showCodeModal && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded text-center text-sm mb-4 border border-red-500/30">
            {error}
          </div>
        )}
        <form onSubmit={handleInitialSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 block mb-2">
              {t("fullNameLetters")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-space-900 border border-space-700 rounded-lg p-3 pl-10 text-main focus:border-space-accent outline-none"
                placeholder={t("fullName")}
                required
              />
              <User
                size={18}
                className="absolute left-3 top-3.5 text-slate-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-2">
              {t("phoneNumber")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-space-900 border border-space-700 rounded-lg p-3 pl-10 text-main focus:border-space-accent outline-none dir-ltr text-right"
                placeholder="01xxxxxxxxx"
                required
              />
              <Phone
                size={18}
                className="absolute left-3 top-3.5 text-slate-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-2">
              {t("studySection")}
            </label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full bg-space-900 border border-space-700 rounded-lg p-3 text-main focus:border-space-accent outline-none"
              required
            >
              <option value="">{t("chooseSection")}</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 block mb-2">
                {t("gender")}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-space-900 border border-space-700 rounded-lg p-3 text-main focus:border-space-accent outline-none"
                required
              >
                <option value="">{t("chooseGender")}</option>
                <option value="MALE">{t("male")}</option>
                <option value="FEMALE">{t("female")}</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-2">
                {t("birthDate")}
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-space-900 border border-space-700 rounded-lg p-3 text-main focus:border-space-accent outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-2">
              {t("password")} ({globalPasswordLength} {t("passwordLengthReq2")})
            </label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-space-900 border border-space-700 rounded-lg p-3 pl-10 text-main focus:border-space-accent outline-none"
                  placeholder={t("password")}
                  required
                />
                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-500"
                />
              </div>
              <button
                onClick={generatePass}
                className="bg-space-700 hover:bg-space-600 text-space-accent p-3 rounded-lg btn-ripple"
                title={t("autoGenerate")}
                type="button"
              >
                <Wand2 size={20} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-space-accent text-space-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors mt-4 flex items-center justify-center gap-2 btn-glow btn-ripple"
          >
            <Save size={20} /> {t("continue")}
          </button>
        </form>
      </div>
      {showCodeModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-space-800 p-8 rounded-2xl border-2 border-green-500 shadow-2xl w-full max-w-sm relative">
            <button
              onClick={() => {
                setShowCodeModal(false);
                setError("");
              }}
              className="absolute top-4 left-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <Key size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-500 mb-2">
                {t("verifyCode")}
              </h3>
              <p className="text-slate-400 text-sm">{t("enterVerifyCode")}</p>
            </div>
            {error && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded text-center text-sm mb-4 border border-red-500/30">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <input
                type="text"
                value={verificationCode.split("").join(" ")}
                onChange={handleCodeChange}
                className="w-full bg-space-900 border border-green-500/50 rounded-xl p-4 text-white text-center text-2xl font-bold focus:outline-none focus:border-green-500 placeholder-green-500/30 tracking-widest"
                placeholder="C O D E"
                autoFocus
              />
              {codeGetUrl && (
                <div className="text-center">
                  <a
                    href={codeGetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-space-accent text-sm hover:underline"
                  >
                    {t("getCode")}
                  </a>
                </div>
              )}
              <button
                onClick={handleFinalSubmit}
                disabled={loading || verificationCode.length < 3}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 btn-ripple"
              >
                {loading ? t("verifying") : t("confirmAndFinish")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Music Button Component
const MusicPlayer: React.FC<{ musicUrl: string }> = ({ musicUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(musicUrl);
    audioRef.current.loop = true;
    return () => {
      audioRef.current?.pause();
    };
  }, [musicUrl]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-6 left-[104px] z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all btn-ripple ${isPlaying ? "bg-space-accent animate-music-pulse" : "bg-space-800 border border-space-700"}`}
      style={{
        boxShadow: isPlaying ? "0 0 20px rgba(253,184,19,0.5)" : undefined,
      }}
    >
      {isPlaying ? (
        <div className="flex items-end gap-0.5 h-4">
          <div
            className="w-1 bg-space-900 rounded-full music-bar"
            style={{ height: 4 }}
          />
          <div
            className="w-1 bg-space-900 rounded-full music-bar"
            style={{ height: 4 }}
          />
          <div
            className="w-1 bg-space-900 rounded-full music-bar"
            style={{ height: 4 }}
          />
        </div>
      ) : (
        <VolumeX size={18} className="text-muted" />
      )}
    </button>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    currentUser,
    logout,
    toggleTheme,
    theme,
    zoomLevel,
    setZoomLevel,
    triggerPermissionError,
    musicUrl,
    musicEnabled,
    sidebarPosition,
    supportUrl,
  } = useStore();
  const { t, lang, setLang } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebarCollapsed") === "true";
    }
    return false;
  });
  const location = useLocation();

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  if (!currentUser) return <>{children}</>;

  const shouldCompleteProfile = () => {
    if (
      currentUser.role === UserRole.STUDENT &&
      (!!currentUser.forceFullDataUpdate || !!currentUser.requiresDataUpdate)
    )
      return true;
    return false;
  };

  if (shouldCompleteProfile()) {
    return <CompleteProfileForm />;
  }

  const isDev =
    currentUser.role === UserRole.ADMIN ||
    currentUser.role === UserRole.SUB_ADMIN;
  const isStudent = currentUser.role === UserRole.STUDENT;

  const canManageCodes =
    currentUser.role === UserRole.ADMIN ||
    (currentUser.role === UserRole.SUB_ADMIN &&
      currentUser.permissions?.canManageCodes);
  const canAccessSettings =
    currentUser.role === UserRole.ADMIN ||
    (currentUser.role === UserRole.SUB_ADMIN &&
      currentUser.permissions?.canAccessSettings);
  const canViewStats =
    currentUser.role === UserRole.ADMIN ||
    (currentUser.role === UserRole.SUB_ADMIN &&
      currentUser.permissions?.canViewStats);

  const handleRestrictedLink = (
    e: React.MouseEvent,
    hasPermission: boolean,
  ) => {
    if (!hasPermission) {
      e.preventDefault();
      triggerPermissionError();
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    }
  };

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 0.1, 1.5));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 0.1, 0.8));
  const toggleGrayscale = () => setIsGrayscale(!isGrayscale);

  const starsArray = React.useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  // Sidebar position classes
  const isHorizontal =
    sidebarPosition === "top" || sidebarPosition === "bottom";
  const isRtl = lang === "ar";

  let reverseFlex = false;
  if (sidebarPosition === "left") {
    reverseFlex = isRtl;
  } else if (sidebarPosition === "right") {
    reverseFlex = !isRtl;
  }

  const wrapperClass = isHorizontal
    ? `flex flex-col h-[100dvh] bg-mesh text-main ${isGrayscale ? "grayscale" : ""}`
    : `flex h-[100dvh] bg-mesh text-main ${isGrayscale ? "grayscale" : ""} ${reverseFlex ? "flex-row-reverse" : ""}`;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div
        className={`${isHorizontal ? "px-3 h-full" : "p-4 h-16"} flex items-center ${isSidebarCollapsed && !isHorizontal ? "justify-center" : "justify-start"} relative`}
      >
        <div
          className={`flex items-center gap-2 overflow-hidden whitespace-nowrap ${isSidebarCollapsed && !isHorizontal ? "justify-center w-full" : ""} relative z-10`}
        >
          <div
            className={`flex items-center justify-center text-space-accent shrink-0 ${isSidebarCollapsed && !isHorizontal ? "w-8 h-8 p-1" : "w-8 h-8"}`}
          >
            <Rocket size={isSidebarCollapsed && !isHorizontal ? 14 : 18} />
          </div>
          {(!isSidebarCollapsed || isHorizontal) && (
            <h1 className="text-xl font-bold text-main tracking-wider truncate">
              {t("almozakra")}
            </h1>
          )}
        </div>
        {!isHorizontal && (
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex text-muted hover:text-white transition-colors p-1.5 hover:bg-space-800 rounded-lg"
              title={
                isSidebarCollapsed ? t("expandSidebar") : t("collapseSidebar")
              }
            >
              {isSidebarCollapsed ? (
                sidebarPosition === "left" ? (
                  <ChevronLeft size={18} />
                ) : (
                  <ChevronRight size={18} />
                )
              ) : sidebarPosition === "left" ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-muted hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {/* User Profile Card */}
      {!isHorizontal && (
        <div className="px-3 mb-4">
          <div
            className={`glass-card p-3 rounded-2xl flex flex-col items-center text-center transition-all duration-500 hover:border-space-accent/50 group ${isSidebarCollapsed ? "p-1 bg-transparent border-0 shadow-none" : "p-4"}`}
          >
            <div className="relative">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt="Profile"
                  className={`${isSidebarCollapsed ? "w-10 h-10" : "w-16 h-16"} rounded-full object-cover mb-2 border-2 border-space-accent transition-all shrink-0 shadow-lg group-hover:scale-105`}
                />
              ) : (
                <div
                  className={`${isSidebarCollapsed ? "w-10 h-10" : "w-16 h-16"} bg-space-800 rounded-full flex items-center justify-center mb-2 text-space-accent border border-space-700 transition-all shrink-0 group-hover:border-space-accent`}
                >
                  <User size={isSidebarCollapsed ? 18 : 28} />
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="animate-fade-in">
                <p className="text-[10px] text-muted mb-0.5 uppercase tracking-tighter">
                  {t("welcomeUser")}
                </p>
                <p className="font-black text-white truncate max-w-[140px] text-sm group-hover:text-space-accent transition-colors">
                  {currentUser.name}
                </p>
                <div className="mt-1 flex items-center justify-center">
                  <span className="px-2 py-0.5 bg-space-accent/10 border border-space-accent/20 rounded-full text-[9px] text-space-accent font-bold uppercase tracking-widest">
                    {currentUser.role === UserRole.ADMIN
                      ? t("mainDev")
                      : currentUser.role === UserRole.SUB_ADMIN
                        ? t("subDev")
                        : t("student")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className={`flex-1 ${isHorizontal ? "flex items-center gap-2 overflow-x-auto px-2" : "px-3 space-y-1.5 overflow-y-auto pb-4 custom-scrollbar"}`}
      >
        {isStudent && (
          <>
            <SidebarItem
              to="/student"
              icon={Home}
              label={t("home")}
              active={location.pathname === "/student"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/student/courses"
              icon={GraduationCap}
              label={t("myCourses")}
              active={location.pathname === "/student/courses"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/student/tools"
              icon={PenTool}
              label={t("tools")}
              active={location.pathname === "/student/tools"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/student/posts"
              icon={Newspaper}
              label={t("posts")}
              active={location.pathname === "/student/posts"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/student/profile"
              icon={User}
              label={t("account")}
              active={location.pathname === "/student/profile"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/student/display"
              icon={Eye}
              label={t("view")}
              active={location.pathname === "/student/display"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              isHorizontal={isHorizontal}
            />
            {supportUrl && (
              <a
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`sidebar-btn flex items-center gap-3 px-3 py-2 text-muted hover:bg-space-800 hover:text-main ${isSidebarCollapsed && !isHorizontal ? "justify-center px-0" : ""} ${isHorizontal ? "h-10 py-1.5" : "py-2.5"}`}
              >
                <LifeBuoy size={18} className="shrink-0" />
                {(!isSidebarCollapsed || isHorizontal) && (
                  <span className="font-medium text-sm">{t("support")}</span>
                )}
              </a>
            )}
          </>
        )}

        {isDev && (
          <div
            className={`stagger-children flex ${isHorizontal ? "flex-row items-center gap-1.5" : "flex-col gap-1.5"}`}
          >
            <SidebarItem
              to="/admin/dashboard"
              icon={BarChart}
              label={t("dashboard")}
              active={location.pathname === "/admin/dashboard"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              onClick={(e: React.MouseEvent) =>
                handleRestrictedLink(e, canViewStats)
              }
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/admin/users"
              icon={Users}
              label={t("users")}
              active={location.pathname === "/admin/users"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/admin/content"
              icon={FileText}
              label={t("contentManagement")}
              active={location.pathname === "/admin/content"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/admin/codes"
              icon={Key}
              label={t("verificationCodes")}
              active={location.pathname === "/admin/codes"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              onClick={(e: React.MouseEvent) =>
                handleRestrictedLink(e, canManageCodes)
              }
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/admin/activity"
              icon={Eye}
              label={t("activityLog")}
              active={location.pathname === "/admin/activity"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              onClick={(e: React.MouseEvent) =>
                handleRestrictedLink(e, canViewStats)
              }
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/admin/posts"
              icon={Newspaper}
              label={t("posts")}
              active={location.pathname === "/admin/posts"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/admin/profile"
              icon={User}
              label={t("account")}
              active={location.pathname === "/admin/profile"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/admin/display"
              icon={Eye}
              label={t("view")}
              active={location.pathname === "/admin/display"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              isHorizontal={isHorizontal}
            />
            <SidebarItem
              to="/admin/settings"
              icon={Settings}
              label={t("settings")}
              active={location.pathname === "/admin/settings"}
              collapsed={isSidebarCollapsed && !isHorizontal}
              onClick={(e: React.MouseEvent) =>
                handleRestrictedLink(e, canAccessSettings)
              }
              isHorizontal={isHorizontal}
            />
          </div>
        )}
      </nav>

      {/* Language & Logout Toggle */}
      <div
        className={
          isHorizontal
            ? "flex flex-row items-center gap-2 px-3"
            : "px-3 mt-auto mb-4 flex flex-col gap-1.5"
        }
      >
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className={`sidebar-btn flex items-center gap-3 px-3 text-purple-400 hover:bg-space-800 transition-all rounded-xl ${isSidebarCollapsed && !isHorizontal ? "justify-center px-0" : ""} ${isHorizontal ? "h-10 py-1.5" : "py-2.5"}`}
          title={t("languageFull")}
        >
          <Globe size={18} className="shrink-0" />
          {(!isSidebarCollapsed || isHorizontal) && (
            <div className="flex flex-col items-start leading-none text-right">
              <span className="font-bold text-xs uppercase">
                {t("language")}
              </span>
              <span className="text-[10px] opacity-70">
                {t("languageFull")}
              </span>
            </div>
          )}
        </button>
      </div>
    </>
  );

  return (
    <div className={wrapperClass}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && !isHorizontal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      {isHorizontal ? (
        <aside
          className={`${sidebarPosition === "top" ? "order-first" : "order-last"} bg-space-800/80 backdrop-blur-xl flex items-center h-16 px-4 overflow-x-auto shadow-2xl z-50`}
        >
          {sidebarContent}
        </aside>
      ) : (
        <aside
          className={`fixed lg:static top-0 ${sidebarPosition === "left" ? "left-0" : "right-0"} h-full border-${sidebarPosition === "left" ? "r" : "l"} border-space-700 z-50 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
            isMobileMenuOpen
              ? `translate-x-0 w-72 bg-space-800 shadow-2xl`
              : `${sidebarPosition === "left" ? "-translate-x-full" : "translate-x-full"} lg:translate-x-0`
          } ${isSidebarCollapsed ? "lg:w-20 bg-transparent border-none" : "lg:w-64 bg-space-800/50 backdrop-blur-xl shadow-2xl"}`}
        >
          {sidebarContent}
        </aside>
      )}

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        {!isHorizontal && (
          <header className="h-16 flex items-center justify-between px-6 bg-space-900/40 backdrop-blur-xl border-b border-white/5 lg:hidden sticky top-0 z-30 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white p-2.5 bg-space-800 rounded-xl border border-white/10 active:scale-90 transition-transform"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-space-accent rounded-full flex items-center justify-center text-space-900 shadow-[0_0_10px_rgba(253,184,19,0.3)]">
                <Rocket size={16} />
              </div>
              <span className="font-bold text-lg text-white text-glow">
                {t("almozakra")}
              </span>
            </div>
            <div className="w-10 h-10"></div> {/* Spacer */}
          </header>
        )}

        <div className="flex-1 overflow-auto p-4 lg:p-10 relative custom-scrollbar">
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <div className="absolute top-[15%] left-[10%] w-[300px] h-[300px] bg-space-accent/5 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[150px] animate-nebula"></div>

            {/* Random stars */}
            {starsArray.map((star) => (
              <div
                key={star.id}
                className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                style={{
                  top: star.top,
                  left: star.left,
                  animationDelay: star.animationDelay,
                  opacity: star.opacity,
                }}
              ></div>
            ))}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full animate-fade-in-scale">
            {children}
          </div>
        </div>

        {/* Float elements */}
        {isStudent && musicEnabled && musicUrl && (
          <MusicPlayer musicUrl={musicUrl} />
        )}
        {isStudent && <FloatingStudentTools />}
        <GlobalChat />
      </main>
    </div>
  );
};

export default Layout;
