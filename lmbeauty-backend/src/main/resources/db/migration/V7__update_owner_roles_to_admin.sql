-- Migration to update OWNER roles to ADMIN
-- This removes the OWNER role and converts all OWNER users to ADMIN

UPDATE users SET role = 'ADMIN' WHERE role = 'OWNER';