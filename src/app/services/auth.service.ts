import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private fb = inject(FirebaseService);
    user: User | null = null;
    readonly ready: Promise<void>;

    constructor() {
        this.ready = new Promise((resolve) => {
            onAuthStateChanged(
                this.fb.auth,
                (user) => {
                    this.user = user;
                    resolve();
                },
                () => {
                    this.user = null;
                    resolve();
                }
            );
        });
    }

    async login(email: string, password: string) {
        const credential = await signInWithEmailAndPassword(this.fb.auth, email, password);
        this.user = credential.user;
        return credential;
    }

    async register(name: string, email: string, password: string) {
        const credential = await createUserWithEmailAndPassword(this.fb.auth, email, password);
        this.user = credential.user;
        await setDoc(doc(this.fb.db, 'users', credential.user.uid), {
            name,
            email,
            createdAt: serverTimestamp()
        });
        return credential;
    }

    async logout() {
        await signOut(this.fb.auth);
        this.user = null;
    }

    isLogged() {
        return !!this.user;
    }

    async adminAccessStatus(): Promise<'admin' | 'profile-missing' | 'role-missing' | 'permission-denied' | 'error'> {
        await this.ready;
        if (!this.user) return 'error';

        try {
            const profile = await getDoc(doc(this.fb.db, 'users', this.user.uid));
            if (!profile.exists()) return 'profile-missing';
            return profile.data()['role'] === 'admin' ? 'admin' : 'role-missing';
        } catch (error) {
            const code = typeof error === 'object' && error !== null && 'code' in error
                ? String(error.code)
                : '';
            return code === 'permission-denied' ? 'permission-denied' : 'error';
        }
    }
}