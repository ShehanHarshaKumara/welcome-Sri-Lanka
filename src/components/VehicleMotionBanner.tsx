import { useState, type CSSProperties } from "react"

const EDITORIAL_ROUTES = [
  { label: "Grand loop", destination: "Grand island loop", stops: ["Colombo", "Sigiriya", "Kandy", "Ella", "Mirissa"], detail: "Culture, tea country and the southern coast in one unhurried rhythm." },
  { label: "Heritage", destination: "Cultural heartland", stops: ["Colombo", "Dambulla", "Sigiriya", "Kandy"], detail: "Ancient cities, cave temples and living traditions through the island centre." },
  { label: "South coast", destination: "Southern coast", stops: ["Colombo", "Galle", "Mirissa", "Tangalle"], detail: "Fort streets, warm-water beaches and relaxed coastal stops." },
]

function RouteTruck() {
  return (
    <span className="vehicle-route-truck" aria-hidden="true">
      <span className="vehicle-route-truck__body">
        <span className="vehicle-route-truck__roof"><span className="vehicle-route-truck__window" /></span>
        <span className="vehicle-route-truck__middle" />
        <span className="vehicle-route-truck__base" />
      </span>
      <span className="vehicle-route-truck__wheel vehicle-route-truck__wheel--rear"><i /></span>
      <span className="vehicle-route-truck__wheel vehicle-route-truck__wheel--front"><i /></span>
      <span className="vehicle-route-truck__headlight" />
      <span className="vehicle-route-truck__taillight" />
    </span>
  )
}

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
  layout?: "default" | "editorial"
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
  layout = "default",
}: VehicleMotionBannerProps) {
  const [activeRoute, setActiveRoute] = useState(0)

  if (layout === "editorial") {
    const route = EDITORIAL_ROUTES[activeRoute]

    return (
      <section className="vehicle-editorial" style={{ "--vehicle-accent": accent } as CSSProperties}>
        <div className="vehicle-editorial-shell">
          <header className="vehicle-editorial-head">
            <div>
              <p><i aria-hidden="true" />{eyebrow}</p>
              <h2>{title}</h2>
            </div>
            <div className="vehicle-editorial-intro">
              <span>{description}</span>
              <button type="button" onClick={onAction}>{actionLabel}<b aria-hidden="true">↗</b></button>
            </div>
          </header>

          <div className="vehicle-smart-planner">
            <div className="vehicle-smart-planner__label">
              <span>SMART ROUTE SELECTOR</span>
              <small>Illustrative route</small>
            </div>
            <div className="vehicle-smart-planner__options" role="tablist" aria-label="Choose an example route">
              {EDITORIAL_ROUTES.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  role="tab"
                  aria-selected={activeRoute === index}
                  className={activeRoute === index ? "is-active" : ""}
                  onClick={() => setActiveRoute(index)}
                >
                  <b>0{index + 1}</b><span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="vehicle-editorial-stage"
            onPointerMove={(event) => {
              const scene = event.currentTarget
              const bounds = scene.getBoundingClientRect()
              scene.style.setProperty("--vehicle-tilt-x", `${(0.5 - (event.clientY - bounds.top) / bounds.height) * 3}deg`)
              scene.style.setProperty("--vehicle-tilt-y", `${(((event.clientX - bounds.left) / bounds.width) - 0.5) * 6}deg`)
            }}
            onPointerLeave={(event) => {
              event.currentTarget.style.setProperty("--vehicle-tilt-x", "0deg")
              event.currentTarget.style.setProperty("--vehicle-tilt-y", "0deg")
            }}
          >
            <div className="vehicle-editorial-grid" aria-hidden="true" />
            <div className="vehicle-editorial-index" aria-hidden="true"><span>01</span><small>YOUR PRIVATE RIDE</small></div>
            <div className="vehicle-editorial-status"><i aria-hidden="true" /> Driver and vehicle stay with your route</div>
            <div className="vehicle-editorial-insight" aria-live="polite">
              <small>ROUTE IDEA</small>
              <strong>{route.label}</strong>
              <span>{route.detail}</span>
            </div>
            <div className="vehicle-editorial-model" aria-label="Interactive Suzuki Every travel van">
              <span aria-hidden="true" />
              <img src="/suzuki-every-3d-cutout.png" alt="White Suzuki Every travel van" loading="lazy" />
            </div>

            <div className="vehicle-editorial-route" aria-label={`Route from ${origin} to ${route.destination}`}>
              <div><small>START</small><strong>{origin}</strong></div>
              <i><RouteTruck /></i>
              <div><small>YOUR ROUTE</small><strong>{route.destination}</strong></div>
            </div>

            <div className="vehicle-editorial-tags" aria-label={`Example stops for ${route.label}`}>
              {route.stops.map((stop, index) => <span key={stop}><b>0{index + 1}</b>{stop}</span>)}
            </div>
          </div>

          <footer className="vehicle-editorial-foot">
            <p>One driver. One private vehicle. <em>One unhurried route.</em></p>
            <div className="vehicle-editorial-stats">
              {stats.map((stat) => <span key={stat.label}><strong>{stat.value}</strong><small>{stat.label}</small></span>)}
            </div>
          </footer>
        </div>
      </section>
    )
  }

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
