const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Required when deployed behind a reverse proxy (e.g. Railway, Render,
// Nginx) so express-rate-limit and req.ip read the real client IP from
// the X-Forwarded-For header instead of the proxy's IP.
app.set("trust proxy", 1);

// ---- Security & parsing middleware ----
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ and . from user input to prevent NoSQL injection

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ---- Health check ----
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running." });
});

// ---- Routes, one per frontend page ----
app.use("/api/auth", authRoutes); // SignUp.jsx, LogIn.jsx, ResetPassword.jsx
app.use("/api/doctors", doctorRoutes); // AppointmentBooking.jsx (doctor list)
app.use("/api/appointments", appointmentRoutes); // AppointmentBooking.jsx (booking)
app.use("/api/newsletter", newsletterRoutes); // Home.jsx (newsletter form)

// ---- 404 + centralized error handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
