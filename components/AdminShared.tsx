import React from "react";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "../services/i18n";

export const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="glass-card glass-card-hover p-5 md:p-6 rounded-2xl flex items-center justify-between transition-all duration-300 group">
    <div className="space-y-1">
      <p className="text-muted text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
        {title}
      </p>
      <p className="text-2xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform origin-left">
        {value}
      </p>
    </div>
    <div
      className={`p-3 md:p-4 rounded-2xl bg-space-900/50 ${color} shadow-inner group-hover:rotate-12 transition-transform duration-500`}
    >
      <Icon size={24} className="md:w-7 md:h-7" />
    </div>
  </div>
);

export const TabButton = ({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: any;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-bold transition-all duration-500 whitespace-nowrap flex items-center gap-2 text-xs md:text-sm relative overflow-hidden group ${active ? "bg-space-accent text-space-900 shadow-[0_0_20px_rgba(253,184,19,0.3)] scale-105 z-10" : "bg-transparent text-muted hover:text-white border border-white/5 hover:bg-white/5"}`}
  >
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse pointer-events-none"></div>
    )}
    {Icon && (
      <Icon
        size={14}
        className={`md:w-4 md:h-4 ${active ? "animate-bounce-small" : "group-hover:scale-120"}`}
      />
    )}
    <span className="relative z-10">{label}</span>
  </button>
);

export const PermissionDenied = () => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center p-12 h-full text-center animate-fade-in-scale">
      <div className="bg-yellow-500/10 p-6 rounded-full border border-yellow-500/20 mb-6 shadow-2xl animate-pulse">
        <AlertTriangle size={64} className="text-yellow-500" />
      </div>
      <h3 className="text-2xl font-black text-yellow-500 mb-2 uppercase tracking-tight">
        {t("permDeniedMsg")}
      </h3>
      <p className="text-muted text-sm max-w-sm">{t("checkMainDev")}</p>
    </div>
  );
};
