-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL CHECK (payment_method IN ('Bkash', 'Nagad', 'BankAccount', 'Cash')),
  transaction_id text NOT NULL UNIQUE,
  email text,
  phone text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX idx_donations_payment_method ON donations(payment_method);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for donations)
CREATE POLICY "Anyone can create donations" ON donations
  FOR INSERT
  WITH CHECK (true);

-- Allow admins to view all donations
CREATE POLICY "Admins can view all donations" ON donations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Allow users to view their own donations (if email matches)
CREATE POLICY "Users can view their own donations" ON donations
  FOR SELECT
  USING (email = auth.jwt()->>'email');

-- Allow admins to update donation status
CREATE POLICY "Admins can update donations" ON donations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );
