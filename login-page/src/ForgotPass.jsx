import { Box, Input, VStack, Button, Text, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
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

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setMessage(
        data.message ||
          "If an account with that email exists, a reset link has been sent."
      );
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.400" p={4} pt="90px">
      <Box
        bg="#10104b"
        minH="500px"
        maxW="600px"
        mx="auto"
        rounded="5%"
        p="40px"
      >
        <VStack spacing={5} align="stretch">

          <Heading color="gray.300" textAlign="center">
            Forgot Password
          </Heading>

          <Text color="gray.300" fontSize="18px">
            Enter your email address and we will send you a password reset
            link.
          </Text>

          <Input
            type="email"
            bg="gray.300"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
            <Text color="red.300">
              {error}
            </Text>
          )}

          {message && (
            <Text color="green.300">
              {message}
            </Text>
          )}

          <Button
            bg="blue.700"
            color="white"
            isLoading={loading}
            onClick={handleSubmit}
          >
            Send Reset Link
          </Button>

          <Button
            variant="ghost"
            color="gray.300"
            onClick={() => navigate("/LogIn")}
          >
            Back to Login
          </Button>

        </VStack>
      </Box>
    </Box>
  );
}

export default ForgotPassword;