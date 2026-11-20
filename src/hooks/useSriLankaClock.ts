import { useEffect, useState } from "react"

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Colombo",
  weekday: "short",
  day: "numeric",
  month: "short",
})

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Colombo",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

export function useSriLankaClock() {
  const [currentMinute, setCurrentMinute] = useState(() => Math.floor(Date.now() / 60_000))

  useEffect(() => {
    let timer: number

    function updateClock() {
      const now = Date.now()
      setCurrentMinute(Math.floor(now / 60_000))
      timer = window.setTimeout(updateClock, 60_000 - (now % 60_000))
    }

    updateClock()
    return () => window.clearTimeout(timer)
  }, [])

  const now = new Date(currentMinute * 60_000)
  return { date: dateFormat.format(now), time: timeFormat.format(now) }
}
