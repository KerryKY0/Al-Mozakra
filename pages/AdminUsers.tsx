import React, { useState } from "react";
import { useStore } from "../services/store";
import { UserRole, User } from "../types";
import {
  Users,
  Shield,
  Plus,
  Edit,
  Trash2,
  Bell,
  RefreshCw,
  Upload,
  Download,
  Search,
  Filter,
  Info,
  X,
  CheckCircle,
  Ban,
  AlertTriangle,
  Wand2,
  Save,
  Send,
  SendHorizontal,
  User as UserIcon,
  Loader2,
  XCircle,
} from "lucide-react";
import { useI18n } from "../services/i18n";
import Draggable from "react-draggable";
import { TabButton, PermissionDenied } from "../components/AdminShared";

export const AdminUsers: React.FC = () => {
  const { t, lang } = useI18n();
  const {
    users,
    currentUser,
    deleteUser,
    updateUser,
    sections,
    registerStudent,
    registerSubAdmin,
    showToast,
    formatTime,
    exportUsersToCSV,
    importUsers,
    globalPasswordLength,
    passwordPrefix,
    enablePrefixInAuto,
    generateAlphanumericPasswords,
    phoneNumberLength,
    forceFullDataUpdateAll,
    toggleForceUpdateUser,
    sendNotification,
    broadcastNotification,
    triggerPermissionError,
  } = useStore();
  const [viewMode, setViewMode] = useState<"STUDENTS" | "DEVS">("STUDENTS");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterType, setFilterType] = useState<
    "ALL" | "DUPLICATE" | "COMPLETED" | "INCOMPLETE" | "LOGGED_IN" | "NEVER"
  >("ALL");

  // Notifications
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");

  // User Details Modal
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Incomplete Details Modal
  const [showIncompleteDetails, setShowIncompleteDetails] = useState<
    string[] | null
  >(null);

  // Confirm Modals
  const [showForceUpdateConfirm, setShowForceUpdateConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role: UserRole.STUDENT,
    sectionId: "",
    permissions: {
      canManageContent: false,
      canManageStudents: false,
      canViewStats: false,
      canAccessSettings: false,
      canManageSubAdmins: false,
      canManageCodes: false,
    },
  });

  const checkPermission = (actionType: "STUDENTS" | "SUB_ADMINS") => {
    if (currentUser?.role === UserRole.ADMIN) return true;
    if (currentUser?.role === UserRole.SUB_ADMIN) {
      if (
        actionType === "STUDENTS" &&
        currentUser.permissions?.canManageStudents
      )
        return true;
      if (
        actionType === "SUB_ADMINS" &&
        currentUser.permissions?.canManageSubAdmins
      )
        return true;
    }
    triggerPermissionError();
    return false;
  };

  const getIncompleteFields = (user: User | null | undefined) => {
    const issues: string[] = [];
    if (!user) return issues;

    if (user.role === UserRole.STUDENT) {
      const name = user.name || "";
      const nameParts = name.trim().split(/\s+/);
      if (!name || nameParts.length < 3) issues.push(t("incompleteName"));
      if (!user.sectionId) issues.push(t("sectionNotSpecified"));
    }
    return issues;
  };

  const getUserStatus = (
    user: User | null | undefined,
  ): "COMPLETE" | "INCOMPLETE" => {
    if (!user) return "COMPLETE";
    return getIncompleteFields(user).length > 0 ? "INCOMPLETE" : "COMPLETE";
  };

  let filteredUsers = users.filter((u) => {
    if (!u) return false;
    const isTargetRole =
      viewMode === "STUDENTS"
        ? u.role === UserRole.STUDENT
        : u.role === UserRole.ADMIN || u.role === UserRole.SUB_ADMIN;
    const name = u.name || "";
    const phone = u.phone || "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search);

    // Hide Main Admin from Sub-Admins list
    if (viewMode === "DEVS" && u.role === UserRole.ADMIN) return false;

    return isTargetRole && matchesSearch;
  });

  if (filterType === "DUPLICATE") {
    const nameMap = new Map<string, number>();
    users.forEach((u) => nameMap.set(u.name, (nameMap.get(u.name) || 0) + 1));
    filteredUsers = filteredUsers.filter((u) => (nameMap.get(u.name) || 0) > 1);
  } else if (filterType === "COMPLETED") {
    filteredUsers = filteredUsers.filter(
      (u) => getUserStatus(u) === "COMPLETE",
    );
  } else if (filterType === "INCOMPLETE") {
    filteredUsers = filteredUsers.filter(
      (u) => getUserStatus(u) === "INCOMPLETE",
    );
  } else if (filterType === "LOGGED_IN") {
    filteredUsers = filteredUsers.filter((u) => u.lastLogin !== null);
  } else if (filterType === "NEVER") {
    filteredUsers = filteredUsers.filter((u) => u.lastLogin === null);
  }

  const generatePass = () => {
    let pass = "";
    if (enablePrefixInAuto && passwordPrefix) {
      const remaining = Math.max(
        0,
        globalPasswordLength - passwordPrefix.length,
      );
      let randomPart = "";
      if (generateAlphanumericPasswords) {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < remaining; i++) {
          randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      } else {
        randomPart = Math.floor(Math.random() * 10 ** remaining)
          .toString()
          .padStart(remaining, "0");
      }
      pass = passwordPrefix + randomPart;
    } else {
      if (generateAlphanumericPasswords) {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < globalPasswordLength; i++) {
          pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      } else {
        pass = Math.floor(Math.random() * 10 ** globalPasswordLength)
          .toString()
          .padStart(globalPasswordLength, "0");
      }
    }
    setFormData((prev) => ({
      ...prev,
      password: pass.substring(0, globalPasswordLength),
    }));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkPermission("STUDENTS")) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const csvText = evt.target?.result as string;
      const lines = csvText.split("\n").slice(1);
      const newUsers: User[] = [];
      lines.forEach((line) => {
        const cols = line.split(",");
        if (cols.length >= 3) {
          const name = cols[0]?.trim();
          const phone = cols[1]?.trim();
          const password = cols[2]?.trim();
          const sectionName = cols[4]?.trim();
          const sectionId =
            sections.find((s) => s.title === sectionName)?.id || "";
          if (name && phone && password) {
            newUsers.push({
              id: Math.random().toString(36).substr(2, 9),
              name,
              phone,
              password,
              role: UserRole.STUDENT,
              sectionId,
              createdAt: new Date().toISOString(),
              lastLogin: null,
              isSuspended: false,
            });
          }
        }
      });
      importUsers(newUsers);
      showToast(t("userImportSuccess"));
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === "ADD") {
        if (formData.role === UserRole.STUDENT) {
          await registerStudent(
            formData.name,
            formData.phone,
            formData.password,
            formData.sectionId,
            "",
            true,
          );
        } else {
          await registerSubAdmin(
            formData.name,
            formData.phone,
            formData.password,
            formData.permissions,
          );
        }
        showToast(t("userAddedSuccess"));
      } else if (modalMode === "EDIT" && selectedUser) {
        const updates: Partial<User> = { name: formData.name };
        if (formData.phone !== selectedUser.phone) {
          updates.phone = formData.phone;
        }
        if (formData.password) updates.password = formData.password;
        if (selectedUser.role === UserRole.STUDENT)
          updates.sectionId = formData.sectionId;
        if (selectedUser.role === UserRole.SUB_ADMIN)
          updates.permissions = formData.permissions;
        await updateUser(selectedUser.id, updates);
        showToast(t("userUpdatedSuccess"));
      }
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSendNotif = () => {
    if (!checkPermission("STUDENTS")) return;
    if (!selectedUser || !notifMessage.trim()) return;
    sendNotification(selectedUser.id, notifMessage);
    setShowNotifModal(false);
    setNotifMessage("");
    showToast(t("notifSent"));
  };

  const handleBroadcastNotif = () => {
    if (!checkPermission("STUDENTS")) return;
    if (!notifMessage.trim()) return;
    broadcastNotification(notifMessage);
    setShowBroadcastModal(false);
    setNotifMessage("");
    showToast(t("notifSentAll"));
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
      showToast(t("deleteSuccess"));
    }
  };

  const handleSuspendUser = () => {
    if (userToSuspend) {
      updateUser(userToSuspend.id, { isSuspended: !userToSuspend.isSuspended });
      showToast(
        userToSuspend.isSuspended
          ? t("accountActivated")
          : t("accountSuspended"),
      );
      setUserToSuspend(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      password: "",
      role: viewMode === "STUDENTS" ? UserRole.STUDENT : UserRole.SUB_ADMIN,
      sectionId: "",
      permissions: {
        canManageContent: false,
        canManageStudents: false,
        canViewStats: false,
        canAccessSettings: false,
        canManageSubAdmins: false,
        canManageCodes: false,
      },
    });
    setSelectedUser(null);
  };

  const handleEdit = (user: User) => {
    const type = user.role === UserRole.STUDENT ? "STUDENTS" : "SUB_ADMINS";
    if (!checkPermission(type)) return;

    setSelectedUser(user);
    setModalMode("EDIT");
    setFormData({
      name: user.name,
      phone: user.phone,
      password: "",
      role: user.role,
      sectionId: user.sectionId || "",
      permissions: user.permissions || {
        canManageContent: false,
        canManageStudents: false,
        canViewStats: false,
        canAccessSettings: false,
        canManageSubAdmins: false,
        canManageCodes: false,
      },
    });
    setShowModal(true);
  };

  const handleAddClick = () => {
    const type = viewMode === "STUDENTS" ? "STUDENTS" : "SUB_ADMINS";
    if (!checkPermission(type)) return;

    resetForm();
    setModalMode("ADD");
    setFormData((prev) => ({
      ...prev,
      role: viewMode === "STUDENTS" ? UserRole.STUDENT : UserRole.SUB_ADMIN,
    }));
    setShowModal(true);
  };

  return (
    <div className="space-y-8 animate-fade-in relative stagger-children">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl lg:text-4xl font-black text-white text-glow tracking-tighter">
          {t("userManagement")}
        </h1>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {viewMode === "STUDENTS" && (
            <>
              <button
                onClick={() =>
                  checkPermission("STUDENTS") && setShowForceUpdateConfirm(true)
                }
                className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2.5 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 text-xs active:scale-95 shadow-lg shadow-red-900/20"
              >
                <RefreshCw size={16} />{" "}
                <span className="hidden sm:inline">{t("forceUpdateAll")}</span>
              </button>
              <button
                onClick={() =>
                  checkPermission("STUDENTS") && setShowBroadcastModal(true)
                }
                className="bg-space-accent/10 border border-space-accent text-space-accent px-4 py-2.5 rounded-xl font-bold hover:bg-space-accent hover:text-space-900 transition-all flex items-center justify-center gap-2 text-xs active:scale-95 shadow-lg shadow-space-accent/20"
              >
                <Bell size={16} />{" "}
                <span className="hidden sm:inline">{t("broadcastNotif")}</span>
              </button>
              <label className="glass-card text-white px-4 py-2.5 rounded-xl font-bold hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/10 text-xs active:scale-95">
                <Upload size={16} />{" "}
                <span className="hidden sm:inline">{t("import")}</span>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleImport}
                />
              </label>
              <button
                onClick={() =>
                  checkPermission("STUDENTS") &&
                  exportUsersToCSV(UserRole.STUDENT)
                }
                className="glass-card text-white px-4 py-2.5 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10 text-xs active:scale-95"
              >
                <Download size={16} />{" "}
                <span className="hidden sm:inline">{t("export")}</span>
              </button>
            </>
          )}
          <button
            onClick={handleAddClick}
            className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-black hover:bg-green-500 transition-all flex items-center justify-center gap-2 text-sm shadow-xl shadow-green-900/30 active:scale-95"
          >
            <Plus size={18} />{" "}
            {viewMode === "STUDENTS" ? t("addStudent") : t("addDev")}
          </button>
        </div>
      </div>

      <div className="glass-card p-4 rounded-2xl border-white/10 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5 w-full lg:w-auto">
          <TabButton
            active={viewMode === "STUDENTS"}
            onClick={() => {
              setViewMode("STUDENTS");
              setFilterType("ALL");
            }}
            label={t("students")}
            icon={Users}
          />
          <TabButton
            active={viewMode === "DEVS"}
            onClick={() => {
              setViewMode("DEVS");
              setFilterType("ALL");
            }}
            label={t("subDevs")}
            icon={Shield}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
          <div className="relative w-full sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm font-bold outline-none focus:border-space-accent appearance-none pr-10 hover:bg-black/60 transition-all"
            >
              <option value="ALL" className="bg-space-900">
                {t("all")}
              </option>
              <option value="DUPLICATE" className="bg-space-900">
                {t("duplicate")}
              </option>
              {viewMode === "STUDENTS" && (
                <>
                  <option value="COMPLETED" className="bg-space-900">
                    {t("completionStatus")}
                  </option>
                  <option value="INCOMPLETE" className="bg-space-900">
                    {t("incompleteData")}
                  </option>
                  <option value="LOGGED_IN" className="bg-space-900">
                    {t("loggedInStatus")}
                  </option>
                  <option value="NEVER" className="bg-space-900">
                    {t("neverLoggedIn")}
                  </option>
                </>
              )}
            </select>
            <Filter
              className="absolute left-3 top-3.5 text-muted pointer-events-none"
              size={16}
            />
          </div>
          <div className="relative w-full sm:w-64">
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
                  {t("nameColumn")}
                </th>
                <th className="p-4 border-b border-white/5 uppercase tracking-tighter text-[10px]">
                  {t("phoneColumn")}
                </th>
                <th className="p-4 border-b border-white/5 uppercase tracking-tighter text-[10px] hidden sm:table-cell">
                  {viewMode === "STUDENTS" ? t("lastLogin") : t("permissions")}
                </th>
                {viewMode === "DEVS" && (
                  <th className="p-4 border-b border-white/5 uppercase tracking-tighter text-[10px] hidden sm:table-cell">
                    {t("lastLogin")}
                  </th>
                )}
                {viewMode === "STUDENTS" && (
                  <th className="p-4 border-b border-white/5 uppercase tracking-tighter text-[10px] hidden md:table-cell">
                    {t("statusColumn")}
                  </th>
                )}
                <th className="p-4 border-b border-white/5 uppercase tracking-tighter text-[10px] text-center">
                  {t("actionsColumn")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => {
                const status = getUserStatus(user);
                return (
                  <tr
                    key={user.id}
                    className={`transition-all group ${user.isSuspended ? "bg-red-900/10 border-l-2 border-red-500" : "hover:bg-white/5"}`}
                  >
                    <td className="p-4 flex justify-center">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-lg group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-space-accent font-black text-xs border border-white/10 group-hover:scale-110 transition-transform">
                          <UserIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-black text-white max-w-[150px] truncate">
                      {user.name}
                    </td>
                    <td className="p-4 text-muted dir-ltr font-mono font-bold">
                      {user.phone}
                    </td>
                    <td className="p-4 text-muted text-xs hidden sm:table-cell opacity-70">
                      {user.role === UserRole.STUDENT ? (
                        user.lastLogin ? (
                          formatTime(user.lastLogin)
                        ) : (
                          t("notLoggedIn")
                        )
                      ) : user.role === UserRole.SUB_ADMIN ? (
                        <span className="flex items-center gap-1 font-bold text-space-accent">
                          <Shield size={14} />{" "}
                          {
                            Object.values(user.permissions || {}).filter(
                              Boolean,
                            ).length
                          }
                        </span>
                      ) : (
                        <span className="font-black text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                          {t("full")}
                        </span>
                      )}
                    </td>
                    {viewMode === "DEVS" && (
                      <td className="p-4 text-muted text-xs hidden sm:table-cell opacity-70">
                        {user.lastLogin
                          ? formatTime(user.lastLogin)
                          : t("notLoggedIn")}
                      </td>
                    )}
                    {viewMode === "STUDENTS" && (
                      <td className="p-4 hidden md:table-cell">
                        {getUserStatus(user) === "COMPLETE" ? (
                          <span className="text-green-400 font-bold text-[10px] uppercase tracking-widest bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                            {t("complete")}
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              const issues = getIncompleteFields(user);
                              if (issues.length > 0)
                                setShowIncompleteDetails(issues);
                            }}
                            className="text-orange-400 font-bold text-[10px] uppercase tracking-widest bg-orange-400/10 px-2 py-1 rounded-full hover:bg-orange-400/20 transition-colors border border-orange-400/20"
                          >
                            {t("incomplete")}
                          </button>
                        )}
                      </td>
                    )}
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          checkPermission(
                            user.role === UserRole.STUDENT
                              ? "STUDENTS"
                              : "SUB_ADMINS",
                          ) && setViewingUser(user)
                        }
                        className="p-2 text-space-accent/70 hover:text-space-accent hover:bg-space-accent/10 rounded-xl transition-all active:scale-90"
                      >
                        <Info size={16} />
                      </button>
                      {user.role !== UserRole.ADMIN && (
                        <>
                          {user.role === UserRole.STUDENT && (
                            <>
                              <button
                                onClick={() =>
                                  checkPermission("STUDENTS") &&
                                  toggleForceUpdateUser(user.id)
                                }
                                className={`p-2 rounded-xl transition-all active:scale-90 ${user.forceFullDataUpdate || user.requiresDataUpdate ? "text-orange-400 bg-orange-400/10" : "text-slate-400 hover:text-white hover:bg-white/10"}`}
                              >
                                <RefreshCw
                                  size={16}
                                  className={
                                    user.forceFullDataUpdate ||
                                    user.requiresDataUpdate
                                      ? "animate-spin-slow"
                                      : ""
                                  }
                                />
                              </button>
                              <button
                                onClick={() => {
                                  if (checkPermission("STUDENTS")) {
                                    setSelectedUser(user);
                                    setShowNotifModal(true);
                                  }
                                }}
                                className="p-2 text-blue-400/70 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all active:scale-90"
                              >
                                <Bell size={16} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-indigo-400/70 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all active:scale-90"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() =>
                              checkPermission(
                                user.role === UserRole.STUDENT
                                  ? "STUDENTS"
                                  : "SUB_ADMINS",
                              ) && setUserToSuspend(user)
                            }
                            className={`p-2 rounded-xl transition-all active:scale-90 ${user.isSuspended ? "text-green-400 hover:bg-green-400/10" : "text-red-400/70 hover:text-red-400 hover:bg-red-400/10"}`}
                          >
                            {user.isSuspended ? (
                              <CheckCircle size={16} />
                            ) : (
                              <Ban size={16} />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              checkPermission(
                                user.role === UserRole.STUDENT
                                  ? "STUDENTS"
                                  : "SUB_ADMINS",
                              ) && setUserToDelete(user)
                            }
                            className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {userToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <Draggable>
            <div className="bg-space-800 rounded-2xl border border-red-500 w-full max-w-sm p-8 text-center animate-fade-in-scale cursor-move relative">
              <div className="bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">
                {t("confirmDeleteFinal")}
              </h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                {t("deleteConfirmDesc").replace("{name}", userToDelete.name)}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-black hover:bg-red-500"
                >
                  {t("yesDelete")}
                </button>
                <button
                  onClick={() => setUserToDelete(null)}
                  className="flex-1 bg-white/5 text-white py-3 rounded-2xl font-black hover:bg-white/10 border border-white/10"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </Draggable>
        </div>
      )}

      {userToSuspend && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <Draggable>
            <div className="bg-space-800 rounded-2xl border border-orange-500 w-full max-w-sm p-8 text-center animate-fade-in-scale cursor-move relative">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${userToSuspend.isSuspended ? "bg-green-500/20" : "bg-orange-500/20"}`}
              >
                <Ban
                  size={40}
                  className={
                    userToSuspend.isSuspended
                      ? "text-green-500"
                      : "text-orange-500"
                  }
                />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">
                {userToSuspend.isSuspended
                  ? t("confirmActivation")
                  : t("confirmSuspension")}
              </h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                {userToSuspend.isSuspended
                  ? t("activateConfirm").replace("{name}", userToSuspend.name)
                  : t("suspendConfirm").replace("{name}", userToSuspend.name)}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleSuspendUser}
                  className={`flex-1 text-white py-3 rounded-2xl font-black ${userToSuspend.isSuspended ? "bg-green-600 hover:bg-green-500" : "bg-orange-600 hover:bg-orange-500"}`}
                >
                  {userToSuspend.isSuspended
                    ? t("yesActivate")
                    : t("yesSuspend")}
                </button>
                <button
                  onClick={() => setUserToSuspend(null)}
                  className="flex-1 bg-white/5 text-white py-3 rounded-2xl font-black hover:bg-white/10 border border-white/10"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </Draggable>
        </div>
      )}

      {showIncompleteDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <Draggable>
            <div className="bg-space-800 rounded-2xl border border-orange-500 w-full max-w-sm p-8 text-center animate-fade-in-scale cursor-move relative">
              <div className="bg-orange-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} className="text-orange-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">
                {t("missingFields")}
              </h3>
              <ul className="text-slate-300 text-sm mb-8 space-y-3 font-bold text-center bg-black/20 p-4 rounded-xl">
                {showIncompleteDetails.map((issue, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 justify-center"
                  >
                    <XCircle size={14} className="text-orange-400" /> {issue}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowIncompleteDetails(null)}
                className="w-full bg-orange-600 text-white py-3 rounded-2xl font-black hover:bg-orange-500"
              >
                {t("close")}
              </button>
            </div>
          </Draggable>
        </div>
      )}

      {showForceUpdateConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in pointer-events-auto">
          <Draggable>
            <div className="bg-space-800 rounded-3xl border border-red-500/50 w-full max-w-sm shadow-2xl p-8 text-center animate-fade-in-scale cursor-move relative">
              <div className="bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw
                  size={40}
                  className="text-red-500 animate-spin-slow"
                />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">
                {t("confirmForceUpdateAll")}
              </h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed font-bold">
                {t("forceUpdateAllDesc")}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    forceFullDataUpdateAll();
                    setShowForceUpdateConfirm(false);
                  }}
                  className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-black hover:bg-red-500 shadow-xl shadow-red-900/40 active:scale-95"
                >
                  {t("yesExecute")}
                </button>
                <button
                  onClick={() => setShowForceUpdateConfirm(false)}
                  className="flex-1 bg-white/5 text-white py-3 rounded-2xl font-black hover:bg-white/10 border border-white/10 active:scale-95"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </Draggable>
        </div>
      )}

      {viewingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <Draggable handle=".modal-handle">
            <div className="bg-space-800 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-scale flex flex-col max-h-[90vh]">
              <div className="modal-handle cursor-move p-6 relative bg-gradient-to-br from-black/80 to-black/50 border-b border-white/5 flex-shrink-0">
                <button
                  onClick={() => setViewingUser(null)}
                  className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"
                >
                  <X size={20} />
                </button>
                <div className="flex flex-col items-center">
                  {viewingUser.avatarUrl ? (
                    <img
                      src={viewingUser.avatarUrl}
                      className="w-28 h-28 rounded-full object-cover border-4 border-space-accent shadow-[0_0_20px_rgba(253,184,19,0.3)] mb-4"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-black flex items-center justify-center text-space-accent text-5xl font-black mb-4 border-4 border-space-accent shadow-[0_0_20px_rgba(253,184,19,0.3)]">
                      <UserIcon size={48} />
                    </div>
                  )}
                  <h2 className="text-2xl font-black text-white">
                    {viewingUser.name}
                  </h2>
                  <span
                    className={`text-[10px] uppercase font-black tracking-widest mt-2 px-3 py-1 rounded-full border ${viewingUser.isSuspended ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}
                  >
                    {viewingUser.isSuspended ? t("suspended") : t("active")}
                  </span>
                </div>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar bg-black/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    [t("nameColumn"), viewingUser.name],
                    [t("phoneColumn"), viewingUser.phone],
                    [t("password"), viewingUser.password],
                    [
                      viewingUser.role === UserRole.SUB_ADMIN
                        ? t("permissions")
                        : t("section"),
                      viewingUser.role === UserRole.STUDENT
                        ? sections.find((s) => s.id === viewingUser.sectionId)
                            ?.title || "-"
                        : viewingUser.role === UserRole.SUB_ADMIN
                          ? Object.keys(viewingUser.permissions || {}).filter(
                              (k) => (viewingUser.permissions as any)[k],
                            ).length
                          : "-",
                    ],
                    [
                      t("gender"),
                      viewingUser.gender === "MALE"
                        ? t("male")
                        : viewingUser.gender === "FEMALE"
                          ? t("female")
                          : "-",
                    ],
                    [t("birthDate"), viewingUser.birthDate || "-"],
                    [
                      t("joinDate"),
                      viewingUser.createdAt
                        ? formatTime(viewingUser.createdAt)
                        : "-",
                    ],
                    [
                      t("lastActive"),
                      viewingUser.lastLogin
                        ? formatTime(viewingUser.lastLogin)
                        : t("notLoggedIn"),
                    ],
                  ].map(([label, value], i) => (
                    <div
                      key={i}
                      className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-1 transition-all hover:bg-white/10"
                    >
                      <span className="text-muted text-[10px] font-black uppercase tracking-widest opacity-60">
                        {label as any}
                      </span>
                      <span className="text-white font-bold text-sm truncate">
                        {value as any}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Draggable>
        </div>
      )}

      {showNotifModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <Draggable handle=".modal-handle">
            <div className="bg-space-800 rounded-3xl border border-blue-500/30 w-full max-w-sm p-8 animate-fade-in-scale relative">
              <div className="modal-handle cursor-move flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2.5 rounded-xl">
                    <Bell className="text-blue-400" size={22} />
                  </div>{" "}
                  {t("sendNotification")}
                </h3>
                <button
                  onClick={() => setShowNotifModal(false)}
                  className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-muted mb-4 bg-blue-500/5 px-4 py-2 rounded-xl border border-blue-500/10 font-bold">
                {t("to")}:{" "}
                <span className="text-blue-400">{selectedUser.name}</span>
              </p>
              <textarea
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 h-36 resize-none mb-6 placeholder:opacity-30 font-bold transition-all"
                placeholder={t("typeNotifHere")}
              />
              <button
                onClick={handleSendNotif}
                disabled={!notifMessage.trim()}
                className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-black hover:bg-blue-500 disabled:opacity-30 transition-all shadow-xl shadow-blue-900/40 active:scale-95 flex items-center justify-center gap-2"
              >
                <Send size={18} /> {t("send")}
              </button>
            </div>
          </Draggable>
        </div>
      )}

      {showBroadcastModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <Draggable handle=".modal-handle">
            <div className="bg-space-800 rounded-3xl border border-space-accent/30 w-full max-w-sm p-8 animate-fade-in-scale relative flex flex-col">
              <div className="modal-handle cursor-move flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <div className="bg-space-accent/20 p-2.5 rounded-xl">
                    <Bell className="text-space-accent" size={22} />
                  </div>{" "}
                  {t("notifyAll")}
                </h3>
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-muted mb-4 bg-space-accent/5 px-4 py-2 rounded-xl border border-space-accent/10 font-bold">
                {t("notifAllDesc")}
              </p>
              <textarea
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-space-accent h-36 resize-none mb-6 placeholder:opacity-30 font-bold transition-all"
                placeholder={t("typeNotifHere")}
              />
              <button
                onClick={handleBroadcastNotif}
                disabled={!notifMessage.trim()}
                className="w-full bg-space-accent text-space-900 py-3.5 rounded-2xl font-black hover:bg-yellow-400 disabled:opacity-30 transition-all shadow-xl shadow-space-accent/30 active:scale-95 flex items-center justify-center gap-2"
              >
                <SendHorizontal size={18} /> {t("sendToAll")}
              </button>
            </div>
          </Draggable>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pointer-events-auto">
          <Draggable handle=".modal-handle">
            <div className="bg-space-800 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl relative animate-fade-in-scale max-h-[90vh] flex flex-col">
              <div className="modal-handle cursor-move p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-space-800/80 backdrop-blur-xl z-20 shrink-0 rounded-t-3xl">
                <h2 className="text-2xl font-black text-white">
                  {modalMode === "ADD"
                    ? formData.role === UserRole.STUDENT
                      ? t("addNewStudent")
                      : t("addNewSubAdmin")
                    : t("details")}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2 opacity-60">
                    {t("fullName")}
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-white font-bold focus:border-space-accent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2 opacity-60">
                    {t("fieldUsernamePhone")}
                  </label>
                  <input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-white font-bold focus:border-space-accent outline-none dir-ltr text-right"
                    required
                  />
                </div>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2 opacity-60">
                      {modalMode === "EDIT" ? t("newPassword") : t("password")}
                    </label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-white font-bold focus:border-space-accent outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={generatePass}
                    className="bg-space-accent/20 p-3.5 rounded-2xl text-space-accent hover:bg-space-accent/30 active:scale-90 border border-space-accent/20"
                  >
                    <Wand2 size={20} />
                  </button>
                </div>
                {formData.role === UserRole.STUDENT && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2 opacity-60">
                      {t("studySection")}
                    </label>
                    <select
                      value={formData.sectionId}
                      onChange={(e) =>
                        setFormData({ ...formData, sectionId: e.target.value })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-white font-bold focus:border-space-accent outline-none"
                    >
                      <option value="" className="bg-space-900">
                        {t("chooseSectionOptional")}
                      </option>
                      {sections.map((s) => (
                        <option
                          key={s.id}
                          value={s.id}
                          className="bg-space-900"
                        >
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {formData.role === UserRole.SUB_ADMIN && (
                  <div className="space-y-3 mt-2">
                    <p className="font-black text-white text-sm border-b border-white/10 pb-3 flex items-center gap-2">
                      <Shield size={16} className="text-space-accent" />{" "}
                      {t("permissions")}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.keys(formData.permissions).map((key) => (
                        <label
                          key={key}
                          className="flex items-center gap-3 text-sm text-muted cursor-pointer hover:text-white bg-white/5 p-3 rounded-xl border border-white/5 hover:border-space-accent/30 transition-all"
                        >
                          <input
                            type="checkbox"
                            checked={(formData.permissions as any)[key]}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                permissions: {
                                  ...formData.permissions,
                                  [key]: e.target.checked,
                                },
                              })
                            }
                            className="accent-space-accent w-4 h-4"
                          />
                          <span className="font-bold text-[10px]">
                            {key === "canManageContent"
                              ? t("canManageContent")
                              : key === "canManageStudents"
                                ? t("canManageStudents")
                                : key === "canViewStats"
                                  ? t("canViewStats")
                                  : key === "canAccessSettings"
                                    ? t("canAccessSettings")
                                    : key === "canManageSubAdmins"
                                      ? t("canManageSubAdmins")
                                      : t("canManageCodes")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-space-accent text-space-900 font-black py-4 rounded-2xl hover:bg-yellow-400 mt-6 shadow-xl shadow-space-accent/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> {t("save")}
                </button>
              </form>
            </div>
          </Draggable>
        </div>
      )}
    </div>
  );
};
export default AdminUsers;
