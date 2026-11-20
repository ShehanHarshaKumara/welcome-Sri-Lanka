import { useState } from "react"
import { contactDetails } from "../contact"

const locationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactDetails.location)}`
const contactLinkClassName = "underline decoration-white/40 underline-offset-4 hover:decoration-amber-200"

export default function FooterContact() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle")

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactDetails.email)
      setCopyStatus("copied")
    } catch {
      setCopyStatus("failed")
    }
  }

  return (
    <section className="site-footer-contact border-t border-white/20 pt-3" aria-labelledby="footer-contact-title">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 id="footer-contact-title" className="text-sm font-semibold text-[#f5f1e7]">Contact us</h2>
        <button type="button" onClick={copyEmail} className="min-h-9 cursor-pointer rounded-full border border-white/20 px-3 text-xs font-semibold text-amber-100 transition-colors hover:border-amber-200/60 hover:bg-white/10">
          {copyStatus === "copied" ? "Copied" : "Copy email"}
        </button>
      </div>
      <address className="mt-2 text-sm leading-relaxed text-[#f5f1e7] not-italic">
        <dl className="grid gap-1.5 [&>div]:grid [&>div]:grid-cols-[3.25rem_minmax(0,1fr)] [&>div]:gap-2 [&_dt]:text-xs [&_dt]:leading-[1.9] [&_dt]:text-amber-100/90">
          <div>
            <dt>Email</dt>
            <dd><a href={`mailto:${contactDetails.email}`} className={`${contactLinkClassName} [overflow-wrap:anywhere]`}>{contactDetails.email}</a></dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd><a href={contactDetails.phoneHref} className={contactLinkClassName}>{contactDetails.phone}</a></dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd><a href={locationUrl} className={contactLinkClassName}>{contactDetails.location} <span aria-hidden="true">↗</span></a></dd>
          </div>
        </dl>
      </address>
      <p role="status" className={copyStatus === "failed" ? "mt-2 text-xs text-amber-100" : "sr-only"}>
        {copyStatus === "copied" && "Email address copied."}
        {copyStatus === "failed" && "Clipboard unavailable. You can select the email address to copy it."}
      </p>
    </section>
  )
}
