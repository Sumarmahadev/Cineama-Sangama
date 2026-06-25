import { useRef, useEffect } from "react"

export function useDragScroll() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let isDown = false
    let startX = 0
    let scrollLeft = 0

    // --- Mouse events ---
    const onMouseDown = (e) => {
      isDown = true
      el.classList.add("cursor-grabbing")
      el.classList.remove("cursor-grab")
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
    }

    const onMouseLeave = () => {
      isDown = false
      el.classList.remove("cursor-grabbing")
      el.classList.add("cursor-grab")
    }

    const onMouseUp = () => {
      isDown = false
      el.classList.remove("cursor-grabbing")
      el.classList.add("cursor-grab")
    }

    const onMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - el.offsetLeft
      const walk = (x - startX) * 1.5
      el.scrollLeft = scrollLeft - walk
    }

    // --- Touch events (mobile support) ---
    const onTouchStart = (e) => {
      isDown = true
      startX = e.touches[0].pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
    }

    const onTouchEnd = () => {
      isDown = false
    }

    const onTouchMove = (e) => {
      if (!isDown) return
      const x = e.touches[0].pageX - el.offsetLeft
      const walk = (x - startX) * 1.5
      el.scrollLeft = scrollLeft - walk
    }

    // --- Prevent text selection while dragging ---
    const preventSelect = (e) => {
      if (isDown) e.preventDefault()
    }

    el.addEventListener("mousedown", onMouseDown)
    el.addEventListener("mouseleave", onMouseLeave)
    el.addEventListener("mouseup", onMouseUp)
    el.addEventListener("mousemove", onMouseMove)

    el.addEventListener("touchstart", onTouchStart)
    el.addEventListener("touchend", onTouchEnd)
    el.addEventListener("touchmove", onTouchMove)

    el.addEventListener("selectstart", preventSelect)

    return () => {
      el.removeEventListener("mousedown", onMouseDown)
      el.removeEventListener("mouseleave", onMouseLeave)
      el.removeEventListener("mouseup", onMouseUp)
      el.removeEventListener("mousemove", onMouseMove)

      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchend", onTouchEnd)
      el.removeEventListener("touchmove", onTouchMove)

      el.removeEventListener("selectstart", preventSelect)
    }
  }, [])

  return ref
}