import { mockHalls, mockBookings } from './mockData';

// Mock user session
let currentUser: { id: string; email: string } | null = null;

export const storage = {
  // Auth methods
  auth: {
    signUp: async (email: string, password: string) => {
      currentUser = { id: Date.now().toString(), email };
      return { user: currentUser, error: null };
    },
    signIn: async (email: string, password: string) => {
      currentUser = { id: Date.now().toString(), email };
      return { user: currentUser, error: null };
    },
    signOut: async () => {
      currentUser = null;
      return { error: null };
    },
    getUser: () => currentUser
  },

  // Conference halls methods
  halls: {
    list: async () => {
      return { data: mockHalls, error: null };
    }
  },

  // Bookings methods
  bookings: {
    create: async (booking: any) => {
      const id = Date.now().toString();
      const newBooking = {
        id,
        ...booking,
        created_at: new Date().toISOString(),
        conference_halls: mockHalls.find(h => h.id === booking.hall_id)
      };
      mockBookings.set(id, newBooking);
      return { data: newBooking, error: null };
    },
    list: async (userId: string) => {
      const userBookings = Array.from(mockBookings.values())
        .filter(booking => booking.user_id === userId);
      return { data: userBookings, error: null };
    }
  }
};
