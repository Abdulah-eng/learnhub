import { supabase } from './client';
import { User } from '../types';

/**
 * Get all users (admin only)
 *
 * This implementation is optimized to avoid N+1 queries by:
 * - Fetching all user profiles in a single query
 * - Fetching all purchased courses for those users in a single query
 * - Grouping courses by user ID on the client
 */
export async function getAllUsers(): Promise<User[]> {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'user')
    .order('name', { ascending: true });

  if (profilesError) {
    console.error('Error fetching users:', profilesError);
    return [];
  }

  if (!profiles || profiles.length === 0) {
    return [];
  }

  // Collect all user IDs so we can fetch purchases in a single query
  const userIds = profiles.map((profile) => profile.id);

  const { data: purchasedRows, error: purchasesError } = await supabase
    .from('user_purchased_courses')
    .select('user_id, course_id')
    .in('user_id', userIds);

  if (purchasesError) {
    console.error('Error fetching purchased courses for users:', purchasesError);
  }

  // Group purchased course IDs by user ID
  const purchasesByUser = new Map<string, string[]>();

  if (purchasedRows) {
    for (const row of purchasedRows as { user_id: string; course_id: string }[]) {
      if (!purchasesByUser.has(row.user_id)) {
        purchasesByUser.set(row.user_id, []);
      }
      purchasesByUser.get(row.user_id)!.push(row.course_id);
    }
  }

  // Build User objects
  const users: User[] = profiles.map((profile: any) => ({
    id: profile.id,
    name: profile.name || '',
    email: profile.email || '',
    role: profile.role as 'admin' | 'user',
    purchasedCourses: purchasesByUser.get(profile.id) || [],
    isApproved: profile.is_approved ?? true, // Default to true for backward compatibility
    isBlocked: profile.is_blocked ?? false, // Default to false for backward compatibility
  }));

  return users;
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

