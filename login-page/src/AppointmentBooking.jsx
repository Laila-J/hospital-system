import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
const API_URL = "http://localhost:5000/api";

// const DEFAULT_DOCTORS = [
//   {
//     id: 1,
//     nameEn: "Dr. Sarah Al-Farsi",
//     nameAr: "د. سارة الفارسي",
//     specialtyEn: "Cardiology",
//     specialtyAr: "طب القلب",
//     available: true,   // true = متاح
//   },
//   {
//     id: 2,
//     nameEn: "Dr. Omar Othman",
//     nameAr: "د. عمر عثمان",
//     specialtyEn: "Orthopedics",
//     specialtyAr: "العظام",
//     available: true,
//   },
//   {
//     id: 3,
//     nameEn: "Dr. Layla Mansour",
//     nameAr: "د. ليلى منصور",
//     specialtyEn: "Pediatrics",
//     specialtyAr: "طب الأطفال",
//     available: true,
//   },
//   {
//     id: 4,
//     nameEn: "Dr. Khalid Ibrahim",
//     nameAr: "د. خالد إبراهيم",
//     specialtyEn: "Neurology",
//     specialtyAr: "طب الأعصاب",
//     available: false,  // false = غير متاح
//   },
//   {
//     id: 5,
//     nameEn: "Dr. Nora Saeed",
//     nameAr: "د. نورة سعيد",
//     specialtyEn: "Dermatology",
//     specialtyAr: "الجلدية",
//     available: true,
//   },
// ];

