import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch all rows from a Supabase table, bypassing the 1000-row default limit.
 * Uses pagination with .range() to retrieve data in batches.
 */
export async function fetchAllFromTable(
  table: string,
  select: string = '*',
  options?: {
    orderBy?: string;
    ascending?: boolean;
  }
): Promise<any[]> {
  const allData: any[] = [];
  let offset = 0;
  const batchSize = 1000;
  let hasMore = true;

  while (hasMore) {
    let query = (supabase.from(table as any) as any)
      .select(select)
      .range(offset, offset + batchSize - 1);

    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? true });
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data && data.length > 0) {
      allData.push(...data);
      offset += batchSize;
      hasMore = data.length === batchSize;
    } else {
      hasMore = false;
    }
  }

  return allData;
}
