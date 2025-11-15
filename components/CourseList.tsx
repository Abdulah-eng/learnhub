'use client';

import { useState, useEffect } from 'react';
import { Course } from '@/lib/types';
import { CourseCard } from './CourseCard';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { getAllCourses, getCoursesByCategory, getAllCategories } from '@/lib/supabase/courses';

interface CourseListProps {
  onCourseSelect: (course: Course) => void;
  purchasedCourses: string[];
}

export function CourseList({ onCourseSelect, purchasedCourses }: CourseListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [coursesData, categoriesData] = await Promise.all([
          getAllCourses(),
          getAllCategories()
        ]);
        setCourses(coursesData);
        setCategories(['All', ...categoriesData]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchCoursesByCategory() {
      if (selectedCategory === 'All') {
        try {
          const coursesData = await getAllCourses();
          setCourses(coursesData);
        } catch (err) {
          console.error('Error fetching courses:', err);
          setError('Failed to load courses. Please try again later.');
        }
      } else {
        try {
          setLoading(true);
          const coursesData = await getCoursesByCategory(selectedCategory);
          setCourses(coursesData);
        } catch (err) {
          console.error('Error fetching courses by category:', err);
          setError('Failed to load courses. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    }
    fetchCoursesByCategory();
  }, [selectedCategory]);

  if (loading && courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="mb-6">Explore Our Courses</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="mb-6">Explore Our Courses</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

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

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={() => onCourseSelect(course)}
              isPurchased={purchasedCourses.includes(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

