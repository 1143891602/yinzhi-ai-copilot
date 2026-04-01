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

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="w-full"
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
    <div className="flex items-center justify-between gap-3 px-6 py-2 bg-amber-50 border-b border-amber-200">
      <div className="flex items-center gap-2">
        <AlertCircle size={14} className="text-amber-500" />
        <p className="text-[11px] text-amber-700 font-bold">AI 未配置</p>
      </div>
      <Link to="/settings" className="text-[10px] font-bold px-3 py-1 bg-amber-500 text-white rounded-lg">去配置</Link>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 flex">
      {/* 1. 侧边栏：固定在左侧，不随页面滚动 */}
      <div className="fixed top-0 left-0 bottom-0 w-64 z-50">
        <Sidebar />
      </div>
      
      {/* 2. 主内容区：由浏览器原生 Body 负责滚动，宽度避开侧边栏 */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
        <div className="sticky top-0 z-40">
          <Header />
          <ApiBanner />
        </div>
        
        <main className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/lesson-plan" element={<PageTransition><LessonPlan /></PageTransition>} />
              <Route path="/teaching-research" element={<PageTransition><TeachingResearch /></PageTransition>} />
              <Route path="/communication" element={<PageTransition><Communication /></PageTransition>} />
              <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
              <Route path="/students" element={<PageTransition><Students /></PageTransition>} />
              <Route path="/course-package" element={<PageTransition><CoursePackage /></PageTransition>} />
              <Route path="/my-lessons" element={<PageTransition><MyLessons /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
