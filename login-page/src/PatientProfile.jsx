import { Box, Heading, Text, VStack, HStack, Avatar, Divider } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const InfoRow = ({ label, value }) => (
    <HStack justify="space-between" py="3" borderBottom="1px solid" borderColor="gray.100">
      <Text color="gray.500" fontWeight="medium">
        {label}
      </Text>
      <Text color="gray.700" fontWeight="bold">
        {value || "—"}
      </Text>
    </HStack>
  );


function PatientProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUser(data.user);
      } catch (err) {
        console.log("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  
  return (
    <Box minH="100vh" pt="120px" px="40px" pb="60px">
      <Heading>My Profile</Heading>
      <Text mt="2" color="gray.500">
        View your personal information.
      </Text>

      {loading && <Text mt="6">Loading profile...</Text>}

      {error && (
        <Text mt="6" color="red.400">
          {error}
        </Text>
      )}

      {!loading && !error && user && (
        <Box
          mt="8"
          mx="auto"
          bg="white"
          borderRadius="15px"
          boxShadow="md"
          maxW="600px"
          overflow="hidden"
        >
          {/* Header */}
          <Box bg="#1460a3" p="8" textAlign="center">
            <Avatar
              size="xl"
              name={`${user.firstName} ${user.lastName}`}
              bg="white"
              color="#1460a3"
            />
            <Heading mt="4" color="white" size="lg">
              {user.firstName} {user.lastName}
            </Heading>
            <Text color="gray.200" mt="1">
              {user.email}
            </Text>
          </Box>

          {/* Details */}
          <VStack align="stretch" p="8" spacing="1">
            <InfoRow label="Gender" value={user.gender} />
            <InfoRow label="National Number" value={user.nationalNumber} />
            <InfoRow label="Profile Type" value={user.profileType} />
            <InfoRow
              label="Date of Birth"
              value={
                user.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString()
                  : null
              }
            />
            <InfoRow label="Blood Type" value={user.bloodType} />
            <InfoRow label="Allergies" value={user.allergies} />
          </VStack>

          <Divider />

          <Box p="6" textAlign="center">
            <Text fontSize="sm" color="gray.400">
              Editing your profile will be available soon.
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default PatientProfile;
