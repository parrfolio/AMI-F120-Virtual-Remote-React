import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';
import { User } from '@/types';

export const useAuthListener = () => {
    const { setAuth, setLoading } = useAuthStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const userRef = doc(db, 'users', firebaseUser.uid);

                const unsubscribeUser = onSnapshot(
                    userRef,
                    (doc) => {
                        if (doc.exists()) {
                            const userData = doc.data();
                            const user: User = {
                                firstName: userData.first || '',
                                lastName: userData.last || '',
                                email: userData.email || '',
                                admin: userData.admin || false,
                                uid: userData.uid || '',
                                avatar: userData.avatar || '',
                            };
                            setAuth(true, user);
                        } else {
                            setAuth(false, {
                                firstName: '',
                                lastName: '',
                                email: '',
                                admin: false,
                                uid: '',
                                avatar: '',
                            });
                        }
                    },
                    (error) => {
                        console.error('Error fetching user data:', error);
                        setLoading(false);
                    }
                );

                return () => unsubscribeUser();
            } else {
                setAuth(false, {
                    firstName: '',
                    lastName: '',
                    email: '',
                    admin: false,
                    uid: '',
                    avatar: '',
                });
            }
        });

        return () => unsubscribe();
    }, [setAuth, setLoading]);
};
