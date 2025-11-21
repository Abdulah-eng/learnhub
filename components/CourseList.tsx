'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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

  // Memoize purchased courses set for faster lookups
  const purchasedCoursesSet = useMemo(() => new Set(purchasedCourses), [purchasedCourses]);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        setLoading(true);
        const [coursesData, categoriesData] = await Promise.all([
          getAllCourses(),
          getAllCategories()
        ]);
        
        if (isMounted) {
          setCourses(coursesData);
          setCategories(['All', ...categoriesData]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (isMounted) {
          setError('Failed to load courses. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch courses by category (optimized to avoid unnecessary fetches)
  useEffect(() => {
    let isMounted = true;
    
    async function fetchCoursesByCategory() {
      if (selectedCategory === 'All') {
        try {
          const coursesData = await getAllCourses();
          if (isMounted) {
            setCourses(coursesData);
          }
        } catch (err) {
          console.error('Error fetching courses:', err);
          if (isMounted) {
            setError('Failed to load courses. Please try again later.');
          }
        }
      } else {
        try {
          setLoading(true);
          const coursesData = await getCoursesByCategory(selectedCategory);
          if (isMounted) {
            setCourses(coursesData);
          }
        } catch (err) {
          console.error('Error fetching courses by category:', err);
          if (isMounted) {
            setError('Failed to load courses. Please try again later.');
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    }
    
    fetchCoursesByCategory();
    
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  // Memoize the course selection handler
  const handleCourseSelect = useCallback((course: Course) => {
    onCourseSelect(course);
  }, [onCourseSelect]);

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
              onSelect={() => handleCourseSelect(course)}
              isPurchased={purchasedCoursesSet.has(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

