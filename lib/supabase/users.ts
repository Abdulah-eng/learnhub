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
 * Note: This allows multiple transactions for the same course
 * The UNIQUE constraint on (user_id, course_id) prevents duplicate entries,
 * but we handle this gracefully to allow multiple purchases/transactions
 */
export async function addPurchasedCourse(
  userId: string,
  courseId: string,
  transactionId: string
): Promise<boolean> {
  // First check if this course is already purchased
  const { data: existing } = await supabase
    .from('user_purchased_courses')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (existing) {
    // Course already purchased, but we still want to record the transaction
    // Update the transaction_id to the latest one
    const { error: updateError } = await supabase
      .from('user_purchased_courses')
      .update({ transaction_id: transactionId })
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (updateError) {
      console.error('Error updating purchased course transaction:', updateError);
      // Don't fail - transaction was created successfully
    }
    return true; // Consider it successful since course is already purchased
  }

  // Course not purchased yet, insert new record
  const { error } = await supabase
    .from('user_purchased_courses')
    .insert({
      user_id: userId,
      course_id: courseId,
      transaction_id: transactionId,
    });

  if (error) {
    // If it's a duplicate key error, that's okay - course was already purchased
    if (error.code === '23505') {
      console.log('Course already purchased, updating transaction ID');
      // Try to update the transaction_id
      const { error: updateError } = await supabase
        .from('user_purchased_courses')
        .update({ transaction_id: transactionId })
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (updateError) {
        console.error('Error updating purchased course transaction:', updateError);
      }
      return true; // Consider it successful
    }
    console.error('Error adding purchased course:', error);
    return false;
  }

  return true;
}

