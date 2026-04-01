export type Student = {
  id: number
  name: string
  instrument: string
  level: string
  age: number
  phone: string
  teacher: string
  joinDate: string
  nextExam: string
  status: 'active' | 'pause'
  avatar: string
  progress: number
}

const STORAGE_KEY = 'yinzhi_students'

const DEFAULT_STUDENTS: Student[] = [
  { id: 1, name: '王小明', instrument: '钢琴', level: '4 级', age: 9, phone: '138****8888', teacher: '张老师', joinDate: '2023-09', nextExam: '2024-06', status: 'active', avatar: '王', progress: 72 },
  { id: 2, name: '李佳琪', instrument: '钢琴', level: '2 级', age: 7, phone: '139****6666', teacher: '李老师', joinDate: '2023-11', nextExam: '2024-06', status: 'active', avatar: '李', progress: 45 },
  { id: 3, name: '张子涵', instrument: '声乐', level: '考级班', age: 11, phone: '137****5555', teacher: '王老师', joinDate: '2022-03', nextExam: '2024-07', status: 'active', avatar: '张', progress: 88 },
  { id: 4, name: '陈思远', instrument: '古筝', level: '5 级', age: 10, phone: '135****3333', teacher: '张老师', joinDate: '2023-06', nextExam: '2024-12', status: 'active', avatar: '陈', progress: 60 },
  { id: 5, name: '刘欣怡', instrument: '小提琴', level: '初级', age: 8, phone: '136****2222', teacher: '李老师', joinDate: '2024-01', nextExam: '2025-06', status: 'pause', avatar: '刘', progress: 30 },
  { id: 6, name: '赵宇航', instrument: '钢琴', level: '8 级', age: 14, phone: '133****1111', teacher: '张老师', joinDate: '2021-09', nextExam: '2024-12', status: 'active', avatar: '赵', progress: 95 },
]

export function getStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STUDENTS))
      return DEFAULT_STUDENTS
    }
    return JSON.parse(raw)
  } catch {
    return DEFAULT_STUDENTS
  }
}

export function saveStudents(students: Student[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
}

export function addStudent(student: Omit<Student, 'id' | 'joinDate' | 'progress'>) {
  const list = getStudents()
  const newStudent: Student = {
    ...student,
    id: Date.now(),
    joinDate: new Date().toISOString().slice(0, 7),
    progress: 0
  }
  list.unshift(newStudent)
  saveStudents(list)
  return newStudent
}

export function deleteStudent(id: number) {
  const list = getStudents().filter(s => s.id !== id)
  saveStudents(list)
}

const TAGS_KEY = 'yinzhi_student_tags'
export function getStudentTags(studentId: number): string[] {
  try {
    const map = JSON.parse(localStorage.getItem(TAGS_KEY) || '{}')
    return map[studentId] || []
  } catch { return [] }
}
