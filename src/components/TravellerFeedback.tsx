import { useEffect, useRef, useState, type FormEvent } from "react"
import { latestFeedback, loadFeedback, saveFeedback, usesSharedFeedback, type FeedbackEntry, type FeedbackSubmission } from "../lib/feedback"

const ratings = [1, 2, 3, 4, 5]
const ratingLabels = ["Poor", "Fair", "Okay", "Good", "Excellent"]
const pageSize = 3
const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "Asia/Colombo" })
const fieldClassName = "mt-2 w-full rounded-xl border border-[#163a43]/15 px-4 py-3 text-sm font-normal outline-none transition-shadow focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
const jumpLinkClassName = "inline-flex min-h-10 items-center justify-center rounded-xl px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"

function newSubmissionId() {
  return crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint32Array(4)), (part) =>
    part.toString(16).padStart(8, "0"),
  ).join("")
}

export default function TravellerFeedback() {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([])
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "failed">("loading")
  const [submitStatus, setSubmitStatus] = useState<"idle" | "saving" | "saved" | "invalid" | "failed">("idle")
  const [selectedRating, setSelectedRating] = useState(0)
  const [draftMessage, setDraftMessage] = useState("")
  const lastAttempt = useRef<FeedbackSubmission | null>(null)
  const submitting = useRef(false)
  const averageRating = feedback.length > 0
    ? (feedback.reduce((sum, entry) => sum + entry.rating, 0) / feedback.length).toFixed(1)
    : null

  useEffect(() => {
    let active = true

    loadFeedback().then((entries) => {
      if (!active) return
      setFeedback((current) => latestFeedback([...entries, ...current]))
      setLoadStatus("ready")
    }).catch(() => {
      if (active) setLoadStatus("failed")
    })

    return () => { active = false }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return

    const form = event.currentTarget
    const values = new FormData(form)
    const display_name = String(values.get("displayName") ?? "").trim() || "Anonymous traveller"
    const rating = Number(values.get("rating"))
    const message = String(values.get("message") ?? "").trim()

    if (!ratings.includes(rating) || display_name.length > 60 || message.length < 10 || message.length > 600) {
      setSubmitStatus("invalid")
      return
    }

    submitting.current = true
    setSubmitStatus("saving")

    try {
      const previous = lastAttempt.current
      const submission = previous?.display_name === display_name && previous.rating === rating && previous.message === message
        ? previous
        : { id: newSubmissionId(), display_name, rating, message }
      lastAttempt.current = submission
      const entry = await saveFeedback(submission)
      setFeedback((current) => latestFeedback([...current, entry]))
      lastAttempt.current = null
      form.reset()
      setSelectedRating(0)
      setDraftMessage("")
      setSubmitStatus("saved")
    } catch {
      setSubmitStatus("failed")
    } finally {
      submitting.current = false
    }
  }

  return (
    <section id="reach-feedback" aria-labelledby="reach-feedback-title" className="scroll-mt-24 px-5 py-12 sm:px-8 lg:px-12 lg:py-18">
      <div className="mx-auto max-w-7xl">
        <header className="relative isolate flex min-h-[21rem] items-end overflow-hidden rounded-[1.75rem] bg-[#082c3b] px-5 py-8 text-white shadow-[0_22px_60px_-36px_#082c3b] sm:px-9 md:items-center lg:px-14">
          <img src={`${import.meta.env.BASE_URL}assets/mirissa-01.jpg`} alt="" loading="lazy" decoding="async" className="absolute inset-y-0 right-0 -z-20 h-full w-full object-cover object-[center_62%] md:w-[65%]" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#082c3b76_0%,#082c3bf0_48%,#082c3b_100%)] md:bg-[linear-gradient(90deg,#082c3b_28%,#082c3bf5_40%,#082c3bab_61%,#082c3b18_88%)]" />
          <div className="max-w-xl">
            <h2 id="reach-feedback-title" className="font-['Instrument_Serif'] text-[clamp(3.1rem,7vw,6rem)] leading-[.92] font-normal tracking-[-.025em]">Traveller <em className="text-[#f7d394]">feedback</em></h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/85 sm:text-base">Tell us about your journey or read what other travellers shared.</p>
            <nav aria-label="Feedback section" className="mt-6 flex w-fit max-w-full flex-wrap gap-1 rounded-2xl border border-white/30 bg-white/12 p-1 text-white backdrop-blur-xl">
              <a href="#reach-feedback-form" className={`${jumpLinkClassName} bg-white text-[#082c3b] hover:bg-[#f7d394]`}>Write a review</a>
              <a href="#reach-feedback-list" className={`${jumpLinkClassName} hover:bg-white/20`}>Read reviews <span aria-hidden="true" className="ml-1.5">↓</span></a>
            </nav>
          </div>
        </header>

        <div className="mt-5 grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:mt-6 lg:gap-6">
          <form id="reach-feedback-form" tabIndex={-1} onSubmit={handleSubmit} aria-labelledby="reach-feedback-form-title" aria-describedby="reach-feedback-visibility" className="min-w-0 scroll-mt-24 rounded-[1.5rem] border border-white bg-white p-6 sm:p-8 lg:p-9">
            <h3 id="reach-feedback-form-title" className="font-['Instrument_Serif'] text-4xl leading-none font-normal">Write a review</h3>
            <p id="reach-feedback-visibility" className="mt-2 text-sm leading-6 text-[#4c6863]">
              {usesSharedFeedback
                ? "Your rating and comment will appear publicly on this page. Use a display name or stay anonymous, and leave out private details."
                : "Your feedback will appear below and is saved in this browser."}
            </p>

            <fieldset disabled={submitStatus === "saving"} className="mt-6 min-w-0 space-y-5 disabled:opacity-70">
              <fieldset className="min-w-0">
                <legend className="mb-2 text-sm font-semibold">Overall rating</legend>
                <div className="flex w-fit max-w-full flex-wrap gap-1 rounded-2xl border border-[#163a43]/10 bg-[#edf5f5] p-1 sm:gap-1.5 sm:p-1.5">
                  {ratings.map((rating) => (
                    <label key={rating} className="cursor-pointer">
                      <input type="radio" name="rating" value={rating} required checked={selectedRating === rating} onChange={() => setSelectedRating(rating)} aria-label={`${rating} out of 5 stars, ${ratingLabels[rating - 1]}`} className="peer sr-only" />
                      <span aria-hidden="true" className={`grid size-11 place-items-center rounded-xl border text-xl transition-colors peer-checked:border-amber-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal-700 ${rating <= selectedRating ? "border-amber-600/35 bg-[#ffedc6] text-[#875515]" : "border-transparent bg-white text-[#516d75] hover:bg-[#fff3da] hover:text-[#875515]"}`}>
                        {rating <= selectedRating ? "★" : "☆"}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-2 min-h-4 text-xs font-medium text-[#4c6863]">
                  {selectedRating > 0 ? `${ratingLabels[selectedRating - 1]} · ${selectedRating}/5` : "Choose 1–5 stars"}
                </p>
              </fieldset>

              <label className="block text-sm font-semibold">
                Display name <span className="font-normal text-[#4c6863]">(optional)</span>
                <input name="displayName" maxLength={60} className={fieldClassName} placeholder="Anonymous traveller" />
              </label>

              <label className="block text-sm font-semibold">
                Your feedback
                <textarea name="message" required minLength={10} maxLength={600} rows={4} value={draftMessage} onChange={(event) => setDraftMessage(event.target.value)} aria-describedby="reach-feedback-length" placeholder="What went well, or what could we improve?" className={`${fieldClassName} block resize-y`} />
                <span className="mt-2 flex flex-wrap justify-between gap-2 text-xs font-normal text-[#4c6863]">
                  <span id="reach-feedback-length">10–600 characters</span>
                  <span aria-hidden="true" className="tabular-nums">{draftMessage.length}/600</span>
                </span>
              </label>

              <button type="submit" className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#103d48] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#075e60] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-wait sm:w-auto">
                {submitStatus === "saving" ? "Saving…" : "Post feedback"}<span aria-hidden="true">↗</span>
              </button>
            </fieldset>

            <p role="status" className={submitStatus === "saved" ? "mt-4 rounded-xl bg-teal-50 px-3.5 py-3 text-sm text-teal-900" : "sr-only"}>
              {submitStatus === "saved" && "Thanks for your feedback. It’s now in the list."}
            </p>
            {(submitStatus === "invalid" || submitStatus === "failed") && (
              <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-3.5 py-3 text-sm text-rose-900">
                {submitStatus === "invalid" ? "Choose a rating and write at least 10 characters of feedback." : "Your feedback couldn’t be saved. Please try again."}
              </p>
            )}
          </form>

          <section id="reach-feedback-list" tabIndex={-1} aria-labelledby="reach-feedback-list-title" className="min-w-0 scroll-mt-24 rounded-[1.5rem] border border-white bg-[linear-gradient(150deg,#e5f4f0,#edf5fa)] p-5 sm:p-8 lg:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 id="reach-feedback-list-title" className="font-['Instrument_Serif'] text-4xl leading-none font-normal">Recent reviews</h3>
              {averageRating !== null && (
                <div className="rounded-xl border border-[#163a43]/10 bg-white/70 px-3 py-2 text-xs text-[#4c6863]">
                  <strong className="font-semibold text-[#1f4a52]"><span aria-hidden="true" className="mr-1 text-[#875515]">★</span>{averageRating}/5</strong>
                  <span className="ml-2">{feedback.length} {feedback.length === 1 ? "review" : "reviews"}</span>
                </div>
              )}
            </div>
            {loadStatus === "loading" && <p role="status" className="mt-4 text-sm text-[#4c6863]">Loading feedback…</p>}
            {loadStatus === "failed" && <p role="status" className="mt-4 text-sm text-[#4c6863]">Earlier feedback couldn’t be loaded. Refresh to try again.</p>}
            {loadStatus === "ready" && feedback.length === 0 && (
              <div className="mt-5 rounded-2xl border border-white/90 bg-white/60 px-5 py-7 sm:px-6">
                <p className="font-semibold text-[#163a43]">No reviews yet</p>
                <a className="mt-2 inline-block rounded-sm text-sm font-medium text-[#075e60] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2" href="#reach-feedback-form">Write the first review <span aria-hidden="true">↗</span></a>
              </div>
            )}

            {feedback.length > 0 && (
              <ul className="mt-5 grid gap-3">
                {feedback.slice(0, visibleCount).map((entry) => (
                  <li key={entry.id} className="min-w-0 rounded-2xl border border-white bg-white p-5 shadow-[0_8px_18px_-15px_#183c44]">
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                      <p className="font-semibold [overflow-wrap:anywhere]">{entry.display_name}</p>
                      <time dateTime={entry.created_at} className="text-xs text-[#4c6863]">{dateFormat.format(new Date(entry.created_at))}</time>
                    </div>
                    <p className="mt-2 text-sm tracking-wider text-[#875515]">
                      <span aria-hidden="true">{"★".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}</span>
                      <span className="sr-only">{entry.rating} out of 5 stars</span>
                    </p>
                    <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-[#314e48] [overflow-wrap:anywhere]">{entry.message}</p>
                  </li>
                ))}
              </ul>
            )}
            {visibleCount < feedback.length && (
              <button type="button" onClick={() => setVisibleCount((count) => count + pageSize)} className="mt-4 min-h-11 cursor-pointer rounded-full border border-teal-900/25 bg-white/60 px-4 text-sm font-semibold hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                Show more feedback
              </button>
            )}
          </section>
        </div>
      </div>
    </section>
  )
}
