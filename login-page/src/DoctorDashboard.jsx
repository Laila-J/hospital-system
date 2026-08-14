import { Box, Heading, Text, HStack, VStack, Switch } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function DoctorDashboard() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const toggleAvailability = async () => {
    const token = localStorage.getItem("token");
    const newAvailable = !user?.available;

    setAvailabilityLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/doctors/me/availability",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ available: newAvailable }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update availability");
      }

      const updatedUser = { ...user, available: data.doctor.available };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.log("Error updating availability:", error);
      alert(error.message);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://localhost:5000/api/appointments/doctor",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        console.log("Doctor appointments:", data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to load appointments");
        }

        setAppointments(data.appointments);
      } catch (error) {
        console.log("Error fetching doctor appointments:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed",
  ).length;

  const filteredAppointments =
    statusFilter === "all"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.status === statusFilter,
        );

  const updateAppointmentStatus = async (appointmentId, status) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update appointment");
      }

      // Update the appointment directly in the state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: data.appointment.status }
            : appointment,
        ),
      );
    } catch (error) {
      console.log("Error updating appointment:", error);
      alert(error.message);
    }
  };

  return (
    <Box minH="100vh" pt="120px" px="40px">
      <HStack justify="space-between" align="center" flexWrap="wrap">
        <Heading>
          Welcome Dr. {user?.firstName} {user?.lastName} 👋
        </Heading>

        <HStack
          spacing="3"
          bg="white"
          px="5"
          py="3"
          borderRadius="12px"
          boxShadow="md"
        >
          <Text fontWeight="bold" color={user?.available ? "green.600" : "gray.500"}>
            {user?.available ? "Available" : "Unavailable"}
          </Text>
          <Switch
            colorScheme="green"
            size="lg"
            isChecked={!!user?.available}
            isDisabled={availabilityLoading}
            onChange={toggleAvailability}
          />
        </HStack>
      </HStack>

      <Text mt="4">This is your Doctor Dashboard.</Text>

      {loading && <Text mt="6">Loading appointments...</Text>}

      {error && (
        <Text mt="6" color="red.300">
          {error}
        </Text>
      )}

      {!loading && !error && (
        <Box mt="8">
          {/* Statistics */}
          <HStack spacing="5" align="stretch">
            <Box
              bg="#1460a3"
              p="6"
              borderRadius="15px"
              flex="1"
              textAlign="center"
            >
              <Text color="gray.300" fontSize="lg">
                Total Appointments
              </Text>

              <Heading mt="2" color="white">
                {totalAppointments}
              </Heading>
            </Box>

            <Box
              bg="#1460a3"
              p="6"
              borderRadius="15px"
              flex="1"
              textAlign="center"
            >
              <Text color="gray.300" fontSize="lg">
                Pending
              </Text>

              <Heading mt="2" color="white">
                {pendingAppointments}
              </Heading>
            </Box>

            <Box
              bg="#1460a3"
              p="6"
              borderRadius="15px"
              flex="1"
              textAlign="center"
            >
              <Text color="gray.300" fontSize="lg">
                Confirmed
              </Text>

              <Heading mt="2" color="white">
                {confirmedAppointments}
              </Heading>
            </Box>
          </HStack>

          {/* Appointments section */}
          <Heading size="md" mt="10" color="gray.600">
            My Appointments
          </Heading>

          <HStack spacing="3" mt="5" flexWrap="wrap">
            {["all", "pending", "confirmed", "completed", "cancelled"].map(
              (status) => (
                <Box
                  key={status}
                  as="button"
                  px="5"
                  py="2"
                  borderRadius="20px"
                  fontWeight="bold"
                  textTransform="capitalize"
                  bg={statusFilter === status ? "#1460a3" : "gray.100"}
                  color={statusFilter === status ? "white" : "gray.600"}
                  _hover={{
                    bg: statusFilter === status ? "#1460a3" : "gray.200",
                  }}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Box>
              ),
            )}
          </HStack>

          <VStack spacing="4" mt="5" align="stretch">
            {filteredAppointments.length === 0 ? (
              <Text color="gray.500">No appointments found.</Text>
            ) : (
              filteredAppointments.map((appointment) => (
                <Box
                  key={appointment._id}
                  bg="white"
                  p="5"
                  borderRadius="5px"
                  boxShadow="md"
                  borderLeft="5px solid #1460a3"
                >
                  <HStack justify="space-between" align="start">
                    <Box>
                      <Text
                        fontSize={"lg"}
                        fontWeight={"bold"}
                        color="gray.700"
                      >
                        {appointment.patientName}
                      </Text>

                      <Text mt="2" color="gray.600">
                        📞 {appointment.phoneNumber}
                      </Text>

                      <Text mt="2" color="gray.600">
                        🗓️{" "}
                        {new Date(
                          appointment.preferredDate,
                        ).toLocaleDateString()}
                      </Text>

                      <Text mt="2" color="gray.600">
                        🕑 {appointment.preferredTime}
                      </Text>
                    </Box>

                    <Box
                      px="4"
                      py="2"
                      borderRadius="20px"
                      bg={
                        appointment.status === "confirmed"
                          ? "green.100"
                          : appointment.status === "pending"
                            ? "yellow.100"
                            : appointment.status === "cancelled"
                              ? "red.100"
                              : "blue.100"
                      }
                    >
                      <Text
                        fontWeight="bold"
                        textTransform="capitalize"
                        color={
                          appointment.status === "confirmed"
                            ? "green.700"
                            : appointment.status === "pending"
                              ? "yellow.700"
                              : appointment.status === "cancelled"
                                ? "red.700"
                                : "blue.700"
                        }
                      >
                        {appointment.status}
                      </Text>
                    </Box>

                    <VStack spacing="2" mt="4" align="stretch">
                      {/* Confirm */}
                      {appointment.status === "pending" && (
                        <Box
                          as="button"
                          bg="green.500"
                          color="white"
                          px="4"
                          py="2"
                          borderRadius="8px"
                          fontWeight="bold"
                          _hover={{ bg: "green.600" }}
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "confirmed",
                            )
                          }
                        >
                          Confirm
                        </Box>
                      )}

                      {/* Complete */}
                      {appointment.status === "confirmed" && (
                        <Box
                          as="button"
                          bg="blue.500"
                          color="white"
                          px="4"
                          py="2"
                          borderRadius="8px"
                          fontWeight="bold"
                          _hover={{ bg: "blue.600" }}
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "completed",
                            )
                          }
                        >
                          Complete
                        </Box>
                      )}

                      {/* Cancel */}
                      {(appointment.status === "pending" ||
                        appointment.status === "confirmed") && (
                        <Box
                          as="button"
                          bg="red.500"
                          color="white"
                          px="4"
                          py="2"
                          borderRadius="8px"
                          fontWeight="bold"
                          _hover={{ bg: "red.600" }}
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "cancelled",
                            )
                          }
                        >
                          Cancel
                        </Box>
                      )}
                    </VStack>
                  </HStack>
                </Box>
              ))
            )}
          </VStack>
        </Box>
      )}
    </Box>
  );
}

export default DoctorDashboard;
