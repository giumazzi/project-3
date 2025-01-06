/*
  # Conference Hall Booking Schema

  1. New Tables
    - `conference_halls`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the conference hall
      - `capacity` (integer) - Maximum capacity
      - `hourly_rate` (decimal) - Cost per hour
      - `description` (text) - Detailed description
      - `amenities` (text[]) - Array of available amenities
      - `created_at` (timestamp)

    - `bookings`
      - `id` (uuid, primary key)
      - `hall_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `total_cost` (decimal)
      - `status` (text) - 'pending', 'confirmed', 'cancelled'
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can view all halls but only their own bookings
    - Only authenticated users can create bookings
*/

-- Create conference halls table
CREATE TABLE conference_halls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity integer NOT NULL,
  hourly_rate decimal NOT NULL,
  description text NOT NULL,
  amenities text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_id uuid REFERENCES conference_halls(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  total_cost decimal NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Enable RLS
ALTER TABLE conference_halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for conference halls
CREATE POLICY "Anyone can view conference halls"
  ON conference_halls
  FOR SELECT
  TO public
  USING (true);

-- Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample conference halls
INSERT INTO conference_halls (name, capacity, hourly_rate, description, amenities)
VALUES
  ('Grand Ballroom', 500, 1000, 'Luxurious ballroom with crystal chandeliers and state-of-the-art sound system', 
   ARRAY['Projector', 'Sound System', 'Stage', 'Dance Floor', 'Catering Kitchen']),
  ('Executive Suite', 50, 200, 'Intimate meeting space with modern amenities and city views',
   ARRAY['TV Screen', 'Video Conference', 'Whiteboard', 'Coffee Machine']),
  ('Innovation Hub', 100, 350, 'Modern space perfect for workshops and presentations',
   ARRAY['Interactive Displays', 'Breakout Rooms', 'High-speed WiFi', 'Recording Equipment']);
