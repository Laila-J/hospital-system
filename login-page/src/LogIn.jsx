import{Box,
  Input,
  VStack,
  Button,
  Text,
  Image,
  Heading,
  Checkbox,
} from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function LogIn(){

    const[checked,setChecked]=useState(false);
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[emailError,setEmailError]=useState("");
    const[passwordError,setPasswordError]=useState("");
    const[validEmail,setValidEmail]=useState("");
    const[validPassword,setValidPassword]=useState("");

    const navigate=useNavigate();

    const handleSubmit=()=>{
        
        let valid=true;

        if(!email.includes("@")){
            setEmailError("Invalid email!");
            valid=false;
        }
        else{
            setEmailError("");
        }

        if(email===""){
            setValidEmail("Email is required!")
            valid=false;
        }
        else{
            setValidEmail("");
        }

        if(password.length<8){
            setPasswordError("Password must be atleast 8 characters!");
            valid=false;
        }
        else{
            setPasswordError("");
        }

        if(password===""){
            setValidPassword("Password is required!")
            valid=false;
        }
        else{
            setValidPassword("");
        }

        if(valid){
            const loginUser=async()=>{
                try{
                    const res=await fetch("http://localhost:5000/api/auth/login",{
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify({email,password})
                    });
                    const data=await res.json();

                    console.log(data);

                    if(res.ok){
                        navigate("/AppointmentBooking");
                    }
                    else{
                        alert(data.message);
                    }
                } catch(error){
                    console.log(error);
                }
            };
            loginUser();
            
        }
    }

    return(
        <Box minH="100vh" bg="gray.400" p={4} pt={"90px"}>
            <Box bg="#10104b" minH="100vh" maxW="600px" mx="auto" rounded={"5%"} p="20px" >
                <VStack align="start">

                    <Image src='../public/login.jpg' alt="photo" w="100%" mx="auto" rounded={"5%"}  />

                    <Heading color="gray.300" mx="auto"> Log In</Heading>
                    
                    <Text color="gray.300" fontSize={20} >Email:</Text>
                    <Input type='email' placeholder='example@gmail.com' bg="gray.300" w="60%" value={email} onChange={(e)=>setEmail(e.target.value)} />

                    {validEmail&&(
                        <Text>{validEmail}</Text>
                    )}

                    {emailError &&(
                        <Text color="red" >{emailError}</Text>
                    )}
                    
                    <Text color="gray.300" fontSize={20} >password:</Text>
                    <Input type='password' placeholder='enter your password' bg="gray.300" w="60%" value={password} onChange={(e)=>setPassword(e.target.value)} />

                    {validPassword&&(
                        <Text color="red" >{validPassword}</Text>
                    )}

                    {passwordError&&(
                        <Text color="red" >{passwordError}</Text>
                    )}

                    <Checkbox isChecked={checked} onChange={(e)=>setChecked(e.target.checked)} >
                        <Text color="gray.300" fontSize={18} >Remember me!</Text>
                    </Checkbox>
                    
                    
                    <Button  mt="4" bg="blue.700" mx="auto" my="50px" w="20%" h="70px" _hover={{bg:"blue.800"}} onClick={handleSubmit} >
                        LogIn
                    </Button>

                    <Text color="gray.300" mx="auto" >Forgot ypur password? No worries! <Link to="/ResetPassword" >Reset password</Link></Text>

                    <Text color="gray.300" mx="auto" >Don't have an account? <Link to="/SignUp">Sign Up</Link> </Text>
                </VStack>
            </Box>
        </Box>
    )
}
export default LogIn;