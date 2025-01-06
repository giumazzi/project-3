import React, { useState } from 'react';
import { Clock, Calendar, DollarSign } from 'lucide-react';
import { api } from '../lib/api';

interface ConferenceHall {
  id: string;
  name: string;
  hourly_rate: number;
}

interface BookingFormProps {
  hall: ConferenceHall;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingForm({ hall, userId, onClose, onSuccess }: BookingFormProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateTotalCost = () => {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours * hall.hourly_rate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await api.bookings.create({
        hall_id: hall.id,
        user_id: userId,
        start_time: startTime,
        end_time: endTime,
        total_cost: calculateTotalCost(),
        status: 'pending'
      });

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6">Book {hall.name}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Time
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="pl-10 w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="pl-10 w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>

          {startTime && endTime && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Cost:</span>
                <div className="flex items-center">
                  <DollarSign size={20} className="text-green-600" />
                  <span className="text-xl font-bold text-green-600">
                    ${calculateTotalCost().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
