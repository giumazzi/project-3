import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { api } from '../lib/api';

interface ConferenceHall {
  id: string;
  name: string;
  capacity: number;
  hourly_rate: number;
  description: string;
  amenities: string[];
}

interface Props {
  onSelect: (hall: ConferenceHall) => void;
}

export function ConferenceHallList({ onSelect }: Props) {
  const [halls, setHalls] = useState<ConferenceHall[]>([]);

  useEffect(() => {
    const fetchHalls = async () => {
      const { data, error } = await api.halls.list();
      if (error) console.error('Error fetching halls:', error);
      if (data) setHalls(data);
    };

    fetchHalls();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {halls.map((hall) => (
        <div key={hall.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <h3 className="text-2xl font-bold text-white">{hall.name}</h3>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <p className="text-gray-600">Capacity: {hall.capacity} people</p>
              <p className="text-gray-600">Rate: ${hall.hourly_rate}/hour</p>
            </div>
            
            <p className="text-gray-700 mb-4">{hall.description}</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Amenities:</h4>
              <div className="flex flex-wrap gap-2">
                {hall.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => onSelect(hall)}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Calendar size={20} />
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
