// Firebase/Auth Types
export interface User {
    firstName: string;
    lastName: string;
    email: string;
    admin: boolean;
    uid: string;
    avatar: string;
}

export interface AuthState {
    authed: boolean;
    loading: boolean;
    user: User;
}

// Jukebox Data Types
export interface SongSelection {
    state: 'on' | 'off';
    selection: number;
    ptrains: [number, number];
    ptrainDelay: number;
}

export interface Song {
    id?: string;
    songTitle: string;
    side: 'A Side' | 'B Side';
    artist: string;
    albumCover?: string;
    albumArt?: string; // Discogs image URL - overrides Last.fm lookup
    select: SongSelection;
    favorite?: boolean;
}

export interface Disc {
    disc: Song[];
}

export type JukeboxData = Disc[];

// Animation/Lights Types
export interface LightStrip {
    name: string;
    delay: number;
    start: number;
    stop: number;
    brightness: number;
    channelSet: number;
}

export interface AnimationTheme {
    [key: string]: LightStrip[];
}

export interface AnimationData {
    themes: AnimationTheme;
}

export interface LightsState {
    running: boolean;
    animation: string;
    active: number | null;
}

// Socket.io Event Types
export interface SocketLightsData {
    state: 'on' | 'off';
    animation: string;
    stripConf: LightStrip[];
}

export interface SocketLightsResponse {
    running: boolean;
}

export interface SocketDirectionResponse {
    done: boolean;
}

// Location State Types (for react-router)
export interface LocationState {
    lights: LightsState;
}
