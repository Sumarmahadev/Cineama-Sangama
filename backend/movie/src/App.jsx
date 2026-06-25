import './App.css'
import { Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import Navbar      from './components/Navabar.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Home        from './pages/Home.jsx'
import Favorite    from './pages/Favorite.jsx'
import MovieDetails from './lang/MovieDetails.jsx'


import { Login }    from './Api/Auth/Login.jsx'
import { Register } from './Api/Auth/Register.jsx'

function App() {
  const location = useLocation()

  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname)

  return (
    <>
      <Toaster position="top-center" />

      {!hideNavbar && <Navbar />}

      <main className="w-full min-h-screen bg-[#090909] overflow-x-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  )
}

export default App