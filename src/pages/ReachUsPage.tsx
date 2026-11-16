import { useRef, useState } from "react"

type ReachUsPageProps = { onNavigate: (page: "home" | "tours") => void }

const journeyStyles = ["Culture", "Wildlife", "Coast", "Wellness", "Adventure", "Slow travel"]

export default function ReachUsPage({ onNavigate }: ReachUsPageProps) {
  const [sent, setSent] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState("Culture")
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      void video.play()
      setIsVideoPlaying(true)
    } else {
      video.pause()
      setIsVideoPlaying(false)
    }
  }

  return (
    <main className="reach-us-page min-h-screen bg-[#f4f7f2] pt-20 text-[#0a2f29]">
      <section className="relative overflow-hidden px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-24 lg:pt-14">
        <div className="pointer-events-none absolute -left-28 top-28 h-80 w-80 rounded-full bg-[#a8ead0]/45 blur-3xl" />
        <div className="pointer-events-none absolute -right-36 top-0 h-[32rem] w-[32rem] rounded-full bg-[#f4bd91]/35 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-between gap-4">
            <button type="button" onClick={() => onNavigate("home")} className="rounded-full border border-[#0a2f29]/10 bg-white/75 px-4 py-2 text-xs font-bold backdrop-blur transition hover:border-[#0a2f29] hover:bg-[#0a2f29] hover:text-white">← Back home</button>
            <div className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#527069] sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-[#20a47d]" /> Sri Lanka team online</div>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[.88fr_1.12fr] lg:gap-14 xl:gap-20">
            <div className="lg:sticky lg:top-28">
              <div className="relative isolate min-h-[36rem] overflow-hidden rounded-[1.5rem] bg-[#062f28] shadow-[0_32px_90px_rgba(10,47,41,.2)] sm:min-h-[42rem] sm:rounded-[2rem] lg:min-h-[min(760px,78vh)]">
                <video ref={videoRef} className="absolute inset-0 -z-20 h-full w-full object-cover" src="/assets/videos/reach-us-journey.mp4" poster="/assets/weligama-01.jpg" autoPlay muted loop playsInline preload="metadata" aria-label="Scenic journey through Sri Lanka" />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(2,27,23,.94)_0%,rgba(2,27,23,.22)_62%,rgba(2,27,23,.3)_100%)]" />

                <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/20 px-4 py-2 text-[9px] font-black uppercase tracking-[.2em] text-white backdrop-blur-md">A glimpse of the island</div>
                <button type="button" onClick={toggleVideo} aria-label={isVideoPlaying ? "Pause travel video" : "Play travel video"} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/20 text-xs text-white backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-[#0a2f29]">{isVideoPlaying ? "Ⅱ" : "▶"}</button>

                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <p className="mb-4 text-[9px] font-black uppercase tracking-[.28em] text-[#9cebc8]">Plan your Sri Lanka story</p>
                  <h1 className="font-['Instrument_Serif'] text-5xl font-normal leading-[.84] tracking-[-.04em] sm:text-6xl">One message.<br /><em className="text-[#f2ca70]">A whole island</em><br />opens up.</h1>
                  <p className="mt-5 max-w-lg text-sm leading-6 text-white/70">Share the shape of your dream trip. Our local team will reply with thoughtful ideas, honest guidance, and a route made around you.</p>
                  <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/20 pt-4 text-[10px] font-semibold text-white/65"><span>✓ Local travel designers</span><span>✓ Reply within one working day</span></div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a href="mailto:hello@wonderlanka.travel" className="rounded-2xl border border-[#0a2f29]/10 bg-white/80 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"><small className="block text-[8px] font-black uppercase tracking-[.2em] text-[#789089]">Write to us</small><strong className="mt-1 block text-xs">hello@wonderlanka.travel</strong></a>
                <a href="tel:+94112345678" className="rounded-2xl border border-[#0a2f29]/10 bg-white/80 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"><small className="block text-[8px] font-black uppercase tracking-[.2em] text-[#789089]">Call Colombo</small><strong className="mt-1 block text-xs">+94 11 234 5678</strong></a>
              </div>
            </div>

            <form className="rounded-[2rem] border border-white bg-white/85 p-6 shadow-[0_35px_100px_rgba(10,47,41,.12)] backdrop-blur-xl sm:p-9 lg:p-11" onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
              <div className="mb-8 flex items-start justify-between gap-5">
                <div><p className="mb-2 text-[9px] font-black uppercase tracking-[.25em] text-[#14856d]">Smart trip enquiry</p><h2 className="font-['Instrument_Serif'] text-4xl font-normal sm:text-5xl">Let’s shape your journey.</h2></div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0a2f29] text-lg text-white" aria-hidden="true">✦</span>
              </div>

              <fieldset className="mb-7">
                <legend className="mb-3 text-xs font-bold">What are you drawn to?</legend>
                <div className="flex flex-wrap gap-2">
                  {journeyStyles.map((style) => <button key={style} type="button" onClick={() => setSelectedStyle(style)} className={`rounded-full border px-4 py-2 text-[11px] font-bold transition ${selectedStyle === style ? "border-[#14856d] bg-[#14856d] text-white" : "border-[#0a2f29]/10 bg-[#f6faf7] text-[#526e67] hover:border-[#14856d]"}`}>{style}</button>)}
                </div>
                <input type="hidden" name="journeyStyle" value={selectedStyle} />
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-xs font-bold">Your name<input required name="name" className="mt-2 w-full rounded-xl border border-[#0a2f29]/10 bg-[#f6faf7] px-4 py-3.5 font-normal outline-none transition focus:border-[#14856d] focus:ring-4 focus:ring-[#14856d]/10" placeholder="How should we greet you?" /></label>
                <label className="text-xs font-bold">Email address<input required type="email" name="email" className="mt-2 w-full rounded-xl border border-[#0a2f29]/10 bg-[#f6faf7] px-4 py-3.5 font-normal outline-none transition focus:border-[#14856d] focus:ring-4 focus:ring-[#14856d]/10" placeholder="you@example.com" /></label>
                <label className="text-xs font-bold">Travel window<input name="dates" className="mt-2 w-full rounded-xl border border-[#0a2f29]/10 bg-[#f6faf7] px-4 py-3.5 font-normal outline-none transition focus:border-[#14856d] focus:ring-4 focus:ring-[#14856d]/10" placeholder="Month or dates" /></label>
                <label className="text-xs font-bold">Travellers<select name="travellers" className="mt-2 w-full rounded-xl border border-[#0a2f29]/10 bg-[#f6faf7] px-4 py-3.5 font-normal outline-none transition focus:border-[#14856d] focus:ring-4 focus:ring-[#14856d]/10"><option>1–2 travellers</option><option>3–4 travellers</option><option>5–8 travellers</option><option>9+ travellers</option></select></label>
              </div>

              <label className="mt-5 block text-xs font-bold">Tell us what would make it unforgettable<textarea required name="message" rows={5} className="mt-2 w-full resize-none rounded-xl border border-[#0a2f29]/10 bg-[#f6faf7] px-4 py-3.5 font-normal leading-6 outline-none transition focus:border-[#14856d] focus:ring-4 focus:ring-[#14856d]/10" placeholder="Places, pace, celebrations, interests—or simply the feeling you want..." /></label>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-[10px] leading-5 text-[#789089]">Your details are used only to help our local team respond to this trip enquiry.</p>
                <button type="submit" className="rounded-full bg-[#0a2f29] px-7 py-3.5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#14856d]">Send my journey note →</button>
              </div>
              {sent && <p role="status" className="mt-5 rounded-xl bg-[#dcf7e7] px-4 py-3 text-sm font-bold text-[#07614f]">Thank you—your journey note is ready for our local team.</p>}
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#e4f2e9] px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div><p className="text-[9px] font-black uppercase tracking-[.24em] text-[#14856d]">Our island desk</p><h2 className="mt-2 font-['Instrument_Serif'] text-4xl font-normal">Colombo · GMT +5:30</h2><p className="mt-2 text-sm text-[#617a74]">Monday–Saturday, 9:00–18:00 Sri Lanka time.</p></div>
          <button type="button" onClick={() => onNavigate("tours")} className="w-fit rounded-full bg-[#14856d] px-6 py-3 text-xs font-black text-white transition hover:bg-[#0a2f29]">Browse while you wait →</button>
        </div>
      </section>
    </main>
  )
}
