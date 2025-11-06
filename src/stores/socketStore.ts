import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface SocketStore {
    socket: Socket | null;
    connected: boolean;
    setSocket: (socket: Socket) => void;
    setConnected: (connected: boolean) => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
    socket: null,
    connected: false,

    setSocket: (socket) => set({ socket }),

    setConnected: (connected) => set({ connected }),
}));
