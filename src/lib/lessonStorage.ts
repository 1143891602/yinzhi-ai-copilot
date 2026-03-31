export type SavedLesson = {
  id: string
  title: string
  subject: string
  level: string
  duration: string
  content: string
  createdAt: string
}

const KEY = 'yinzhi_lessons'

export function getLessons(): SavedLesson[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveLesson(lesson: Omit<SavedLesson, 'id' | 'createdAt'>): SavedLesson {
  const lessons = getLessons()
  const newLesson: SavedLesson = {
    ...lesson,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  lessons.unshift(newLesson)
  localStorage.setItem(KEY, JSON.stringify(lessons))
  return newLesson
}

export function deleteLesson(id: string): void {
  const lessons = getLessons().filter(l => l.id !== id)
  localStorage.setItem(KEY, JSON.stringify(lessons))
}
