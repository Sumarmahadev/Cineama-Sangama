import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LANGUAGES = ["Kannada", "Hindi", "English", "Telugu"];

export default function Top({ movie }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  if (!movie) {
    return (
      <section className="relative w-full h-screen bg-[#090909] flex items-center justify-center">
        <p className="text-white">No trailers available</p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#090909]">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src={`http://127.0.0.1:8000${movie.trailer}`}
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/75 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#090909] to-transparent" />

      <div className="relative z-10 flex flex-col justify-end h-full px-10 pb-16 max-w-2xl">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-[9px] font-bold uppercase tracking-widest bg-red-500/15 border border-red-500/30 text-red-400 px-2.5 py-1 rounded-md">
            Trending Trailer
          </span>

          {LANGUAGES.map((lang) => (
            <span
              key={lang}
              className="text-[9px] font-semibold uppercase tracking-widest bg-white/[0.05] border border-white/10 text-white/40 px-2.5 py-1 rounded-md"
            >
              {lang}
            </span>
          ))}
        </div>

        <h1 className="font-['Bebas_Neue'] text-7xl md:text-8xl tracking-widest leading-none text-white mb-4">
          {movie.title}
        </h1>

        <p className="text-sm text-white/40 leading-relaxed max-w-md mb-8">
          {movie.description}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/movies/${movie.id}`)}
            className="flex items-center gap-2.5 bg-white text-black font-bold text-sm px-7 py-3 rounded-xl hover:bg-gray-100 active:scale-[.97] transition"
          >
            <span className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[9px] border-t-transparent border-b-transparent border-l-black" />
            Watch Movie
          </button>

          <button
            type="button"
            onClick={() => navigate(`/movies/${movie.id}`)}
            className="flex items-center gap-2 bg-white/[0.08] border border-white/10 text-white/70 font-medium text-sm px-6 py-3 rounded-xl hover:bg-white/[0.12] hover:text-white active:scale-[.97] transition"
          >
            ⓘ More Info
          </button>

          <button
            type="button"
            onClick={() => setMuted((prev) => !prev)}
            aria-label={muted ? "Unmute trailer" : "Mute trailer"}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.06] border border-white/10 text-white/40 text-sm hover:bg-white/[0.12] hover:text-white active:scale-[.97] transition ml-1"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>

        <div className="flex items-center gap-2.5 mt-5 flex-wrap">
          {[
            `★ ${movie.rating}`,
            movie.release_year,
            movie.genre,
            movie.language,
          ].map((item, i, arr) => (
            <span key={i} className="flex items-center gap-2.5">
              <span className="text-xs text-white/30">{item}</span>
              {i < arr.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-white/15" />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}