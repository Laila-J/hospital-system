const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/apiError");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Public (auto-linked to the logged-in patient if a token is sent)
// @body    patientName, phoneNumber, doctorId, preferredDate, preferredTime
const createAppointment = asyncHandler(async (req, res) => {
  const { patientName, phoneNumber, doctorId, preferredDate, preferredTime } =
    req.body;

  const doctor = await User.findOne({
    _id: doctorId,
    profileType: "Doctor",
  });

  if (!doctor) {
    throw new ApiError(400, "Please select a specialist.", {
      doctorId: "Please select a specialist.",
    });
  }

  if (!doctor.available) {
    throw new ApiError(409, "This doctor is currently unavailable.", {
      doctorId: "This doctor is currently unavailable.",
    });
  }

  // doctorName/specialty are always computed server-side from the doctor
  // record - never trusted from the client payload.
  let appointment;
  try {
    appointment = await Appointment.create({
      patient: req.user && req.user.role === "patient" ? req.user._id : null,
      patientName,
      phoneNumber,
      doctor: doctor._id,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      specialty: doctor.occupation,
      preferredDate,
      preferredTime,
    });
  } catch (err) {
    // Duplicate key on the (doctor, date, time) partial unique index
    if (err.code === 11000) {
      throw new ApiError(
        409,
        "This time slot was just booked by someone else. Please choose another time.",
        { preferredTime: "This time slot is no longer available." }
      );
    }
    throw err;
  }

  res.status(201).json({
    success: true,
    message: "Booking confirmed! A confirmation SMS will be sent to your mobile instantly.",
    appointment,
  });
});

// @desc    Get the logged-in patient's own appointments
// @route   GET /api/appointments/me
// @access  Private (patient)
const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id }).sort(
    { preferredDate: -1, preferredTime: -1 }
  );
  res.status(200).json({ success: true, count: appointments.length, appointments });
});

// @desc    Get the logged-in doctor's upcoming appointments
// @route   GET /api/appointments/doctor
// @access  Private (doctor)
const getDoctorAppointments = asyncHandler(async (req, res) => {
  const filter = { doctor: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const appointments = await Appointment.find(filter).sort({
    preferredDate: 1,
    preferredTime: 1,
  });
  res.status(200).json({ success: true, count: appointments.length, appointments });
});

// @desc    List/search all appointments
// @route   GET /api/appointments
// @access  Private (admin, receptionist)
const getAppointments = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.doctor) filter.doctor = req.query.doctor;
  if (req.query.date) filter.preferredDate = new Date(req.query.date);

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .sort({ preferredDate: 1, preferredTime: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("doctor", "firstName lastName occupation")
      .populate("patient", "firstName lastName email"),
    Appointment.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: appointments.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    appointments,
  });
});

// @desc    Get a single appointment by id
// @route   GET /api/appointments/:id
// @access  Private (admin, receptionist, the owning doctor, or the owning patient)
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("doctor", "firstName lastName occupation")
    .populate("patient", "firstName lastName email");

  if (!appointment) {
    throw new ApiError(404, "Appointment not found.");
  }

  const isOwner =
    (appointment.patient && String(appointment.patient._id) === String(req.user._id)) ||
    String(appointment.doctor._id) === String(req.user._id);
  const isStaff = ["admin", "receptionist"].includes(req.user.role);

  if (!isOwner && !isStaff) {
    throw new ApiError(403, "You are not allowed to view this appointment.");
  }

  res.status(200).json({ success: true, appointment });
});

//@desc Reschedule an appointment
//@route PATCH /api/appointment/:id
//@access Private (owning patient)
const updateAppointment = asyncHandler(async (req, res)=>{
  const {doctorId,preferredDate, preferredTime}=req.body;

  const appointment= await Appointment.findById(req.params.id);

  if(!appointment){
    throw new ApiError(404, "Appointment not found.");
  }

  //Make sure the logged-in patient owns this appointment
  const isOwningPatient=
  appointment.patient&&
  String(appointment.patient)=== String(req.user._id);

  if(!isOwningPatient){
    throw new ApiError(403, "You are not allowed to update this appointment.");
  }

  //Do not allow editing cancelled or completed appointments
  if(["cancelled", "completed"].includes(appointment.status)){
    throw new ApiError(400, "this appointment can no longer be changed.");
  }

  //if doctor is being changed, verify the new doctor
  const newDoctorId=doctorId || appointment.doctor;

  const doctor= await User.findOne({
    _id:newDoctorId,
    profileType:"Doctor",
  });
  if(!doctor){
    throw new ApiError(400, "Please select a valid specialist.", {
      doctorId: "Please select a valid specialist."
    });
  }

  if(!doctor.available){
      throw new ApiError(409, "This doctor is currently unavailable.", {
        doctorId: "This doctor is currently unavailable."
      });
    }

    //Update only the fields that were provided
    appointment.doctor=doctor._id;
    appointment.doctorName= `Dr. ${doctor.firstName} ${doctor.lastName}`;
    appointment.specialty= doctor.occupation;

    if(preferredDate){
      appointment.preferredDate=preferredDate;
    }

    if(preferredTime){
      appointment.preferredTime=preferredTime;
    }

    try{
      await appointment.save();
    } catch(err){
      // Doctor/date/time slot is already occupied
      if(err.code === 11000){
        throw new ApiError(
          409,
          "This time slot is already booked. Please choose another time.",
          {
            preferredTime: "This time slot is already booked."
          }
        );
      }
      throw err;
    }

    res.status(200).json({
      success:true,
      message:"Appointment updated successfully.",
      appointment,
    });
});

// @desc    Update an appointment's status (confirm / complete / cancel)
// @route   PATCH /api/appointments/:id/status
// @access  Private (admin, receptionist, or the owning doctor)
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value.", {
      status: `Status must be one of: ${allowedStatuses.join(", ")}`,
    });
  }

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found.");
  }

  const isOwningDoctor = String(appointment.doctor) === String(req.user._id);
  const isStaff = ["admin", "receptionist"].includes(req.user.role);

  if (!isOwningDoctor && !isStaff) {
    throw new ApiError(403, "You are not allowed to update this appointment.");
  }

  appointment.status = status;
  await appointment.save();

  res.status(200).json({ success: true, appointment });
});

// @desc    Cancel an appointment (by the patient who booked it, or staff)
// @route   DELETE /api/appointments/:id
// @access  Private (admin, receptionist, or the owning patient)
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found.");
  }

  const isOwningPatient =
    appointment.patient && String(appointment.patient) === String(req.user._id);
  const isStaff = ["admin", "receptionist"].includes(req.user.role);

  if (!isOwningPatient && !isStaff) {
    throw new ApiError(403, "You are not allowed to cancel this appointment.");
  }

  appointment.status = "cancelled";
  await appointment.save();

  res.status(200).json({ success: true, message: "Appointment cancelled.", appointment });
});

module.exports = {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  updateAppointment,
};
