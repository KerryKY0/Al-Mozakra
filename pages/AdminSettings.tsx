import React, { useState } from "react";
import { useStore } from "../services/store";
import {
  Settings,
  Save,
  Lock,
  Phone,
  Globe,
  Palette,
  Monitor,
  Bell,
  Shield,
  Key,
  Music,
  HeadphonesIcon,
  LifeBuoy,
  Info,
  MessageSquare,
  Wand2,
  Hash,
} from "lucide-react";
import { useI18n } from "../services/i18n";
import { PermissionDenied } from "../components/AdminShared";
import { UserRole } from "../types";

export const AdminSettings: React.FC = () => {
  const { t, lang } = useI18n();
  const {
    globalPasswordLength,
    setGlobalPasswordLength,
    phoneNumberLength,
    setPhoneNumberLength,
    passwordPrefix,
    setPasswordPrefix,
    enablePrefixInAuto,
    setEnablePrefixInAuto,
    generateAlphanumericPasswords,
    setGenerateAlphanumericPasswords,
    requirePhoneVerification,
    setRequirePhoneVerification,
    systemMessage,
    updateSystemMessage,
    sidebarPosition,
    setSidebarPosition,
    musicUrl,
    setMusicUrl,
    musicEnabled,
    setMusicEnabled,
    supportUrl,
    setSupportUrl,
    themeColorsLight,
    setThemeColorsLight,
    themeColorsDark,
    setThemeColorsDark,
    boxGlowIntensity,
    setBoxGlowIntensity,
    zeroMaterialsColor,
    setZeroMaterialsColor,
    showToast,
    currentUser,
  } = useStore();

  if (
    currentUser?.role === UserRole.SUB_ADMIN &&
    !currentUser.permissions?.canAccessSettings
  ) {
    return <PermissionDenied />;
  }

  const handleSaveSystemMessage = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(t("settingsSaved"));
  };

  return (
    <div className="space-y-8 animate-fade-in stagger-children">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-white text-glow tracking-tighter">
          {t("settings")}
        </h1>
        <p className="text-muted text-sm mt-1">
          {t("controlSystemPreferences")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration & Security */}
        <div className="glass-card p-6 rounded-2xl border-white/10 space-y-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/5 pb-4">
            <Shield size={20} className="text-red-500" />{" "}
            {t("securityAndRegister")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted block opacity-60">
                {t("passwordLength")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={globalPasswordLength}
                  onChange={(e) =>
                    setGlobalPasswordLength(parseInt(e.target.value) || 6)
                  }
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-red-500"
                />
                <Lock size={20} className="text-muted shrink-0" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted block opacity-60">
                {t("phoneLength")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={phoneNumberLength}
                  onChange={(e) =>
                    setPhoneNumberLength(parseInt(e.target.value) || 11)
                  }
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-red-500"
                />
                <Phone size={20} className="text-muted shrink-0" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <label className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 hover:border-red-500/30 transition-all cursor-pointer">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-black text-white">
                  {t("alphanumericPasswords")}
                </span>
                <span className="text-[10px] text-muted">
                  {t("alphanumericDesc")}
                </span>
              </div>
              <button
                onClick={() =>
                  setGenerateAlphanumericPasswords(
                    !generateAlphanumericPasswords,
                  )
                }
                className={`w-12 h-6 rounded-full transition-all relative ${generateAlphanumericPasswords ? "bg-red-500" : "bg-red-900/50"}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${generateAlphanumericPasswords ? "left-7" : "left-1"}`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 hover:border-red-500/30 transition-all cursor-pointer">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-black text-white">
                  {t("requirePhoneVerify")}
                </span>
                <span className="text-[10px] text-muted">
                  {t("requirePhoneDesc")}
                </span>
              </div>
              <button
                onClick={() =>
                  setRequirePhoneVerification(!requirePhoneVerification)
                }
                className={`w-12 h-6 rounded-full transition-all relative ${requirePhoneVerification ? "bg-red-500" : "bg-red-900/50"}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${requirePhoneVerification ? "left-7" : "left-1"}`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* System Message */}
        <div className="glass-card p-6 rounded-2xl border-white/10 space-y-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/5 pb-4">
            <Bell size={20} className="text-space-accent" />{" "}
            {t("systemMessage")}
          </h3>

          <form onSubmit={handleSaveSystemMessage} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2 opacity-60">
                {t("messageContent")}
              </label>
              <textarea
                value={systemMessage.content}
                onChange={(e) =>
                  updateSystemMessage({
                    ...systemMessage,
                    content: e.target.value,
                  })
                }
                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-space-accent resize-none placeholder:opacity-20 font-bold"
                placeholder={t("typeSystemMessage")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={systemMessage.isActive}
                  onChange={(e) =>
                    updateSystemMessage({
                      ...systemMessage,
                      isActive: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-space-accent"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white">
                    {t("active")}
                  </span>
                  <span className="text-[10px] text-muted">
                    {t("activeMessageDesc")}
                  </span>
                </div>
              </label>
              <label className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={systemMessage.showAtLogin}
                  onChange={(e) =>
                    updateSystemMessage({
                      ...systemMessage,
                      showAtLogin: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-space-accent"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white">
                    {t("showAtLogin")}
                  </span>
                  <span className="text-[10px] text-muted">
                    {t("showAtLoginDesc")}
                  </span>
                </div>
              </label>
              <div className="col-span-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2 opacity-60">
                  {t("displayMode")}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateSystemMessage({
                        ...systemMessage,
                        displayMode: "popup",
                      })
                    }
                    className={`flex-1 py-2 px-4 rounded-xl border transition-all font-bold text-xs ${systemMessage.displayMode !== "marquee" ? "bg-space-accent text-space-900 border-space-accent" : "bg-black/40 border-white/10 text-muted hover:border-white/30"}`}
                  >
                    {t("popup")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateSystemMessage({
                        ...systemMessage,
                        displayMode: "marquee",
                      })
                    }
                    className={`flex-1 py-2 px-4 rounded-xl border transition-all font-bold text-xs ${systemMessage.displayMode === "marquee" ? "bg-space-accent text-space-900 border-space-accent" : "bg-black/40 border-white/10 text-muted hover:border-white/30"}`}
                  >
                    {t("marquee")}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Appearance & Media */}
        <div className="glass-card p-6 rounded-2xl border-white/10 space-y-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/5 pb-4">
            <Palette size={20} className="text-purple-400" />{" "}
            {t("appearanceAndMedia")}
          </h3>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-3 opacity-60">
                {t("sidebarPosition")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["right", "left", "top", "bottom"].map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setSidebarPosition(pos as any)}
                    className={`py-2 px-2 rounded-xl border text-[10px] font-black transition-all uppercase tracking-tighter ${sidebarPosition === pos ? "bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-lg shadow-purple-900/20" : "bg-black/40 border-white/5 text-muted hover:border-white/10"}`}
                  >
                    {pos === "right"
                      ? t("right")
                      : pos === "left"
                        ? t("left")
                        : pos === "top"
                          ? t("top")
                          : t("bottom")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${musicEnabled ? "bg-purple-500/20 text-purple-400" : "bg-black/40 text-muted"}`}
                  >
                    <Music size={20} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-white">
                      {t("backgroundMusic")}
                    </span>
                    <span className="text-[10px] text-muted">
                      {t("backgroundMusicDesc")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMusicEnabled(!musicEnabled)}
                  className={`w-12 h-6 rounded-full transition-all relative ${musicEnabled ? "bg-purple-600" : "bg-purple-900/50"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${musicEnabled ? "left-7" : "left-1"}`}
                  />
                </button>
              </label>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted block opacity-60">
                  {t("musicUrl")}
                </label>
                <input
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-purple-500 dir-ltr"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colors & Aesthetics */}
        <div className="glass-card p-6 rounded-2xl border-white/10 space-y-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/5 pb-4">
            <Palette size={20} className="text-blue-400" /> الألوان والتنسيقات
            (Colors & Aesthetics)
          </h3>

          <div className="space-y-6">
            {/* Day Mode Colors */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-white block">
                Day Mode Colors (الوضع النهاري)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { key: "primary", label: "Primary Accent" },
                  { key: "secondary", label: "Secondary Accent" },
                  { key: "background", label: "Background" },
                  { key: "card", label: "Card Bg" },
                  { key: "text", label: "Text" },
                ].map((color) => (
                  <div
                    key={`light-${color.key}`}
                    className="flex flex-col gap-1"
                  >
                    <span className="text-[10px] text-muted">
                      {color.label}
                    </span>
                    <input
                      type="color"
                      value={(themeColorsLight as any)[color.key]}
                      onChange={(e) =>
                        setThemeColorsLight({
                          ...themeColorsLight,
                          [color.key]: e.target.value,
                        })
                      }
                      className="w-full h-10 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Night Mode Colors */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-white block">
                Night Mode Colors (الوضع الليلي)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { key: "primary", label: "Primary Accent" },
                  { key: "secondary", label: "Secondary Accent" },
                  { key: "background", label: "Background" },
                  { key: "card", label: "Card Bg" },
                  { key: "text", label: "Text" },
                ].map((color) => (
                  <div
                    key={`dark-${color.key}`}
                    className="flex flex-col gap-1"
                  >
                    <span className="text-[10px] text-muted">
                      {color.label}
                    </span>
                    <input
                      type="color"
                      value={(themeColorsDark as any)[color.key]}
                      onChange={(e) =>
                        setThemeColorsDark({
                          ...themeColorsDark,
                          [color.key]: e.target.value,
                        })
                      }
                      className="w-full h-10 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Elements Styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted block opacity-60">
                  توهج المربعات (Box Glow Intensity)
                </label>
                <select
                  value={boxGlowIntensity}
                  onChange={(e) => setBoxGlowIntensity(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-blue-500"
                >
                  <option value="none">بدون توهج (None)</option>
                  <option value="low">توهج خفيف (Low)</option>
                  <option value="medium">توهج متوسط (Medium)</option>
                  <option value="high">توهج عالي (High)</option>
                  <option value="extreme">توهج شديد (Extreme)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted block opacity-60">
                  لون كلمة "0 مواد" (0 Materials Color)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={zeroMaterialsColor}
                    onChange={(e) => setZeroMaterialsColor(e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0 shrink-0"
                  />
                  <input
                    type="text"
                    value={zeroMaterialsColor}
                    onChange={(e) => setZeroMaterialsColor(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold outline-none uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Links */}
        <div className="glass-card p-6 rounded-2xl border-white/10 space-y-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/5 pb-4">
            <LifeBuoy size={20} className="text-green-400" />{" "}
            {t("supportAndLinks")}
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted block opacity-60">
                {t("supportUrl")}
              </label>
              <div className="flex gap-2">
                <input
                  value={supportUrl}
                  onChange={(e) => setSupportUrl(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-green-500 dir-ltr"
                  placeholder={t("supportUrlPlaceholder")}
                />
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-green-400">
                  <MessageSquare size={20} />
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/5 p-4 rounded-2xl border border-yellow-500/20 flex gap-4">
              <div className="bg-yellow-500/20 p-3 rounded-full h-fit">
                <Info size={24} className="text-yellow-500" />
              </div>
              <div>
                <h4 className="text-sm font-black text-yellow-500 mb-1">
                  {t("systemNotice")}
                </h4>
                <p className="text-[10px] text-muted leading-relaxed font-bold">
                  {t("settingsAutoSaveNotice")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => showToast(t("settingsSaved"))}
          className="bg-space-accent text-space-900 px-12 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-space-accent/30 hover:shadow-space-accent/50 hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95 group"
        >
          <Save
            size={24}
            className="group-hover:rotate-12 transition-transform"
          />{" "}
          {t("saveAllSettings")}
        </button>
      </div>
    </div>
  );
};
export default AdminSettings;
