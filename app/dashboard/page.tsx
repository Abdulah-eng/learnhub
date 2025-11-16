'use client';

import { useApp } from '@/lib/context/AppContext';
import { UserDashboard } from '@/components/UserDashboard';
import { AdminDashboard } from '@/components/AdminDashboard';
import { CourseDetail } from '@/components/CourseDetail';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllUsers } from '@/lib/supabase/users';
import { User } from '@/lib/types';

export default function DashboardPage() {
  const { currentUser, selectedCourse, setSelectedCourse, transactions, handleDispute, handlePurchase, loading } = useApp();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    // Redirect to home if not logged in (wait for loading to complete)
    if (!loading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, loading, router]);

  // Load users for admin dashboard
  useEffect(() => {
    async function loadUsers() {
      if (currentUser?.role === 'admin') {
        try {
          setUsersLoading(true);
          const allUsers = await getAllUsers();
          setUsers(allUsers);
        } catch (error) {
          console.error('Error loading users:', error);
          setUsers([]);
        } finally {
          setUsersLoading(false);
        }
      }
    }
    loadUsers();
  }, [currentUser]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {currentUser.role === 'admin' ? (
          <AdminDashboard 
            transactions={transactions}
            users={users}
            loading={usersLoading}
          />
        ) : (
          <UserDashboard 
            user={currentUser}
            onCourseSelect={setSelectedCourse}
            transactions={transactions.filter(tx => tx.userId === currentUser.id)}
            onDispute={handleDispute}
          />
        )}
      </main>

      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onPurchase={() => handlePurchase(selectedCourse)}
          isPurchased={currentUser.purchasedCourses.includes(selectedCourse.id)}
        />
      )}
    </div>
  );
}

