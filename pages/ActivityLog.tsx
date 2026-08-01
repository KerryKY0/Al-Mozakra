import React from "react";
import { useStore } from "../services/store";
import { useI18n } from "../services/i18n";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { UserRole } from "../types";

const ActivityLog: React.FC = () => {
  const { logs, formatTime, currentUser, clearAllLogs } = useStore();
  const { t, lang } = useI18n();

  if (
    currentUser?.role === UserRole.SUB_ADMIN &&
    !currentUser.permissions?.canViewStats
  ) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-full text-center animate-fade-in">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h3 className="text-xl font-bold text-yellow-500 mb-2">
          {t("permDeniedMsg")}
        </h3>
        <p className="text-muted text-sm">{t("checkMainDev")}</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 animate-fade-in"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-4">
        <Link
          to="/admin/dashboard"
          className="p-2 bg-space-800 rounded-full hover:bg-space-700 text-main transition-colors"
        >
          <ChevronLeft className={lang === "ar" ? "rotate-180" : ""} />
        </Link>
        <h1 className="text-2xl font-bold text-main">
          {t("activityLogTitle")}
        </h1>

        {currentUser?.role === UserRole.ADMIN && (
          <button
            onClick={() => {
              if (window.confirm("هل أنت متأكد من حذف جميع سجلات النشاط؟")) {
                clearAllLogs();
              }
            }}
            className="mr-auto px-4 py-2 bg-red-600/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm font-bold flex items-center gap-2"
          >
            <AlertTriangle size={16} />
            حذف السجل بالكامل
          </button>
        )}
      </div>

      <div className="bg-space-800 rounded-xl border border-space-700 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table
            className={`w-full text-sm ${lang === "ar" ? "text-right" : "text-left"}`}
          >
            <thead className="bg-space-900 text-muted font-bold">
              <tr>
                <th className="p-4">{t("userCol")}</th>
                <th className="p-4">{t("actionCol")}</th>
                <th className="p-4">{t("timeCol")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-700">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-space-700/30 transition-colors"
                >
                  <td className="p-4 font-bold text-space-accent">
                    {t(log.userName || "")}
                  </td>
                  <td className="p-4 text-main font-bold">
                    {lang === "en" && log.actionEn
                      ? log.actionEn
                      : t(log.action || "")}
                  </td>
                  <td className="p-4 text-muted dir-ltr">
                    {formatTime(log.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
