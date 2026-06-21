import { useEffect, useMemo, useState } from 'react'
import type { Meal } from '../types'
import {
  addMeal,
  deleteMeal,
  subscribeAllWeeks,
  subscribeMeals,
  type StoredWeek,
} from '../lib/meals'
import { computeMealStats, formatLastEaten } from '../lib/stats'

export function Meals() {
  const today = useMemo(() => new Date(), [])
  const [meals, setMeals] = useState<Meal[]>([])
  const [weeks, setWeeks] = useState<StoredWeek[]>([])
  const [name, setName] = useState('')

  useEffect(() => subscribeMeals(setMeals), [])
  useEffect(() => subscribeAllWeeks(setWeeks), [])

  const stats = useMemo(() => computeMealStats(weeks, today), [weeks, today])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setName('')
    await addMeal(trimmed)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a meal…"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white transition hover:bg-indigo-400"
        >
          Add
        </button>
      </form>

      {meals.length === 0 ? (
        <p className="py-8 text-center text-slate-500">
          No meals yet. Add your first one above.
        </p>
      ) : (
        <ul className="divide-y divide-slate-800 overflow-hidden rounded-lg border border-slate-800">
          {meals.map((meal) => {
            const stat = stats.get(meal.id)
            return (
              <li
                key={meal.id}
                className="flex items-center justify-between gap-3 bg-slate-800/50 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-white">{meal.name}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {stat
                      ? `Eaten ${stat.count} ${
                          stat.count === 1 ? 'time' : 'times'
                        } · last ${formatLastEaten(
                          stat.lastEaten!,
                          today,
                        )}`
                      : 'Not eaten yet'}
                  </div>
                </div>
                <button
                  onClick={() => deleteMeal(meal.id)}
                  className="shrink-0 text-sm text-slate-500 transition hover:text-red-400"
                >
                  Delete
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
