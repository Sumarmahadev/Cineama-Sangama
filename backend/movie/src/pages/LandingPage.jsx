
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import collage from "../assets/collage-7.jpg";
import logo from "../assets/cinemasangama-logo.png";

// --- Static Why Section ---
const WHY_REASONS = [
  {
    id: 1,
    label: "Fun",
    desc: "Escape reality with stories that entertain.",
    bg: "bg-amber-950",
    text: "text-amber-300",
  },
  {
    id: 2,
    label: "Emotion",
    desc: "Feel deeply and connect with human stories.",
    bg: "bg-pink-950",
    text: "text-pink-300",
  },
  {
    id: 3,
    label: "Learning",
    desc: "Gain perspectives on history, culture and ideas.",
    bg: "bg-blue-950",
    text: "text-blue-300",
  },
  {
    id: 4,
    label: "Relax",
    desc: "Unwind after a long day with your favourite film.",
    bg: "bg-green-950",
    text: "text-green-300",
  },
];

function LandingPage() {
  const [email, setEmail] = useState("");

  // Backend movies state
  const [movies, setMovies] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch movies from backend
  useEffect(() => {
    fetch("http://localhost:5000/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching movies:", err);
        setLoading(false);
      });
  }, []);

  const handleGetStarted = () => {
    if (!email) return;

    console.log("Email submitted:", email);
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 sticky top-0 z-50 bg-[#080808]/90 backdrop-blur-md">

        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Cinemasangama logo"
            className="h-10 w-10 rounded-lg object-cover"
          />

          <span className="text-xl font-bold tracking-wide">
            Cinema<span className="text-red-500">sangama</span>
          </span>
        </div>

        <Link
          to="/login"
          className="border border-red-500 text-red-500 px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition duration-200"
        >
          Sigin
        </Link>
      </nav>

      {/* ── Hero Section ── */}
      <header className="relative min-h-[85vh] flex items-center justify-center text-center overflow-hidden">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url(${collage})`,
            filter: "blur(6px)",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Content */}
        <div className="relative z-10 px-6 max-w-2xl">

          <span className="inline-block bg-red-950/60 border border-red-800/40 text-red-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Now Streaming
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
            <span className="text-pink-400"> Where</span>

            <span className="text-blue-500"> Every</span>

            <span className="text-red-500"> Frame </span>

            <span className="text-green-500">Matters</span>
          </h1>

          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            A good movie can change your mood.
            A great one can change your life.
          </p>

          {/* Email CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition sm:w-72"
            />

            <Link
              to="/register"
              onClick={handleGetStarted}
              className="bg-red-600 hover:bg-red-700 active:scale-[.98] text-white font-semibold text-sm px-7 py-3 rounded-lg transition duration-200"
            >
              Get Started
            </Link>

          </div>
        </div>
      </header>

      {/* ── Trending Movies ── */}
      <section className="px-8 py-14">

        <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-1">
          What's hot
        </p>

        <h2 className="text-3xl font-bold mb-8">
          Trending Movies
        </h2>

        {/* Loading */}
        {loading ? (
          <div className="text-white/40 text-sm">
            Loading movies...
          </div>
        ) : movies.length > 0 ? (

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">

            {movies.map((movie) => (

              <div
                key={movie.id}
                className="bg-[#111] border border-white/5 rounded-xl overflow-hidden hover:-translate-y-1 hover:border-red-500/40 transition duration-200 cursor-pointer"
              >

                {/* Poster */}
                <div
                  className="h-36 bg-cover bg-center flex items-end p-3"
                  style={{
                    backgroundImage: `url(${movie.poster})`,
                  }}
                >
                  <span className="text-xs text-white/70 font-medium">
                    {movie.genre}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3">

                  <p className="text-sm font-semibold text-gray-100 mb-2">
                    {movie.title}
                  </p>

                  <button
                    type="button"
                    className="text-xs text-red-400 hover:text-red-300 font-medium transition"
                  >
                    Watch Now →
                  </button>

                </div>

              </div>
            ))}
          </div>

        ) : (

          <div className="text-white/30 text-sm">
            No movies available
          </div>
        )}
      </section>

      {/* ── Why Watch ── */}
      <section className="bg-[#0a0a0a] border-t border-white/5 px-8 py-14">

        <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-1">
          Why us
        </p>

        <h2 className="text-3xl font-bold text-center mb-10">
          Why Watch Movies?
        </h2>

        <div className="flex flex-wrap gap-5 justify-center">

          {WHY_REASONS.map((reason) => (

            <div
              key={reason.id}
              className={`${reason.bg} ${reason.text} w-44 rounded-2xl p-5 flex flex-col gap-2 border border-white/5`}
            >

              <p className="text-base font-bold">
                {reason.label}
              </p>

              <p className="text-xs leading-relaxed opacity-70">
                {reason.desc}
              </p>

            </div>
          ))}

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-8 py-6 flex items-center justify-between">

        <span className="text-sm font-semibold text-white/30">
          Cinema<span className="text-red-500">sangama</span>
        </span>

        <span className="text-xs text-white/20">
          © 2026 Cinemasangama. All rights reserved.
        </span>

      </footer>
    </div>
  );
}

export default LandingPage;

