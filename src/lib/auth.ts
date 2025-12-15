import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import {
    auth,
    db,
    googleAuthProvider,
    facebookAuthProvider,
    twitterAuthProvider,
    appleAuthProvider,
} from '@/lib/firebase';

export const createAccount = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
            first: firstName,
            last: lastName,
            email: email,
            uid: user.uid,
            providerId: 'email_user',
            admin: false,
        });

        return user;
    } catch (error: any) {
        if (error.code === 'auth/weak-password') {
            throw new Error('The password is too weak.');
        }
        throw error;
    }
};

export const loginWithEmail = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        const user = result.user;

        // Check if user document exists, if not create it
        await setDoc(
            doc(db, 'users', user.uid),
            {
                first: user.displayName?.split(' ')[0] || '',
                last: user.displayName?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                uid: user.uid,
                providerId: 'google',
                avatar: user.photoURL || '',
                admin: false,
            },
            { merge: true }
        );

        return user;
    } catch (error) {
        console.error('Google login error:', error);
        throw error;
    }
};

export const loginWithFacebook = async () => {
    try {
        const result = await signInWithPopup(auth, facebookAuthProvider);
        const user = result.user;

        await setDoc(
            doc(db, 'users', user.uid),
            {
                first: user.displayName?.split(' ')[0] || '',
                last: user.displayName?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                uid: user.uid,
                providerId: 'facebook',
                avatar: user.photoURL || '',
                admin: false,
            },
            { merge: true }
        );

        return user;
    } catch (error) {
        console.error('Facebook login error:', error);
        throw error;
    }
};

export const loginWithTwitter = async () => {
    try {
        const result = await signInWithPopup(auth, twitterAuthProvider);
        const user = result.user;

        await setDoc(
            doc(db, 'users', user.uid),
            {
                first: user.displayName?.split(' ')[0] || '',
                last: user.displayName?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                uid: user.uid,
                providerId: 'twitter',
                avatar: user.photoURL || '',
                admin: false,
            },
            { merge: true }
        );

        return user;
    } catch (error) {
        console.error('Twitter login error:', error);
        throw error;
    }
};

export const loginWithApple = async () => {
    try {
        const result = await signInWithPopup(auth, appleAuthProvider);
        const user = result.user;

        await setDoc(
            doc(db, 'users', user.uid),
            {
                first: user.displayName?.split(' ')[0] || '',
                last: user.displayName?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                uid: user.uid,
                providerId: 'apple',
                avatar: user.photoURL || '',
                admin: false,
            },
            { merge: true }
        );

        return user;
    } catch (error) {
        console.error('Apple login error:', error);
        throw error;
    }
};

export const logout = async () => {
    return await signOut(auth);
};
