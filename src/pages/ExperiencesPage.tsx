import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import type { Destination } from "./DestinationsPage"

type ExperiencesPageProps = {
  destinations: Destination[]
  onNavigate: (page: "home" | "tours" | "gallery" | "reach-us") => void
}

type Experience = {
  id: string
  number: string
  title: string
  short: string
  description: string
  category: "Nature" | "Culture" | "Coast" | "Lifestyle"
  image: string
  places: string[]
  duration: string
  season: string
  icon: string
  accent: string
  activities: string[]
  tip: string
}

const EXPERIENCES: Experience[] = [
  { id: "wildlife", number: "01", title: "Wildlife & Safari", short: "Meet the island on its own terms.", description: "Follow expert naturalists through protected landscapes where elephants, leopards, crocodiles and extraordinary birdlife roam.", category: "Nature", image: "/assets/minneriya-national-park-main.png", places: ["Yala", "Udawalawe", "Minneriya"], duration: "Half or full day", season: "Year-round", icon: "◌", accent: "#90a955", activities: ["Jeep safari", "Leopard tracking", "Birdwatching"], tip: "Choose sunrise or late afternoon, keep a respectful distance and remember that sightings are never guaranteed." },
  { id: "beaches", number: "02", title: "Beach & Coastal", short: "Follow the sun around the island.", description: "Swim, surf, linger over sunset dinners and find a coast for every mood—from lively southern bays to the calm east.", category: "Coast", image: "/assets/weligama-bay-main.png", places: ["Mirissa", "Unawatuna", "Pasikudah"], duration: "2–4 days", season: "Dec–Apr · South", icon: "≈", accent: "#2c9aad", activities: ["Beach time", "Sunset dining", "Coastal stays"], tip: "Sea conditions change by beach and day. Follow local safety advice before swimming." },
  { id: "heritage", number: "03", title: "Heritage & History", short: "Walk through two thousand years.", description: "Climb rock fortresses, enter painted cave temples and trace ancient kingdoms through sacred cities and colonial streets.", category: "Culture", image: "/assets/sigiriya-03.jpg", places: ["Sigiriya", "Anuradhapura", "Galle Fort"], duration: "3–5 days", season: "Jan–Sep", icon: "◇", accent: "#c46a42", activities: ["Ancient cities", "Sacred sites", "Local guides"], tip: "Arrive early for outdoor sites and dress respectfully at temples—shoulders and knees covered." },
  { id: "adventure", number: "04", title: "Adventure & Hiking", short: "Go where the road narrows.", description: "Trek tea-country ridges, raft rainforest rivers and climb into cloud forest on routes for every confidence level.", category: "Nature", image: "/assets/horton-plains-national-park-04.jpg", places: ["Ella", "Kitulgala", "Knuckles"], duration: "2 hours–2 days", season: "Dec–Apr", icon: "△", accent: "#557f69", activities: ["Mountain hiking", "Rafting", "Waterfalls"], tip: "Use a qualified guide for remote trails and check rainfall before river or mountain activities." },
  { id: "tea", number: "05", title: "Tea & Hill Country", short: "Take the slow train into the clouds.", description: "Ride one of Asia’s most scenic railways, walk emerald estates and taste tea at its source in the cool central highlands.", category: "Lifestyle", image: "/assets/nine-arch-bridge-main.png", places: ["Ella", "Nuwara Eliya", "Haputale"], duration: "2–4 days", season: "Jan–Apr", icon: "⌁", accent: "#4e8b79", activities: ["Scenic train", "Tea tasting", "Estate walks"], tip: "Reserve popular train seats early, but leave room for mist, station snacks and unplanned stops." },
  { id: "surf", number: "06", title: "Surf & Water Sports", short: "Find your wave, reef or lagoon.", description: "Learn on warm-water breaks, snorkel coral gardens, dive shipwrecks or cross a lagoon under kite and sail.", category: "Coast", image: "/assets/arugam-bay-03.jpg", places: ["Weligama", "Arugam Bay", "Kalpitiya"], duration: "2 hours–5 days", season: "Coast dependent", icon: "∿", accent: "#087f8c", activities: ["Surf lessons", "Diving", "Kitesurfing"], tip: "Choose licensed operators, match conditions to your ability and avoid touching reef or wildlife." },
  { id: "food", number: "07", title: "Food & Culinary", short: "Taste the story behind the spice.", description: "Shop a morning market, cook from a family recipe and discover how coconut, lime and spice change across the island.", category: "Lifestyle", image: "/assets/local-flavours-mirissa-main.png", places: ["Colombo", "Galle", "Jaffna"], duration: "3–5 hours", season: "Year-round", icon: "✦", accent: "#d15c3c", activities: ["Market walk", "Cooking class", "Street food"], tip: "Ask about spice levels and dietary needs; the best meals are often shared slowly." },
  { id: "culture", number: "08", title: "Culture & Festivals", short: "Feel the island in rhythm and ritual.", description: "Experience Kandyan dance, village ceremonies, music and colourful festivals shaped by many faiths and communities.", category: "Culture", image: "/assets/dambulla-cave-temple-view-2.png", places: ["Kandy", "Colombo", "Jaffna"], duration: "2 hours–2 days", season: "Festival dates vary", icon: "✺", accent: "#a94836", activities: ["Dance", "Festivals", "Living traditions"], tip: "Observe respectfully, ask before photographing people and allow processions plenty of space." },
  { id: "wellness", number: "09", title: "Ayurveda & Wellness", short: "Let the island reset your pace.", description: "Slow down with traditional Ayurveda, yoga, meditation and restorative stays surrounded by garden, forest or sea.", category: "Lifestyle", image: "/assets/boutique-stays-sigiriya-main.png", places: ["Bentota", "Kandy", "Sigiriya"], duration: "Half day–7 nights", season: "Year-round", icon: "☼", accent: "#839c4a", activities: ["Ayurveda", "Yoga", "Meditation"], tip: "For therapeutic treatments, choose a reputable centre with a qualified Ayurveda doctor." },
  { id: "village", number: "10", title: "Village & Rural Life", short: "Meet the people behind the landscape.", description: "Cycle quiet lanes, cross a lake, learn traditional farming and share a meal made with ingredients grown nearby.", category: "Culture", image: "/assets/local-flavours-sigiriya-main.png", places: ["Habarana", "Sigiriya", "Jaffna"], duration: "Half day", season: "Year-round", icon: "⌂", accent: "#a77c42", activities: ["Village walk", "Farm visit", "Home cooking"], tip: "Choose community-led experiences that pay hosts fairly and avoid staged wildlife encounters." },
  { id: "marine", number: "11", title: "Marine Wildlife", short: "Look beyond the horizon.", description: "Search for blue whales and dolphins, visit turtle conservation projects and explore Sri Lanka’s living coastline responsibly.", category: "Nature", image: "/assets/coconut-tree-hill-main.png", places: ["Mirissa", "Trincomalee", "Kalpitiya"], duration: "3–5 hours", season: "Coast dependent", icon: "◡", accent: "#167b9a", activities: ["Whale watching", "Dolphins", "Turtle care"], tip: "Use ethical operators who keep distance, limit pursuit and never promise a sighting." },
  { id: "luxury", number: "12", title: "Luxury & Romance", short: "Stay somewhere worth remembering.", description: "Pair private villas, wild glamping and small design hotels with beautifully paced days made for two.", category: "Lifestyle", image: "/assets/boutique-stays-mirissa-main.png", places: ["Tangalle", "Yala", "Tea Country"], duration: "3–7 nights", season: "Year-round", icon: "✧", accent: "#9a6b54", activities: ["Boutique stays", "Private dining", "Slow travel"], tip: "Mix celebrated stays with one quieter inland stop for a richer view of the island." },
  { id: "city", number: "13", title: "City & Nightlife", short: "See the island after dark.", description: "Explore contemporary Colombo through rooftop restaurants, design shops, galleries, markets and late-night local flavour.", category: "Lifestyle", image: "/assets/galle-fort-08.jpg", places: ["Colombo", "Galle", "Negombo"], duration: "1–2 days", season: "Year-round", icon: "▦", accent: "#6a657f", activities: ["City walks", "Dining", "Shopping"], tip: "Use a trusted ride service after dark and keep dress codes in mind for upscale venues." },
  { id: "family", number: "14", title: "Family Experiences", short: "Big wonder for smaller travellers.", description: "Combine gentle safaris, interactive museums, easy beaches and short nature adventures with time to rest.", category: "Lifestyle", image: "/assets/minneriya-national-park-view-3.png", places: ["Udawalawe", "Bentota", "Colombo"], duration: "4–10 days", season: "Year-round", icon: "☺", accent: "#e19b3d", activities: ["Gentle safari", "Museums", "Easy beaches"], tip: "Keep travel legs short, carry sun and mosquito protection, and build in a quiet afternoon." },
  { id: "eco", number: "15", title: "Eco & Nature", short: "Step lightly into the green.", description: "Walk rainforest, watch endemic birds and stay close to nature with guides who understand fragile ecosystems.", category: "Nature", image: "/assets/sinharaja-rainforest-04.jpg", places: ["Sinharaja", "Knuckles", "Horton Plains"], duration: "Half day–3 days", season: "Jan–Apr", icon: "❋", accent: "#3e7c59", activities: ["Rainforest", "Birding", "Eco stays"], tip: "Bring reusable water, stay on marked trails and never remove plants, stones or wildlife." },
  { id: "spiritual", number: "16", title: "Spiritual Journeys", short: "Travel with intention.", description: "Visit sacred mountains, ancient monasteries and living temples where ritual and daily life continue side by side.", category: "Culture", image: "/assets/dambulla-cave-temple-main.png", places: ["Kandy", "Anuradhapura", "Adam’s Peak"], duration: "Half day–3 days", season: "Dec–May for pilgrimage", icon: "○", accent: "#b56e3d", activities: ["Pilgrimage", "Temples", "Meditation"], tip: "Dress modestly, remove shoes where required and never pose with your back to a Buddha image." },
  { id: "crafts", number: "17", title: "Arts, Crafts & Markets", short: "Take home a piece of the making.", description: "Meet batik artists, mask carvers, weavers and gem specialists, then browse markets with a better eye for provenance.", category: "Culture", image: "/assets/sigiriya-market-cafe-main.png", places: ["Ambalangoda", "Kandy", "Colombo"], duration: "2–5 hours", season: "Year-round", icon: "✣", accent: "#b14f55", activities: ["Batik", "Wood carving", "Markets"], tip: "Buy directly from makers when possible and request certification for valuable gems." },
  { id: "unique", number: "18", title: "Only-in-Sri-Lanka", short: "Make room for the unexpected.", description: "Float above the Cultural Triangle, photograph the night sky or follow a scenic route far beyond the familiar highlights.", category: "Nature", image: "/assets/sigiriya-06.jpg", places: ["Dambulla", "Kalpitiya", "Hill Country"], duration: "2 hours–2 days", season: "Weather dependent", icon: "↗", accent: "#d78d2b", activities: ["Ballooning", "Stargazing", "Scenic flights"], tip: "Book weather-sensitive activities early in your trip so there is room to reschedule." },
]

