-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  duration VARCHAR(50) NOT NULL,
  level VARCHAR(50) NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  students INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating DESC);

-- Insert default categories
INSERT INTO categories (name, slug) VALUES
  ('Development', 'development'),
  ('Data Science', 'data-science'),
  ('Design', 'design'),
  ('Marketing', 'marketing')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Complete Web Development Bootcamp',
  'Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a full-stack developer.',
  'Sarah Johnson',
  89.99,
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
  '40 hours',
  'Beginner',
  12500,
  4.8,
  (SELECT id FROM categories WHERE slug = 'development' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Complete Web Development Bootcamp');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Data Science & Machine Learning',
  'Master Python, NumPy, Pandas, Scikit-Learn, and TensorFlow. Build ML models and analyze data like a pro.',
  'Dr. Michael Chen',
  99.99,
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  '50 hours',
  'Intermediate',
  8900,
  4.9,
  (SELECT id FROM categories WHERE slug = 'data-science' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Data Science & Machine Learning');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'UI/UX Design Masterclass',
  'Learn user interface and user experience design. Master Figma, create stunning designs, and build your portfolio.',
  'Emma Rodriguez',
  79.99,
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
  '30 hours',
  'Beginner',
  15200,
  4.7,
  (SELECT id FROM categories WHERE slug = 'design' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'UI/UX Design Masterclass');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Digital Marketing Complete Course',
  'Master SEO, social media marketing, email marketing, and paid advertising. Grow your business online.',
  'James Wilson',
  69.99,
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  '25 hours',
  'Beginner',
  9800,
  4.6,
  (SELECT id FROM categories WHERE slug = 'marketing' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Digital Marketing Complete Course');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Advanced React & TypeScript',
  'Take your React skills to the next level. Learn TypeScript, advanced patterns, testing, and performance optimization.',
  'David Kim',
  94.99,
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  '35 hours',
  'Advanced',
  6700,
  4.9,
  (SELECT id FROM categories WHERE slug = 'development' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Advanced React & TypeScript');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Mobile App Development with React Native',
  'Build iOS and Android apps with React Native. Learn navigation, state management, and publish to app stores.',
  'Lisa Anderson',
  84.99,
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
  '45 hours',
  'Intermediate',
  7300,
  4.7,
  (SELECT id FROM categories WHERE slug = 'development' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Mobile App Development with React Native');

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access on categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on courses" ON courses
  FOR SELECT USING (true);

