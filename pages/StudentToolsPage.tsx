import React, { useState } from "react";
import { useI18n } from "../services/i18n";
import {
  StickyNote,
  Clock,
  Calculator as CalcIcon,
  PenTool,
  X,
} from "lucide-react";
import {
  Notepad,
  StudyTimer,
  CalcApp,
  Whiteboard,
} from "../components/StudentTools";

type ToolType = "notepad" | "timer" | "calculator" | "whiteboard" | null;

const StudentToolsPage: React.FC = () => {
  const { t } = useI18n();
  const [activeTool, setActiveTool] = useState<ToolType>(null);

  const tools = [
    {
      id: "notepad" as ToolType,
      icon: StickyNote,
      label: t("notepad"),
      desc: t("notepadDesc"),
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "hover:border-yellow-400/50",
    },
    {
      id: "timer" as ToolType,
      icon: Clock,
      label: t("timer"),
      desc: t("timerDesc"),
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "hover:border-blue-400/50",
    },
    {
      id: "calculator" as ToolType,
      icon: CalcIcon,
      label: t("calculator"),
      desc: t("calcDesc"),
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "hover:border-green-400/50",
    },
    {
      id: "whiteboard" as ToolType,
      icon: PenTool,
      label: t("whiteboard"),
      desc: t("painterDesc"),
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "hover:border-purple-400/50",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative min-h-[60vh]">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <PenTool className="text-space-accent" size={32} />
          {t("tools")}
        </h2>
        <p className="text-muted">{t("toolsDesc")}</p>
      </div>

      {/* Grid of Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-20">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`group p-8 rounded-3xl border border-white/5 ${tool.bg} ${tool.border} transition-all flex flex-col items-center text-center gap-4 hover:-translate-y-2 active:scale-95 shadow-xl hover:shadow-2xl`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${tool.color} bg-space-900 group-hover:scale-110 transition-transform shadow-lg`}
            >
              <tool.icon size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {tool.label}
              </h3>
              <p className="text-xs text-muted leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
                {tool.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Floating Tool Area */}
      {activeTool && (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
          <div className="pointer-events-auto">
            {activeTool === "notepad" && (
              <Notepad onClose={() => setActiveTool(null)} />
            )}
            {activeTool === "timer" && (
              <StudyTimer onClose={() => setActiveTool(null)} />
            )}
            {activeTool === "calculator" && (
              <CalcApp onClose={() => setActiveTool(null)} />
            )}
            {activeTool === "whiteboard" && (
              <Whiteboard onClose={() => setActiveTool(null)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentToolsPage;
