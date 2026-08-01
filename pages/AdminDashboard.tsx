import React from "react";
import { useStore } from "../services/store";
import { UserRole } from "../types";
import { Users, FileText, Activity, Shield, Eye, BarChart } from "lucide-react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";
import { useI18n } from "../services/i18n";
import { StatCard, PermissionDenied } from "../components/AdminShared";

// --- Admin Dashboard (Home) ---

export const AdminDashboard: React.FC = () => {
  const { t } = useI18n();
  const { users, files, logs, formatTime, currentUser } = useStore();

  if (
    currentUser?.role === UserRole.SUB_ADMIN &&
    !currentUser.permissions?.canViewStats
  ) {
    return <PermissionDenied />;
  }

  const totalStudents = users.filter((u) => u.role === UserRole.STUDENT).length;
  const totalDevs = users.filter((u) => u.role !== UserRole.STUDENT).length;
  const activeToday = users.filter((u) => {
    if (!u.lastLogin) return false;
    const today = new Date().toDateString();
    return new Date(u.lastLogin).toDateString() === today;
  }).length;

  const viewsData = files
    .map((f) => ({ name: f.title.substring(0, 15) + "...", views: f.views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const getLogColor = (log: any) => {
    const user = users.find((u) => u.id === log.userId);
    if (!user) return "text-main";
    if (user.role === UserRole.ADMIN) return "text-red-500";
    if (user.role === UserRole.SUB_ADMIN) return "text-yellow-400";
    if (user.role === UserRole.STUDENT) return "text-green-400";
    return "text-main";
  };

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

  return (
    <div className="space-y-6 md:space-y-8 text-main animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">
          {t("dashboardTitle")}
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title={t("totalStudents")}
          value={totalStudents}
          icon={Users}
          color="text-blue-400"
        />
        <StatCard
          title={t("totalDevs")}
          value={totalDevs}
          icon={Shield}
          color="text-purple-400"
        />
        <StatCard
          title={t("onlineToday")}
          value={activeToday}
          icon={Activity}
          color="text-green-400"
        />
        <StatCard
          title={t("totalFiles")}
          value={files.length}
          icon={FileText}
          color="text-space-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 stagger-children">
        <div className="glass-card glass-card-hover p-4 md:p-6 rounded-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              <BarChart size={20} className="text-space-accent" />
              {t("mostViewedFiles")}
            </h3>
          </div>
          <div className="h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={viewsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  tick={{ fill: "#94a3b8" }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  fontSize={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(253, 184, 19, 0.3)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="views"
                  fill="url(#colorViews)"
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FDB813" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FDB813" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-4 md:p-6 rounded-2xl flex flex-col h-[400px] transition-all duration-300">
          <div className="flex justify-between items-center mb-6 shrink-0 border-b border-white/5 pb-4">
            <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              <Activity size={20} className="text-green-400" />
              {t("activityLog")}
            </h3>
            <Link
              to="/admin/activity"
              className="group bg-white/5 border border-white/10 hover:bg-space-accent hover:text-space-900 px-4 py-2 rounded-xl text-xs md:text-sm flex items-center gap-2 transition-all duration-300 shadow-lg active:scale-95"
            >
              <Eye size={14} className="group-hover:animate-pulse" />{" "}
              {t("viewAll")}
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 px-1">
            {logs.slice(0, 50).map((log, idx) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between text-xs md:text-sm p-4 rounded-xl bg-white/5 border border-white/5 hover:border-space-accent/30 hover:bg-white/10 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-center gap-3 mb-1 sm:mb-0">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${getLogColor(log).replace("text-", "bg-")}`}
                  ></div>
                  <div className="flex flex-col">
                    <span
                      className={`font-black tracking-tight ${getLogColor(log)}`}
                    >
                      {t(log.userName || "")}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {translateAction(log.action || "")}
                    </span>
                  </div>
                </div>
                <span className="text-muted text-[9px] md:text-xs dir-ltr font-mono bg-black/40 px-3 py-1 rounded-full border border-white/5 shadow-inner self-end sm:self-auto">
                  {formatTime(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
