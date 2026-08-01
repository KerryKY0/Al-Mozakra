import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "./supabaseClient";
import {
  User,
  UserRole,
  Section,
  Subject,
  EducationalFile,
  Log,
  ViewRecord,
  FileType,
  Permission,
  SystemMessage,
  Notification,
  Comment,
  VerificationCode,
  ChatMessage,
  ChatSettings,
  Post,
  PostComment,
  ThemeColors,
} from "../types";
import { INITIAL_SECTIONS, INITIAL_SUBJECTS } from "../constants";
import { translateActionToEnglish } from "./AIService";

interface AppContextType {
  users: User[];
  currentUser: User | null;
  sections: Section[];
  subjects: Subject[];
  files: EducationalFile[];
  logs: Log[];
  viewRecords: ViewRecord[];
  verificationCodes: VerificationCode[];
  globalPasswordLength: number;
  phoneNumberLength: number;
  theme: "light" | "dark";
  passwordPrefix: string;
  enablePrefixInAuto: boolean; // For Passwords
  enablePrefixInCodes: boolean; // For Codes
  generateAlphanumericPasswords: boolean; // New Setting
  requirePhoneVerification: boolean; // New Setting
  verificationCodesEnabled: boolean; // New Setting
  systemMessage: SystemMessage;
  notifications: Notification[];
  toastMessage: string | null;
  permissionError: boolean; // New: Permission Error State
  otpApiToken: string;
  zoomLevel: number;
  timeFormat: "12" | "24";
  codeGetUrl: string;
  sidebarPosition: "top" | "bottom" | "left" | "right";
  musicUrl: string;
  musicEnabled: boolean;
  supportUrl: string;
  posts: Post[];
  codePrefix: string;

  themeColorsLight: ThemeColors;
  themeColorsDark: ThemeColors;
  setThemeColorsLight: (colors: ThemeColors) => void;
  setThemeColorsDark: (colors: ThemeColors) => void;
  boxGlowIntensity: string;
  setBoxGlowIntensity: (intensity: string) => void;
  zeroMaterialsColor: string;
  setZeroMaterialsColor: (color: string) => void;
  clearAllLogs: () => void;

  // Chat
  chatMessages: ChatMessage[];
  chatSettings: ChatSettings;
  sendChatMessage: (
    content: string,
    type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO",
    isAnonymous: boolean,
  ) => void;
  editChatMessage: (msgId: string, newContent: string) => void;
  deleteChatMessage: (msgId: string) => void;
  reactToMessage: (msgId: string, emoji: string) => void;
  markChatMessagesAsViewed: () => void; // New
  toggleChatLock: () => void;
  clearChat: () => void;
  toggleChatBan: (userId: string) => void; // New
  updateForbiddenWords: (words: string[]) => void; // New

  login: (
    phone: string,
    pass: string,
    allowedRoles?: UserRole[],
  ) => Promise<User>;
  logout: () => void;
  checkPhoneAvailability: (phone: string) => Promise<boolean>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtpCode: (phone: string, code: string) => Promise<boolean>;

  registerStudent: (
    name: string,
    phone: string,
    pass: string,
    sectionId: string,
    code: string,
    bypassValidation?: boolean,
  ) => Promise<void>;
  registerSubAdmin: (
    name: string,
    phone: string,
    pass: string,
    permissions: Permission,
  ) => Promise<void>;
  addUser: (user: User) => Promise<void>;
  importUsers: (users: User[]) => Promise<void>;
  updateUser: (
    id: string,
    updates: Partial<User>,
    code?: string,
  ) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  addFile: (file: EducationalFile) => void;
  updateFile: (id: string, updates: Partial<EducationalFile>) => void;
  deleteFile: (id: string) => void;
  logFileView: (fileId: string, studentId: string) => void;

  addComment: (fileId: string, content: string) => void;
  updateComment: (
    fileId: string,
    commentId: string,
    newContent: string,
  ) => void;
  deleteComment: (fileId: string, commentId: string) => void;

  addSection: (
    title: string,
    imageUrl?: string,
    textColor?: string,
    cardSize?: string,
    glowIntensity?: number,
    countTextColor?: string,
  ) => void;
  updateSection: (
    id: string,
    title: string,
    imageUrl?: string,
    textColor?: string,
    cardSize?: string,
    glowIntensity?: number,
    countTextColor?: string,
  ) => void;
  deleteSection: (id: string) => void;

  addSubject: (
    title: string,
    sectionId: string,
    imageUrl?: string,
    textColor?: string,
    cardSize?: string,
    glowIntensity?: number,
    countTextColor?: string,
  ) => void;
  updateSubject: (
    id: string,
    title: string,
    imageUrl?: string,
    textColor?: string,
    cardSize?: string,
    glowIntensity?: number,
    countTextColor?: string,
  ) => void;
  deleteSubject: (id: string) => void;

  setGlobalPasswordLength: (len: number) => void;
  setPhoneNumberLength: (len: number) => void;
  toggleTheme: () => void;
  setPasswordPrefix: (prefix: string) => void;
  setEnablePrefixInAuto: (enable: boolean) => void;
  setEnablePrefixInCodes: (enable: boolean) => void;
  setGenerateAlphanumericPasswords: (enable: boolean) => void; // New Setter
  setRequirePhoneVerification: (enable: boolean) => void; // New Setter
  setVerificationCodesEnabled: (enable: boolean) => void; // New Setter
  updateSystemMessage: (msg: SystemMessage) => void;
  changePassword: (newPass: string) => void;
  sendNotification: (userId: string, message: string) => void;
  broadcastNotification: (message: string) => void;
  markNotificationsRead: (userId: string) => void;
  completeUserProfile: (
    data: Partial<User>,
    password?: string,
    code?: string,
  ) => Promise<void>;
  forceFullDataUpdateAll: () => void;
  toggleForceUpdateUser: (userId: string) => void;
  setOtpApiToken: (token: string) => void;
  showToast: (msg: string) => void;
  triggerPermissionError: () => void;
  setZoomLevel: (level: number) => void;
  setSidebarPosition: (pos: "top" | "bottom" | "left" | "right") => void;
  setMusicUrl: (url: string) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setSupportUrl: (url: string) => void;
  addPost: (post: Post) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  addPostComment: (postId: string, content: string) => void;

  generateVerificationCodes: (
    count: number,
    length: number,
    isAlphanumeric: boolean,
  ) => void;
  validateAndUseCode: (
    code: string,
    userId?: string,
    actionType?: string,
  ) => boolean;
  deleteVerificationCode: (id: string) => void;
  deleteAllVerificationCodes: () => void;
  deleteUnusedVerificationCodes: () => void;
  deleteUsedVerificationCodes: () => void;

  exportCodesToCSV: () => void;
  exportUsersToCSV: (role: UserRole) => void;
  setTimeFormat: (format: "12" | "24") => void;
  setCodeGetUrl: (url: string) => void;
  setCodePrefix: (prefix: string) => void;
  formatTime: (dateStr: string) => string;
}

export const parseImageMeta = (raw: string | undefined) => {
  if (!raw)
    return {
      url: "",
      textColor: "#ffffff",
      cardSize: "normal" as "normal" | "large",
      glowIntensity: 0,
      countTextColor: "#cbd5e1",
    };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.url !== undefined) {
      return {
        url: parsed.url,
        textColor: parsed.textColor || "#ffffff",
        cardSize: (parsed.cardSize as "normal" | "large") || "normal",
        glowIntensity: parsed.glowIntensity || 0,
        countTextColor: parsed.countTextColor || "#cbd5e1",
      };
    }
  } catch (e) {}
  return {
    url: raw,
    textColor: "#ffffff",
    cardSize: "normal" as "normal" | "large",
    glowIntensity: 0,
    countTextColor: "#cbd5e1",
  };
};

