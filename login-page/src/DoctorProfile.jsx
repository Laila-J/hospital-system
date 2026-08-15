import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  Spinner,
  Icon,
} from "@chakra-ui/react";

import doctor1 from "./assets/doctor1.jpg";
import doctor2 from "./assets/doctor2.jpg";
import doctor3 from "./assets/doctor3.jpg";
import doctor4 from "./assets/doctor4.jpg";
import doctor5 from "./assets/doctor5.jpg";

// نفس الصور المؤقتة المستخدمة في Doctors.jsx حسب اسم الطبيب
const doctorImages = {
  "Dr. Sarah Al-Farsi": doctor4,
  "Dr. Omar Othman": doctor1,
  "Dr. Layla Mansour": doctor3,
  "Dr. sara ahmad": doctor5,
  "Dr. Adam Khalil": doctor2,
};

function BackArrowIcon(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"
      />
    </Icon>
  );
}

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://localhost:5000/api/doctors/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch doctor");
        }

        const data = await response.json();
        setDoctor(data.doctor || null);
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Unable to load doctor profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  return (
    <Box bg="gray.50" minH="100vh" p={6}>
      <Button
        variant="ghost"
        leftIcon={<BackArrowIcon boxSize={4} />}
        mb={6}
        onClick={() => navigate(-1)}
      >
        Back to Doctors
      </Button>

      {loading && (
        <Flex justify="center" align="center" minH="300px">
          <Spinner size="xl" />
        </Flex>
      )}

      {!loading && error && (
        <Text color="red.500" textAlign="center" mt={10}>
          {error}
        </Text>
      )}

      {!loading && !error && !doctor && (
        <Text color="gray.500" textAlign="center" mt={10}>
          Doctor not found.
        </Text>
      )}

      {!loading && !error && doctor && (
        <Flex
          direction={{ base: "column", md: "row" }}
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          overflow="hidden"
          maxW="800px"
          mx="auto"
        >
          <Image
            src={doctorImages[doctor.nameEn]}
            alt={doctor.nameEn}
            w={{ base: "100%", md: "320px" }}
            h={{ base: "260px", md: "auto" }}
            objectFit="contain"
            bg="gray.100"
          />

          <VStack align="start" spacing={4} p={8} flex="1">
            <Box>
              <Heading size="lg" color="gray.800">
                {doctor.nameEn}
              </Heading>
              <Text color="gray.500" fontSize="sm" mt={1}>
                {doctor.nameEn}
              </Text>
            </Box>

            <Text color="blue.600" fontWeight="semibold" fontSize="md">
              {doctor.specialtyEn}
            </Text>

            {doctor.yearsOfExperience && (
              <Text color="gray.600" fontSize="sm">
                Years of Experience: {doctor.yearsOfExperience}
              </Text>
            )}

            <Badge
              colorScheme={doctor.available ? "green" : "red"}
              px={3}
              py={1}
              borderRadius="full"
            >
              {doctor.available
                ? "Available for appointments"
                : "Currently unavailable"}
            </Badge>

            {doctor.available && (
              <Button
                colorScheme="blue"
                bg="gray.800"
                mt={4}
                onClick={() =>
                  navigate(`/AppointmentBooking?doctor=${doctor.id}`)
                }
              >
                Book Now
              </Button>
            )}
          </VStack>
        </Flex>
      )}
    </Box>
  );
}

export default DoctorProfile;
