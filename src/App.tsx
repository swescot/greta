import { useState } from 'react'
import { isFirebaseConfigured } from './lib/firebase'
import { AuthProvider } from './auth/AuthProvider'
import { logOut, useAuth } from './auth/useAuth'
import { SetupNeeded } from './components/SetupNeeded'
import { SignIn } from './components/SignIn'
import { Meals } from './components/Meals'
import { WeekView } from './components/WeekView'
import { WeekPlanner } from './components/WeekPlanner'
import { addWeeks } from './lib/week'

type Tab = 'week' | 'planner' | 'meals'

function Home() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<Tab>('week')
  // The planner defaults to next week; jumping from "This Week" retargets it.
  const [plannerDate, setPlannerDate] = useState(() => addWeeks(new Date(), 1))

  const editWeek = (date: Date) => {
    setPlannerDate(date)
    setTab('planner')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading…
      </div>
    )
  }

  if (!user) return <SignIn />

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <h1 className="text-xl font-semibold text-white">Greta</h1>
        <button
          onClick={() => logOut()}
          className="text-sm text-slate-400 transition hover:text-white"
        >
          Sign out
        </button>
      </header>

      <nav className="flex border-b border-slate-800">
        <TabButton active={tab === 'week'} onClick={() => setTab('week')}>
          This Week
        </TabButton>
        <TabButton active={tab === 'planner'} onClick={() => setTab('planner')}>
          Planner
        </TabButton>
        <TabButton active={tab === 'meals'} onClick={() => setTab('meals')}>
          Meals
        </TabButton>
      </nav>

      <main className="flex-1 p-4">
        {tab === 'week' && <WeekView onEditWeek={editWeek} />}
        {tab === 'planner' && (
          <WeekPlanner date={plannerDate} onNavigate={setPlannerDate} />
        )}
        {tab === 'meals' && <Meals />}
      </main>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-sm font-medium transition ${
        active
          ? 'border-b-2 border-indigo-400 text-white'
          : 'text-slate-400 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

export default function App() {
  if (!isFirebaseConfigured) return <SetupNeeded />

  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  )
}