export const stringifyImageMeta = (
  url: string,
  textColor: string,
  cardSize: string,
  glowIntensity: number,
  countTextColor: string,
) => {
  return JSON.stringify({
    url,
    textColor,
    cardSize,
    glowIntensity,
    countTextColor,
  });
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS as any);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS as any);
  const [files, setFiles] = useState<EducationalFile[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [viewRecords, setViewRecords] = useState<ViewRecord[]>([]);
  const [verificationCodes, setVerificationCodes] = useState<
    VerificationCode[]
  >([]);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    isLocked: false,
    hideUserNames: false,
    bannedUsers: [],
    forbiddenWords: [],
  });

  const [globalPasswordLength, setGlobalPasswordLength] = useState(6);
  const [phoneNumberLength, setPhoneNumberLength] = useState(11);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved === "light" || saved === "dark" ? saved : "dark";
    }
    return "dark";
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [passwordPrefix, setPasswordPrefix] = useState("");
  const [enablePrefixInAuto, setEnablePrefixInAuto] = useState(false);
  const [enablePrefixInCodes, setEnablePrefixInCodes] = useState(false);
  const [generateAlphanumericPasswords, setGenerateAlphanumericPasswords] =
    useState(false); // New State
  const [requirePhoneVerification, setRequirePhoneVerification] =
    useState(true); // New State
  const [verificationCodesEnabled, setVerificationCodesEnabled] =
    useState(true); // New State
  const [systemMessage, setSystemMessage] = useState<SystemMessage>({
    content: "",
    isActive: false,
    showAtLogin: false,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [otpApiToken, setOtpApiToken] = useState("");
  const [timeFormat, setTimeFormat] = useState<"12" | "24">("12");
  const [codeGetUrl, setCodeGetUrl] = useState("");
  const [codePrefix, setCodePrefix] = useState("");
  const [sidebarPosition, setSidebarPositionState] = useState<
    "top" | "bottom" | "left" | "right"
  >("right");
  const [musicUrl, setMusicUrlState] = useState("");
  const [musicEnabled, setMusicEnabledState] = useState(false);
  const [supportUrl, setSupportUrlState] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  // New states for customization
  const [themeColorsLight, setThemeColorsLightState] = useState<ThemeColors>({
    primary: "#fdb813",
    secondary: "#4ade80",
    background: "#f8fafc",
    card: "#ffffff",
    text: "#0f172a",
  });
  const [themeColorsDark, setThemeColorsDarkState] = useState<ThemeColors>({
    primary: "#fdb813",
    secondary: "#8b5cf6",
    background: "#0a0b10",
    card: "#13151f",
    text: "#ffffff",
  });
  const [boxGlowIntensity, setBoxGlowIntensityState] = useState("medium");
  const [zeroMaterialsColor, setZeroMaterialsColorState] = useState("#ef4444");

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [
          { data: usersData },
          { data: sectionsData },
          { data: subjectsData },
          { data: filesData },
          { data: logsData },
          { data: codesData },
          { data: chatMessagesData },
          { data: commentsData },
          { data: settingsData },
        ] = await Promise.all([
          supabase.from("users").select("*"),
          supabase.from("sections").select("*"),
          supabase.from("subjects").select("*"),
          supabase.from("files").select("*"),
          supabase
            .from("logs")
            .select("*")
            .order("timestamp", { ascending: false }),
          supabase.from("verification_codes").select("*"),
          supabase
            .from("chat_messages")
            .select("*")
            .order("timestamp", { ascending: true }),
          supabase
            .from("comments")
            .select("*")
            .order("created_at", { ascending: true }),
          supabase.from("settings").select("*"),
        ]);

        if (settingsData && settingsData.length > 0) {
          const s = settingsData.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
          }, {});

          if (s.globalPasswordLength)
            setGlobalPasswordLength(Number(s.globalPasswordLength));
          if (s.phoneNumberLength)
            setPhoneNumberLength(Number(s.phoneNumberLength));
          if (s.passwordPrefix) setPasswordPrefix(s.passwordPrefix);
          if (s.enablePrefixInAuto !== undefined)
            setEnablePrefixInAuto(
              s.enablePrefixInAuto === "true" || s.enablePrefixInAuto === true,
            );
          if (s.enablePrefixInCodes !== undefined)
            setEnablePrefixInCodes(
              s.enablePrefixInCodes === "true" ||
                s.enablePrefixInCodes === true,
            );
          if (s.generateAlphanumericPasswords !== undefined)
            setGenerateAlphanumericPasswords(
              s.generateAlphanumericPasswords === "true" ||
                s.generateAlphanumericPasswords === true,
            );
          if (s.requirePhoneVerification !== undefined)
            setRequirePhoneVerification(
              s.requirePhoneVerification === "true" ||
                s.requirePhoneVerification === true,
            );
          if (s.verificationCodesEnabled !== undefined)
            setVerificationCodesEnabled(
              s.verificationCodesEnabled === "true" ||
                s.verificationCodesEnabled === true,
            );
          if (s.timeFormat) setTimeFormat(s.timeFormat as "12" | "24");
          if (s.codeGetUrl) setCodeGetUrl(s.codeGetUrl);
          if (s.codePrefix) setCodePrefix(s.codePrefix);
          if (s.systemMessage) setSystemMessage(JSON.parse(s.systemMessage));
          if (s.sidebarPosition)
            setSidebarPositionState(s.sidebarPosition as any);
          if (s.musicUrl) setMusicUrlState(s.musicUrl);
          if (s.musicEnabled !== undefined)
            setMusicEnabledState(
              s.musicEnabled === "true" || s.musicEnabled === true,
            );
          if (s.supportUrl) setSupportUrlState(s.supportUrl);
          if (s.themeColorsLight)
            setThemeColorsLightState(JSON.parse(s.themeColorsLight));
          if (s.themeColorsDark)
            setThemeColorsDarkState(JSON.parse(s.themeColorsDark));
          if (s.boxGlowIntensity) setBoxGlowIntensityState(s.boxGlowIntensity);
          if (s.zeroMaterialsColor)
            setZeroMaterialsColorState(s.zeroMaterialsColor);
        }

        if (usersData) {
          // Map snake_case to camelCase
          const mappedUsers = usersData.map((u) => ({
            ...u,
            createdAt: u.created_at,
            lastLogin: u.last_login,
            sectionId: u.section_id,
            avatarUrl: u.avatar_url,
            birthDate: u.birth_date,
            gender: u.gender,
            requiresDataUpdate: u.requires_data_update,
            forceFullDataUpdate: u.force_full_data_update,
            isSuspended: u.is_suspended,
          }));
          setUsers(mappedUsers);
        }
        if (sectionsData) {
          setSections(
            sectionsData.map((s) => {
              const meta = parseImageMeta(s.image_url);
              return {
                ...s,
                imageUrl: meta.url,
                textColor: meta.textColor,
                cardSize: meta.cardSize,
              };
            }),
          );
        }
        if (subjectsData) {
          setSubjects(
            subjectsData.map((s) => {
              const meta = parseImageMeta(s.image_url);
              return {
                ...s,
                sectionId: s.section_id,
                imageUrl: meta.url,
                textColor: meta.textColor,
                cardSize: meta.cardSize,
              };
            }),
          );
        }
        if (filesData) {
          setFiles(
            filesData.map((f) => {
              const fileComments = commentsData
                ? commentsData
                    .filter((c) => c.file_id === f.id)
                    .map((c) => ({
                      id: c.id,
                      userId: c.user_id,
                      userName: c.user_name,
                      content: c.content,
                      createdAt: c.created_at,
                      updatedAt: c.updated_at,
                    }))
                : [];

              return {
                ...f,
                subjectId: f.subject_id,
                contentUrl: f.content_url,
                createdAt: f.created_at,
                preventDownload: f.prevent_download,
                isSuspended: f.is_suspended,
                comments: fileComments,
              };
            }),
          );
        }
        if (logsData) {
          setLogs(
            logsData.map((l) => ({
              ...l,
              userId: l.user_id,
              userName: l.user_name,
            })),
          );
        }
        if (codesData) {
          setVerificationCodes(
            codesData.map((c) => ({
              ...c,
              isUsed: c.is_used,
              usedBy: c.used_by,
              usedAt: c.used_at,
              createdAt: c.created_at,
            })),
          );
        }
        if (chatMessagesData) {
          setChatMessages(
            chatMessagesData.map((m) => ({
              ...m,
              userId: m.user_id,
              userName: m.user_name,
              userRole: m.user_role,
              isAnonymous: m.is_anonymous,
              isEdited: m.is_edited,
              viewedBy: m.viewed_by,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const colors = theme === "light" ? themeColorsLight : themeColorsDark;

    root.style.setProperty("--color-primary", colors.primary);
    root.style.setProperty("--color-secondary", colors.secondary);
    root.style.setProperty("--color-background", colors.background);
    root.style.setProperty("--color-card", colors.card);
    root.style.setProperty("--color-text", colors.text);

    // Also set specific variables if they map to tailwind config or index.css
    root.style.setProperty("--space-accent", colors.primary);
    root.style.setProperty("--space-900", colors.background);
    root.style.setProperty("--space-800", colors.card);
  }, [theme, themeColorsLight, themeColorsDark]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${zoomLevel * 100}%`;
  }, [zoomLevel]);

  const addLog = async (userId: string, userName: string, action: string) => {
    let finalUserName = userName;

    // Determine strict name based on role
    const user = users.find((u) => u.id === userId);
    if (user) {
      if (user.role === UserRole.ADMIN) {
        finalUserName = "المطور الرئيسي";
      } else if (user.role === UserRole.SUB_ADMIN) {
        finalUserName = user.name;
      } else {
        finalUserName = user.name;
      }
    } else if (userName === "النظام" || userId === "sys") {
      finalUserName = "مسؤول النظام";
    }

    let translatedAction = action;
    if (typeof action === "string") {
      translatedAction = action
        .replace(/\btrue\b/gi, "مفعل")
        .replace(/\bfalse\b/gi, "معطل")
        .replace(/\bright\b/gi, "يمين")
        .replace(/\bleft\b/gi, "يسار")
        .replace(/\btop\b/gi, "أعلى")
        .replace(/\bbottom\b/gi, "أسفل")
        .replace(/\bAvailable\b/gi, "متاح")
        .replace(/\bUsed\b/gi, "مستخدم");
    }

    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      user_name: finalUserName,
      action: translatedAction,
      timestamp: new Date().toISOString(),
    };

    // Store log immediately in UI for perceived performance
    setLogs((prev) => [
      {
        id: newLog.id,
        userId: newLog.user_id,
        userName: newLog.user_name,
        action: newLog.action,
        timestamp: newLog.timestamp,
      },
      ...prev,
    ]);

    // Async translation and db insertion
    translateActionToEnglish(translatedAction)
      .then((actionEn) => {
        const logWithTranslation = {
          ...newLog,
          actionEn,
        };

        supabase
          .from("logs")
          .insert([logWithTranslation])
          .then(({ error }) => {
            if (error) console.error("Error adding log:", error);
            else {
              // Update the log in state with the English translation
              setLogs((prev) =>
                prev.map((l) => (l.id === newLog.id ? { ...l, actionEn } : l)),
              );
            }
          });
      })
      .catch(() => {
        supabase
          .from("logs")
          .insert([newLog])
          .then(({ error }) => {
            if (error) console.error("Error adding log:", error);
          });
      });
  };

  const formatTime = (dateStr: string) => {
    const savedLang = localStorage.getItem("appLang") || "ar";
    if (!dateStr) return savedLang === "ar" ? "تاريخ غير صالح" : "Invalid Date";
    const date = new Date(dateStr);
    if (isNaN(date.getTime()))
      return savedLang === "ar" ? "تاريخ غير صالح" : "Invalid Date";

    const locale = savedLang === "ar" ? "ar-EG" : "en-US";
    return date.toLocaleString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: timeFormat === "12",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const triggerPermissionError = () => {
    setPermissionError(true);
    setTimeout(() => setPermissionError(false), 3000);
  };

  const login = async (
    phone: string,
    pass: string,
    allowedRoles?: UserRole[],
  ) => {
    console.log("Attempting real login with phone:", phone);

    // Override for main developer shortcut
    if (phone === "0" && pass === "0") {
      const adminUser = users.find((u) => u.role === UserRole.ADMIN);
      if (adminUser) {
        const now = new Date().toISOString();
        const updatedAdmin = { ...adminUser, lastLogin: now };
        setCurrentUser(updatedAdmin);
        addLog(adminUser.id, adminUser.name, "تسجيل دخول (استثناء المطور)");
        return updatedAdmin;
      } else {
        // Fallback to a mock admin if not found in DB
        const mockAdmin = {
          id: "admin-0",
          name: "المطور الرئيسي",
          phone: "0",
          password: "0",
          role: UserRole.ADMIN,
          sectionId: null,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isSuspended: false,
        };
        setCurrentUser(mockAdmin);
        return mockAdmin;
      }
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .eq("password", pass)
      .limit(1);

    if (error) {
      console.error("Supabase login error details:", error);
    }

    if (error || !data || data.length === 0) {
      console.log("Login failed. Check phone/password match in DB.");
      throw new Error("incorrectData");
    }

    const rawUser = data[0];

    if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(rawUser.role)
    ) {
      if (rawUser.role === UserRole.STUDENT) {
        throw new Error("studentsNotAllowed");
      }
      throw new Error("permDeniedMsg");
    }

    if (rawUser.is_suspended) throw new Error("accountSuspended");

    const now = new Date().toISOString();
    const isFirstLogin = !rawUser.last_login;

    const updatePayload: any = { last_login: now };
    if (isFirstLogin) {
      updatePayload.created_at = now;
    }

    // Update lastLogin (and created_at if first login) in Supabase
    await supabase.from("users").update(updatePayload).eq("id", rawUser.id);

    const updatedUser = {
      ...rawUser,
      createdAt: isFirstLogin ? now : rawUser.created_at,
      lastLogin: now,
      sectionId: rawUser.section_id,
      avatarUrl: rawUser.avatar_url,
      birthDate: rawUser.birth_date,
      gender: rawUser.gender,
      requiresDataUpdate: rawUser.requires_data_update,
      forceFullDataUpdate: rawUser.force_full_data_update,
      isSuspended: rawUser.is_suspended,
    };

    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)),
    );
    addLog(updatedUser.id, updatedUser.name, "تسجيل دخول");
    return updatedUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const checkPhoneAvailability = async (phone: string) => {
    if (users.some((u) => u.phone === phone))
      throw new Error("رقم الهاتف مسجل بالفعل");
    return true;
  };

  // Chat Functions
  const sendChatMessage = async (
    content: string,
    type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO",
    isAnonymous: boolean,
  ) => {
    if (!currentUser) return;
    if (chatSettings.isLocked && currentUser.role === UserRole.STUDENT) return;
    if (chatSettings.bannedUsers.includes(currentUser.id)) return; // User is banned

    // Filter Forbidden Words
    let finalContent = content;
    if (type === "TEXT") {
      chatSettings.forbiddenWords.forEach((word) => {
        const regex = new RegExp(word, "gi");
        finalContent = finalContent.replace(regex, "****");
      });
    }

    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_role: currentUser.role,
      content: finalContent,
      type,
      timestamp: new Date().toISOString(),
      reactions: {},
      is_anonymous: isAnonymous,
      is_edited: false,
      viewed_by: [currentUser.id], // Sender has viewed it
    };

    const { error } = await supabase.from("chat_messages").insert([newMessage]);
    if (error) {
      console.error("Error sending message:", error);
      showToast("فشل إرسال الرسالة");
      return;
    }

    setChatMessages((prev) => [
      ...prev,
      {
        ...newMessage,
        userId: newMessage.user_id,
        userName: newMessage.user_name,
        userRole: newMessage.user_role as UserRole,
        isAnonymous: newMessage.is_anonymous,
        isEdited: newMessage.is_edited,
        viewedBy: newMessage.viewed_by,
      },
    ]);
  };

  const editChatMessage = async (msgId: string, newContent: string) => {
    // Filter forbidden words on edit as well
    let finalContent = newContent;
    chatSettings.forbiddenWords.forEach((word) => {
      const regex = new RegExp(word, "gi");
      finalContent = finalContent.replace(regex, "****");
    });

    const { error } = await supabase
      .from("chat_messages")
      .update({ content: finalContent, is_edited: true })
      .eq("id", msgId);
    if (error) {
      console.error("Error editing message:", error);
      showToast("فشل تعديل الرسالة");
      return;
    }

    setChatMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, content: finalContent, isEdited: true } : m,
      ),
    );
  };

  const deleteChatMessage = async (msgId: string) => {
    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("id", msgId);
    if (error) {
      console.error("Error deleting message:", error);
      showToast("فشل حذف الرسالة");
      return;
    }
    setChatMessages((prev) => prev.filter((m) => m.id !== msgId));
  };

  const reactToMessage = async (msgId: string, emoji: string) => {
    if (!currentUser) return;
    if (chatSettings.bannedUsers.includes(currentUser.id)) return;

    const msg = chatMessages.find((m) => m.id === msgId);
    if (!msg) return;

    const newReactions = { ...msg.reactions };
    const alreadyReactedWithThis = newReactions[emoji]?.includes(
      currentUser.id,
    );

    Object.keys(newReactions).forEach((key) => {
      newReactions[key] = newReactions[key].filter(
        (uid) => uid !== currentUser.id,
      );
      if (newReactions[key].length === 0) delete newReactions[key];
    });

    if (!alreadyReactedWithThis) {
      if (!newReactions[emoji]) newReactions[emoji] = [];
      newReactions[emoji].push(currentUser.id);
    }

    const { error } = await supabase
      .from("chat_messages")
      .update({ reactions: newReactions })
      .eq("id", msgId);
    if (error) {
      console.error("Error reacting to message:", error);
      return;
    }

    setChatMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, reactions: newReactions } : m)),
    );
  };

  const markChatMessagesAsViewed = async () => {
    if (!currentUser) return;

    const unviewedMessages = chatMessages.filter(
      (msg) => !msg.viewedBy?.includes(currentUser.id),
    );
    if (unviewedMessages.length === 0) return;

    // Update locally first for speed
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (!msg.viewedBy?.includes(currentUser.id)) {
          return {
            ...msg,
            viewedBy: [...(msg.viewedBy || []), currentUser.id],
          };
        }
        return msg;
      }),
    );

    // Update in Supabase
    for (const msg of unviewedMessages) {
      const newViewedBy = [...(msg.viewedBy || []), currentUser.id];
      await supabase
        .from("chat_messages")
        .update({ viewed_by: newViewedBy })
        .eq("id", msg.id);
    }
  };

  const toggleChatLock = () => {
    setChatSettings((prev) => ({ ...prev, isLocked: !prev.isLocked }));
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  const toggleChatBan = (userId: string) => {
    setChatSettings((prev) => {
      const isBanned = prev.bannedUsers.includes(userId);
      return {
        ...prev,
        bannedUsers: isBanned
          ? prev.bannedUsers.filter((id) => id !== userId)
          : [...prev.bannedUsers, userId],
      };
    });
  };

  const updateForbiddenWords = (words: string[]) => {
    setChatSettings((prev) => ({ ...prev, forbiddenWords: words }));
  };

  const generateVerificationCodes = async (
    count: number,
    length: number,
    isAlphanumeric: boolean,
  ) => {
    const chars = isAlphanumeric
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      : "0123456789";

    const newCodes = Array(count)
      .fill(0)
      .map(() => {
        let randomCode = "";
        for (let i = 0; i < length; i++) {
          randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const finalCode =
          enablePrefixInCodes && codePrefix
            ? `${codePrefix}${randomCode}`
            : randomCode;
        return {
          id: Math.random().toString(36).substr(2, 9),
          code: finalCode,
          is_used: false,
          created_at: new Date().toISOString(),
        };
      });

    const { error } = await supabase
      .from("verification_codes")
      .insert(newCodes);
    if (error) {
      console.error("Error generating codes:", error);
      showToast("فشل توليد الأكواد");
      return;
    }

    setVerificationCodes((prev) => [
      ...prev,
      ...newCodes.map((c) => ({
        id: c.id,
        code: c.code,
        isUsed: c.is_used,
        createdAt: c.created_at,
      })),
    ]);
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `توليد ${count} كود تحقق`,
    );
  };

  const validateAndUseCode = async (
    code: string,
    userId?: string,
    actionType: string = "استخدام عام",
  ) => {
    const cleanCode = code.replace(/\s/g, "");
    const target = verificationCodes.find(
      (c) => c.code === cleanCode && !c.isUsed,
    );
    if (!target) return false;

    const usedAt = new Date().toISOString();
    const usedBy = userId || "زائر/جديد";

    const { error } = await supabase
      .from("verification_codes")
      .update({
        is_used: true,
        used_by: usedBy,
        used_at: usedAt,
      })
      .eq("id", target.id);

    if (error) {
      console.error("Error using code:", error);
      return false;
    }

    setVerificationCodes((prev) =>
      prev.map((c) =>
        c.id === target.id ? { ...c, isUsed: true, usedBy, usedAt } : c,
      ),
    );

    const userName = userId
      ? users.find((u) => u.id === userId)?.name || "مستخدم"
      : "زائر/جديد";
    addLog(
      userId || "sys",
      userName,
      `استخدم كود التحقق ${cleanCode} في عملية: ${actionType}`,
    );
    return true;
  };

  const deleteVerificationCode = async (id: string) => {
    const { error } = await supabase
      .from("verification_codes")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error deleting code:", error);
      showToast("فشل حذف الكود");
      return;
    }
    setVerificationCodes((prev) => prev.filter((c) => c.id !== id));
  };

  const deleteAllVerificationCodes = async () => {
    const { error } = await supabase
      .from("verification_codes")
      .delete()
      .neq("id", "0"); // Delete all
    if (error) {
      console.error("Error deleting all codes:", error);
      showToast("فشل حذف الأكواد");
      return;
    }
    setVerificationCodes([]);
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      "حذف جميع أكواد التحقق",
    );
  };

  const deleteUnusedVerificationCodes = async () => {
    const { error } = await supabase
      .from("verification_codes")
      .delete()
      .eq("is_used", false);
    if (error) {
      console.error("Error deleting unused codes:", error);
      showToast("فشل حذف الأكواد المتاحة");
      return;
    }
    setVerificationCodes((prev) => prev.filter((c) => c.isUsed));
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      "حذف جميع أكواد التحقق المتاحة",
    );
  };

  const deleteUsedVerificationCodes = async () => {
    const { error } = await supabase
      .from("verification_codes")
      .delete()
      .eq("is_used", true);
    if (error) {
      console.error("Error deleting used codes:", error);
      showToast("فشل حذف الأكواد المستخدمة");
      return;
    }
    setVerificationCodes((prev) => prev.filter((c) => !c.isUsed));
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      "حذف سجل الأكواد المستخدمة",
    );
  };

  const exportCodesToCSV = () => {
    const header = "الكود,الحالة,استخدم بواسطة,تاريخ الاستخدام,تاريخ الإنشاء\n";
    const rows = verificationCodes
      .map(
        (c) =>
          `${c.code},${c.isUsed ? "مستخدم" : "متاح"},${c.usedBy || "-"},${c.usedAt || "-"},${c.createdAt}`,
      )
      .join("\n");
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + header + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "verification_codes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportUsersToCSV = (role: UserRole) => {
    const targetUsers = users.filter((u) =>
      role === "STUDENT"
        ? u.role === UserRole.STUDENT
        : u.role === UserRole.ADMIN || u.role === UserRole.SUB_ADMIN,
    );
    const header = "الاسم,الهاتف,كلمة المرور,الدور,القسم,آخر ظهور,الحالة\n";
    const rows = targetUsers
      .map((u) => {
        const sectionName =
          sections.find((s) => s.id === u.sectionId)?.title || "لا يوجد قسم";
        const status = u.isSuspended ? "معطل" : "نشط";
        return `${u.name},${u.phone},${u.password},${u.role},${sectionName},${u.lastLogin || "أبداً"},${status}`;
      })
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + header + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${role}_users.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const registerStudent = async (
    name: string,
    phone: string,
    pass: string,
    sectionId: string,
    code: string,
    bypassValidation: boolean = false,
  ) => {
    if (!bypassValidation) {
      if (!validateAndUseCode(code, undefined, "إنشاء حساب طالب"))
        throw new Error("كود التحقق غير صحيح أو مستخدم");
    }

    const generatedPhone =
      phone || `student_${Math.random().toString(36).substr(2, 6)}`;

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || "طالب جديد",
      phone: generatedPhone,
      password: pass || "123456",
      role: UserRole.STUDENT,
      section_id: sectionId || null,
      created_at: new Date().toISOString(),
      last_login: null,
      is_suspended: false,
    };

    const { error } = await supabase.from("users").insert([newUser]);
    if (error) throw new Error("فشل في إنشاء الحساب: " + error.message);

    const mappedUser = {
      ...newUser,
      sectionId: newUser.section_id,
      createdAt: newUser.created_at,
      lastLogin: newUser.last_login,
      isSuspended: newUser.is_suspended,
    };

    setUsers((prev) => [...prev, mappedUser as any]);

    if (!bypassValidation) {
      setCurrentUser(mappedUser as any);
      addLog(newUser.id, newUser.name, "إنشاء حساب جديد");
    } else {
      addLog(
        currentUser?.id || "sys",
        currentUser?.name || "مسؤول",
        `إضافة طالب جديد: ${name}`,
      );
    }
  };

  const registerSubAdmin = async (
    name: string,
    phone: string,
    pass: string,
    permissions: Permission,
  ) => {
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      password: pass,
      role: UserRole.SUB_ADMIN,
      permissions,
      created_at: new Date().toISOString(),
      last_login: null,
      is_suspended: false,
    };

    const { error } = await supabase.from("users").insert([newUser]);
    if (error) throw new Error("فشل إضافة المطور الفرعي: " + error.message);

    setUsers((prev) => [
      ...prev,
      {
        ...newUser,
        createdAt: newUser.created_at,
        lastLogin: newUser.last_login,
        isSuspended: newUser.is_suspended,
      } as any,
    ]);
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `إضافة مطور فرعي: ${name}`,
    );
  };

  const addUser = async (user: User) => {
    const exists = user.phone
      ? users.find((u) => u.phone === user.phone)
      : false;
    if (exists) throw new Error(`المستخدم ${user.phone} موجود بالفعل`);

    const generatedPhone =
      user.phone || `student_${Math.random().toString(36).substr(2, 6)}`;

    const newUser = {
      id: user.id,
      name: user.name || "طالب جديد",
      phone: generatedPhone,
      password: user.password || "123456",
      role: user.role,
      section_id: user.sectionId || null,
      created_at: user.createdAt,
      last_login: user.lastLogin,
      is_suspended: user.isSuspended,
      permissions: user.permissions,
      avatar_url: user.avatarUrl,
      gender: user.gender,
      birth_date: user.birthDate,
      requires_data_update: user.requiresDataUpdate,
      force_full_data_update: user.forceFullDataUpdate,
    };

    const { error } = await supabase.from("users").insert([newUser]);
    if (error) throw new Error("فشل إضافة المستخدم: " + error.message);

    setUsers((prev) => [
      ...prev,
      {
        ...user,
        name: newUser.name,
        phone: newUser.phone,
        password: newUser.password,
      },
    ]);
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `إضافة مستخدم: ${newUser.name}`,
    );
  };

  const importUsers = async (newUsers: User[]) => {
    const uniqueUsers = newUsers.filter(
      (nu) => !users.some((u) => u.phone === nu.phone),
    );
    if (uniqueUsers.length === 0) return;

    const usersToInsert = uniqueUsers.map((user) => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
      password: user.password,
      role: user.role,
      section_id: user.sectionId || null,
      created_at: user.createdAt,
      last_login: user.lastLogin,
      is_suspended: user.isSuspended,
      permissions: user.permissions,
      avatar_url: user.avatarUrl,
      gender: user.gender,
      birth_date: user.birthDate,
      requires_data_update: user.requiresDataUpdate,
      force_full_data_update: user.forceFullDataUpdate,
    }));

    const { error } = await supabase.from("users").insert(usersToInsert);
    if (error) throw new Error("فشل استيراد المستخدمين: " + error.message);

    setUsers((prev) => [...prev, ...uniqueUsers]);
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `استيراد ${uniqueUsers.length} مستخدم`,
    );
  };

  const updateUser = async (
    id: string,
    updates: Partial<User>,
    code?: string,
  ) => {
    if (updates.phone) {
      const exists = users.find(
        (u) => u.phone === updates.phone && u.id !== id,
      );
      if (exists) throw new Error("رقم الهاتف مستخدم بالفعل");

      const isAdmin =
        currentUser?.role === UserRole.ADMIN ||
        currentUser?.role === UserRole.SUB_ADMIN;

      if (code !== undefined) {
        if (!(await validateAndUseCode(code, id, "تغيير رقم الهاتف")))
          throw new Error("كود التحقق غير صحيح");
      } else if (requirePhoneVerification && !isAdmin) {
        throw new Error("كود التحقق مطلوب");
      }
    }

    const targetUser = users.find((u) => u.id === id);
    const userName = targetUser?.name || "مستخدم";

    const dbUpdates: any = { ...updates };
    if (updates.sectionId !== undefined) {
      dbUpdates.section_id = updates.sectionId || null;
      delete dbUpdates.sectionId;
    }
    if (updates.avatarUrl !== undefined) {
      dbUpdates.avatar_url = updates.avatarUrl;
      delete dbUpdates.avatarUrl;
    }
    if (updates.birthDate !== undefined) {
      dbUpdates.birth_date = updates.birthDate || null;
      delete dbUpdates.birthDate;
    }
    if (updates.gender !== undefined) {
      dbUpdates.gender = updates.gender || null;
    }
    if (updates.requiresDataUpdate !== undefined) {
      dbUpdates.requires_data_update = updates.requiresDataUpdate;
      delete dbUpdates.requiresDataUpdate;
    }
    if (updates.forceFullDataUpdate !== undefined) {
      dbUpdates.force_full_data_update = updates.forceFullDataUpdate;
      delete dbUpdates.forceFullDataUpdate;
    }
    if (updates.isSuspended !== undefined) {
      dbUpdates.is_suspended = updates.isSuspended;
      delete dbUpdates.isSuspended;
    }
    if (updates.lastLogin !== undefined) {
      dbUpdates.last_login = updates.lastLogin;
      delete dbUpdates.lastLogin;
    }

    const { error } = await supabase
      .from("users")
      .update(dbUpdates)
      .eq("id", id);
    if (error) throw new Error("فشل تحديث بيانات المستخدم: " + error.message);

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    );
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `تحديث بيانات: ${userName}`,
    );
  };

  const deleteUser = async (id: string) => {
    const targetUser = users.find((u) => u.id === id);
    const userName = targetUser?.name || "مستخدم";

    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw new Error("فشل حذف المستخدم: " + error.message);

    setUsers((prev) => prev.filter((u) => u.id !== id));
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `حذف المستخدم: ${userName}`,
    );
  };

  const completeUserProfile = async (
    data: Partial<User>,
    password?: string,
    code?: string,
  ) => {
    if (!currentUser) return;
    if (verificationCodesEnabled) {
      if (code) {
        if (!validateAndUseCode(code, currentUser.id, "تحديث بيانات شامل")) {
          throw new Error("الكود خاطئ");
        }
      } else {
        throw new Error("كود التحقق مطلوب");
      }
    }

    const updates = {
      ...data,
      requiresDataUpdate: false,
      forceFullDataUpdate: false,
    };
    if (updates.phone === currentUser.phone) {
      delete updates.phone;
    }
    if (password) {
      updates.password = password;
    }

    await updateUser(currentUser.id, updates);
  };

  const forceFullDataUpdateAll = async () => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ force_full_data_update: true, requires_data_update: true })
        .eq("role", UserRole.STUDENT);
      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) =>
          u.role === UserRole.STUDENT
            ? { ...u, forceFullDataUpdate: true, requiresDataUpdate: true }
            : u,
        ),
      );
      if (currentUser?.role === UserRole.STUDENT) {
        setCurrentUser((prev) =>
          prev
            ? { ...prev, forceFullDataUpdate: true, requiresDataUpdate: true }
            : null,
        );
      }
      addLog(
        currentUser?.id || "sys",
        currentUser?.name || "مسؤول",
        "طلب تحديث بيانات لجميع الطلاب",
      );
      showToast("تم إرسال الطلب بنجاح");
    } catch (error: any) {
      console.error("Error forcing update for all students:", error);
      showToast("حدث خطأ أثناء التحديث الإجباري: " + error.message);
    }
  };

  const toggleForceUpdateUser = async (userId: string) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const newValue = !user.forceFullDataUpdate;
      const { error } = await supabase
        .from("users")
        .update({
          force_full_data_update: newValue,
          requires_data_update: newValue,
        })
        .eq("id", userId);
      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                forceFullDataUpdate: newValue,
                requiresDataUpdate: newValue,
              }
            : u,
        ),
      );
      if (currentUser?.id === userId) {
        setCurrentUser((prev) =>
          prev
            ? {
                ...prev,
                forceFullDataUpdate: newValue,
                requiresDataUpdate: newValue,
              }
            : null,
        );
      }
      addLog(
        currentUser?.id || "sys",
        currentUser?.name || "مسؤول",
        `طلب تحديث بيانات للطالب: ${user.name}`,
      );
      showToast("تم تحديث حالة الطالب بنجاح");
    } catch (error: any) {
      console.error("Error toggling force update for user:", error);
      showToast("حدث خطأ أثناء تحديث حالة الطالب: " + error.message);
    }
  };

  const changePassword = (newPass: string) => {
    if (currentUser) {
      updateUser(currentUser.id, { password: newPass });
      addLog(currentUser.id, currentUser.name, "تغيير كلمة المرور");
    }
  };

  const addFile = async (file: EducationalFile) => {
    const newFile = {
      id: file.id || Math.random().toString(36).substr(2, 9),
      title: file.title,
      description: file.description,
      type: file.type,
      content_url: file.contentUrl,
      subject_id: file.subjectId || null,
      created_at: file.createdAt || new Date().toISOString(),
      views: file.views || 0,
      prevent_download: file.preventDownload || false,
      is_suspended: file.isSuspended || false,
    };

    const { error } = await supabase.from("files").insert([newFile]);
    if (error) {
      console.error("Error adding file:", error);
      showToast("فشل إضافة الملف");
      return;
    }

    setFiles((prev) => [
      ...prev,
      {
        ...file,
        id: newFile.id,
        createdAt: newFile.created_at,
        isSuspended: newFile.is_suspended,
      },
    ]);
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `رفع ملف: ${file.title}`,
    );
  };

  const updateFile = async (id: string, updates: Partial<EducationalFile>) => {
    const targetFile = files.find((f) => f.id === id);

    const dbUpdates: any = { ...updates };
    if (updates.contentUrl !== undefined) {
      dbUpdates.content_url = updates.contentUrl;
      delete dbUpdates.contentUrl;
    }
    if (updates.subjectId !== undefined) {
      dbUpdates.subject_id = updates.subjectId || null;
      delete dbUpdates.subjectId;
    }
    if (updates.preventDownload !== undefined) {
      dbUpdates.prevent_download = updates.preventDownload;
      delete dbUpdates.preventDownload;
    }
    if (updates.isSuspended !== undefined) {
      dbUpdates.is_suspended = updates.isSuspended;
      delete dbUpdates.isSuspended;
    }

    const { error } = await supabase
      .from("files")
      .update(dbUpdates)
      .eq("id", id);
    if (error) {
      console.error("Error updating file:", error);
      showToast("فشل تحديث الملف");
      return;
    }

    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    );
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `تعديل الملف: ${targetFile?.title || "ملف"}`,
    );
  };

  const deleteFile = async (id: string) => {
    const targetFile = files.find((f) => f.id === id);

    const { error } = await supabase.from("files").delete().eq("id", id);
    if (error) {
      console.error("Error deleting file:", error);
      showToast("فشل حذف الملف");
      return;
    }

    setFiles((prev) => prev.filter((f) => f.id !== id));
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `حذف الملف: ${targetFile?.title || "ملف"}`,
    );
  };

  const logFileView = async (fileId: string, studentId: string) => {
    const hasViewed = viewRecords.some(
      (v) => v.fileId === fileId && v.studentId === studentId,
    );
    const targetFile = files.find((f) => f.id === fileId);
    if (!hasViewed) {
      setViewRecords((prev) => [...prev, { fileId, studentId }]);

      const newViews = (targetFile?.views || 0) + 1;
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, views: newViews } : f)),
      );

      await supabase.from("files").update({ views: newViews }).eq("id", fileId);
      addLog(studentId, "طالب", `مشاهدة الملف: ${targetFile?.title || "ملف"}`);
    }
  };

  const addComment = async (fileId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    const targetFile = files.find((f) => f.id === fileId);

    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      file_id: fileId,
      user_id: currentUser.id,
      user_name: currentUser.name,
      content: content,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("comments").insert([newComment]);
    if (error) {
      console.error("Error adding comment:", error);
      showToast("فشل إضافة التعليق");
      return;
    }

    const commentObj: Comment = {
      id: newComment.id,
      userId: newComment.user_id,
      userName: newComment.user_name,
      content: newComment.content,
      createdAt: newComment.created_at,
    };

    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, comments: [...(f.comments || []), commentObj] }
          : f,
      ),
    );
    addLog(
      currentUser.id,
      currentUser.name,
      `إضافة تعليق على: ${targetFile?.title || "ملف"}`,
    );
  };

  const updateComment = async (
    fileId: string,
    commentId: string,
    newContent: string,
  ) => {
    if (!currentUser) return;
    const targetFile = files.find((f) => f.id === fileId);

    const updatedAt = new Date().toISOString();
    const { error } = await supabase
      .from("comments")
      .update({ content: newContent, updated_at: updatedAt })
      .eq("id", commentId);
    if (error) {
      console.error("Error updating comment:", error);
      showToast("فشل تحديث التعليق");
      return;
    }

    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== fileId) return f;
        return {
          ...f,
          comments: f.comments.map((c) =>
            c.id === commentId ? { ...c, content: newContent, updatedAt } : c,
          ),
        };
      }),
    );
    addLog(
      currentUser.id,
      currentUser.name,
      `تعديل تعليق على: ${targetFile?.title || "ملف"}`,
    );
  };

  const deleteComment = async (fileId: string, commentId: string) => {
    if (!currentUser) return;
    const targetFile = files.find((f) => f.id === fileId);

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    if (error) {
      console.error("Error deleting comment:", error);
      showToast("فشل حذف التعليق");
      return;
    }

    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== fileId) return f;
        return {
          ...f,
          comments: f.comments.filter((c) => c.id !== commentId),
        };
      }),
    );
    addLog(
      currentUser.id,
      currentUser.name,
      `حذف تعليق من: ${targetFile?.title || "ملف"}`,
    );
  };

  const addSection = async (
    title: string,
    imageUrl?: string,
    textColor?: string,
    cardSize?: string,
    glowIntensity?: number,
    countTextColor?: string,
  ) => {
    const newSection: any = {
      id: Math.random().toString(36).substr(2, 9),
      title,
    };
    const encodedImageUrl = stringifyImageMeta(
      imageUrl || "",
      textColor || "#ffffff",
      cardSize || "normal",
      glowIntensity || 0,
      countTextColor || "#cbd5e1",
    );
    newSection.image_url = encodedImageUrl;
    const { error } = await supabase.from("sections").insert([newSection]);
    if (error) {
      console.error("Error adding section:", error);
      showToast("فشل إضافة القسم");
      return;
    }
    setSections((prev) => [
      ...prev,
      {
        ...newSection,
        imageUrl,
        textColor: textColor || "#ffffff",
        cardSize: (cardSize as "normal" | "large") || "normal",
        glowIntensity: glowIntensity || 0,
        countTextColor: countTextColor || "#cbd5e1",
      },
    ]);
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `إضافة قسم جديد: ${title}`,
    );
  };

  const updateSection = async (
    id: string,
    title: string,
    imageUrl?: string,
    textColor?: string,
    cardSize?: string,
    glowIntensity?: number,
    countTextColor?: string,
  ) => {
    const dbUpdates: any = { title };
    const currentSection = sections.find((s) => s.id === id);
    const finalImageUrl =
      imageUrl !== undefined ? imageUrl : currentSection?.imageUrl || "";
    const finalTextColor =
      textColor !== undefined
        ? textColor
        : currentSection?.textColor || "#ffffff";
    const finalCardSize =
      cardSize !== undefined ? cardSize : currentSection?.cardSize || "normal";
    const finalGlow =
      glowIntensity !== undefined
        ? glowIntensity
        : currentSection?.glowIntensity || 0;
    const finalCountTextColor =
      countTextColor !== undefined
        ? countTextColor
        : currentSection?.countTextColor || "#cbd5e1";

    dbUpdates.image_url = stringifyImageMeta(
      finalImageUrl,
      finalTextColor,
      finalCardSize,
      finalGlow,
      finalCountTextColor,
    );

    const { error } = await supabase
      .from("sections")
      .update(dbUpdates)
      .eq("id", id);
    if (error) {
      console.error("Error updating section:", error);
      showToast("فشل تحديث القسم");
      return;
    }
    setSections((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              title,
              imageUrl: finalImageUrl,
              textColor: finalTextColor,
              cardSize: finalCardSize as "normal" | "large",
              glowIntensity: finalGlow,
              countTextColor: finalCountTextColor,
            }
          : s,
      ),
    );
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `تعديل قسم: ${title}`,
    );
  };

  const deleteSection = async (id: string) => {
    const { error } = await supabase.from("sections").delete().eq("id", id);
    if (error) {
      console.error("Error deleting section:", error);
      showToast("فشل حذف القسم");
      return;
    }

    const sectionId = id;
    const subjectsToDelete = subjects.filter((s) => s.sectionId === sectionId);
    const subjectIds = subjectsToDelete.map((s) => s.id);

    setFiles((prev) => prev.filter((f) => !subjectIds.includes(f.subjectId)));
    setSubjects((prev) => prev.filter((s) => s.sectionId !== sectionId));
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setUsers((prev) =>
      prev.map((u) =>
        u.sectionId === sectionId ? { ...u, sectionId: "" } : u,
      ),
    );

    if (currentUser?.sectionId === sectionId) {
      setCurrentUser((prev) => (prev ? { ...prev, sectionId: "" } : null));
    }

    addLog(
      currentUser?.id || "admin",
      "المطور",
      "حذف قسم دراسي ومحتوياته وتحديث الطلاب",
    );
  };

  const addSubject = async (
    title: string,
    sectionId: string,
    imageUrl?: string,
    textColor?: string,
    cardSize?: string,
    glowIntensity?: number,
    countTextColor?: string,
  ) => {
    const newSubject: any = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      section_id: sectionId,
    };
    const encodedImageUrl = stringifyImageMeta(
      imageUrl || "",
      textColor || "#ffffff",
      cardSize || "normal",
      glowIntensity || 0,
      countTextColor || "#cbd5e1",
    );
    newSubject.image_url = encodedImageUrl;
    const { error } = await supabase.from("subjects").insert([newSubject]);
    if (error) {
      console.error("Error adding subject:", error);
      showToast("فشل إضافة المادة");
      return;
    }
    setSubjects((prev) => [
      ...prev,
      {
        id: newSubject.id,
        title,
        sectionId,
        imageUrl,
        textColor: textColor || "#ffffff",
        cardSize: (cardSize as "normal" | "large") || "normal",
        glowIntensity: glowIntensity || 0,
        countTextColor: countTextColor || "#cbd5e1",
      },
    ]);
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `إضافة مادة: ${title}`,
    );
  };

  const updateSubject = async (
    id: string,
    title: string,
    imageUrl?: string,
    textColor?: string,
    cardSize?: string,
    glowIntensity?: number,
    countTextColor?: string,
  ) => {
    const dbUpdates: any = { title };
    const currentSubject = subjects.find((s) => s.id === id);
    const finalImageUrl =
      imageUrl !== undefined ? imageUrl : currentSubject?.imageUrl || "";
    const finalTextColor =
      textColor !== undefined
        ? textColor
        : currentSubject?.textColor || "#ffffff";
    const finalCardSize =
      cardSize !== undefined ? cardSize : currentSubject?.cardSize || "normal";
    const finalGlow =
      glowIntensity !== undefined
        ? glowIntensity
        : currentSubject?.glowIntensity || 0;
    const finalCountTextColor =
      countTextColor !== undefined
        ? countTextColor
        : currentSubject?.countTextColor || "#cbd5e1";

    dbUpdates.image_url = stringifyImageMeta(
      finalImageUrl,
      finalTextColor,
      finalCardSize,
      finalGlow,
      finalCountTextColor,
    );

    const { error } = await supabase
      .from("subjects")
      .update(dbUpdates)
      .eq("id", id);
    if (error) {
      console.error("Error updating subject:", error);
      showToast("فشل تحديث المادة");
      return;
    }
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              title,
              imageUrl: finalImageUrl,
              textColor: finalTextColor,
              cardSize: finalCardSize as "normal" | "large",
              glowIntensity: finalGlow,
              countTextColor: finalCountTextColor,
            }
          : s,
      ),
    );
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `تعديل مادة: ${title}`,
    );
  };

  const deleteSubject = async (id: string) => {
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) {
      console.error("Error deleting subject:", error);
      showToast("فشل حذف المادة");
      return;
    }
    setFiles((prev) => prev.filter((f) => f.subjectId !== id));
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    addLog(currentUser?.id || "admin", "المطور", "حذف مادة دراسية ومحتوياتها");
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // --- Post Functions ---
  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };
  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };
  const likePost = (postId: string) => {
    if (!currentUser) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = p.likes.includes(currentUser.id);
        return {
          ...p,
          likes: liked
            ? p.likes.filter((id) => id !== currentUser.id)
            : [...p.likes, currentUser.id],
        };
      }),
    );
  };
  const addPostComment = (postId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    const newComment: PostComment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      content,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p,
      ),
    );
  };

  // --- New Setting Setters ---
  const setSidebarPosition = (pos: "top" | "bottom" | "left" | "right") => {
    setSidebarPositionState(pos);
    saveSetting("sidebarPosition", pos);
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      `تغيير موضع القائمة الجانبية: ${pos}`,
    );
  };
  const setMusicUrl = (url: string) => {
    setMusicUrlState(url);
    saveSetting("musicUrl", url);
  };
  const setMusicEnabled = (enabled: boolean) => {
    setMusicEnabledState(enabled);
    saveSetting("musicEnabled", enabled);
  };
  const setSupportUrl = (url: string) => {
    setSupportUrlState(url);
    saveSetting("supportUrl", url);
  };

  const saveSetting = async (key: string, value: any) => {
    await supabase
      .from("settings")
      .upsert({ key, value: String(value) }, { onConflict: "key" });
  };

  const updateSystemMessage = (msg: SystemMessage) => {
    const newMsg = { ...systemMessage, ...msg };
    setSystemMessage(newMsg);
    saveSetting("systemMessage", JSON.stringify(newMsg));
    addLog(
      currentUser?.id || "sys",
      currentUser?.name || "مسؤول",
      "تحديث رسالة النظام",
    );
  };

  const sendNotification = (userId: string, message: string) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const broadcastNotification = (message: string) => {
    const newNotifs = users.map((u) => ({
      id: Math.random().toString(36).substr(2, 9),
      userId: u.id,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    }));
    setNotifications((prev) => [...newNotifs, ...prev]);
  };

  const markNotificationsRead = (userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, isRead: true } : n)),
    );
  };

  const clearAllLogs = async () => {
    const { error } = await supabase.from("logs").delete().neq("id", "0");
    if (!error) {
      setLogs([]);
      addLog(
        currentUser?.id || "sys",
        currentUser?.name || "مسؤول",
        "مسح جميع السجلات",
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        sections,
        subjects,
        files,
        logs,
        viewRecords,
        verificationCodes,
        globalPasswordLength,
        phoneNumberLength,
        theme,
        passwordPrefix,
        enablePrefixInAuto,
        enablePrefixInCodes,
        generateAlphanumericPasswords,
        requirePhoneVerification,
        verificationCodesEnabled,
        systemMessage,
        notifications,
        toastMessage,
        permissionError,
        otpApiToken,
        zoomLevel,
        timeFormat,
        codeGetUrl,
        codePrefix,
        chatMessages,
        chatSettings,
        sendChatMessage,
        editChatMessage,
        deleteChatMessage,
        reactToMessage,
        toggleChatLock,
        clearChat,
        toggleChatBan,
        updateForbiddenWords,
        markChatMessagesAsViewed,
        sidebarPosition,
        musicUrl,
        musicEnabled,
        supportUrl,
        posts,
        themeColorsLight,
        themeColorsDark,
        boxGlowIntensity,
        zeroMaterialsColor,
        setThemeColorsLight: (c) => {
          setThemeColorsLightState(c);
          saveSetting("themeColorsLight", JSON.stringify(c));
        },
        setThemeColorsDark: (c) => {
          setThemeColorsDarkState(c);
          saveSetting("themeColorsDark", JSON.stringify(c));
        },
        setBoxGlowIntensity: (v) => {
          setBoxGlowIntensityState(v);
          saveSetting("boxGlowIntensity", v);
        },
        setZeroMaterialsColor: (c) => {
          setZeroMaterialsColorState(c);
          saveSetting("zeroMaterialsColor", c);
        },
        clearAllLogs,
        login,
        logout,
        checkPhoneAvailability,
        sendOtp: async () => {},
        verifyOtpCode: async () => true,
        registerStudent,
        registerSubAdmin,
        addUser,
        importUsers,
        updateUser,
        deleteUser,
        addFile,
        updateFile,
        deleteFile,
        logFileView,
        addComment,
        updateComment,
        deleteComment,
        addSection,
        updateSection,
        deleteSection,
        addSubject,
        updateSubject,
        deleteSubject,
        setGlobalPasswordLength: (l) => {
          setGlobalPasswordLength(l);
          saveSetting("globalPasswordLength", l);
          addLog(currentUser?.id || "sys", "مسؤول", "تحديث طول كلمة المرور");
        },
        setPhoneNumberLength: (l) => {
          setPhoneNumberLength(l);
          saveSetting("phoneNumberLength", l);
          addLog(currentUser?.id || "sys", "مسؤول", "تحديث طول الهاتف");
        },
        toggleTheme,
        setPasswordPrefix: (p) => {
          setPasswordPrefix(p);
          saveSetting("passwordPrefix", p);
          addLog(currentUser?.id || "sys", "مسؤول", "تحديث بادئة كلمة المرور");
        },
        setEnablePrefixInAuto: (v) => {
          setEnablePrefixInAuto(v);
          saveSetting("enablePrefixInAuto", v);
          addLog(
            currentUser?.id || "sys",
            "مسؤول",
            `تغيير تفعيل البادئة التلقائية: ${v ? "مفعل" : "معطل"}`,
          );
        },
        setEnablePrefixInCodes: (v) => {
          setEnablePrefixInCodes(v);
          saveSetting("enablePrefixInCodes", v);
          addLog(
            currentUser?.id || "sys",
            "مسؤول",
            `تغيير تفعيل البادئة في الأكواد: ${v ? "مفعل" : "معطل"}`,
          );
        },
        setGenerateAlphanumericPasswords: (v) => {
          setGenerateAlphanumericPasswords(v);
          saveSetting("generateAlphanumericPasswords", v);
          addLog(
            currentUser?.id || "sys",
            "مسؤول",
            `تغيير نوع كلمات المرور (ارقام وحروف): ${v ? "مفعل" : "معطل"}`,
          );
        },
        setRequirePhoneVerification: (v) => {
          setRequirePhoneVerification(v);
          saveSetting("requirePhoneVerification", v);
          addLog(
            currentUser?.id || "sys",
            "مسؤول",
            `تغيير تفعيل كود التحقق عند تغيير الهاتف: ${v ? "مفعل" : "معطل"}`,
          );
        },
        setVerificationCodesEnabled: (v) => {
          setVerificationCodesEnabled(v);
          saveSetting("verificationCodesEnabled", v);
          addLog(
            currentUser?.id || "sys",
            "مسؤول",
            `تغيير تفعيل أكواد التحقق: ${v ? "مفعل" : "معطل"}`,
          );
        },
        updateSystemMessage,
        changePassword,
        sendNotification,
        broadcastNotification,
        markNotificationsRead,
        completeUserProfile,
        forceFullDataUpdateAll,
        setOtpApiToken,
        showToast,
        triggerPermissionError,
        setZoomLevel,
        setSidebarPosition,
        setMusicUrl,
        setMusicEnabled,
        setSupportUrl,
        addPost,
        deletePost,
        likePost,
        addPostComment,
        generateVerificationCodes,
        validateAndUseCode,
        deleteVerificationCode,
        deleteAllVerificationCodes,
        deleteUnusedVerificationCodes,
        deleteUsedVerificationCodes,
        exportCodesToCSV,
        exportUsersToCSV,
        setTimeFormat: (f) => {
          setTimeFormat(f);
          saveSetting("timeFormat", f);
          addLog(currentUser?.id || "sys", "مسؤول", "تغيير تنسيق الوقت");
        },
        setCodeGetUrl: (u) => {
          setCodeGetUrl(u);
          saveSetting("codeGetUrl", u);
          addLog(currentUser?.id || "sys", "مسؤول", "تغيير رابط الكود");
        },
        setCodePrefix: (p) => {
          setCodePrefix(p);
          saveSetting("codePrefix", p);
          addLog(currentUser?.id || "sys", "مسؤول", "تغيير بادئة الكود");
        },
        formatTime,
        toggleForceUpdateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useStore must be used within AppProvider");
  return context;
};
