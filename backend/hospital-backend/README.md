# Al Othman Hospital — Backend API

Node.js + Express + MongoDB backend built to plug directly into the React
pages you shared (`SignUp.jsx`, `LogIn.jsx`, `ResetPassword.jsx`,
`AppointmentBooking.jsx`, `Home.jsx`). Field names, validation rules, and
error messages mirror exactly what each component already does on the
client, so the server simply re-enforces the same rules (never trust the
client) and returns errors in the same per-field shape your forms already
use.

## 1. Setup

```bash
cd hospital-backend
npm install
cp .env.example .env     # then fill in MONGO_URI, JWT_SECRET, SMTP_*
npm run seed              # optional: creates an admin + 3 sample doctors
npm run dev                # starts on http://localhost:5000
```

Requires a running MongoDB instance — either local (`mongodb://127.0.0.1:27017/...`)
or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (`mongodb+srv://...`).

Seeded test accounts (after `npm run seed`):
| Role | Email | Password |
|---|---|---|
| Admin | admin@alothman.sy | Admin@12345 |
| Receptionist | reception@alothman.sy | Reception@12345 |
| Doctor | sarah.alfarsi@alothman.sy | Doctor@12345 |

## 2. Project structure

```
src/
  server.js          entry point
  app.js             express app, middleware, route mounting
  config/db.js        mongoose connection
  models/              User, Appointment, Newsletter
  controllers/          business logic
  routes/                one file per resource
  middleware/           auth (JWT + RBAC), validation, error handling
  validators/            express-validator rules (mirror each form's client validation)
  utils/                  JWT signing, email sending, custom ApiError, seed script
```

## 3. Endpoints by frontend page

### `SignUp.jsx` → `POST /api/auth/register`
Body matches the form 1:1:
```json
{
  "firstName": "Laila", "lastName": "Younes", "gender": "Female",
  "nationalNumber": "01234567890", "profileType": "Patient",
  "dateOfBirth": "1998-04-12", "bloodType": "O+", "allergies": "None",
  "email": "laila@example.com", "password": "secret123"
}
```
For `profileType: "Doctor"`, send `occupation`, `licenseSource`,
`yearsOfExperience` instead of the patient fields.
Returns `201` with `{ success, token, user }`, or `400/409` with
`{ success:false, errors: { fieldName: "message" } }` — drop straight into
your existing `setFirstNameError`, `setEmailError`, etc.

> **Note on the frontend form:** the "Years of experience" `<Select>` in
> `SignUp.jsx` doesn't currently have a `value`/`onChange`, so it never
> actually reaches `handleSubmit`. Add `value={yearsOfExperience}
> onChange={(e)=>setYearsOfExperience(e.target.value)}` if you want that
> field to be sent to the API (the backend already accepts it).

### `LogIn.jsx` → `POST /api/auth/login`
```json
{ "email": "laila@example.com", "password": "secret123", "remember": true }
```
Returns `{ success, token, user }` and also sets an httpOnly cookie. A
wrong email/password both return the same generic error so the API never
reveals which emails are registered.

### `ResetPassword.jsx` → two steps
1. **Request a link** (not yet in your UI, but needed before
   `ResetPassword.jsx` can work): `POST /api/auth/forgot-password` with
   `{ "email": "..." }`. Always responds with success to avoid leaking which
   emails exist. In development it also returns `devResetUrl` so you can
   test without configuring SMTP.
2. **Set the new password**: `POST /api/auth/reset-password/:token` with
   `{ "password": "newSecret123" }`. The `:token` is the one emailed in
   step 1 — in `ResetPassword.jsx` you'd read it with
   `const { token } = useParams()` after adding a route like
   `/ResetPassword/:token` in `App.jsx`.

### `AppointmentBooking.jsx`
- `GET /api/doctors` → replaces the local `DEFAULT_DOCTORS` array. Returns
  the exact same shape: `{ id, nameEn, nameAr, specialtyEn, specialtyAr, available }`.
- `POST /api/appointments` → replaces `simulateApiCall(payload)` in `submit()`.
  Send `{ patientName, phoneNumber, doctorId, preferredDate, preferredTime }`
  (the same `form` state object already in the component — `doctorName`
  and `specialty` are computed server-side, not trusted from the client).
  A doctor cannot be double-booked for the same date+time: a second request
  for an already-taken slot returns `409` with a field error on
  `preferredTime`.
- `GET /api/doctors/:id/availability?date=YYYY-MM-DD` (optional bonus) →
  returns already-booked time strings for that doctor/date if you want to
  disable taken times in the `<input type="time">`.

### `Home.jsx` → `POST /api/newsletter/subscribe`
```json
{ "email": "someone@example.com" }
```
Idempotent — subscribing twice with the same email still returns success,
matching the toast in `Home.jsx` (only ever "invalid email" or "success").

### `Navbar.jsx` / `Footer.jsx`
Purely static — no backend needed.

## 4. Roles & access control
`profileType` from sign-up becomes `role` (`patient` / `doctor`), used by
`protect` + `authorize(...roles)` middleware. `admin` and `receptionist`
aren't self-registrable from the public form (seed them, or have an admin
create them) but share the same login/JWT flow. Staff-only endpoints:
- `GET /api/appointments` — admin/receptionist, list & filter all bookings
- `PATCH /api/appointments/:id/status` — admin/receptionist/owning doctor
- `GET /api/appointments/doctor` — a doctor's own schedule
- `GET /api/appointments/me` — a patient's own bookings

## 5. Error format (consistent everywhere)
```json
{ "success": false, "message": "Please fix the highlighted fields.",
  "errors": { "email": "Invalid email!" } }
```
Mongoose errors (bad id, duplicate email/nationalNumber, double-booked slot)
are automatically normalized into this same shape by the central error
handler — the frontend never needs to special-case them.

## 6. Deploying (e.g. Railway)
Set the env vars from `.env.example` in your hosting dashboard
(`MONGO_URI` pointing at Atlas, a strong `JWT_SECRET`, `CLIENT_URL` set to
your deployed frontend's origin for CORS, and SMTP credentials for
password-reset emails). Then `npm start`.
