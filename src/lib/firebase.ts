import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { Song, Disc } from '@/types';

const firebaseConfig = {
    apiKey: 'AIzaSyCEPF0tMuYbcWHQD8gvVhJjqYtDw-DtOBg',
    authDomain: 'rsdlist.firebaseapp.com',
    databaseURL: 'https://rsdlist.firebaseio.com',
    projectId: 'rsdlist',
    storageBucket: 'rsdlist.appspot.com',
    messagingSenderId: '110371937536',
    appId: '1:110371937536:web:95d514076de6fa736b67e5',
    measurementId: 'G-2WMBQ8Z999',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Auth Providers
export const googleAuthProvider = new GoogleAuthProvider();
export const facebookAuthProvider = new FacebookAuthProvider();
export const twitterAuthProvider = new TwitterAuthProvider();
export const appleAuthProvider = new OAuthProvider('apple.com');

export const storageKey = 'KEY_FOR_LOCAL_STORAGE';

// Jukebox Firestore Operations
const JUKEBOX_COLLECTION = 'jukebox';

// Helper to get the next disc number
async function getNextDiscNumber(): Promise<number> {
    const discs = await getAllDiscs();
    if (discs.length === 0) return 1;

    // Find the highest disc number and add 1
    const maxDiscNumber = Math.max(...discs.map(d => {
        const num = parseInt(d.id.split('-')[1] || '0');
        return num;
    }));

    return maxDiscNumber + 1;
}

// Get all discs from Firestore
export async function getAllDiscs(): Promise<(Disc & { id: string })[]> {
    try {
        const discsRef = collection(db, JUKEBOX_COLLECTION);
        const snapshot = await getDocs(discsRef);

        return snapshot.docs
            .map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    disc: data.disc || []
                } as Disc & { id: string };
            })
            .sort((a, b) => {
                // Extract disc number from id (e.g., "disc-1" -> 1)
                const aNum = parseInt(a.id.split('-')[1] || '0');
                const bNum = parseInt(b.id.split('-')[1] || '0');
                return aNum - bNum;
            });
    } catch (error) {
        console.error('Error fetching discs:', error);
        return [];
    }
}

// Get all songs as a flat array (for compatibility)
export async function getAllSongs(): Promise<Song[]> {
    try {
        const discs = await getAllDiscs();
        const songs: Song[] = [];

        discs.forEach((disc) => {
            disc.disc.forEach((song) => {
                songs.push({
                    ...song,
                    id: `${disc.id}-${song.side === 'A Side' ? 'a' : 'b'}`,
                });
            });
        });

        return songs.sort((a, b) => a.select.selection - b.select.selection);
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

// Save a disc (both A and B sides)
export async function saveDisc(disc: Disc & { id?: string }): Promise<void> {
    try {
        let discId = disc.id;

        // If no ID provided, create a new disc with next number
        if (!discId) {
            const nextNum = await getNextDiscNumber();
            discId = `disc-${nextNum}`;
        }

        const discRef = doc(db, JUKEBOX_COLLECTION, discId);
        const { id, ...discData } = disc;

        // Ensure both sides are present
        if (!discData.disc || discData.disc.length === 0) {
            throw new Error('Disc must have at least one side');
        }

        await setDoc(discRef, discData);
    } catch (error) {
        console.error('Error saving disc:', error);
        throw error;
    }
}

// Delete a disc
export async function deleteDisc(discId: string): Promise<void> {
    try {
        const discRef = doc(db, JUKEBOX_COLLECTION, discId);
        await deleteDoc(discRef);
    } catch (error) {
        console.error('Error deleting disc:', error);
        throw error;
    }
}

// Legacy function - saves a single song by finding/creating its disc
export async function saveSong(song: Song): Promise<void> {
    try {
        // Find if this song belongs to an existing disc
        const discs = await getAllDiscs();
        let targetDisc = discs.find(d =>
            d.disc.some(s => s.albumArt && s.albumArt === song.albumArt)
        );

        if (targetDisc) {
            // Update existing disc
            const updatedSongs = targetDisc.disc.map(s =>
                s.side === song.side && s.artist === song.artist ? song : s
            );

            // If song doesn't exist in disc, add it
            if (!updatedSongs.some(s => s.side === song.side && s.artist === song.artist)) {
                updatedSongs.push(song);
            }

            await saveDisc({
                id: targetDisc.id,
                disc: updatedSongs
            });
        } else {
            // Create new disc with this song
            const nextNum = await getNextDiscNumber();
            await saveDisc({
                id: `disc-${nextNum}`,
                disc: [song]
            });
        }
    } catch (error) {
        console.error('Error saving song:', error);
        throw error;
    }
}

// Legacy function - deletes a song by removing it from its disc
export async function deleteSong(songId: string): Promise<void> {
    try {
        // Extract disc ID from song ID (format: "disc-1-a" or "disc-1-b")
        const parts = songId.split('-');
        if (parts.length >= 2) {
            const discId = `${parts[0]}-${parts[1]}`;
            const side = parts[2] === 'a' ? 'A Side' : 'B Side';

            const discs = await getAllDiscs();
            const targetDisc = discs.find(d => d.id === discId);

            if (targetDisc) {
                const remainingSongs = targetDisc.disc.filter(s => s.side !== side);

                if (remainingSongs.length === 0) {
                    // If no songs left, delete the disc
                    await deleteDisc(discId);
                } else {
                    // Otherwise update the disc
                    await saveDisc({
                        id: discId,
                        disc: remainingSongs
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error deleting song:', error);
        throw error;
    }
}

// Toggle favorite status for a song
export async function toggleFavorite(songId: string, currentFavorite: boolean = false): Promise<void> {
    try {
        // Extract disc ID from song ID (format: "disc-1-a" or "disc-1-b")
        const parts = songId.split('-');
        if (parts.length >= 2) {
            const discId = `${parts[0]}-${parts[1]}`;
            const side = parts[2] === 'a' ? 'A Side' : 'B Side';

            const discs = await getAllDiscs();
            const targetDisc = discs.find(d => d.id === discId);

            if (targetDisc) {
                const updatedSongs = targetDisc.disc.map(s =>
                    s.side === side
                        ? { ...s, favorite: !currentFavorite }
                        : s
                );

                await saveDisc({
                    id: discId,
                    disc: updatedSongs
                });
            }
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
    }
}
