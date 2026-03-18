-- Add new fields to clients table for MaiBronze spreadsheet import
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS client_since text,
  ADD COLUMN IF NOT EXISTS total_sessions integer;
