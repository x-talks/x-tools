-- Fix person.role_id to be NOT NULL to ensure cascade deletes work
-- First, delete any orphaned person records with NULL role_id
DELETE FROM person WHERE role_id IS NULL;

-- Then alter the column to be NOT NULL
ALTER TABLE person ALTER COLUMN role_id SET NOT NULL;
