import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { AlertCircle, ChevronRight } from 'lucide-react'

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
)

function ApiBanner() {
  const location = useLocation()
  const [configured, setConfigured] = useState(isApiConfigured())

  useEffect(() => {
    setConfigured(isApiConfigured())
  }, [location.pathname, location.hash])

  if (configured || location.pathname === '/settings' || location.hash === '#/settings') return null

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="flex items-center justify-between gap-3 px-6 py-2.5 bg-amber-50 border-b border-amber-200 overflow-hidden"
    >
      <div className="flex items-center gap-2">
        <AlertCircle size={14} className="text-amber-500" />
        <p className="text-xs text-amber-700">
          <span className="font-bold">AI 功能未激活</span> — 请先配置您的 API Key，完成连接测试后即可使用所有 AI 功能。
        </p>
      </div>
      <Link
        to="/settings"
        className="shrink-0 text-xs font-bold px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all flex items-center gap-1"
      >
        立即配置 <ChevronRight size={12} />
      </Link>
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <ApiBanner />
        <main className="flex-1 overflow-hidden p-8">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="/lesson-plan" element={<PageWrapper><LessonPlan /></PageWrapper>} />
              <Route path="/teaching-research" element={<PageWrapper><TeachingResearch /></PageWrapper>} />
              <Route path="/communication" element={<PageWrapper><Communication /></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
              <Route path="/students" element={<PageWrapper><Students /></PageWrapper>} />
              <Route path="/course-package" element={<PageWrapper><CoursePackage /></PageWrapper>} />
              <Route path="/my-lessons" element={<PageWrapper><MyLessons /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
