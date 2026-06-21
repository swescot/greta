export interface Meal {
  id: string
  name: string
}

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export type Day = (typeof DAYS)[number]

// A week plan maps each day to a meal id (or null if nothing planned).
export type WeekPlan = Record<Day, string | null>

export const emptyWeekPlan = (): WeekPlan =>
  DAYS.reduce((plan, day) => {
    plan[day] = null
    return plan
  }, {} as WeekPlan)
