import type { CSSProperties } from "react"

type VehicleMotionBannerProps = {
  eyebrow: string
  title: string
  description: string
  origin: string
  destination: string
  actionLabel: string
  onAction: () => void
  accent?: string
  stats: Array<{ value: string; label: string }>
}

export default function VehicleMotionBanner({
  eyebrow,
  title,
  description,
  origin,
  destination,
  actionLabel,
  onAction,
  accent = "#b8f5d8",
  stats,
}: VehicleMotionBannerProps) {
  return (
    <section className="vehicle-motion-wrap" style={{ "--vehicle-accent": accent } as CSSProperties}>
      <div
        className="vehicle-motion-scene"
        onPointerMove={(event) => {
          const scene = event.currentTarget
          const bounds = scene.getBoundingClientRect()
          scene.style.setProperty("--vehicle-tilt-x", `${(0.5 - (event.clientY - bounds.top) / bounds.height) * 4}deg`)
          scene.style.setProperty("--vehicle-tilt-y", `${(((event.clientX - bounds.left) / bounds.width) - 0.5) * 7}deg`)
        }}
        onPointerLeave={(event) => {
          event.currentTarget.style.setProperty("--vehicle-tilt-x", "0deg")
          event.currentTarget.style.setProperty("--vehicle-tilt-y", "0deg")
        }}
      >
        <div className="vehicle-motion-grid" aria-hidden="true" />
        <div className="vehicle-motion-orb" aria-hidden="true" />
        <div className="vehicle-motion-copy">
          <p><i aria-hidden="true" />{eyebrow}</p>
          <h2>{title}</h2>
          <span>{description}</span>
          <div className="vehicle-motion-route" aria-label={`Route from ${origin} to ${destination}`}>
            <b>01</b><strong>{origin}</strong><i /><b>02</b><strong>{destination}</strong>
          </div>
          <button type="button" onClick={onAction}>{actionLabel}<span aria-hidden="true">↗</span></button>
        </div>

        <div className="vehicle-motion-model" aria-label="Animated Suzuki Every travel van">
          <span className="vehicle-motion-shadow" aria-hidden="true" />
          <img src="/suzuki-every-3d-cutout.png" alt="White Suzuki Every travel van" loading="lazy" />
          <span className="vehicle-motion-streak vehicle-motion-streak-one" aria-hidden="true" />
          <span className="vehicle-motion-streak vehicle-motion-streak-two" aria-hidden="true" />
        </div>

        <div className="vehicle-motion-stats">
          {stats.map((stat) => <span key={stat.label}><strong>{stat.value}</strong><small>{stat.label}</small></span>)}
        </div>
        <div className="vehicle-motion-live"><i aria-hidden="true" /> Private driver online</div>
      </div>
    </section>
  )
}
