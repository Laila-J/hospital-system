import {useState, useEffect} from "react"
import{
    Box,
    Heading,
    Text,
    SimpleGrid,
    Card,
    CardBody,
    Button,
    VStack,
    HStack,
    Spinner,
    Input,
} from "@chakra-ui/react"

function MyAppointments(){
    const[appointments, setAppointments]=useState();
    const[loading, setLoading]=useState(true);
    const[error,setError]=useState("");

    const[editingAppointment,setEditingAppointment]=useState(null);
    const[editDate,setEditDate]=useState("");
    const[editTime,setEditTime]=useState("");

    useEffect(()=>{
        const token=localStorage.getItem("token");

        if(!token){
          // schedule state updates to avoid synchronous setState within effect
          setTimeout(()=>{
            setError("Please log in to view your appointments");
            setLoading(false);
          },0);
          return;
        }

        fetch("http://localhost:5000/api/appointments/me",{
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`,
            },
        })
        .then(async(response)=>{
            const data=await response.json();

            if(!response.ok){
                throw new Error(data.message || "Failed to load appointments");
            }
            return data;
        })
        .then((data)=>{
            setAppointments(data.appointments || []);
            setLoading(false);
        })
        .catch((err)=>{
            console.log("Appointments error:", err);
            setError(err.message);
            setLoading(false);
        });
    },[]);

    if(loading){
        return(
            <Box textAlign={"center"} py="100px" >
                <Spinner size="xl" />
                <Text mt="4">Loading your appointments...</Text>
            </Box>
        );
    }

    if(error){
        return(
            <Box textAlign={"center"} py="100px" >
                <Text color="red.500" >{error}</Text>
            </Box>
        );
    }

    const handleEdit=(appointment)=>{

        setEditingAppointment(appointment);
        setEditDate(
            new Date(appointment.preferredDate).toISOString().split("T")[0]
        );
        setEditTime(appointment.preferredTime);
    };

    const handleCancel=async(appointmentId)=>{
        const token= localStorage.getItem("token");

        if(!window.confirm("Are you sure you want to cancel this appointment?")){
            return;
        }
        try{
            const response= await fetch(
                `http://localhost:5000/api/appointments/${appointmentId}`,
                {
                    method:"DELETE",
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                }
            );

            const data= await response.json();
            if(!response.ok){
                throw new Error(data.message || "Failed to cancel appointment.");
            }

            //Update the appointment on the page immediately
            setAppointments((prev)=>
            prev.filter((appointment)=> appointment._id!==appointmentId));
        } catch(error){
            console.error("Cancel appointment error:", error);
            alert(error.message);
        }
    };

    const handleUpdate= async()=>{
        const token=localStorage.getItem("token");

        try{
            const response= await fetch(
                `http://localhost:5000/api/appointments/${editingAppointment._id}`,
                {
                    method:"PATCH",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body:JSON.stringify({
                        preferredDate: editDate,
                        preferredTime:editTime,
                    }),
                }``
            );

            const data= await response.json();

            if(!response.ok){
                throw new Error(data.message || "Failed to update appointment.");
            }

            setAppointments((prev)=>
            prev.map((appointment)=>
            appointment._id===editingAppointment._id ? data.appointment:appointment));

            setEditingAppointment(null);
        } catch(error){
            console.error("Update appointment error:",error);
            alert(error.message);
        }
    };

    return(
        <Box minH="100vh" px="40px" pt="120px" pb="40px" >
            <Heading textAlign="center" mb="40px" color="blue.800" >
                My Appointments
            </Heading>

            {appointments.length===0?(
                <Text textAlign={"center"} >
                    You don't have any appointments yet.
                </Text>
            ):(
               <SimpleGrid columns={{base:1,md:2,lg:3}} spacing="30px" >
                {appointments.map((appointment)=>(
                   <Card key={appointment._id}>
  <CardBody backgroundColor="#1460a3" borderRadius="5%">
    <VStack align="start" spacing="3">

      <Heading size="md">
        {appointment.doctorName}
      </Heading>

      <Text color="gray.300">
        <Text as="span" fontWeight="bold" color="gray.300">
          Specialty:
        </Text>{" "}
        {appointment.specialty}
      </Text>

      {editingAppointment?._id === appointment._id ? (
        <>
          {/* Edit Date */}
          <Text color="gray.300" fontWeight="bold">
            Date:
          </Text>

          <Input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            bg="white"
            color="black"
          />

          {/* Edit Time */}
          <Text color="gray.300" fontWeight="bold">
            Time:
          </Text>

          <Input
            type="time"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
            bg="white"
            color="black"
          />

          <HStack pt="3">
            <Button
              colorScheme="green"
              onClick={handleUpdate}
            >
              Save Changes
            </Button>

            <Button
              colorScheme="gray"
              onClick={() => setEditingAppointment(null)}
            >
              Cancel
            </Button>
          </HStack>
        </>
      ) : (
        <>
          {/* Normal Date */}
          <Text color="gray.300">
            <Text as="span" fontWeight="bold" color="gray.300">
              Date:
            </Text>{" "}
            {new Date(appointment.preferredDate).toLocaleDateString()}
          </Text>

          {/* Normal Time */}
          <Text color="gray.300">
            <Text as="span" fontWeight="bold" color="gray.300">
              Time:
            </Text>{" "}
            {appointment.preferredTime}
          </Text>

          <Text color="gray.300">
            <Text as="span" fontWeight="bold" color="gray.300">
              Status:
            </Text>{" "}
            {appointment.status}
          </Text>

          <HStack pt="3">
            <Button
              colorScheme="blue"
              onClick={() => handleEdit(appointment)}
            >
              Edit
            </Button>

            <Button
              colorScheme="red"
              onClick={() => handleCancel(appointment._id)}
            >
              Cancel
            </Button>
          </HStack>
        </>
      )}

    </VStack>
  </CardBody>
</Card>
                ))}
               </SimpleGrid> 
            )
            }
        </Box>
    );
}

export default MyAppointments;