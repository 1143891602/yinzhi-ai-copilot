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

// 动画层不再控制任何高度，只负责透明度渐变
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="w-full"
  >
    {children}
  </motion.div>
)

function ApiBanner() {
  const location = useLocation()
  const [configured, setConfigured] = useState(isApiConfigured())
  useEffect(() => { setConfigured(isApiConfigured()) }, [location.pathname, location.hash])
  if (configured || location.pathname === '/settings' || location.hash === '#/settings') return null
  return (
    <div className="flex items-center justify-between px-6 py-2 bg-amber-50 border-b border-amber-200">
      <p className="text-[11px] text-amber-700 font-bold">AI 功能未配置</p>
      <Link to="/settings" className="text-[10px] font-bold px-3 py-1 bg-amber-500 text-white rounded-lg">去配置</Link>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. 侧边栏：彻底固定，不随页面动 */}
      <div className="fixed top-0 left-0 bottom-0 w-64 z-50 bg-slate-950">
        <Sidebar />
      </div>
      
      {/* 2. 主内容区：避开左边 64px 即可，由 Body 自动滚动 */}
      <div className="pl-64 min-h-screen flex flex-col">
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <Header />
          <ApiBanner />
        </div>
        
        <main className="p-8 pb-20">
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
