-- Add check_in_date and check_out_date fields to bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS check_in_date DATE,
ADD COLUMN IF NOT EXISTS check_out_date DATE;
