import { supabase } from './client';
import { Course } from '../types';

export interface CourseWithCategory extends Course {
  category_name?: string;
}

/**
 * Fetch all courses from the database
 */
export async function getAllCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      categories (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }

  return (data || []).map((course: any) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    instructor: course.instructor,
    price: parseFloat(course.price),
    image: course.image_url,
    duration: course.duration,
    level: course.level,
    students: course.students || 0,
    rating: parseFloat(course.rating) || 0,
    category: course.categories?.name || 'Uncategorized',
  }));
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
 * Fetch courses by category
 */
export async function getCoursesByCategory(categoryName: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      categories!inner (
        name
      )
    `)
    .eq('categories.name', categoryName)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses by category:', error);
    throw error;
  }

  return (data || []).map((course: any) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    instructor: course.instructor,
    price: parseFloat(course.price),
    image: course.image_url,
    duration: course.duration,
    level: course.level,
    students: course.students || 0,
    rating: parseFloat(course.rating) || 0,
    category: course.categories?.name || 'Uncategorized',
  }));
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

