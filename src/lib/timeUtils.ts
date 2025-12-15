/**
 * Utility functions for time formatting and conversion
 */

/**
 * Convert Discogs duration string (MM:SS) to seconds
 * @param duration - Duration string in format "MM:SS" or "M:SS"
 * @returns Duration in seconds, or 180 (3 min) as default
 */
export function durationToSeconds(duration: string | undefined): number {
    if (!duration) return 180; // Default 3 minutes

    const parts = duration.split(':');
    if (parts.length !== 2) return 180;

    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);

    if (isNaN(minutes) || isNaN(seconds)) return 180;

    return minutes * 60 + seconds;
}

/**
 * Format seconds to MM:SS display format
 * @param seconds - Total seconds
 * @returns Formatted string "MM:SS"
 */
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds to display with leading zero for minutes if needed
 * @param seconds - Total seconds
 * @returns Formatted string "M:SS" or "MM:SS"
 */
export function formatTimeCompact(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
