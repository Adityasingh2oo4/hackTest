import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import './App.css'
import Navbar from './components/Navbar'
import { CartProvider } from './context/cartContext'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import CartPage from './pages/CartPage'
import MyOrders from './pages/MyOrders'
import AdminPortal from './pages/AdminPortal'

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/signin' element={<SignIn />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/orders' element={<MyOrders />} />
              <Route path='/admin' element={<AdminPortal />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
