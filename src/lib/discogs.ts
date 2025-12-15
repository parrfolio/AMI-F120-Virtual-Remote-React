/**
 * Discogs API Integration
 * Fetches user's 7" vinyl collection with album art and track information
 */

const DISCOGS_API_BASE = 'https://api.discogs.com';
const CONSUMER_KEY = 'kopVwNhbQBCneuuCBfda';
const CONSUMER_SECRET = 'JfrHIDHRKFsGMbfIUHnZimJkkPLRPTnQ';

export interface DiscogsTrack {
    position: string;
    title: string;
    duration: string;
}

export interface DiscogsRelease {
    id: number;
    instance_id: number;
    basic_information: {
        id: number;
        title: string;
        year: number;
        formats: Array<{
            name: string;
            descriptions?: string[];
        }>;
        artists: Array<{
            name: string;
            id: number;
        }>;
        cover_image: string;
        thumb: string;
    };
}

export interface DiscogsReleaseDetails {
    id: number;
    title: string;
    artists: Array<{ name: string }>;
    year: number;
    images: Array<{
        type: string;
        uri: string;
        uri150: string;
        uri500: string;
    }>;
    tracklist: DiscogsTrack[];
}

/**
 * Fetch user's collection from specific 7" folder with pagination
 * Sorted by newest additions first
 * Folder ID: 1649341 (ryanparr's 7" collection)
 */
export async function getUserSevenInchCollection(
    username: string,
    page: number = 1,
    perPage: number = 20
): Promise<{ releases: DiscogsRelease[]; pagination: { page: number; pages: number; items: number } }> {
    try {
        const folderId = 1649341; // Direct 7" folder ID

        // Sort by date_added descending (newest first)
        const url = `${DISCOGS_API_BASE}/users/${username}/collection/folders/${folderId}/releases?per_page=${perPage}&page=${page}&sort=added&sort_order=desc&key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AMI-F120-Jukebox/1.0',
            },
        });

        if (!response.ok) {
            throw new Error(`Discogs API error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            releases: data.releases,
            pagination: data.pagination
        };
    } catch (error) {
        console.error('Error fetching Discogs collection:', error);
        throw error;
    }
}

/**
 * Get detailed information about a specific release including tracklist
 */
export async function getReleaseDetails(releaseId: number): Promise<DiscogsReleaseDetails> {
    try {
        const url = `${DISCOGS_API_BASE}/releases/${releaseId}?key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AMI-F120-Jukebox/1.0',
            },
        });

        if (!response.ok) {
            throw new Error(`Discogs API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching release details:', error);
        throw error;
    }
}

/**
 * Parse tracklist to get A-side and B-side tracks
 */
export function parseTracklist(tracklist: DiscogsTrack[]): { aSide: DiscogsTrack | null; bSide: DiscogsTrack | null } {
    const aSide = tracklist.find(track =>
        track.position.toUpperCase().startsWith('A') ||
        track.position === '1'
    ) || null;

    const bSide = tracklist.find(track =>
        track.position.toUpperCase().startsWith('B') ||
        track.position === '2'
    ) || null;

    return { aSide, bSide };
}

/**
 * Get the best quality image from a release
 */
export function getBestImage(release: DiscogsReleaseDetails | DiscogsRelease): string {
    if ('images' in release && release.images && release.images.length > 0) {
        // Prefer uri500, fallback to uri, then uri150
        return release.images[0].uri500 || release.images[0].uri || release.images[0].uri150;
    }

    if ('basic_information' in release) {
        return release.basic_information.cover_image;
    }

    return '';
}
