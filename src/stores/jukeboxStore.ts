import { create } from 'zustand';
import { getAllSongs } from '@/lib/firebase';
import { Song, JukeboxData, Disc } from '@/types';

interface JukeboxState {
    songs: Song[];
    jukeboxData: JukeboxData;
    loading: boolean;
    error: string | null;

    // Actions
    fetchSongs: () => Promise<void>;
    refreshSongs: () => Promise<void>;
    updateSongFavorite: (songId: string, favorite: boolean) => void;
}

// Helper function to convert flat song list to disc format
const songsToJukeboxData = (songs: Song[]): JukeboxData => {
    const discs: Disc[] = [];

    // Group songs by pairs (A Side and B Side)
    for (let i = 0; i < songs.length; i += 2) {
        const aSide = songs[i];
        const bSide = songs[i + 1];

        if (aSide) {
            const disc: Disc = {
                disc: [aSide]
            };

            if (bSide) {
                disc.disc.push(bSide);
            }

            discs.push(disc);
        }
    }

    return discs;
};

export const useJukeboxStore = create<JukeboxState>((set) => ({
    songs: [],
    jukeboxData: [],
    loading: false,
    error: null,

    fetchSongs: async () => {
        set({ loading: true, error: null });
        try {
            const songs = await getAllSongs();
            const jukeboxData = songsToJukeboxData(songs);
            set({ songs, jukeboxData, loading: false });
        } catch (error) {
            console.error('Error fetching songs:', error);
            set({ error: 'Failed to load songs', loading: false });
        }
    },

    refreshSongs: async () => {
        try {
            const songs = await getAllSongs();
            const jukeboxData = songsToJukeboxData(songs);
            set({ songs, jukeboxData });
        } catch (error) {
            console.error('Error refreshing songs:', error);
        }
    },

    updateSongFavorite: (songId: string, favorite: boolean) => {
        set((state) => {
            // Update songs array
            const updatedSongs = state.songs.map(song =>
                song.id === songId ? { ...song, favorite } : song
            );

            // Update jukeboxData array
            const updatedJukeboxData = state.jukeboxData.map(disc => ({
                disc: disc.disc.map(song =>
                    song.id === songId ? { ...song, favorite } : song
                )
            }));

            return {
                songs: updatedSongs,
                jukeboxData: updatedJukeboxData
            };
        });
    },
}));
