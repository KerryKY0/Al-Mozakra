import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../services/store";
import { useI18n } from "../services/i18n";
import {
  Rocket,
  Phone,
  Lock,
  User as UserIcon,
  Wand2,
  Shield,
  Crown,
  UserCog,
  Layers,
  Key,
  X,
  ExternalLink,
  Globe,
} from "lucide-react";
import { APP_NAME } from "../constants";
import { UserRole } from "../types";
import { SpaceCanvas } from "./Landing";
import TermsAndPrivacy from "../components/TermsAndPrivacy";

export const Login: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useStore();
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(phone, password, [UserRole.STUDENT]);
      if (rememberMe) {
        console.log("Remember me enabled");
      }

      if (user.role === UserRole.STUDENT) {
        navigate("/student");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      setError(t(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 flex flex-col items-center justify-center p-4 relative overflow-hidden animate-fade-in">
      <button
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        className={`absolute top-6 ${lang === "ar" ? "left-6" : "right-6"} z-20 flex items-center gap-2 px-4 py-2 bg-space-800 rounded-full border border-space-700 hover:border-space-accent transition-colors text-white btn-ripple group`}
      >
        <Globe
          size={18}
          className="group-hover:rotate-12 transition-transform text-space-accent"
        />
        <span className="font-bold text-sm tracking-wider">
          {t("language")}
        </span>
      </button>
      <SpaceCanvas />
      <TermsAndPrivacy />
      <div className="absolute -left-20 top-20 w-64 h-64 bg-space-accent/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute right-10 bottom-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow object-delay-1"></div>

      <div className="bg-space-800 p-8 rounded-2xl border border-space-700 shadow-2xl w-full max-w-md relative z-10 animate-fade-in-scale">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-space-700 rounded-full flex items-center justify-center border border-space-accent hover:scale-110 transition-transform cursor-pointer">
            <Rocket className="text-space-accent" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-8">
          {t("studentLoginTitle")}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2 group">
            <label className="text-slate-400 text-sm group-focus-within:text-space-accent transition-colors">
              {t("phoneNumber")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-space-900 border border-space-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-space-accent transition-colors text-left dir-ltr"
                placeholder="01xxxxxxxxx"
                required
              />
              <Phone
                className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-space-accent transition-colors"
                size={18}
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-slate-400 text-sm group-focus-within:text-space-accent transition-colors">
              {t("password")}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-space-900 border border-space-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-space-accent transition-colors text-left dir-ltr tracking-widest"
                required
              />
              <Lock
                className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-space-accent transition-colors"
                size={18}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 rounded border-slate-600 bg-space-900 accent-space-accent cursor-pointer transition-all hover:scale-110"
            />
            <label
              htmlFor="remember"
              className="text-sm text-slate-400 cursor-pointer select-none"
            >
              {t("rememberMe")}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-space-accent text-space-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 btn-ripple btn-glow"
          >
            {loading ? t("verifying") : t("loginBtn")}
          </button>
        </form>

        <div className="mt-6 text-center animate-fade-in-up">
          <Link
            to="/register"
            className="text-space-accent hover:underline text-sm block mb-2 transition-colors hover:text-yellow-400"
          >
            {t("noAccountRegister")}
          </Link>
          <Link
            to="/developer-login"
            className="text-slate-500 hover:text-red-500 text-xs mt-4 inline-block transition-colors text-glow-red"
          >
            {t("devLoginLink")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export const DeveloperLogin: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginTab, setLoginTab] = useState<"MAIN" | "SUB">("MAIN");
  const { login } = useStore();
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const allowedRoles =
        loginTab === "MAIN" ? [UserRole.ADMIN] : [UserRole.SUB_ADMIN];
      const user = await login(phone, password, allowedRoles);

      if (user.role === UserRole.STUDENT) {
        throw new Error("studentNotAllowedError");
      }
      if (loginTab === "MAIN" && user.role !== UserRole.ADMIN) {
        throw new Error("notMainDevError");
      }
      if (loginTab === "SUB" && user.role !== UserRole.SUB_ADMIN) {
        throw new Error("notSubDevError");
      }
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(t(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 flex flex-col items-center justify-center p-4 relative overflow-hidden animate-fade-in">
      <button
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        className={`absolute top-6 ${lang === "ar" ? "left-6" : "right-6"} z-20 flex items-center gap-2 px-4 py-2 bg-space-800 rounded-full border border-space-700 hover:border-space-accent transition-colors text-white btn-ripple group`}
      >
        <Globe
          size={18}
          className="group-hover:rotate-12 transition-transform text-space-accent"
        />
        <span className="font-bold text-sm tracking-wider">
          {t("language")}
        </span>
      </button>
      <SpaceCanvas />
      <TermsAndPrivacy />
      <div className="absolute -left-20 top-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="bg-space-800 p-8 rounded-2xl border border- пространство-700 shadow-2xl w-full max-w-md relative z-10 border-t-4 border-t-red-500 animate-fade-in-scale">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-space-700 rounded-full flex items-center justify-center border border-red-500 hover:scale-110 transition-transform cursor-pointer">
            <Shield className="text-red-500" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          {t("devLoginTitle")}
        </h2>
        <p className="text-center text-slate-400 text-sm mb-8">
          {t("limitedAccess")}
        </p>

        <div className="flex mb-6 bg-space-900 p-1 rounded-lg">
          <button
            onClick={() => setLoginTab("MAIN")}
            className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-colors btn-ripple ${loginTab === "MAIN" ? "bg-red-600 text-white" : "text-slate-400 hover:bg-space-800"}`}
          >
            <Crown size={16} /> {t("mainDevLogin")}
          </button>
          <button
            onClick={() => setLoginTab("SUB")}
            className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-colors btn-ripple ${loginTab === "SUB" ? "bg-red-600 text-white" : "text-slate-400 hover:bg-space-800"}`}
          >
            <UserCog size={16} /> {t("subDevLogin")}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2 group">
            <label className="text-slate-400 text-sm group-focus-within:text-red-500 transition-colors">
              {t("phoneOrUsername")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-space-900 border border-space-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-red-500 transition-colors text-left dir-ltr"
                required
              />
              <Phone
                className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-red-500 transition-colors"
                size={18}
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-slate-400 text-sm group-focus-within:text-red-500 transition-colors">
              {t("password")}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-space-900 border border-space-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-red-500 transition-colors text-left dir-ltr"
                required
              />
              <Lock
                className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-red-500 transition-colors"
                size={18}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 btn-ripple btn-glow-red"
          >
            {loading
              ? t("verifying")
              : loginTab === "MAIN"
                ? t("mainDevLogin")
                : t("subDevLogin")}
          </button>
        </form>

        <div className="mt-6 text-center animate-fade-in-up">
          <Link
            to="/login"
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            {t("backToStudentLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    sectionId: "",
    verificationCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const {
    registerStudent,
    globalPasswordLength,
    passwordPrefix,
    enablePrefixInAuto,
    phoneNumberLength,
    sections,
    checkPhoneAvailability,
    codeGetUrl,
    generateAlphanumericPasswords,
    verificationCodesEnabled,
  } = useStore();
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Strict Triple Name Check
    const nameParts = formData.name.trim().split(/\s+/);
    if (nameParts.length < 3) {
      setError(t("tripleNameError"));
      return;
    }

    // Name should not contain special chars/symbols or numbers (Allowing letters and spaces only)
    if (!/^[\p{L}\s]+$/u.test(formData.name)) {
      setError(t("nameSymbolsError"));
      return;
    }

    if (formData.password.length !== globalPasswordLength) {
      setError(
        t("passwordLengthError").replace(
          "{length}",
          globalPasswordLength.toString(),
        ),
      );
      return;
    }

    setLoading(true);
    try {
      await checkPhoneAvailability(formData.phone);
      if (!verificationCodesEnabled) {
        await registerStudent(
          formData.name,
          formData.phone,
          formData.password,
          formData.sectionId,
          "",
          true,
        );
        navigate("/student", { replace: true });
      } else {
        // If valid, show code modal
        setLoading(false);
        setShowCodeModal(true);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    // Basic check - verificationCode holds the raw value with spaces visually?
    // Actually state holds just value, we add visual space in rendering or controlled input logic.
    // But user requested "separated by space".
    // Let's assume the user types characters and we visually space them or just store them.
    // The store handles space removal.
    if (!formData.verificationCode || formData.verificationCode.length < 3) {
      setError(t("wrongCode"));
      return;
    }

    setLoading(true);
    setError("");
    try {
      await registerStudent(
        formData.name,
        formData.phone,
        formData.password,
        formData.sectionId,
        formData.verificationCode,
      );
      navigate("/student", { replace: true });
    } catch (err: any) {
      setError(t("wrongCode"));
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
        for (let i = 0; i < remaining; i++) {
          randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
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
        for (let i = 0; i < globalPasswordLength; i++) {
          pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      } else {
        pass = Math.floor(Math.random() * 10 ** globalPasswordLength)
          .toString()
          .padStart(globalPasswordLength, "0");
      }
    }
    pass = pass.substring(0, globalPasswordLength);
    setFormData({ ...formData, password: pass });
  };

  // Function to add space between characters for the input display logic
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s/g, ""); // remove all spaces first
    setFormData({ ...formData, verificationCode: val });
    if (error) setError("");
  };

  // For display in input value, we join characters with space
  const displayCode = formData.verificationCode.split("").join(" ");

  return (
    <div className="min-h-screen bg-space-900 flex flex-col items-center justify-center p-4 relative overflow-hidden animate-fade-in">
      <button
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        className={`absolute top-6 ${lang === "ar" ? "left-6" : "right-6"} z-20 flex items-center gap-2 px-4 py-2 bg-space-800 rounded-full border border-space-700 hover:border-space-accent transition-colors text-white btn-ripple group`}
      >
        <Globe
          size={18}
          className="group-hover:rotate-12 transition-transform text-space-accent"
        />
        <span className="font-bold text-sm tracking-wider">
          {t("language")}
        </span>
      </button>
      <SpaceCanvas />
      <TermsAndPrivacy />
      <div className="absolute top-0 right-0 w-80 h-80 bg-space-accent/5 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="bg-space-800 p-8 rounded-2xl border border-space-700 shadow-2xl w-full max-w-md z-10 animate-fade-in-scale">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {t("createNewAccount")}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {t("joinTo")} {APP_NAME}
          </p>
        </div>

        {error && !showCodeModal && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleInitialSubmit} className="space-y-4">
          <div className="space-y-2 group">
            <label className="text-slate-400 text-sm flex justify-between group-focus-within:text-space-accent transition-colors">
              <span>{t("tripleName")}</span>
              <span className="text-xs text-muted">{t("lettersOnly")}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-space-900 border border-space-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-space-accent transition-colors"
                placeholder={t("tripleName")}
                required
              />
              <UserIcon
                className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-space-accent transition-colors"
                size={18}
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-slate-400 text-sm flex justify-between group-focus-within:text-space-accent transition-colors">
              <span>{t("phoneNumber")}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-space-900 border border-space-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-space-accent transition-colors text-left dir-ltr"
                placeholder="01xxxxxxxxx"
                required
              />
              <Phone
                className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-space-accent transition-colors"
                size={18}
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-slate-400 text-sm group-focus-within:text-space-accent transition-colors">
              {t("section")}
            </label>
            <div className="relative">
              <select
                value={formData.sectionId}
                onChange={(e) =>
                  setFormData({ ...formData, sectionId: e.target.value })
                }
                className="w-full bg-space-900 border border-space-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-space-accent transition-colors appearance-none"
              >
                <option value="">{t("chooseSection")}</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <Layers
                className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-space-accent transition-colors"
                size={18}
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-slate-400 text-sm flex justify-between group-focus-within:text-space-accent transition-colors">
              <span>{t("password")}</span>
              <span className="text-space-accent text-xs">
                {globalPasswordLength} {t("digitsRequired")}
              </span>
            </label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-space-900 border border-space-700 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-space-accent transition-colors text-left dir-ltr tracking-widest"
                  required
                />
                <Lock
                  className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-space-accent transition-colors"
                  size={18}
                />
              </div>
              <button
                onClick={generatePass}
                className="bg-space-700 hover:bg-space-600 text-space-accent p-3 rounded-lg transition-colors btn-ripple"
                title={t("autoGenerate")}
                type="button"
              >
                <Wand2 size={20} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-space-accent text-space-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed btn-ripple btn-glow"
          >
            {loading ? t("processing") : t("createAccount")}
          </button>

          <div className="mt-6 text-center animate-fade-in-up">
            <Link
              to="/login"
              className="text-space-accent hover:underline text-sm transition-colors hover:text-yellow-400"
            >
              {t("alreadyHaveAccount")}
            </Link>
          </div>
        </form>
      </div>

      {/* Code Verification Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-space-800 p-8 rounded-2xl border border-green-500/50 shadow-2xl w-full max-w-sm relative shadow-[0_0_30px_rgba(34,197,94,0.15)] animate-fade-in-scale">
            <button
              onClick={() => {
                setShowCodeModal(false);
                setError("");
              }}
              className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <Key
                size={48}
                className="text-green-500 mx-auto mb-4 animate-bounce-short"
              />
              <h3 className="text-2xl font-bold text-green-500 mb-2">
                {t("enterVerificationCode")}
              </h3>
              <p className="text-slate-400 text-sm">
                {t("enterCodeToComplete")}
              </p>

              {/* Error Message inside Modal */}
              {error && (
                <div className="mt-4 bg-red-500/20 text-red-500 px-3 py-2 rounded-lg text-sm font-bold animate-shake border border-red-500/30">
                  {t("wrongCode")}
                </div>
              )}
            </div>

            <input
              type="text"
              value={displayCode}
              onChange={handleCodeChange}
              className={`w-full bg-space-900 border ${error ? "border-red-500" : "border-green-500/50"} rounded-xl p-4 text-white text-center text-2xl font-bold focus:outline-none transition-all ${error ? "focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)]"} mb-4 placeholder-green-500/20 tracking-widest dir-ltr`}
              placeholder="C O D E"
              autoFocus
            />

            {codeGetUrl && (
              <div className="mb-6 text-center">
                <a
                  href={codeGetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-space-accent text-sm hover:underline block transition-colors hover:text-yellow-400"
                >
                  {t("getCode")}
                </a>
              </div>
            )}

            <button
              onClick={handleFinalSubmit}
              disabled={formData.verificationCode.length < 3 || loading}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 btn-ripple btn-glow"
            >
              {loading ? t("verifying") : t("confirmAndCreate")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
