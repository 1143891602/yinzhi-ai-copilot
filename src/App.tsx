import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import LessonPlan from './pages/LessonPlan'
import TeachingResearch from './pages/TeachingResearch'
import Communication from './pages/Communication'
import Settings from './pages/Settings'
import Students from './pages/Students'

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/lesson-plan" element={<LessonPlan />} />
            <Route path="/teaching-research" element={<TeachingResearch />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/students" element={<Students />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
