/*
  # Mariam Lead Generation Database Schema

  1. New Tables
    - `generation_sessions`
      - `id` (uuid, primary key) - Unique session identifier
      - `location` (text) - Target location for leads
      - `industry` (text) - Target industry/sector
      - `daily_target` (integer) - Total leads target (default 300)
      - `batch_size` (integer) - Leads per batch (default 50)
      - `current_count` (integer) - Current number of leads generated
      - `status` (text) - Session status: active, paused, completed
      - `created_at` (timestamptz) - Session creation time
      - `updated_at` (timestamptz) - Last update time
    
    - `leads`
      - `id` (uuid, primary key) - Unique lead identifier
      - `session_id` (uuid, foreign key) - Reference to generation session
      - `business_name` (text) - Name of the business
      - `phone_contact` (text) - Phone number
      - `location` (text) - Lead location
      - `industry` (text) - Lead industry/sector
      - `batch_number` (integer) - Batch this lead belongs to
      - `is_downloaded` (boolean) - Whether lead was downloaded
      - `created_at` (timestamptz) - Lead creation time
    
    - `batch_downloads`
      - `id` (uuid, primary key) - Unique download identifier
      - `session_id` (uuid, foreign key) - Reference to generation session
      - `batch_number` (integer) - Batch number downloaded
      - `lead_count` (integer) - Number of leads in download
      - `downloaded_at` (timestamptz) - Download timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (no auth required for this app)
    
  3. Indexes
    - Index on session_id for faster lead queries
    - Index on business_name and phone_contact for deduplication
    - Index on location and industry for filtering
*/

-- Create generation_sessions table
CREATE TABLE IF NOT EXISTS generation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  industry text NOT NULL,
  daily_target integer DEFAULT 300,
  batch_size integer DEFAULT 50,
  current_count integer DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES generation_sessions(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  phone_contact text NOT NULL,
  location text NOT NULL,
  industry text NOT NULL,
  batch_number integer NOT NULL,
  is_downloaded boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create batch_downloads table
CREATE TABLE IF NOT EXISTS batch_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES generation_sessions(id) ON DELETE CASCADE,
  batch_number integer NOT NULL,
  lead_count integer NOT NULL,
  downloaded_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_session_id ON leads(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_business_phone ON leads(business_name, phone_contact);
CREATE INDEX IF NOT EXISTS idx_leads_location_industry ON leads(location, industry);
CREATE INDEX IF NOT EXISTS idx_batch_downloads_session ON batch_downloads(session_id);

-- Enable Row Level Security
ALTER TABLE generation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_downloads ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Allow public read access to generation_sessions"
  ON generation_sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to generation_sessions"
  ON generation_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to generation_sessions"
  ON generation_sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to leads"
  ON leads FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to leads"
  ON leads FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to batch_downloads"
  ON batch_downloads FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to batch_downloads"
  ON batch_downloads FOR INSERT
  TO anon
  WITH CHECK (true);