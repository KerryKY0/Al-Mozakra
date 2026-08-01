import React, { useState } from "react";
import { useStore } from "../services/store";
import { UserRole, FileType, EducationalFile } from "../types";
import {
  Layers,
  Database,
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Ban,
  FileVideo,
  FileAudio,
  Image as ImageIcon,
  Type,
  Eye,
  MessageSquare,
  Lock,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useI18n } from "../services/i18n";
import Draggable from "react-draggable";

const TabButton = ({
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
    className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 text-xs md:text-sm ${active ? "bg-space-accent text-space-900 shadow-lg shadow-space-accent/20 scale-105" : "bg-space-800 text-muted hover:bg-space-700 border border-space-700 hover:text-white"}`}
  >
    {Icon && <Icon size={14} className="md:w-4 md:h-4" />}
    {label}
  </button>
);

export const AdminContent: React.FC = () => {
  const {
    sections,
    subjects,
    files,
    addSection,
    updateSection,
    deleteSection,
    addSubject,
    updateSubject,
    deleteSubject,
    addFile,
    updateFile,
    deleteFile,
    showToast,
    currentUser,
    viewRecords,
    users,
    boxGlowIntensity,
    zeroMaterialsColor,
  } = useStore();
  const { t, dir } = useI18n();

  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"SECTIONS" | "SUBJECTS" | "FILES">(
    (location.state as any)?.defaultTab || "SECTIONS",
  );
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [filterSubject, setFilterSubject] = useState("");
  const [viewingFileDetails, setViewingFileDetails] =
    useState<EducationalFile | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<
    "INFO" | "COMMENTS" | "VIEWERS"
  >("INFO");
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: "SECTION" | "SUBJECT" | "FILE";
    id: string;
    name: string;
  } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [fileType, setFileType] = useState<FileType>(FileType.PDF);
  const [contentUrl, setContentUrl] = useState("");
  const [preventDownload, setPreventDownload] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [textColor, setTextColor] = useState("#ffffff");
  const [cardSize, setCardSize] = useState<"normal" | "large">("normal");
  const [glowIntensity, setGlowIntensity] = useState<number>(0);
  const [countTextColor, setCountTextColor] = useState("#cbd5e1");

  const canManageContent =
    currentUser?.role === UserRole.ADMIN ||
    (currentUser?.role === UserRole.SUB_ADMIN &&
      currentUser.permissions?.canManageContent);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSectionId(sections[0]?.id || "");
    setSubjectId(subjects[0]?.id || "");
    setFileType(FileType.PDF);
    setContentUrl("");
    setPreventDownload(false);
    setEditingItem(null);
    setFileName("");
    setIsProcessingFile(false);
    setImageUrl("");
    setSelectedImageFile(null);
    setTextColor("#ffffff");
    setCardSize("normal");
    setGlowIntensity(0);
    setCountTextColor("#cbd5e1");
  };

  const openAddModal = () => {
    resetForm();
    setEditingItem(null);
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setTitle(item.title);
    if (activeTab === "SECTIONS") {
      setImageUrl(item.imageUrl || "");
      setTextColor(item.textColor || "#ffffff");
      setCardSize(item.cardSize || "normal");
      setGlowIntensity(item.glowIntensity || 0);
      setCountTextColor(item.countTextColor || "#cbd5e1");
    } else if (activeTab === "SUBJECTS") {
      setSectionId(item.sectionId);
      setImageUrl(item.imageUrl || "");
      setTextColor(item.textColor || "#ffffff");
      setCardSize(item.cardSize || "normal");
      setGlowIntensity(item.glowIntensity || 0);
      setCountTextColor(item.countTextColor || "#cbd5e1");
    } else if (activeTab === "FILES") {
      setSubjectId(item.subjectId);
      setFileType(item.type);
      setContentUrl(item.contentUrl);
      setDescription(item.description || "");
      setPreventDownload(item.preventDownload);
    }
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024 * 1024) {
      // 500MB
      alert(t("tooLarge"));
      return;
    }
    setSelectedFile(file);
    setFileName(file.name);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      alert(t("tooLarge"));
      return;
    }
    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const initiateDelete = (type: "SECTION" | "SUBJECT" | "FILE", item: any) => {
    setDeleteConfirmation({ type, id: item.id, name: item.title });
  };

  const executeDelete = () => {
    if (!deleteConfirmation) return;
    if (deleteConfirmation.type === "SECTION")
      deleteSection(deleteConfirmation.id);
    else if (deleteConfirmation.type === "SUBJECT")
      deleteSubject(deleteConfirmation.id);
    else if (deleteConfirmation.type === "FILE")
      deleteFile(deleteConfirmation.id);
    showToast(t("deleteSuccess"));
    setDeleteConfirmation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessingFile) return alert(t("waitLoading"));
    setIsProcessingFile(true);

    let finalImageUrl = imageUrl;
    if (
      selectedImageFile &&
      (activeTab === "SECTIONS" || activeTab === "SUBJECTS")
    ) {
      const fileExt = selectedImageFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(filePath, selectedImageFile);
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("files")
          .getPublicUrl(filePath);
        finalImageUrl = publicUrlData.publicUrl;
      } else {
        console.warn("Fallback to base64 for image upload", uploadError);
      }
    }

    if (activeTab === "SECTIONS") {
      editingItem
        ? updateSection(
            editingItem.id,
            title,
            finalImageUrl,
            textColor,
            cardSize,
            glowIntensity,
            countTextColor,
          )
        : addSection(
            title,
            finalImageUrl,
            textColor,
            cardSize,
            glowIntensity,
            countTextColor,
          );
      setIsProcessingFile(false);
      setSelectedImageFile(null);
    } else if (activeTab === "SUBJECTS") {
      editingItem
        ? updateSubject(
            editingItem.id,
            title,
            finalImageUrl,
            textColor,
            cardSize,
            glowIntensity,
            countTextColor,
          )
        : addSubject(
            title,
            sectionId,
            finalImageUrl,
            textColor,
            cardSize,
            glowIntensity,
            countTextColor,
          );
      setIsProcessingFile(false);
      setSelectedImageFile(null);
    } else if (activeTab === "FILES") {
      let finalContentUrl = contentUrl;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("files")
          .upload(filePath, selectedFile);

        if (uploadError) {
          console.warn(
            "Supabase storage not configured or failed. Falling back to base64:",
            uploadError,
          );

          try {
            finalContentUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(selectedFile);
            });
          } catch (e) {
            alert(t("fileUploadFail"));
            setIsProcessingFile(false);
            return;
          }
        } else {
          const { data: publicUrlData } = supabase.storage
            .from("files")
            .getPublicUrl(filePath);
          finalContentUrl = publicUrlData.publicUrl;
        }
      }

      if (editingItem) {
        updateFile(editingItem.id, {
          title,
          description,
          type: fileType,
          contentUrl: finalContentUrl,
          preventDownload,
          subjectId,
        });
      } else {
        addFile({
          id: Math.random().toString(36).substr(2, 9),
          title,
          description,
          type: fileType,
          contentUrl: finalContentUrl,
          subjectId,
          preventDownload,
          createdAt: new Date().toISOString(),
          views: 0,
          comments: [],
          isSuspended: false,
        });
      }
      setIsProcessingFile(false);
      setSelectedFile(null);
    }
    setShowModal(false);
    showToast(editingItem ? t("updated") : t("added"));
  };

  const sortedFiles = [...files].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const getAddButtonText = () => {
    if (activeTab === "SECTIONS") return t("addSection");
    if (activeTab === "SUBJECTS") return t("addSubject");
    return t("addFile");
  };

  const getGlowStyle = (
    color: string | undefined,
    intensity: number | undefined,
  ) => {
    if (intensity === 0) return {};
    const c = color && color !== "#ffffff" ? color : "#fdb813"; // fallback to primary

    switch (intensity) {
      case 1:
        return { boxShadow: `0 4px 15px -5px ${c}40` };
      case 2:
        return { boxShadow: `0 8px 25px -5px ${c}60` };
      case 3:
        return { boxShadow: `0 12px 35px -5px ${c}80, 0 0 15px ${c}40` };
      case 4:
        return { boxShadow: `0 0 45px 5px ${c}, 0 0 25px ${c}` };
      case 5:
        return { boxShadow: `0 0 60px 10px ${c}, 0 0 35px ${c}` };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-main">
          {t("contentManagement")}
        </h1>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch bg-space-800 p-3 rounded-xl border border-space-700">
        <div className="flex flex-wrap gap-2 bg-space-900/50 p-1 rounded-lg">
          <TabButton
            active={activeTab === "SECTIONS"}
            onClick={() => setActiveTab("SECTIONS")}
            label={t("sections")}
            icon={Layers}
          />
          <TabButton
            active={activeTab === "SUBJECTS"}
            onClick={() => setActiveTab("SUBJECTS")}
            label={t("subjects")}
            icon={Database}
          />
          <TabButton
            active={activeTab === "FILES"}
            onClick={() => setActiveTab("FILES")}
            label={t("files")}
            icon={FileText}
          />
        </div>
        {canManageContent && (
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-500 transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-green-500/20"
          >
            <Plus size={16} /> {getAddButtonText()}
          </button>
        )}
      </div>

      <div className="min-h-[400px]">
        {activeTab === "SECTIONS" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((s) => {
              const subjectsCount = subjects.filter(
                (sub) => sub.sectionId === s.id,
              ).length;
              return (
                <div
                  key={s.id}
                  className={`bg-space-800 p-5 rounded-2xl border border-space-700 hover:border-space-accent transition-all group relative flex flex-col overflow-hidden ${s.cardSize === "large" ? "h-64 md:h-72" : "h-48 md:h-52"}`}
                  style={getGlowStyle(s.textColor, s.glowIntensity)}
                >
                  {s.imageUrl && (
                    <>
                      <img
                        src={s.imageUrl}
                        alt={s.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-space-900/90 via-space-900/60 to-space-900/30 z-0"></div>
                    </>
                  )}
                  <div className="mb-4 relative z-10 flex-1">
                    <div
                      className="flex items-center gap-2 mb-3"
                      style={{ color: s.textColor || "#DD6B20" }}
                    >
                      {!s.imageUrl && <Layers size={28} />}
                    </div>
                    <h3
                      className="text-xl font-bold mb-1 truncate leading-tight drop-shadow-md"
                      style={{ color: s.textColor || "#ffffff" }}
                    >
                      {s.title}
                    </h3>
                    <span
                      className="text-xs font-bold block drop-shadow-md"
                      style={{ color: s.countTextColor || "#94a3b8" }}
                    >
                      {subjectsCount} {t("allSubjectsCount")}
                    </span>
                  </div>
                  {canManageContent && (
                    <div className="absolute bottom-4 left-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => openEditModal(s)}
                        className="w-9 h-9 rounded-xl bg-space-900/60 backdrop-blur-md border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all shadow-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => initiateDelete("SECTION", s)}
                        className="w-9 h-9 rounded-xl bg-space-900/60 backdrop-blur-md border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "SUBJECTS" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => {
              const filesCount = files.filter(
                (f) => f.subjectId === s.id,
              ).length;
              return (
                <div
                  key={s.id}
                  className={`bg-space-800 p-5 rounded-2xl border border-space-700 hover:border-space-accent transition-all group relative flex flex-col overflow-hidden ${s.cardSize === "large" ? "h-64 md:h-72" : "h-48 md:h-52"}`}
                  style={getGlowStyle(s.textColor, s.glowIntensity)}
                >
                  {s.imageUrl && (
                    <>
                      <img
                        src={s.imageUrl}
                        alt={s.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-space-900/90 via-space-900/60 to-space-900/30 z-0"></div>
                    </>
                  )}
                  <div className="mb-4 relative z-10 flex-1">
                    <div
                      className="flex items-center gap-2 mb-3"
                      style={{ color: s.textColor || "#60A5FA" }}
                    >
                      {!s.imageUrl && <Database size={28} />}
                    </div>
                    <h3
                      className="text-xl font-bold mb-1 truncate leading-tight drop-shadow-md"
                      style={{ color: s.textColor || "#ffffff" }}
                    >
                      {s.title}
                    </h3>
                    <span
                      className="text-xs font-bold flex items-center gap-1 flex-wrap drop-shadow-md"
                      style={{ color: s.countTextColor || "#94a3b8" }}
                    >
                      <Layers size={12} /> {filesCount} ملفات
                    </span>
                  </div>
                  {canManageContent && (
                    <div className="absolute bottom-4 left-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => openEditModal(s)}
                        className="w-9 h-9 rounded-xl bg-space-900/60 backdrop-blur-md border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all shadow-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => initiateDelete("SUBJECT", s)}
                        className="w-9 h-9 rounded-xl bg-space-900/60 backdrop-blur-md border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "FILES" && (
          <>
            <div className="p-3 border-b border-space-700 bg-space-800/50 mb-4 rounded-lg flex flex-col sm:flex-row gap-3">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="bg-space-900 border border-space-700 text-main rounded-lg px-3 py-2 text-sm outline-none w-full sm:w-auto flex-1 cursor-pointer"
              >
                <option value="">{t("allSubjects")}</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedFiles
                .filter((f) => !filterSubject || f.subjectId === filterSubject)
                .map((f) => (
                  <div
                    key={f.id}
                    className={`bg-space-800 p-4 rounded-xl border border-space-700 hover:border-space-accent transition-all group flex flex-col ${f.isSuspended ? "opacity-70 border-red-500/30" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div
                        className={`p-2 rounded ${f.isSuspended ? "bg-red-900/20 text-red-400" : "bg-space-900 text-space-accent"}`}
                      >
                        {f.type === FileType.PDF ? (
                          <FileText size={18} className="md:w-5 md:h-5" />
                        ) : f.type === FileType.VIDEO ? (
                          <FileVideo size={18} className="md:w-5 md:h-5" />
                        ) : f.type === FileType.AUDIO ? (
                          <FileAudio size={18} className="md:w-5 md:h-5" />
                        ) : f.type === FileType.IMAGE ? (
                          <ImageIcon size={18} className="md:w-5 md:h-5" />
                        ) : (
                          <Type size={18} className="md:w-5 md:h-5" />
                        )}
                      </div>
                      <div className="flex gap-1">
                        {f.preventDownload && (
                          <Lock size={14} className="text-red-400" />
                        )}
                        {f.isSuspended && (
                          <Ban size={14} className="text-orange-400" />
                        )}
                      </div>
                    </div>
                    <h4
                      className={`font-bold text-base md:text-lg mb-1 truncate ${f.isSuspended ? "text-red-300" : "text-main"}`}
                    >
                      {f.title}
                    </h4>
                    <p className="text-[10px] md:text-xs text-muted mb-4 truncate">
                      {subjects.find((s) => s.id === f.subjectId)?.title}
                    </p>

                    <div className="flex flex-wrap items-center justify-between mt-auto pt-3 border-t border-space-700/50 gap-2 mb-1">
                      <button
                        onClick={() => {
                          setViewingFileDetails(f);
                          setActiveDetailTab("INFO");
                        }}
                        className="flex gap-2 text-xs text-muted hover:text-white transition-colors"
                      >
                        <span
                          className="flex items-center gap-1 hover:text-blue-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingFileDetails(f);
                            setActiveDetailTab("VIEWERS");
                          }}
                        >
                          <Eye size={12} /> {f.views}
                        </span>
                        <span
                          className="flex items-center gap-1 hover:text-green-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingFileDetails(f);
                            setActiveDetailTab("COMMENTS");
                          }}
                        >
                          <MessageSquare size={12} /> {f.comments?.length || 0}
                        </span>
                      </button>
                      <div className="flex gap-1">
                        <Link
                          to={`/admin/file/${f.id}`}
                          className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg"
                          title="معاينة"
                        >
                          <Eye size={14} className="md:w-4 md:h-4" />
                        </Link>
                        {canManageContent && (
                          <>
                            <button
                              onClick={() =>
                                updateFile(f.id, {
                                  isSuspended: !f.isSuspended,
                                })
                              }
                              className={`p-1.5 rounded-lg ${f.isSuspended ? "text-green-400 hover:bg-green-400/10" : "text-orange-400 hover:bg-orange-400/10"}`}
                              title={f.isSuspended ? "تفعيل" : "تعطيل"}
                            >
                              {f.isSuspended ? (
                                <CheckCircle
                                  size={14}
                                  className="md:w-4 md:h-4"
                                />
                              ) : (
                                <Ban size={14} className="md:w-4 md:h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => openEditModal(f)}
                              className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg"
                            >
                              <Edit size={14} className="md:w-4 md:h-4" />
                            </button>
                            <button
                              onClick={() => initiateDelete("FILE", f)}
                              className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg"
                            >
                              <Trash2 size={14} className="md:w-4 md:h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              {files.filter(
                (f) => !filterSubject || f.subjectId === filterSubject,
              ).length === 0 && (
                <div className="col-span-full p-8 text-center text-muted">
                  لا توجد ملفات
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal Components - Keep similar, ensuring responsiveness on modal wrapper */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <Draggable>
            <div className="bg-space-800 rounded-2xl border border-red-500 w-full max-w-sm shadow-2xl p-6 text-center animate-fade-in-scale cursor-move relative">
              <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {t("confirmDelete")}
              </h3>
              <p className="text-slate-300 text-sm mb-6">
                {t("confirm")}{" "}
                {deleteConfirmation.type === "SECTION"
                  ? t("section")
                  : deleteConfirmation.type === "SUBJECT"
                    ? t("subjects")
                    : t("files")}{" "}
                <b>{deleteConfirmation.name}</b>؟
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={executeDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-500 flex-1"
                >
                  {t("yesDelete")}
                </button>
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="bg-space-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-space-600 flex-1"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </Draggable>
        </div>
      )}

      {/* File details modal */}
      {viewingFileDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <Draggable handle=".modal-handle">
            <div className="bg-space-800 rounded-2xl border border-space-700 w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col animate-fade-in-scale">
              <div className="modal-handle cursor-move p-4 border-b border-space-700 flex justify-between items-center bg-space-800 z-10 shrink-0 rounded-t-2xl">
                <div className="flex gap-4 items-center overflow-hidden">
                  <button
                    onClick={() => setViewingFileDetails(null)}
                    className="text-muted hover:text-white shrink-0"
                  >
                    <X size={20} />
                  </button>
                  <h2 className="text-base font-bold text-main truncate">
                    {viewingFileDetails.title}
                  </h2>
                </div>
              </div>
              <div className="p-2 bg-space-900 flex justify-center gap-2 border-b border-space-700 shrink-0">
                <button
                  onClick={() => setActiveDetailTab("INFO")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeDetailTab === "INFO" ? "bg-space-700 text-white" : "text-muted"}`}
                >
                  تفاصيل
                </button>
                <button
                  onClick={() => setActiveDetailTab("VIEWERS")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeDetailTab === "VIEWERS" ? "bg-space-700 text-white" : "text-muted"}`}
                >
                  المشاهدين
                </button>
                <button
                  onClick={() => setActiveDetailTab("COMMENTS")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeDetailTab === "COMMENTS" ? "bg-space-700 text-white" : "text-muted"}`}
                >
                  التعليقات
                </button>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                {/* ... tab contents same as before ... */}
                {activeDetailTab === "INFO" && (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div
                        className="bg-space-900 p-4 rounded-xl border border-space-700 cursor-pointer hover:bg-space-800 transition-colors"
                        onClick={() => setActiveDetailTab("VIEWERS")}
                      >
                        <Eye size={24} className="mx-auto mb-2 text-blue-400" />
                        <div className="text-2xl font-bold text-main">
                          {viewingFileDetails.views}
                        </div>
                        <div className="text-xs text-muted">مشاهدة</div>
                      </div>
                      <div
                        className="bg-space-900 p-4 rounded-xl border border-space-700 cursor-pointer hover:bg-space-800 transition-colors"
                        onClick={() => setActiveDetailTab("COMMENTS")}
                      >
                        <MessageSquare
                          size={24}
                          className="mx-auto mb-2 text-green-400"
                        />
                        <div className="text-2xl font-bold text-main">
                          {viewingFileDetails.comments?.length || 0}
                        </div>
                        <div className="text-xs text-muted">تعليق</div>
                      </div>
                    </div>
                    {viewingFileDetails.description && (
                      <div className="bg-space-900 p-4 rounded-xl border border-space-700">
                        <h4 className="font-bold text-main mb-2 text-sm">
                          الوصف
                        </h4>
                        <p className="text-sm text-slate-300 whitespace-pre-wrap">
                          {viewingFileDetails.description}
                        </p>
                      </div>
                    )}
                  </>
                )}
                {activeDetailTab === "VIEWERS" && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-main mb-3 text-sm flex items-center gap-2">
                      <Eye size={16} /> قائمة المشاهدين
                    </h4>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                      {viewRecords.filter(
                        (v) => v.fileId === viewingFileDetails.id,
                      ).length > 0 ? (
                        viewRecords
                          .filter((v) => v.fileId === viewingFileDetails.id)
                          .map((record, idx) => {
                            const student = users.find(
                              (u) => u.id === record.studentId,
                            );
                            return (
                              <div
                                key={idx}
                                className="bg-space-900 p-3 rounded-lg border border-space-700 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-space-800 flex items-center justify-center text-xs font-bold text-space-accent">
                                    {student?.name.charAt(0) || "?"}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-main">
                                      {student?.name || "مستخدم محذوف"}
                                    </p>
                                    <p className="text-[10px] text-muted">
                                      {student?.phone || "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        <p className="text-muted text-xs text-center py-4">
                          لا توجد مشاهدات مسجلة
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {activeDetailTab === "COMMENTS" && (
                  <div>
                    <h4 className="font-bold text-main mb-3 text-sm flex items-center gap-2">
                      <MessageSquare size={16} /> كل التعليقات
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                      {viewingFileDetails.comments &&
                      viewingFileDetails.comments.length > 0 ? (
                        viewingFileDetails.comments
                          .slice()
                          .reverse()
                          .map((c) => (
                            <div
                              key={c.id}
                              className="bg-space-900 p-3 rounded-lg border border-space-700"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-space-accent text-xs">
                                  {c.userName}
                                </span>
                                <span className="text-[10px] text-muted">
                                  {c.createdAt
                                    ? new Date(c.createdAt).toLocaleDateString(
                                        "ar-EG",
                                      )
                                    : "غير محدد"}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300">
                                {c.content}
                              </p>
                            </div>
                          ))
                      ) : (
                        <p className="text-muted text-xs text-center py-4">
                          لا توجد تعليقات
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Draggable>
        </div>
      )}
      {/* Form modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <Draggable handle=".modal-handle">
            <div className="bg-space-800 rounded-2xl border border-space-700 w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-scale">
              <div className="modal-handle cursor-move p-6 border-b border-space-700 flex justify-between items-center bg-space-800 z-10 shrink-0 rounded-t-2xl">
                <h2 className="text-xl font-bold text-main">
                  {editingItem ? t("edit") : t("addFile")}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted hover:text-white shrink-0"
                >
                  <X size={24} />
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1"
              >
                <div>
                  <label className="text-sm text-muted block mb-1">
                    العنوان
                  </label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-space-900 border border-space-700 rounded p-2 text-main focus:border-space-accent outline-none"
                  />
                </div>

                {(activeTab === "SECTIONS" || activeTab === "SUBJECTS") && (
                  <div>
                    <label className="text-sm text-muted block mb-1">
                      {t("coverImage")}
                    </label>
                    <p className="text-[10px] text-space-accent mb-2 font-bold">
                      {t("recommendedImageSize")}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 bg-space-900 border border-space-700 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={24} className="text-muted" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                          id="upload-image"
                          disabled={isProcessingFile}
                        />
                        <label
                          htmlFor="upload-image"
                          className="bg-space-900 text-sm font-bold text-main border border-space-700 px-4 py-2 rounded-lg cursor-pointer hover:border-space-accent hover:text-white transition-colors inline-block text-center w-full"
                        >
                          {selectedImageFile
                            ? selectedImageFile.name
                            : "اختر صورة من الجهاز"}
                        </label>
                        {(imageUrl || selectedImageFile) && (
                          <button
                            type="button"
                            onClick={() => {
                              setImageUrl("");
                              setSelectedImageFile(null);
                            }}
                            className="text-xs text-red-400 font-bold mt-2 hover:underline"
                          >
                            إزالة الصورة
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm text-muted block mb-1">
                          لون النص والظل
                        </label>
                        <div className="flex items-center gap-2 bg-space-900 border border-space-700 rounded p-1">
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-full bg-transparent text-main outline-none text-sm uppercase"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted block mb-1">
                          حجم القسم/المادة
                        </label>
                        <select
                          value={cardSize}
                          onChange={(e) =>
                            setCardSize(e.target.value as "normal" | "large")
                          }
                          className="w-full bg-space-900 border border-space-700 rounded p-2 text-main focus:border-space-accent outline-none"
                        >
                          <option value="normal">حجم عادي</option>
                          <option value="large">حجم كبير</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted block mb-1">
                          شدة التوهج ({glowIntensity})
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          value={glowIntensity}
                          onChange={(e) =>
                            setGlowIntensity(parseInt(e.target.value))
                          }
                          className="w-full accent-space-accent"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted block mb-1">
                          لون نص (عدد المواد)
                        </label>
                        <div className="flex items-center gap-2 bg-space-900 border border-space-700 rounded p-1">
                          <input
                            type="color"
                            value={countTextColor}
                            onChange={(e) => setCountTextColor(e.target.value)}
                            className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={countTextColor}
                            onChange={(e) => setCountTextColor(e.target.value)}
                            className="w-full bg-transparent text-main outline-none text-sm uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "SUBJECTS" && (
                  <div>
                    <label className="text-sm text-muted block mb-1">
                      القسم التابع له
                    </label>
                    <select
                      required
                      value={sectionId}
                      onChange={(e) => setSectionId(e.target.value)}
                      className="w-full bg-space-900 border border-space-700 rounded p-2 text-main focus:border-space-accent outline-none"
                    >
                      <option value="">اختر القسم</option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {activeTab === "FILES" && (
                  <>
                    <div>
                      <label className="text-sm text-muted block mb-1">
                        المادة
                      </label>
                      <select
                        required
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        className="w-full bg-space-900 border border-space-700 rounded p-2 text-main focus:border-space-accent outline-none"
                      >
                        <option value="">اختر المادة</option>
                        {subjects.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-muted block mb-1">
                        الوصف (اختياري)
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-20 bg-space-900 border border-space-700 rounded p-2 text-main focus:border-space-accent outline-none resize-none"
                        placeholder="اكتب تفاصيل الملف..."
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted block mb-1">
                        نوع الملف
                      </label>
                      <select
                        value={fileType}
                        onChange={(e) => {
                          setFileType(e.target.value as FileType);
                        }}
                        className="w-full bg-space-900 border border-space-700 rounded p-2 text-main focus:border-space-accent outline-none"
                      >
                        <option value={FileType.PDF}>PDF</option>
                        <option value={FileType.TEXT}>نص</option>
                        <option value={FileType.IMAGE}>صورة</option>
                        <option value={FileType.VIDEO}>فيديو</option>
                        <option value={FileType.AUDIO}>صوت</option>
                      </select>
                    </div>
                    {fileType === FileType.TEXT ? (
                      <div>
                        <label className="text-sm text-muted block mb-1">
                          المحتوى النصي
                        </label>
                        <textarea
                          required
                          value={contentUrl}
                          onChange={(e) => setContentUrl(e.target.value)}
                          className="w-full h-32 bg-space-900 border border-space-700 rounded p-2 text-main focus:border-space-accent outline-none"
                          placeholder="اكتب النص هنا..."
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="text-sm text-muted block mb-1">
                            رابط المحتوى (URL)
                          </label>
                          <input
                            value={
                              contentUrl.startsWith("data:") ? "" : contentUrl
                            }
                            onChange={(e) => setContentUrl(e.target.value)}
                            className="w-full bg-space-900 border border-space-700 rounded p-2 text-main focus:border-space-accent outline-none dir-ltr"
                            placeholder="https://..."
                          />
                        </div>
                        <div className="relative mt-2">
                          <label
                            className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-space-900 transition-colors ${isProcessingFile ? "border-space-accent opacity-50 cursor-not-allowed" : "border-space-700 hover:border-space-accent hover:bg-space-800"}`}
                          >
                            {isProcessingFile ? (
                              <div className="flex flex-col items-center text-space-accent">
                                <Loader2
                                  size={24}
                                  className="animate-spin mb-1"
                                />
                                <p className="text-xs">جاري الرفع...</p>
                              </div>
                            ) : fileName ||
                              (editingItem &&
                                contentUrl &&
                                !contentUrl.startsWith("data:")) ? (
                              <div className="flex flex-col items-center text-green-400">
                                <CheckCircle size={24} className="mb-1" />
                                <p className="text-xs font-bold truncate max-w-[200px]">
                                  {fileName || "ملف محفوظ"}
                                </p>
                                <p className="text-[10px] text-muted mt-0.5">
                                  اضغط للتغيير
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-muted">
                                <UploadCloud size={24} className="mb-1" />
                                <p className="text-xs font-bold">
                                  رفع ملف محلي
                                </p>
                              </div>
                            )}
                            <input
                              type="file"
                              className="hidden"
                              onChange={handleFileChange}
                              accept={
                                fileType === FileType.PDF
                                  ? ".pdf"
                                  : fileType === FileType.VIDEO
                                    ? "video/*"
                                    : fileType === FileType.IMAGE
                                      ? "image/*"
                                      : fileType === FileType.AUDIO
                                        ? "audio/*"
                                        : "*"
                              }
                              disabled={isProcessingFile}
                            />
                          </label>
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="prevDl"
                        checked={preventDownload}
                        onChange={(e) => setPreventDownload(e.target.checked)}
                        className="accent-space-accent"
                      />
                      <label
                        htmlFor="prevDl"
                        className="text-sm text-muted cursor-pointer"
                      >
                        منع التحميل
                      </label>
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  disabled={isProcessingFile}
                  className="w-full bg-space-accent text-space-900 font-bold py-3 rounded-lg hover:bg-yellow-400 mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessingFile ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />{" "}
                      {t("pleaseWait")}
                    </>
                  ) : (
                    t("save")
                  )}
                </button>
              </form>
            </div>
          </Draggable>
        </div>
      )}
    </div>
  );
};
