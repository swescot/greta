import { useEffect, useMemo, useState } from 'react'
import type { Meal, WeekPlan } from '../types'
import { DAYS, emptyWeekPlan } from '../types'
import { saveWeekPlan, subscribeMeals, subscribeWeekPlan } from '../lib/meals'
import { addWeeks, formatWeekRange, weekId } from '../lib/week'

export function WeekPlanner() {
  const [offset, setOffset] = useState(0)
  const [meals, setMeals] = useState<Meal[]>([])
  const [plan, setPlan] = useState<WeekPlan>(emptyWeekPlan())

  const date = useMemo(() => addWeeks(new Date(), offset), [offset])
  const id = useMemo(() => weekId(date), [date])

  useEffect(() => subscribeMeals(setMeals), [])
  useEffect(() => subscribeWeekPlan(id, setPlan), [id])

  const handleSelect = (day: (typeof DAYS)[number], mealId: string) => {
    const next = { ...plan, [day]: mealId || null }
    setPlan(next)
    saveWeekPlan(id, next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOffset((o) => o - 1)}
          className="rounded-lg px-3 py-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          ‹ Prev
        </button>
        <div className="text-center">
          <div className="font-medium text-white">{formatWeekRange(date)}</div>
          {offset === 0 && (
            <div className="text-xs text-indigo-400">This week</div>
          )}
        </div>
        <button
          onClick={() => setOffset((o) => o + 1)}
          className="rounded-lg px-3 py-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          Next ›
        </button>
      </div>

      <ul className="space-y-2">
        {DAYS.map((day) => (
          <li
            key={day}
            className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/50 px-4 py-3"
          >
            <span className="w-24 shrink-0 text-slate-300">{day}</span>
            <select
              value={plan[day] ?? ''}
              onChange={(e) => handleSelect(day, e.target.value)}
              className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-white focus:border-slate-500 focus:outline-none"
            >
              <option value="">— Nothing planned —</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>
                  {meal.name}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>

      {meals.length === 0 && (
        <p className="text-center text-sm text-slate-500">
          Add some meals on the Meals tab to start planning.
        </p>
      )}
    </div>
  )
}
