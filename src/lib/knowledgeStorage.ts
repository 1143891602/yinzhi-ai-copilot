export type KnowledgeSnippet = {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  enabled: boolean
}

const STORAGE_KEY = 'yinzhi_knowledge'

const DEFAULT_SNIPPETS: KnowledgeSnippet[] = [
  {
    id: '1',
    title: '古典时期触键标准',
    content: '触键要灵敏、轻巧。手指应贴近琴键，声音要晶莹剔透，避免过度下沉。莫扎特作品中，断奏（Staccato）通常是音符长度的一半。',
    category: '钢琴技巧',
    createdAt: new Date().toISOString(),
    enabled: true
  },
  {
    id: '2',
    title: '声乐呼吸：腹式呼吸训练',
    content: '吸气时腹部向外扩张，横膈膜下沉。呼气时腹部有节奏地向内收缩，支撑气息流出。避免提肩，保持胸腔放松。',
    category: '声乐基础',
    createdAt: new Date().toISOString(),
    enabled: true
  }
]

export function getKnowledgeSnippets(): KnowledgeSnippet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SNIPPETS))
      return DEFAULT_SNIPPETS
    }
    return JSON.parse(raw)
  } catch {
    return DEFAULT_SNIPPETS
  }
}

export function saveKnowledgeSnippets(snippets: KnowledgeSnippet[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
}

export function addKnowledgeSnippet(snippet: Omit<KnowledgeSnippet, 'id' | 'createdAt'>) {
  const list = getKnowledgeSnippets()
  const newItem: KnowledgeSnippet = {
    ...snippet,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  list.unshift(newItem)
  saveKnowledgeSnippets(list)
  return newItem
}

export function deleteKnowledgeSnippet(id: string) {
  const list = getKnowledgeSnippets().filter(s => s.id !== id)
  saveKnowledgeSnippets(list)
}

export function toggleKnowledgeSnippet(id: string) {
  const list = getKnowledgeSnippets().map(s => 
    s.id === id ? { ...s, enabled: !s.enabled } : s
  )
  saveKnowledgeSnippets(list)
}
