import { useEffect, useState } from "react";

import Kannada from "../lang/Kannada";
import Hindi from "../lang/Hindi";
import English from "../lang/English";
import Top from "../lang/Top";
import Today from "../lang/Today";

const API_URL = "http://127.0.0.1:8000/api/movies/";

function groupByLanguage(movies) {
  return {
    kannada: movies.filter((m) => m.language === "Kannada"),
    hindi: movies.filter((m) => m.language === "Hindi"),
    english: movies.filter((m) => m.language === "English"),
  };
}

function SkeletonSection() {
  return (
    <div className="px-6 py-8 animate-pulse">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-5 w-16 bg-white/5 rounded" />
        <div className="h-7 w-44 bg-white/5 rounded" />
      </div>

      <div className="flex gap-4 overflow-x-auto">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-36 h-52 bg-white/5 rounded-2xl flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="mx-6 mt-4 flex items-center justify-between gap-3 bg-red-950/40 border border-red-500/20 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
        <p className="text-sm text-red-400">{message}</p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="text-xs text-red-400/70 hover:text-red-300 border border-red-500/20 rounded-lg px-3 py-1.5 transition flex-shrink-0"
      >
        Retry
      </button>
    </div>
  );
}

function Divider() {
  return <div className="mx-6 border-t border-white/[0.04]" />;
}

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      setMovies(data);
    } catch (err) {
      setError(err.message || "Failed to load movies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const { kannada, hindi, english } = groupByLanguage(movies);

  // Movies that have trailers
  const trailerMovies = movies.filter(
    (movie) => movie.trailer
  );

  // Random trailer movie for hero section
  const topMovie =
    trailerMovies.length > 0
      ? trailerMovies[
          Math.floor(Math.random() * trailerMovies.length)
        ]
      : null;

  return (
    <div className="w-full min-h-screen bg-[#090909] overflow-x-hidden">
      <Top movie={topMovie} />

      <Today data={movies} />

      <Divider />

      {error && (
        <ErrorBanner
          message={error}
          onRetry={fetchMovies}
        />
      )}

      {loading && (
        <>
          <SkeletonSection />
          <Divider />
          <SkeletonSection />
          <Divider />
          <SkeletonSection />
        </>
      )}

      {!loading && !error && (
        <>
          <Kannada data={kannada} />
          <Divider />
          <Hindi data={hindi} />
          <Divider />
          <English data={english} />
        </>
      )}
    </div>
  );
}