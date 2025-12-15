import { create } from 'zustand';
import { User } from '@/types';

interface AuthStore {
    authed: boolean;
    loading: boolean;
    user: User;
    setAuth: (authed: boolean, user: User) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

const initialUser: User = {
    firstName: '',
    lastName: '',
    email: '',
    admin: false,
    uid: '',
    avatar: '',
};

export const useAuthStore = create<AuthStore>((set) => ({
    authed: false,
    loading: true,
    user: initialUser,

    setAuth: (authed, user) => set({ authed, user, loading: false }),

    setLoading: (loading) => set({ loading }),

    logout: () => set({ authed: false, user: initialUser }),
}));
