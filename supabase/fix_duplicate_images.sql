-- ============================================
-- FIX DUPLICATE COURSE IMAGES
-- ============================================
-- This script updates course images to ensure each course has a unique image
-- Run this in Supabase SQL Editor
-- ============================================

-- Update images using Unsplash Source API with unique seeds based on course title
-- This ensures each course gets a unique but relevant image

UPDATE courses 
SET image_url = 'https://source.unsplash.com/1080x720/?technology,artificial-intelligence&sig=' || id
WHERE title LIKE '%Generative AI%' OR title LIKE '%GenAI%' OR title LIKE '%AI%';

UPDATE courses 
SET image_url = 'https://source.unsplash.com/1080x720/?cloud,server&sig=' || id
WHERE title LIKE '%Cloud%' OR title LIKE '%DevOps%' OR title LIKE '%Kubernetes%' OR title LIKE '%Docker%';

UPDATE courses 
SET image_url = 'https://source.unsplash.com/1080x720/?data,analytics&sig=' || id
WHERE title LIKE '%Data%' OR title LIKE '%MLOps%' OR title LIKE '%Big Data%';

UPDATE courses 
SET image_url = 'https://source.unsplash.com/1080x720/?programming,code&sig=' || id
WHERE title LIKE '%Software%' OR title LIKE '%Engineering%' OR title LIKE '%Development%';

UPDATE courses 
SET image_url = 'https://source.unsplash.com/1080x720/?network,security&sig=' || id
WHERE title LIKE '%Security%' OR title LIKE '%Network%' OR title LIKE '%Infrastructure%';

UPDATE courses 
SET image_url = 'https://source.unsplash.com/1080x720/?quantum,physics&sig=' || id
WHERE title LIKE '%Quantum%';

UPDATE courses 
SET image_url = 'https://source.unsplash.com/1080x720/?innovation,technology&sig=' || id
WHERE image_url NOT LIKE '%sig=%';

-- Alternative: Use Picsum with unique IDs
-- UPDATE courses 
-- SET image_url = 'https://picsum.photos/seed/' || id || '/1080/720'
-- WHERE image_url IS NOT NULL;

