import {
  Box,
  Container,
  //Flex,
  //HStack,
  VStack,
  //Stack,
  SimpleGrid,
  Heading,
  Text,
//   Button,
//   Image,
//   Input,
 Link,
//   Badge,
  Divider,
  //useToast,
} from "@chakra-ui/react";
//import{Link as RouterLink} from 'react-router-dom'

export default function Footer(){
    return(
         <Box bg="gray.900" color="white" py={12}>
        <Container maxW="1200px">
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
            <Box>
              <Heading size="sm" mb={3} color={"#0F4C81"}>
                Al Othman Hospital
              </Heading>
              <Text color="gray.400">
                Care. Healing. Excellence.
              </Text>
            </Box>

            <Box>
              <Heading size="sm" mb={3} color={"#0F4C81"} >
                Quick Links
              </Heading>
              <VStack align="center">
                <Link href="#" >Home</Link>
                <Link>Doctors</Link>
                <Link href="/AppointmentBooking" >Appointments</Link>
                <Link href="#services" >Services</Link>
                <Link>Contact</Link>
              </VStack>
            </Box>

            <Box>
              <Heading size="sm" mb={3} color={"#0F4C81"} >
                Contact
              </Heading>
              <Text color="gray.400">📍 Lattakia, Syria</Text>
              <Text color="gray.400">📞 +963 951 950 200</Text>
              <Text color="gray.400">✉️ info@Alothman.sy</Text>
            </Box>

            <Box>
              <Heading size="sm" mb={3} color={"#0F4C81"} >
                Follow Us
              </Heading>
              <Text color="gray.400">
                Facebook • Instagram • LinkedIn
              </Text>
            </Box>
          </SimpleGrid>

          <Divider my={6} />

          <Text textAlign="center" color="gray.500" fontSize="sm">
            © 2026 Al Othman Hospital. All rights reserved.
          </Text>
        </Container>
      </Box>
    )
}