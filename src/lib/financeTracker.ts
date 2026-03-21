/**
 * Tracks which appointments already have a finance entry created.
 * Prevents duplication between manual payment confirmation and useAutoClose.
 *
 * Two-layer approach:
 * - Layer 1: sessionStorage (fast, in-memory check — survives navigation)
 * - Layer 2: DB field finance_created=true on appointments (survives refresh/reload)
 *
 * The DB layer is the source of truth. sessionStorage is a performance cache.
 */
import { supabase } from '@/integrations/supabase/client';

const KEY = 'bloom_finance_processed';

function getSessionSet(): Set<string> {
  try {
    const data: string[] = JSON.parse(sessionStorage.getItem(KEY) || '[]');
    return new Set(data);
  } catch {
    return new Set();
  }
}

function saveSessionSet(set: Set<string>): void {
  try {
    const arr = Array.from(set).slice(-500);
    sessionStorage.setItem(KEY, JSON.stringify(arr));
  } catch {
    // silent
  }
}

/** Check if finance entry was already created for this appointment (session cache) */
export function isFinanceProcessed(appointmentId: string): boolean {
  return getSessionSet().has(appointmentId);
}

/**
 * Mark appointment as finance-processed.
 * - Updates sessionStorage immediately (sync)
 * - Updates DB field finance_created=true (async, fire-and-forget)
 */
export function markFinanceProcessed(appointmentId: string): void {
  // Layer 1: session cache
  const set = getSessionSet();
  set.add(appointmentId);
  saveSessionSet(set);

  // Layer 2: persist to DB (async, no await — non-blocking)
  supabase
    .from('appointments')
    .update({ finance_created: true } as any)
    .eq('id', appointmentId)
    .then(({ error }) => {
      if (error) console.warn('financeTracker: failed to persist to DB', error);
    });
}

/**
 * Seed sessionStorage from DB-loaded appointments.
 * Call this on app load so sessionStorage reflects DB state after a refresh.
 */
export function seedFinanceTrackerFromAppointments(appointments: { id: string; financeCreated?: boolean }[]): void {
  const set = getSessionSet();
  let changed = false;
  for (const a of appointments) {
    if (a.financeCreated && !set.has(a.id)) {
      set.add(a.id);
      changed = true;
    }
  }
  if (changed) saveSessionSet(set);
}
