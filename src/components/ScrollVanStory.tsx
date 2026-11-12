import { useEffect, useRef } from "react"

const DESKTOP_HERO = { x: 0.34, y: 0.29, scale: 1, roll: -2, pitch: 2 }
const MOBILE_HERO = { x: 0.16, y: 0.27, scale: 0.9, roll: -2, pitch: 1 }

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
export default function ScrollVanStory({ hidden = false }: { hidden?: boolean }) {
  const vanRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const van = vanRef.current
    if (!van) return

    const pointer = { x: 0, y: 0 }
    let frame = 0

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
    }

    const tick = () => {
      const pose = window.innerWidth < 760 ? MOBILE_HERO : DESKTOP_HERO
      const visibility = clamp(1 - window.scrollY / (window.innerHeight * 0.62))
      const x = pose.x * window.innerWidth + pointer.x * 9
      const y = pose.y * window.innerHeight + pointer.y * 6
      van.style.opacity = String(visibility)
      van.style.visibility = visibility < 0.02 ? "hidden" : "visible"
      van.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${pose.scale}) rotateX(${pose.pitch + pointer.y * 1.5}deg) rotateY(${pointer.x * 3}deg) rotateZ(${pose.roll}deg)`
      van.dataset.moving = "false"
      frame = window.requestAnimationFrame(tick)
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    frame = window.requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div ref={vanRef} className={`scroll-van-story${hidden ? " is-home-hidden" : ""}`} aria-hidden="true">
        <span className="scroll-van-shadow" />
        <span className="scroll-van-speed scroll-van-speed-one" />
        <span className="scroll-van-speed scroll-van-speed-two" />
        <img src="/suzuki-every-3d-cutout.png" alt="" />
      </div>
      <div className="motion-maker-badge" aria-hidden="true"><span>✦</span> Island motion by <b>Wonder Lanka</b></div>
    </>
  )
}