const T = {
  en: {
    badge:       "CLINICAL PRECISION",
    headline1:   "Your Health,",
    headline2:   "Our Priority.",
    sub:         "Secure your consultation with Al Othman's world-class medical specialists. Human-centric care powered by advanced medical technology.",
    support:     "24/7 Support",
    phone:       "+963 992 966 431",   
    formTitle:   "Book Appointment",
    formSub:     "New appointment",
    patientName: "Patient Name",
    phoneNumber: "Phone Number",
    namePH:      "laila younes",        
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

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

const COLORS = {
  navy:   "#0b3d7a",
  blue:   "#1565c0",
  slate:  "#64748b",
  muted:  "#94a3b8",
  border: "#e2e8f0",
  bg:     "#f8fafc",
  err:    "#ef4444",
};

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.aoh-root { font-family: 'Plus Jakarta Sans', 'Tajawal', sans-serif; }

.aoh-input:focus, .aoh-select:focus {
  border-color: #1565c0 !important;
  box-shadow: 0 0 0 3px rgba(21,101,192,0.13) !important;
  background: #fff !important;
  outline: none;
}

.aoh-input.err { border-color: #ef4444 !important; background: #fff5f5 !important; }

.aoh-btn-primary:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 30px rgba(11,61,122,0.45) !important;
}
.aoh-btn-primary:not(:disabled):active { transform: translateY(0); }
.aoh-lang-btn:hover  { background: #0b3d7a !important; color: #fff !important; border-color: #0b3d7a !important; }
.aoh-footer-lnk:hover { color: #0b3d7a !important; }
.aoh-nav-item:hover  { color: #0b3d7a !important; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0   rgba(34,197,94,.38); }
  50%       { box-shadow: 0 0 0 9px rgba(34,197,94,0);   }
}

@keyframes spin { to { transform: rotate(360deg); } }

.aoh-card        { animation: fadeUp  .45s ease both; }
.aoh-hero        { animation: fadeUp  .45s .1s ease both; }
.aoh-success-icon{ animation: pulse  1.8s ease infinite; }
.aoh-spin        { display: inline-block; animation: spin .8s linear infinite; }

@media (max-width: 768px) {
  .aoh-page      { grid-template-columns: 1fr !important; padding: 1.5rem 1rem 3rem !important; gap: 2rem !important; }
  .aoh-form-grid { grid-template-columns: 1fr !important; }
  .aoh-nav-links { display: none !important; }
}
@media (max-width: 480px) { .aoh-card { padding: 1.25rem !important; } }
`;

const Field = function ({
  name, label, labelEn, icon,
  type, placeholder, min,
  errors, form, onChange,
  loading, success, isRtl, inputBase,
}) {

  const hasError = errors[name] ? true : false;

  const iconPosition = isRtl ? "right" : "left";

  const inputClass = hasError ? "aoh-input err" : "aoh-input";

  const errorStyle = hasError
    ? { borderColor: COLORS.err, background: "#fff5f5" }
    : {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>

      <label style={{
        fontSize: "0.78rem",
        fontWeight: 600,
        color: "#374151",
        display: "flex",
        justifyContent: "space-between",
      }}>
        {label}
        {isRtl && labelEn && (
          <span style={{ fontSize: "0.72rem", color: COLORS.muted, fontWeight: 400 }}>
            {labelEn}
          </span>
        )}
      </label>

      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>

        <span style={{
          position: "absolute",
          [iconPosition]: 12,     
          color: COLORS.muted,
          fontSize: 14,
          pointerEvents: "none",  
          zIndex: 1,
        }}>
          {icon}
        </span>

        <input
          className={inputClass}
          style={{ ...inputBase, ...errorStyle }}
          name={name}
          value={form[name]}
          onChange={onChange}
          type={type || "text"}
          placeholder={placeholder}
          min={min}
          disabled={loading || success}  
          aria-label={label}
        />
      </div>

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

export default function AppointmentBooking({
  initialLang = "en",
  onSuccess,
}) {
  
  const[searchParams]=useSearchParams();
  const doctorIdFromUrl= searchParams.get("doctor");

  const [lang, setLang] = useState(initialLang);
  const isRtl = lang === "ar";
  const t = T[lang];

  const [form, setForm] = useState({
    patientName:   "",
    phoneNumber:   "",
    doctorId:      "",
    preferredDate: "",
    preferredTime: "",
  });

  const [errors, setErrors] = useState({});
  const [globalErr, setGlobalErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ...
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState(false);

  const cssAdded = useRef(false);

  useEffect(function () {
    if (cssAdded.current) return;
    cssAdded.current = true;

    const styleElement = document.createElement("style");
    styleElement.textContent = GLOBAL_CSS;
    document.head.appendChild(styleElement);
  }, []);


  function loadDoctors() {
    setDoctorsLoading(true);
    setDoctorsError(false);

    return fetch(`${API_URL}/doctors`)
      .then(function (response) {
        return response.json().then(function (result) {
          if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to load doctors");
          }
          return result;
        });
      })
      .then(function (result) {
        setDoctors(result.doctors);

        if(doctorIdFromUrl){
          setForm(function (prev){
            return{
              ...prev,
              doctorId:doctorIdFromUrl
            };
          });
        }
        setDoctorsLoading(false);
      })
      .catch(function () {
        setDoctorsError(true);
        setDoctorsLoading(false);
      });
  }
  useEffect(function () {
    loadDoctors();
  }, []);

  function onChange(event) {
    const fieldName  = event.target.name;   
    const fieldValue = event.target.value; 

    setForm(function (previousForm) {
      return { ...previousForm, [fieldName]: fieldValue };
    });

    if (errors[fieldName]) {
      setErrors(function (previousErrors) {
        return { ...previousErrors, [fieldName]: "" };
      });
    }

    if (globalErr) {
      setGlobalErr("");
    }
  }

  function validate() {
    const foundErrors = {};

    if (!form.patientName.trim()) {
      foundErrors.patientName = t.errName;
    }

    const phoneIsEmpty   = !form.phoneNumber.trim();
    const phoneIsInvalid = !/^\+?[\d\s-]{7,}$/.test(form.phoneNumber);
    if (phoneIsEmpty || phoneIsInvalid) {
      foundErrors.phoneNumber = t.errPhone;
    }

    if (!form.doctorId) {
      foundErrors.doctorId = t.errDoctor;
    }


    if (!form.preferredDate) {
      foundErrors.preferredDate = t.errDate;
    } else if (form.preferredDate < getTodayDate()) {
      foundErrors.preferredDate = t.errPast;
    }

    if (!form.preferredTime) {
      foundErrors.preferredTime = t.errTime;
    }
    return foundErrors;
  }

  async function submit() {
    const foundErrors = validate();
    const hasErrors = Object.keys(foundErrors).length > 0;
    if (hasErrors) {
      setErrors(foundErrors);
      setGlobalErr(t.errAll);
      return; 
    }

    setErrors({});
    setGlobalErr("");
    setLoading(true); 

    try {

  const token = localStorage.getItem("token");

const response = await fetch(`${API_URL}/appointments`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    patientName: form.patientName,
    phoneNumber: form.phoneNumber,
    doctorId: form.doctorId,
    preferredDate: form.preferredDate,
    preferredTime: form.preferredTime,
  }),
});

const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Failed to book appointment");
}

setSuccess(true);

if (onSuccess) {
  onSuccess(result);
}

    } catch {
      setGlobalErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
  const inputBase = {
    width:      "100%",
    height:     46,
    border:     `1.5px solid ${COLORS.border}`,
    borderRadius: 10,
    padding:    isRtl ? "0 38px 0 12px" : "0 12px 0 38px",
    fontSize:   "0.875rem",
    color:      "#1a2332",
    background: COLORS.bg,
    transition: "border-color .2s, box-shadow .2s, background .2s",
    fontFamily: "inherit",
    direction:  isRtl ? "rtl" : "ltr",
  };
  const fieldProps = {
    errors:    errors,
    form:      form,
    onChange:  onChange,
    loading:   loading,
    success:   success,
    isRtl:     isRtl,
    inputBase: inputBase,
  };

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
      <main
        className="aoh-page"
        style={{
          maxWidth:             1080,
          margin:               "0 auto",
          padding:              "3rem 1.5rem 4rem",
          display:              "grid",
          gridTemplateColumns:  "1fr 1.1fr", 
          gap:                  "3rem",
          alignItems:           "start",
        }}
      >
        <section
          className="aoh-hero"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
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

          <p style={{
            fontSize:   "0.92rem",
            lineHeight: 1.75,
            color:      "#475569",
            maxWidth:   400,
          }}>
            {t.sub}
          </p>

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
            <div>
              <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,.6)", fontWeight: 500, marginBottom: 2 }}>
                {t.support}
              </div>
              <div style={{ fontSize: "1rem", color: "#fff", fontWeight: 700 }}>
                {t.phone}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>

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
                  <div style={{
                    fontSize:    index === 2 ? 18 : 20,
                    color:       index === 2 ? "rgba(255,255,255,.55)" : "inherit",
                    marginBottom: 4,
                  }}>
                    {tile.icon}
                  </div>

                  <div style={{ fontSize: "0.77rem", fontWeight: 700, color: "#fff" }}>
                    {tile.title}
                  </div>

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
            <div style={{ marginBottom: 4 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: COLORS.navy, letterSpacing: "-0.02em" }}>
                {t.formTitle}
              </h2>
              <p style={{ fontSize: "0.78rem", color: COLORS.muted, marginTop: 2 }}>
                {t.formSub}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
              <button
                className="aoh-lang-btn"
                onClick={function () {
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
                {lang === "en" ? "عربي" : "EN"}
              </button>
            </div>

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

            <div
              className="aoh-form-grid"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
            >
              <Field
                name="patientName"
                label={t.patientName}
                labelEn="Patient Name"
                icon="👤"
                placeholder={t.namePH}
                {...fieldProps}
              />

              <Field
                name="phoneNumber"
                label={t.phoneNumber}
                labelEn="Phone Number"
                icon="📱"
                type="tel"
                placeholder={t.phonePH}
                {...fieldProps}
              />

              
              <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 5 }}>

                
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

              
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>

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



                  <select
                    className={errors.doctorId ? "aoh-select err" : "aoh-select"}
                    style={{
                      ...inputBase,
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
                    disabled={loading || success || doctorsLoading}
                    aria-label={t.specialist}
                  >
                    
                    <option value="">{t.specialistPH}</option>

                    
                    {doctors.map(function (doctor) {
                      const doctorName    = lang === "ar" ? doctor.nameAr    : doctor.nameEn;
                      const doctorSpecial = lang === "ar" ? doctor.specialtyAr : doctor.specialtyEn;
                      const unavailText   = doctor.available ? "" : ` (${t.unavail})`;

                      return (
                        <option
                          key={doctor.id}
                          value={doctor.id}
                          disabled={!doctor.available} 
                        >
                          {doctorName} — {doctorSpecial}{unavailText}
                        </option>
                      );
                    })}
                  </select>

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

                {errors.doctorId && (
                  <span style={{ fontSize: "0.73rem", color: COLORS.err }}>
                    ⚠ {errors.doctorId}
                  </span>
                )}
              </div>

              <Field
                name="preferredDate"
                label={t.date}
                labelEn="Preferred Date"
                icon="📅"
                type="date"
                min={getTodayDate()}  
                {...fieldProps}
              />

              <Field
                name="preferredTime"
                label={t.time}
                labelEn="Preferred Time"
                icon="🕐"
                type="time"
                {...fieldProps}
              />

            </div>
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
                  {loading
                    ? <><span className="aoh-spin">⏳</span>{t.loading}</>
                    : <>{t.confirm} <span style={{ fontSize: 14 }}>→</span></>
                  }
                </button>
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

                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#15803d" }}>
                      {t.successTitle}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#16a34a", marginTop: 2 }}>
                      {t.successMsg}
                    </div>
                  </div>
                </div>


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
