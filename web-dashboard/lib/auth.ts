import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    userId: string;
    username: string;
    role: string;
    tenantId: string | null;
    branchId: string | null;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            login: (token: string, user: User) => {
                localStorage.setItem('token', token);
                set({ token, user, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem('token');
                set({ token: null, user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
