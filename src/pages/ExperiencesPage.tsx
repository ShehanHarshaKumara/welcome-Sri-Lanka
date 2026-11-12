import type { Destination } from "./DestinationsPage"
import VehicleMotionBanner from "../components/VehicleMotionBanner"

type ExperiencesPageProps = {
  destinations: Destination[]
  onNavigate: (page: "home" | "tours" | "reach-us") => void
}

const EXPERIENCES = [
  { title: "Climb before sunrise", place: "Sigiriya", eyebrow: "Heritage", copy: "Rise with the jungle and reach the ancient summit while the plains are still washed in first light." },
  { title: "Ride the blue train", place: "Ella", eyebrow: "Highlands", copy: "Wind through tea country, cloud forest and tiny hill stations on the island’s most beautiful railway." },
  { title: "Follow the wild", place: "Yala", eyebrow: "Wildlife", copy: "Enter the park at dawn with a naturalist and watch the landscape wake around elephants, birds and big cats." },
  { title: "Sail into blue", place: "Mirissa", eyebrow: "Ocean", copy: "Leave the southern shore with the morning tide in search of whales and a horizon without edges." },
  { title: "Walk the old ramparts", place: "Galle", eyebrow: "Culture", copy: "Meet the fort through shaded lanes, sea walls, local studios and stories gathered over centuries." },
  { title: "Taste the north", place: "Jaffna", eyebrow: "Food", copy: "Explore markets, home kitchens and bold regional flavours shaped by the peninsula’s distinct culture." },
]

export default function ExperiencesPage({ destinations, onNavigate }: ExperiencesPageProps) {
  const imageFor = (place: string) => destinations.find((item) => item.name === place)?.img ?? destinations[0].img

  return (
    <main className="min-h-screen bg-[#ece9fc] text-[#0d0b1a]">
      <section className="relative isolate min-h-screen overflow-hidden pt-20 text-white">
        <img src={imageFor("Ella")} alt="Train journey through Sri Lanka's green hill country" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(44,26,27,.9),rgba(44,26,27,.4)_55%,rgba(44,26,27,.16)),linear-gradient(0deg,rgba(44,26,27,.75),transparent_50%)]" />
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-between px-5 pb-10 pt-14 sm:px-8 lg:px-12">
          <button type="button" onClick={() => onNavigate("home")} className="w-fit rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-xl transition hover:bg-white hover:text-[#43282a]">← Back to home</button>
          <div className="max-w-5xl">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[.34em] text-[#ffd7ad]">Not a checklist. A feeling.</p>
            <h1 className="font-['Instrument_Serif'] text-[clamp(5rem,12vw,11rem)] font-normal leading-[.72] tracking-[-.055em]">Come closer<br /><em className="text-[#ffd7ad]">to the island.</em></h1>
            <div className="mt-10 flex flex-col gap-5 border-t border-white/25 pt-6 md:flex-row md:items-center md:justify-between"><p className="max-w-xl text-base leading-7 text-white/75">The moments you remember rarely happen from a distance. Meet Sri Lanka through its landscapes, kitchens, rituals and people.</p><span className="text-[10px] font-bold uppercase tracking-[.25em] text-white/55">Scroll to feel more ↓</span></div>
          </div>
        </div>
      </section>

      <VehicleMotionBanner
        eyebrow="Experience transfer"
        title="From feeling to feeling."
        description="Move from sunrise climbs to tea-country rails and southern surf without losing the quiet moments between them."
        origin="Sigiriya"
        destination="Ella"
        actionLabel="Build an experience route"
        onAction={() => onNavigate("reach-us")}
        accent="#ffd7ad"
        stats={[{ value: "06", label: "Signature moments" }, { value: "AC", label: "Cool interior" }, { value: "∞", label: "Detours welcome" }]}
      />

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mb-16 grid gap-7 lg:grid-cols-2 lg:items-end"><h2 className="font-['Instrument_Serif'] text-[clamp(3.5rem,7vw,7rem)] font-normal leading-[.82] tracking-[-.045em]">Six stories.<br /><em className="text-[#a86438]">All yours.</em></h2><p className="max-w-md text-sm leading-7 text-[#745d58] lg:justify-self-end">Begin with the experience that pulls you in. We will help connect it to the right places, seasons and pace.</p></div>
        <div className="space-y-7">
          {EXPERIENCES.map((experience, index) => (
            <article key={experience.title} className="group grid overflow-hidden rounded-[2rem] border border-[#43282a]/10 bg-[#fffaf0] shadow-[0_22px_70px_rgba(67,40,42,.08)] lg:grid-cols-[1.05fr_.95fr]">
              <div className={`relative min-h-[25rem] overflow-hidden ${index % 2 ? "lg:order-2" : ""}`}><img src={imageFor(experience.place)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-[#302021]/65 via-transparent to-transparent" /><span className="absolute bottom-6 left-6 text-[10px] font-bold uppercase tracking-[.25em] text-white/75">0{index + 1} · {experience.place}</span></div>
              <div className="flex min-h-[25rem] flex-col justify-between p-8 sm:p-10 lg:p-14"><div><p className="mb-6 text-[10px] font-bold uppercase tracking-[.28em] text-[#a86438]">{experience.eyebrow}</p><h3 className="max-w-xl font-['Instrument_Serif'] text-[clamp(3rem,5vw,5.2rem)] font-normal leading-[.86] tracking-[-.04em]">{experience.title}</h3></div><div><p className="mb-8 max-w-md text-sm leading-7 text-[#745d58]">{experience.copy}</p><button type="button" onClick={() => onNavigate("reach-us")} className="rounded-full border border-[#43282a]/20 px-5 py-3 text-xs font-semibold transition hover:bg-[#43282a] hover:text-white">Add to my journey →</button></div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#43282a] px-5 py-20 text-[#f5eddd] sm:px-8 lg:px-12"><div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between"><h2 className="max-w-3xl font-['Instrument_Serif'] text-[clamp(3rem,6vw,6rem)] font-normal leading-[.88]">Build a journey around what makes you <em className="text-[#ffd7ad]">feel alive.</em></h2><div className="flex gap-3"><button type="button" onClick={() => onNavigate("tours")} className="rounded-full border border-white/20 px-6 py-3 text-xs font-semibold">View tours</button><button type="button" onClick={() => onNavigate("reach-us")} className="rounded-full bg-[#ffd7ad] px-6 py-3 text-xs font-semibold text-[#43282a]">Reach us →</button></div></div></section>
    </main>
  )
}
