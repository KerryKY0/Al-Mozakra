import React, { createContext, useContext, useState, ReactNode } from "react";

type Lang = "ar" | "en";

const translations: Record<string, Record<Lang, string>> = {
  // Landing
  platform: { ar: "منصة", en: "Platform" },
  almozakra: { ar: "المذاكرة", en: "Al-Mozakra" },
  "landing.desc": {
    ar: "منصتك التعليمية الشاملة. نوفر لك كل ما تحتاجه للتفوق. كل ذلك في بيئة تعليمية آمنة وممتعة.",
    en: "Your comprehensive educational platform. We provide everything you need to excel in a safe and enjoyable learning environment.",
  },
  login: { ar: "تسجيل الدخول", en: "Login" },
  register: { ar: "إنشاء حساب جديد", en: "Create Account" },
  devPortal: { ar: "بوابة المطورين", en: "Developer Portal" },
  changeTheme: { ar: "تغيير النمط", en: "Toggle Theme" },
  pdfFiles: { ar: "ملفات PDF وشيتات", en: "PDF Files & Sheets" },
  videoLectures: { ar: "محاضرات فيديو", en: "Video Lectures" },
  summaries: { ar: "ملخصات ومراجعات", en: "Summaries & Reviews" },
  questionBank: { ar: "بنك أسئلة واختبارات", en: "Question Bank & Tests" },
  allRights: {
    ar: "جميع الحقوق محفوظة © 2026 منصة المذاكرة",
    en: "© 2026 Al-Mozakra Platform. All rights reserved.",
  },
  encouragement: {
    ar: "🚀 ابدأ رحلتك التعليمية الآن واصنع مستقبلك!",
    en: "🚀 Start your learning journey now and build your future!",
  },

  // Auth
  studentLoginTitle: { ar: "تسجيل دخول الطالب", en: "Student Login" },
  devLoginTitle: { ar: "تسجيل دخول المطورين", en: "Developer Login" },
  phoneNumber: { ar: "رقم الهاتف", en: "Phone Number" },
  password: { ar: "كلمة المرور", en: "Password" },
  enterPhone: { ar: "أدخل رقم الهاتف", en: "Enter phone number" },
  enterPassword: { ar: "أدخل كلمة المرور", en: "Enter password" },
  loginBtn: { ar: "دخول", en: "Login" },
  noAccountRegister: {
    ar: "ليس لديك حساب؟ إنشاء حساب جديد",
    en: "No account? Create new account",
  },
  devLoginLink: { ar: "تسجيل دخول المطورين", en: "Developer Login" },
  noAccount: { ar: "ليس لديك حساب؟", en: "Don't have an account?" },
  createAccount: { ar: "إنشاء حساب", en: "Create Account" },
  backToHome: { ar: "العودة للرئيسية", en: "Back to Home" },
  incorrectData: {
    ar: "بيانات الدخول غير صحيحة",
    en: "Incorrect login credentials",
  },
  accountSuspended: {
    ar: "تم تعطيل هذا الحساب من قبل الإدارة",
    en: "This account has been suspended by admin",
  },
  tripleNameRequired: { ar: "الاسم الثلاثي", en: "Full Name (3 words)" },
  name: { ar: "الاسم", en: "Name" },
  section: { ar: "القسم", en: "Section" },
  chooseSection: { ar: "اختر القسم", en: "Choose Section" },
  gender: { ar: "الجنس", en: "Gender" },
  male: { ar: "ذكر", en: "Male" },
  female: { ar: "أنثى", en: "Female" },
  unspecified: { ar: "غير محدد", en: "Not specified" },
  birthDate: { ar: "تاريخ الميلاد", en: "Date of Birth" },
  joinDate: { ar: "تاريخ الانضمام", en: "Join Date" },
  save: { ar: "حفظ", en: "Save" },
  cancel: { ar: "إلغاء", en: "Cancel" },
  edit: { ar: "تعديل", en: "Edit" },
  delete: { ar: "حذف", en: "Delete" },
  confirm: { ar: "تأكيد", en: "Confirm" },
  close: { ar: "إغلاق", en: "Close" },
  yes: { ar: "نعم", en: "Yes" },
  no: { ar: "لا", en: "No" },
  rememberMe: { ar: "حفظ تسجيل الدخول", en: "Remember me" },
  verifying: { ar: "جاري التحقق...", en: "Verifying..." },
  limitedAccess: {
    ar: "الوصول المحدود للمشرفين فقط",
    en: "Limited access for admins only",
  },
  phoneOrUsername: {
    ar: "رقم الهاتف أو اسم المستخدم",
    en: "Phone or username",
  },
  mainDevLogin: { ar: "دخول المطور الرئيسي", en: "Main Dev Login" },
  subDevLogin: { ar: "دخول المطور الفرعي", en: "Sub Dev Login" },
  backToStudentLogin: {
    ar: "عودة لتسجيل دخول الطلاب",
    en: "Back to Student Login",
  },
  createNewAccount: { ar: "إنشاء حساب جديد", en: "Create New Account" },
  joinTo: { ar: "انضم إلى", en: "Join" },
  tripleName: { ar: "الاسم الثلاثي", en: "Full Name" },
  lettersOnly: { ar: "مطلوب حروف فقط", en: "Letters only" },
  digitsRequired: { ar: "خانة مطلوبة", en: "digits required" },
  autoGenerate: { ar: "توليد تلقائي", en: "Auto Generate" },
  processing: { ar: "جاري المعالجة...", en: "Processing..." },
  alreadyHaveAccount: {
    ar: "لديك حساب بالفعل؟ تسجيل الدخول",
    en: "Already have an account? Login",
  },
  enterVerificationCode: {
    ar: "أدخل كود التحقق",
    en: "Enter Verification Code",
  },
  enterCodeToComplete: {
    ar: "أدخل الكود لإتمام التسجيل",
    en: "Enter code to complete registration",
  },
  wrongCode: { ar: "الكود خاطئ", en: "Wrong code" },
  getCode: { ar: "احصل على كود", en: "Get a Code" },
  confirmAndCreate: {
    ar: "تأكيد وإنشاء الحساب",
    en: "Confirm and Create Account",
  },

  // Sidebar
  home: { ar: "الرئيسية", en: "Home" },
  account: { ar: "الحساب", en: "Account" },
  dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  users: { ar: "المستخدمين", en: "Users" },
  contentManagement: { ar: "إدارة المحتوى", en: "Content Management" },
  verificationCodes: { ar: "أكواد التحقق", en: "Verification Codes" },
  settings: { ar: "الإعدادات", en: "Settings" },
  view: { ar: "العرض", en: "View" },
  activityLog: { ar: "سجل النشاطات", en: "Activity Log" },
  logout: { ar: "تسجيل الخروج", en: "Logout" },
  collapseSidebar: { ar: "طي القائمة", en: "Collapse Menu" },
  expandSidebar: { ar: "توسيع القائمة", en: "Expand Menu" },
  eyeComfort: { ar: "راحة العين", en: "Eye Comfort" },
  mainDev: { ar: "المطور الرئيسي", en: "Main Developer" },
  subDev: { ar: "مطور فرعي", en: "Sub Developer" },
  student: { ar: "طالب", en: "Student" },
  welcomeUser: { ar: "مرحباً بك،", en: "Welcome," },
  tools: { ar: "الأدوات", en: "Tools" },
  posts: { ar: "المنشورات", en: "Posts" },
  myCourses: { ar: "دوراتي", en: "My Courses" },
  support: { ar: "الدعم", en: "Support" },
  zoomIn: { ar: "تكبير", en: "Zoom In" },
  zoomOut: { ar: "تصغير", en: "Zoom Out" },
  grayscale: { ar: "أبيض وأسود", en: "Grayscale" },

  // Student Dashboard
  welcomeStudent: { ar: "مرحباً،", en: "Welcome," },
  followUp: {
    ar: "تابع محاضراتك وكل جديد من هنا.",
    en: "Follow your lectures and latest updates here.",
  },
  notifications: { ar: "الإشعارات", en: "Notifications" },
  noNotifications: { ar: "لا توجد إشعارات جديدة", en: "No new notifications" },
  clearUsedCodes: { ar: "حذف سجل الأكواد المستخدمة", en: "Clear Used Codes" },
  systemMessageAlert: {
    ar: "رسالة النظام (تنبيه)",
    en: "System Message (Alert)",
  },
  adminAlert: { ar: "تنبيه من الإدارة", en: "Admin Alert" },
  understood: { ar: "فهمت", en: "Got it" },
  subjects: { ar: "مادة دراسية", en: "Subjects" },
  backToSections: { ar: "العودة للأقسام", en: "Back to Sections" },
  noSubjectsYet: {
    ar: "لا توجد مواد في هذا القسم حتى الآن.",
    en: "No subjects in this section yet.",
  },
  noFilesYet: {
    ar: "لا توجد ملفات متاحة لهذه المادة حالياً.",
    en: "No files available for this subject.",
  },
  registeredSubjects: { ar: "المواد المسجلة", en: "Registered Subjects" },
  trackYourProgress: {
    ar: "تابع تقدمك الدراسي والمواد المشترك بها.",
    en: "Track your study progress and enrolled subjects.",
  },
  available: { ar: "متاح", en: "Available" },
  count: { ar: "العدد", en: "Count" },
  length: { ar: "الطول", en: "Length" },
  alphanumeric: { ar: "أرقام وحروف", en: "Alphanumeric" },
  all: { ar: "الكل", en: "All" },
  texts: { ar: "نصوص", en: "Texts" },
  images: { ar: "صور", en: "Images" },
  videos: { ar: "فيديو", en: "Video" },
  audio: { ar: "صوتيات", en: "Audio" },
  pdfDoc: { ar: "وثيقة PDF", en: "PDF Document" },
  imageFile: { ar: "صورة", en: "Image" },
  readableText: { ar: "نص مقروء", en: "Readable Text" },
  clickToView: { ar: "اضغط للمشاهدة", en: "Click to view" },
  downloadNotAvail: { ar: "التحميل غير متاح", en: "Download not available" },
  read: { ar: "قراءة", en: "Read" },
  questions: { ar: "أسئلة", en: "Questions" },
  generateQuestions: { ar: "صنع اسئلة", en: "Generate Questions" },

  // Admin
  dashboardTitle: { ar: "لوحة المعلومات", en: "Dashboard" },
  totalStudents: { ar: "إجمالي الطلاب", en: "Total Students" },
  totalDevs: { ar: "إجمالي المطورين", en: "Total Developers" },
  onlineToday: { ar: "المتصلين اليوم", en: "Online Today" },
  totalFiles: { ar: "عدد الملفات", en: "Total Files" },
  mostViewed: { ar: "أكثر الملفات مشاهدة", en: "Most Viewed Files" },
  viewAll: { ar: "عرض الكل", en: "View All" },
  userManagement: { ar: "إدارة المستخدمين", en: "User Management" },
  students: { ar: "الطلاب", en: "Students" },
  subDevs: { ar: "المطورين الفرعيين", en: "Sub Developers" },
  addStudent: { ar: "إضافة طالب", en: "Add Student" },
  addDev: { ar: "إضافة مطور", en: "Add Developer" },
  "addStudentLog:": { ar: "إضافة طالب جديد:", en: "Add New Student:" },
  "addSectionLog:": { ar: "إضافة قسم جديد:", en: "Add New Section:" },
  updateDataLog: { ar: "تحديث بيانات", en: "Update data" },
  requestDataUpdateLog: {
    ar: "طلب تحديث بيانات للطالب",
    en: "Request data update for student",
  },
  "deleteUserLog:": { ar: "حذف المستخدم:", en: "Delete User:" },
  "changeSidebarLog:": {
    ar: "تغيير موضع القائمة الجانبية:",
    en: "Change sidebar position:",
  },
  recommendedImageSize: {
    ar: "مقاس الصورة الموصى به: 800x600",
    en: "Recommended Image Size: 800x600",
  },
  adminLoginAction: { ar: "تسجيل دخول (المطور)", en: "Login (Developer)" },
  loginAction: { ar: "تسجيل دخول", en: "Login" },
  logoutAction: { ar: "تسجيل خروج", en: "Logout" },
  coverImage: { ar: "صورة الغلاف", en: "Cover Image" },
  fileDownloadAction: { ar: "تحميل ملف", en: "File Download" },
  fileViewAction: { ar: "مشاهدة ملف", en: "File View" },
  newCommentAction: { ar: "تعليق جديد", en: "New Comment" },
  publishPostAction: { ar: "نشر منشور", en: "Publish Post" },
  deletePostAction: { ar: "حذف منشور", en: "Delete Post" },
  updateDataAction: { ar: "تحديث بيانات", en: "Data Update" },
  activatedAction: { ar: "مفعل", en: "Activated" },
  deactivatedAction: { ar: "معطل", en: "Deactivated" },
  deletedAction: { ar: "محذوف", en: "Deleted" },
  "تسجيل دخول": { ar: "تسجيل دخول", en: "Login" },
  "تسجيل خروج": { ar: "تسجيل خروج", en: "Logout" },
  aiApiKeyError: {
    ar: "عذراً، مفتاح الذكاء الاصطناعي (API Key) غير صالح أو منتهي. يرجى إضافته في ملف .env الخاص بك.",
    en: "Sorry, the AI API Key is invalid or expired. Please add a valid key to your .env file.",
  },
  "تحميل ملف": { ar: "تحميل ملف", en: "File Download" },
  "مشاهدة ملف": { ar: "مشاهدة ملف", en: "File View" },
  "تعليق جديد": { ar: "تعليق جديد", en: "New Comment" },
  "نشر منشور": { ar: "نشر منشور", en: "Publish Post" },
  "حذف منشور": { ar: "حذف منشور", en: "Delete Post" },
  "تحديث بيانات": { ar: "تحديث بيانات", en: "Data Update" },
  مفعل: { ar: "مفعل", en: "Activated" },
  معطل: { ar: "معطل", en: "Deactivated" },
  محذوف: { ar: "محذوف", en: "Deleted" },
  "المطور الرئيسي": { ar: "المطور الرئيسي", en: "Main Developer" },
  "مسؤول النظام": { ar: "مسؤول النظام", en: "System Admin" },
  "حذف المستخدم:": { ar: "حذف المستخدم:", en: "Delete User:" },
  addStudentLog: { ar: "إضافة طالب جديد:", en: "Add New Student:" },
  deleteUserLog: { ar: "حذف المستخدم:", en: "Delete User:" },
  clearUsedCodesLog: {
    ar: "حذف سجل الأكواد المستخدمة",
    en: "Delete used codes history",
  },
  deleteAllCodesLog: {
    ar: "حذف جميع أكواد التحقق",
    en: "Delete all verification codes",
  },
  generateCodesLog: {
    ar: "توليد {count} كود تحقق",
    en: "Generate {count} verification codes",
  },
  changeSidebarPosLog: {
    ar: "تغيير موضع القائمة الجانبية:",
    en: "Change sidebar position:",
  },
  loginDevShortcutLog: {
    ar: "دخول (اختصار المطور)",
    en: "Login (Dev Shortcut)",
  },
  "تسجيل دخول (استثناء المطور)": {
    ar: "تسجيل دخول (استثناء المطور)",
    en: "Login (Dev Shortcut)",
  },
  "إضافة طالب جديد:": { ar: "إضافة طالب جديد:", en: "Add New Student:" },
  توليد: { ar: "توليد", en: "Generated" },
  "كود تحقق": { ar: "كود تحقق", en: "verification codes" },
  "تغيير موضع القائمة الجانبية:": {
    ar: "تغيير موضع القائمة الجانبية:",
    en: "Changed sidebar position:",
  },
  "دخول (اختصار المطور)": {
    ar: "دخول (اختصار المطور)",
    en: "Login (Dev Shortcut)",
  },

  "حذف المستخدم: ": { ar: "حذف المستخدم: ", en: "Deleted user: " },
  "حذف سجل الأكواد المستخدمة": {
    ar: "حذف سجل الأكواد المستخدمة",
    en: "Delete used codes history",
  },
  "حذف جميع أكواد التحقق": {
    ar: "حذف جميع أكواد التحقق",
    en: "Delete all verification codes",
  },
  "توليد {count} كود تحقق": {
    ar: "توليد {count} كود تحقق",
    en: "Generate {count} verification codes",
  },
  "إضافة قسم جديد:": { ar: "إضافة قسم جديد:", en: "Add New Section:" },
  "تعديل قسم:": { ar: "تعديل قسم:", en: "Update Section:" },
  "حذف قسم دراسي ومحتوياته وتحديث الطلاب": {
    ar: "حذف قسم دراسي ومحتوياته وتحديث الطلاب",
    en: "Delete section, its contents, and update students",
  },
  "إضافة مادة:": { ar: "إضافة مادة:", en: "Add Subject:" },
  "تعديل مادة:": { ar: "تعديل مادة:", en: "Update Subject:" },
  "حذف مادة دراسية ومحتوياتها": {
    ar: "حذف مادة دراسية ومحتوياتها",
    en: "Delete subject and its contents",
  },
  "رفع ملف:": { ar: "رفع ملف:", en: "Upload File:" },
  "تعديل الملف:": { ar: "تعديل الملف:", en: "Update File:" },
  "حذف الملف:": { ar: "حذف الملف:", en: "Delete File:" },
  "مشاهدة الملف:": { ar: "مشاهدة الملف:", en: "View File:" },
  "إضافة تعليق على:": { ar: "إضافة تعليق على:", en: "Add Comment to:" },
  "تعديل تعليق على:": { ar: "تعديل تعليق على:", en: "Edit Comment on:" },
  "حذف تعليق من:": { ar: "حذف تعليق من:", en: "Delete Comment from:" },
  "إنشاء حساب جديد": { ar: "إنشاء حساب جديد", en: "Create New Account" },

  trackSystemChanges: {
    ar: "تتبع كافة التغييرات والنشاطات التي تتم في المنصة.",
    en: "Track all changes and activities occurring in the platform.",
  },
  clearLog: { ar: "مسح السجل", en: "Clear Log" },
  lastLogin: { ar: "آخر تسجيل دخول", en: "Last Login" },
  actionsColumn: { ar: "الإجراءات", en: "Actions" },
  userColumn: { ar: "المستخدم", en: "User" },
  actionColumn: { ar: "نوع الإجراء", en: "Action Type" },
  detailsColumn: { ar: "التفاصيل والنشاط", en: "Details & Activity" },
  noActivityRecords: {
    ar: "لا يوجد نشاط مسجل حتى الآن.",
    en: "No activity recorded yet.",
  },
  more: { ar: "المزيد...", en: "More..." },
  import: { ar: "استيراد", en: "Import" },
  export: { ar: "تصدير", en: "Export" },
  search: { ar: "بحث...", en: "Search..." },
  lastSeen: { ar: "آخر ظهور", en: "Last Seen" },
  permissions: { ar: "الصلاحيات", en: "Permissions" },
  data: { ar: "البيانات", en: "Data" },
  actions: { ar: "إجراءات", en: "Actions" },
  neverLoggedIn: { ar: "لم يسجل دخول", en: "Never logged in" },
  complete: { ar: "مكتمل", en: "Complete" },
  incomplete: { ar: "غير مكتمل", en: "Incomplete" },
  active: { ar: "حساب مفعل", en: "Active Account" },
  suspended: { ar: "حساب معطل", en: "Suspended Account" },
  activate: { ar: "تفعيل", en: "Activate" },
  deactivate: { ar: "تعطيل", en: "Deactivate" },
  sendNotification: { ar: "إرسال إشعار", en: "Send Notification" },
  controlSystemPreferences: {
    ar: "تحكم في إعدادات المنصة بالكامل",
    en: "Full control over platform preferences",
  },
  securityAndRegister: { ar: "التسجيل والأمان", en: "Security & Registration" },
  passwordLength: { ar: "طول كلمة المرور", en: "Password Length" },
  phoneLength: { ar: "طول رقم الهاتف", en: "Phone Number Length" },
  alphanumericPasswords: {
    ar: "كلمات سر (أرقام وحروف)",
    en: "Alphanumeric Passwords",
  },
  alphanumericDesc: {
    ar: "توليد كلمات سر تحتوي على أرقام وحروف إنجليزية معاً",
    en: "Generate passwords with numbers and English letters",
  },
  requirePhoneVerify: { ar: "طلب كود تحقق", en: "Require Verification Code" },
  requirePhoneDesc: {
    ar: "طلب كود لتغيير رقم الهاتف أو التسجيل",
    en: "Require code for changing phone or registration",
  },
  systemSettings: { ar: "إعدادات النظام", en: "System Settings" },
  sidebarPositionLabel: { ar: "موضع القائمة الجانبية", en: "Sidebar Position" },
  sidebarPositionDesc: {
    ar: "تغيير موضع القائمة الجانبية في جميع الحسابات",
    en: "Change sidebar position for all accounts",
  },
  currentPositionLabel: { ar: "الموضع الحالي:", en: "Current Position:" },
  top: { ar: "أعلى", en: "Top" },
  bottom: { ar: "أسفل", en: "Bottom" },
  left: { ar: "يسار", en: "Left" },
  right: { ar: "يمين", en: "Right" },
  musicSettings: { ar: "إعدادات الموسيقى", en: "Music Settings" },
  musicSettingsDesc: {
    ar: "يمكنك إضافة رابط موسيقى ليظهر زر الموسيقى للطلاب",
    en: "Add music link to show the music button to students",
  },
  enableMusicForStudents: {
    ar: "تفعيل الموسيقى للطلاب",
    en: "Enable music for students",
  },
  messageContent: { ar: "محتوى الرسالة", en: "Message Content" },
  typeSystemMessage: {
    ar: "اكتب رسالة النظام هنا...",
    en: "Type system message here...",
  },
  activeMessageDesc: {
    ar: "تفعيل الرسالة تفعيل أو تعطيل ظهور الرسالة",
    en: "Enable or disable message appearance",
  },
  showAtLogin: { ar: "عند تسجيل الدخول", en: "Upon Login" },
  showAtLoginDesc: {
    ar: "إظهار الرسالة تلقائياً عند الدخول",
    en: "Automatically show message on login",
  },
  displayMode: { ar: "طريقة العرض", en: "Display Mode" },
  popup: { ar: "نافذة منبثقة", en: "Popup Window" },
  marquee: { ar: "شريط متحرك", en: "Moving Bar" },
  appearanceAndMedia: { ar: "المظهر والوسائط", en: "Appearance & Media" },
  backgroundMusic: { ar: "موسيقى خلفية", en: "Background Music" },
  backgroundMusicDesc: {
    ar: "تفعيل صوتيات مهدئة للطلاب",
    en: "Enable soothing audio for students",
  },
  supportAndLinks: { ar: "الدعم والروابط", en: "Support & Links" },
  supportUrlPlaceholder: {
    ar: "رابط واتساب أو تليجرام",
    en: "WhatsApp or Telegram Link",
  },
  systemNotice: { ar: "رسالة النظام", en: "System Notice" },
  settingsAutoSaveNotice: {
    ar: "يتم حفظ معظم الإعدادات تلقائياً عند التغيير.",
    en: "Most settings are saved automatically upon change.",
  },
  saveAllSettings: { ar: "حفظ جميع الإعدادات", en: "Save All Settings" },
  systemMessage: { ar: "رسالة النظام", en: "System Message" },
  supportUrl: { ar: "رابط الدعم (URL)", en: "Support URL" },
  sidebarPosition: { ar: "تحكم في موضع القائمة", en: "Sidebar Position" },
  musicUrl: { ar: "رابط الموسيقى (URL)", en: "Music URL" },
  supportUrlLabel: { ar: "رابط الدعم", en: "Support Link" },
  supportUrlDesc: {
    ar: "رابط صفحة الدعم أو واتساب أو تليجرام",
    en: "Link for support page, WhatsApp, or Telegram",
  },
  generalConfiguration: { ar: "التكوين العام", en: "General Configuration" },
  passwordLengthLabel: {
    ar: "طول كلمة المرور (التوليد التلقائي)",
    en: "Password Length (Auto-gen)",
  },
  phoneLengthLabel: {
    ar: "طول رقم الهاتف (عند التسجيل)",
    en: "Phone Number Length",
  },
  phoneLengthDesc: {
    ar: "اتركه فارغاً لتعطيل التحقق من الطول.",
    en: "Leave empty to disable length validation.",
  },
  savePrefixLabel: { ar: "حفظ البادئة", en: "Save Prefix" },
  timeFormatLabel: { ar: "تنسيق الوقت", en: "Time Format" },
  codeGetUrlLabel: { ar: "رابط الحصول على كود", en: "Get Code Link" },
  codeGetUrlDesc: {
    ar: 'سيظهر الرابط عند الضغط على "احصل على كود"',
    en: "This link will appear when clicking 'Get a code'",
  },
  duplicate: { ar: "المتكرر", en: "Duplicates" },
  completionStatus: { ar: "اكتمال البيانات", en: "Data Completion" },
  incompleteData: { ar: "بيانات غير مكتملة", en: "Incomplete Data" },
  loggedInStatus: { ar: "سجل دخول", en: "Logged In" },
  nameColumn: { ar: "الاسم", en: "Name" },
  phoneColumn: { ar: "الهاتف", en: "Phone" },
  statusColumn: { ar: "الحالة", en: "Status" },
  incompleteName: { ar: "الاسم غير ثلاثي", en: "Name is not tripartite" },
  sectionNotSpecified: { ar: "القسم غير محدد", en: "Section not specified" },
  confirmDeleteFinal: {
    ar: "تأكيد الحذف النهائي",
    en: "Confirm Final Deletion",
  },
  deleteConfirmDesc: {
    ar: "هل أنت متأكد من حذف المستخدم {name}؟ هذا الإجراء لا يمكن التراجع عنه.",
    en: "Are you sure you want to delete user {name}? This action cannot be undone.",
  },
  suspendConfirm: {
    ar: "هل تريد تعطيل حساب {name} ومنعه من الدخول؟",
    en: "Do you want to suspend {name}'s account and prevent access?",
  },
  activateConfirm: {
    ar: "هل تريد تفعيل حساب {name}؟",
    en: "Do you want to activate {name}'s account?",
  },
  confirmActivation: { ar: "تأكيد التفعيل", en: "Confirm Activation" },
  confirmSuspension: { ar: "تأكيد التعطيل", en: "Confirm Suspension" },
  missingFields: { ar: "البيانات الناقصة", en: "Missing Fields" },
  confirmForceUpdateAll: {
    ar: "تأكيد التحديث الإجباري",
    en: "Confirm Force Update",
  },
  forceUpdateAllDesc: {
    ar: "سيتم إجبار جميع الطلاب على تحديث بياناتهم عند تسجيل الدخول القادم. هل أنت متأكد؟",
    en: "All students will be forced to update their data at next login. Are you sure?",
  },
  yesExecute: { ar: "نعم، تنفيذ", en: "Yes, execute" },
  canManageContent: { ar: "إدارة المحتوى", en: "Content Management" },
  canManageStudents: { ar: "إدارة الطلاب", en: "Student Management" },
  canViewStats: { ar: "الإحصائيات والسجلات", en: "Stats & Logs" },
  canAccessSettings: { ar: "الأعدادات", en: "Settings" },
  canManageSubAdmins: { ar: "إدارة المطورين", en: "Devs Management" },
  canManageCodes: { ar: "اكواد التحقق", en: "Verification Codes" },
  userImportSuccess: {
    ar: "تم استيراد {count} مستخدم",
    en: "Imported {count} users successfully",
  },
  userAddedSuccess: {
    ar: "تمت إضافة المستخدم بنجاح",
    en: "User added successfully",
  },
  userUpdatedSuccess: {
    ar: "تم تحديث بيانات المستخدم",
    en: "User updated successfully",
  },
  notifSent: { ar: "تم إرسال الإشعار", en: "Notification sent" },
  notifSentAll: {
    ar: "تم إرسال الإشعار للجميع",
    en: "Notification sent to all",
  },
  deleteSuccess: { ar: "تم الحذف بنجاح", en: "Deleted successfully" },
  accountActivated: { ar: "تم تفعيل الحساب", en: "Account activated" },
  fullName: { ar: "الاسم", en: "Full Name" },
  full: { ar: "كامل", en: "Full" },
  yesActivate: { ar: "نعم، تفعيل", en: "Yes, Activate" },
  yesSuspend: { ar: "نعم، تعطيل", en: "Yes, Suspend" },
  notSpecified: { ar: "غير محدد", en: "Not specified" },
  usernameOrPhone: { ar: "اسم المستخدم/الهاتف", en: "Username / Phone" },
  notLoggedIn: { ar: "لم يسجل دخول", en: "Never logged in" },
  codeRequired: {
    ar: "مطلب كود تحقق لتغيير رقم الهاتف",
    en: "Verification code required to change phone number",
  },
  newCodeRequired: {
    ar: "يجب الحصول على كود جديد من الإدارة",
    en: "Must get a new code from administration",
  },
  saveChange: { ar: "حفظ التغيير", en: "Save change" },
  permDeniedMsg: {
    ar: "ليس لديك صلاحية بذلك",
    en: "You do not have permission",
  },
  checkMainDev: {
    ar: "يرجى مراجعة المطور الرئيسي للحصول على الصلاحيات اللازمة.",
    en: "Please consult the main developer for required permissions.",
  },
  mostViewedFiles: { ar: "أكثر الملفات مشاهدة", en: "Most Viewed Files" },
  enterNewPassword: {
    ar: "أدخل كلمة المرور الجديدة",
    en: "Enter new password",
  },
  aiGreeting: {
    ar: "مرحباً يا {name} 👋\nأي الأخبار وازاي اقدر اساعدك النهاردة؟",
    en: "Hello {name} 👋\nHow can I help you today?",
  },
  aiConnectionError: {
    ar: "عذراً، حدث خطأ في الاتصال.",
    en: "Sorry, a connection error occurred.",
  },
  aiTechnicalIssue: {
    ar: "عذراً، أواجه مشكلة تقنية حالياً. يرجى المحاولة لاحقاً.",
    en: "Sorry, I am facing a technical issue right now. Please try again later.",
  },
  lastActive: { ar: "آخر ظهور", en: "Last Active" },
  to: { ar: "إلى", en: "To" },
  send: { ar: "إرسال", en: "Send" },
  typeNotifHere: {
    ar: "اكتب نص الإشعار هنا...",
    en: "Type notification message here...",
  },
  notifAllDesc: {
    ar: "سيصل هذا الإشعار لجميع المستخدمين في النظام.",
    en: "This notification will reach all users in the system.",
  },
  sendToAll: { ar: "إرسال للكل", en: "Send to All" },
  addNewStudent: { ar: "إضافة طالب جديد", en: "Add New Student" },
  addNewSubAdmin: { ar: "إضافة مطور فرعي", en: "Add New Sub-Developer" },
  fieldUsernamePhone: {
    ar: "رقم الهاتف/اسم المستخدم",
    en: "Phone Number / Username",
  },
  chooseSectionOptional: {
    ar: "اختر القسم (اختياري)",
    en: "Choose Section (Optional)",
  },
  yesDelete: { ar: "نعم، حذف", en: "Yes, Delete" },
  added: { ar: "تمت الإضافة", en: "Added successfully" },
  updated: { ar: "تم التعديل", en: "Updated successfully" },
  tooLarge: { ar: "حجم الملف كبير جداً", en: "File is too large" },
  waitProcessing: { ar: "جاري المعالجة...", en: "Processing..." },
  activityLogTitle: { ar: "سجل النشاطات الكامل", en: "Full Activity Log" },
  userCol: { ar: "المستخدم", en: "User" },
  actionCol: { ar: "الإجراء", en: "Action" },
  timeCol: { ar: "التوقيت", en: "Timestamp" },
  mainDevName: { ar: "المطور الرئيسي", en: "Main Developer" },
  systemAdmin: { ar: "مسؤول النظام", en: "System Admin" },
  activated: { ar: "مفعل", en: "Activated" },
  deactivated: { ar: "معطل", en: "Deactivated" },
  invalidDate: { ar: "تاريخ غير صالح", en: "Invalid Date" },
  waitLoading: { ar: "يرجى الانتظار...", en: "Please wait..." },
  fileUploadFail: { ar: "فشل رفع الملف", en: "File upload failed" },
  allSubjectsCount: { ar: "مواد", en: "Subjects" },
  studentsNotAllowed: {
    ar: "غير مسموح للطلاب بالدخول من هنا",
    en: "Students are not allowed here",
  },
  notMainDev: {
    ar: "هذا الحساب ليس للمطور الرئيسي",
    en: "This account is not for the main developer",
  },
  notSubDev: {
    ar: "هذا الحساب ليس للمطور الفرعي",
    en: "This account is not for a sub-developer",
  },
  forceUpdateAll: { ar: "تحديث إجباري", en: "Force Update All" },
  broadcastNotif: { ar: "إشعار للكل", en: "Broadcast Notification" },
  searchPlaceholder: { ar: "بحث...", en: "Search..." },
  viewData: { ar: "عرض البيانات", en: "View Data" },
  forceUpdateUser: { ar: "تحديث بيانات", en: "Update Data" },
  editUser: { ar: "تعديل البيانات", en: "Edit Data" },
  deleteUser: { ar: "حذف المستخدم", en: "Delete User" },
  activateUser: { ar: "تفعيل الحساب", en: "Activate Account" },
  deactivateUser: { ar: "تعطيل الحساب", en: "Deactivate Account" },
  birthDateLabel: { ar: "تاريخ الميلاد", en: "Birth Date" },

  // Tools
  notepad: { ar: "مذكرة", en: "Notepad" },
  timer: { ar: "منبه الدراسة", en: "Study Timer" },
  calculator: { ar: "آلة حاسبة", en: "Calculator" },
  whiteboard: { ar: "سبورة", en: "Whiteboard" },
  startTimer: { ar: "ابدأ", en: "Start" },
  pauseTimer: { ar: "إيقاف", en: "Pause" },
  resetTimer: { ar: "إعادة", en: "Reset" },
  clearBoard: { ar: "مسح", en: "Clear" },
  writeNotesHere: {
    ar: "اكتب ملاحظاتك هنا...",
    en: "Write your notes here...",
  },
  minute: { ar: "دقيقة", en: "min" },
  toolsDesc: {
    ar: "أدوات مساعدة للمذاكرة والتركيز",
    en: "Study and Focus Tools",
  },
  notepadDesc: {
    ar: "دوّن ملاحظاتك وأفكارك هنا",
    en: "Take notes and write down ideas",
  },
  timerDesc: {
    ar: "نظم وقتك للمذاكرة والتركيز",
    en: "Organize your study time",
  },
  calcDesc: {
    ar: "قم بإجراء العمليات الحسابية",
    en: "Perform mathematical calculations",
  },
  painterDesc: {
    ar: "ارسم وضّح أفكارك بصرياً",
    en: "Draw and visualize your ideas",
  },

  // Admin
  sections: { ar: "الأقسام", en: "Sections" },
  adminSubjects: { ar: "المواد", en: "Subjects" },
  files: { ar: "الملفات", en: "Files" },
  addSection: { ar: "إضافة قسم", en: "Add Section" },
  addSubject: { ar: "إضافة مادة", en: "Add Subject" },
  addFile: { ar: "إضافة ملف", en: "Add File" },
  allSubjects: { ar: "كل المواد", en: "All Subjects" },
  views: { ar: "مشاهدة", en: "Views" },
  commentsCount: { ar: "تعليق", en: "Comments" },
  details: { ar: "تفاصيل", en: "Details" },
  viewers: { ar: "المشاهدين", en: "Viewers" },
  viewersList: { ar: "قائمة المشاهدين", en: "Viewers List" },
  noViewsYet: { ar: "لا توجد مشاهدات مسجلة", en: "No views recorded yet" },
  allComments: { ar: "كل التعليقات", en: "All Comments" },
  preview: { ar: "معاينة", en: "Preview" },
  titleLabel: { ar: "العنوان", en: "Title" },
  belongingTo: { ar: "القسم التابع له", en: "Belongs to Section" },
  subjectLabel: { ar: "المادة", en: "Subject" },
  chooseSubjectLabel: { ar: "اختر المادة", en: "Choose Subject" },
  descriptionOptional: { ar: "الوصف (اختياري)", en: "Description (Optional)" },
  writeDetailsHere: {
    ar: "اكتب تفاصيل الملف...",
    en: "Write file details here...",
  },
  fileTypeLabel: { ar: "نوع الملف", en: "File Type" },
  textContentLabel: { ar: "المحتوى النصي", en: "Text Content" },
  writeTextHere: { ar: "اكتب النص هنا...", en: "Write text here..." },
  contentUrlLabel: { ar: "رابط المحتوى (URL)", en: "Content URL" },
  uploadLocalFile: { ar: "رفع ملف محلي", en: "Upload Local File" },
  savedFile: { ar: "ملف محفوظ", en: "Saved File" },
  clickToChange: { ar: "اضغط للتغيير", en: "Click to change" },
  preventDownloadLabel: { ar: "منع التحميل", en: "Prevent Download" },
  subjectsIn: { ar: "مواد", en: "Subjects" },
  noFilesCount: { ar: "لا توجد ملفات", en: "No files available" },
  confirmDelete: { ar: "تأكيد الحذف", en: "Confirm Deletion" },
  pleaseWait: { ar: "يرجى الانتظار...", en: "Please wait..." },

  // File Viewer
  loadingPage: { ar: "جاري تحميل الصفحة...", en: "Loading page..." },
  loading: { ar: "جاري التحميل...", en: "Loading..." },
  fileNotFound: { ar: "الملف غير موجود", en: "File not found" },
  backToFiles: { ar: "عودة للملفات", en: "Back to files" },
  backToSubject: { ar: "عودة للمادة", en: "Back to subject" },
  rotate: { ar: "تدوير", en: "Rotate" },
  fullscreen: { ar: "ملء الشاشة", en: "Fullscreen" },
  loadingData: { ar: "جاري تحميل البيانات...", en: "Loading data..." },
  browserNoVideo: {
    ar: "متصفحك لا يدعم تشغيل الفيديو.",
    en: "Your browser does not support video playback.",
  },
  browserNoAudio: {
    ar: "متصفحك لا يدعم تشغيل الملفات الصوتية.",
    en: "Your browser does not support audio playback.",
  },
  deleteComment: { ar: "حذف التعليق", en: "Delete Comment" },
  deleteCommentConfirm: {
    ar: "هل أنت متأكد من حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء.",
    en: "Are you sure you want to delete this comment? This action cannot be undone.",
  },
  contentTooShort: {
    ar: "محتوى الملف قصير جداً لتوليد أسئلة",
    en: "File content is too short to generate questions",
  },
  failGenerate: {
    ar: "فشل في توليد الأسئلة",
    en: "Failed to generate questions",
  },

  // Complete Profile
  dataUpdateRequired: {
    ar: "تحديث البيانات مطلوب",
    en: "Data Update Required",
  },
  dataUpdateDesc: {
    ar: "طلبت الإدارة تحديث بياناتك بشكل كامل. يرجى ملء الحقول بدقة.",
    en: "Administration has requested a full data update. Please fill out the fields accurately.",
  },
  nameLettersOnly: {
    ar: "الاسم يجب أن يحتوي على أحرف وليس (رموز، علامات، ارقام)",
    en: "Name must contain only letters (no symbols, signs, numbers)",
  },
  nameTripartite: {
    ar: "يجب كتابة الاسم الثلاثي كاملاً (3 كلمات على الأقل)",
    en: "Full name must be written (at least 3 words)",
  },
  sectionRequired: { ar: "يجب اختيار القسم", en: "A section must be selected" },
  genderRequired: { ar: "يجب اختيار الجنس", en: "Gender must be selected" },
  birthDateRequired: {
    ar: "يجب إدخال تاريخ الميلاد",
    en: "Date of birth must be entered",
  },
  passwordLengthReq1: {
    ar: "كلمة المرور يجب أن تتكون من",
    en: "Password must consist of",
  },
  passwordLengthReq2: { ar: "خانة", en: "characters" },
  // removed duplicate wrongCode
  fullNameLetters: {
    ar: "الاسم الثلاثي (أحرف فقط)",
    en: "Full Name (Letters only)",
  },
  studySection: { ar: "القسم الدراسي", en: "Study Section" },
  // removed duplicate chooseSection
  chooseGender: { ar: "اختر الجنس...", en: "Choose gender..." },
  // removed duplicate autoGenerate
  continue: { ar: "متابعة", en: "Continue" },
  verifyCode: { ar: "كود التحقق", en: "Verification Code" },
  enterVerifyCode: {
    ar: "أدخل كود التحقق لإتمام العملية",
    en: "Enter the verification code to complete the process",
  },
  // removed duplicate getCode
  // removed duplicate verifying
  confirmAndFinish: { ar: "تأكيد وإنهاء", en: "Confirm & Finish" },

  // Quotes
  quote1: {
    ar: "يلا بينا نذاكر! مفيش حاجة صعبة 💪",
    en: "Let's study! Nothing is impossible 💪",
  },
  quote2: {
    ar: "كل مجهود بتبذله النهاردة هيفرق معاك بكرة 🌟",
    en: "Every effort today makes a difference tomorrow 🌟",
  },
  quote3: {
    ar: "ثق بنفسك، انت قد المسؤولية! 🚀",
    en: "Believe in yourself! You got this! 🚀",
  },
  quote4: {
    ar: "المذاكرة مش عقاب، دي استثمار في نفسك 📚",
    en: "Studying is not punishment, it's an investment in yourself 📚",
  },
  quote5: {
    ar: "خطوة خطوة، هتوصل إن شاء الله 🎯",
    en: "Step by step, you will get there Insha'Allah 🎯",
  },
  quote6: {
    ar: "اللي بيذاكر بيجيب نتيجة حلوة، يلا! 🔥",
    en: "Those who study get great results, let's go! 🔥",
  },

  // Profile
  myData: { ar: "بياناتي", en: "My Data" },
  changePassword: { ar: "تغيير كلمة المرور", en: "Change Password" },
  newPassword: { ar: "كلمة المرور الجديدة", en: "New Password" },
  saveChanges: { ar: "حفظ التغييرات", en: "Save Changes" },
  changePhoto: { ar: "اضغط لتغيير الصورة", en: "Click to change photo" },
  progress: { ar: "التقدم", en: "Progress" },
  points: { ar: "النقاط", en: "Points" },
  totalPoints: { ar: "النقاط المجمعة", en: "Total Points" },

  // Posts
  addPost: { ar: "إضافة منشور", en: "Add Post" },
  writeComment: { ar: "اكتب تعليقاً...", en: "Write a comment..." },
  comments: { ar: "التعليقات", en: "Comments" },
  like: { ar: "إعجاب", en: "Like" },
  noPostsYet: { ar: "لا توجد منشورات بعد", en: "No posts yet" },
  postPublished: { ar: "تم نشر المنشور", en: "Post published successfully" },
  fileTooLarge: {
    ar: "حجم الملف كبير جداً (الحد 50MB)",
    en: "File too large (Limit 50MB)",
  },
  writePostPlaceholder: {
    ar: "اكتب منشورك هنا...",
    en: "Write your post here...",
  },
  publish: { ar: "نشر", en: "Publish" },
  developer: { ar: "المطور", en: "Developer" },
  subDeveloper: { ar: "مطور فرعي", en: "Sub Developer" },
  studentType: { ar: "طالب", en: "Student" },
  deleted: { ar: "تم الحذف", en: "Deleted successfully" },
  noCommentsYet: { ar: "لا تعليقات بعد", en: "No comments yet" },

  // Terms and Privacy
  termsOfUse: { ar: "شروط الاستخدام", en: "Terms of Use" },
  privacyPolicy: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  termsIntro: {
    ar: "مرحباً بك في منصة المذاكرة. باستخدامك لهذه المنصة، فإنك توافق على الشروط والأحكام التالية:",
    en: "Welcome to Al-Mozakra Platform. By using this platform, you agree to the following terms and conditions:",
  },
  intellectualProperty: { ar: "الملكية الفكرية", en: "Intellectual Property" },
  intellectualPropertyDesc: {
    ar: "هذه المنصة وجميع محتوياتها وتصميماتها وبرمجياتها هي ملكية حصرية وخاصة للمطور كريم شاكر. يُمنع منعاً باتاً نسخ أو إعادة إنتاج أو توزيع أي جزء من المنصة دون إذن كتابي مسبق.",
    en: "This platform and all its contents, designs, and software are the exclusive property of the developer Kareem Shaker. Copying, reproducing, or distributing any part of the platform without prior written permission is strictly prohibited.",
  },
  aiUse: { ar: "استخدام الذكاء الاصطناعي", en: "Artificial Intelligence Use" },
  aiUseDesc: {
    ar: "تستخدم المنصة تقنيات الذكاء الاصطناعي المتقدمة، وتحديداً واجهة برمجة التطبيقات (API) الخاصة بنموذج Gemini من Google في قسم المحادثة (الشات). يتم استخدام هذه التقنية لمساعدة الطلاب في الإجابة على استفساراتهم التعليمية. يجب استخدام هذه الميزة للأغراض التعليمية فقط.",
    en: "The platform uses advanced AI technologies, specifically the Google Gemini API in the chat section, to assist students with their educational inquiries. This feature must be used for educational purposes only.",
  },
  generalConduct: { ar: "السلوك العام", en: "General Conduct" },
  generalConductDesc: {
    ar: "يُتوقع من جميع المستخدمين (طلاب ومعلمين) الالتزام بالسلوك اللائق والمحترم داخل المنصة، سواء في التعليقات أو في غرف الدردشة. أي إساءة استخدام قد تؤدي إلى تعليق الحساب أو حظره نهائياً.",
    en: "All users (students and teachers) are expected to adhere to decent and respectful behavior within the platform, whether in comments or chat rooms. Any misuse may result in account suspension or permanent ban.",
  },
  modifications: { ar: "التعديلات", en: "Modifications" },
  modificationsDesc: {
    ar: "نحتفظ بالحق في تعديل أو تغيير هذه الشروط في أي وقت. سيتم إشعار المستخدمين بأي تغييرات جوهرية، واستمرارك في استخدام المنصة يعني موافقتك على الشروط المعدلة.",
    en: "We reserve the right to modify or change these terms at any time. Users will be notified of any material changes, and your continued use of the platform constitutes your acceptance of the modified terms.",
  },
  privacyIntro: {
    ar: "نحن في منصة المذاكرة نولي اهتماماً بالغاً بخصوصية بياناتك. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية.",
    en: "At Al-Mozakra Platform, we take your privacy very seriously. This policy explains how we collect, use, and protect your personal information.",
  },
  dataCollection: { ar: "جمع البيانات", en: "Data Collection" },
  dataCollectionDesc: {
    ar: "عند تسجيلك في المنصة، نقوم بجمع بياناتك الأساسية مثل (الاسم، رقم الهاتف، المرحلة الدراسية، تاريخ الميلاد، والجنس). هذه البيانات ضرورية لإنشاء حسابك وتخصيص التجربة التعليمية لك.",
    en: "When you register on the platform, we collect your basic data such as (name, phone number, educational stage, date of birth, and gender). This data is necessary to create your account and personalize your educational experience.",
  },
  activityLogPolicy: { ar: "سجل النشاطات (Activity Log)", en: "Activity Log" },
  activityLogDesc: {
    ar: "لضمان جودة الخدمة ومتابعة التطور الأكاديمي، يتم تسجيل وتتبع كافة نشاطات الطالب داخل المنصة. يشمل ذلك (على سبيل المثال لا الحصر):",
    en: "To ensure service quality and track academic progress, all student activities within the platform are recorded and tracked. This includes (but is not limited to):",
  },
  activity1: {
    ar: "أوقات تسجيل الدخول والخروج.",
    en: "Login and logout times.",
  },
  activity2: {
    ar: "الملفات ومقاطع الفيديو التي تم فتحها أو مشاهدتها.",
    en: "Files and videos opened or viewed.",
  },
  activity3: {
    ar: "الرسائل المرسلة في غرف الدردشة.",
    en: "Messages sent in chat rooms.",
  },
  activity4: {
    ar: "التعليقات المكتوبة على المحتوى التعليمي.",
    en: "Comments written on educational content.",
  },
  activity5: { ar: "تحديثات الملف الشخصي.", en: "Profile updates." },
  dataUse: { ar: "استخدام البيانات", en: "Data Use" },
  dataUseDesc: {
    ar: "تُستخدم البيانات المجمعة وسجل النشاطات حصرياً للأغراض التالية:",
    en: "The collected data and activity log are used exclusively for the following purposes:",
  },
  dataUse1: {
    ar: "تحسين وتطوير المحتوى التعليمي.",
    en: "Improving and developing educational content.",
  },
  dataUse2: {
    ar: "متابعة مستوى الطالب من قبل الإدارة والمعلمين.",
    en: "Tracking the student's level by administration and teachers.",
  },
  dataUse3: {
    ar: "الحفاظ على أمان المنصة ومنع أي إساءة استخدام.",
    en: "Maintaining platform security and preventing misuse.",
  },
  dataProtection: { ar: "حماية البيانات", en: "Data Protection" },
  dataProtectionDesc: {
    ar: "نحن نتخذ كافة الإجراءات التقنية والأمنية اللازمة لحماية بياناتك من الوصول غير المصرح به. لا يتم مشاركة بياناتك الشخصية أو سجل نشاطاتك مع أي أطراف خارجية لأغراض تسويقية أو تجارية.",
    en: "We take all necessary technical and security measures to protect your data from unauthorized access. Your personal data or activity log is not shared with any third parties for marketing or commercial purposes.",
  },

  // Quiz Responses
  quizQ: { ar: "سؤال", en: "Question" },
  excellent: { ar: "ممتاز! 🎉", en: "Excellent! 🎉" },
  goodTry: { ar: "جيد، حاول مرة أخرى! 💪", en: "Good, try again! 💪" },
  needsReview: { ar: "تحتاج مراجعة! 📖", en: "Needs review! 📖" },
  answered: { ar: "أجبت", en: "You answered" },
  outOf: { ar: "من", en: "out of" },
  correctly: { ar: "بشكل صحيح", en: "correctly" },
  nextQuestionBtn: { ar: "السؤال التالي ←", en: "Next Question ←" },
  showResultBtn: { ar: "عرض النتيجة", en: "Show Result" },

  // Chat & Messaging
  smartAssistant: { ar: "المساعد الذكي", en: "Smart Assistant" },
  groupChat: { ar: "محادثة جماعية", en: "Group Chat" },
  openChat: { ar: "فتح المحادثة", en: "Open Chat" },
  closeChat: { ar: "قفل المحادثة", en: "Lock Chat" },
  showNames: { ar: "إظهار الأسماء", en: "Show Names" },
  hideNames: { ar: "إخفاء الأسماء", en: "Hide Names" },
  forbiddenWords: { ar: "الكلمات المحظورة", en: "Forbidden Words" },
  clearChatText: { ar: "مسح المحادثة", en: "Clear Chat" },
  hideMyIdentity: { ar: "إخفاء هويتي", en: "Hide my identity" },
  anonymous: { ar: "مجهول", en: "Anonymous" },
  audioRecord: { ar: "تسجيل صوتي", en: "Voice Record" },
  image: { ar: "صورة", en: "Image" },
  video: { ar: "فيديو", en: "Video" },
  askAssistant: { ar: "اسأل المساعد الذكي...", en: "Ask Smart Assistant..." },
  writeMessage: { ar: "اكتب رسالة...", en: "Write a message..." },
  bannedFromChat: {
    ar: "تم حظرك من المحادثة الجماعية",
    en: "You have been banned from the group chat",
  },
  chatClosedByAdmin: {
    ar: "المحادثة مغلقة من قبل الإدارة",
    en: "Chat is closed by admin",
  },
  viewedBy: { ar: "تمت المشاهدة بواسطة", en: "Viewed by" },
  nobodyViewed: {
    ar: "لم يشاهد أحد هذه الرسالة بعد",
    en: "No one has viewed this message yet",
  },
  banFromChat: { ar: "حظر من الشات", en: "Ban from chat" },
  unban: { ar: "إلغاء الحظر", en: "Unban" },
  joined: { ar: "انضم:", en: "Joined:" },
  addForbiddenWords: {
    ar: "أدخل الكلمات التي تريد حظرها في الشات، كل كلمة في سطر.",
    en: "Enter words to ban in chat, one per line.",
  },
  wordFilteredUpdated: {
    ar: "تم تحديث قائمة الكلمات المحظورة",
    en: "Forbidden words list updated",
  },
  editedMsg: { ar: "(معدل)", en: "(Edited)" },

  // Tools
  deleteAllNotes: {
    ar: "هل أنت متأكد من مسح جميع الملاحظات؟",
    en: "Are you sure you want to delete all notes?",
  },
  notesDeleted: { ar: "تم مسح جميع الملاحظات.", en: "All notes deleted." },
  copySuccess: { ar: "تم النسخ!", en: "Copied!" },
  breakTime: { ar: "وقت استراحة قصيرة!", en: "Short Break Time!" },
  focusTime: {
    ar: "انتهت الاستراحة، وقت التركيز!",
    en: "Break over, focus time!",
  },
  writeNotesLong: {
    ar: "اكتب ملاحظاتك، افكارك، مهامك هنا...",
    en: "Write your notes, ideas, tasks here...",
  },
  downloadBtn: { ar: "تحميل", en: "Download" },
  copyBtn: { ar: "نسخ", en: "Copy" },
  deleteAllBtn: { ar: "حذف الكل", en: "Delete All" },

  // Language
  language: { ar: "EN", en: "ع" },
  languageFull: { ar: "English", en: "العربية" },
  tabComments: { ar: "التعليقات", en: "Comments" },
  descriptionLabel: { ar: "الوصف", en: "Description" },
  noComments: { ar: "لا توجد تعليقات", en: "No comments" },
  add: { ar: "إضافة", en: "Add" },
  file: { ar: "ملف", en: "File" },
  parentSection: { ar: "القسم التابع له", en: "Parent Section" },
  typeFileDetails: { ar: "اكتب تفاصيل الملف...", en: "Type file details..." },
  deletedUser: { ar: "مستخدم محذوف", en: "Deleted User" },
  title: { ar: "العنوان", en: "Title" },
  chooseSubject: { ar: "اختر المادة", en: "Choose Subject" },

  // Verification Codes
  verificationCodesTitle: { ar: "أكواد التحقق", en: "Verification Codes" },
  generateCodes: { ar: "توليد الأكواد", en: "Generate Codes" },
  numToGenLabel: { ar: "العدد:", en: "Count:" },
  codeLengthLabel: { ar: "طول الكود:", en: "Code Length:" },
  alphanumericLabel: { ar: "أرقام مع حروف إنجليزية", en: "Alphanumeric (EN)" },
  generateNow: { ar: "توليد الآن", en: "Generate Now" },
  cleanAndExport: { ar: "التنظيف والتصدير", en: "Clean & Export" },
  deleteUnusedOnly: { ar: "حذف المتاح فقط", en: "Delete Unused Only" },
  deleteUsedOnly: { ar: "حذف المستخدم فقط", en: "Delete Used Only" },
  exportCSV: { ar: "تصدير CSV", en: "Export CSV" },
  deleteAll: { ar: "حذف الكل", en: "Delete All" },
  totalCodes: { ar: "الإجمالي:", en: "Total:" },
  codeCol: { ar: "الكود", en: "Code" },
  statusCol: { ar: "الحالة", en: "Status" },
  usedByCol: { ar: "استخدم بواسطة", en: "Used By" },
  usedAtCol: { ar: "تاريخ الاستخدام", en: "Used At" },
  unused: { ar: "متاح", en: "Available" },
  used: { ar: "مستخدم", en: "Used" },
  noCodesFound: { ar: "لا توجد أكواد", en: "No codes found" },
  confirmDeleteAllTitle: { ar: "تأكيد حذف الكل", en: "Confirm Delete All" },
  confirmDeleteUnusedTitle: { ar: "حذف غير المستخدم", en: "Delete Unused" },
  confirmDeleteUsedTitle: { ar: "حذف المستخدم", en: "Delete Used" },
  confirmDeleteAllDesc: {
    ar: "هل أنت متأكد من حذف جميع الأكواد (المتاحة والمستخدمة)؟",
    en: "Are you sure you want to delete all codes (available and used)?",
  },
  confirmDeleteUnusedDesc: {
    ar: "هل تريد حذف جميع الأكواد المتاحة؟",
    en: "Do you want to delete all available codes?",
  },
  confirmDeleteUsedDesc: {
    ar: "هل تريد حذف سجل الأكواد المستخدمة؟",
    en: "Do you want to delete the used codes history?",
  },
  alphanumericPrefix: { ar: "أرقام مع حروف إنجليزية", en: "Numbers & Letters" },

  // Settings Extras
  fileType: { ar: "نوع الملف", en: "File Type" },
  textContent: { ar: "المحتوى النصي", en: "Text Content" },
  typeTextHere: { ar: "اكتب النص هنا...", en: "Type text here..." },
  contentUrl: { ar: "رابط المحتوى", en: "Content URL" },
  prefixSettings: { ar: "إعدادات البادئة", en: "Prefix Settings" },
  prefixExample: { ar: "مثال: STD", en: "Example: STD" },
  savePrefixBtn: { ar: "حفظ البادئة", en: "Save Prefix" },
  getCodeUrlLabel: { ar: "رابط الحصول على كود", en: "Get Code Link" },
  codeUrlPlaceholder: {
    ar: "مثلا: https://example.com/get-code",
    en: "e.g. https://example.com/get-code",
  },
  codeUrlInfo: {
    ar: 'سيظهر الرابط عند الضغط على "احصل على كود"',
    en: "Link will appear when clicking 'Get code'",
  },
  time12h: { ar: "12 ساعة (مساءً/صباحاً)", en: "12 Hours (AM/PM)" },
  time24h: { ar: "24 ساعة", en: "24 Hours" },
  timeFormatUpdated: { ar: "تم تغيير التنسيق", en: "Format updated" },
  systemMessageTitle: { ar: "رسالة النظام", en: "System Message" },
  systemMessageDesc: {
    ar: "ستظهر هذه الرسالة للطلاب عند تسجيل الدخول.",
    en: "This message will appear to students on login.",
  },
  typeMessageHere: {
    ar: "اكتب رسالتك هنا...",
    en: "Type your message here...",
  },
  enableMessage: { ar: "تفعيل الرسالة", en: "Enable Message" },
  displayModeLabel: { ar: "نمط عرض الرسالة", en: "Message Display Mode" },
  displayModePopup: { ar: "نافذة منبثقة", en: "Popup Window" },
  displayModeMarquee: { ar: "شريط متحرك", en: "Moving Bar" },
  saveSettingsMsg: { ar: "حفظ إعدادات الرسالة", en: "Save Message Settings" },
  systemMsgUpdated: {
    ar: "تم تحديث رسالة النظام",
    en: "System message updated",
  },
  codeUrlUpdated: { ar: "تم تحديث رابط الأكواد", en: "Code URL updated" },
  prefixSaved: { ar: "تم حفظ البادئة", en: "Prefix saved" },
  musicUrlSaved: { ar: "تم حفظ رابط الموسيقى", en: "Music URL saved" },
  supportUrlSaved: { ar: "تم حفظ رابط الدعم", en: "Support URL saved" },
  changesSaved: { ar: "تم حفظ التغييرات", en: "Changes saved" },
  digits: { ar: "خانة", en: "digits" },
  phoneLengthPlaceholder: { ar: "مثلا: 11 (مصر)", en: "e.g. 11 (Egypt)" },
  enablePrefixPass: {
    ar: "تفعيل البادئة في كلمات السر",
    en: "Enable Prefix in Passwords",
  },
  enablePrefixCodes: {
    ar: "تفعيل البادئة في الأكواد",
    en: "Enable Prefix in Codes",
  },
  genAlphaNumericPass: {
    ar: "توليد كلمات سر (أرقام وحروف)",
    en: "Generate Alphanumeric Passwords",
  },
  enableVerificationCodes: {
    ar: "تفعيل نظام أكواد التحقق للطلاب الجدد",
    en: "Enable Verification Codes for New Students",
  },
  codesGenerated: {
    ar: "تم توليد {num} كود بنجاح",
    en: "Successfully generated {num} codes",
  },
  codePrefix: { ar: "بادئة الكود", en: "Code Prefix" },
  prefixExampleCodes: { ar: "مثلا: MK-", en: "e.g. MK-" },
  urlPlaceholder: { ar: "https://...", en: "https://..." },
  disabledLabel: { ar: "معطل", en: "Disabled" },
  enabled: { ar: "مفعل", en: "Enabled" },
  codeGetUrl: { ar: "رابط الحصول على كود", en: "Get Code Link" },
  enableCodes: { ar: "تفعيل نظام الأكواد", en: "Enable Codes System" },
  applyToNewCodes: {
    ar: "تطوير البادئة للأكواد الجديدة",
    en: "Apply prefix to new codes",
  },
  execute: { ar: "تنفيذ", en: "Execute" },
};

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const I18nContext = createContext<I18nContextType>({
  lang: "ar",
  setLang: () => {},
  t: (key: string) => key,
  dir: "rtl",
});

export const I18nProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("appLang");
      return saved === "en" || saved === "ar" ? saved : "ar";
    }
    return "ar";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("appLang", l);
    document.documentElement.setAttribute("dir", l === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", l);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
