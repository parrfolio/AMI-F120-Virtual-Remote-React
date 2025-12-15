import { create } from 'zustand';
import { PulseSettingsPayload } from '@/types';

interface PulseSettingsState extends PulseSettingsPayload {
    setPulseSpeed: (value: number) => void;
    setPulseDelay: (value: number) => void;
    setPtrainDelay: (value: number) => void;
    setPulseSettings: (payload: PulseSettingsPayload) => void;
}

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

export const usePulseSettingsStore = create<PulseSettingsState>((set) => ({
    pulseSpeed: 70,
    pulseDelay: 30,
    ptrainDelay: 400,
    setPulseSpeed: (value) =>
        set(() => ({ pulseSpeed: clamp(value, 0, 100) })),
    setPulseDelay: (value) =>
        set(() => ({ pulseDelay: clamp(value, 0, 100) })),
    setPtrainDelay: (value) =>
        set(() => ({ ptrainDelay: clamp(value, 0, 1000) })),
    setPulseSettings: (payload) =>
        set(() => ({
            pulseSpeed: clamp(payload.pulseSpeed, 0, 100),
            pulseDelay: clamp(payload.pulseDelay, 0, 100),
            ptrainDelay: clamp(payload.ptrainDelay, 0, 1000),
        })),
}));
