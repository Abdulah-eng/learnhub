import { supabase } from './client';
import { Transaction } from '../types';

export interface TransactionRow {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  course_price: number;
  service_tax: number;
  total_amount: number;
  status: 'completed' | 'disputed';
  dispute_reason?: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

/**
 * Get all transactions (admin only)
 */
export async function getAllTransactions(): Promise<Transaction[]> {
  // First, fetch all transactions
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  if (!transactions || transactions.length === 0) {
    return [];
  }

  // Get unique user IDs
  const userIds = [...new Set(transactions.map(tx => tx.user_id))];

  // Fetch profiles for all users
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, email')
    .in('id', userIds);

  // Create a map of user_id to profile
  const profileMap = new Map(
    profiles?.map(profile => [profile.id, profile]) || []
  );

  // Map transactions with user names
  return transactions.map((tx: any) => {
    const profile = profileMap.get(tx.user_id);
    return {
      id: tx.id,
      userId: tx.user_id,
      userName: profile?.name || 'Unknown User',
      courseId: tx.course_id,
      courseTitle: tx.course_title,
      coursePrice: parseFloat(tx.course_price),
      serviceTax: parseFloat(tx.service_tax),
      totalAmount: parseFloat(tx.total_amount),
      date: tx.created_at,
      status: tx.status,
      disputeReason: tx.dispute_reason || undefined,
    };
  });
}

/**
 * Get transactions for a specific user
 */
export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user transactions:', error);
    return [];
  }

  return data.map((tx) => ({
    id: tx.id,
    userId: tx.user_id,
    userName: '', // Will be filled from user context
    courseId: tx.course_id,
    courseTitle: tx.course_title,
    coursePrice: parseFloat(tx.course_price),
    serviceTax: parseFloat(tx.service_tax),
    totalAmount: parseFloat(tx.total_amount),
    date: tx.created_at,
    status: tx.status,
    disputeReason: tx.dispute_reason || undefined,
  }));
}

/**
 * Create a new transaction
 */
export async function createTransaction(
  userId: string,
  courseId: string,
  courseTitle: string,
  coursePrice: number,
  serviceTax: number,
  totalAmount: number
): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      course_id: courseId,
      course_title: courseTitle,
      course_price: coursePrice,
      service_tax: serviceTax,
      total_amount: totalAmount,
      status: 'completed',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating transaction:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    userName: '', // Will be filled from context
    courseId: data.course_id,
    courseTitle: data.course_title,
    coursePrice: parseFloat(data.course_price),
    serviceTax: parseFloat(data.service_tax),
    totalAmount: parseFloat(data.total_amount),
    date: data.created_at,
    status: data.status,
  };
}

/**
 * Update transaction status (for disputes)
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: 'completed' | 'disputed',
  disputeReason?: string
): Promise<boolean> {
  const updateData: any = { status };
  if (disputeReason) {
    updateData.dispute_reason = disputeReason;
  }

  const { error } = await supabase
    .from('transactions')
    .update(updateData)
    .eq('id', transactionId);

  if (error) {
    console.error('Error updating transaction:', error);
    return false;
  }

  return true;
}

