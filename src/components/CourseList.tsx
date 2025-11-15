import { useState } from 'react';
import { Course } from '../App';
import { CourseCard } from './CourseCard';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a full-stack developer.',
    instructor: 'Sarah Johnson',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    duration: '40 hours',
    level: 'Beginner',
    students: 12500,
    rating: 4.8,
    category: 'Development'
  },
  {
    id: '2',
    title: 'Data Science & Machine Learning',
    description: 'Master Python, NumPy, Pandas, Scikit-Learn, and TensorFlow. Build ML models and analyze data like a pro.',
    instructor: 'Dr. Michael Chen',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    duration: '50 hours',
    level: 'Intermediate',
    students: 8900,
    rating: 4.9,
    category: 'Data Science'
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    description: 'Learn user interface and user experience design. Master Figma, create stunning designs, and build your portfolio.',
    instructor: 'Emma Rodriguez',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    duration: '30 hours',
    level: 'Beginner',
    students: 15200,
    rating: 4.7,
    category: 'Design'
  },
  {
    id: '4',
    title: 'Digital Marketing Complete Course',
    description: 'Master SEO, social media marketing, email marketing, and paid advertising. Grow your business online.',
    instructor: 'James Wilson',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    duration: '25 hours',
    level: 'Beginner',
    students: 9800,
    rating: 4.6,
    category: 'Marketing'
  },
  {
    id: '5',
    title: 'Advanced React & TypeScript',
    description: 'Take your React skills to the next level. Learn TypeScript, advanced patterns, testing, and performance optimization.',
    instructor: 'David Kim',
    price: 94.99,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    duration: '35 hours',
    level: 'Advanced',
    students: 6700,
    rating: 4.9,
    category: 'Development'
  },
  {
    id: '6',
    title: 'Mobile App Development with React Native',
    description: 'Build iOS and Android apps with React Native. Learn navigation, state management, and publish to app stores.',
    instructor: 'Lisa Anderson',
    price: 84.99,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    duration: '45 hours',
    level: 'Intermediate',
    students: 7300,
    rating: 4.7,
    category: 'Development'
  }
];

interface CourseListProps {
  onCourseSelect: (course: Course) => void;
  purchasedCourses: string[];
}

export function CourseList({ onCourseSelect, purchasedCourses }: CourseListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(MOCK_COURSES.map(c => c.category)))];

  const filteredCourses = selectedCategory === 'All' 
    ? MOCK_COURSES 
    : MOCK_COURSES.filter(c => c.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="mb-6">Explore Our Courses</h2>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onSelect={() => onCourseSelect(course)}
            isPurchased={purchasedCourses.includes(course.id)}
          />
        ))}
      </div>
    </div>
  );
}
