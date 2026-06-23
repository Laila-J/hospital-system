import{Box,
  Input,
  VStack,
  Button,
  Text,
  Image,
  Heading,
  Select,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react"
import { Link } from "react-router-dom";
import { useState } from "react";
import {useNavigate} from "react-router-dom"

function SignUp(){

    const[profileType, setProfileType]=useState("");
    const[profileTypeError,setProfileTypeError]=useState("");

    const[date, setDate]=useState("");

    const[showHint,setShowHint]=useState(false);
    const[password,setPassword]=useState("");
    const[confirmPassword,setConfirmPassword]=useState("");
    const[passwordError,setPasswordError]=useState("");

    const[email,setEmail]=useState("");
    const[emailError,setEmailError]=useState("");

    const[validEmail,setValidEmail]=useState("");
    const[validPassword,setValidPassword]=useState("");

    const[firstName,setFirstName]=useState("");
    const[firstNameError,setFirstNameError]=useState("");

    const[lastName,setLastName]=useState("");
    const[lastNameError,setLastNameError]=useState("");

    const[nationalNumber,setNationalNumber]=useState("");
    const[nationalNumberError,setNationalNumberError]=useState("");

    const[occupation,setOccupation]=useState("");
    const[occupationError,setOccupationError]=useState("");

    const[licenseSourse,setLicenseSource]=useState("");
    const[licenseSourseError,setLicenseSourceError]=useState("");

    const[bloodType,setBloodType]=useState("");
    const[bloodTypeError,setBloodTypeError]=useState("");

    const[allergies,setAllergies]=useState("");
    const[allergiesError,setAllergiesError]=useState("");

    const[gender,setGender]=useState("");

    const navigate=useNavigate();


     const handleSubmit=async()=>{
        console.log("signup clicked");
        
        let valid=true;

        if(firstName===""){
            setFirstNameError("First name is required");
            valid=false;
        }else{
            setFirstNameError("");
        }

        if(lastName===""){
            setLastNameError("Last name is required");
            valid=false;
        }
        else{
            setLastNameError("");
        }

        if(nationalNumber===""){
            setNationalNumberError("National number is required");
            valid=false;
        }
        else{
            setNationalNumberError("");
        }

        if(profileType===""){
            setProfileTypeError("Please choose your profile type");
            valid=false;
        }
        else{
            setProfileTypeError("");
        }

        if(occupation===""){
            setOccupationError("Occupation is required");
            valid=false;
        }
        else{
            setOccupationError("");
        }

        if(licenseSourse===""){
            setLicenseSourceError("License source is required");
            valid=false;
        }
        else{
            setLicenseSourceError("");
        }

        if(bloodType===""){
            setBloodTypeError("You must choose your blood type");
            valid=false;
        }
        else{
            setBloodTypeError("");
        }

        if(allergies===""){
            setAllergiesError("Please declare if you have any allergies");
            valid=false;
        }
        else{
            setAllergiesError("");
        }

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
            
                try{
                    const res=await fetch("https://localhost:5000/api/auth/register",{
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json",
                        },
                        body:JSON.stringify({
                            firstName,
                            lastName,
                            email,
                            password,
                            gender,
                            profileType,
                            nationalNumber,
                        }),
                    });
                console.log("status:",res.status);
                const text=await res.text();
                console.log("raw response:",text);
                

                navigate("/Home")
                } catch(error){
                    console.log("error:",error);
                }
               
            }
          
        }
    

    return(
        <Box minH="100vh" bg="gray.400" p={4} pt={"90px"} >
            <Box bg="#10104b" minH="100vh" maxW="600px" mx="auto" rounded={"5%"} p="20px" >
                <VStack align="start" >

                    <Image src="../public/login.jpg" alt="photo"  w="100%" mx="auto" rounded={"5%"} />

                    <Heading  color="gray.300" mx="auto" >Welcome! Create your account here..</Heading>

                    <Text color="gray.300" fontSize={20} >First name:</Text>
                    <Input bg="gray.300" placeholder="Enter your first name" w="60%" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />

                    {firstNameError&&(
                        <Text color={"red"} >{firstNameError}</Text>
                    )}

                    <Text color="gray.300" fontSize={20} >Last name:</Text>
                    <Input bg="gray.300" placeholder="Enter your last name" w="60%" value={lastName} onChange={(e)=>setLastName(e.target.value)} />

                    {lastNameError&&(
                        <Text color={"Red"} >{lastNameError}</Text>
                    )}

                    <Text color="gray.300" fontSize={20} >Gender:</Text>
                    <RadioGroup value={gender} onChange={(val)=>setGender(val)} >
                        <Stack>
                            <Radio value="Female" colorScheme="gray.300" >
                                <Text color="gray.300" fontSize={20} >Female</Text>
                            </Radio>
                            <Radio value="Male" colorScheme='gray.300' >
                                <Text color="gray.300" fontSize={20} >Male</Text>
                            </Radio>
                        </Stack>
                    </RadioGroup>

                    <Text color="gray.300" fontSize={20} >National number:</Text>
                    <Input bg="gray.300" placeholder="Enter your national number" w="60%" value={nationalNumber} onChange={(e)=>setNationalNumber(e.target.value)} />

                    {nationalNumberError&&(
                        <Text color="red" >{nationalNumberError}</Text>
                    )}

                    <Text color="gray.300" fontSize={20}>Profile type:</Text>
                    <Select  bg="gray.300" w="60%" value={profileType}
                    onChange={(e)=>setProfileType(e.target.value)} >
                        <option value="" disabled hidden >Choose profile type</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Patient">Patient</option>
                    </Select>

                    {profileTypeError&&(
                        <Text color="red" >{profileTypeError}</Text>
                    )}

                    {profileType==="Doctor"&& (<>
                        <Text color="gray.300" fontSize={20} >choose occupation:</Text>
                        <Input placeholder="enter occupation" bg="gray.300" w="60%" value={occupation} onChange={(e)=>setOccupation(e.target.value)} />

                        {occupationError&&(
                            <Text color={"red"}>{occupationError}</Text>
                        )}

                        <Text color="gray.300" fontSize={20}>Years of experience:</Text>
                        <Select bg="gray.300" w="60%" >
                            <option value="" disabled hidden >years of experience </option>
                            <option value="1 - 5">1 - 5</option>
                            <option value="5 - 10" >5 -10</option>
                            <option value="10 +" >10 +</option>
                        </Select>

                        <Text color="gray.300" fontSize={20}>License source:</Text>
                        <Input placeholder="enter source of license" bg="gray.300" w="60%" value={licenseSourse} onChange={(e)=>setLicenseSource(e.target.value)} />

                        {licenseSourseError&&(
                            <Text color={"red"}>{licenseSourseError}</Text>
                        )}
                        </>
                    )}

                    {profileType==="Patient" && (
                        <>
                        <Text color="gray.300" fontSize={20} >Date of birth:</Text>
                        <Input type="date" w="60%" onChange={(e)=>setDate(e.target.value)} bg="gray.300" value={date} />

                        <Text color="gray.300" fontSize={20} >Blood type:</Text>
                        <Select w="60%" bg="gray.300" value={bloodType} onChange={(e)=>setBloodType(e.target.value)} >
                            <option value="" disabled hidden >choose your blood type</option>
                            <option value="A+">A+</option>
                            <option value="A-" >A-</option>
                            <option value="B+" >B+</option>
                            <option value="B-" >B-</option>
                            <option value="AB+" >AB+</option>
                            <option value="AB-" >AB-</option>
                            <option value="O+" >O+</option>
                            <option value="O-" >O-</option>
                        </Select>

                        {bloodTypeError&&(
                            <Text color="red" >{bloodTypeError}</Text>
                        )}

                        <Text color="gray.300" fontSize={20} >Allergies:</Text>
                        <Input bg="gray.300" placeholder="Do you have any allergies?" w="60%" value={allergies} onChange={(e)=>setAllergies(e.target.value)} />

                        {allergiesError&&(
                            <Text color={"red"} >{allergiesError}</Text>
                        )}
                        </>
                    )}

                    <Text color="gray.300" fontSize={20} >Email:</Text>
                    <Input type="email" bg="gray.300" w="60%" placeholder="example@gmail.com" value={email} onChange={(e)=>setEmail(e.target.value)} />

                    {validEmail&&(
                        <Text color={"red"}>{validEmail}</Text>
                    )}

                    {emailError&&(
                        <Text color="red" >{emailError}</Text>
                    )}

                    <Text color="gray.300" fontSize={20} >Password:</Text>
                    <Input  type="password" bg="gray.300" placeholder="create your password" w="60%"
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)}
                    onFocus={()=>setShowHint(true)}
                    onBlur={()=>setShowHint(false)} />

                    {validPassword&&(
                        <Text color="red" >{validPassword}</Text>
                    )}

                    {passwordError&&(
                        <Text color="red" >{passwordError}</Text>
                    )}

                    {showHint&& (
                        <Text fontSize={"sm"} color={"red"}>Password must be atleast 8 characters</Text>
                    )}

                    <Text color="gray.300" fontSize={20} > Confirm password:</Text>
                    <Input  type="password" bg="gray.300" placeholder="Confirm your password" w="60%" 
                    value={confirmPassword} 
                    onChange={(e)=>setConfirmPassword(e.target.value)}/>

                    {confirmPassword && password!==confirmPassword &&(
                        <Text color={"red"} fontSize={"sm"} >Passwords do NOT match</Text>
                    )}

                    <Button mt="4" bg="blue.700" mx="auto" my="40px" w="20%" h="70px" _hover={{bg:"blue.800"}} onClick={handleSubmit} >
                        Sign Up
                    </Button>

                    <Text mx="auto" fontSize={18} color="gray.300">Already have an account? <Link to="/">Log In!</Link></Text>



                </VStack>
            </Box>
        </Box>
    )
}

export default SignUp