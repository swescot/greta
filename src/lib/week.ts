// Helpers for working with weeks. A week is identified by the ISO date of its
// Monday (e.g. "2026-06-15"), which we use as the Firestore document id.

export function startOfWeek(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0 = Sunday, 1 = Monday, ...
  const diff = (day === 0 ? -6 : 1) - day // shift back to Monday
  d.setDate(d.getDate() + diff)
  return d
}

export function weekId(date: Date): string {
  const monday = startOfWeek(date)
  const y = monday.getFullYear()
  const m = String(monday.getMonth() + 1).padStart(2, '0')
  const d = String(monday.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + weeks * 7)
  return d
}

// The seven dates (Monday → Sunday) of the week containing `date`.
export function weekDates(date: Date): Date[] {
  const monday = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return d
  })
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// The week we care about by default: the current week, except on Sunday when
// the current week is effectively over, so we roll forward to next week.
export function relevantWeekDate(today: Date): Date {
  return today.getDay() === 0 ? addWeeks(today, 1) : today
}

// A relative label for a week ("This week" / "Next week" / "Last week"),
// or null for anything further away.
export function weekLabel(date: Date, today: Date): string | null {
  const current = weekId(today)
  if (weekId(date) === current) return 'This week'
  if (weekId(date) === weekId(addWeeks(today, 1))) return 'Next week'
  if (weekId(date) === weekId(addWeeks(today, -1))) return 'Last week'
  return null
}

export function formatWeekRange(date: Date): string {
  const monday = startOfWeek(date)
  const sunday = new Date(monday)
  sunday.setDate(sunday.getDate() + 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
  return `${fmt(monday)} – ${fmt(sunday)}`
}
