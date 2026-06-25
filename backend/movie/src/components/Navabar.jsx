import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import logo from "../assets/cinemasangama-logo.png"

function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setIsLoggedIn(false)
    navigate("/login")
  }

  // Shared active/inactive class logic for nav links
  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition duration-150
    ${isActive
      ? "bg-white/[0.06] text-white"
      : "text-white/50 hover:bg-white/[0.04] hover:text-white"
    }`

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5 bg-[#0e0e0e] border-b border-white/[0.06] backdrop-blur-md">

      {/* ── Brand ── */}
      <Link to="/home" className="flex items-center gap-2.5">
        <img
          src={logo}
          alt="Cinemasangama logo"
          className="h-9 w-9 rounded-lg object-cover flex-shrink-0"
        />
        <span className="font-['Bebas_Neue'] text-xl tracking-widest text-white">
          Cinema<span className="text-red-500">sangama</span>
        </span>
      </Link>

     
      <div className="flex items-center gap-1">
        <NavLink to="/home"      className={navLinkClass}>Home</NavLink>
        <NavLink to="/favorites" className={navLinkClass}>Favourites</NavLink>

        <div className="w-px h-4 bg-white/10 mx-2" />

        {isLoggedIn ? (
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-red-950/40 border border-red-500/20 text-red-400 hover:bg-red-950/70 transition duration-150"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/50 border border-white/10 hover:border-white/20 hover:text-white transition duration-150"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition duration-150 ml-1"
            >
              Register
            </Link>
          </>
        )}
      </div>

    </nav>
  )
}

export default Navbar