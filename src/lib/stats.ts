import type { StoredWeek } from './meals'
import { DAYS } from '../types'

export interface MealStat {
  count: number
  lastEaten: Date | null
}

// Aggregate how many times each meal has been eaten (planned on a past-or-today
// date) and when it was most recently eaten. Future-planned meals are ignored.
export function computeMealStats(
  weeks: StoredWeek[],
  today: Date,
): Map<string, MealStat> {
  const todayMid = new Date(today)
  todayMid.setHours(0, 0, 0, 0)

  const stats = new Map<string, MealStat>()

  for (const week of weeks) {
    const monday = new Date(`${week.id}T00:00:00`)
    if (Number.isNaN(monday.getTime())) continue

    DAYS.forEach((day, i) => {
      const mealId = week.plan[day]
      if (!mealId) return

      const date = new Date(monday)
      date.setDate(date.getDate() + i)
      if (date > todayMid) return // planned for the future — not eaten yet

      const current = stats.get(mealId) ?? { count: 0, lastEaten: null }
      current.count += 1
      if (!current.lastEaten || date > current.lastEaten) {
        current.lastEaten = date
      }
      stats.set(mealId, current)
    })
  }

  return stats
}

// "today", "yesterday", "3 days ago", "2 weeks ago", or a date for older.
export function formatLastEaten(date: Date, today: Date): string {
  const a = new Date(date)
  a.setHours(0, 0, 0, 0)
  const b = new Date(today)
  b.setHours(0, 0, 0, 0)
  const days = Math.round((b.getTime() - a.getTime()) / 86_400_000)

  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 14) return 'last week'
  if (days < 28) return `${Math.floor(days / 7)} weeks ago`
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
