export type Locale = "en" | "ar";

export type TranslationKey = keyof typeof en;

const en = {
  // Navigation
  "nav.home": "Home",
  "nav.location": "Location",
  "nav.calendar": "Calendar",
  "nav.settings": "Settings",
  "nav.logo.prayer": "miqaat",
  "nav.logo.times": "",

  // Location page
  "location.title": "Choose Location",
  "location.subtitle": "Select your Wilaya in Algeria to get accurate prayer times.",
  "location.wilaya.label": "Wilaya (Province)",
  "location.wilaya.placeholder": "— Select a Wilaya —",
  "location.wilaya.loading": "Loading wilayas…",
  "location.confirm": "Confirm Location",
  "location.or": "OR",
  "location.gps.detect": "Use my GPS location",
  "location.gps.detecting": "Detecting location...",
  "location.gps.success": "Location detected!",
  "location.gps.error.title": "GPS Unavailable",
  "location.gps.error.unavailable": "GPS is not available on this device. Please select your Wilaya manually.",
  "location.gps.error.failed": "Could not determine your location. Please select your Wilaya manually.",
  "location.gps.error.denied": "Location access was denied. Please select your Wilaya from the dropdown below.",
  "location.change": "Change Location",

  // Home page
  "home.currentPrayer": "Current Prayer",
  "home.prayerTime": "Prayer Time",
  "home.nextPrayer": "Next Prayer",
  "home.hours": "Hours",
  "home.minutes": "Minutes",
  "home.seconds": "Seconds",
  "home.startsAt": "Starts at",
  "home.schedule": "Today's Prayer Schedule",
  "home.now": "Now",
  "home.forbiddenPrayer": "Forbidden prayer times (except fard)",
  "home.duha": "Prayer of Duha",

  // Prayer names
  "prayer.Fajr": "Fajr",
  "prayer.Sunrise": "Sunrise",
  "prayer.Duha": "Duha",
  "prayer.Dhuhr": "Dhuhr",
  "prayer.Asr": "Asr",
  "prayer.Maghrib": "Maghrib",
  "prayer.Isha": "Isha",

  // Additional info
  "info.sunrise": "Sunrise",
  "info.sunset": "Sunset",
  "info.hijriDate": "Hijri Date",
  "info.timezone": "Timezone",
  "info.midnight": "Midnight",
  "info.lastThird": "Last Third of the Night",

  // Calendar page
  "calendar.title": "Prayer Times Calendar",
  "calendar.weekTitle": "Weekly Prayer Calendar",
  "calendar.day": "Day",
  "calendar.today": "Today",
  "calendar.weekly": "Weekly",
  "calendar.monthly": "Monthly",
  "calendar.print": "Print",
  "calendar.error": "Failed to load calendar data. Please check your connection.",

  // Settings page
  "settings.title": "Settings",

  "settings.theme": "Appearance",
  "settings.theme.desc": "Choose the app appearance. \"System\" follows your device settings.",
  "settings.theme.light": "Light",
  "settings.theme.dark": "Dark",
  "settings.theme.system": "System",
  "settings.timeFormat": "Time Format",
  "settings.timeFormat.desc": "Choose how prayer times are displayed throughout the app.",
  "settings.timeFormat.12h": "12-Hour",
  "settings.timeFormat.12h.desc": "AM / PM format",
  "settings.timeFormat.24h": "24-Hour",
  "settings.timeFormat.24h.desc": "Military format",
  "settings.notifications": "Prayer Notifications",
  "settings.notifications.desc": "Receive a notification 1 minute before each prayer",
  "settings.notifications.enabled": "Enabled",
  "settings.notifications.disabled": "Disabled",
  "settings.notifications.denied": "Notifications blocked by browser",
  "settings.notifications.unsupported": "Notifications are not supported in this browser",
  "settings.notifications.limitation": "Note: Notifications only work while the app is open in a tab.",
  "settings.notifications.scheduled": "Notifications scheduled for today's prayers.",
  "settings.notifications.blocked.title": "Notifications Blocked",
  "settings.notifications.blocked.guide": "Your browser is blocking notifications. Please click the lock icon in your address bar to allow them for this site.",

  "settings.language": "Language",
  "settings.language.desc": "Choose your preferred language for the app interface.",
  "settings.save": "Save Settings",
  "settings.reset": "Reset to Defaults",
  "settings.unsavedChanges": "You have unsaved changes",
  "settings.saving": "Saving...",
  "settings.saved": "Settings saved successfully",
  "settings.reset.success": "Settings reset to defaults",


  // Footer
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",
  "footer.about": "About",
  "footer.links": "Links",
  "footer.contact": "Contact",
  "footer.slogan": "A site to display prayer times in Algerian Wilayas",
  "footer.contactDesc": "You can leave a message for me",
  "footer.sendMessage": "Send a Message",
  "footer.subCopy": "Miqaat - Prayer times in Algeria",
  "footer.copy": "PrayerTimes App. All rights reserved.",

  // Notifications
  "notification.title": "Prayer Time Approaching",
  "notification.body": "{prayer} prayer in 1 minute",

  // Errors
  "error.fetchPrayer": "Failed to fetch prayer times. Please check your connection.",
  "error.retry": "Try Again",
} as const;

