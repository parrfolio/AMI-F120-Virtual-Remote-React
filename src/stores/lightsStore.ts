import { create } from 'zustand';
import { LightsState } from '@/types';

interface LightsStore extends LightsState {
    setAnimation: (animation: string) => void;
    setRunning: (running: boolean) => void;
    setActive: (active: number | null) => void;
}

export const useLightsStore = create<LightsStore>((set) => ({
    running: false,
    animation: '',
    active: null,

    setAnimation: (animation) => set({ animation }),

    setRunning: (running) => set({ running }),

    setActive: (active) => set({ active }),
}));
