-- Migration: add finance_created flag to appointments
-- Purpose: prevent duplicate finance entries when page refreshes clear sessionStorage
-- Replaces: in-memory financeTracker.ts sessionStorage approach

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS finance_created boolean DEFAULT false;

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_appointments_finance_created
  ON appointments (owner_id, finance_created)
  WHERE finance_created = true;
