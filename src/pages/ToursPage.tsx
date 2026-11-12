import VehicleMotionBanner from "../components/VehicleMotionBanner"

type Tour = {
  title: string
  days: string
  price: string
  type: string
  img: string
  highlights: string[]
  description: string
  bestFor: string
  rating: string
  reviews: number
}

type ToursPageProps = {
  tours: Tour[]
  onNavigate: (page: "home" | "experiences" | "reach-us") => void
}

export default function ToursPage({ tours, onNavigate }: ToursPageProps) {
  return (
    <main className="min-h-screen bg-[#e7e3fb] text-[#0d0b1a]">
      <section className="relative isolate min-h-[82vh] overflow-hidden pt-20 text-white">
        <img src={tours[8].img} alt="Sri Lankan highlands on a curated island journey" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,35,29,.92)_0%,rgba(3,35,29,.65)_50%,rgba(3,35,29,.18)_100%),linear-gradient(0deg,rgba(3,35,29,.72),transparent_55%)]" />
        <div className="mx-auto flex min-h-[calc(82vh-5rem)] max-w-7xl flex-col justify-between px-5 pb-10 pt-14 sm:px-8 lg:px-12">
          <button type="button" onClick={() => onNavigate("home")} className="w-fit rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-xl transition hover:bg-white hover:text-[#064e3b]">← Back to home</button>
          <div className="max-w-4xl">
            <p className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.3em] text-[#b8f5d8]"><span className="h-px w-10 bg-current" /> Journeys, thoughtfully made</p>
            <h1 className="font-['Instrument_Serif'] text-[clamp(4.5rem,10vw,9rem)] font-normal leading-[.78] tracking-[-.045em]">See more.<br /><em className="text-[#c9f5d5]">Rush less.</em></h1>
            <div className="mt-9 flex flex-col gap-7 border-t border-white/20 pt-6 md:flex-row md:items-end md:justify-between">
              <p className="max-w-xl text-base leading-7 text-white/75">Private routes that join Sri Lanka’s ancient cities, wild parks, tea country and warm-water coast—with space to follow your curiosity.</p>
              <div className="flex gap-8 text-sm"><span><strong className="block text-2xl">9</strong><small className="uppercase tracking-widest text-white/55">Routes</small></span><span><strong className="block text-2xl">4.9</strong><small className="uppercase tracking-widest text-white/55">Guest score</small></span></div>
            </div>
          </div>
        </div>
      </section>

      <VehicleMotionBanner
        eyebrow="Signature island transport"
        title="Every route. One private ride."
        description="Your Suzuki Every and local driver stay with the journey, leaving room for viewpoints, village stops and spontaneous detours."
        origin="Colombo"
        destination="Grand island loop"
        actionLabel="Design my private tour"
        onAction={() => onNavigate("reach-us")}
        accent="#b8f5d8"
        stats={[{ value: "10d", label: "Flexible route" }, { value: "AC", label: "Private comfort" }, { value: "24/7", label: "Trip support" }]}
      />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-end">
          <div><p className="mb-3 text-[10px] font-bold uppercase tracking-[.28em] text-[#07856f]">Choose your rhythm</p><h2 className="font-['Instrument_Serif'] text-[clamp(3rem,6vw,5.5rem)] font-normal leading-[.9] tracking-[-.04em]">Nine ways into<br />the island.</h2></div>
          <p className="text-sm leading-7 text-[#56746c]">Each itinerary is a starting point. Add a quiet beach, extend a safari, or slow the route down—we shape the final journey around you.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tours.map((tour, index) => (
            <article key={tour.title} className="group overflow-hidden rounded-[1.8rem] border border-[#0b5b4c]/10 bg-white shadow-[0_18px_55px_rgba(6,78,59,.09)]">
              <div className="relative h-72 overflow-hidden">
                <img src={tour.img} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#052d26]/85 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 flex w-[calc(100%-2.5rem)] items-center justify-between text-[10px] font-bold uppercase tracking-[.16em] text-white"><span className="rounded-full border border-white/25 bg-black/20 px-3 py-1.5 backdrop-blur">{tour.type}</span><span>0{index + 1}</span></div>
                <div className="absolute inset-x-5 bottom-5 text-white"><p className="mb-2 text-[10px] uppercase tracking-[.18em] text-white/65">{tour.days} · {tour.bestFor}</p><h3 className="font-['Instrument_Serif'] text-4xl leading-none">{tour.title}</h3></div>
              </div>
              <div className="p-6">
                <p className="min-h-20 text-sm leading-6 text-[#5b726c]">{tour.description}</p>
                <div className="my-5 flex flex-wrap gap-2">{tour.highlights.map((place) => <span key={place} className="rounded-full bg-[#e6f5eb] px-3 py-1.5 text-[10px] font-semibold text-[#08715f]">{place}</span>)}</div>
                <div className="flex items-end justify-between border-t border-[#0b5b4c]/10 pt-5"><div><small className="block text-[9px] uppercase tracking-widest text-[#789089]">From</small><strong className="font-['Instrument_Serif'] text-2xl font-normal">{tour.price}</strong></div><div className="text-right"><strong className="text-sm text-[#e38b58]">★ {tour.rating}</strong><small className="block text-[10px] text-[#789089]">{tour.reviews} reviews</small></div></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#063d34] px-5 py-20 text-white sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="mb-4 text-[10px] font-bold uppercase tracking-[.28em] text-[#8ee8c1]">Made for you</p><h2 className="max-w-4xl font-['Instrument_Serif'] text-[clamp(3rem,6vw,5.8rem)] font-normal leading-[.88]">Your best route may not exist <em className="text-[#b8f5d8]">yet.</em></h2></div>
          <div className="flex flex-wrap gap-3"><button type="button" onClick={() => onNavigate("experiences")} className="rounded-full border border-white/25 px-6 py-3 text-xs font-semibold transition hover:bg-white hover:text-[#064e3b]">Explore experiences</button><button type="button" onClick={() => onNavigate("reach-us")} className="rounded-full bg-[#b8f5d8] px-6 py-3 text-xs font-semibold text-[#064e3b] transition hover:bg-white">Plan my tour →</button></div>
        </div>
      </section>
    </main>
  )
}
