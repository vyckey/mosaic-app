import { create } from 'zustand';

export type AiMemoryCategory = 'interest' | 'habit' | 'experience';

export interface AiMemory {
  id: string;
  category: AiMemoryCategory;
  content: string;
  source: string;
  updatedAt: string;
}

export interface AiMemoryState {
  memories: AiMemory[];
  updateMemory: (id: string, content: string) => void;
  deleteMemory: (id: string) => void;
  clearMemories: () => void;
  reset: () => void;
}

const initialMemories: AiMemory[] = [
  {
    id: 'memory-coffee',
    category: 'habit',
    content: '习惯在周末早晨去独立咖啡馆写作。',
    source: '记录「周六的咖啡馆」',
    updatedAt: '2026-11-13',
  },
  {
    id: 'memory-running',
    category: 'habit',
    content: '每周跑步 2–3 次，通常记录在傍晚。',
    source: '运动记录',
    updatedAt: '2026-11-09',
  },
  {
    id: 'memory-travel',
    category: 'interest',
    content: '喜欢有海和旧铁路的小城市，镰仓是印象最深的一站。',
    source: '生活碎片「镰仓」',
    updatedAt: '2026-11-02',
  },
  {
    id: 'memory-career',
    category: 'experience',
    content: '两年前的入职第一天是重要的转折点，常被那年今日提起。',
    source: '人生大事「入职第一天」',
    updatedAt: '2026-10-16',
  },
];

export const useAiMemoryStore = create<AiMemoryState>((set) => ({
  memories: initialMemories,
  updateMemory: (id, content) =>
    set((state) => ({
      memories: state.memories.map((memory) =>
        memory.id === id
          ? {
              ...memory,
              content,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : memory,
      ),
    })),
  deleteMemory: (id) =>
    set((state) => ({
      memories: state.memories.filter((memory) => memory.id !== id),
    })),
  clearMemories: () => set({ memories: [] }),
  reset: () => set({ memories: initialMemories }),
}));
