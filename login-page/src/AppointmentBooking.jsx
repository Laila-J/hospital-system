// ============================================================
//  المكتبات المستخدمة من React
//  useState  : لحفظ البيانات التي تتغير (مثل قيم الفورم)
//  useEffect : لتنفيذ كود عند تحميل الصفحة لأول مرة
//  useRef    : لحفظ قيمة لا تُعيد رسم الصفحة عند تغييرها
// ============================================================
import { useState, useEffect, useRef } from "react";


// ============================================================
//  قائمة الأطباء الافتراضية
//  كل طبيب له: رقم تعريفي، اسم بالعربي والإنجليزي،
//  تخصص بالعربي والإنجليزي، وهل هو متاح أم لا
// ============================================================
const DEFAULT_DOCTORS = [
  {
    id: 1,
    nameEn: "Dr. Sarah Al-Farsi",
    nameAr: "د. سارة الفارسي",
    specialtyEn: "Cardiology",
    specialtyAr: "طب القلب",
    available: true,   // true = متاح
  },
  {
    id: 2,
    nameEn: "Dr. Omar Othman",
    nameAr: "د. عمر عثمان",
    specialtyEn: "Orthopedics",
    specialtyAr: "العظام",
    available: true,
  },
  {
    id: 3,
    nameEn: "Dr. Layla Mansour",
    nameAr: "د. ليلى منصور",
    specialtyEn: "Pediatrics",
    specialtyAr: "طب الأطفال",
    available: true,
  },
  {
    id: 4,
    nameEn: "Dr. Khalid Ibrahim",
    nameAr: "د. خالد إبراهيم",
    specialtyEn: "Neurology",
    specialtyAr: "طب الأعصاب",
    available: false,  // false = غير متاح
  },
  {
    id: 5,
    nameEn: "Dr. Nora Saeed",
    nameAr: "د. نورة سعيد",
    specialtyEn: "Dermatology",
    specialtyAr: "الجلدية",
    available: true,
  },
];


// ============================================================
//  قاموس الترجمة (النصوص بالعربي والإنجليزي)
//  T["en"] = النصوص الإنجليزية
//  T["ar"] = النصوص العربية
//  بدلاً من كتابة if/else في كل مكان، نختار اللغة مرة واحدة
// ============================================================
const T = {
  en: {
    badge:       "CLINICAL PRECISION",
    headline1:   "Your Health,",
    headline2:   "Our Priority.",
    sub:         "Secure your consultation with Al Othman's world-class medical specialists. Human-centric care powered by advanced medical technology.",
    support:     "24/7 Support",
    phone:       "+963 992 966 431",   // رقم سوري
    formTitle:   "Book Appointment",
    formSub:     "New appointment",
    step:        "Step 1 of 2",
    patientName: "Patient Name",
    phoneNumber: "Phone Number",
    namePH:      "laila younes",        // PH = placeholder (نص التلميح داخل الحقل)
    phonePH:     "+963 9XX XXX XXX",
    specialist:  "Specialist / Doctor",
    specialistPH:"Select a Specialist",
    date:        "Preferred Date",
    time:        "Preferred Time",
    confirm:     "Confirm Appointment",
    confirmAr:   "تأكيد الموعد",
    note:        "By confirming, you agree to our terms of service and privacy policy regarding your medical data.",
    successTitle:"Booking Confirmed!",
    successMsg:  "A confirmation SMS will be sent to your mobile instantly.",
    errName:     "Patient name is required.",
    errPhone:    "A valid phone number is required.",
    errDoctor:   "Please select a specialist.",
    errDate:     "Please select a preferred date.",
    errTime:     "Please select a preferred time.",
    errPast:     "Please select a future date.",
    errAll:      "Please fill in all required fields.",
    unavail:     "Unavailable",
    loading:     "Booking…",
    tryAgain:    "Book Another",
    diag:        "24/7 Diagnostics",
    diagSub:     "Precision results in record time.",
    smart:       "Smart Care",
    top:         "Top Rated",
    topSub:      "Award-winning surgery center",
    avail:       "Available Now",
  },
  ar: {
    badge:       "الدقة السريرية",
    headline1:   "صحتك،",
    headline2:   "أولويتنا.",
    sub:         "احجز استشارتك مع أفضل المتخصصين الطبيين في مستشفى العثمان. رعاية متمحورة حول الإنسان بتقنيات طبية متقدمة.",
    support:     "دعم على مدار الساعة",
    phone:       "+963 992 966 431",
    formTitle:   "حجز موعد",
    formSub:     "حجز موعد جديد",
    step:        "الخطوة ١ من ٢",
    patientName: "اسم المريض",
    phoneNumber: "رقم الجوال",
    namePH:      "اسمك هنا",
    phonePH:     "+963 9XX XXX XXX",
    specialist:  "اختيار الطبيب",
    specialistPH:"اختر طبيباً",
    date:        "التاريخ المفضل",
    time:        "الوقت المفضل",
    confirm:     "تأكيد الموعد",
    confirmAr:   "Confirm Appointment",
    note:        "بالتأكيد، أنت توافق على شروط الخدمة وسياسة الخصوصية المتعلقة ببياناتك الطبية.",
    successTitle:"تم تأكيد الحجز!",
    successMsg:  "سيتم إرسال رسالة تأكيد فورية إلى جوالك.",
    errName:     "اسم المريض مطلوب.",
    errPhone:    "يرجى إدخال رقم جوال صحيح.",
    errDoctor:   "يرجى اختيار طبيب.",
    errDate:     "يرجى اختيار تاريخ مفضل.",
    errTime:     "يرجى اختيار وقت مفضل.",
    errPast:     "يرجى اختيار تاريخ مستقبلي.",
    errAll:      "يرجى ملء جميع الحقول المطلوبة.",
    unavail:     "غير متاح",
    loading:     "جارٍ الحجز…",
    tryAgain:    "حجز موعد آخر",
    diag:        "تشخيص ٢٤/٧",
    diagSub:     "نتائج دقيقة في أسرع وقت.",
    smart:       "رعاية ذكية",
    top:         "الأعلى تقييماً",
    topSub:      "مركز جراحة حاصل على جوائز",
    avail:       "متاح الآن",
  },
};


