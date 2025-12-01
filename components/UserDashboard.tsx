'use client';

import { useState, useEffect } from 'react';
import { User, Course, Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CourseCard } from './CourseCard';
import { TransactionReceipt } from './TransactionReceipt';
import { BookOpen, Award, Clock, Receipt } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { getAllCourses, getCourseById } from '@/lib/supabase/courses';

interface UserDashboardProps {
  user: User;
  onCourseSelect: (course: Course) => void;
  transactions: Transaction[];
  onDispute: (transactionId: string, reason: string) => void;
}

export function UserDashboard({ user, onCourseSelect, transactions, onDispute }: UserDashboardProps) {
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'transactions'>('courses');

  useEffect(() => {
    async function fetchPurchasedCourses() {
      try {
        setLoading(true);
        if (user.purchasedCourses.length === 0) {
          setPurchasedCourses([]);
          return;
        }
        
        const courses = await Promise.all(
          user.purchasedCourses.map(courseId => getCourseById(courseId))
        );

        // Deduplicate courses by ID in case the user has purchased
        // the same course multiple times (multiple transactions).
        const uniqueById = new Map<string, Course>();
        courses
          .filter((course): course is Course => course !== null)
          .forEach((course) => {
            if (!uniqueById.has(course.id)) {
              uniqueById.set(course.id, course);
            }
          });

        setPurchasedCourses(Array.from(uniqueById.values()));
      } catch (error) {
        console.error('Error fetching purchased courses:', error);
        setPurchasedCourses([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPurchasedCourses();
  }, [user.purchasedCourses]);

  const totalSpent = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card
          className={`cursor-pointer hover:shadow-lg transition-all ${
            activeTab === 'courses'
              ? 'border-blue-500 shadow-md bg-blue-50/50'
              : 'hover:border-blue-300'
          }`}
          onClick={() => {
            setActiveTab('courses');
            setTimeout(() => {
              document.getElementById('user-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{purchasedCourses.length}</div>
            <p className="text-xs text-gray-600 mt-1">Active learning</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover:shadow-lg transition-all ${
            activeTab === 'courses'
              ? 'border-blue-500 shadow-md bg-blue-50/50'
              : 'hover:border-blue-300'
          }`}
          onClick={() => {
            setActiveTab('courses');
            setTimeout(() => {
              document.getElementById('user-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">
              {purchasedCourses.reduce((acc, course) => {
                const hours = parseInt(course.duration);
                return acc + (isNaN(hours) ? 0 : hours);
              }, 0)} hours
            </div>
            <p className="text-xs text-gray-600 mt-1">Of content</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover:shadow-lg transition-all ${
            activeTab === 'transactions'
              ? 'border-blue-500 shadow-md bg-blue-50/50'
              : 'hover:border-blue-300'
          }`}
          onClick={() => {
            setActiveTab('transactions');
            setTimeout(() => {
              document.getElementById('user-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{transactions.length}</div>
            <p className="text-xs text-gray-600 mt-1">Total purchases</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover:shadow-lg transition-all ${
            activeTab === 'transactions'
              ? 'border-blue-500 shadow-md bg-blue-50/50'
              : 'hover:border-blue-300'
          }`}
          onClick={() => {
            setActiveTab('transactions');
            setTimeout(() => {
              document.getElementById('user-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Spent</CardTitle>
            <Award className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        id="user-tabs"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'courses' | 'transactions')}
        className="space-y-6"
      >
        <TabsList className="flex w-full flex-wrap justify-start gap-2 overflow-x-auto">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div>
            <h2 className="mb-6">My Courses</h2>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading your courses...</p>
              </div>
            ) : purchasedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onSelect={() => onCourseSelect(course)}
                    isPurchased={true}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start learning by purchasing your first course
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div>
            <h2 className="mb-6">Transaction History</h2>
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map(transaction => (
                  <TransactionReceipt
                    key={transaction.id}
                    transaction={transaction}
                    onDispute={onDispute}
                    showUserInfo={false}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="mb-2">No transactions yet</h3>
                  <p className="text-gray-600 mb-4">
                    Your purchase history will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

