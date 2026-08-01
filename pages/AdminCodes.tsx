import React, { useState } from "react";
import { useStore } from "../services/store";
import {
  Key,
  Plus,
  Trash2,
  Download,
  Search,
  Filter,
  Copy,
  Hash,
  Type,
  CheckCircle,
  XCircle,
  Info,
  Settings,
  Wand2,
  Save,
  X,
  Trash,
} from "lucide-react";
import { useI18n } from "../services/i18n";
import { TabButton, PermissionDenied } from "../components/AdminShared";
import { UserRole } from "../types";

export const AdminCodes: React.FC = () => {
  const { t, lang } = useI18n();
  const {
    verificationCodes,
    generateVerificationCodes,
    deleteVerificationCode,
    deleteAllVerificationCodes,
    deleteUnusedVerificationCodes,
    deleteUsedVerificationCodes,
    exportCodesToCSV,
    showToast,
    formatTime,
    currentUser,
    codePrefix,
    setCodePrefix,
    enablePrefixInCodes,
    setEnablePrefixInCodes,
    verificationCodesEnabled,
    setVerificationCodesEnabled,
    codeGetUrl,
    setCodeGetUrl,
  } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "USED" | "UNUSED">("ALL");
  const [showGenModal, setShowGenModal] = useState(false);
  const [genCount, setGenCount] = useState(10);
  const [genLength, setGenLength] = useState(6);
  const [isAlphanumeric, setIsAlphanumeric] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (
    currentUser?.role === UserRole.SUB_ADMIN &&
    !currentUser.permissions?.canManageCodes
  ) {
    return <PermissionDenied />;
  }

  const filteredCodes = verificationCodes
    .filter((c) => {
      const matchesSearch =
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.usedBy?.toLowerCase().includes(search.toLowerCase()) ||
        false;
      const matchesFilter =
        filter === "ALL" || (filter === "USED" ? c.isUsed : !c.isUsed);
      return matchesSearch && matchesFilter;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(t("copied"));
  };

  const handleGenerate = () => {
    generateVerificationCodes(genCount, genLength, isAlphanumeric);
    setShowGenModal(false);
    showToast(t("codesGenerated").replace("{count}", genCount.toString()));
  };

  return (
    <div className="space-y-8 animate-fade-in stagger-children">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-white text-glow tracking-tighter">
            {t("verificationCodes")}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="glass-card text-white px-4 py-2.5 rounded-xl font-bold hover:bg-white/10 border border-white/10 text-xs active:scale-95 flex items-center gap-2"
          >
            <Settings size={16} /> {t("settings")}
          </button>
          <button
            onClick={exportCodesToCSV}
            className="glass-card text-white px-4 py-2.5 rounded-xl font-bold hover:bg-white/10 border border-white/10 text-xs active:scale-95 flex items-center gap-2"
          >
            <Download size={16} /> {t("export")}
          </button>
          <button
            onClick={() => setShowGenModal(true)}
            className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-black hover:bg-green-500 transition-all flex items-center justify-center gap-2 text-sm shadow-xl shadow-green-900/30 active:scale-95"
          >
            <Plus size={18} /> {t("generateCodes")}
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="glass-card p-6 rounded-2xl border-space-accent/30 animate-fade-in-down">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted block opacity-60">
                {t("enableCodes")}
              </label>
              <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
                <span
                  className={
                    verificationCodesEnabled
                      ? "text-green-400 font-bold"
                      : "text-muted"
                  }
                >
                  {verificationCodesEnabled ? t("enabled") : t("disabledLabel")}
                </span>
                <button
                  onClick={() =>
                    setVerificationCodesEnabled(!verificationCodesEnabled)
                  }
                  className={`w-12 h-6 rounded-full transition-all relative ${verificationCodesEnabled ? "bg-green-600" : "bg-red-900/50"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${verificationCodesEnabled ? "left-7" : "left-1"}`}
                  />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted block opacity-60">
                {t("codePrefix")}
              </label>
              <div className="flex gap-2">
                <input
                  value={codePrefix}
                  onChange={(e) => setCodePrefix(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-space-accent"
                  placeholder="e.g. MK-"
                />
                <button
                  onClick={() => setEnablePrefixInCodes(!enablePrefixInCodes)}
                  className={`p-3 rounded-xl border transition-all ${enablePrefixInCodes ? "bg-space-accent/20 border-space-accent text-space-accent" : "bg-black/40 border-white/10 text-muted"}`}
                  title={t("applyToNewCodes")}
                >
                  {enablePrefixInCodes ? (
                    <CheckCircle size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted block opacity-60">
                {t("codeGetUrl")}
              </label>
              <input
                value={codeGetUrl}
                onChange={(e) => setCodeGetUrl(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-space-accent dir-ltr"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      )}

      <div className="glass-card p-4 rounded-2xl border-white/10 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5 w-full lg:w-auto">
          <TabButton
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
            label={t("all")}
            icon={Hash}
          />
          <TabButton
            active={filter === "UNUSED"}
            onClick={() => setFilter("UNUSED")}
            label={t("available")}
            icon={CheckCircle}
          />
          <TabButton
            active={filter === "USED"}
            onClick={() => setFilter("USED")}
            label={t("used")}
            icon={XCircle}
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto overflow-hidden">
          <div className="relative flex-1 lg:w-64">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 pl-10 text-white text-sm font-bold focus:border-space-accent outline-none transition-all placeholder:opacity-40"
            />
            <Search
              className="absolute left-3.5 top-3.5 text-muted"
              size={16}
            />
          </div>
          <button
            onClick={deleteUsedVerificationCodes}
            className="flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl border border-red-500/20 transition-all font-bold text-xs"
            title={t("clearUsedCodes")}
          >
            <Trash2 size={18} /> {t("clearUsedCodes")}
          </button>
          <button
            onClick={deleteAllVerificationCodes}
            className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all shadow-lg active:scale-95 font-black text-xs"
            title={t("deleteAll")}
          >
            <Trash size={18} /> {t("deleteAll")}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl border-white/10 overflow-hidden shadow-2xl min-h-[500px]">
        <div className="overflow-x-auto custom-scrollbar">
          <table
            className={`w-full text-sm ${lang === "ar" ? "text-right" : "text-left"}`}
          >
            <thead className="bg-black/60 text-muted font-bold sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="p-4 border-b border-white/5">{t("code")}</th>
                <th className="p-4 border-b border-white/5">{t("status")}</th>
                <th className="p-4 border-b border-white/5 hidden md:table-cell">
                  {t("usedBy")}
                </th>
                <th className="p-4 border-b border-white/5 hidden sm:table-cell">
                  {t("creationDate")}
                </th>
                <th className="p-4 border-b border-white/5 text-center">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCodes.map((code) => (
                <tr
                  key={code.id}
                  className="transition-all hover:bg-white/5 group"
                >
                  <td className="p-4 font-mono font-black text-white text-sm tracking-widest">
                    {code.code}
                  </td>
                  <td className="p-4">
                    {code.isUsed ? (
                      <span className="text-[10px] font-black uppercase bg-red-500/10 text-red-400 px-2 py-1 rounded-full border border-red-500/20">
                        {t("used")}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20">
                        {t("available")}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-muted text-xs hidden md:table-cell">
                    {code.usedBy || "-"}
                  </td>
                  <td className="p-4 text-muted text-[10px] hidden sm:table-cell">
                    {formatTime(code.createdAt)}
                  </td>
                  <td className="p-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleCopy(code.code)}
                      className="p-2 text-space-accent hover:bg-space-accent/10 rounded-lg transition-all"
                      title={t("copy")}
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => deleteVerificationCode(code.id)}
                      className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title={t("delete")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCodes.length === 0 && (
            <div className="p-20 flex flex-col items-center justify-center text-center opacity-30 gap-4">
              <Hash size={64} />
              <p className="font-bold text-lg">{t("noCodesFound")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-space-800 rounded-3xl border border-white/10 w-full max-w-sm p-6 animate-fade-in-scale relative">
            <button
              onClick={() => setShowGenModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black text-white mb-6 pr-8">
              {t("generateCodes")}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted block mb-2">
                  {t("count")}
                </label>
                <input
                  type="number"
                  value={genCount}
                  onChange={(e) => setGenCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-space-accent"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted block mb-2">
                  {t("length")}
                </label>
                <input
                  type="number"
                  value={genLength}
                  onChange={(e) => setGenLength(parseInt(e.target.value) || 1)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-space-accent"
                />
              </div>
              <label className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 cursor-pointer hover:border-space-accent/30 transition-all">
                <input
                  type="checkbox"
                  checked={isAlphanumeric}
                  onChange={(e) => setIsAlphanumeric(e.target.checked)}
                  className="w-4 h-4 accent-space-accent"
                />
                <span className="text-sm font-bold text-white">
                  {t("alphanumeric")}
                </span>
              </label>
              <button
                onClick={handleGenerate}
                className="w-full bg-space-accent text-space-900 font-black py-4 rounded-2xl hover:bg-yellow-400 mt-4 shadow-xl shadow-space-accent/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Wand2 size={18} /> {t("execute")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminCodes;
