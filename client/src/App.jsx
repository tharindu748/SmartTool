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
import CustomerProfile from './userprofile/customer' 
import PrivateRoute from './components/auth/PrivateRoute' // Import the PrivateRoute component
import Dashboard from './pages/dashbord/Dashboard' // Import the Dashboard component
import Register from './pages/auth/Register'
// import SupplierDashboard from './pages/supplier/Dashboard'
import SupplierOrders from './pages/supplier/Orders'
import SupplierProducts from './pages/supplier/Products'
import SupplierAnalytics from './pages/supplier/Analiytics'
import SupplierBank from './pages/supplier/Bank'
import SupplierProfile from './pages/supplier/Profile'  
import ExpertProfile from './pages/expert/EProfile'




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
      <Route path="/customer" element={<CustomerProfile />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/supplier" element={<SupplierDashboard />} /> */}
      <Route path="/orders" element={<SupplierOrders />} />  
      <Route path="/products" element={<SupplierProducts />} />
      <Route path="/analytics" element={<SupplierAnalytics />} />
      <Route path="/bank" element={<SupplierBank />} />
      <Route path="/eprofile" element={<ExpertProfile />} />
      <Route path="/supplier" element={<SupplierProfile />} />


        {/* Protected route using PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
      </Routes>
      
   <Footer /> {/* Include the Footer component */}
    </BrowserRouter>
   
  )
}
