import { create } from 'zustand';
import { getAllSongs } from '@/lib/firebase';
import { Song, JukeboxData, Disc } from '@/types';
import { usePlayerStore } from '@/stores/playerStore';

interface JukeboxState {
    songs: Song[];
    jukeboxData: JukeboxData;
    loading: boolean;
    error: string | null;

    // Actions
    fetchSongs: () => Promise<void>;
    refreshSongs: () => Promise<void>;
    updateSongFavorite: (songId: string, favorite: boolean) => void;
    updateSongRecentlyPlayed: (songId: string, recentlyPlayed: boolean) => void;
}

// Helper function to convert flat song list to disc format
const songsToJukeboxData = (songs: Song[]): JukeboxData => {
    const discs: Disc[] = [];
    const discMap = new Map<string, Song[]>();

    // Group songs by albumArt first (for Discogs imports)
    songs.forEach(song => {
        if (song.albumArt) {
            const key = song.albumArt;
            if (!discMap.has(key)) {
                discMap.set(key, []);
            }
            discMap.get(key)!.push(song);
        }
    });

    // Process songs with albumArt (paired discs)
    const processedSongs = new Set<string>();
    discMap.forEach(discSongs => {
        if (discSongs.length >= 2) {
            const aSide = discSongs.find(s => s.side === 'A Side') || discSongs[0];
            const bSide = discSongs.find(s => s.side === 'B Side') || discSongs[1];

            discs.push({ disc: [aSide, bSide] });
            processedSongs.add(aSide.id || '');
            processedSongs.add(bSide.id || '');
        } else if (discSongs.length === 1) {
            discs.push({ disc: [discSongs[0]] });
            processedSongs.add(discSongs[0].id || '');
        }
    });

    // Process remaining songs (manual adds without albumArt) in pairs by selection order
    const remainingSongs = songs
        .filter(s => !processedSongs.has(s.id || ''))
        .sort((a, b) => a.select.selection - b.select.selection);

    for (let i = 0; i < remainingSongs.length; i += 2) {
        const aSide = remainingSongs[i];
        const bSide = remainingSongs[i + 1];

        if (aSide) {
            const disc: Disc = {
                disc: bSide ? [aSide, bSide] : [aSide]
            };
            discs.push(disc);
        }
    }

    // Sort discs by the first song's selection number
    return discs.sort((a, b) => {
        const aSelection = a.disc[0]?.select.selection || 0;
        const bSelection = b.disc[0]?.select.selection || 0;
        return aSelection - bSelection;
    });
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

        // Also update nowPlaying and queue in playerStore
        const playerState = usePlayerStore.getState();
        
        // Update nowPlaying if this is the current song or other side
        if (playerState.nowPlaying?.id === songId) {
            // Favoriting the currently playing song
            playerState.setNowPlaying({
                ...playerState.nowPlaying,
                favorite
            });
        } else if (playerState.nowPlaying?.otherSideId === songId) {
            // Favoriting the other side of the disc
            playerState.setNowPlaying({
                ...playerState.nowPlaying,
                otherSideFavorite: favorite
            });
        }

        // Update the queue if the song is in the queue
        usePlayerStore.setState((state) => ({
            queue: state.queue.map(queuedSong => {
                if (queuedSong.id === songId) {
                    return { ...queuedSong, favorite };
                } else if (queuedSong.otherSideId === songId) {
                    return { ...queuedSong, otherSideFavorite: favorite };
                }
                return queuedSong;
            })
        }));
    },

    updateSongRecentlyPlayed: (songId: string, recentlyPlayed: boolean) => {
        set((state) => {
            // Update songs array
            const updatedSongs = state.songs.map(song =>
                song.id === songId ? { ...song, recentlyPlayed } : song
            );

            // Update jukeboxData array
            const updatedJukeboxData = state.jukeboxData.map(disc => ({
                disc: disc.disc.map(song =>
                    song.id === songId ? { ...song, recentlyPlayed } : song
                )
            }));

            return {
                songs: updatedSongs,
                jukeboxData: updatedJukeboxData
            };
        });
    },
}));