// ============================================================
//  دالة مساعدة: تُرجع تاريخ اليوم بصيغة "YYYY-MM-DD"
//  مثال: "2025-06-08"
//  نستخدمها لمنع اختيار تواريخ في الماضي
// ============================================================
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}


// ============================================================
//  دالة تُحاكي إرسال البيانات للسيرفر (وهمية للتجربة)
//  تنتظر 1.4 ثانية ثم ترجع نجاح
//  في المشروع الحقيقي ستُستبدل بـ fetch() أو axios
// ============================================================
function simulateApiCall(data) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({ ok: true, data: data });
    }, 1400);
  });
}


// ============================================================
//  ألوان الواجهة (ثابتة — لا تتغير أبداً)
//  نضعها خارج المكوّن حتى لا تُعاد إنشاؤها عند كل render
//  navy  = أزرق داكن  |  blue  = أزرق فاتح
//  slate = رمادي      |  muted = رمادي فاتح
//  border= لون الحدود |  bg    = لون الخلفية
//  err   = لون الخطأ (أحمر)
// ============================================================
const COLORS = {
  navy:   "#0b3d7a",
  blue:   "#1565c0",
  slate:  "#64748b",
  muted:  "#94a3b8",
  border: "#e2e8f0",
  bg:     "#f8fafc",
  err:    "#ef4444",
};


// ============================================================
//  CSS عام للصفحة
//  نكتبه هنا كنص ثم نُضيفه لـ <head> مرة واحدة عند التحميل
//  يحتوي على: الخطوط، التركيز، الأنيميشن، الـ Responsive
// ============================================================
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap');

/* إزالة الـ margin والـ padding الافتراضيين من كل العناصر */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* الخط الرئيسي للصفحة */
.aoh-root { font-family: 'Plus Jakarta Sans', 'Tajawal', sans-serif; }

/* تأثير التركيز عند الضغط على حقل الإدخال */
.aoh-input:focus, .aoh-select:focus {
  border-color: #1565c0 !important;
  box-shadow: 0 0 0 3px rgba(21,101,192,0.13) !important;
  background: #fff !important;
  outline: none;
}

