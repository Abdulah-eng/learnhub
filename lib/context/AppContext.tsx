'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Transaction, Course, MOCK_USERS, generateInitialTransactions } from '../types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  handleLogin: (email: string, password: string) => void;
  handleLogout: () => void;
  handlePurchase: (course: Course) => void;
  handleDispute: (transactionId: string, reason: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(generateInitialTransactions());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = (email: string, password: string) => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setShowAuthModal(false);
    } else {
      alert('Invalid credentials. Try:\nAdmin: admin@learnhub.com / admin123\nUser: john@example.com / user123');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedCourse(null);
  };

  const handlePurchase = (course: Course) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (currentUser.role === 'admin') {
      alert('Admin cannot purchase courses');
      return;
    }

    const serviceTax = course.price * 0.18; // 18% service tax
    const newTransaction: Transaction = {
      id: `TX${String(transactions.length + 1).padStart(6, '0')}`,
      userId: currentUser.id,
      userName: currentUser.name,
      courseId: course.id,
      courseTitle: course.title,
      coursePrice: course.price,
      serviceTax: serviceTax,
      totalAmount: course.price + serviceTax,
      date: new Date().toISOString(),
      status: 'completed'
    };

    setTransactions([newTransaction, ...transactions]);
    setCurrentUser({
      ...currentUser,
      purchasedCourses: [...currentUser.purchasedCourses, course.id]
    });
    setSelectedCourse(null);
  };

  const handleDispute = (transactionId: string, reason: string) => {
    setTransactions(transactions.map(tx => 
      tx.id === transactionId 
        ? { ...tx, status: 'disputed' as const, disputeReason: reason }
        : tx
    ));
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
        handleLogout,
        handlePurchase,
        handleDispute,
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