const ar: Record<TranslationKey, string> = {
  // Navigation
  "nav.home": "الرئيسية",
  "nav.location": "الموقع",
  "nav.calendar": "التقويم",
  "nav.settings": "الإعدادات",
  "nav.logo.prayer": "ميقات",
  "nav.logo.times": "",

  // Location page
  "location.title": "اختر الموقع",
  "location.subtitle": "اختر ولايتك لتحصل على اوقات الصلاة حسب مركز الولاية",
  "location.wilaya.label": "الولاية",
  "location.wilaya.placeholder": "— اختر ولاية —",
  "location.wilaya.loading": "جاري تحميل الولايات…",
  "location.confirm": "تأكيد الموقع",
  "location.or": "أو",
  "location.gps.detect": "استخدم موقعي GPS",
  "location.gps.detecting": "جاري تحديد الموقع...",
  "location.gps.success": "تم تحديد الموقع!",
  "location.gps.error.title": "GPS غير متوفر",
  "location.gps.error.unavailable": "خدمة GPS غير متوفرة على هذا الجهاز. يرجى اختيار ولايتك يدوياً.",
  "location.gps.error.failed": "تعذر تحديد موقعك. يرجى اختيار ولايتك يدوياً.",
  "location.gps.error.denied": "تم رفض الوصول إلى الموقع. يرجى اختيار ولايتك من القائمة أدناه.",
  "location.change": "تغيير الموقع",

  // Home page
  "home.currentPrayer": "الصلاة الحالية",
  "home.prayerTime": "وقت الصلاة",
  "home.nextPrayer": "الصلاة القادمة",
  "home.hours": "ساعات",
  "home.minutes": "دقائق",
  "home.seconds": "ثواني",
  "home.startsAt": "تبدأ في",
  "home.schedule": "مواقيت الصلاة اليوم",
  "home.now": "الآن",
  "home.forbiddenPrayer": "وقت نهي (الا الفريضة)",
  "home.duha": "صلاة الضحى",

  // Prayer names
  "prayer.Fajr": "الفجر",
  "prayer.Sunrise": "الشروق",
  "prayer.Duha": "الضحى",
  "prayer.Dhuhr": "الظهر",
  "prayer.Asr": "العصر",
  "prayer.Maghrib": "المغرب",
  "prayer.Isha": "العشاء",

  // Additional info
  "info.sunrise": "الشروق",
  "info.sunset": "الغروب",
  "info.hijriDate": "التاريخ الهجري",
  "info.timezone": "المنطقة الزمنية",
  "info.midnight": "منتصف الليل",
  "info.lastThird": "ثلث الليل الأخير",

  // Calendar page
  "calendar.title": "تقويم أوقات الصلاة",
  "calendar.weekTitle": "تقويم الصلاة الأسبوعي",
  "calendar.day": "اليوم",
  "calendar.today": "اليوم",
  "calendar.weekly": "أسبوعي",
  "calendar.monthly": "شهري",
  "calendar.print": "طباعة",
  "calendar.error": "فشل في تحميل بيانات التقويم. يرجى التحقق من الاتصال.",

  // Settings page
  "settings.title": "الإعدادات",

  "settings.theme": "المظهر",
  "settings.theme.desc": "اختر مظهر التطبيق. \"النظام\" يتبع إعدادات جهازك.",
  "settings.theme.light": "فاتح",
  "settings.theme.dark": "داكن",
  "settings.theme.system": "النظام",
  "settings.timeFormat": "تنسيق الوقت",
  "settings.timeFormat.desc": "اختر كيف يتم عرض أوقات الصلاة في التطبيق.",
  "settings.timeFormat.12h": "12 ساعة",
  "settings.timeFormat.12h.desc": "تنسيق صباحي/مسائي",
  "settings.timeFormat.24h": "24 ساعة",
  "settings.timeFormat.24h.desc": "تنسيق 24 ساعة",
  "settings.notifications": "إشعارات الصلاة",
  "settings.notifications.desc": "تلقي إشعار قبل دقيقة واحدة من كل صلاة",
  "settings.notifications.enabled": "مفعّل",
  "settings.notifications.disabled": "معطّل",
  "settings.notifications.denied": "الإشعارات محظورة من المتصفح",
  "settings.notifications.unsupported": "الإشعارات غير مدعومة في هذا المتصفح",
  "settings.notifications.limitation": "ملاحظة: تعمل الإشعارات فقط أثناء فتح التطبيق في علامة تبويب.",
  "settings.notifications.scheduled": "تمت جدولة الإشعارات لصلوات اليوم.",
  "settings.notifications.blocked.title": "الإشعارات محظورة",
  "settings.notifications.blocked.guide": "متصفحك يحظر الإشعارات. يرجى الضغط على أيقونة القفل في شريط العنوان للسماح بالتنبيهات لهذا الموقع.",

  "settings.language": "اللغة",
  "settings.language.desc": "اختر لغتك المفضلة لواجهة التطبيق.",
  "settings.save": "حفظ الإعدادات",
  "settings.reset": "إعادة تعيين",
  "settings.unsavedChanges": "لديك تغييرات غير محفوظة",
  "settings.saving": "جاري الحفظ...",
  "settings.saved": "تم حفظ الإعدادات بنجاح",
  "settings.reset.success": "تمت إعادة الإعدادات الافتراضية",


  // Footer
  "footer.privacy": "سياسة الخصوصية",
  "footer.terms": "شروط الخدمة",
  "footer.about": "حول",
  "footer.links": "روابط",
  "footer.contact": "تواصل",
  "footer.slogan": "موقع لعرض أوقات الصلاة في ولايات الجزائر",
  "footer.contactDesc": "يمكنك ترك رسالة لي",
  "footer.sendMessage": "أرسل رسالة",
  "footer.subCopy": "ميقات - أوقات الصلاة في الجزائر",
  "footer.copy": "جميع الحقوق محفوظة.",

  // Notifications
  "notification.title": "اقتراب وقت الصلاة",
  "notification.body": "صلاة {prayer} بعد دقيقة واحدة",

  // Errors
  "error.fetchPrayer": "فشل في تحميل بيانات التقويم. يرجى التحقق من الاتصال.",
  "error.retry": "إعادة المحاولة",
};

export const translations: Record<Locale, Record<TranslationKey, string>> = { en, ar };
