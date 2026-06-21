import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Meal, WeekPlan } from '../types'
import { emptyWeekPlan } from '../types'

function database() {
  if (!db) throw new Error('Firebase is not configured')
  return db
}

const mealsCol = () => collection(database(), 'meals')
const weeksCol = () => collection(database(), 'weeks')

// --- Meals ---------------------------------------------------------------

export function subscribeMeals(onChange: (meals: Meal[]) => void) {
  const q = query(mealsCol(), orderBy('name'))
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, name: d.data().name as string })))
  })
}

export async function addMeal(name: string) {
  await addDoc(mealsCol(), { name: name.trim(), createdAt: serverTimestamp() })
}

export async function deleteMeal(id: string) {
  await deleteDoc(doc(mealsCol(), id))
}

// --- Week plans ----------------------------------------------------------

export function subscribeWeekPlan(
  id: string,
  onChange: (plan: WeekPlan) => void,
) {
  return onSnapshot(doc(weeksCol(), id), (snap) => {
    const data = snap.data()
    onChange({ ...emptyWeekPlan(), ...(data?.plan as Partial<WeekPlan>) })
  })
}

export async function saveWeekPlan(id: string, plan: WeekPlan) {
  await setDoc(doc(weeksCol(), id), { plan }, { merge: true })
}
