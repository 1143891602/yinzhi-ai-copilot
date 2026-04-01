import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import LessonPlan from './pages/LessonPlan'
import TeachingResearch from './pages/TeachingResearch'
import Communication from './pages/Communication'
import Settings from './pages/Settings'
import Students from './pages/Students'
import CoursePackage from './pages/CoursePackage'
import MyLessons from './pages/MyLessons'
import { isApiConfigured } from './lib/ai'

function ApiBanner() {
  const location = useLocation()
  const [configured, setConfigured] = useState(isApiConfigured())

  useEffect(() => {
    setConfigured(isApiConfigured())
  }, [location.pathname, location.hash])

  if (configured || location.pathname === '/settings' || location.hash === '#/settings') return null

  return (
    <div className="flex items-center justify-between gap-3 px-6 py-2.5 bg-amber-50 border-b border-amber-200">
      <p className="text-xs text-amber-700">
        <span className="font-bold">AI 功能未激活</span> — 请先配置您的 API Key，完成连接测试后即可使用所有 AI 功能。
      </p>
      <Link
        to="/settings"
        className="shrink-0 text-xs font-bold px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
      >
        立即配置 →
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <ApiBanner />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/lesson-plan" element={<LessonPlan />} />
            <Route path="/teaching-research" element={<TeachingResearch />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/students" element={<Students />} />
            <Route path="/course-package" element={<CoursePackage />} />
            <Route path="/my-lessons" element={<MyLessons />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
