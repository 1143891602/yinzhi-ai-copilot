import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
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
    initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="w-full"
  >
    {children}
  </motion.div>
)

export default function App() {
  const location = useLocation()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen premium-shell text-slate-900 flex selection:bg-premium-purple/20 relative overflow-x-hidden">
      <div className="soft-noise" />
      <div className="ambient-glow fixed -top-24 -left-24 z-0 h-[420px] w-[420px] bg-premium-purple/20 animate-drift" />
      <div className="ambient-glow fixed top-[18%] right-[-120px] z-0 h-[380px] w-[380px] bg-sky-300/25 animate-float-slow" />
      <div className="ambient-glow fixed bottom-[-120px] left-[28%] z-0 h-[340px] w-[340px] bg-pink-300/20 animate-breathe-slow" />

      {/* 全局动态光晕 - 随鼠标轻微偏移 */}
      <div 
        className="fixed pointer-events-none z-0 transition-transform duration-1000 ease-out"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
          width: '520px',
          height: '520px',
          background: 'radial-gradient(circle, rgba(110, 44, 242, 0.12) 0%, rgba(33, 150, 243, 0.06) 24%, transparent 72%)',
          filter: 'blur(88px)',
        }}
      />

      <div className="fixed top-0 left-0 bottom-0 w-64 z-50 px-5 py-6">
        <Sidebar />
      </div>
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
        <div className="sticky top-0 z-40 px-6 pt-6">
          <Header />
        </div>
        
        <main className="flex-1 px-6 pb-8 pt-4">
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
