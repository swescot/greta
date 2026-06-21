import { useEffect, useMemo, useState } from 'react'
import type { Meal, WeekPlan } from '../types'
import { DAYS, emptyWeekPlan } from '../types'
import { subscribeMeals, subscribeWeekPlan } from '../lib/meals'
import {
  addWeeks,
  formatWeekRange,
  isSameDay,
  relevantWeekDate,
  weekDates,
  weekId,
  weekLabel,
} from '../lib/week'

export function WeekView({ onEditWeek }: { onEditWeek: (date: Date) => void }) {
  const today = useMemo(() => new Date(), [])
  const [viewDate, setViewDate] = useState(() => relevantWeekDate(today))
  const id = useMemo(() => weekId(viewDate), [viewDate])
  const dates = useMemo(() => weekDates(viewDate), [viewDate])
  const label = weekLabel(viewDate, today)

  const [meals, setMeals] = useState<Meal[]>([])
  const [plan, setPlan] = useState<WeekPlan>(emptyWeekPlan())

  useEffect(() => subscribeMeals(setMeals), [])
  useEffect(() => subscribeWeekPlan(id, setPlan), [id])

  const mealName = useMemo(() => {
    const byId = new Map(meals.map((m) => [m.id, m.name]))
    return (mealId: string | null) => (mealId ? byId.get(mealId) ?? null : null)
  }, [meals])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setViewDate(addWeeks(viewDate, -1))}
          className="rounded-lg px-3 py-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          ‹ Prev
        </button>
        <div className="text-center">
          <div className="font-medium text-white">
            {formatWeekRange(viewDate)}
          </div>
          {label && <div className="text-xs text-indigo-400">{label}</div>}
        </div>
        <button
          onClick={() => setViewDate(addWeeks(viewDate, 1))}
          className="rounded-lg px-3 py-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          Next ›
        </button>
      </div>

      <ul className="space-y-2">
        {DAYS.map((day, i) => {
          const date = dates[i]
          const isToday = isSameDay(date, today)
          const isPast = date < today && !isToday
          const name = mealName(plan[day])

          return (
            <li key={day}>
              <button
                onClick={() => onEditWeek(viewDate)}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
                  isToday
                    ? 'border-indigo-400 bg-indigo-500/10'
                    : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                } ${isPast ? 'opacity-50' : ''}`}
              >
                <span
                  className={`w-24 shrink-0 ${
                    isToday ? 'font-medium text-white' : 'text-slate-300'
                  }`}
                >
                  {day}
                </span>
                <span
                  className={`flex-1 ${name ? 'text-white' : 'text-slate-500'}`}
                >
                  {name ?? 'Nothing planned'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="text-center text-xs text-slate-500">
        Tap a day to edit it in the planner.
      </p>
    </div>
  )
}
