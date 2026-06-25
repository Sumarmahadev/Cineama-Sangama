import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";

const API_BASE = "http://127.0.0.1:8000";

function ScrollButton({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className="
        hidden md:flex items-center justify-center
        w-8 h-8 rounded-full
        bg-white/5 border border-white/10
        text-white/50 text-xs
        hover:bg-white/10 hover:text-white
        active:scale-95 transition duration-150 flex-shrink-0
      "
    >
      {direction === "left" ? "←" : "→"}
    </button>
  );
}

export default function Hindi({ data = [] }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-6 py-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="bg-blue-900/40 text-blue-300 text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded border border-blue-700/25">
            हिंदी
          </span>
         <span className="font-['Bebas_Neue'] text-3xl tracking-widest text-bold text-white-900">
            Hindi Movies
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ScrollButton direction="left"  onClick={() => scroll("left")}  />
          <ScrollButton direction="right" onClick={() => scroll("right")} />
          <button
            type="button"
            onClick={() => navigate("/hindi")}
            className="text-xs text-white/30 hover:text-white/60 transition ml-1"
          >
            See all →
          </button>
        </div>
      </div>

      {/* ── Scroll row ── */}
      {data.length > 0 ? (
        <div
          ref={scrollRef}
          className="
            flex gap-4 overflow-x-auto scroll-smooth pb-3
            [scroll-snap-type:x_mandatory]
            [scrollbar-width:thin]
            [scrollbar-color:rgba(255,255,255,0.1)_transparent]
          "
        >
          {data.map((movie) => (
            <div key={movie.id} className="scroll-snap-align-start flex-shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-white/10 rounded-2xl py-14 text-white/25">
          <span className="text-4xl opacity-30">🎬</span>
          <p className="text-sm">No Hindi movies available yet</p>
        </div>
      )}

    </section>
  );
}