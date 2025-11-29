import { supabase } from './client';
import { Course } from '../types';

const getCourseImage = (course: { id?: string; title?: string; image_url?: string }) => {
  if (course.image_url && course.image_url.trim().length > 0) {
    return course.image_url;
  }

  const seedSource = course.id || course.title || 'learnhub-course';
  const seed = seedSource.replace(/[^a-zA-Z0-9]/g, '') || 'learnhubcourse';
  return `https://picsum.photos/seed/${seed}/900/600`;
};

export interface CourseWithCategory extends Course {
  category_name?: string;
}

/**
 * Fetch courses with pagination
 */
export async function getCoursesPaginated(limit: number = 6, offset: number = 0): Promise<{ courses: Course[]; hasMore: boolean; total: number }> {
  try {
    // First, get total count
    const { count, error: countError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting courses:', countError);
    }

    const total = count || 0;

    // Then fetch paginated courses
    const { data, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        instructor,
        price,
        image_url,
        duration,
        level,
        students,
        rating,
        category_id,
        categories (
          name
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return { courses: [], hasMore: false, total };
    }

    const courses = data.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: parseFloat(course.price) || 0,
      image: getCourseImage(course),
      duration: course.duration || '',
      level: course.level || 'Beginner',
      students: course.students || 0,
      rating: parseFloat(course.rating) || 0,
      category: course.categories?.name || 'Uncategorized',
    }));

    const hasMore = offset + courses.length < total;

    return { courses, hasMore, total };
  } catch (error) {
    console.error('Error in getCoursesPaginated:', error);
    throw error;
  }
}

/**
 * Fetch all courses from the database (for backward compatibility)
 */
export async function getAllCourses(): Promise<Course[]> {
  try {
    let timeoutId: NodeJS.Timeout | undefined;
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Request timeout. Please try again.')), 15000);
    });

    const fetchPromise = supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        instructor,
        price,
        image_url,
        duration,
        level,
        students,
        rating,
        category_id,
        categories (
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100); // Limit to prevent huge queries

    const result = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as { data: any; error: any };

    if (timeoutId) clearTimeout(timeoutId);

    const { data, error } = result;

    if (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No courses found in database');
      return [];
    }

    return data.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: parseFloat(course.price) || 0,
      image: getCourseImage(course),
      duration: course.duration || '',
      level: course.level || 'Beginner',
      students: course.students || 0,
      rating: parseFloat(course.rating) || 0,
      category: course.categories?.name || 'Uncategorized',
    }));
  } catch (error) {
    console.error('Error in getAllCourses:', error);
    throw error;
  }
}

/**
 * Fetch a single course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching course:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    instructor: data.instructor,
    price: parseFloat(data.price),
    image: data.image_url,
    duration: data.duration,
    level: data.level,
    students: data.students || 0,
    rating: parseFloat(data.rating) || 0,
    category: data.categories?.name || 'Uncategorized',
  };
}

/**
 * Fetch courses by category with pagination
 */
export async function getCoursesByCategoryPaginated(
  categoryName: string,
  limit: number = 6,
  offset: number = 0
): Promise<{ courses: Course[]; hasMore: boolean; total: number }> {
  try {
    // First get the category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .single();

    if (categoryError || !categoryData) {
      console.error('Error fetching category:', categoryError);
      throw new Error(`Category "${categoryName}" not found`);
    }

    // Get total count for this category
    const { count, error: countError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryData.id);

    if (countError) {
      console.error('Error counting courses:', countError);
    }

    const total = count || 0;

    // Then fetch paginated courses by category_id
    const { data, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        instructor,
        price,
        image_url,
        duration,
        level,
        students,
        rating,
        category_id,
        categories (
          name
        )
      `)
      .eq('category_id', categoryData.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching courses by category:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return { courses: [], hasMore: false, total };
    }

    const courses = data.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: parseFloat(course.price) || 0,
      image: getCourseImage(course),
      duration: course.duration || '',
      level: course.level || 'Beginner',
      students: course.students || 0,
      rating: parseFloat(course.rating) || 0,
      category: course.categories?.name || categoryName,
    }));

    const hasMore = offset + courses.length < total;

    return { courses, hasMore, total };
  } catch (error) {
    console.error('Error in getCoursesByCategoryPaginated:', error);
    throw error;
  }
}

/**
 * Fetch courses by category (for backward compatibility)
 */
export async function getCoursesByCategory(categoryName: string): Promise<Course[]> {
  try {
    // First get the category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .single();

    if (categoryError || !categoryData) {
      console.error('Error fetching category:', categoryError);
      throw new Error(`Category "${categoryName}" not found`);
    }

    // Then fetch courses by category_id (more efficient than join)
    const { data, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        instructor,
        price,
        image_url,
        duration,
        level,
        students,
        rating,
        category_id,
        categories (
          name
        )
      `)
      .eq('category_id', categoryData.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching courses by category:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: parseFloat(course.price) || 0,
      image: getCourseImage(course),
      duration: course.duration || '',
      level: course.level || 'Beginner',
      students: course.students || 0,
      rating: parseFloat(course.rating) || 0,
      category: course.categories?.name || categoryName,
    }));
  } catch (error) {
    console.error('Error in getCoursesByCategory:', error);
    throw error;
  }
}

/**
 * Fetch all unique categories
 */
export async function getAllCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return (data || []).map((cat: any) => cat.name);
}

