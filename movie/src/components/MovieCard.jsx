import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

// --- Helpers ---
function getImageUrl(path) {
  return `${API_BASE}${path}`;
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch {
    return [];
  }
}

function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}

// --- Component ---
function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(
    () => getFavorites().some((m) => m.id === movie.id)
  );

  const handleFavorite = (e) => {
    e.stopPropagation(); // prevent card click while toggling
    const favs = getFavorites();

    if (isFavorited) {
      // Remove from favorites
      saveFavorites(favs.filter((m) => m.id !== movie.id));
    } else {
      // Add to favorites
      saveFavorites([...favs, movie]);
    }

    setIsFavorited((prev) => !prev);
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/movies/${movie.id}`);
  };

  return (
    <div
      className="relative w-44 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Card shell ── */}
      <div
        className={`
          relative rounded-2xl overflow-hidden border border-white/5
          transition-all duration-500 ease-[cubic-bezier(.23,1,.32,1)]
          ${isHovered
            ? "scale-105 -translate-y-2 shadow-[0_24px_60px_rgba(0,0,0,.7),0_0_0_1px_rgba(229,9,20,.25)]"
            : "shadow-lg"
          }
        `}
      >
        {/* Poster */}
        <img
          src={getImageUrl(movie.image)}
          alt={movie.title}
          className="w-full h-60 object-cover block"
          loading="lazy"
        />

        {/* Always-visible gradient + title */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-8">
          {movie.genre && (
            <p className="text-[9px] uppercase tracking-widest text-white/40 font-medium mb-0.5">
              {movie.genre}
            </p>
          )}
          <p className="text-sm font-bold text-white leading-tight truncate">
            {movie.title}
          </p>
          {movie.rating && (
            <p className="text-[10px] text-yellow-400 mt-0.5">
              ★ {movie.rating}
            </p>
          )}
        </div>
      </div>

      {/* ── Hover overlay ── */}
      <div
        className={`
          absolute inset-0 rounded-2xl bg-black/92 p-3
          flex flex-col gap-2
          transition-all duration-350 ease-[cubic-bezier(.23,1,.32,1)]
          ${isHovered
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
          }
        `}
      >
        {/* Video preview */}
        {movie.video ? (
          <video
            src={getImageUrl(movie.video)}
            poster={getImageUrl(movie.image)}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-28 object-cover rounded-lg border border-white/5 flex-shrink-0"
          />
        ) : (
          <div className="w-full h-28 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 flex-shrink-0">
            <span className="text-white/20 text-xl">▶</span>
          </div>
        )}

        {/* Title + description in overlay */}
        <p className="text-sm font-bold text-white truncate">{movie.title}</p>

        {movie.description && (
          <p className="text-[10px] text-white/40 leading-relaxed line-clamp-2 flex-1">
            {movie.description}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          {/* Play */}
          <button
            type="button"
            onClick={handlePlay}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white text-black rounded-lg py-2 text-xs font-semibold hover:bg-gray-100 active:scale-[.97] transition duration-150"
          >
            <span
              className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[7px]
                         border-t-transparent border-b-transparent border-l-black"
            />
            Play
          </button>

          {/* Favorite toggle */}
          <button
            type="button"
            onClick={handleFavorite}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            className={`
              w-9 h-9 flex items-center justify-center rounded-lg border text-sm
              transition duration-150 active:scale-[.97]
              ${isFavorited
                ? "bg-red-950/60 border-red-500/50 text-red-400"
                : "bg-white/5 border-white/10 text-white/50 hover:border-red-500/30 hover:text-red-400"
              }
            `}
          >
            {isFavorited ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;