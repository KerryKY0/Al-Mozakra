import React, { useState, Suspense } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider, useStore } from "./services/store";
import { I18nProvider, useI18n } from "./services/i18n";
import { UserRole, User } from "./types";
import Layout from "./components/Layout";

// ===== Lazy Loading للصفحات - تتحمل فقط عند الحاجة =====
const Landing = React.lazy(() => import("./pages/Landing"));
const Login = React.lazy(() => import("./pages/Auth").then(m => ({ default: m.Login })));
const Register = React.lazy(() => import("./pages/Auth").then(m => ({ default: m.Register })));
const DeveloperLogin = React.lazy(() => import("./pages/Auth").then(m => ({ default: m.DeveloperLogin })));
const StudentDashboard = React.lazy(() => import("./pages/StudentDashboard").then(m => ({ default: m.StudentDashboard })));
const SubjectFiles = React.lazy(() => import("./pages/StudentDashboard").then(m => ({ default: m.SubjectFiles })));
const FileViewer = React.lazy(() => import("./pages/FileViewer"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminUsers = React.lazy(() => import("./pages/AdminUsers").then(m => ({ default: m.AdminUsers })));
const AdminSettings = React.lazy(() => import("./pages/AdminSettings").then(m => ({ default: m.AdminSettings })));
const AdminCodes = React.lazy(() => import("./pages/AdminCodes").then(m => ({ default: m.AdminCodes })));
const AdminContent = React.lazy(() => import("./pages/AdminContent").then(m => ({ default: m.AdminContent })));
const ActivityLog = React.lazy(() => import("./pages/ActivityLog"));
const PostsPage = React.lazy(() => import("./pages/Posts"));
const StudentToolsPage = React.lazy(() => import("./pages/StudentToolsPage"));

// شاشة تحميل خفيفة للانتقال بين الصفحات
const PageLoader: React.FC = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
    flexDirection: "column",
    gap: "16px",
  }}>
    <div style={{
      width: "40px",
      height: "40px",
      border: "3px solid rgba(252,163,17,0.2)",
      borderTopColor: "#fca311",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }} />
    <p style={{ color: "#a0aec0", fontFamily: "Cairo", fontSize: "13px" }}>جاري التحميل...</p>
  </div>
);
import {
  Settings as SettingsIcon,
  User as UserIcon,
  Lock,
  Shield,
  Camera,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LogOut,
  Sun,
  Moon,
  Globe,
  ZoomIn,
  ZoomOut,
  Eye,
} from "lucide-react";

const Toast: React.FC = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-up">
      <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
        <CheckCircle2 size={20} />
        <span className="font-bold">{toastMessage}</span>
      </div>
    </div>
  );
};

