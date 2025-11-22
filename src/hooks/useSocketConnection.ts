import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { usePlayerStore } from '@/stores/playerStore';

/**
 * Hook to initialize and manage Socket.IO connection
 * Should be called once at the app level to ensure socket is available globally
 */
export const useSocketConnection = () => {
    const { setSocket, setSocketConnected } = usePlayerStore();

    useEffect(() => {
        console.log('=== Initializing Socket.IO connection ===');

        const newSocket = io({
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✓ Socket.IO connected:', newSocket.id);
            setSocketConnected(true);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('✗ Socket.IO disconnected:', reason);
            setSocketConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error.message);
            setSocketConnected(false);
        });

        // Cleanup on unmount
        return () => {
            console.log('=== Cleaning up Socket.IO connection ===');
            newSocket.close();
            setSocket(null);
            setSocketConnected(false);
        };
    }, [setSocket, setSocketConnected]);
};
