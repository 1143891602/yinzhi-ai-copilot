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
  scores?: {
    intonation: number
    rhythm: number
    expression: number
    reading: number
    diligence: number
  }
}

const STORAGE_KEY = 'yinzhi_students'

const DEFAULT_SCORES = { intonation: 70, rhythm: 65, expression: 60, reading: 75, diligence: 80 }

const DEFAULT_STUDENTS: Student[] = [
  { id: 1, name: '王小明', instrument: '钢琴', level: '4 级', age: 9, phone: '138****8888', teacher: '张老师', joinDate: '2023-09', nextExam: '2024-06', status: 'active', avatar: '王', progress: 72, scores: { intonation: 85, rhythm: 78, expression: 70, reading: 82, diligence: 90 } },
  { id: 2, name: '李佳琪', instrument: '钢琴', level: '2 级', age: 7, phone: '139****6666', teacher: '李老师', joinDate: '2023-11', nextExam: '2024-06', status: 'active', avatar: '李', progress: 45, scores: { intonation: 65, rhythm: 60, expression: 80, reading: 55, diligence: 70 } },
  { id: 3, name: '张子涵', instrument: '声乐', level: '考级班', age: 11, phone: '137****5555', teacher: '王老师', joinDate: '2022-03', nextExam: '2024-07', status: 'active', avatar: '张', progress: 88, scores: { intonation: 92, rhythm: 85, expression: 95, reading: 80, diligence: 88 } },
  { id: 4, name: '陈思远', instrument: '古筝', level: '5 级', age: 10, phone: '135****3333', teacher: '张老师', joinDate: '2023-06', nextExam: '2024-12', status: 'active', avatar: '陈', progress: 60, scores: { intonation: 75, rhythm: 72, expression: 68, reading: 70, diligence: 75 } },
  { id: 5, name: '刘欣怡', instrument: '小提琴', level: '初级', age: 8, phone: '136****2222', teacher: '李老师', joinDate: '2024-01', nextExam: '2025-06', status: 'pause', avatar: '刘', progress: 30, scores: { intonation: 50, rhythm: 45, expression: 60, reading: 40, diligence: 55 } },
  { id: 6, name: '赵宇航', instrument: '钢琴', level: '8 级', age: 14, phone: '133****1111', teacher: '张老师', joinDate: '2021-09', nextExam: '2024-12', status: 'active', avatar: '赵', progress: 95, scores: { intonation: 95, rhythm: 98, expression: 92, reading: 96, diligence: 94 } },
]

export function getStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STUDENTS))
      return DEFAULT_STUDENTS
    }
    const list = JSON.parse(raw)
    // 补全缺失分数
    return list.map((s: Student) => ({
      ...s,
      scores: s.scores || DEFAULT_SCORES
    }))
  } catch {
    return DEFAULT_STUDENTS
  }
}

export function saveStudents(students: Student[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
}

export function addStudent(student: Omit<Student, 'id' | 'joinDate' | 'progress' | 'scores'>) {
  const list = getStudents()
  const newStudent: Student = {
    ...student,
    id: Date.now(),
    joinDate: new Date().toISOString().slice(0, 7),
    progress: 0,
    scores: DEFAULT_SCORES
  }
  list.unshift(newStudent)
  saveStudents(list)
  return newStudent
}

export function updateStudentScores(id: number, scores: Student['scores']) {
  const list = getStudents().map(s => s.id === id ? { ...s, scores } : s)
  saveStudents(list)
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
