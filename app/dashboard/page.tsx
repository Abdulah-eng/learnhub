'use client';

import { useApp } from '@/lib/context/AppContext';
import { UserDashboard } from '@/components/UserDashboard';
import { AdminDashboard } from '@/components/AdminDashboard';
import { CourseDetail } from '@/components/CourseDetail';
import { MOCK_USERS } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { currentUser, selectedCourse, setSelectedCourse, transactions, handleDispute } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {currentUser.role === 'admin' ? (
          <AdminDashboard 
            transactions={transactions}
            users={MOCK_USERS.filter(u => u.role === 'user')}
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
          onPurchase={() => {}}
          isPurchased={currentUser.purchasedCourses.includes(selectedCourse.id)}
        />
      )}
    </div>
  );
}

