'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Course } from '@/lib/types';
import { CourseCard } from './CourseCard';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { getCoursesPaginated, getCoursesByCategoryPaginated, getAllCategories } from '@/lib/supabase/courses';
import { Button } from './ui/button';

interface CourseListProps {
  onCourseSelect: (course: Course) => void;
  purchasedCourses: string[];
}

// Configurable batch size - can be increased as needed
const COURSES_PER_PAGE = 6;

export function CourseList({ onCourseSelect, purchasedCourses }: CourseListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Memoize purchased courses set for faster lookups
  const purchasedCoursesSet = useMemo(() => new Set(purchasedCourses), [purchasedCourses]);

  // Set client flag after mount to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load from sessionStorage after client-side mount
  useEffect(() => {
    if (!isClient) return;

    try {
      const cachedCourses = sessionStorage.getItem('courses_cache');
      const cachedCategories = sessionStorage.getItem('categories_cache');
      const cacheTimestamp = sessionStorage.getItem('courses_cache_timestamp');
      
      // Use cache if it exists and is less than 10 minutes old
      if (cachedCourses && cachedCategories && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp, 10);
        if (age < 10 * 60 * 1000) { // 10 minutes
          const coursesData = JSON.parse(cachedCourses);
          const categoriesData = JSON.parse(cachedCategories);
          setCourses(coursesData);
          setCategories(categoriesData);
          setLoading(false);
          // Still fetch in background to update cache
          fetchInitialData().catch(() => {
            // Silently fail background fetch
          });
          return; // Don't wait for fresh data if we have cache
        }
      }
    } catch (e) {
      console.warn('Failed to load from cache', e);
    }

    // If no cache or cache is stale, fetch from API
    fetchInitialData();
  }, [isClient]);

  // Fetch initial data (categories and first batch of courses)
  const fetchInitialData = async () => {
    let timeoutId: NodeJS.Timeout | undefined;
    
    try {
      setLoading(true);
      setError(null);
      setCurrentOffset(0);
      
      // Add timeout to prevent hanging (30 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Request timeout. Please check your connection and try again.')), 30000);
      });
      
      const fetchPromise = Promise.all([
        getCoursesPaginated(COURSES_PER_PAGE, 0),
        getAllCategories()
      ]);
      
      const [{ courses: coursesData, hasMore: hasMoreData, total }, categoriesData] = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as [{ courses: Course[]; hasMore: boolean; total: number }, string[]];
      
      if (timeoutId) clearTimeout(timeoutId);
      
      setCourses(coursesData);
      setHasMore(hasMoreData);
      setTotalCourses(total);
      setCurrentOffset(coursesData.length);
      const categoriesList = ['All', ...categoriesData];
      setCategories(categoriesList);
      setLoading(false);
      
      // Cache courses and categories in sessionStorage
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('courses_cache', JSON.stringify(coursesData));
          sessionStorage.setItem('categories_cache', JSON.stringify(categoriesList));
          sessionStorage.setItem('courses_cache_timestamp', Date.now().toString());
          sessionStorage.setItem('categories_cache_timestamp', Date.now().toString());
        } catch (e) {
          console.warn('Failed to cache data', e);
        }
      }
    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('Error fetching data:', err);
      const errorMessage = err.message || 'Failed to load courses. Please try again later.';
      setError(errorMessage);
      setLoading(false);
      
      // Try to use stale cache if available
      try {
        const cachedCategories = sessionStorage.getItem('categories_cache');
        if (cachedCategories) {
          setCategories(JSON.parse(cachedCategories));
        }
      } catch (e) {
        // Ignore cache errors
      }
    }
  };

  // Load more courses automatically
  const loadMoreCourses = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;

    let timeoutId: NodeJS.Timeout | undefined;
    
    try {
      setLoadingMore(true);
      setError(null);
      
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Request timeout')), 30000);
      });
      
      let result;
      if (selectedCategory === 'All') {
        result = await Promise.race([
          getCoursesPaginated(COURSES_PER_PAGE, currentOffset),
          timeoutPromise
        ]) as { courses: Course[]; hasMore: boolean; total: number };
      } else {
        result = await Promise.race([
          getCoursesByCategoryPaginated(selectedCategory, COURSES_PER_PAGE, currentOffset),
          timeoutPromise
        ]) as { courses: Course[]; hasMore: boolean; total: number };
      }
      
      if (timeoutId) clearTimeout(timeoutId);
      
      setCourses(prev => [...prev, ...result.courses]);
      setHasMore(result.hasMore);
      setCurrentOffset(prev => prev + result.courses.length);
      setLoadingMore(false);
    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('Error loading more courses:', err);
      setError(err.message || 'Failed to load more courses. Please try again.');
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, loading, selectedCategory, currentOffset]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreCourses();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loading, loadMoreCourses]);

  // Fetch courses by category (only when category changes and not "All")
  useEffect(() => {
    // Skip if initial load hasn't completed or client not ready
    if (!isClient || (loading && courses.length === 0)) return;
    
    // If "All" is selected, reset to first page
    if (selectedCategory === 'All') {
      const resetAndFetch = async () => {
        setLoading(true);
        setError(null);
        setCurrentOffset(0);
        
        let timeoutId: NodeJS.Timeout | undefined;
        try {
          const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Request timeout')), 10000);
          });
          
          const fetchPromise = getCoursesPaginated(COURSES_PER_PAGE, 0);
          const { courses: coursesData, hasMore: hasMoreData, total } = await Promise.race([
            fetchPromise,
            timeoutPromise
          ]) as { courses: Course[]; hasMore: boolean; total: number };
          
          if (timeoutId) clearTimeout(timeoutId);
          setCourses(coursesData);
          setHasMore(hasMoreData);
          setTotalCourses(total);
          setCurrentOffset(coursesData.length);
          setLoading(false);
        } catch (err: any) {
          if (timeoutId) clearTimeout(timeoutId);
          console.error('Error fetching courses:', err);
          setError(err.message || 'Failed to load courses. Please try again later.');
          setLoading(false);
        }
      };
      
      resetAndFetch();
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout | undefined;
    
    async function fetchCoursesByCategory() {
      try {
        setLoading(true);
        setError(null);
        setCurrentOffset(0);
        
        // Add timeout
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Request timeout')), 10000);
        });
        
        const fetchPromise = getCoursesByCategoryPaginated(selectedCategory, COURSES_PER_PAGE, 0);
        const { courses: coursesData, hasMore: hasMoreData, total } = await Promise.race([
          fetchPromise,
          timeoutPromise
        ]) as { courses: Course[]; hasMore: boolean; total: number };
        
        if (timeoutId) clearTimeout(timeoutId);
        
        if (isMounted) {
          setCourses(coursesData);
          setHasMore(hasMoreData);
          setTotalCourses(total);
          setCurrentOffset(coursesData.length);
          setLoading(false);
        }
      } catch (err: any) {
        if (timeoutId) clearTimeout(timeoutId);
        console.error('Error fetching courses by category:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load courses. Please try again later.');
          setLoading(false);
        }
      }
    }
    
    fetchCoursesByCategory();
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedCategory, isClient]);

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

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No courses found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .sort((a, b) => {
                // Sort by level: Advanced first, then Beginner, then Intermediate
                const levelOrder: Record<string, number> = {
                  'Advanced': 0,
                  'Beginner': 1,
                  'Intermediate': 2,
                };
                const levelA = levelOrder[a.level] ?? 999;
                const levelB = levelOrder[b.level] ?? 999;
                return levelA - levelB;
              })
              .map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onSelect={() => handleCourseSelect(course)}
                  isPurchased={purchasedCoursesSet.has(course.id)}
                />
              ))}
          </div>
          
          {/* Intersection observer target for infinite scroll */}
          {hasMore && (
            <div ref={observerTarget} className="mt-8 py-4">
              {loadingMore && (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading more courses...</p>
                </div>
              )}
            </div>
          )}
          
        </>
      )}
    </div>
  );
}

