import { supabase } from './client';
import { User } from '../types';

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'user')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  // Get purchased courses for each user
  const usersWithCourses = await Promise.all(
    data.map(async (profile) => {
      const { data: purchasedCourses } = await supabase
        .from('user_purchased_courses')
        .select('course_id')
        .eq('user_id', profile.id);

      return {
        id: profile.id,
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role as 'admin' | 'user',
        purchasedCourses: purchasedCourses?.map((pc) => pc.course_id) || [],
        isApproved: profile.is_approved ?? true, // Default to true for backward compatibility
        isBlocked: profile.is_blocked ?? false, // Default to false for backward compatibility
      };
    })
  );

  return usersWithCourses;
}

/**
 * Get purchased courses for a user
 */
export async function getUserPurchasedCourses(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_purchased_courses')
    .select('course_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching purchased courses:', error);
    return [];
  }

  return data.map((pc) => pc.course_id);
}

/**
 * Add a purchased course for a user
 * Note: This allows unlimited purchases of the same course by the same user.
 * Each purchase creates a new transaction and a new entry in user_purchased_courses.
 */
export async function addPurchasedCourse(
  userId: string,
  courseId: string,
  transactionId: string
): Promise<boolean> {
  // Always insert a new record to allow multiple purchases of the same course
  const { error } = await supabase
    .from('user_purchased_courses')
    .insert({
      user_id: userId,
      course_id: courseId,
      transaction_id: transactionId,
    });

  if (error) {
    console.error('Error adding purchased course:', error);
    return false;
  }

  return true;
}

