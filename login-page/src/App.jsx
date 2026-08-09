// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
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

function App() {
 return(
  <BrowserRouter>
  <Navbar/>
   <Routes>
    
    <Route path='/' element={<LogIn/>} />
    <Route path='/LogIn' element={<LogIn/>} />
    <Route path='/Home' element={<Home/>} />
    <Route path='/SignUp' element={<SignUp/>} />
    <Route path='/ResetPassword/:token' element={<ResetPassword/>} />
    <Route path='/ForgotPass' element={<ForgotPass/>} />
    <Route path='/AppointmentBooking' element={<AppointmentBooking/>} />
    <Route path='/Doctors' element={<Doctors/>} />
    
   </Routes>
   <Footer/>
  </BrowserRouter>
 );
}

export default App
