import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

// --- Empty state ---
function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32 px-6 text-center">
      <span className="text-6xl opacity-10 select-none">♡</span>
      <p className="text-lg font-semibold text-white/50">No favourites yet</p>
      <p className="text-sm text-white/25 max-w-xs leading-relaxed">
        Browse movies and tap the heart icon to save titles you love.
      </p>
      <Link
        to="/home"
        className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition active:scale-[.97]"
      >
        Browse movies
      </Link>
    </div>
  );
}

// --- Single favourite card ---
function FavoriteCard({ movie, onRemove }) {
  const navigate = useNavigate();

  return (
    <div
      className="
        group relative rounded-2xl overflow-hidden cursor-pointer
        border border-white/[0.06]
        transition-all duration-350 ease-[cubic-bezier(.23,1,.32,1)]
        hover:-translate-y-1.5 hover:scale-[1.02]
        hover:shadow-[0_20px_50px_rgba(0,0,0,.6)]
        hover:border-red-500/20
      "
      onClick={() => navigate(`/movies/${movie.id}`)}
    >
      {/* Poster */}
      <img
        src={`${API_BASE}${movie.image}`}
        alt={movie.title}
        className="w-full h-56 object-cover block"
        loading="lazy"
      />

      {/* Bottom gradient + info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-3 pb-3 pt-8">
        <p className="text-sm font-semibold text-white truncate">{movie.title}</p>
        {movie.release_year && (
          <p className="text-[10px] text-white/30 mt-0.5">{movie.release_year}</p>
        )}
      </div>

      {/* Remove button — appears on hover */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // don't navigate when removing
          onRemove(movie.id);
        }}
        aria-label={`Remove ${movie.title} from favourites`}
        className="
          absolute top-2.5 right-2.5
          w-7 h-7 flex items-center justify-center
          rounded-full bg-black/70 border border-white/10
          text-white/40 text-[11px]
          opacity-0 group-hover:opacity-100
          hover:bg-red-950/60 hover:border-red-500/30 hover:text-red-400
          transition duration-200
        "
      >
        ✕
      </button>
    </div>
  );
}

// --- Main component ---
function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // Read from localStorage once on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(stored);
    } catch {
      setFavorites([]);
    }
  }, []);

  const handleRemove = (id) => {
    const updated = favorites.filter((m) => m.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setFavorites([]);
    localStorage.removeItem("favorites");
  };

  // ── Empty state ──
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-[#090909]">
        <EmptyFavorites />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-red-500 mb-1">
              Your list
            </p>
            <div className="flex items-center gap-3">
              <h1 className="font-['Bebas_Neue'] text-4xl tracking-widest text-white">
                Favourites
              </h1>
              <span className="text-xs text-white/25 border border-white/[0.08] px-2.5 py-1 rounded-full">
                {favorites.length} {favorites.length === 1 ? "movie" : "movies"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-white/25 border border-white/[0.08] px-4 py-2 rounded-lg hover:text-red-400 hover:border-red-500/20 transition"
          >
            Clear all
          </button>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites.map((movie) => (
            <FavoriteCard
              key={movie.id}
              movie={movie}
              onRemove={handleRemove}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Favorites;