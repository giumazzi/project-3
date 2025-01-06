import React, { useState, useEffect } from 'react';
import { api } from './lib/api';
import { AuthForm } from './components/AuthForm';
import { ConferenceHallList } from './components/ConferenceHallList';
import { BookingForm } from './components/BookingForm';
import { BookingsList } from './components/BookingsList';
import { Building, LogOut } from 'lucide-react';

function App() {
  const [session, setSession] = useState(null);
  const [selectedHall, setSelectedHall] = useState(null);
  const [showBookings, setShowBookings] = useState(false);

  useEffect(() => {
    api.auth.getUser().then(({ data: { user } }) => {
      setSession(user);
    });
  }, []);

  const handleSignOut = () => {
    api.auth.signOut();
    setSession(null);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <AuthForm onSuccess={setSession} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="text-blue-500" size={24} />
              <h1 className="text-xl font-bold text-gray-900">Conference Hall Booking</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBookings(!showBookings)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                {showBookings ? 'View Halls' : 'My Bookings'}
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showBookings ? (
          <BookingsList userId={session.id} />
        ) : (
          <ConferenceHallList onSelect={setSelectedHall} />
        )}
      </main>

      {selectedHall && (
        <BookingForm
          hall={selectedHall}
          userId={session.id}
          onClose={() => setSelectedHall(null)}
          onSuccess={() => {
            setSelectedHall(null);
            setShowBookings(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
