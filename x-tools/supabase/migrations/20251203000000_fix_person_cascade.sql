-- Fix person table foreign key to cascade delete when role is deleted
ALTER TABLE person
DROP CONSTRAINT IF EXISTS person_role_id_fkey;

ALTER TABLE person
ADD CONSTRAINT person_role_id_fkey
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE CASCADE;
