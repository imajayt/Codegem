import { create } from 'zustand'
import { Streak } from '../interfaces'

interface Props {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
    onSetStreak: (streak: Streak) => void,
    streak: Streak | null
}

export const useStreakModal = create<Props>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    onSetStreak: (streak: Streak) => set({ streak }),
    streak: null
}))