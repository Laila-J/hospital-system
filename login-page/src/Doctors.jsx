//import React from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  Divider,
  Image,
  Card,
  CardBody,
  SimpleGrid,
  IconButton,
} from "@chakra-ui/react";
import doctor1 from "./assets/doctor1.jpg"
import doctor2 from "./assets/doctor2.jpg"
import doctor3 from "./assets/doctor3.jpg"
import doctor4 from "./assets/doctor4.jpg"
import doctor5 from "./assets/doctor5.jpg"


// Simple icon made with text/emoji since we are keeping things beginner-friendly
function ProfileIcon() {
  return <span style={{ fontSize: "18px" }}>👤</span>;
}

// Array of doctor objects - this is our "data" for the page
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Al-Farsi",
    specialty: "Cardiology",
    image: doctor4,
    description:
      "Specializing in non-invasive cardiology and preventative heart care with over 15 years of experience.",
  },
  {
    id: 2,
    name: "Dr. Omar Othman",
    specialty: "Orthopedics",
    image: doctor1,
    description:
      "Senior consultant specializing in joint replacement and sports injuries. Lead surgeon at the hospital.",
  },
  {
    id: 3,
    name: "Dr. Laila Mansour",
    specialty: "Pediatrics",
    image: doctor3,
    description:
      "Dedicated to providing compassionate care for children of all ages. Expert in child development.",
  },
  {
    id: 4,
    name: "Dr. Khalid Ibrahim",
    specialty: "Neurology",
    image: doctor2,
    description:
      "Specialist in neurological disorders and advanced brain health treatments using modern technology.",
  },
  {
    id: 5,
    name: "Dr. Nora Saeed",
    specialty: "Dermatology",
    image: doctor5,
    description:
      "Expert in clinical and cosmetic dermatology, focusing on skin health and advanced laser treatments.",
  },
];

function Doctors() {
  return (
    <Box bg="gray.50" minH="100vh" p={6}>
      {/* Page Title */}
      <Box mb={8}>
        <Heading size="lg" color="gray.800">
          Medical Team
        </Heading>
        <Text color="gray.600" mt={1}>
          Exceptional healthcare provided by world-class specialists.
        </Text>
      </Box>

      {/* Main layout: sidebar + doctor cards */}
      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        {/* Left Sidebar */}
        <Box
          bg="white"
          p={5}
          borderRadius="md"
          boxShadow="sm"
          w={{ base: "100%", md: "260px" }}
          h="fit-content"
        >
          <Heading size="sm" mb={4}>
            Specializations
          </Heading>

          <VStack align="start" spacing={3}>
            <Checkbox defaultChecked colorScheme="blue">
              All Doctors
            </Checkbox>
            <Checkbox>Cardiology</Checkbox>
            <Checkbox>Orthopedics</Checkbox>
            <Checkbox>Neurology</Checkbox>
            <Checkbox>Pediatrics</Checkbox>
            <Checkbox>Dermatology</Checkbox>
          </VStack>

          <Divider my={5} />

          <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={3}>
            AVAILABILITY
          </Text>

          <RadioGroup defaultValue="today">
            <VStack align="start" spacing={3}>
              <Radio value="today">Available Today</Radio>
              <Radio value="week">Next 7 Days</Radio>
            </VStack>
          </RadioGroup>

          <Button colorScheme="blue" bg="gray.800" mt={6} w="100%">
            Apply Filters
          </Button>
        </Box>

        {/* Right side: Doctor Cards Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5} flex="1">
          {doctors.map((doctor) => (
            <Card key={doctor.id} borderRadius="md" overflow="hidden">
              <Image
                src={doctor.image}
                alt={doctor.name}
                h="330px"
                w="100%"
                objectFit="cover"
              />
              <CardBody>
                <Heading size="sm">{doctor.name}</Heading>
                <Text color="blue.600" fontWeight="semibold" fontSize="sm" mt={1}>
                  {doctor.specialty}
                </Text>
                <Text fontSize="sm" color="gray.600" mt={2} noOfLines={3}>
                  {doctor.description}
                </Text>

                <HStack mt={4} spacing={3}>
                  <Button colorScheme="blue" bg="gray.800" size="sm" flex="1">
                    Book Now
                  </Button>
                  <IconButton
                    aria-label="View profile"
                    icon={<ProfileIcon />}
                    variant="outline"
                    size="sm"
                  />
                </HStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
}

export default Doctors;