/* تلوين الحقل باللون الأحمر عند وجود خطأ */
.aoh-input.err { border-color: #ef4444 !important; background: #fff5f5 !important; }

/* تأثير الزر عند تمرير الماوس */
.aoh-btn-primary:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 30px rgba(11,61,122,0.45) !important;
}
.aoh-btn-primary:not(:disabled):active { transform: translateY(0); }
.aoh-lang-btn:hover  { background: #0b3d7a !important; color: #fff !important; border-color: #0b3d7a !important; }
.aoh-footer-lnk:hover { color: #0b3d7a !important; }
.aoh-nav-item:hover  { color: #0b3d7a !important; }

/* أنيميشن: ظهور من الأسفل للأعلى */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* أنيميشن: نبضة خضراء عند النجاح */
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0   rgba(34,197,94,.38); }
  50%       { box-shadow: 0 0 0 9px rgba(34,197,94,0);   }
}

/* أنيميشن: دوران لأيقونة التحميل */
@keyframes spin { to { transform: rotate(360deg); } }

.aoh-card        { animation: fadeUp  .45s ease both; }
.aoh-hero        { animation: fadeUp  .45s .1s ease both; }
.aoh-success-icon{ animation: pulse  1.8s ease infinite; }
.aoh-spin        { display: inline-block; animation: spin .8s linear infinite; }

/* تصميم الموبايل — عند عرض أقل من 768px */
@media (max-width: 768px) {
  .aoh-page      { grid-template-columns: 1fr !important; padding: 1.5rem 1rem 3rem !important; gap: 2rem !important; }
  .aoh-form-grid { grid-template-columns: 1fr !important; }
  .aoh-nav-links { display: none !important; }
}
@media (max-width: 480px) { .aoh-card { padding: 1.25rem !important; } }
`;


// ============================================================
//  مكوّن حقل الإدخال (Field)
//  ────────────────────────────────────────────────────────
//  ⚠️ مهم جداً: هذا المكوّن مُعرَّف خارج الدالة الرئيسية
//  لأنه لو كان بالداخل سيُعاد إنشاؤه من الصفر عند كل تغيير
//  وهذا يُسبب فقدان الـ focus عند الكتابة
//  ────────────────────────────────────────────────────────
//  Props (المعطيات) التي يستقبلها:
//  name        = اسم الحقل (مثل "patientName")
//  label       = نص التسمية فوق الحقل
//  labelEn     = النص الإنجليزي الصغير (يظهر في وضع عربي فقط)
//  icon        = الأيقونة (إيموجي)
//  type        = نوع الحقل (text, tel, date, time)
//  placeholder = نص التلميح داخل الحقل
//  min         = أصغر قيمة مسموحة (للتاريخ)
//  errors      = كائن يحوي رسائل الأخطاء
//  form        = كائن يحوي قيم الفورم الحالية
//  onChange    = الدالة التي تُنفَّذ عند تغيير القيمة
//  loading     = هل الفورم بحالة تحميل؟
//  success     = هل تم الحجز بنجاح؟
//  isRtl       = هل الاتجاه من اليمين لليسار (عربي)؟
//  inputBase   = ستايل الإدخال الأساسي
// ============================================================
const Field = function ({
  name, label, labelEn, icon,
  type, placeholder, min,
  errors, form, onChange,
  loading, success, isRtl, inputBase,
}) {

  // هل يوجد خطأ في هذا الحقل؟
  const hasError = errors[name] ? true : false;

  // نحدد موضع الأيقونة: يمين في العربي، يسار في الإنجليزي
  const iconPosition = isRtl ? "right" : "left";

  // نضيف كلاس "err" إذا كان فيه خطأ
  const inputClass = hasError ? "aoh-input err" : "aoh-input";

  // ستايل إضافي عند الخطأ (يلوّن الحدود بالأحمر)
  const errorStyle = hasError
    ? { borderColor: COLORS.err, background: "#fff5f5" }
    : {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>

      {/* تسمية الحقل */}
      <label style={{
        fontSize: "0.78rem",
        fontWeight: 600,
        color: "#374151",
        display: "flex",
        justifyContent: "space-between",
      }}>
        {label}
        {/* نُظهر الاسم الإنجليزي الصغير فقط في وضع اللغة العربية */}
        {isRtl && labelEn && (
          <span style={{ fontSize: "0.72rem", color: COLORS.muted, fontWeight: 400 }}>
            {labelEn}
          </span>
        )}
      </label>

      {/* حاوية الأيقونة والحقل */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>

        {/* أيقونة داخل الحقل */}
        <span style={{
          position: "absolute",
          [iconPosition]: 12,     // يمين أو يسار حسب اللغة
          color: COLORS.muted,
          fontSize: 14,
          pointerEvents: "none",  // لا تتفاعل مع الماوس
          zIndex: 1,
        }}>
          {icon}
        </span>

        {/* حقل الإدخال */}
        <input
          className={inputClass}
          style={{ ...inputBase, ...errorStyle }}
          name={name}
          value={form[name]}
          onChange={onChange}
          type={type || "text"}
          placeholder={placeholder}
          min={min}
          disabled={loading || success}  // نُعطّله أثناء التحميل أو بعد النجاح
          aria-label={label}
        />
      </div>

      {/* رسالة الخطأ (تظهر فقط إذا كان فيه خطأ) */}
      {hasError && (
        <span style={{
          fontSize: "0.73rem",
          color: COLORS.err,
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}>
          ⚠ {errors[name]}
        </span>
      )}

    </div>
  );
};


// ============================================================
//  المكوّن الرئيسي: AppointmentBooking
//  ────────────────────────────────────────────────────────
//  Props التي يستقبلها من الخارج:
//  doctors     = قائمة الأطباء (الافتراضية هي DEFAULT_DOCTORS)
//  initialLang = اللغة الابتدائية ("en" أو "ar")
//  onSuccess   = دالة تُنفَّذ عند نجاح الحجز (اختيارية)
// ============================================================
export default function AppointmentBooking({
  doctors     = DEFAULT_DOCTORS,
  initialLang = "en",
  onSuccess,
}) {

  // ─── حالة اللغة ────────────────────────────────────────
  // lang     = اللغة الحالية ("en" أو "ar")
  // setLang  = الدالة لتغييرها
  const [lang, setLang] = useState(initialLang);

  // هل الاتجاه من اليمين لليسار؟ (صحيح فقط في العربي)
  const isRtl = lang === "ar";

  // نختار النصوص المناسبة للغة الحالية
  // مثلاً: t.formTitle سيكون "Book Appointment" أو "حجز موعد"
  const t = T[lang];


  // ─── حالة بيانات الفورم ────────────────────────────────
  // كائن يحوي قيم جميع الحقول، يبدأ كله فارغاً ""
  const [form, setForm] = useState({
    patientName:   "",
    phoneNumber:   "",
    doctorId:      "",
    preferredDate: "",
    preferredTime: "",
  });


  // ─── حالة الأخطاء ──────────────────────────────────────
  // كائن يحوي رسائل خطأ لكل حقل
  // مثال: { patientName: "اسم المريض مطلوب." }
  const [errors, setErrors] = useState({});

  // رسالة الخطأ العامة (تظهر في الأعلى)
  const [globalErr, setGlobalErr] = useState("");


  // ─── حالة الإرسال ──────────────────────────────────────
  // loading = true أثناء انتظار رد السيرفر
  const [loading, setLoading] = useState(false);

  // success = true بعد نجاح الحجز
  const [success, setSuccess] = useState(false);


  // ─── إضافة CSS للصفحة مرة واحدة فقط ─────────────────
  // useRef هنا يحفظ قيمة "هل أضفنا الـ CSS؟" بدون إعادة رسم
  const cssAdded = useRef(false);

  useEffect(function () {
    // إذا أضفنا CSS من قبل نتوقف فوراً
    if (cssAdded.current) return;
    cssAdded.current = true;

    // ننشئ عنصر <style> ونضيفه لـ <head>
    const styleElement = document.createElement("style");
    styleElement.textContent = GLOBAL_CSS;
    document.head.appendChild(styleElement);
  }, []); // المصفوفة الفارغة [] تعني: نفّذ مرة واحدة فقط عند التحميل


  // ─── دالة تحديث الفورم ─────────────────────────────────
  // تُنفَّذ عند تغيير أي حقل
  function onChange(event) {
    const fieldName  = event.target.name;   // اسم الحقل الذي تغيّر
    const fieldValue = event.target.value;  // القيمة الجديدة

    // نحدّث قيمة ذلك الحقل فقط (نبقي باقي الحقول كما هي)
    setForm(function (previousForm) {
      return { ...previousForm, [fieldName]: fieldValue };
    });

    // نحذف رسالة الخطأ لهذا الحقل إذا كان المستخدم يكتب
    if (errors[fieldName]) {
      setErrors(function (previousErrors) {
        return { ...previousErrors, [fieldName]: "" };
      });
    }

    // نحذف الخطأ العام أيضاً
    if (globalErr) {
      setGlobalErr("");
    }
  }


  // ─── دالة التحقق من صحة البيانات ──────────────────────
  // تتحقق من كل الحقول وتُرجع كائن الأخطاء
  // إذا كان الكائن فارغاً = لا أخطاء = البيانات صحيحة
  function validate() {
    const foundErrors = {};

    // تحقق من اسم المريض: يجب ألا يكون فارغاً
    if (!form.patientName.trim()) {
      foundErrors.patientName = t.errName;
    }

    // تحقق من رقم الهاتف: يجب أن يحوي أرقاماً فقط (7 خانات على الأقل)
    const phoneIsEmpty   = !form.phoneNumber.trim();
    const phoneIsInvalid = !/^\+?[\d\s-]{7,}$/.test(form.phoneNumber);
    if (phoneIsEmpty || phoneIsInvalid) {
      foundErrors.phoneNumber = t.errPhone;
    }

    // تحقق من اختيار الطبيب
    if (!form.doctorId) {
      foundErrors.doctorId = t.errDoctor;
    }

    // تحقق من التاريخ
    if (!form.preferredDate) {
      foundErrors.preferredDate = t.errDate;
    } else if (form.preferredDate < getTodayDate()) {
      // التاريخ المختار في الماضي
      foundErrors.preferredDate = t.errPast;
    }

    // تحقق من الوقت
    if (!form.preferredTime) {
      foundErrors.preferredTime = t.errTime;
    }

    return foundErrors;
  }


  // ─── دالة الإرسال ──────────────────────────────────────
  // async = تعني أن الدالة تحوي عمليات تستغرق وقتاً (await)
  async function submit() {
    // أولاً: نتحقق من البيانات
    const foundErrors = validate();

    // إذا كان فيه أخطاء: نعرضها ونتوقف
    const hasErrors = Object.keys(foundErrors).length > 0;
    if (hasErrors) {
      setErrors(foundErrors);
      setGlobalErr(t.errAll);
      return; // نخرج من الدالة هنا
    }

    // لا أخطاء: نبدأ الإرسال
    setErrors({});
    setGlobalErr("");
    setLoading(true); // نُشغّل أيقونة التحميل

    try {
      // نجد بيانات الطبيب المختار
      const selectedDoctor = doctors.find(function (doctor) {
        return String(doctor.id) === String(form.doctorId);
      });

      // نُعدّ البيانات التي سنرسلها
      const payload = {
        ...form,
        doctorName:  selectedDoctor ? selectedDoctor.nameEn : "",
        specialty:   selectedDoctor ? selectedDoctor.specialtyEn : "",
        submittedAt: new Date().toISOString(),
      };

      // نُرسل البيانات (وهمياً) — await = انتظر حتى تنتهي
      await simulateApiCall(payload);

      // نجح الإرسال!
      setSuccess(true);

      // إذا أُعطينا دالة onSuccess من الخارج، ننفّذها
      if (onSuccess) {
        onSuccess(payload);
      }

    } catch {
      // حدث خطأ غير متوقع
      setGlobalErr("Something went wrong. Please try again.");
    } finally {
      // سواء نجح أو فشل: نوقف التحميل
      setLoading(false);
    }
  }


  // ─── دالة الإعادة ──────────────────────────────────────
  // تُصفّر كل شيء لحجز موعد جديد
  function reset() {
    setForm({
      patientName:   "",
      phoneNumber:   "",
      doctorId:      "",
      preferredDate: "",
      preferredTime: "",
    });
    setErrors({});
    setGlobalErr("");
    setSuccess(false);
  }


  // ─── ستايل حقل الإدخال الأساسي ───────────────────────
  // يعتمد على isRtl لعكس الـ padding (الأيقونة تغيّر جانبها)
  const inputBase = {
    width:      "100%",
    height:     46,
    border:     `1.5px solid ${COLORS.border}`,
    borderRadius: 10,
    // في العربي: الأيقونة يمين → padding يمين أكبر
    // في الإنجليزي: الأيقونة يسار → padding يسار أكبر
    padding:    isRtl ? "0 38px 0 12px" : "0 12px 0 38px",
    fontSize:   "0.875rem",
    color:      "#1a2332",
    background: COLORS.bg,
    transition: "border-color .2s, box-shadow .2s, background .2s",
    fontFamily: "inherit",
    direction:  isRtl ? "rtl" : "ltr",
  };


  // ─── Props المشتركة للـ Field ──────────────────────────
  // بدلاً من كتابتها في كل استخدام لـ Field، نجمعها هنا
  // {...fieldProps} تعني "انشر كل هذه الخصائص كـ props"
  const fieldProps = {
    errors:    errors,
    form:      form,
    onChange:  onChange,
    loading:   loading,
    success:   success,
    isRtl:     isRtl,
    inputBase: inputBase,
  };


  // ──────────────────────────────────────────────────────
  //  بيانات البطاقات الثلاث الصغيرة في القسم الأيسر
  // ──────────────────────────────────────────────────────
  const featureTiles = [
    {
      bg:    "linear-gradient(135deg, #0f2a4a, #1a4a7a)",
      icon:  "🏥",
      title: t.diag,
      sub:   t.diagSub,
    },
    {
      bg:    "linear-gradient(135deg, #1565c0, #0284c7)",
      icon:  "💡",
      title: t.smart,
      sub:   null,
    },
    {
      bg:    COLORS.navy,
      icon:  "★",
      title: t.top,
      sub:   t.topSub,
    },
  ];


  // ══════════════════════════════════════════════════════
  //  JSX: هيكل الصفحة المرئية
  // ══════════════════════════════════════════════════════
  return (
    <div
      className="aoh-root"
      style={{
        direction:  isRtl ? "rtl" : "ltr",
        background: "linear-gradient(135deg, #f0f4f8, #e8eef5)",
        minHeight:  "100vh",
        color:      "#1a2332",
        paddingTop:"90px"
      }}
    >



      {/* ── قسم المحتوى الرئيسي (عمودان: يسار = Hero، يمين = فورم) ── */}
      <main
        className="aoh-page"
        style={{
          maxWidth:             1080,
          margin:               "0 auto",
          padding:              "3rem 1.5rem 4rem",
          display:              "grid",
          gridTemplateColumns:  "1fr 1.1fr", // عمود لليسار وعمود أعرض قليلاً لليمين
          gap:                  "3rem",
          alignItems:           "start",
        }}
      >

        {/* ════════════════ القسم الأيسر: Hero ════════════════ */}
        <section
          className="aoh-hero"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >

          {/* شارة النص الصغيرة في الأعلى */}
          <div style={{
            display:      "inline-flex",
            alignItems:   "center",
            gap:          6,
            background:   "rgba(11,61,122,.07)",
            color:        COLORS.navy,
            border:       "1px solid rgba(11,61,122,.18)",
            borderRadius: 100,
            padding:      "5px 14px",
            fontSize:     "0.7rem",
            fontWeight:   700,
            letterSpacing:".08em",
            width:        "fit-content",
          }}>
            🛡 {t.badge}
          </div>

          {/* العنوان الكبير */}
          <h1 style={{
            fontSize:      "clamp(2rem, 5vw, 2.8rem)",
            fontWeight:    800,
            lineHeight:    1.1,
            letterSpacing: "-0.03em",
            color:         COLORS.navy,
          }}>
            {t.headline1}
            <br />
            <span style={{ color: COLORS.blue }}>{t.headline2}</span>
          </h1>

          {/* النص التوضيحي */}
          <p style={{
            fontSize:   "0.92rem",
            lineHeight: 1.75,
            color:      "#475569",
            maxWidth:   400,
          }}>
            {t.sub}
          </p>

          {/* بطاقة رقم الهاتف */}
          <div style={{
            display:      "flex",
            alignItems:   "center",
            gap:          14,
            background:   COLORS.navy,
            borderRadius: 14,
            padding:      "1rem 1.25rem",
            maxWidth:     360,
            boxShadow:    "0 4px 20px rgba(11,61,122,.25)",
          }}>
            {/* أيقونة الهاتف */}
            <div style={{
              width:        40,
              height:       40,
              borderRadius: 10,
              background:   "rgba(255,255,255,.15)",
              display:      "flex",
              alignItems:   "center",
              justifyContent:"center",
              fontSize:     18,
              flexShrink:   0,
            }}>
              📞
            </div>
            {/* النص والرقم */}
            <div>
              <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,.6)", fontWeight: 500, marginBottom: 2 }}>
                {t.support}
              </div>
              <div style={{ fontSize: "1rem", color: "#fff", fontWeight: 700 }}>
                {t.phone}
              </div>
            </div>
          </div>

          {/* البطاقات الثلاث الصغيرة */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>

            {/* .map() تمر على كل عنصر في المصفوفة وتُنشئ JSX له */}
            {featureTiles.map(function (tile, index) {
              return (
                <div
                  key={index}
                  style={{
                    borderRadius:   14,
                    background:     tile.bg,
                    minHeight:      90,
                    display:        "flex",
                    flexDirection:  "column",
                    alignItems:     "flex-start",
                    justifyContent: "flex-end",
                    padding:        "0.75rem",
                  }}
                >
                  {/* الأيقونة — البطاقة الثالثة (النجمة) تكون أصغر وأشفاف */}
                  <div style={{
                    fontSize:    index === 2 ? 18 : 20,
                    color:       index === 2 ? "rgba(255,255,255,.55)" : "inherit",
                    marginBottom: 4,
                  }}>
                    {tile.icon}
                  </div>

                  {/* العنوان */}
                  <div style={{ fontSize: "0.77rem", fontWeight: 700, color: "#fff" }}>
                    {tile.title}
                  </div>

                  {/* النص الفرعي (إذا كان موجوداً) */}
                  {tile.sub && (
                    <div style={{ fontSize: "0.67rem", color: "rgba(255,255,255,.65)", lineHeight: 1.3, marginTop: 2 }}>
                      {tile.sub}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </section>
        {/* ════ نهاية القسم الأيسر ════ */}


        {/* ════════════════ القسم الأيمن: بطاقة الفورم ════════════════ */}
        <section>
          <div
            className="aoh-card"
            style={{
              background:   "#fff",
              borderRadius: 20,
              padding:      "2rem",
              boxShadow:    "0 8px 40px rgba(11,61,122,.1), 0 1px 3px rgba(0,0,0,.05)",
            }}
          >

            {/* ── رأس البطاقة: العنوان فقط (بدون رقم الخطوة) ── */}
            <div style={{ marginBottom: 4 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: COLORS.navy, letterSpacing: "-0.02em" }}>
                {t.formTitle}
              </h2>
              <p style={{ fontSize: "0.78rem", color: COLORS.muted, marginTop: 2 }}>
                {t.formSub}
              </p>
            </div>

            {/* ── زر تبديل اللغة ── */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
              <button
                className="aoh-lang-btn"
                onClick={function () {
                  // إذا اللغة الحالية إنجليزي → حوّل لعربي، والعكس
                  setLang(lang === "en" ? "ar" : "en");
                }}
                style={{
                  background:   "none",
                  border:       `1.5px solid ${COLORS.border}`,
                  borderRadius: 8,
                  padding:      "5px 12px",
                  fontSize:     "0.78rem",
                  fontWeight:   700,
                  color:        COLORS.navy,
                  cursor:       "pointer",
                  transition:   "all .2s",
                  fontFamily:   "inherit",
                }}
              >
                {/* إذا الإنجليزي: أظهر "عربي" والعكس */}
                {lang === "en" ? "عربي" : "EN"}
              </button>
            </div>

            {/* ── رسالة الخطأ العامة (تظهر فقط إذا كانت غير فارغة) ── */}
            {globalErr && (
              <div style={{
                background:   "#fff5f5",
                border:       "1px solid #fecaca",
                borderRadius: 10,
                padding:      "0.7rem 1rem",
                fontSize:     "0.78rem",
                color:        "#dc2626",
                marginBottom: "1rem",
                display:      "flex",
                alignItems:   "center",
                gap:          8,
              }}>
                ⚠️ {globalErr}
              </div>
            )}

            {/* ── شبكة الحقول ── */}
            <div
              className="aoh-form-grid"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
            >

              {/* حقل اسم المريض */}
              <Field
                name="patientName"
                label={t.patientName}
                labelEn="Patient Name"
                icon="👤"
                placeholder={t.namePH}
                {...fieldProps}
              />

              {/* حقل رقم الهاتف */}
              <Field
                name="phoneNumber"
                label={t.phoneNumber}
                labelEn="Phone Number"
                icon="📱"
                type="tel"
                placeholder={t.phonePH}
                {...fieldProps}
              />

              {/* قائمة اختيار الطبيب — تمتد على العمودين كاملاً */}
              <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 5 }}>

                {/* تسمية القائمة */}
                <label style={{
                  fontSize:        "0.78rem",
                  fontWeight:      600,
                  color:           "#374151",
                  display:         "flex",
                  justifyContent:  "space-between",
                }}>
                  {t.specialist}
                  {isRtl && (
                    <span style={{ fontSize: "0.72rem", color: COLORS.muted, fontWeight: 400 }}>
                      Specialist / Doctor
                    </span>
                  )}
                </label>

                {/* حاوية القائمة المنسدلة مع الأيقونة */}
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>

                  {/* أيقونة الطبيب */}
                  <span style={{
                    position:      "absolute",
                    [isRtl ? "right" : "left"]: 12,
                    color:         COLORS.muted,
                    fontSize:      14,
                    pointerEvents: "none",
                    zIndex:        1,
                  }}>
                    🩺
                  </span>

                  {/* القائمة المنسدلة */}
                  <select
                    className={errors.doctorId ? "aoh-select err" : "aoh-select"}
                    style={{
                      ...inputBase,
                      // نحتاج padding مختلف لأن الأيقونة من اليمين والسهم من اليسار
                      padding:    isRtl ? "0 38px 0 32px" : "0 32px 0 38px",
                      appearance: "none",  // نخفي السهم الافتراضي للمتصفح
                      cursor:     "pointer",
                      ...(errors.doctorId
                        ? { borderColor: COLORS.err, background: "#fff5f5" }
                        : {}),
                    }}
                    name="doctorId"
                    value={form.doctorId}
                    onChange={onChange}
                    disabled={loading || success}
                    aria-label={t.specialist}
                  >
                    {/* الخيار الافتراضي الفارغ */}
                    <option value="">{t.specialistPH}</option>

                    {/* نعرض كل طبيب كخيار */}
                    {doctors.map(function (doctor) {
                      // نختار الاسم والتخصص حسب اللغة
                      const doctorName    = lang === "ar" ? doctor.nameAr    : doctor.nameEn;
                      const doctorSpecial = lang === "ar" ? doctor.specialtyAr : doctor.specialtyEn;
                      const unavailText   = doctor.available ? "" : ` (${t.unavail})`;

                      return (
                        <option
                          key={doctor.id}
                          value={doctor.id}
                          disabled={!doctor.available}  // نعطّل الطبيب غير المتاح
                        >
                          {doctorName} — {doctorSpecial}{unavailText}
                        </option>
                      );
                    })}
                  </select>

                  {/* سهم القائمة المنسدلة (مخصص) */}
                  <span style={{
                    position:      "absolute",
                    [isRtl ? "left" : "right"]: 12,
                    pointerEvents: "none",
                    color:         COLORS.slate,
                    fontSize:      11,
                  }}>
                    ▼
                  </span>
                </div>

                {/* رسالة خطأ الطبيب */}
                {errors.doctorId && (
                  <span style={{ fontSize: "0.73rem", color: COLORS.err }}>
                    ⚠ {errors.doctorId}
                  </span>
                )}
              </div>
              {/* ── نهاية قائمة الطبيب ── */}

              {/* حقل التاريخ */}
              <Field
                name="preferredDate"
                label={t.date}
                labelEn="Preferred Date"
                icon="📅"
                type="date"
                min={getTodayDate()}  // لا يسمح باختيار تاريخ ماضٍ
                {...fieldProps}
              />

              {/* حقل الوقت */}
              <Field
                name="preferredTime"
                label={t.time}
                labelEn="Preferred Time"
                icon="🕐"
                type="time"
                {...fieldProps}
              />

            </div>
            {/* ── نهاية شبكة الحقول ── */}


            {/* ── زر الإرسال أو رسالة النجاح ── */}
            {/* إذا لم يكن هناك نجاح بعد: أظهر الزر */}
            {!success ? (
              <>
                <button
                  className="aoh-btn-primary"
                  onClick={submit}
                  disabled={loading}
                  style={{
                    width:          "100%",
                    height:         52,
                    background:     `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`,
                    color:          "#fff",
                    border:         "none",
                    borderRadius:   12,
                    fontSize:       "0.95rem",
                    fontWeight:     700,
                    cursor:         loading ? "not-allowed" : "pointer",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            10,
                    marginTop:      "1.25rem",
                    transition:     "transform .15s, box-shadow .2s",
                    boxShadow:      "0 4px 20px rgba(11,61,122,.35)",
                    opacity:        loading ? 0.75 : 1,
                    fontFamily:     "inherit",
                    letterSpacing:  "0.01em",
                  }}
                  aria-label={t.confirm}
                >
                  {/* أثناء التحميل: أيقونة دوارة + نص "جارٍ الحجز" */}
                  {/* بعد التحميل: نص التأكيد + سهم */}
                  {loading
                    ? <><span className="aoh-spin">⏳</span>{t.loading}</>
                    : <>{t.confirm} <span style={{ fontSize: 14 }}>→</span></>
                  }
                </button>

                {/* ملاحظة الموافقة */}
                <p style={{
                  fontSize:   "0.7rem",
                  color:      COLORS.muted,
                  textAlign:  "center",
                  lineHeight: 1.55,
                  marginTop:  "0.75rem",
                }}>
                  {t.note}
                </p>
              </>

            ) : (
              /* إذا نجح الحجز: أظهر رسالة النجاح وزر الحجز من جديد */
              <>
                <div style={{
                  display:      "flex",
                  alignItems:   "center",
                  gap:          14,
                  background:   "#f0fdf4",
                  border:       "1.5px solid #86efac",
                  borderRadius: 14,
                  padding:      "1rem 1.25rem",
                  marginTop:    "1.25rem",
                }}>
                  {/* أيقونة الصح الدائرية */}
                  <div
                    className="aoh-success-icon"
                    style={{
                      width:          38,
                      height:         38,
                      background:     "#22c55e",
                      borderRadius:   "50%",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      color:          "#fff",
                      fontSize:       18,
                      flexShrink:     0,
                    }}
                  >
                    ✓
                  </div>

                  {/* نص النجاح */}
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#15803d" }}>
                      {t.successTitle}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#16a34a", marginTop: 2 }}>
                      {t.successMsg}
                    </div>
                  </div>
                </div>

                {/* زر حجز موعد آخر */}
                <button
                  onClick={reset}
                  style={{
                    width:        "100%",
                    height:       48,
                    background:   "linear-gradient(135deg, #059669, #10b981)",
                    color:        "#fff",
                    border:       "none",
                    borderRadius: 12,
                    fontSize:     "0.9rem",
                    fontWeight:   700,
                    cursor:       "pointer",
                    marginTop:    "1rem",
                    fontFamily:   "inherit",
                  }}
                >
                  {t.tryAgain}
                </button>
              </>
            )}

          </div>
        </section>
       

      </main>
      

    </div>
  );
}
