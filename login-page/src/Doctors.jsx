import  { useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Radio,
  RadioGroup,
  Divider,
  Image,
  Card,
  CardBody,
  SimpleGrid,
  IconButton,
  Spinner,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import doctor1 from "./assets/doctor1.jpg";
import doctor2 from "./assets/doctor2.jpg";
import doctor3 from "./assets/doctor3.jpg";
import doctor4 from "./assets/doctor4.jpg";
import doctor5 from "./assets/doctor5.jpg";

// صور مؤقتة حسب ترتيب الدكاترة الموجودين
const doctorImages = {
  "Dr. Sarah Al-Farsi":doctor4,
  "Dr. Omar Othman": doctor1,
  "Dr. Layla Mansour":doctor3,
  "Dr. sara ahmad": doctor5,
  "Dr. Adam Khalil": doctor2,
};

function ProfileIcon() {
  return <span style={{ fontSize: "18px" }}>👤</span>;
}

function Doctors() {

  const navigate= useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSpecialty,setSelectedSpecialty]=useState("");
  const [selectedAvailability,setSelectedAvailability]=useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/doctors");

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();

        setDoctors(data.doctors || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Unable to load doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const applyFilters=async ()=>{
    try{
      setLoading(true);
      setError("");

      let url="http://localhost:5000/api/doctors?";

      if(selectedSpecialty){
        url +=`specialty=${encodeURIComponent(selectedSpecialty)}`;
      }

      if(selectedAvailability){
        url +=`${selectedSpecialty? "&": ""}available=true`;
      }

      const response= await fetch(url);

      if(!response.ok){
        throw new Error("Failed to fetch doctors");
      }

      const data=await response.json();
      setDoctors(data.doctors || []);
    } catch(error){
      console.error("Error filtering doctors:",error);
      setError("Unable to load doctors.");
    } finally{
      setLoading(false);
    }
  }

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

      {/* Main layout */}
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

        <RadioGroup
              value={selectedSpecialty}
              onChange={setSelectedSpecialty}
>
            <VStack align="start" spacing={3}>
              <Radio value="">All Doctors</Radio>
              <Radio value="Cardiology">Cardiology</Radio>
              <Radio value="Orthopedics">Orthopedics</Radio>
              <Radio value="Neurology">Neurology</Radio>
              <Radio value="Pediatrics">Pediatrics</Radio>
              <Radio value="Dermatology">Dermatology</Radio>
           </VStack>
        </RadioGroup>

          <Divider my={5} />

          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.500"
            mb={3}
          >
            AVAILABILITY
          </Text>

          <RadioGroup 
          value={selectedAvailability}
          onChange={setSelectedAvailability}>
            <VStack align="start" spacing={3}>
              <Radio value="today">
                Available Today
              </Radio>

              <Radio value="week">
                Next 7 Days
              </Radio>
            </VStack>
          </RadioGroup>

          <Button
            colorScheme="blue"
            bg="gray.800"
            mt={6}
            w="100%"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </Box>

        {/* Right side */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3 }}
          spacing={5}
          flex="1"
        >

          {/* Loading */}
          {loading && (
            <Flex
              justify="center"
              align="center"
              minH="200px"
              gridColumn="1 / -1"
            >
              <Spinner size="xl" />
            </Flex>
          )}

          {/* Error */}
          {!loading && error && (
            <Text
              color="red.500"
              gridColumn="1 / -1"
              textAlign="center"
            >
              {error}
            </Text>
          )}

          {/* No doctors */}
          {!loading && !error && doctors.length === 0 && (
            <Text
              color="gray.500"
              gridColumn="1 / -1"
              textAlign="center"
            >No doctors found.
            </Text>
          )}

          {/* Doctor Cards */}
          {!loading &&
            !error &&
            doctors.map((doctor) => (
              <Card
                key={doctor.id}
                borderRadius="md"
                overflow="hidden"
              >
                <Image
                  src={doctorImages[doctor.nameEn]}
                  alt={doctor.nameEn}
                  h="330px"
                  w="100%"
                  objectFit="contain"
                />

                <CardBody>

                  <Heading size="sm">
                    {doctor.nameEn}
                  </Heading>

                  <Text
                    color="blue.600"
                    fontWeight="semibold"
                    fontSize="sm"
                    mt={1}
                  >
                    {doctor.specialtyEn}
                  </Text>

                  <Text
                    fontSize="sm"
                    color="gray.600"
                    mt={2}
                    noOfLines={3}
                  >
                    {doctor.available
                      ? "Available for appointments."
                      : "Currently unavailable."}
                  </Text>

                  <HStack mt={4} spacing={3}>

                    <Button
                      colorScheme="blue"
                      bg="gray.800"
                      size="sm"
                      flex="1"
                      onClick={()=>navigate(`/AppointmentBooking?doctor=${doctor.id}`)}
                    >
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