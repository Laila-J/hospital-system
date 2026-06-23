/**
 * Run with: npm run seed
 * Creates an admin account, a receptionist account, and a handful of
 * doctors (mirroring the bilingual DEFAULT_DOCTORS list from
 * AppointmentBooking.jsx) so the frontend has real data to display
 * immediately after connecting to this backend.
 */
require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

const seedUsers = [
  {
    firstName: "Hospital",
    lastName: "Admin",
    gender: "Male",
    nationalNumber: "ADMIN-0001",
    profileType: "Admin",
    email: "admin@alothman.sy",
    password: "Admin@12345",
  },
  {
    firstName: "Front",
    lastName: "Desk",
    gender: "Female",
    nationalNumber: "RECEP-0001",
    profileType: "Receptionist",
    email: "reception@alothman.sy",
    password: "Reception@12345",
  },
  {
    firstName: "Sarah",
    lastName: "Al-Farsi",
    nameAr: "د. سارة الفارسي",
    gender: "Female",
    nationalNumber: "DOC-0001",
    profileType: "Doctor",
    occupation: "Cardiology",
    specialtyAr: "طب القلب",
    yearsOfExperience: "10 +",
    licenseSource: "Syrian Board of Medicine",
    email: "sarah.alfarsi@alothman.sy",
    password: "Doctor@12345",
  },
  {
    firstName: "Omar",
    lastName: "Othman",
    nameAr: "د. عمر عثمان",
    gender: "Male",
    nationalNumber: "DOC-0002",
    profileType: "Doctor",
    occupation: "Orthopedics",
    specialtyAr: "العظام",
    yearsOfExperience: "5 - 10",
    licenseSource: "Syrian Board of Medicine",
    email: "omar.othman@alothman.sy",
    password: "Doctor@12345",
  },
  {
    firstName: "Layla",
    lastName: "Mansour",
    nameAr: "د. ليلى منصور",
    gender: "Female",
    nationalNumber: "DOC-0003",
    profileType: "Doctor",
    occupation: "Pediatrics",
    specialtyAr: "طب الأطفال",
    yearsOfExperience: "5 - 10",
    licenseSource: "Syrian Board of Medicine",
    email: "layla.mansour@alothman.sy",
    password: "Doctor@12345",
  },
];

(async () => {
  await connectDB();

  for (const data of seedUsers) {
    const exists = await User.findOne({ email: data.email });
    if (exists) {
      console.log(`Skipping (already exists): ${data.email}`);
      continue;
    }
    await User.create(data);
    console.log(`Created: ${data.email} / password: ${data.password}`);
  }

  console.log("Seeding complete.");
  process.exit(0);
})().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
