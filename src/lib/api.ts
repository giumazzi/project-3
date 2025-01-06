import { storage } from './storage';
import { supabase } from './supabase';

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL;

export const api = {
  auth: {
    signUp: async (email: string, password: string) => {
      return USE_MOCK
        ? storage.auth.signUp(email, password)
        : supabase.auth.signUp({ email, password });
    },
    signIn: async (email: string, password: string) => {
      return USE_MOCK
        ? storage.auth.signIn(email, password)
        : supabase.auth.signInWithPassword({ email, password });
    },
    signOut: async () => {
      return USE_MOCK
        ? storage.auth.signOut()
        : supabase.auth.signOut();
    },
    getUser: () => {
      return USE_MOCK
        ? storage.auth.getUser()
        : supabase.auth.getUser();
    }
  },

  halls: {
    list: async () => {
      return USE_MOCK
        ? storage.halls.list()
        : supabase.from('conference_halls').select('*').order('hourly_rate');
    }
  },

  bookings: {
    create: async (booking: any) => {
      return USE_MOCK
        ? storage.bookings.create(booking)
        : supabase.from('bookings').insert(booking);
    },
    list: async (userId: string) => {
      return USE_MOCK
        ? storage.bookings.list(userId)
        : supabase
            .from('bookings')
            .select(`*, conference_halls (name)`)
            .eq('user_id', userId)
            .order('start_time', { ascending: false });
    }
  }
};
