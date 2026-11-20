import { contactDetails } from "../contact"
import { useSriLankaClock } from "../hooks/useSriLankaClock"

type FooterClockProps = { onOpenGallery: () => void }

const shortcutClassName = "grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:border-amber-200 hover:bg-amber-200 hover:text-slate-950"

export default function FooterClock({ onOpenGallery }: FooterClockProps) {
  const { date, time } = useSriLankaClock()

  return (
    <section
      aria-label="Sri Lanka clock"
      className="relative h-[clamp(15rem,65vw,17.5rem)] w-[11.25rem] max-w-full rounded-[1.85rem] border border-[#a18b65] bg-[#070f18] p-[5px] shadow-[0_16px_36px_#03131980,inset_0_1px_0_#f4dca580]"
    >
      <div className="relative flex h-full flex-col items-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(ellipse_at_90%_5%,#245269,transparent_58%),linear-gradient(158deg,#132e40,#0a1724_65%)] px-2 pt-7 pb-3 text-center text-[#f8f2e5] sm:px-3">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 mx-auto h-3 w-16 rounded-b-xl bg-[#070f18]" />
        <p className="text-[10px] leading-none font-semibold tracking-[.16em] text-amber-200 uppercase">Sri Lanka time</p>
        <time dateTime={time} className="mt-2 block text-[clamp(1.875rem,9vw,2.65rem)] leading-none font-medium tracking-tight tabular-nums">{time}</time>
        <p className="mt-2 text-xs text-slate-200">{date}</p>

        <svg aria-hidden="true" viewBox="0 0 0.488 0.488" fill="none" className="m-auto size-8 text-amber-200/55">
          <path d="M0.409 0.114a0.196 0.196 0 0 1 0.027 0.122v0.024c0 0.026 0.007 0.051 0.019 0.073M0.146 0.212c0 -0.026 0.01 -0.051 0.028 -0.069a0.096 0.096 0 0 1 0.068 -0.029c0.026 0 0.05 0.01 0.068 0.029s0.028 0.043 0.028 0.069v0.024c0 0.053 0.017 0.104 0.048 0.146m-0.145 -0.17v0.049A0.343 0.343 0 0 0 0.303 0.455M0.146 0.309A0.442 0.442 0 0 0 0.189 0.455m-0.118 -0.049c-0.016 -0.055 -0.024 -0.113 -0.022 -0.17V0.212a0.195 0.195 0 0 1 0.026 -0.098 0.194 0.194 0 0 1 0.071 -0.072 0.192 0.192 0 0 1 0.194 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.024" />
        </svg>

        <div className="flex w-full justify-between gap-2">
          <a href={contactDetails.phoneHref} aria-label="Call Lanka Ravana Tours" title="Call Lanka Ravana Tours" className={shortcutClassName}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
              <path stroke="currentColor" strokeWidth="1.5" strokeMiterlimit={10} d="m10.2 6.375-3.075-3.15c-.375-.3-.9-.3-1.275 0l-2.325 2.4c-.525.45-.675 1.2-.45 1.8.6 1.725 2.175 5.175 5.25 8.25s6.525 4.575 8.25 5.25c.675.225 1.35.075 1.875-.375l2.325-2.325c.375-.375.375-.9 0-1.275L17.7 13.875c-.375-.375-.9-.375-1.275 0L14.55 15.75s-2.1-.9-3.75-2.475-2.475-3.75-2.475-3.75L10.2 7.65c.375-.375.375-.975 0-1.275z" />
            </svg>
          </a>
          <button type="button" onClick={onOpenGallery} aria-label="Open the destination gallery" title="Open the destination gallery" className={`${shortcutClassName} cursor-pointer`}>
            <svg aria-hidden="true" viewBox="0 0 0.72 0.72" fill="currentColor" className="size-5">
              <path d="M.57.18H.522L.492.15A.1.1 0 0 0 .42.12H.3a.1.1 0 0 0-.072.03l-.03.03H.15a.09.09 0 0 0-.09.09v.24C.06.56.1.6.15.6h.42C.62.6.66.56.66.51V.27A.09.09 0 0 0 .57.18m-.21.3a.105.105 0 1 1 0-.21.105.105 0 0 1 0 .21M.54.339a.039.039 0 1 1 0-.078.039.039 0 0 1 0 .078" />
            </svg>
          </button>
        </div>
      </div>
      <span aria-hidden="true" className="absolute top-14 -right-[3px] h-7 w-[3px] rounded-r-md bg-[#a18b65]" />
    </section>
  )
}
