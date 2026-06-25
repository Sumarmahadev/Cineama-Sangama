import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import VideoPlayer from "../VideoControler/VideoPlayer";

const API_BASE = "http://127.0.0.1:8000";

function getUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

function Tag({ children, variant = "default" }) {
  const styles = {
    default: "bg-white/[0.04] border-white/[0.08] text-white/35",
    language: "bg-amber-900/30 border-amber-700/25 text-amber-300",
  };

  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md border ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

function Stat({ label, value }) {
  if (!value) return null;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-semibold uppercase tracking-widest text-white/25">
        {label}
      </span>

      <span className="text-sm font-medium text-white/75">
        {value}
      </span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse">
      <div className="w-24 h-4 bg-white/5 rounded mb-8" />
      <div className="w-full aspect-video bg-white/5 rounded-2xl mb-8" />
      <div className="w-48 h-4 bg-white/5 rounded mb-4" />
      <div className="w-72 h-9 bg-white/5 rounded mb-4" />
      <div className="w-full h-4 bg-white/5 rounded mb-2" />
      <div className="w-5/6 h-4 bg-white/5 rounded" />
    </div>
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const fetchMovie = async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await fetch(`${API_BASE}/api/movies/${id}/`);

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();

      setMovie(data);

      const email =
        localStorage.getItem("userEmail") || "guest";

      const favs = JSON.parse(
        localStorage.getItem(`favorites_${email}`) || "[]"
      );

      setFavorited(
        favs.some((m) => m.id === data.id)
      );
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const handleFavorite = () => {
    if (!movie) return;

    const email =
      localStorage.getItem("userEmail") || "guest";

    const key = `favorites_${email}`;

    const favs = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    let updated = [];

    if (favorited) {
      updated = favs.filter(
        (m) => m.id !== movie.id
      );
    } else {
      updated = [...favs, movie];
    }

    localStorage.setItem(
      key,
      JSON.stringify(updated)
    );

    setFavorited(!favorited);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090909]">
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center gap-4 flex-col text-center p-8">
        <p className="text-lg font-semibold text-white/50">
          Couldn't load this movie
        </p>

        <div className="flex gap-3">
          <button
            onClick={fetchMovie}
            className="px-5 py-2 rounded-xl text-sm border border-white/10 text-white/50 hover:text-white transition"
          >
            Retry
          </button>

          <Link
            to="/home"
            className="px-5 py-2 rounded-xl text-sm bg-red-600 hover:bg-red-700 text-white transition"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909]">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/70 mb-8 transition"
        >
          ← Back
        </button>

        {movie.video ? (
          <VideoPlayer
            src={getUrl(movie.video)}
            poster={getUrl(movie.image)}
            title={movie.title}
          />
        ) : (
          <div className="w-full aspect-video flex flex-col items-center justify-center gap-3 border border-dashed border-white/[0.08] rounded-2xl">
            <span className="text-4xl opacity-15">
              🎬
            </span>

            <p className="text-sm text-white/20">
              No video available
            </p>
          </div>
        )}

        <div className="mt-8">

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {movie.language && (
              <Tag variant="language">
                {movie.language}
              </Tag>
            )}

            {movie.genre && (
              <Tag>
                {movie.genre}
              </Tag>
            )}

            {movie.release_year && (
              <Tag>
                {movie.release_year}
              </Tag>
            )}
          </div>

          <h1 className="font-['Bebas_Neue'] text-5xl tracking-widest text-white leading-none mb-4">
            {movie.title}
          </h1>

          {movie.description && (
            <p className="text-sm text-white/40 leading-relaxed max-w-xl mb-6">
              {movie.description}
            </p>
          )}

          <div className="flex flex-wrap gap-6 py-5 border-y border-white/[0.05] mb-7">
            <Stat
              label="Release Year"
              value={movie.release_year}
            />

            <Stat
              label="Language"
              value={movie.language}
            />

            <Stat
              label="Rating"
              value={
                movie.rating
                  ? `★ ${movie.rating}`
                  : null
              }
            />
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={handleFavorite}
              className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl border transition ${
                favorited
                  ? "bg-red-950/40 border-red-500/25 text-red-400"
                  : "bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white"
              }`}
            >
              {favorited
                ? "♥ Favourited"
                : "♡ Add to favourites"}
            </button>

            <Link
              to="/home"
              className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl border border-white/[0.08] text-white/35 hover:text-white/70 transition"
            >
              ← All movies
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}