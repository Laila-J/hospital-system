import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Button,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

const user = useMemo(() => readUser(), [location]);
  const isDoctor = user?.role === "doctor";

  return (
    <Box
      position="fixed"
      top="0"
      w="100%"
      bg="gray.200"
      boxShadow="sm"
      zIndex="999"
    >
      <Container maxW="100%" px={0}>
        <Flex h="70px" align="center" w="100%" px={{ base: 6, md: 10 }}>
          {/* Hospital Name */}
          <Heading size="md" color="#0F4C81" whiteSpace="nowrap" flexShrink={0}>
            Al Othman Hospital
          </Heading>

          {/* Navigation */}
          <HStack
            spacing={4}
            display={{ base: "none", md: "flex" }}
            ml="auto"
            whiteSpace="nowrap"
          >
            {/* Home - everyone */}
            <Link href="/Home">Home</Link>

            {/* Doctors - everyone */}
            <Link href="/Doctors">Doctors</Link>

            {/* Logged-in users */}
            {user && (
              <>
                {isDoctor ? (
                  <>
                    <Link href="/DoctorDashboard">Doctor Dashboard</Link>
                  </>
                ) : (
                  <>
                    <Link href="/AppointmentBooking">Appointment Booking</Link>

                    <Link href="/MyAppointments">My Appointments</Link>
                    <Link href="/PatientProfile">My Profile</Link>
                  </>
                )}
              </>
            )}
          </HStack>

          {/* Login Button */}
          {user ? (
            <Button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/LogIn");
              }}
              size="sm"
              px={5}
              flexShrink={0}
              bg="#0F4C81"
              color="white"
              ml={4}
              mr={2}
              display={{ base: "none", md: "flex" }}
              alignItems="center"
              justifyContent="center"
            >
              Logout
            </Button>
          ) : (
            <Button
              as={RouterLink}
              to="/LogIn"
              size="sm"
              px={5}
              flexShrink={0}
              bg="#0F4C81"
              color="white"
              display={{ base: "none", md: "flex" }}
              ml={4}
              mr={2}
              alignItems="center"
              justifyContent="center"
            >
              Login
            </Button>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
