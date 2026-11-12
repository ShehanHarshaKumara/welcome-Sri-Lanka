import { useState } from "react"
import VehicleMotionBanner from "../components/VehicleMotionBanner"

type ReachUsPageProps = { onNavigate: (page: "home" | "tours") => void }

export default function ReachUsPage({ onNavigate }: ReachUsPageProps) {
  const [sent, setSent] = useState(false)

  return (
    <main className="min-h-screen bg-[#e7e3fb] pt-20 text-[#0d0b1a]">
      <section className="relative overflow-hidden px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="absolute -right-40 -top-32 h-[34rem] w-[34rem] rounded-full bg-[#b8f5d8]/55 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <button type="button" onClick={() => onNavigate("home")} className="mb-12 rounded-full border border-[#064e3b]/15 bg-white/60 px-4 py-2 text-xs font-semibold transition hover:bg-[#064e3b] hover:text-white">← Back to home</button>
          <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
            <div>
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[.3em] text-[#07856f]">Start with hello</p>
              <h1 className="font-['Instrument_Serif'] text-[clamp(4.5rem,9vw,8.5rem)] font-normal leading-[.78] tracking-[-.05em]">Your island<br /><em className="text-[#07856f]">story starts here.</em></h1>
              <p className="mt-9 max-w-lg text-base leading-8 text-[#57736b]">Tell us what you imagine—even if it is only a feeling. A local journey designer will turn it into a thoughtful first route.</p>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <a href="mailto:hello@wonderlanka.travel" className="rounded-2xl border border-[#064e3b]/10 bg-white/70 p-5 transition hover:-translate-y-1 hover:bg-white"><small className="mb-2 block text-[9px] font-bold uppercase tracking-widest text-[#789089]">Email</small><strong className="text-sm">hello@wonderlanka.travel</strong></a>
                <a href="tel:+94112345678" className="rounded-2xl border border-[#064e3b]/10 bg-white/70 p-5 transition hover:-translate-y-1 hover:bg-white"><small className="mb-2 block text-[9px] font-bold uppercase tracking-widest text-[#789089]">Call Colombo</small><strong className="text-sm">+94 11 234 5678</strong></a>
              </div>
              <div className="mt-8 flex items-center gap-3 text-xs text-[#57736b]"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22a77d] opacity-50" /><span className="relative h-2.5 w-2.5 rounded-full bg-[#22a77d]" /></span>Local team online · Replies within one working day</div>
            </div>

            <form className="rounded-[2rem] border border-white bg-white/80 p-6 shadow-[0_28px_90px_rgba(6,78,59,.12)] backdrop-blur-xl sm:p-9 lg:p-12" onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
              <div className="mb-9 flex items-end justify-between gap-5"><div><p className="mb-2 text-[9px] font-bold uppercase tracking-[.24em] text-[#07856f]">Journey note</p><h2 className="font-['Instrument_Serif'] text-4xl font-normal">Tell us a little.</h2></div><span className="text-3xl" aria-hidden="true">✦</span></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-xs font-semibold">Your name<input required name="name" className="mt-2 w-full rounded-xl border border-[#064e3b]/12 bg-[#f5faf6] px-4 py-3.5 font-normal outline-none transition focus:border-[#07856f]" placeholder="How should we greet you?" /></label>
                <label className="text-xs font-semibold">Email address<input required type="email" name="email" className="mt-2 w-full rounded-xl border border-[#064e3b]/12 bg-[#f5faf6] px-4 py-3.5 font-normal outline-none transition focus:border-[#07856f]" placeholder="you@example.com" /></label>
                <label className="text-xs font-semibold">When would you travel?<input name="dates" className="mt-2 w-full rounded-xl border border-[#064e3b]/12 bg-[#f5faf6] px-4 py-3.5 font-normal outline-none transition focus:border-[#07856f]" placeholder="Month or dates" /></label>
                <label className="text-xs font-semibold">How many travellers?<select name="travellers" className="mt-2 w-full rounded-xl border border-[#064e3b]/12 bg-[#f5faf6] px-4 py-3.5 font-normal outline-none transition focus:border-[#07856f]"><option>1–2 travellers</option><option>3–4 travellers</option><option>5–8 travellers</option><option>9+ travellers</option></select></label>
              </div>
              <label className="mt-5 block text-xs font-semibold">What would make this trip unforgettable?<textarea required name="message" rows={5} className="mt-2 w-full resize-none rounded-xl border border-[#064e3b]/12 bg-[#f5faf6] px-4 py-3.5 font-normal leading-6 outline-none transition focus:border-[#07856f]" placeholder="Places, interests, pace, celebrations—or simply the feeling you want..." /></label>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xs text-[10px] leading-5 text-[#789089]">By sending this note, you agree that our travel team may contact you about your journey.</p><button type="submit" className="rounded-full bg-[#07856f] px-7 py-3.5 text-xs font-bold text-white transition hover:bg-[#065e50]">Send journey note →</button></div>
              {sent && <p role="status" className="mt-5 rounded-xl bg-[#dcf7e7] px-4 py-3 text-sm font-semibold text-[#07614f]">Thank you—your journey note is ready for our local team.</p>}
            </form>
          </div>
        </div>
      </section>

      <VehicleMotionBanner
        eyebrow="Ready when you are"
        title="Your driver meets you here."
        description="Airport arrival, hotel pickup or a custom first stop—share the plan and we will have your private island ride ready."
        origin="CMB Airport"
        destination="Your first wonder"
        actionLabel="Browse tour ideas"
        onAction={() => onNavigate("tours")}
        accent="#9cebc8"
        stats={[{ value: "24/7", label: "Airport pickup" }, { value: "04", label: "Travellers" }, { value: "1d", label: "Reply time" }]}
      />

      <section className="bg-[#073f35] px-5 py-16 text-white sm:px-8 lg:px-12"><div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-3"><div><strong className="font-['Instrument_Serif'] text-3xl font-normal">Colombo</strong><p className="mt-2 text-xs leading-6 text-white/55">Our island base and the beginning of every conversation.</p></div><div><strong className="font-['Instrument_Serif'] text-3xl font-normal">GMT +5:30</strong><p className="mt-2 text-xs leading-6 text-white/55">Monday–Saturday · 9:00–18:00 Sri Lanka time.</p></div><div className="md:text-right"><button type="button" onClick={() => onNavigate("tours")} className="rounded-full border border-white/20 px-6 py-3 text-xs font-semibold transition hover:bg-white hover:text-[#064e3b]">Browse tours while you wait →</button></div></div></section>
    </main>
  )
}