const PermissionDeniedPopup: React.FC = () => {
  const { permissionError } = useStore();
  const { t } = useI18n();

  if (!permissionError) return null;

  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[100] animate-bounce-short">
      <div className="bg-space-900 text-white px-5 py-2 rounded-full shadow-2xl flex items-center gap-3 border border-red-500/50">
        <XCircle size={18} className="text-red-500" />
        <span className="text-sm font-bold">{t("permDeniedMsg")}</span>
      </div>
    </div>
  );
};

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}) => {
  const { currentUser } = useStore();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const UserProfile = () => {
  const { t, lang, setLang } = useI18n();
  const {
    currentUser,
    changePassword,
    updateUser,
    sections,
    showToast,
    requirePhoneVerification,
    setRequirePhoneVerification,
    verificationCodesEnabled,
    logout,
    theme,
    toggleTheme,
    zoomLevel,
    setZoomLevel,
  } = useStore();
  const [tab, setTab] = useState<"INFO" | "SECURITY" | "SETTINGS">("INFO");
  const [newPass, setNewPass] = useState("");
  const [isGrayscale, setIsGrayscale] = useState(false);

  const toggleGrayscale = () => {
    setIsGrayscale(!isGrayscale);
    document.body.classList.toggle("grayscale", !isGrayscale);
  };

  // Editable Fields
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    gender: currentUser?.gender || "",
    birthDate: currentUser?.birthDate || "",
    sectionId: currentUser?.sectionId || "",
  });
  const [verificationCode, setVerificationCode] = useState("");

  // Determine if phone is changed to require code
  const isPhoneChanged = editData.phone !== currentUser?.phone;

  const handleChangePass = () => {
    if (newPass) {
      changePassword(newPass);
      setNewPass("");
      showToast(t("passwordChanged"));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateUser(currentUser.id, { avatarUrl: base64String });
        showToast(t("picUpdated"));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!currentUser) return;

    if (isPhoneChanged && verificationCodesEnabled && !verificationCode) {
      alert(t("codeRequiredToChangePhone"));
      return;
    }

    try {
      const updates: Partial<User> = {
        name: editData.name,
        gender: editData.gender as "MALE" | "FEMALE" | undefined,
        birthDate: editData.birthDate,
        sectionId: editData.sectionId,
      };

      if (isPhoneChanged) {
        updates.phone = editData.phone;
      }

      await updateUser(
        currentUser.id,
        updates,
        isPhoneChanged && verificationCodesEnabled
          ? verificationCode
          : undefined,
      );

      setIsEditing(false);
      setVerificationCode("");
      showToast(t("changesSaved"));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Cancel edits
      setEditData({
        name: currentUser?.name || "",
        phone: currentUser?.phone || "",
        gender: currentUser?.gender || "",
        birthDate: currentUser?.birthDate || "",
        sectionId: currentUser?.sectionId || "",
      });
      setVerificationCode("");
      setIsEditing(false);
    } else {
      // Sync before editing
      setEditData({
        name: currentUser?.name || "",
        phone: currentUser?.phone || "",
        gender: currentUser?.gender || "",
        birthDate: currentUser?.birthDate || "",
        sectionId: currentUser?.sectionId || "",
      });
      setIsEditing(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex bg-space-800 rounded-lg p-1 mb-6 border border-space-700">
        <button
          onClick={() => setTab("INFO")}
          className={`flex-1 py-2 rounded-md transition-colors flex items-center justify-center gap-2 ${tab === "INFO" ? "bg-space-700 text-white font-bold" : "text-slate-400"}`}
        >
          <UserIcon size={18} /> {t("myData")}
        </button>
        <button
          onClick={() => setTab("SECURITY")}
          className={`flex-1 py-2 rounded-md transition-colors flex items-center justify-center gap-2 ${tab === "SECURITY" ? "bg-space-700 text-white font-bold" : "text-slate-400"}`}
        >
          <Shield size={18} /> {t("changePassword")}
        </button>
        <button
          onClick={logout}
          className="flex-1 py-2 rounded-md transition-colors flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={18} /> {t("logout")}
        </button>
      </div>

      <div className="bg-space-800 p-8 rounded-2xl border border-space-700 relative">
        {tab === "INFO" ? (
          <div className="space-y-6 animate-fade-in">
            <div className="absolute top-8 left-8">
              <button
                onClick={toggleEdit}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${isEditing ? "bg-red-500/10 text-red-400" : "bg-space-accent text-space-900"}`}
              >
                {isEditing ? (
                  t("cancel")
                ) : (
                  <>
                    <Edit2 size={16} /> {t("edit")}
                  </>
                )}
              </button>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group cursor-pointer">
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-space-700"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-space-900 flex items-center justify-center border-4 border-space-700 text-space-accent">
                    <UserIcon size={40} />
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={32} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <span className="text-xs text-muted mt-2">
                {t("changePhoto")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-space-900 p-4 rounded-lg">
                <label className="text-xs text-slate-500 block mb-1">
                  {t("fullName")}
                </label>
                {isEditing ? (
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full bg-space-800 border border-space-700 rounded p-2 text-main"
                  />
                ) : (
                  <div className="font-bold text-main">{currentUser?.name}</div>
                )}
              </div>

              <div className="bg-space-900 p-4 rounded-lg">
                <label className="text-xs text-slate-500 block mb-1">
                  {currentUser?.role === UserRole.STUDENT
                    ? t("phoneNumber")
                    : t("usernameOrPhone")}
                </label>
                {isEditing ? (
                  <input
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                    className="w-full bg-space-800 border border-space-700 rounded p-2 text-main dir-ltr text-right"
                  />
                ) : (
                  <div className="font-bold dir-ltr text-right text-main">
                    {currentUser?.phone}
                  </div>
                )}
              </div>

              <div className="bg-space-900 p-4 rounded-lg">
                <label className="text-xs text-slate-500 block mb-1">
                  {t("gender")}
                </label>
                {isEditing ? (
                  <select
                    value={editData.gender}
                    onChange={(e) =>
                      setEditData({ ...editData, gender: e.target.value })
                    }
                    className="w-full bg-space-800 border border-space-700 rounded p-2 text-main"
                  >
                    <option value="">{t("notSpecified")}</option>
                    <option value="MALE">{t("male")}</option>
                    <option value="FEMALE">{t("female")}</option>
                  </select>
                ) : (
                  <div className="font-bold text-main">
                    {currentUser?.gender === "MALE"
                      ? t("male")
                      : currentUser?.gender === "FEMALE"
                        ? t("female")
                        : t("notSpecified")}
                  </div>
                )}
              </div>

              <div className="bg-space-900 p-4 rounded-lg">
                <label className="text-xs text-slate-500 block mb-1">
                  {t("birthDate")}
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.birthDate}
                    onChange={(e) =>
                      setEditData({ ...editData, birthDate: e.target.value })
                    }
                    className="w-full bg-space-800 border border-space-700 rounded p-2 text-main"
                  />
                ) : (
                  <div className="font-bold text-main">
                    {currentUser?.birthDate || t("notSpecified")}
                  </div>
                )}
              </div>

              {currentUser?.role === UserRole.STUDENT && (
                <div className="bg-space-900 p-4 rounded-lg md:col-span-2">
                  <label className="text-xs text-slate-500 block mb-1">
                    {t("studySection")}
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.sectionId}
                      onChange={(e) =>
                        setEditData({ ...editData, sectionId: e.target.value })
                      }
                      className="w-full bg-space-800 border border-space-700 rounded p-2 text-main"
                    >
                      <option value="">{t("chooseSection")}</option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="font-bold text-main">
                      {sections.find((s) => s.id === currentUser?.sectionId)
                        ?.title || t("notSpecified")}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-space-900 p-4 rounded-lg">
                <label className="text-xs text-slate-500 block mb-1">
                  {t("joinDate")}
                </label>
                <div className="font-bold text-main">
                  {currentUser?.lastLogin
                    ? new Date(currentUser.createdAt).toLocaleString(
                        lang === "ar" ? "ar-EG" : "en-US",
                      )
                    : t("notLoggedIn")}
                </div>
              </div>
            </div>

            {/* Verification Code Input when Phone Changes */}
            {isEditing && isPhoneChanged && verificationCodesEnabled && (
              <div className="bg-space-900 p-4 rounded-lg border border-yellow-500/50 animate-fade-in-up">
                <label className="text-xs text-yellow-500 block mb-2 font-bold">
                  {t("codeRequired")}
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(
                      e.target.value.replace(/\D/g, "").slice(0, 4),
                    )
                  }
                  className="w-full bg-space-800 border border-space-700 rounded p-2 text-main text-center font-bold tracking-widest"
                  placeholder="****"
                  maxLength={4}
                />
                <p className="text-[10px] text-muted mt-1">
                  {t("newCodeRequired")}
                </p>
              </div>
            )}

            {isEditing && (
              <button
                onClick={handleSaveChanges}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500 transition-colors"
              >
                {t("saveChanges")}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-bold text-lg mb-4 text-main">
              {t("changePassword")}
            </h3>
            <div className="bg-space-900 p-4 rounded-lg border border-space-700">
              <label className="text-sm text-slate-400 block mb-2">
                {t("newPassword")}
              </label>
              <input
                type="text"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-space-800 border border-space-700 rounded p-3 text-main dir-ltr text-right"
                placeholder={t("enterNewPassword")}
              />
            </div>
            <button
              onClick={handleChangePass}
              disabled={!newPass}
              className="w-full bg-space-accent text-space-900 font-bold py-3 rounded-lg hover:bg-yellow-400 disabled:opacity-50"
            >
              {t("saveChange")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DisplaySettingsPage = () => {
  const { t, lang, setLang } = useI18n();
  const { logout, theme, toggleTheme, zoomLevel, setZoomLevel } = useStore();
  const [isGrayscale, setIsGrayscale] = useState(false);

  const toggleGrayscale = () => {
    setIsGrayscale(!isGrayscale);
    document.body.classList.toggle("grayscale", !isGrayscale);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-space-800 p-8 rounded-2xl border border-space-700">
        <h3 className="font-bold text-lg mb-6 text-main flex items-center gap-2">
          <Eye size={24} className="text-space-accent" />
          {t("view")}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 1.5))}
            className="bg-space-900 border border-space-700 hover:border-space-accent rounded-xl p-4 flex flex-col items-center gap-2 text-main transition-colors"
          >
            <ZoomIn size={24} className="text-blue-400" />
            <span className="text-sm font-bold">{t("zoomIn")}</span>
          </button>
          <button
            onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.8))}
            className="bg-space-900 border border-space-700 hover:border-space-accent rounded-xl p-4 flex flex-col items-center gap-2 text-main transition-colors"
          >
            <ZoomOut size={24} className="text-red-400" />
            <span className="text-sm font-bold">{t("zoomOut")}</span>
          </button>
          <button
            onClick={toggleGrayscale}
            className={`border rounded-xl p-4 flex flex-col items-center gap-2 transition-colors ${isGrayscale ? "bg-space-accent text-space-900 border-space-accent" : "bg-space-900 border-space-700 hover:border-space-accent text-main"}`}
          >
            <Eye
              size={24}
              className={isGrayscale ? "text-space-900" : "text-green-400"}
            />
            <span className="text-sm font-bold">{t("eyeComfort")}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="bg-space-900 border border-space-700 hover:border-space-accent rounded-xl p-4 flex flex-col items-center gap-2 text-main transition-colors"
          >
            {theme === "dark" ? (
              <Sun size={24} className="text-yellow-400" />
            ) : (
              <Moon size={24} />
            )}
            <span className="text-sm font-bold">{t("changeTheme")}</span>
          </button>
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="bg-space-900 border border-space-700 hover:border-space-accent rounded-xl p-4 flex flex-col items-center gap-2 text-main transition-colors"
          >
            <Globe size={24} className="text-purple-400" />
            <span className="text-sm font-bold">{t("languageFull")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  React.useEffect(() => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let modalElement: HTMLElement | null = null;
    let initialX = 0;
    let initialY = 0;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Ignore inputs, buttons, scrollbars, etc.
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "BUTTON" ||
        target.closest("button")
      ) {
        return;
      }

      // In this app, most modals are identified by .animate-fade-in-scale and have a wrapper background
      const modal = target.closest(".animate-fade-in-scale") as HTMLElement;
      if (modal && target.closest(".fixed.inset-0")) {
        isDragging = true;
        modalElement = modal;

        const style = window.getComputedStyle(modal);
        const matrix = new DOMMatrixReadOnly(style.transform);
        initialX = matrix.m41;
        initialY = matrix.m42;

        startX = e.clientX;
        startY = e.clientY;

        modal.style.transition = "none";
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modalElement) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      modalElement.style.transform = `translate(${initialX + dx}px, ${initialY + dy}px)`;
    };

    const onMouseUp = () => {
      if (isDragging && modalElement) {
        isDragging = false;
        modalElement.style.transition = "";
        modalElement = null;
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/developer-login" element={<DeveloperLogin />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="" element={<StudentDashboard />} />
                    <Route path="subject/:id" element={<SubjectFiles />} />
                    <Route path="file/:id" element={<FileViewer />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="display" element={<DisplaySettingsPage />} />
                    <Route path="posts" element={<PostsPage />} />
                    <Route path="tools" element={<StudentToolsPage />} />
                    <Route path="courses" element={<StudentDashboard />} />
                  </Routes>
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin/Sub-Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUB_ADMIN]}>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="content" element={<AdminContent />} />
                    <Route path="file/:id" element={<FileViewer />} />
                    <Route path="codes" element={<AdminCodes />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="activity" element={<ActivityLog />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="display" element={<DisplaySettingsPage />} />
                    <Route path="posts" element={<PostsPage />} />
                  </Routes>
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppProvider>
        <HashRouter>
          <AppContent />
          <Toast />
          <PermissionDeniedPopup />
        </HashRouter>
      </AppProvider>
    </I18nProvider>
  );
};

export default App;
