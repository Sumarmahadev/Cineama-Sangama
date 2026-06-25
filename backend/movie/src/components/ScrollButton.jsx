// src/components/ScrollButton.jsx
export function ScrollButton({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className="hidden md:flex items-center justify-center w-8 h-8 rounded-full
        bg-white/5 border border-white/10 text-white/50 text-xs
        hover:bg-white/10 hover:text-white active:scale-95 transition duration-150 flex-shrink-0"
    >
      {direction === "left" ? "←" : "→"}
    </button>
  );
}