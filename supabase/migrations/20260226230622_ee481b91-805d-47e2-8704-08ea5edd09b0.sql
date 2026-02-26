-- Fix time column: extract only start time from "16:00 às 16:40" format
UPDATE appointments 
SET time = SPLIT_PART(time, ' às ', 1)
WHERE time LIKE '%às%';