/**
 * Tracks which appointments already have a finance entry created.
 * Prevents duplication between manual payment confirmation and useAutoClose.
 */
const KEY = 'bloom_finance_processed';

export function isFinanceProcessed(appointmentId: string): boolean {
  try {
    const data: string[] = JSON.parse(sessionStorage.getItem(KEY) || '[]');
    return data.includes(appointmentId);
  } catch {
    return false;
  }
}

export function markFinanceProcessed(appointmentId: string): void {
  try {
    const data: string[] = JSON.parse(sessionStorage.getItem(KEY) || '[]');
    if (!data.includes(appointmentId)) {
      data.push(appointmentId);
      // Keep max 500 entries to avoid bloat
      if (data.length > 500) data.splice(0, data.length - 500);
      sessionStorage.setItem(KEY, JSON.stringify(data));
    }
  } catch {
    // Silent fail - worst case a duplicate entry is created
  }
}
