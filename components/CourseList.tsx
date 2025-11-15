'use client';

import { useState } from 'react';
import { Course, MOCK_COURSES } from '@/lib/types';
import { CourseCard } from './CourseCard';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

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

