// lib/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabaseClient';

type UserRole = 'client' | 'admin' | null;

interface AuthState {
  user: { id: string; email: string; role: UserRole } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Fetch role desde profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        set({
          user: { id: data.user.id, email: data.user.email!, role: profile.role },
          isLoading: false,
        });
      },

      register: async (email: string, password: string) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // El trigger crea el profile con role 'client' automáticamente
        set({
          user: { id: data.user!.id, email: data.user!.email!, role: 'client' },
          isLoading: false,
        });
      },

      logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null, isLoading: false });
      },

      changePassword: async (oldPassword: string, newPassword: string) => {
        // Primero re-autentica si es necesario, pero Supabase updateUser maneja cambio directo si sesion activa
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      },
    }),
    {
      name: 'mgmakeup-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);