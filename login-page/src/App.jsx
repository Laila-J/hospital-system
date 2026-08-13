
import './App.css'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import LogIn from './LogIn'
import SignUp from './SignUp'
import ResetPassword from './ResetPassword'
import AppointmentBooking from './AppointmentBooking'
import Home from './Home'
import Navbar from './Navbar'
import Footer from './Footer'
import Doctors from './Doctors'
import ForgotPass from './ForgotPass'
import MyAppointments from './MyAppointments'
import DoctorDashboard from './DoctorDashboard'
import PatientProfile from './PatientProfile'
import DoctorProfile from './DoctorProfile'

function App() {
 return(
  <BrowserRouter>
  <Navbar/>
   <Routes>
    
    <Route path='/Home' element={<Home/>} />
    <Route path='/LogIn' element={<LogIn/>} />
    <Route path='/' element={<Home/>} />
    <Route path='/SignUp' element={<SignUp/>} />
    <Route path='/ResetPassword/:token' element={<ResetPassword/>} />
    <Route path='/ForgotPass' element={<ForgotPass/>} />
    <Route path='/AppointmentBooking' element={<AppointmentBooking/>} />
    <Route path='/Doctors' element={<Doctors/>} />
    <Route path='/MyAppointments' element={<MyAppointments/>} />
    <Route path='/DoctorDashboard' element={<DoctorDashboard/>} />
    <Route path='/PatientProfile' element={<PatientProfile/>} />
<Route path='/DoctorProfile/:id' element={<DoctorProfile/>} />

   </Routes>
   <Footer/>
  </BrowserRouter>
 );
}

export default App
