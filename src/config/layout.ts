/**
 * Global layout configuration for the app
 */

export const LAYOUT_CONFIG = {
    /**
     * Top padding for main content containers to clear the fixed header
     * Each page can have its own spacing based on header height
     */
    HEADER_CLEARANCE: {
        HOME: 'pt-[120px]',
        SONGS: 'pt-[120px]',
        LIGHTS: 'pt-[120px]',
        ABOUT: 'pt-[120px]',
        SONG_MANAGER: 'pt-[120px]',
    },

    /**
     * Bottom padding for main content containers to clear the fixed player
     * Each page can have its own spacing based on content needs
     */
    PLAYER_CLEARANCE: {
        HOME: 'pb-[310px]',
        SONGS: 'pb-[400px]', // Extra room for collapsed sections
        LIGHTS: 'pb-[240px]',
        ABOUT: 'pb-[240px]',
        SONG_MANAGER: 'pb-[280px]',
    },
} as const;
