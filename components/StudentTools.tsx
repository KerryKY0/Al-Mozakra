import React, { useState, useRef, useEffect } from "react";
import { useI18n } from "../services/i18n";
import {
  StickyNote,
  Clock,
  Calculator as CalcIcon,
  PenTool,
  X,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Palette,
  GripHorizontal,
  LayoutGrid,
  Shapes,
} from "lucide-react";

// ===== DRAGGABLE WRAPPER =====
const DraggableWindow: React.FC<{
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  className?: string;
}> = ({ children, onClose, title, icon, className = "" }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const rect = windowRef.current!.getBoundingClientRect();
    setPos({
      x: rect.left,
      y: rect.top,
    });
    setRel({
      x: e.pageX - rect.left,
      y: e.pageY - rect.top,
    });
    setDragging(true);
    setHasMoved(true);
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const x = e.pageX - rel.x;
      const y = e.pageY - rel.y;
      setPos({ x, y });
    };
    const onMouseUp = () => setDragging(false);

    if (dragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, rel]);

  const style: React.CSSProperties = hasMoved
    ? {
        position: "fixed",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        margin: 0,
        zIndex: 1100,
      }
    : {
        position: "relative",
        margin: 0,
        zIndex: 1100,
      };

  return (
    <div
      ref={windowRef}
      style={style}
      className={`bg-space-800 rounded-2xl border-2 border-space-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-scale ${className}`}
    >
      <div
        onMouseDown={onMouseDown}
        className="flex items-center justify-between p-3 bg-space-900 border-b border-space-700 select-none active:bg-space-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-main flex items-center gap-3 text-sm font-bold">
            <div className="p-1.5 rounded-lg bg-white/5 group-hover:scale-110 transition-transform">
              {icon}
            </div>
            {title}
          </span>
        </div>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onClose}
          className="text-muted hover:text-white hover:bg-red-500 p-1.5 rounded-lg transition-all active:scale-90"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-1 animate-slide-up">{children}</div>
    </div>
  );
};

// ===== NOTEPAD =====
export const Notepad: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useI18n();
  const [text, setText] = useState(
    () => localStorage.getItem("student_notepad") || "",
  );

  useEffect(() => {
    localStorage.setItem("student_notepad", text);
  }, [text]);

  return (
    <DraggableWindow
      onClose={onClose}
      title={t("notepad")}
      icon={<StickyNote size={16} className="text-yellow-400" />}
      className="w-80 md:w-96"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-64 bg-space-900 text-main p-4 resize-none outline-none text-sm leading-relaxed rounded-b-xl"
        placeholder={t("writeNotesHere")}
        dir="auto"
      />
    </DraggableWindow>
  );
};

// ===== TIMER =====
export const StudyTimer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useI18n();
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMin, setInputMin] = useState(25);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = window.setInterval(
        () => setTime((prev) => prev - 1),
        1000,
      );
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, time]);

  const mins = Math.floor(time / 60);
  const secs = time % 60;
  const progress = (time / (inputMin * 60)) * 100;

  return (
    <DraggableWindow
      onClose={onClose}
      title={t("timer")}
      icon={<Clock size={16} className="text-blue-400" />}
      className="w-72"
    >
      <div className="p-6 flex flex-col items-center gap-4 bg-space-800 rounded-b-xl">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="6"
              strokeDasharray={`${progress * 2.83} 283`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-main font-mono">
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </span>
          </div>
        </div>

        {!isRunning && time === inputMin * 60 && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputMin}
              onChange={(e) => {
                setInputMin(+e.target.value);
                setTime(+e.target.value * 60);
              }}
              className="w-16 bg-space-900 border border-space-700 rounded p-1 text-center text-main text-sm outline-none"
              min={1}
              max={120}
            />
            <span className="text-xs text-muted">{t("minute")}</span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-4 py-2 bg-space-accent text-space-900 rounded-lg font-bold text-sm btn-ripple transition-all duration-300 transform hover:scale-110 neon-blue"
          >
            {isRunning ? (
              <>
                <Pause size={14} className="inline mr-1" /> {t("pauseTimer")}
              </>
            ) : (
              <>
                <Play size={14} className="inline mr-1" /> {t("startTimer")}
              </>
            )}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setTime(inputMin * 60);
            }}
            className="px-3 py-2 bg-space-700 text-muted rounded-lg text-sm btn-ripple transition-all duration-300 transform hover:scale-110 active:scale-90"
          >
            <RotateCcw size={14} className="inline mr-1" /> {t("resetTimer")}
          </button>
        </div>
      </div>
    </DraggableWindow>
  );
};

