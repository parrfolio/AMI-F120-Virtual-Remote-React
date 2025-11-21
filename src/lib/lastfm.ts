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
