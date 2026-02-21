-- Remove partnership references from appointments and clients first
UPDATE appointments SET partnership_id = NULL, partnership_name = NULL, partnership_discount = NULL, is_partnership = false WHERE is_partnership = true;
UPDATE clients SET partnership_id = NULL WHERE partnership_id IS NOT NULL;
UPDATE appointments SET package_id = NULL WHERE package_id IS NOT NULL;

-- Now delete all data from the requested tables
DELETE FROM finances;
DELETE FROM packages;
DELETE FROM stock;
DELETE FROM suppliers;
DELETE FROM partnerships;