const FILTERS = ["All", "Nature", "Culture", "Coast", "Lifestyle"] as const

export default function ExperiencesPage({ onNavigate }: ExperiencesPageProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All")
  const [selected, setSelected] = useState<Experience | null>(null)
  const heroRef = useRef<HTMLElement | null>(null)
  const visible = useMemo(() => filter === "All" ? EXPERIENCES : EXPERIENCES.filter((item) => item.category === filter), [filter])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const stage = hero.querySelector<HTMLElement>(".experience-atlas__hero-stage")
    let frame = 0
    let pointerFrame = 0

    const updateScrollDepth = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect()
        const travel = Math.max(1, hero.offsetHeight - window.innerHeight)
        const progress = Math.min(1, Math.max(0, -rect.top / travel))
        hero.style.setProperty("--hero-scroll", progress.toFixed(3))
      })
    }

    const updatePointerDepth = (event: PointerEvent) => {
      if (reducedMotion.matches || event.pointerType === "touch") return
      const rect = stage?.getBoundingClientRect() ?? hero.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width - .5) * 2
      const y = ((event.clientY - rect.top) / rect.height - .5) * 2
      const nextX = Math.min(1, Math.max(-1, x)).toFixed(3)
      const nextY = Math.min(1, Math.max(-1, y)).toFixed(3)

      window.cancelAnimationFrame(pointerFrame)
      pointerFrame = window.requestAnimationFrame(() => {
        hero.style.setProperty("--hero-x", nextX)
        hero.style.setProperty("--hero-y", nextY)
      })
    }

    const resetPointerDepth = () => {
      hero.style.setProperty("--hero-x", "0")
      hero.style.setProperty("--hero-y", "0")
    }

    updateScrollDepth()
    window.addEventListener("scroll", updateScrollDepth, { passive: true })
    window.addEventListener("resize", updateScrollDepth)
    hero.addEventListener("pointermove", updatePointerDepth)
    hero.addEventListener("pointerleave", resetPointerDepth)

    return () => {
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(pointerFrame)
      window.removeEventListener("scroll", updateScrollDepth)
      window.removeEventListener("resize", updateScrollDepth)
      hero.removeEventListener("pointermove", updatePointerDepth)
      hero.removeEventListener("pointerleave", resetPointerDepth)
    }
  }, [])

  return (
    <main className="experience-atlas">
      <section id="experiences-overview" ref={heroRef} className="experience-atlas__hero" aria-labelledby="experience-hero-title">
        <div className="experience-atlas__hero-stage">
          <div className="experience-atlas__hero-scene">
            <img className="experience-atlas__hero-image experience-atlas__hero-image--base" src="/assets/experiences-hero-sri-lanka.png" alt="Sri Lanka landscape with Sigiriya, a hill-country train, tea fields, an elephant and tropical coast" width="1672" height="941" decoding="async" fetchPriority="high" draggable={false} />
            <div className="experience-atlas__hero-light" aria-hidden="true" />
          </div>
          <div className="experience-atlas__hero-overlay" />
          <div className="experience-atlas__navline"><span>06° 56′ N · 79° 51′ E</span><span>Move to look · scroll to enter ↓</span></div>
          <div className="experience-atlas__hero-copy">
            <p className="experience-atlas__kicker"><span /> The island, experienced</p>
            <h1 id="experience-hero-title"><span>Discover the</span><em>Magic of Sri Lanka</em></h1>
            <div className="experience-atlas__hero-bottom">
              <p>From first-light safaris to last-light swims, discover 18 ways to experience one unforgettable island.</p>
              <button type="button" onClick={() => document.getElementById("experience-finder")?.scrollIntoView({ behavior: "smooth" })}>Explore experiences <span>↘</span></button>
            </div>
          </div>
          <div className="experience-atlas__hero-stamp"><strong>18</strong><span>curated<br />experiences</span></div>
          <div className="experience-atlas__hero-scroll" aria-hidden="true"><span /><b>Scroll into the island</b></div>
        </div>
      </section>

      <section id="experiences-intro" className="experience-atlas__manifesto scroll-mt-24">
        <div><p className="experience-atlas__kicker"><span /> More than a destination</p><h2>Come for the view.<br /><em>Leave with a story.</em></h2></div>
        <div><p>Sri Lanka fits astonishing variety into one small island: cloud forests and coral bays, ancient capitals and living kitchens, quiet rituals and wild encounters.</p><p>This guide turns that variety into an easy starting point. Choose a feeling, see where it leads, then shape the pace around you.</p></div>
        <div className="experience-atlas__manifesto-image"><img src="/assets/minneriya-national-park-main.png" alt="Elephants crossing the grassland at Minneriya" /><span>Wild encounters · Minneriya</span></div>
      </section>

      <section id="experience-finder" className="experience-finder scroll-mt-24">
        <div className="experience-finder__starfield" aria-hidden="true">
          <span className="experience-finder__stars experience-finder__stars--small" />
          <span className="experience-finder__stars experience-finder__stars--medium" />
          <span className="experience-finder__stars experience-finder__stars--large" />
          <span className="experience-finder__meteor experience-finder__meteor--one" />
          <span className="experience-finder__meteor experience-finder__meteor--two" />
          <span className="experience-finder__meteor experience-finder__meteor--three" />
          <span className="experience-finder__moon" />
        </div>
        <header>
          <div><p className="experience-atlas__kicker"><span /> Your experience atlas</p><h2>Choose what<br />moves you.</h2></div>
          <p>Filter by the kind of day you want. Open any card for the best places, ideal timing and a few thoughtful travel notes.</p>
        </header>
        <div className="experience-finder__filters" role="group" aria-label="Filter experiences by type">
          {FILTERS.map((item) => <button type="button" key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}><span>{item}</span><b>{item === "All" ? EXPERIENCES.length : EXPERIENCES.filter((exp) => exp.category === item).length}</b></button>)}
        </div>
        <div className="experience-finder__grid">
          {visible.map((experience, index) => (
            <article className={`atlas-card ${index === 0 ? "atlas-card--wide" : ""}`} key={experience.id} style={{ "--experience-accent": experience.accent } as CSSProperties}>
              <button type="button" onClick={() => setSelected(experience)} aria-label={`Explore ${experience.title}`}>
                <img src={experience.image} alt={`${experience.title} in Sri Lanka`} loading={index < 3 ? "eager" : "lazy"} />
                <div className="atlas-card__shade" />
                <div className="atlas-card__top"><span>{experience.number}</span><i>{experience.icon}</i></div>
                <div className="atlas-card__copy"><p>{experience.category} · {experience.places[0]}</p><h3>{experience.title}</h3><span>{experience.short}</span></div>
                <div className="atlas-card__foot"><span>{experience.duration}</span><b>Explore ↗</b></div>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="experiences-seasons" className="experience-season scroll-mt-24">
        <div className="experience-season__intro"><p className="experience-atlas__kicker"><span /> Follow the good weather</p><h2>There is always<br />a coast in season.</h2><p>Sri Lanka’s two monsoon patterns mean the best beach, surf and wildlife conditions move around the island through the year.</p></div>
        <div className="experience-season__board">
          <article><span>DEC — APR</span><h3>South & west</h3><p>Beach days in Mirissa and Galle, hill-country trains, whale watching and dry-season trails.</p><div><b>28°C</b><small>Coast average</small></div></article>
          <article><span>MAY — SEP</span><h3>East & north</h3><p>Arugam Bay surf, calm Trincomalee water, Pasikudah beaches and Cultural Triangle journeys.</p><div><b>30°C</b><small>Coast average</small></div></article>
          <article><span>ALL YEAR</span><h3>Culture & flavour</h3><p>Temples, markets, craft, cuisine and city discoveries remain rewarding in every season.</p><div><b>365</b><small>Days to explore</small></div></article>
        </div>
      </section>

      <section id="experiences-day" className="experience-day scroll-mt-24">
        <div className="experience-day__image"><img src="/assets/first-light-firelight-dining.png" alt="Sri Lankan rice and curry served at sunset overlooking the tea country" /><span>One island · a thousand stories</span></div>
        <div className="experience-day__content"><p className="experience-atlas__kicker"><span /> A day worth travelling for</p><h2>First light<br />to firelight.</h2><ol><li><time>05:30</time><div><strong>Climb before sunrise</strong><p>Cool air, quiet paths and gold arriving over the plains.</p></div></li><li><time>10:30</time><div><strong>Cook with a local host</strong><p>Market vegetables, fresh hoppers and recipes told by memory.</p></div></li><li><time>15:30</time><div><strong>Follow the wild</strong><p>A slow safari as elephants emerge into evening light.</p></div></li><li><time>19:30</time><div><strong>Dinner under the stars</strong><p>Night sounds, warm spice and nowhere else to be.</p></div></li></ol></div>
      </section>

      <section id="experiences-closing" className="experience-atlas__closing scroll-mt-24">
        <img src="/assets/mirissa-closing-sunset.png" alt="Mirissa coastline and Coconut Tree Hill glowing at sunset" />
        <div className="experience-atlas__closing-overlay" />
        <div><p className="experience-atlas__kicker"><span /> Your journey, your rhythm</p><h2>What will you<br /><em>remember?</em></h2><p>Tell us what draws you in. We’ll connect the right places, pace and experiences into one effortless island journey.</p><div><button type="button" onClick={() => onNavigate("reach-us")}>Create my journey <span>↗</span></button><button type="button" onClick={() => onNavigate("tours")}>Explore curated tours</button></div></div>
      </section>

      {selected && <div className="experience-modal" role="dialog" aria-modal="true" aria-labelledby="experience-modal-title" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null) }}>
        <div className="experience-modal__panel">
          <button className="experience-modal__close" type="button" onClick={() => setSelected(null)} aria-label="Close experience details">×</button>
          <div className="experience-modal__visual"><img src={selected.image} alt={`${selected.title} in Sri Lanka`} /><div><span>{selected.number}</span><p>{selected.category}</p></div></div>
          <div className="experience-modal__content"><p className="experience-atlas__kicker"><span /> {selected.short}</p><h2 id="experience-modal-title">{selected.title}</h2><p className="experience-modal__lead">{selected.description}</p><div className="experience-modal__facts"><div><span>Best places</span><strong>{selected.places.join(" · ")}</strong></div><div><span>Make time for</span><strong>{selected.duration}</strong></div><div><span>Best season</span><strong>{selected.season}</strong></div></div><div className="experience-modal__activities">{selected.activities.map((activity) => <span key={activity}>{activity}</span>)}</div><aside><b>Travel well</b><p>{selected.tip}</p></aside><button className="experience-modal__cta" type="button" onClick={() => { setSelected(null); onNavigate("reach-us") }}>Add to my journey <span>↗</span></button></div>
        </div>
      </div>}
    </main>
  )
}
