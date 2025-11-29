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
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Memoize purchased courses set for faster lookups
  const purchasedCoursesSet = useMemo(() => new Set(purchasedCourses), [purchasedCourses]);

  // Filter courses by category
  const courses = useMemo(() => {
    if (selectedCategory === 'All') {
      return allCourses;
    }
    return allCourses.filter(course => course.category === selectedCategory);
  }, [allCourses, selectedCategory]);

  // Set client flag after mount to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load all courses and categories on mount
  useEffect(() => {
    if (!isClient) return;

    async function loadAllData() {
      try {
        // Try to load from cache first
        const cachedCourses = sessionStorage.getItem('courses_cache');
        const cachedCategories = sessionStorage.getItem('categories_cache');
        const cacheTimestamp = sessionStorage.getItem('courses_cache_timestamp');
        
        // Use cache if it exists and is less than 15 minutes old
        if (cachedCourses && cachedCategories && cacheTimestamp) {
          const age = Date.now() - parseInt(cacheTimestamp, 10);
          if (age < 15 * 60 * 1000) { // 15 minutes
            const coursesData = JSON.parse(cachedCourses);
            const categoriesData = JSON.parse(cachedCategories);
            setAllCourses(coursesData);
            setCategories(categoriesData);
            setLoading(false);
            
            // Fetch fresh data in background to update cache
            fetchAllData().catch(() => {
              // Silently fail background fetch
            });
            return;
          }
        }

        // No cache or stale cache, fetch fresh data
        await fetchAllData();
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load courses. Please try again later.');
        setLoading(false);
        
        // Try to use stale cache if available
        try {
          const cachedCourses = sessionStorage.getItem('courses_cache');
          const cachedCategories = sessionStorage.getItem('categories_cache');
          if (cachedCourses && cachedCategories) {
            setAllCourses(JSON.parse(cachedCourses));
            setCategories(JSON.parse(cachedCategories));
            setLoading(false);
          }
        } catch (e) {
          // Ignore cache errors
        }
      }
    }

    loadAllData();
  }, [isClient]);

  // Fetch all courses and categories
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all courses and categories in parallel
      const [coursesData, categoriesData] = await Promise.all([
        getAllCourses(),
        getAllCategories()
      ]);
      
      setAllCourses(coursesData);
      const categoriesList = ['All', ...categoriesData];
      setCategories(categoriesList);
      setLoading(false);
      
      // Cache courses and categories in sessionStorage
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('courses_cache', JSON.stringify(coursesData));
          sessionStorage.setItem('categories_cache', JSON.stringify(categoriesList));
          sessionStorage.setItem('courses_cache_timestamp', Date.now().toString());
        } catch (e) {
          console.warn('Failed to cache data', e);
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load courses. Please try again later.');
      setLoading(false);
    }
  };

  // Memoize the course selection handler
  const handleCourseSelect = useCallback((course: Course) => {
    onCourseSelect(course);
  }, [onCourseSelect]);

  // Memoize sorted courses for better performance
  const sortedCourses = useMemo(() => {
    return [...courses].sort((a, b) => {
      // Sort by level: Advanced first, then Beginner, then Intermediate
      const levelOrder: Record<string, number> = {
        'Advanced': 0,
        'Beginner': 1,
        'Intermediate': 2,
      };
      const levelA = levelOrder[a.level] ?? 999;
      const levelB = levelOrder[b.level] ?? 999;
      return levelA - levelB;
    });
  }, [courses]);

  if (loading && allCourses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="mb-6">Explore Our Courses</h2>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
          {error && (
            <div className="mt-4">
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  window.location.reload();
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Retry
              </button>
            </div>
          )}
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

      {sortedCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCourses.map(course => (
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

