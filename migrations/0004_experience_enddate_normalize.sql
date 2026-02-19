-- Normalize end_date values for experiences
-- so empty-string values are stored as NULL

UPDATE experiences
SET end_date = NULL
WHERE TRIM(COALESCE(end_date, '')) = '';
