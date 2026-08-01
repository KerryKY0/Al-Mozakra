import React, { useState, useEffect } from "react";
import { useStore } from "../services/store";
import { useI18n } from "../services/i18n";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  Folder,
  FileVideo,
  FileAudio,
  FileText,
  ChevronLeft,
  Lock,
  MessageSquare,
  X,
  Bell,
  Filter,
  Image as ImageIcon,
  Type,
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle,
  Star,
  GraduationCap,
} from "lucide-react";
import { FileType } from "../types";
import {
  generateQuestionsFromContent,
  GeneratedQuestion,
} from "../services/AIService";
import Draggable from "react-draggable";

// Motivational quotes
export const getQuotes = (t: any) => [
  t("quote1"),
  t("quote2"),
  t("quote3"),
  t("quote4"),
  t("quote5"),
  t("quote6"),
];

// AI Quiz Component
const AIQuiz: React.FC<{
  questions: GeneratedQuestion[];
  onClose: () => void;
  t: any;
}> = ({ questions, onClose, t }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = questions[currentQ];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correctAnswer) setScore((prev) => prev + 1);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      >
        <Draggable>
          <div
            className="bg-space-800 rounded-2xl border border-space-700 w-full max-w-md p-8 text-center animate-fade-in-scale cursor-move relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl font-bold mb-4 ${pct >= 70 ? "bg-green-500/20 text-green-400" : pct >= 40 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}
            >
              {pct}%
            </div>
            <h2 className="text-2xl font-bold text-main mb-2">
              {pct >= 70
                ? t("excellent")
                : pct >= 40
                  ? t("goodTry")
                  : t("needsReview")}
            </h2>
            <p className="text-muted mb-6">
              {t("answered")} {score} {t("outOf")} {questions.length}{" "}
              {t("correctly")}
            </p>
            <button
              onClick={onClose}
              className="bg-space-accent text-space-900 px-8 py-3 rounded-xl font-bold btn-glow btn-ripple"
            >
              {t("close")}
            </button>
          </div>
        </Draggable>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto"
      onClick={onClose}
    >
      <Draggable handle=".modal-handle">
        <div
          className="bg-space-800 rounded-2xl border border-space-700 w-full max-w-lg shadow-2xl animate-fade-in-scale overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-handle cursor-move bg-space-900 p-4 flex items-center justify-between border-b border-space-700 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-space-accent" />
              <span className="font-bold text-main text-sm">
                {t("quizQ")} {currentQ + 1} / {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-green-400 font-bold">
                {score} ✓
              </span>
              <button onClick={onClose} className="text-muted hover:text-white">
                <X size={18} />
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-space-700">
            <div
              className="h-full bg-space-accent transition-all duration-500"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-main mb-6 leading-relaxed">
              {q.question}
            </h3>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let cls =
                  "bg-space-900 border-space-700 text-main hover:border-space-accent";
                if (answered) {
                  if (i === q.correctAnswer)
                    cls = "bg-green-500/10 border-green-500 text-green-400";
                  else if (i === selected)
                    cls = "bg-red-500/10 border-red-500 text-red-400";
                  else
                    cls = "bg-space-900 border-space-700 text-muted opacity-50";
                } else if (i === selected) {
                  cls =
                    "bg-space-accent/10 border-space-accent text-space-accent";
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`w-full p-4 rounded-xl border text-right text-sm font-medium transition-all flex items-center gap-3 ${cls}`}
                  >
                    <span className="w-8 h-8 rounded-full bg-space-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {["A", "B", "C", "D"][i]}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {answered && i === q.correctAnswer && (
                      <CheckCircle size={18} className="text-green-400" />
                    )}
                    {answered && i === selected && i !== q.correctAnswer && (
                      <XCircle size={18} className="text-red-400" />
                    )}
                  </button>
                );
              })}
            </div>
            {answered && q.explanation && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-xs leading-relaxed animate-fade-in">
                💡 {q.explanation}
              </div>
            )}
            {answered && (
              <button
                onClick={nextQuestion}
                className="w-full mt-4 bg-space-accent text-space-900 py-3 rounded-xl font-bold btn-ripple btn-glow"
              >
                {currentQ < questions.length - 1
                  ? t("nextQuestionBtn")
                  : t("showResultBtn")}
              </button>
            )}
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export const StudentDashboard: React.FC = () => {
  const {
    sections,
    subjects,
    currentUser,
    systemMessage,
    notifications,
    markNotificationsRead,
    boxGlowIntensity,
    zeroMaterialsColor,
  } = useStore();
  const { t, lang } = useI18n();
  const location = useLocation();
  const isCoursesPage = location.pathname === "/student/courses";
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [quote] = useState(() => {
    const qs = getQuotes(t);
    return qs[Math.floor(Math.random() * qs.length)];
  });

  const getGlowStyle = (color: string | undefined) => {
    if (boxGlowIntensity === "none") return {};
    const c = color && color !== "#ffffff" ? color : "#fdb813"; // fallback to primary

    switch (boxGlowIntensity) {
      case "low":
        return { boxShadow: `0 4px 15px -5px ${c}40` };
      case "medium":
        return { boxShadow: `0 8px 25px -5px ${c}60` };
      case "high":
        return { boxShadow: `0 12px 35px -5px ${c}80, 0 0 15px ${c}40` };
      case "extreme":
        return { boxShadow: `0 0 45px 5px ${c}, 0 0 25px ${c}` };
      default:
        return { boxShadow: `0 4px 20px -5px ${c}40` };
    }
  };

  useEffect(() => {
    if (isCoursesPage && currentUser.sectionId && !selectedSection) {
      setSelectedSection(currentUser.sectionId);
    }
  }, [isCoursesPage, currentUser.sectionId, selectedSection]);

  useEffect(() => {
    if (systemMessage.isActive) {
      setShowMessage(true);
    }
  }, [systemMessage]);

  if (!currentUser) return null;

  const myNotifications = notifications
    .filter((n) => n.userId === currentUser.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  const unreadCount = myNotifications.filter((n) => !n.isRead).length;

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      markNotificationsRead(currentUser.id);
    }
  };

  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-space-accent underline hover:text-yellow-300 break-all dir-ltr inline-block mx-1"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const isMarquee = systemMessage.displayMode === "marquee";

  if (isCoursesPage) {
    return (
      <div className="space-y-6 md:space-y-8 min-h-[60vh] flex flex-col items-center justify-center relative animate-fade-in">
        {/* Summary Stats Card - PURE COUNT VIEW */}
        <div className="bg-gradient-to-br from-space-800 to-space-900 border border-space-accent/20 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group animate-fade-in-scale w-full max-w-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-space-accent/5 rounded-full -translate-y-32 translate-x-32 blur-3xl group-hover:bg-space-accent/10 transition-all"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-space-accent/5 rounded-full translate-y-32 -translate-x-32 blur-3xl transition-all"></div>

          <div className="relative z-10 flex flex-col items-center text-center gap-8">
            <div className="w-24 h-24 bg-space-accent/10 rounded-3xl flex items-center justify-center border border-space-accent/20 shadow-xl group-hover:scale-110 transition-transform duration-500">
              <GraduationCap size={48} className="text-space-accent" />
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-black text-main tracking-tight uppercase">
                {t("myCourses")}
              </h2>
              <p className="text-muted text-sm md:text-base mt-2 max-w-sm">
                {t("trackYourProgress")}
              </p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-6xl md:text-8xl font-black text-space-accent animate-bounce-short drop-shadow-[0_0_15px_rgba(253,184,19,0.4)]">
                {
                  subjects.filter((s) => s.sectionId === currentUser.sectionId)
                    .length
                }
              </span>
              <p className="text-xs md:text-sm text-space-accent uppercase tracking-[0.2em] font-black mt-2">
                {t("registeredSubjects")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 relative animate-fade-in">
      {/* System Message - Popup Mode */}
      {!isCoursesPage && showMessage && !isMarquee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <Draggable>
            <div className="bg-space-800 border-2 border-space-accent rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-fade-in-scale cursor-move">
              <button
                onClick={() => setShowMessage(false)}
                className="absolute top-4 left-4 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-space-900 rounded-full flex items-center justify-center border border-space-accent">
                  <MessageSquare className="text-space-accent" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-main mb-4">
                {t("adminAlert")}
              </h3>
              <div className="bg-space-900 p-4 rounded-lg text-main text-center leading-relaxed whitespace-pre-wrap">
                {renderTextWithLinks(systemMessage.content)}
              </div>
              <button
                onClick={() => setShowMessage(false)}
                className="w-full bg-space-accent text-space-900 font-bold py-3 rounded-lg mt-6 hover:bg-yellow-400 btn-glow btn-ripple"
              >
                {t("understood")}
              </button>
            </div>
          </Draggable>
        </div>
      )}

      {/* System Message - Marquee Mode */}
      {!isCoursesPage && systemMessage.isActive && isMarquee && (
        <div className="bg-space-800 border border-space-700 rounded-xl p-3 overflow-hidden relative">
          <div className="animate-marquee text-space-accent font-bold whitespace-nowrap">
            📢 {systemMessage.content}
          </div>
        </div>
      )}

      {!isCoursesPage && (
        <header className="flex justify-between items-start md:items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-main">
              {t("welcomeStudent")}{" "}
              <span className="text-space-accent">
                {currentUser.name.split(" ")[0]}
              </span>
            </h1>
            <p className="text-muted text-xs md:text-sm mt-2">
              {t("followUp")}
            </p>
            {/* Quote */}
            <p className="text-sm text-space-accent/80 mt-2 animate-fade-in-up">
              {quote}
            </p>
          </div>

          <div className="relative">
            <button
              onClick={handleOpenNotifications}
              className="relative p-2 md:p-3 bg-space-800 border border-space-700 rounded-full text-muted hover:text-main hover:bg-space-700 transition-colors btn-ripple"
            >
              <Bell size={18} className="md:w-5 md:h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-short">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute top-full left-0 mt-2 w-72 md:w-80 bg-space-800 border border-space-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-scale">
                <div className="p-3 bg-space-900 font-bold text-sm text-main border-b border-space-700">
                  {t("notifications")}
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {myNotifications.length > 0 ? (
                    myNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs border-b border-space-700 ${n.isRead ? "text-muted" : "text-main bg-space-accent/5"}`}
                      >
                        <p>{n.message}</p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {new Date(n.createdAt).toLocaleDateString(
                            lang === "ar" ? "ar-EG" : "en-US",
                          )}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-center text-muted text-sm">
                      {t("noNotifications")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Summary Stats Card */}
      {isCoursesPage && (
        <div className="bg-gradient-to-r from-space-800 to-space-900 border border-space-accent/20 rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden shadow-2xl group animate-fade-in-up">
          <div className="absolute top-0 right-0 w-32 h-32 bg-space-accent/10 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-space-accent/20 transition-all"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-space-accent/10 rounded-2xl flex items-center justify-center border border-space-accent/30 shadow-inner group-hover:scale-110 transition-transform">
                <GraduationCap size={32} className="text-space-accent" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-main">
                  {t("myCourses")}
                </h2>
                <p className="text-muted text-sm mt-1">
                  {t("trackYourProgress")}
                </p>
              </div>
            </div>
            <div className="bg-space-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 flex items-center gap-4">
              <div className="text-center px-4 border-l border-white/5 last:border-0">
                <p className="text-2xl md:text-3xl font-black text-space-accent">
                  {
                    subjects.filter(
                      (s) => s.sectionId === currentUser.sectionId,
                    ).length
                  }
                </p>
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold mt-1">
                  {t("registeredSubjects")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy getGlowStyle from AdminContent */}
      {(() => {
        // We can just define it inline since it's a function
        return null;
      })()}

      {!selectedSection ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 stagger-children">
          {sections.map((section) => {
            const getGlowStyle = (
              color: string | undefined,
              intensity: number | undefined,
            ) => {
              if (intensity === 0) return {};
              const c = color && color !== "#ffffff" ? color : "#fdb813";
              switch (intensity) {
                case 1:
                  return { boxShadow: `0 4px 15px -5px ${c}40` };
                case 2:
                  return { boxShadow: `0 8px 25px -5px ${c}60` };
                case 3:
                  return {
                    boxShadow: `0 12px 35px -5px ${c}80, 0 0 15px ${c}40`,
                  };
                case 4:
                  return { boxShadow: `0 0 45px 5px ${c}, 0 0 25px ${c}` };
                case 5:
                  return { boxShadow: `0 0 60px 10px ${c}, 0 0 35px ${c}` };
                default:
                  return {};
              }
            };
            return (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`bg-space-800/50 p-6 md:p-8 rounded-2xl border border-space-700 hover:border-space-accent transition-all text-right group relative overflow-hidden cursor-pointer btn-shadow flex flex-col justify-end ${section.cardSize === "large" ? "min-h-[220px]" : "min-h-[160px]"}`}
                style={getGlowStyle(section.textColor, section.glowIntensity)}
              >
                {section.imageUrl && (
                  <>
                    <img
                      src={section.imageUrl}
                      alt={section.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-space-900/90 via-space-900/60 to-space-900/30 z-0"></div>
                  </>
                )}
                {!section.imageUrl && (
                  <div className="absolute top-0 left-0 w-20 h-20 md:w-24 md:h-24 bg-space-accent/5 rounded-br-full -translate-x-4 -translate-y-4 group-hover:bg-space-accent/10 transition-colors z-0"></div>
                )}

                <div className="relative z-10 w-full text-right flex flex-col items-start">
                  {!section.imageUrl && (
                    <Folder
                      className="mb-3 md:mb-4 w-10 h-10 md:w-12 md:h-12 group-hover:scale-110 transition-transform"
                      style={{ color: section.textColor || "#DD6B20" }}
                    />
                  )}
                  <h3
                    className="text-lg md:text-xl font-bold drop-shadow-md mt-2"
                    style={{ color: section.textColor || "#ffffff" }}
                  >
                    {section.title}
                  </h3>
                  <p
                    className="font-bold drop-shadow-md text-xs md:text-sm mt-1 md:mt-2"
                    style={{ color: section.countTextColor || "#94a3b8" }}
                  >
                    {subjects.filter((s) => s.sectionId === section.id).length}{" "}
                    {t("subjects")}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6 animate-fade-in">
          {!isCoursesPage && (
            <button
              onClick={() => setSelectedSection(null)}
              className="flex items-center text-space-accent hover:text-main transition-colors text-sm md:text-base btn-ripple"
            >
              <ChevronLeft className="rotate-180 ml-2" size={18} />
              {t("backToSections")}
            </button>
          )}

          <h2 className="text-xl md:text-2xl font-bold text-main border-b border-space-700 pb-4">
            {sections.find((s) => s.id === selectedSection)?.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 stagger-children">
            {subjects
              .filter((s) => s.sectionId === selectedSection)
              .map((subject) => {
                const getGlowStyle = (
                  color: string | undefined,
                  intensity: number | undefined,
                ) => {
                  if (intensity === 0) return {};
                  const c = color && color !== "#ffffff" ? color : "#fdb813";
                  switch (intensity) {
                    case 1:
                      return { boxShadow: `0 4px 15px -5px ${c}40` };
                    case 2:
                      return { boxShadow: `0 8px 25px -5px ${c}60` };
                    case 3:
                      return {
                        boxShadow: `0 12px 35px -5px ${c}80, 0 0 15px ${c}40`,
                      };
                    case 4:
                      return { boxShadow: `0 0 45px 5px ${c}, 0 0 25px ${c}` };
                    case 5:
                      return { boxShadow: `0 0 60px 10px ${c}, 0 0 35px ${c}` };
                    default:
                      return {};
                  }
                };
                return (
                  <Link
                    key={subject.id}
                    to={`/student/subject/${subject.id}`}
                    className={`bg-space-800/50 rounded-2xl border border-space-700 hover:border-space-accent transition-all flex flex-col group btn-shadow overflow-hidden relative ${subject.cardSize === "large" ? "min-h-[260px]" : "min-h-[200px]"}`}
                    style={getGlowStyle(
                      subject.textColor,
                      subject.glowIntensity,
                    )}
                  >
                    {subject.imageUrl && (
                      <>
                        <img
                          src={subject.imageUrl}
                          alt={subject.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-space-900/90 via-space-900/60 to-space-900/30 z-0"></div>
                      </>
                    )}

                    <div className="flex-1 relative z-10 p-5 md:p-6 pb-2 flex flex-col justify-end">
                      <h3
                        className="font-bold text-lg md:text-xl drop-shadow-md group-hover:text-space-accent transition-colors"
                        style={{ color: subject.textColor || "#ffffff" }}
                      >
                        {subject.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between px-5 py-4 relative z-10 mt-auto border-t border-space-700/50 bg-space-900/40 backdrop-blur-sm">
                      <span className="text-xs text-slate-300 font-bold drop-shadow-md">
                        {t("clickToView")}
                      </span>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-space-800/80 rounded-full flex items-center justify-center group-hover:bg-space-700 transition-colors">
                        <ChevronLeft className="text-white" size={18} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            {subjects.filter((s) => s.sectionId === selectedSection).length ===
              0 && (
              <p className="text-muted col-span-full py-10 text-center text-sm">
                {t("noSubjectsYet")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const SubjectFiles: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { subjects, files } = useStore();
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState<"ALL" | FileType>("ALL");
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiQuestions, setAiQuestions] = useState<GeneratedQuestion[] | null>(
    null,
  );
  const subject = subjects.find((s) => s.id === id);

  const subjectFiles = files
    .filter((f) => !f.isSuspended)
    .filter((f) => f.subjectId === id)
    .filter((f) => filter === "ALL" || f.type === filter)
    .sort((a, b) => {
      const order = {
        [FileType.PDF]: 1,
        [FileType.TEXT]: 2,
        [FileType.IMAGE]: 3,
        [FileType.VIDEO]: 4,
        [FileType.AUDIO]: 5,
      };
      return (order[a.type] || 99) - (order[b.type] || 99);
    });

  if (!subject) return <div>{t("noSubjectsYet")}</div>;

  const getIcon = (type: FileType) => {
    switch (type) {
      case FileType.PDF:
        return <FileText className="text-red-400" size={18} />;
      case FileType.VIDEO:
        return <FileVideo className="text-blue-400" size={18} />;
      case FileType.AUDIO:
        return <FileAudio className="text-purple-400" size={18} />;
      case FileType.TEXT:
        return <Type className="text-green-400" size={18} />;
      case FileType.IMAGE:
        return <ImageIcon className="text-orange-400" size={18} />;
    }
  };

  const handleGenerateQuestions = async (
    fileContent: string,
    fileId: string,
  ) => {
    if (!fileContent || fileContent.length < 50) {
      alert(t("contentTooShort"));
      return;
    }
    setAiLoading(fileId);
    try {
      const questions = await generateQuestionsFromContent(
        fileContent,
        5,
        lang,
      );
      setAiQuestions(questions);
    } catch (err: any) {
      alert(err.message || t("failGenerate"));
    } finally {
      setAiLoading(null);
    }
  };

  const FilterBtn = ({
    type,
    label,
  }: {
    type: "ALL" | FileType;
    label: string;
  }) => (
    <button
      onClick={() => setFilter(type)}
      className={`px-3 py-1.5 rounded-lg text-xs md:text-sm transition-colors whitespace-nowrap btn-ripple ${filter === type ? "bg-space-accent text-space-900 font-bold" : "bg-space-800 text-muted hover:bg-space-700"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI Quiz Modal */}
      {aiQuestions && (
        <AIQuiz
          questions={aiQuestions}
          onClose={() => setAiQuestions(null)}
          t={t}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/student"
            className="p-2 bg-space-800 rounded-full hover:bg-space-700 text-main btn-ripple"
          >
            <ChevronLeft className="rotate-180" size={20} />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-main truncate">
            {subject.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <Filter size={16} className="text-muted ml-2 shrink-0" />
          <FilterBtn type="ALL" label={t("all")} />
          <FilterBtn type={FileType.PDF} label="PDF" />
          <FilterBtn type={FileType.TEXT} label={t("texts")} />
          <FilterBtn type={FileType.IMAGE} label={t("images")} />
          <FilterBtn type={FileType.VIDEO} label={t("videos")} />
          <FilterBtn type={FileType.AUDIO} label={t("audio")} />
        </div>
      </div>

      <div className="bg-space-800 rounded-2xl overflow-hidden border border-space-700">
        {subjectFiles.length > 0 ? (
          <div className="divide-y divide-space-700">
            {subjectFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between hover:bg-space-700/50 transition-colors group"
              >
                <Link
                  to={`/student/file/${file.id}`}
                  className="p-4 flex items-center gap-3 md:gap-4 overflow-hidden flex-1"
                >
                  <div className="p-2 md:p-3 bg-space-900 rounded-lg shrink-0">
                    {getIcon(file.type)}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-main text-sm md:text-base group-hover:text-space-accent transition-colors truncate">
                      {file.title}
                    </h4>
                    <p className="text-[10px] md:text-xs text-muted mt-1 truncate">
                      {file.type === FileType.PDF
                        ? t("pdfDoc")
                        : file.type === FileType.IMAGE
                          ? t("imageFile")
                          : file.type === FileType.TEXT
                            ? t("readableText")
                            : t("clickToView")}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2 px-4 shrink-0">
                  {/* AI Generate Questions Button */}
                  {(file.type === FileType.TEXT ||
                    file.type === FileType.PDF) && (
                    <button
                      onClick={() =>
                        handleGenerateQuestions(
                          file.content ||
                            file.title + " " + (file.description || ""),
                          file.id,
                        )
                      }
                      disabled={aiLoading === file.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-xs hover:bg-purple-500/20 transition-all btn-ripple disabled:opacity-50"
                      title={t("generateQuestions")}
                    >
                      {aiLoading === file.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Sparkles size={14} />
                      )}
                      <span className="hidden md:inline">
                        {t("generateQuestions")}
                      </span>
                    </button>
                  )}
                  {file.preventDownload && (
                    <span
                      title={t("downloadNotAvail")}
                      className="flex items-center"
                    >
                      <Lock size={14} className="text-red-400" />
                    </span>
                  )}
                  <Link to={`/student/file/${file.id}`}>
                    <ChevronLeft size={18} className="text-muted" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-muted text-sm">
            {t("noFilesYet")}
          </div>
        )}
      </div>
    </div>
  );
};
