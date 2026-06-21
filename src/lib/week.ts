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

export function formatWeekRange(date: Date): string {
  const monday = startOfWeek(date)
  const sunday = new Date(monday)
  sunday.setDate(sunday.getDate() + 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
  return `${fmt(monday)} – ${fmt(sunday)}`
}
