import React, { useEffect, useState } from 'react';
import { Clock, Calendar, DollarSign, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import { api } from '../lib/api';

interface Booking {
  id: string;
  hall_id: string;
  start_time: string;
  end_time: string;
  total_cost: number;
  status: string;
  conference_halls: {
    name: string;
  };
}

interface Props {
  userId: string;
}

export function BookingsList({ userId }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await api.bookings.list(userId);
      if (error) console.error('Error fetching bookings:', error);
      if (data) setBookings(data);
    };

    fetchBookings();
  }, [userId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-green-500" />;
      case 'cancelled':
        return <XCircle className="text-red-500" />;
      default:
        return <Clock3 className="text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
      
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No bookings found</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{booking.conference_halls.name}</h3>
              <div className="flex items-center gap-2">
                {getStatusIcon(booking.status)}
                <span className="capitalize">{booking.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400" size={20} />
                <span>
                  {new Date(booking.start_time).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="text-gray-400" size={20} />
                <span>
                  {new Date(booking.start_time).toLocaleTimeString()} - 
                  {new Date(booking.end_time).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-end">
              <div className="flex items-center gap-2">
                <DollarSign className="text-green-600" size={20} />
                <span className="text-xl font-bold text-green-600">
                  ${booking.total_cost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
