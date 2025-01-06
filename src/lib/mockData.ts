// Mock conference halls data
export const mockHalls = [
  {
    id: '1',
    name: 'Grand Ballroom',
    capacity: 500,
    hourly_rate: 1000,
    description: 'Luxurious ballroom with crystal chandeliers and state-of-the-art sound system',
    amenities: ['Projector', 'Sound System', 'Stage', 'Dance Floor', 'Catering Kitchen']
  },
  {
    id: '2',
    name: 'Executive Suite',
    capacity: 50,
    hourly_rate: 200,
    description: 'Intimate meeting space with modern amenities and city views',
    amenities: ['TV Screen', 'Video Conference', 'Whiteboard', 'Coffee Machine']
  },
  {
    id: '3',
    name: 'Innovation Hub',
    capacity: 100,
    hourly_rate: 350,
    description: 'Modern space perfect for workshops and presentations',
    amenities: ['Interactive Displays', 'Breakout Rooms', 'High-speed WiFi', 'Recording Equipment']
  }
];

// Mock bookings data
export const mockBookings = new Map();
