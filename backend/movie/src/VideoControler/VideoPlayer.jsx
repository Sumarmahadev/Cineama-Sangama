import { useRef, useState, useEffect, useCallback } from "react";

// --- Helpers ---
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m   = Math.floor(seconds / 60);
  const s   = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

// --- Main Component ---
export default function VideoPlayer({ src, poster, title }) {
  const videoRef    = useRef(null);
  const progressRef = useRef(null);

  const [playing,     setPlaying]     = useState(false);
  const [muted,       setMuted]       = useState(false);
  const [volume,      setVolume]      = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [buffered,    setBuffered]    = useState(0);
  const [speedIdx,    setSpeedIdx]    = useState(1);   // default 1×
  const [showSkip,    setShowSkip]    = useState(null); // "left" | "right" | null
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef(null);

  // ── Auto-hide controls ──
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    return () => clearTimeout(hideTimer.current);
  }, []);

  // ── Video event handlers ──
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);

    // Update buffered amount
    if (v.buffered.length > 0) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current?.duration || 0);
  };

  const handleEnded = () => setPlaying(false);

  // ── Controls ──
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else         { v.play();  setPlaying(true);  }
    resetHideTimer();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const handleSpeedChange = () => {
    const next = (speedIdx + 1) % SPEEDS.length;
    if (videoRef.current) videoRef.current.playbackRate = SPEEDS[next];
    setSpeedIdx(next);
  };

  // ── Seek — click anywhere on progress bar ──
  const handleSeek = (e) => {
    const bar  = progressRef.current;
    const v    = videoRef.current;
    if (!bar || !v) return;
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * v.duration;
    setCurrentTime(pct * v.duration);
  };

  // ── Skip forward / backward ──
  const skip = (seconds) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + seconds));
    setShowSkip(seconds < 0 ? "left" : "right");
    setTimeout(() => setShowSkip(null), 800);
    resetHideTimer();
  };

  // ── Fullscreen ──
  const toggleFullscreen = () => {
    const wrap = videoRef.current?.closest(".player-wrap");
    if (!document.fullscreenElement) wrap?.requestFullscreen();
    else document.exitFullscreen();
  };

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.code === "Space")       { e.preventDefault(); togglePlay(); }
      if (e.code === "ArrowRight")  { skip(10); }
      if (e.code === "ArrowLeft")   { skip(-10); }
      if (e.code === "ArrowUp")     { e.preventDefault(); setVolume(v => Math.min(1, v + 0.1)); }
      if (e.code === "ArrowDown")   { e.preventDefault(); setVolume(v => Math.max(0, v - 0.1)); }
      if (e.code === "KeyM")        { toggleMute(); }
      if (e.code === "KeyF")        { toggleFullscreen(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, muted]);

  // Progress bar values
  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="player-wrap relative w-full rounded-2xl overflow-hidden bg-black group"
      onMouseMove={resetHideTimer}
    >
      {/* ── Video element ── */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video object-contain block cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* ── Skip indicators ── */}
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-xl transition-opacity duration-200 pointer-events-none ${showSkip === "left" ? "opacity-100" : "opacity-0"}`}>
        ⏪ −10s
      </div>
      <div className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-xl transition-opacity duration-200 pointer-events-none ${showSkip === "right" ? "opacity-100" : "opacity-0"}`}>
        ⏩ +10s
      </div>

      {/* ── Controls overlay ── */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent px-4 pt-8 pb-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>

        {/* ── Progress bar ── */}
        <div
          ref={progressRef}
          onClick={handleSeek}
          className="relative h-1 hover:h-1.5 bg-white/15 rounded-full cursor-pointer mb-3 transition-all duration-150 group/bar"
        >
          {/* Buffered */}
          <div
            className="absolute h-full bg-white/20 rounded-full pointer-events-none"
            style={{ width: `${buffered}%` }}
          />
          {/* Played */}
          <div
            className="absolute h-full bg-red-500 rounded-full pointer-events-none"
            style={{ width: `${progressPct}%` }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md pointer-events-none opacity-0 group-hover/bar:opacity-100 transition-opacity"
            style={{ left: `${progressPct}%` }}
          />
        </div>

        {/* ── Bottom row ── */}
        <div className="flex items-center justify-between gap-2">

          {/* Left side */}
          <div className="flex items-center gap-1">

            {/* Play/Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition text-sm"
            >
              {playing ? "⏸" : "▶"}
            </button>

            {/* Rewind 10s */}
            <button
              type="button"
              onClick={() => skip(-10)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition text-sm"
              title="Rewind 10s"
            >
              ⏪
            </button>

            {/* Forward 10s */}
            <button
              type="button"
              onClick={() => skip(30)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition text-sm"
              title="Forward 10s"
            >
              ⏩
            </button>

            {/* Volume */}
            <button
              type="button"
              onClick={toggleMute}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition text-sm"
            >
              {muted || volume === 0 ? "🔇" : "🔊"}
            </button>
            <input
              type="range"
              min="0" max="1" step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="w-16 h-1 accent-red-500 cursor-pointer"
            />

            {/* Time */}
            <span className="text-xs text-white/50 tabular-nums ml-1 whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Centre title */}
          {title && (
            <span className="hidden md:block text-xs text-white/30 truncate max-w-[200px] font-medium">
              {title}
            </span>
          )}

          {/* Right side */}
          <div className="flex items-center gap-1">

            {/* Playback speed */}
            <button
              type="button"
              onClick={handleSpeedChange}
              className="px-2 h-9 flex items-center justify-center rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/10 transition font-semibold"
              title="Playback speed"
            >
              {SPEEDS[speedIdx]}×
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition text-sm"
              title="Fullscreen (F)"
            >
              ⛶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}