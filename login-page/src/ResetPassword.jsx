import {
  Box,
  Input,
  VStack,
  Button,
  Text,
  Image,
  Heading,
} from "@chakra-ui/react";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [validPassword, setValidPassword] = useState("");

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    let valid = true;

    // empty check
    if (password === "") {
      setValidPassword("Password is required!");
      valid = false;
    } else {
      setValidPassword("");
    }

    // length check
    if (password.length < 8) {
      setPasswordError("Password must be atleast 8 characters!");
      valid = false;
    } else {
      setPasswordError("");
    }

    // confirm password check
    if (password !== confirmPassword) {
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        console.log("Password reset successful");
        navigate("/login");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <Box minH="100vh" bg="gray.400" p={4} pt={"90px"}>
      <Box bg="#10104b" minH="100vh" maxW="600px" mx="auto" rounded={"5%"} p="20px">
        <VStack align={"start"}>
          <Image
            src="../public/login.jpg"
            alt="photo"
            w="100%"
            mx="auto"
            rounded={"5%"}
          />

          <Heading color="gray.300" mx="auto">
            Create your new password
          </Heading>

          <Text color="gray.300" fontSize={20}>
            New password:
          </Text>

          <Input
            type="password"
            bg="gray.300"
            w="60%"
            value={password}
            placeholder="enter new password"
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowHint(true)}
            onBlur={() => setShowHint(false)}
          />

          {validPassword && <Text color="red">{validPassword}</Text>}
          {passwordError && <Text color="red">{passwordError}</Text>}

          {showHint && (
            <Text color={"red"} fontSize={"sm"}>
              Password must be atleast 8 characters
            </Text>
          )}

          <Text color="gray.300" fontSize={20}>
            Confirm new password:
          </Text>

          <Input
            type="password"
            bg="gray.300"
            w="60%"
            value={confirmPassword}
            placeholder="Confirm new password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {confirmPassword && password !== confirmPassword && (
            <Text color={"red"} fontSize={"sm"}>
              Passwords do NOT match
            </Text>
          )}

          <Button
            mt="4"
            bg="blue.700"
            mx="auto"
            my="40px"
            w="20%"
            h="70px"
            _hover={{ bg: "blue.800" }}
            onClick={handleSubmit}
          >
            Reset
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default ResetPassword;