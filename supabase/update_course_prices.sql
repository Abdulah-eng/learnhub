-- ============================================
-- UPDATE COURSE PRICES
-- ============================================
-- Run this file in Supabase SQL Editor
-- This updates all course prices to the new values
-- ============================================

-- Update course prices
UPDATE courses
SET price = 1499.00
WHERE title = 'Complete Web Development Bootcamp';

UPDATE courses
SET price = 1899.00
WHERE title = 'Data Science & Machine Learning';

UPDATE courses
SET price = 2099.00
WHERE title = 'UI/UX Design Masterclass';

UPDATE courses
SET price = 2599.00
WHERE title = 'Digital Marketing Complete Course';

UPDATE courses
SET price = 1799.00
WHERE title = 'Advanced React & TypeScript';

UPDATE courses
SET price = 1599.00
WHERE title = 'Mobile App Development with React Native';

