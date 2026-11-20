import { supabase } from "./supabase"

export type FeedbackSubmission = {
  id: string
  display_name: string
  rating: number
  message: string
}

export type FeedbackEntry = FeedbackSubmission & { created_at: string }

const storagePrefix = "lanka-ravana-tours.feedback.v1:"
const table = "traveller_feedback"
const columns = "id,display_name,rating,message,created_at"
const displayLimit = 20

export const usesSharedFeedback = supabase !== null

export function latestFeedback(entries: FeedbackEntry[]) {
  return Array.from(new Map(entries.map((entry) => [entry.id, entry])).values())
    .sort((left, right) => Date.parse(right.created_at) - Date.parse(left.created_at) || right.id.localeCompare(left.id))
    .slice(0, displayLimit)
}

function readStoredEntry(key: string): FeedbackEntry | null {
  const stored = localStorage.getItem(key)
  if (!stored) return null

  try {
    const entry = JSON.parse(stored) as Partial<FeedbackEntry> | null
    if (
      typeof entry?.id === "string" && key === storagePrefix + entry.id &&
      typeof entry.display_name === "string" && typeof entry.message === "string" &&
      typeof entry.rating === "number" && Number.isInteger(entry.rating) && entry.rating >= 1 && entry.rating <= 5 &&
      typeof entry.created_at === "string" && Number.isFinite(Date.parse(entry.created_at))
    ) {
      return entry as FeedbackEntry
    }
  } catch {
    // Ignore an unreadable entry so the rest of the feedback can still load.
  }

  return null
}

export async function loadFeedback(): Promise<FeedbackEntry[]> {
  if (!supabase) {
    const entries = Object.keys(localStorage)
      .filter((key) => key.startsWith(storagePrefix))
      .map(readStoredEntry)
      .filter((entry) => entry !== null)
    return latestFeedback(entries)
  }

  const { data, error } = await supabase.from(table).select(columns)
    .order("created_at", { ascending: false }).order("id", { ascending: false }).limit(displayLimit)
  if (error) throw error
  return data
}

export async function saveFeedback(submission: FeedbackSubmission): Promise<FeedbackEntry> {
  if (!supabase) {
    const key = storagePrefix + submission.id
    const entry = readStoredEntry(key) ?? { ...submission, created_at: new Date().toISOString() }
    localStorage.setItem(key, JSON.stringify(entry))
    return entry
  }

  const { data, error } = await supabase.from(table).insert(submission).select(columns).single()
  if (!error) return data
  if (error.code !== "23505") throw error

  // A retry can arrive after an earlier request committed but its response was lost.
  const { data: existing, error: lookupError } = await supabase.from(table).select(columns).eq("id", submission.id).single()
  if (lookupError) throw lookupError
  if (existing.display_name !== submission.display_name || existing.rating !== submission.rating || existing.message !== submission.message) {
    throw error
  }
  return existing
}
