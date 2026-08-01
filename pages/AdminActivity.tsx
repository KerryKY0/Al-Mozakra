import React, { useState } from "react";
import { useStore } from "../services/store";
import {
  History,
  Search,
  Trash2,
  Calendar,
  Clock,
  User as UserIcon,
  Shield,
  Activity,
  Filter,
  Info,
  Trash,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useI18n } from "../services/i18n";
import { TabButton } from "../components/AdminShared";

export const AdminActivity: React.FC = () => {
  const { t, lang } = useI18n();
  const { logs, clearAllLogs, formatTime, users } = useStore();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredLogs = logs
    .filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        users
          .find((u) => u.id === log.userId)
          ?.name.toLowerCase()
          .includes(search.toLowerCase()) ||
        false;
      const matchesType =
        filterType === "ALL" || log.action.includes(filterType);
      return matchesSearch && matchesType;
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  const translateAction = (action: string) => {
    const direct = t(action);
    if (direct !== action) return direct;

    if (action.includes(":")) {
      const parts = action.split(":");
      const prefix = parts[0].trim();
      const suffix = parts.slice(1).join(":").trim();
      const translatedPrefix = t(prefix + ":");
      if (translatedPrefix !== prefix + ":")
        return `${translatedPrefix} ${suffix}`;
    }

    const numMatch = action.match(/\d+/);
    if (numMatch && action.includes("توليد")) {
      return t("generateCodesLog").replace("{count}", numMatch[0]);
    }

    return action;
  };

  const getActionIcon = (action: string) => {
    if (
      action.includes("إضافة") ||
      action.includes("Add") ||
      action.includes("REGISTER")
    )
      return <UserIcon className="text-green-400" size={16} />;
    if (action.includes("حذف") || action.includes("DELETE"))
      return <Trash2 className="text-red-400" size={16} />;
    if (action.includes("تعديل") || action.includes("UPDATE"))
      return <CheckCircle className="text-blue-400" size={16} />;
    if (action.includes("دخول") || action.includes("LOGIN"))
      return <Shield className="text-purple-400" size={16} />;
    return <Activity className="text-space-accent" size={16} />;
  };

  return (
    <div className="space-y-8 animate-fade-in stagger-children">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-white text-glow tracking-tighter">
            {t("activityLog")}
          </h1>
          <p className="text-muted text-sm mt-1">{t("trackSystemChanges")}</p>
        </div>
        <button
          onClick={clearAllLogs}
          className="bg-red-600/10 text-red-500 border border-red-500/20 px-6 py-2.5 rounded-xl font-black hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 text-sm shadow-xl shadow-red-900/20 active:scale-95"
        >
          <Trash size={18} /> {t("clearLog")}
        </button>
      </div>

      <div className="glass-card p-4 rounded-2xl border-white/10 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5 w-full lg:w-auto overflow-x-auto custom-scrollbar no-scrollbar">
          <TabButton
            active={filterType === "ALL"}
            onClick={() => setFilterType("ALL")}
            label={t("all")}
            icon={History}
          />
          {["ADD", "DELETE", "UPDATE", "LOGIN"].map((type) => (
            <TabButton
              key={type}
              active={filterType === type}
              onClick={() => setFilterType(type)}
              label={t(type.toLowerCase())}
              isIconOnly={false}
            />
          ))}
        </div>

        <div className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 pl-10 text-white text-sm font-bold focus:border-space-accent outline-none transition-all placeholder:opacity-40"
          />
          <Search className="absolute left-3.5 top-3.5 text-muted" size={16} />
        </div>
      </div>

      <div className="glass-card rounded-2xl border-white/10 overflow-hidden shadow-2xl min-h-[500px]">
        <div className="overflow-x-auto custom-scrollbar">
          <table
            className={`w-full text-sm ${lang === "ar" ? "text-right" : "text-left"}`}
          >
            <thead className="bg-black/60 text-muted font-bold sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="p-4 border-b border-white/5 w-16 text-center"></th>
                <th className="p-4 border-b border-white/5 uppercase tracking-tighter text-[10px]">
                  {t("userColumn")}
                </th>
                <th className="p-4 border-b border-white/5 uppercase tracking-tighter text-[10px]">
                  {t("actionColumn")}
                </th>
                <th className="p-4 border-b border-white/5 uppercase tracking-tighter text-[10px]">
                  {t("detailsColumn")}
                </th>
                <th className="p-4 border-b border-white/5 uppercase tracking-tighter text-[10px] sm:table-cell text-center">
                  {t("timeColumn")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => {
                const user = users.find((u) => u.id === log.userId);
                return (
                  <tr
                    key={log.id}
                    className="transition-all hover:bg-white/5 group"
                  >
                    <td className="p-4 text-center">
                      {getActionIcon(log.action)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-[10px] font-black border border-white/5 text-muted group-hover:border-space-accent/30 transition-all">
                          {user?.name.charAt(0) || "?"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-xs">
                            {user?.name || t("deletedUser")}
                          </span>
                          <span className="text-[10px] text-muted opacity-60">
                            ID: {log.userId.substring(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                          {t(log.action.split(":")[0].trim().toLowerCase())}
                        </span>
                        <p className="text-slate-300 text-xs font-bold line-clamp-2 max-w-md">
                          {translateAction(log.action)}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center opacity-60">
                        <span className="text-[10px] font-mono font-bold text-white">
                          {new Date(log.timestamp).toLocaleDateString(
                            lang === "ar" ? "ar-EG" : "en-US",
                          )}
                        </span>
                        <span className="text-[9px] font-mono text-muted">
                          {new Date(log.timestamp).toLocaleTimeString(
                            lang === "ar" ? "ar-EG" : "en-US",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="p-20 flex flex-col items-center justify-center text-center opacity-30 gap-4">
              <History size={64} />
              <p className="font-bold text-lg">{t("noActivityRecords")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminActivity;
