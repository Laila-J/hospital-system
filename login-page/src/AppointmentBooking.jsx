import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function AppointmentBooking() {
  const [doctors, setDoctors] = useState([]);
  const [doctorsError, setDoctorsError] = useState("");

  const [form, setForm] = useState({
    patientName: "",
    phoneNumber: "",
    doctorId: "",
    preferredDate: "",
    preferredTime: "",
  });

  const [errors, setErrors] = useState({});
  const [globalErr, setGlobalErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load the real doctors list from the backend.
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doctors");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load doctors");
        }

        setDoctors(data.doctors || []);
      } catch (err) {
        console.log("Error loading doctors:", err);
        setDoctorsError(err.message);
      }
    };

    loadDoctors();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.patientName.trim()) {
      newErrors.patientName = "Patient name is required.";
    }

    if (!/^\+?[\d\s-]{7,}$/.test(form.phoneNumber.trim())) {
      newErrors.phoneNumber = "A valid phone number is required.";
    }

    if (!form.doctorId) {
      newErrors.doctorId = "Please select a specialist.";
    }

    if (!form.preferredDate) {
      newErrors.preferredDate = "Please select a preferred date.";
    } else if (form.preferredDate < getTodayDate()) {
      newErrors.preferredDate = "Please select a future date.";
    }

    if (!form.preferredTime) {
      newErrors.preferredTime = "Please select a preferred time.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    setGlobalErr("");

    if (!validate()) {
      setGlobalErr("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed. Please try again.");
      }

      setSuccess(true);
    } catch (err) {
      console.log("Error creating appointment:", err);
      setGlobalErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm({
      patientName: "",
      phoneNumber: "",
      doctorId: "",
      preferredDate: "",
      preferredTime: "",
    });
    setErrors({});
    setGlobalErr("");
    setSuccess(false);
  };

  return (
    <Box minH="100vh" pt="120px" px="40px" pb="60px">
      <Heading>📅 Book Appointment</Heading>
      <Text mt="2" color="gray.500">
        Fill in your details to schedule a new appointment. 🩺
      </Text>

      <Box
        mt="8"
        mx="auto"
        bg="white"
        p="8"
        borderRadius="15px"
        boxShadow="md"
        maxW="600px"
      >
        {!success ? (
          <VStack spacing="5" align="stretch">
            {globalErr && (
              <Text color="red.500" fontWeight="bold">
                {globalErr}
              </Text>
            )}

            {doctorsError && (
              <Text color="red.400" fontSize="sm">
                {doctorsError}
              </Text>
            )}

            <Box>
              <Text mb="1" fontWeight="medium" color="gray.600">
                👤 Patient Name
              </Text>
              <Input
                name="patientName"
                placeholder="Enter patient name"
                value={form.patientName}
                onChange={onChange}
                isDisabled={loading}
                bg="gray.50"
                borderColor={errors.patientName ? "red.400" : "gray.200"}
              />
              {errors.patientName && (
                <Text mt="1" fontSize="sm" color="red.500">
                  {errors.patientName}
                </Text>
              )}
            </Box>

            <Box>
              <Text mb="1" fontWeight="medium" color="gray.600">
                📱 Phone Number
              </Text>
              <Input
                name="phoneNumber"
                placeholder="+963 9XX XXX XXX"
                value={form.phoneNumber}
                onChange={onChange}
                isDisabled={loading}
                bg="gray.50"
                borderColor={errors.phoneNumber ? "red.400" : "gray.200"}
              />
              {errors.phoneNumber && (
                <Text mt="1" fontSize="sm" color="red.500">
                  {errors.phoneNumber}
                </Text>
              )}
            </Box>

            <Box>
              <Text mb="1" fontWeight="medium" color="gray.600">
                🩺 Specialist / Doctor
              </Text>
              <Select
                name="doctorId"
                placeholder="Select a Specialist"
                value={form.doctorId}
                onChange={onChange}
                isDisabled={loading}
                bg="gray.50"
                borderColor={errors.doctorId ? "red.400" : "gray.200"}
              >
                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                    disabled={!doctor.available}
                  >
                    {doctor.nameEn} — {doctor.specialtyEn}
                    {!doctor.available ? " (Unavailable)" : ""}
                  </option>
                ))}
              </Select>
              {errors.doctorId && (
                <Text mt="1" fontSize="sm" color="red.500">
                  {errors.doctorId}
                </Text>
              )}
            </Box>

            <HStack spacing="4" align="start">
              <Box flex="1">
                <Text mb="1" fontWeight="medium" color="gray.600">
                  📅 Preferred Date
                </Text>
                <Input
                  type="date"
                  name="preferredDate"
                  min={getTodayDate()}
                  value={form.preferredDate}
                  onChange={onChange}
                  isDisabled={loading}
                  bg="gray.50"
                  borderColor={errors.preferredDate ? "red.400" : "gray.200"}
                />
                {errors.preferredDate && (
                  <Text mt="1" fontSize="sm" color="red.500">
                    {errors.preferredDate}
                  </Text>
                )}
              </Box>

              <Box flex="1">
                <Text mb="1" fontWeight="medium" color="gray.600">
                  ⏰ Preferred Time
                </Text>
                <Input
                  type="time"
                  name="preferredTime"
                  value={form.preferredTime}
                  onChange={onChange}
                  isDisabled={loading}
                  bg="gray.50"
                  borderColor={errors.preferredTime ? "red.400" : "gray.200"}
                />
                {errors.preferredTime && (
                  <Text mt="1" fontSize="sm" color="red.500">
                    {errors.preferredTime}
                  </Text>
                )}
              </Box>
            </HStack>

            <Button
              onClick={submit}
              isLoading={loading}
              loadingText="Booking…"
              bg="#1460a3"
              color="white"
              size="lg"
              _hover={{ bg: "#0F4C81" }}
              mt="2"
            >
              ✅ Confirm Appointment
            </Button>

            <Text fontSize="xs" color="gray.400" textAlign="center">
              By confirming, you agree to our terms of service and privacy
              policy regarding your medical data.
            </Text>
          </VStack>
        ) : (
          <VStack spacing="5" align="stretch">
            <Box
              bg="green.50"
              border="1.5px solid"
              borderColor="green.200"
              borderRadius="14px"
              p="5"
            >
              <Text fontWeight="bold" color="green.700">
                ✅ Booking Confirmed!
              </Text>
              <Text mt="1" fontSize="sm" color="green.600">
                📩 A confirmation SMS will be sent to your mobile instantly.
              </Text>
            </Box>

            <Button
              onClick={reset}
              bg="green.500"
              color="white"
              size="lg"
              _hover={{ bg: "green.600" }}
            >
              🔁 Book Another
            </Button>
          </VStack>
        )}
      </Box>
    </Box>
  );
}

export default AppointmentBooking;
