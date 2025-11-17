'use client';

import { useApp } from '@/lib/context/AppContext';
import { CourseList } from '@/components/CourseList';
import { CourseDetail } from '@/components/CourseDetail';
import { CoursePolicies } from '@/components/CoursePolicies';
import { CorporateTraining } from '@/components/CorporateTraining';
import { Testimonials } from '@/components/Testimonials';

export default function Home() {
  const { currentUser, selectedCourse, setSelectedCourse, handlePurchase, setShowAuthModal } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-center mb-4">Learn Without Limits</h1>
            <p className="text-center text-xl opacity-90 max-w-2xl mx-auto">
              Discover thousands of courses from expert instructors. Start learning today.
            </p>
          </div>
        </div>
        
        <CourseList 
          onCourseSelect={setSelectedCourse}
          purchasedCourses={currentUser?.purchasedCourses || []}
        />

        <CoursePolicies />

        <CorporateTraining />

        <Testimonials />
      </main>

      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onPurchase={() => handlePurchase(selectedCourse)}
          isPurchased={currentUser?.purchasedCourses.includes(selectedCourse.id) || false}
        />
      )}
    </div>
  );
}

