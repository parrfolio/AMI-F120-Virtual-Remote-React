import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { SongSelection } from '@/types';

interface NowPlaying {
    id?: string;
    title: string;
    artist: string;
    albumCover?: string;
    albumArt?: string; // Discogs image URL
    favorite?: boolean;
    side?: 'A Side' | 'B Side';
    otherSideTitle?: string; // Title of the other side of the disc (if exists)
    otherSideId?: string; // ID of the other side
    otherSideFavorite?: boolean; // Favorite status of the other side
}

interface QueuedSong extends NowPlaying {
    selection: SongSelection;
    duration?: number; // Duration in seconds, default 180 (3 minutes)
}

interface PersistedQueueState {
    queue: QueuedSong[];
    currentIndex: number;
    timeRemaining: number;
    songDuration: number;
    nowPlaying: NowPlaying | null;
    lastUpdated: number; // Timestamp to calculate elapsed time
}

// Load persisted state from localStorage
const loadPersistedState = (): Partial<PersistedQueueState> | null => {
    try {
        const stored = localStorage.getItem('jukeboxQueue');
        if (!stored) return null;

        const data: PersistedQueueState = JSON.parse(stored);

        // If queue is empty, clear everything
        if (!data.queue || data.queue.length === 0) {
            return {
                queue: [],
                currentIndex: -1,
                timeRemaining: 0,
                songDuration: 180,
                nowPlaying: null,
            };
        }

        // Calculate elapsed time since last update
        const now = Date.now();
        const elapsed = Math.floor((now - data.lastUpdated) / 1000); // seconds

        // Adjust timeRemaining based on elapsed time
        const adjustedTimeRemaining = Math.max(0, data.timeRemaining - elapsed);

        return {
            queue: data.queue || [],
            currentIndex: data.currentIndex ?? -1,
            timeRemaining: adjustedTimeRemaining,
            songDuration: data.songDuration || 180,
            nowPlaying: data.nowPlaying || null,
        };
    } catch (error) {
        console.error('Failed to load persisted queue state:', error);
        return null;
    }
};

// Save state to localStorage
const savePersistedState = (state: PlayerState) => {
    try {
        const dataToSave: PersistedQueueState = {
            queue: state.queue,
            currentIndex: state.currentIndex,
            timeRemaining: state.timeRemaining,
            songDuration: state.songDuration,
            nowPlaying: state.nowPlaying,
            lastUpdated: Date.now(),
        };
        localStorage.setItem('jukeboxQueue', JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Failed to save queue state:', error);
    }
};

interface PlayerState {
    socket: Socket | null;
    socketConnected: boolean;
    nowPlaying: NowPlaying | null;
    isPlaying: boolean;
    isPlayerExpanded: boolean;
    queue: QueuedSong[];
    currentIndex: number;
    timeRemaining: number; // Seconds remaining for current song
    songDuration: number; // Total duration of current song

    // Actions
    setSocket: (socket: Socket | null) => void;
    setSocketConnected: (connected: boolean) => void;
    setNowPlaying: (track: NowPlaying | null) => void;
    setIsPlaying: (playing: boolean) => void;
    setIsPlayerExpanded: (expanded: boolean) => void;
    togglePlayback: () => void;
    togglePlayerExpanded: () => void;

    // Queue actions
    addToQueue: (song: QueuedSong) => void;
    removeFromQueue: (index: number) => void;
    clearQueue: () => void;
    playFromQueue: (index: number) => QueuedSong | null;
    playNext: () => QueuedSong | null;

    // Timer actions
    setTimeRemaining: (time: number) => void;
    setSongDuration: (duration: number) => void;
    decrementTime: () => void;
    startTimer: (duration: number) => void;

    // Play history actions
    markAsRecentlyPlayed: (songId: string) => Promise<void>;
}

// Initialize with persisted state if available
const persistedState = loadPersistedState();

export const usePlayerStore = create<PlayerState>((set, get) => ({
    socket: null,
    socketConnected: false,
    nowPlaying: persistedState?.nowPlaying || null,
    isPlaying: false,
    isPlayerExpanded: false,
    queue: persistedState?.queue || [],
    currentIndex: persistedState?.currentIndex ?? -1,
    timeRemaining: persistedState?.timeRemaining || 0,
    songDuration: persistedState?.songDuration || 180,

    setSocket: (socket) => set({ socket }),
    setSocketConnected: (connected) => set({ socketConnected: connected }),
    setNowPlaying: (track) => {
        set({ nowPlaying: track });
        savePersistedState(get());
    },
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    setIsPlayerExpanded: (expanded) => set({ isPlayerExpanded: expanded }),
    togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
    togglePlayerExpanded: () => set((state) => ({ isPlayerExpanded: !state.isPlayerExpanded })),

    addToQueue: (song) => {
        set((state) => ({
            queue: [...state.queue, song]
        }));
        savePersistedState(get());
    },

    removeFromQueue: (index) => {
        set((state) => {
            const newQueue = state.queue.filter((_, i) => i !== index);
            const newCurrentIndex = state.currentIndex >= index ? state.currentIndex - 1 : state.currentIndex;
            return {
                queue: newQueue,
                currentIndex: newCurrentIndex >= 0 ? newCurrentIndex : -1
            };
        });
        savePersistedState(get());
    },

    clearQueue: () => {
        set({
            queue: [],
            currentIndex: -1,
            timeRemaining: 0,
            nowPlaying: null,
            isPlaying: false,
            isPlayerExpanded: false,
        });
        savePersistedState(get());
    },

    playFromQueue: (index) => {
        const state = get();
        if (index < 0 || index >= state.queue.length) return null;

        const song = state.queue[index];
        set({
            currentIndex: index,
            nowPlaying: {
                id: song.id,
                title: song.title,
                artist: song.artist,
                albumCover: song.albumCover,
                albumArt: song.albumArt, // Discogs image
                favorite: song.favorite,
                side: song.side,
                otherSideTitle: song.otherSideTitle,
                otherSideId: song.otherSideId,
                otherSideFavorite: song.otherSideFavorite,
            },
            isPlaying: true,
            isPlayerExpanded: true
        });
        savePersistedState(get());

        return song;
    },

    playNext: () => {
        const state = get();
        const nextIndex = state.currentIndex + 1;
        if (nextIndex >= state.queue.length) return null;

        return state.playFromQueue(nextIndex);
    },

    setTimeRemaining: (time) => {
        set({ timeRemaining: time });
        savePersistedState(get());
    },
    setSongDuration: (duration) => {
        set({ songDuration: duration });
        savePersistedState(get());
    },
    decrementTime: () => {
        set((state) => ({
            timeRemaining: Math.max(0, state.timeRemaining - 1)
        }));
        savePersistedState(get());
    },
    startTimer: (duration) => {
        set({
            timeRemaining: duration,
            songDuration: duration
        });
        savePersistedState(get());
    },

    markAsRecentlyPlayed: async (songId: string) => {
        try {
            // Update UI immediately
            const { useJukeboxStore } = await import('@/stores/jukeboxStore');
            useJukeboxStore.getState().updateSongRecentlyPlayed(songId, true);

            // Then update database
            const { updateRecentlyPlayed } = await import('@/lib/firebase');
            await updateRecentlyPlayed(songId, true);
        } catch (error) {
            console.error('Error marking song as recently played:', error);
        }
    },
}));
