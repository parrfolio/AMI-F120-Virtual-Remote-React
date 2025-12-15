const LASTFM_API_KEY = '23a56749d2c253f91d4b30b8d568983a';
const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';

interface LastFmAlbumInfo {
    album?: {
        image?: Array<{
            '#text': string;
            size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega';
        }>;
    };
}

interface LastFmTrackInfo {
    track?: {
        name: string;
        duration: string; // Duration in milliseconds
        artist: {
            name: string;
        };
    };
    error?: number;
    message?: string;
}

export async function getAlbumArt(artist: string, album?: string): Promise<string | null> {
    try {
        const params = new URLSearchParams({
            method: album ? 'album.getinfo' : 'artist.getinfo',
            api_key: LASTFM_API_KEY,
            artist: artist,
            format: 'json',
            autocorrect: '1',
        });

        if (album) {
            params.append('album', album);
        }

        const response = await fetch(`${LASTFM_API_URL}?${params}`);
        if (!response.ok) return null;

        const data: LastFmAlbumInfo = await response.json();

        // Get the largest available image
        const images = data.album?.image || [];
        const largeImage = images.find(img => img.size === 'extralarge' || img.size === 'mega');
        const fallbackImage = images.find(img => img.size === 'large');

        const imageUrl = largeImage?.['#text'] || fallbackImage?.['#text'] || images[images.length - 1]?.['#text'];

        return imageUrl || null;
    } catch (error) {
        console.error('Error fetching album art from Last.fm:', error);
        return null;
    }
}

/**
 * Get track duration from Last.fm
 * @param artist - Artist name
 * @param track - Track title
 * @returns Duration in seconds, or null if not found
 */
export async function getTrackDuration(
    artist: string,
    track: string
): Promise<number | null> {
    try {
        const params = new URLSearchParams({
            method: 'track.getInfo',
            api_key: LASTFM_API_KEY,
            artist: artist,
            track: track,
            format: 'json',
            autocorrect: '1',
        });

        const url = `${LASTFM_API_URL}?${params.toString()}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AMI-F120-Jukebox/1.0',
            },
        });

        if (!response.ok) {
            console.warn(`Last.fm API error: ${response.statusText}`);
            return null;
        }

        const data: LastFmTrackInfo = await response.json();

        if (data.error) {
            console.warn(`Last.fm error: ${data.message}`);
            return null;
        }

        if (data.track && data.track.duration) {
            // Last.fm returns duration in milliseconds, convert to seconds
            const durationMs = parseInt(data.track.duration, 10);
            if (!isNaN(durationMs) && durationMs > 0) {
                return Math.round(durationMs / 1000);
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching track duration from Last.fm:', error);
        return null;
    }
}

/**
 * Convert seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Parse MM:SS format to seconds
 */
export function parseDuration(duration: string): number {
    const parts = duration.split(':');
    if (parts.length !== 2) {
        return 0;
    }

    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);

    if (isNaN(minutes) || isNaN(seconds)) {
        return 0;
    }

    return minutes * 60 + seconds;
}
