import { useEffect, useState } from 'react'
import type { Meal } from '../types'
import { addMeal, deleteMeal, subscribeMeals } from '../lib/meals'

export function Meals() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [name, setName] = useState('')

  useEffect(() => subscribeMeals(setMeals), [])

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
          {meals.map((meal) => (
            <li
              key={meal.id}
              className="flex items-center justify-between bg-slate-800/50 px-4 py-3"
            >
              <span className="text-white">{meal.name}</span>
              <button
                onClick={() => deleteMeal(meal.id)}
                className="text-sm text-slate-500 transition hover:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
