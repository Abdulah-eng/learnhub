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
  handlePurchase: (course: Course) => Promise<void>;
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
    async function checkUser() {
      try {
        const result = await getCurrentUser();
        if (result?.profile) {
          const purchasedCourses = await getUserPurchasedCourses(result.profile.id);
          setCurrentUser({
            id: result.profile.id,
            name: result.profile.name,
            email: result.profile.email,
            role: result.profile.role,
            purchasedCourses,
          });
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    }

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange(async (result) => {
      if (result?.profile) {
        try {
          const purchasedCourses = await getUserPurchasedCourses(result.profile.id);
          setCurrentUser({
            id: result.profile.id,
            name: result.profile.name,
            email: result.profile.email,
            role: result.profile.role,
            purchasedCourses,
          });
        } catch (error) {
          console.error('Error loading purchased courses:', error);
          setCurrentUser({
            id: result.profile.id,
            name: result.profile.name,
            email: result.profile.email,
            role: result.profile.role,
            purchasedCourses: [],
          });
        }
      } else {
        setCurrentUser(null);
        setSelectedCourse(null);
        setTransactions([]);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (email: string, password: string): Promise<'admin' | 'user' | null> => {
    try {
      const result = await signIn(email, password);
      if (result.profile) {
        const purchasedCourses = await getUserPurchasedCourses(result.profile.id);
        const user = {
          id: result.profile.id,
          name: result.profile.name,
          email: result.profile.email,
          role: result.profile.role,
          purchasedCourses,
        };
        setCurrentUser(user);
        setShowAuthModal(false);
        return result.profile.role;
      }
      return null;
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Invalid credentials. Please try again.');
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

  const handlePurchase = async (course: Course) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (currentUser.role === 'admin') {
      alert('Admin cannot purchase courses');
      return;
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

      // Add purchased course to database
      const success = await addPurchasedCourse(
        currentUser.id,
        course.id,
        newTransaction.id
      );

      if (!success) {
        console.error('Failed to add purchased course');
      }

      // Update local state
      const transactionWithName: Transaction = {
        ...newTransaction,
        userName: currentUser.name,
      };
      setTransactions([transactionWithName, ...transactions]);
      setCurrentUser({
        ...currentUser,
        purchasedCourses: [...currentUser.purchasedCourses, course.id]
      });
      setSelectedCourse(null);
      
      // Show success message
      alert(`Successfully purchased "${course.title}"! A transaction receipt has been generated. You can view it in your dashboard.`);
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

