import {
  Box,
  Container,
  //Flex,
  HStack,
  VStack,
  Stack,
  SimpleGrid,
  Heading,
  Text,
  Button,
  Image,
  Input,
  //Link,
  Badge,
  //Divider,
  useToast,
} from "@chakra-ui/react";
import{Link as RouterLink} from 'react-router-dom'
import { useState } from "react";
import HOSPITAL_LOGO from "./hospital.jpg";

export default function Home() {
    const[email,setEmail]=useState("");
    const toast=useToast();

    const handleSubmit = async () => {

    if (!email.includes("@")) {
        toast({
            title: "Invalid Email",
            description: "Please enter a valid email address.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
        return;
    }

    try {

        const res = await fetch(
            "http://localhost:5000/api/newsletter/subscribe",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            }
        );

        const data = await res.json();
        console.log(data);

        if (res.ok) {
            toast({
                title: "Subscription successful",
                description: "You have subscribed to our newsletter.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setEmail("");
        }

    } catch (error) {
        console.log(error);

        toast({
            title: "Error",
            description: "Something went wrong.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
    }
};
  return (
    <Box pt={"90px"}>


      {/* Hero */}
      <Box pt="70px">
        <Container maxW="1200px" py={20}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={10}
            align="center"
          >
            <VStack align="start" spacing={5} flex="1">
              <Badge colorScheme="blue">
                Trusted Healthcare Excellence
              </Badge>

              <Heading size="2xl">
                Clinical Precision.{" "}
                <Text as="span" color="#0F4C81">
                  Human-Centric
                </Text>{" "}
                Care.
              </Heading>

              <Text color="gray.500">
                We combine world-class medical expertise with genuine
                compassion to deliver care that treats the whole person.
              </Text>

              <HStack>
                <Button as={RouterLink} to='/AppointmentBooking' bg="#0F4C81" color="white">
                  Book Appointment
                </Button>

                <Button variant="outline" colorScheme="blue">
                  Our Doctors
                </Button>
              </HStack>
            </VStack>

            <Box
              flex="1"
              bg="#EBF4FF"
              p={10}
              borderRadius="2xl"
              textAlign="center"
            >
              <Image
                src={HOSPITAL_LOGO}
                maxW="400px"
                mx="auto"
                alt="Hospital"
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Stats */}
      <Box bg="#F7FAFD" py={16}>
        <Container maxW="1200px">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Box bg="white" p={8} borderRadius="xl" textAlign="center">
              <Text fontSize="3xl">🚑</Text>
              <Heading size="md" mt={3}>
                24/7 Emergency Support
              </Heading>
              <Text mt={2} color="gray.500">
                Round-the-clock emergency services.
              </Text>
            </Box>

            <Box bg="white" p={8} borderRadius="xl" textAlign="center">
              <Text fontSize="3xl">👨‍⚕️</Text>
              <Heading size="md" mt={3}>
                150+ Doctors
              </Heading>
              <Text mt={2} color="gray.500">
                Experienced doctors in many specialties.
              </Text>
            </Box>

            <Box bg="white" p={8} borderRadius="xl" textAlign="center">
              <Text fontSize="3xl">🌐</Text>
              <Heading size="md" mt={3}>
                International Standards
              </Heading>
              <Text mt={2} color="gray.500">
                Healthcare services that follow global standards.
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Services */}
      <Box py={20} id="services">
        <Container maxW="1200px">
          <VStack mb={12}>
            <Badge colorScheme="blue">What We Offer</Badge>

            <Heading textAlign="center">
              Specialized Medical Services
            </Heading>

            <Text color="gray.500" textAlign="center" maxW="600px">
              From routine checkups to advanced treatments.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
            <Box bg="#F7FAFD" p={6} borderRadius="xl">
              <Text fontSize="3xl">🚑</Text>
              <Heading size="sm" mt={3}>
                Emergency Care
              </Heading>
              <Text mt={3} color="gray.500">
                Immediate medical attention available 24/7.
              </Text>
            </Box>

            <Box bg="#F7FAFD" p={6} borderRadius="xl">
              <Text fontSize="3xl">❤️</Text>
              <Heading size="sm" mt={3}>
                Specialized Surgery
              </Heading>
              <Text mt={3} color="gray.500">
                Advanced surgical procedures by specialists.
              </Text>
            </Box>

            <Box bg="#F7FAFD" p={6} borderRadius="xl">
              <Text fontSize="3xl">🩻</Text>
              <Heading size="sm" mt={3}>
                Diagnostic Imaging
              </Heading>
              <Text mt={3} color="gray.500">
                MRI, CT scan and other imaging services.
              </Text>
            </Box>

            <Box bg="#F7FAFD" p={6} borderRadius="xl">
              <Text fontSize="3xl">🩺</Text>
              <Heading size="sm" mt={3}>
                Primary Care
              </Heading>
              <Text mt={3} color="gray.500">
                Preventive care and regular health checkups.
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Newsletter */}
      <Box bg="#0F4C81" py={20}>
        <Container maxW="700px">
          <VStack spacing={5}>
            <Heading color="white" textAlign="center">
              Stay Informed About Your Health
            </Heading>

            <Text color="blue.100" textAlign="center">
              Subscribe to receive health tips and updates.
            </Text>

            <Stack
              direction={{ base: "column", md: "row" }}
              w="100%"
            >
              <Input
                bg="white"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />

              <Button bg="white" color="#0F4C81" onClick={handleSubmit}>
                Subscribe
              </Button>
            </Stack>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
     
    </Box>
  );
}