// ===== CALCULATOR =====
export const CalcApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useI18n();
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);

  const handleNum = (n: string) => {
    if (reset) {
      setDisplay(n);
      setReset(false);
      return;
    }
    setDisplay(display === "0" ? n : display + n);
  };
  const handleOp = (o: string) => {
    if (prev && op && !reset) {
      const result = calc(+prev, +display, op);
      setDisplay(String(result));
      setPrev(String(result));
    } else {
      setPrev(display);
    }
    setOp(o);
    setReset(true);
  };
  const calc = (a: number, b: number, o: string) => {
    if (o === "+") return a + b;
    if (o === "-") return a - b;
    if (o === "×") return a * b;
    if (o === "÷") return b !== 0 ? a / b : 0;
    return b;
  };
  const handleEqual = () => {
    if (prev && op) {
      const result = calc(+prev, +display, op);
      setDisplay(String(Math.round(result * 1e10) / 1e10));
      setPrev(null);
      setOp(null);
      setReset(true);
    }
  };
  const handleClear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
  };

  const Btn = ({
    val,
    cls,
    onClick,
  }: {
    val: string;
    cls?: string;
    onClick: () => void;
    key?: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl font-bold text-lg transition-all duration-200 btn-ripple shadow-md transform hover:scale-110 active:scale-90 neon-green ${cls || "bg-space-700 text-main hover:bg-space-600"}`}
    >
      {val}
    </button>
  );

  return (
    <DraggableWindow
      onClose={onClose}
      title={t("calculator")}
      icon={<CalcIcon size={16} className="text-green-400" />}
      className="w-72"
    >
      <div className="p-4 bg-space-800 rounded-b-xl">
        <div className="bg-space-900 rounded-xl p-4 mb-3 text-left">
          <div className="text-xs text-muted h-4">
            {prev ? `${prev} ${op}` : ""}
          </div>
          <div className="text-3xl font-bold text-main font-mono truncate dir-ltr">
            {display}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Btn
            val="C"
            cls="bg-red-500/20 text-red-400 hover:bg-red-500/30 col-span-2"
            onClick={handleClear}
          />
          <Btn
            val="⌫"
            cls="bg-space-700 text-orange-400"
            onClick={() =>
              setDisplay(display.length > 1 ? display.slice(0, -1) : "0")
            }
          />
          <Btn
            val="÷"
            cls="bg-space-accent/20 text-space-accent"
            onClick={() => handleOp("÷")}
          />
          {["7", "8", "9"].map((n) => (
            <Btn key={n} val={n} onClick={() => handleNum(n)} />
          ))}
          <Btn
            val="×"
            cls="bg-space-accent/20 text-space-accent"
            onClick={() => handleOp("×")}
          />
          {["4", "5", "6"].map((n) => (
            <Btn key={n} val={n} onClick={() => handleNum(n)} />
          ))}
          <Btn
            val="-"
            cls="bg-space-accent/20 text-space-accent"
            onClick={() => handleOp("-")}
          />
          {["1", "2", "3"].map((n) => (
            <Btn key={n} val={n} onClick={() => handleNum(n)} />
          ))}
          <Btn
            val="+"
            cls="bg-space-accent/20 text-space-accent"
            onClick={() => handleOp("+")}
          />
          <Btn
            val="0"
            cls="bg-space-700 text-main col-span-2"
            onClick={() => handleNum("0")}
          />
          <Btn
            val="."
            onClick={() => {
              if (!display.includes(".")) setDisplay(display + ".");
            }}
          />
          <Btn
            val="="
            cls="bg-space-accent text-space-900"
            onClick={handleEqual}
          />
        </div>
      </div>
    </DraggableWindow>
  );
};

// ===== WHITEBOARD =====
export const Whiteboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#FDB813");
  const [lineWidth, setLineWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const colors = [
    "#FDB813",
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#a855f7",
    "#f97316",
    "#ec4899",
    "#ffffff",
    "#000000",
  ];

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setIsDrawing(true);
  };
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };
  const stopDraw = () => setIsDrawing(false);
  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current)
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <DraggableWindow
      onClose={onClose}
      title={t("whiteboard")}
      icon={<PenTool size={16} className="text-purple-400" />}
      className="w-80 md:w-[420px]"
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="bg-white w-full cursor-crosshair touch-none"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <div className="p-3 flex items-center gap-2 flex-wrap bg-space-800 rounded-b-xl border-t border-space-700">
        <Palette size={14} className="text-muted" />
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c ? "scale-125 border-white" : "border-transparent"}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <input
          type="range"
          min={1}
          max={10}
          value={lineWidth}
          onChange={(e) => setLineWidth(+e.target.value)}
          className="w-16 accent-space-accent"
        />
        <button
          onClick={clearCanvas}
          className="ml-auto text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-all transform hover:scale-125 active:scale-90 neon-purple"
        >
          <Trash2 size={14} /> {t("clearBoard")}
        </button>
      </div>
    </DraggableWindow>
  );
};

// ===== FLOATING TOOLS FAB =====
type ToolType = "notepad" | "timer" | "calculator" | "whiteboard" | null;

export const FloatingStudentTools: React.FC = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>(null);

  const tools = [
    {
      id: "notepad" as ToolType,
      icon: StickyNote,
      label: t("notepad"),
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      id: "timer" as ToolType,
      icon: Clock,
      label: t("timer"),
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      id: "calculator" as ToolType,
      icon: CalcIcon,
      label: t("calculator"),
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      id: "whiteboard" as ToolType,
      icon: PenTool,
      label: t("whiteboard"),
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  const openTool = (tool: ToolType) => {
    setActiveTool(tool);
    setIsOpen(false);
  };

  return (
    <>
      {/* Active Tool Popup */}
      {activeTool && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in cursor-pointer"
          onClick={() => setActiveTool(null)}
        >
          <div className="cursor-default" onClick={(e) => e.stopPropagation()}>
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

      {/* Tools Bar (Menu) */}
      {isOpen && (
        <div className="fixed bottom-[164px] left-[64px] z-[70] flex flex-col gap-3 p-2 bg-space-800/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-fade-in-up min-w-[170px]">
          <div className="px-3 py-2 border-b border-white/5 mb-1 text-center">
            <span className="text-sm font-black text-space-accent uppercase tracking-wider">
              {t("tools")}
            </span>
          </div>
          {tools.map((tool, i) => (
            <button
              key={tool.id}
              onClick={() => openTool(tool.id)}
              className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/5 transition-all group text-right"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div
                className={`w-9 h-9 rounded-xl ${tool.bg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}
              >
                <tool.icon size={18} className={tool.color} />
              </div>
              <span className="text-main font-bold text-sm group-hover:text-white transition-colors">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Floating Button - CENTERED ABOVE OTHERS */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-[92px] left-[64px] z-[70] w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 btn-ripple group ${
          isOpen
            ? "bg-red-500 rounded-full scale-110 rotate-90"
            : "bg-space-800 border-2 border-space-700 hover:border-space-accent hover:rotate-6 hover:-translate-y-1"
        }`}
        style={{
          boxShadow: isOpen
            ? "0 0 30px rgba(239,68,68,0.5), inset 0 0 10px rgba(255,255,255,0.2)"
            : "0 10px 25px rgba(0,0,0,0.4), 0 0 15px rgba(253,184,19,0.1)",
          background: isOpen
            ? undefined
            : "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
        }}
      >
        <div className="relative">
          {isOpen ? (
            <X size={26} className="text-white" />
          ) : (
            <>
              <div className="absolute inset-0 bg-space-accent blur-md opacity-0 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <Shapes
                size={26}
                className="text-space-accent group-hover:text-white transition-all duration-300 relative z-10 group-hover:scale-110"
              />
            </>
          )}
        </div>
      </button>
    </>
  );
};

export default FloatingStudentTools;
