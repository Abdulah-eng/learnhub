'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Transaction, Course } from '../types';
import { signIn, signUp, signInWithGoogle, signOut, getCurrentUser, onAuthStateChange, UserProfile } from '../supabase/auth';
import { getUserPurchasedCourses } from '../supabase/users';
import { getAllTransactions, getUserTransactions, createTransaction, updateTransactionStatus } from '../supabase/transactions';
import { addPurchasedCourse } from '../supabase/users';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  handleLogin: (email: string, password: string) => Promise<'admin' | 'user' | null>;
  handleSignup: (email: string, password: string, name: string) => Promise<'user' | null>;
  handleGoogleSignIn: () => Promise<void>;
  handleLogout: () => Promise<void>;
  handlePurchase: (course: Course, paymentDetails: import('@/components/PaymentForm').PaymentDetails) => Promise<void>;
  handleDispute: (transactionId: string, reason: string) => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load transactions when user changes
  useEffect(() => {
    async function loadTransactions() {
      if (!currentUser) {
        setTransactions([]);
        return;
      }

      try {
        if (currentUser.role === 'admin') {
          const allTransactions = await getAllTransactions();
          setTransactions(allTransactions);
        } else {
          const userTransactions = await getUserTransactions(currentUser.id);
          // Add user name from context
          const transactionsWithName = userTransactions.map(tx => ({
            ...tx,
            userName: currentUser.name,
          }));
          setTransactions(transactionsWithName);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        setTransactions([]);
      }
    }

    loadTransactions();
  }, [currentUser]);

  // Check for existing session on mount
  useEffect(() => {
    let isMounted = true;
    
    async function checkUser() {
      try {
        const result = await getCurrentUser();
        if (result?.profile && isMounted) {
          // Load purchased courses (optimized - no timeout)
          try {
            const purchasedCourses = await getUserPurchasedCourses(result.profile.id);
            
            if (isMounted) {
              setCurrentUser({
                id: result.profile.id,
                name: result.profile.name,
                email: result.profile.email,
                role: result.profile.role,
                purchasedCourses,
                isApproved: result.profile.is_approved ?? true,
                isBlocked: result.profile.is_blocked ?? false,
              });
            }
          } catch (error) {
            console.error('Error loading purchased courses:', error);
            // Continue with empty purchased courses
            if (isMounted) {
              setCurrentUser({
                id: result.profile.id,
                name: result.profile.name,
                email: result.profile.email,
                role: result.profile.role,
                purchasedCourses: [],
                isApproved: result.profile.is_approved ?? true,
                isBlocked: result.profile.is_blocked ?? false,
              });
            }
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange(async (result) => {
      try {
        if (result?.profile) {
          try {
            // Load purchased courses (optimized - no timeout)
            const purchasedCourses = await getUserPurchasedCourses(result.profile.id);
            
            setCurrentUser({
              id: result.profile.id,
              name: result.profile.name,
              email: result.profile.email,
              role: result.profile.role,
              purchasedCourses,
              isApproved: result.profile.is_approved ?? true,
              isBlocked: result.profile.is_blocked ?? false,
            });
          } catch (error) {
            console.error('Error loading purchased courses:', error);
            // Continue with empty purchased courses
            setCurrentUser({
              id: result.profile.id,
              name: result.profile.name,
              email: result.profile.email,
              role: result.profile.role,
              purchasedCourses: [],
              isApproved: result.profile.is_approved ?? true,
              isBlocked: result.profile.is_blocked ?? false,
            });
          }
        } else {
          setCurrentUser(null);
          setSelectedCourse(null);
          setTransactions([]);
        }
      } catch (error: any) {
        // Handle token refresh errors silently
        if (error?.message?.includes('refresh_token') || error?.message?.includes('Invalid Refresh Token')) {
          console.warn('Token refresh error handled, clearing session');
          setCurrentUser(null);
          setSelectedCourse(null);
          setTransactions([]);
        } else {
          console.error('Error in auth state change:', error);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (email: string, password: string): Promise<'admin' | 'user' | null> => {
    try {
      const result = await signIn(email, password);
      if (result.profile) {
        // Load purchased courses (optimized - no timeout)
        let purchasedCourses: string[] = [];
        try {
          purchasedCourses = await getUserPurchasedCourses(result.profile.id);
        } catch (error) {
          console.error('Error loading purchased courses:', error);
          // Continue with empty array
        }
        
        const user = {
          id: result.profile.id,
          name: result.profile.name,
          email: result.profile.email,
          role: result.profile.role,
          purchasedCourses,
          isApproved: result.profile.is_approved ?? true,
          isBlocked: result.profile.is_blocked ?? false,
        };
        setCurrentUser(user);
        setShowAuthModal(false);
        return result.profile.role;
      }
      return null;
    } catch (error: any) {
      console.error('Login error:', error);
      // Provide more specific error messages
      let errorMessage = 'Invalid credentials. Please try again.';
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('pending approval')) {
          errorMessage = 'Your account is pending admin approval. Please wait for approval or contact support.';
        } else if (error.message.includes('blocked')) {
          errorMessage = 'Your account has been blocked. Please contact support.';
        } else {
          errorMessage = error.message;
        }
      }
      alert(errorMessage);
      return null;
    }
  };

  const handleSignup = async (email: string, password: string, name: string): Promise<'user' | null> => {
    try {
      const result = await signUp(email, password, name);
      if (result.profile) {
        // New users always have role 'user' and no purchased courses
        const user = {
          id: result.profile.id,
          name: result.profile.name,
          email: result.profile.email,
          role: 'user' as const,
          purchasedCourses: [],
          isApproved: result.profile.is_approved ?? false,
          isBlocked: result.profile.is_blocked ?? false,
        };
        setCurrentUser(user);
        setShowAuthModal(false);
        return 'user';
      }
      return null;
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.message || 'Failed to create account. Please try again.');
      return null;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // OAuth will redirect, so we don't need to handle the response here
      // The auth state change listener will handle the callback
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      alert(error.message || 'Failed to sign in with Google. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error('Logout error:', error);
      // Continue with logout even if there's an error
    } finally {
      // Always clear local state
      setCurrentUser(null);
      setSelectedCourse(null);
    }
  };

  const handlePurchase = async (course: Course, paymentDetails: import('@/components/PaymentForm').PaymentDetails) => {
    if (!currentUser) {
      setShowAuthModal(true);
      throw new Error('Please log in to purchase courses');
    }

    if (currentUser.role === 'admin') {
      alert('Admin cannot purchase courses');
      throw new Error('Admin cannot purchase courses');
    }

    // Check if user is approved (for non-admin users)
    if (currentUser.role === 'user' && currentUser.isApproved === false) {
      alert('Your account is pending approval. Please wait for admin approval before making purchases.');
      throw new Error('Account pending approval');
    }

    try {
      const serviceTax = course.price * 0.08; // 8% service tax
      const totalAmount = course.price + serviceTax;

      // Create transaction in database
      const newTransaction = await createTransaction(
        currentUser.id,
        course.id,
        course.title,
        course.price,
        serviceTax,
        totalAmount
      );

      if (!newTransaction) {
        alert('Failed to create transaction. Please try again.');
        return;
      }

      // Add purchased course to database (allows multiple transactions for same course)
      // This will handle duplicates gracefully
      const success = await addPurchasedCourse(
        currentUser.id,
        course.id,
        newTransaction.id
      );

      if (!success) {
        console.error('Failed to add purchased course, but transaction was created');
        // Don't fail the purchase - transaction was successful
      }
      
      // Always refresh purchased courses to ensure UI is up to date
      try {
        const updatedPurchasedCourses = await getUserPurchasedCourses(currentUser.id);
        setCurrentUser({
          ...currentUser,
          purchasedCourses: updatedPurchasedCourses
        });
      } catch (error) {
        console.error('Error refreshing purchased courses:', error);
        // Continue - we'll update on next page load
      }

      // Update local state
      const transactionWithName: Transaction = {
        ...newTransaction,
        userName: currentUser.name,
      };
      setTransactions([transactionWithName, ...transactions]);
      
      setSelectedCourse(null);
      
      // Send purchase confirmation email with zoom link to the recipient email
      try {
        // Default zoom link - can be configured per course or globally
        const zoomLink = process.env.NEXT_PUBLIC_ZOOM_LINK || `https://zoom.us/j/${course.id.replace(/-/g, '')}`;
        
        await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'course_purchase',
            to: paymentDetails.recipientEmail, // Use recipient email from payment form
            data: {
              userName: paymentDetails.cardName, // Use cardholder name
              courseTitle: course.title,
              instructor: course.instructor,
              totalAmount: totalAmount,
              transactionId: newTransaction.id,
              zoomLink: zoomLink,
            },
          }),
        });
      } catch (error) {
        console.error('Error sending purchase confirmation email:', error);
        // Don't fail purchase if email fails
      }
      
      // Show success message
      alert(`Successfully purchased "${course.title}"! A confirmation email with your Zoom link has been sent to ${paymentDetails.recipientEmail}. You can view your transaction receipt in your dashboard.`);
    } catch (error) {
      console.error('Error purchasing course:', error);
      alert('Failed to purchase course. Please try again.');
    }
  };

  const handleDispute = async (transactionId: string, reason: string) => {
    try {
      const success = await updateTransactionStatus(transactionId, 'disputed', reason);
      if (success) {
        setTransactions(transactions.map(tx => 
          tx.id === transactionId 
            ? { ...tx, status: 'disputed' as const, disputeReason: reason }
            : tx
        ));
      } else {
        alert('Failed to dispute transaction. Please try again.');
      }
    } catch (error) {
      console.error('Error disputing transaction:', error);
      alert('Failed to dispute transaction. Please try again.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        transactions,
        setTransactions,
        selectedCourse,
        setSelectedCourse,
        showAuthModal,
        setShowAuthModal,
        handleLogin,
        handleSignup,
        handleGoogleSignIn,
        handleLogout,
        handlePurchase,
        handleDispute,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

