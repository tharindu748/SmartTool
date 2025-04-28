import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Calculation from './pages/Calculation'
import Header from './components/Header' 
import Navbar from './components/Navbar' 
import SignUp from './pages/auth/SignUp'
import SignIn from './pages/auth/SignIn'
import Footer from './components/Footer' // Import the Footer component
// import Register from './pages/Register'
// import CustomerProfile from './userprofile/customer' 
import PrivateRoute from './components/auth/PrivateRoute' // Import the PrivateRoute component
import Dashboard from './pages/dashbord/Dashboard' // Import the Dashboard component
import Register from './pages/auth/Register'
// import SupplierDashboard from './pages/supplier/Dashboard'
import SupplierOrders from './pages/supplier/Orders'
import SupplierProducts from './pages/supplier/Products'
import SupplierAnalytics from './pages/supplier/Analiytics'
import SupplierBank from './pages/supplier/Bank'
import SupplierProfile from './pages/supplier/Profile'  
import SupplierDashboard from './pages/supplier/Dashboard'
import AddProduct from './pages/supplier/AddProduct'
import Marketplace from './pages/Marketplace'
import ExpertProfile from './pages/expert/EProfile'
import TeamPage from './pages/ExpertBooking'
import SingleExpertProfile from './components/expert/Dynamicexpert';
import AppointmentForm from './components/Appointmentform';
import ExpertAppointmentDashboard from './components/expert/ExpertAppointment';
import ChatPage from './pages/ChatPage';
import ChatSidebar from './components/ChatSidebar'
import CustomerAppointments from './pages/customer/customerappointment';
import DashProfile from './pages/DashProfile'
import ProductDetail from './pages/productdetails'



export default function Main() {
  return (
    <BrowserRouter>
    <Header />
    <Navbar />

    <Routes>
      <Route path="/" element ={<Home />} />
      <Route path="/Calculation" element={<Calculation />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/SignIn" element={<SignIn />} />
      {/* <Route path="/customer" element={<CustomerProfile />} /> */}
      <Route path="/register" element={<Register />} />
      <Route path="/orders" element={<SupplierOrders />} />  
      <Route path="/products" element={<SupplierProducts />} />
      <Route path="/analytics" element={<SupplierAnalytics />} />
      <Route path="/bank" element={<SupplierBank />} />
      <Route path="/supplier" element={<SupplierProfile />} />
      <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
      <Route path="/addproduct" element={<AddProduct/>} />
      <Route path='/marketplace' element={<Marketplace />} />
      <Route path='/eprofile' element={<ExpertProfile />} />
      <Route path='/expertbooking' element={<TeamPage />} />
      <Route path='/expert/:expertId' element={<SingleExpertProfile />} />
      <Route path='/appointmentForm' element={<AppointmentForm />} />
      <Route path='/expert/appointments' element={<ExpertAppointmentDashboard />} />
      <Route path="/profile" element={<DashProfile />} />
      <Route path="/chat/:expertId" element={<ChatPage />} />
      <Route path="/chat" element={<ChatSidebar />} />
      <Route path="/customer/appointments" element={<CustomerAppointments />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      


        {/* Protected route using PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
      </Routes>
      
   <Footer /> {/* Include the Footer component */}
    </BrowserRouter>
   
  )
}
