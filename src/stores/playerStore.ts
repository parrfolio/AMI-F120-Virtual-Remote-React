import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface NowPlaying {
    id?: string;
    title: string;
    artist: string;
    albumCover?: string;
    favorite?: boolean;
}

interface PlayerState {
    socket: Socket | null;
    socketConnected: boolean;
    nowPlaying: NowPlaying | null;
    isPlaying: boolean;
    isPlayerExpanded: boolean;

    // Actions
    setSocket: (socket: Socket | null) => void;
    setSocketConnected: (connected: boolean) => void;
    setNowPlaying: (track: NowPlaying | null) => void;
    setIsPlaying: (playing: boolean) => void;
    setIsPlayerExpanded: (expanded: boolean) => void;
    togglePlayback: () => void;
    togglePlayerExpanded: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    socket: null,
    socketConnected: false,
    nowPlaying: null,
    isPlaying: false,
    isPlayerExpanded: false,

    setSocket: (socket) => set({ socket }),
    setSocketConnected: (connected) => set({ socketConnected: connected }),
    setNowPlaying: (track) => set({ nowPlaying: track }),
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    setIsPlayerExpanded: (expanded) => set({ isPlayerExpanded: expanded }),
    togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
    togglePlayerExpanded: () => set((state) => ({ isPlayerExpanded: !state.isPlayerExpanded })),
}));
