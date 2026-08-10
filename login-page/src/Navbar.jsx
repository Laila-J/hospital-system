import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Button,
  Link,
} from "@chakra-ui/react";
import{Link as RouterLink} from 'react-router-dom'   
   export default function Navbar(){
    return(
   <Box
        position="fixed"
        top="0"
        w="100%"
        bg="gray.200"
        boxShadow="sm"
        zIndex="999"
      >
        <Container maxW="1200px">
          <Flex h="70px" align="center" justify="space-between">
            <Heading size="md" color="#0F4C81">
              Al Othman Hospital
            </Heading>

            <HStack spacing={6} display={{ base: "none", md: "flex" }}>
              <Link href="/Home" >Home</Link>
              <Link href="/Doctors">Doctors</Link>
              <Link href="/AppointmentBooking" >Appointment Booking</Link>
              <Link href="/MyAppointments">My Appointments</Link>
            </HStack>

            <Button
              as={RouterLink}
              to="./LogIn"
              size="sm"
              px={6}
              py={2}
              bg="#0F4C81"
              color="white"
              display={{ base: "none", md: "block" }}
            >
              Login
            </Button>
          </Flex>
        </Container>
      </Box>
    )
   }