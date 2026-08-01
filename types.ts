export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN", // المطور الرئيسي
  SUB_ADMIN = "SUB_ADMIN", // المطور الفرعي
}

export enum FileType {
  PDF = "PDF",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  TEXT = "TEXT",
  IMAGE = "IMAGE",
}

export interface Permission {
  canManageContent: boolean; // إدارة المحتوى
  canManageStudents: boolean; // إدارة الطلاب
  canViewStats: boolean; // الإحصائيات وسجل النشاطات
  canAccessSettings: boolean; // الأعدادات
  canManageSubAdmins: boolean; // إدارة المطورين الفرعيين
  canManageCodes: boolean; // اكواد التحقق (New)
}

export interface User {
  id: string;
  name: string;
  phone: string; // Acts as Username/Phone
  password: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string | null;
  permissions?: Permission; // Only for SUB_ADMIN
  avatarUrl?: string; // New: Profile Picture
  gender?: "MALE" | "FEMALE"; // New: Gender
  birthDate?: string; // New: Birth Date

  // New Fields for Data Completion
  requiresDataUpdate?: boolean;
  forceFullDataUpdate?: boolean;
  sectionId?: string; // Replaces school/governorate

  isSuspended?: boolean; // New: Account Deactivation
}

export interface VerificationCode {
  id: string;
  code: string;
  isUsed: boolean;
  usedBy?: string; // User ID
  usedAt?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt?: string; // Track edits
}

export interface EducationalFile {
  id: string;
  title: string;
  description?: string; // New: File Description
  type: FileType;
  contentUrl: string;
  subjectId: string;
  createdAt: string;
  views: number;
  preventDownload: boolean;
  comments: Comment[];
  isSuspended?: boolean; // New: File Deactivation (Hidden from students)
}

export interface Subject {
  id: string;
  title: string;
  sectionId: string;
  imageUrl?: string;
  textColor?: string;
  cardSize?: "normal" | "large";
  glowIntensity?: number; // 0 to 5
  countTextColor?: string;
}

export interface Section {
  id: string;
  title: string;
  imageUrl?: string;
  textColor?: string;
  cardSize?: "normal" | "large";
  glowIntensity?: number; // 0 to 5
  countTextColor?: string;
}

export interface Log {
  id: string;
  userId: string;
  userName: string;
  action: string;
  actionEn?: string;
  timestamp: string;
}

export interface ViewRecord {
  fileId: string;
  studentId: string;
}

export interface SystemMessage {
  content: string;
  isActive: boolean;
  showAtLogin: boolean;
  displayMode?: "popup" | "marquee"; // New: popup or scrolling marquee
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// --- Posts Types ---
export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string; // text content
  mediaUrl?: string; // image/video/audio URL
  mediaType?: "IMAGE" | "VIDEO" | "AUDIO";
  likes: string[]; // array of user IDs
  comments: PostComment[];
  createdAt: string;
}

// --- Chat Types ---
export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string; // Text or Media URL
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO";
  timestamp: string;
  reactions: { [key: string]: string[] }; // emoji -> array of userIds
  isAnonymous: boolean; // If student chose to hide info
  isEdited?: boolean; // New: Track if message was edited
  viewedBy?: string[]; // New: List of user IDs who viewed this message
  is_ai?: boolean; // AI feature: indicates if message is from AI
  ai_response?: string; // AI feature: stores AI response or analysis
}

export interface ChatSettings {
  isLocked: boolean;
  hideUserNames: boolean; // Admin toggle to force hide all names (optional feature)
  bannedUsers: string[]; // List of User IDs banned from chat
  forbiddenWords: string[]; // List of words to be censored
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
}
