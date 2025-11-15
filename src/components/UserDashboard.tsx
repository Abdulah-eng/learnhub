import { User, Course, Transaction } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CourseCard } from './CourseCard';
import { TransactionReceipt } from './TransactionReceipt';
import { BookOpen, Award, Clock, Receipt } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a full-stack developer.',
    instructor: 'Sarah Johnson',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    duration: '40 hours',
    level: 'Beginner',
    students: 12500,
    rating: 4.8,
    category: 'Development'
  },
  {
    id: '2',
    title: 'Data Science & Machine Learning',
    description: 'Master Python, NumPy, Pandas, Scikit-Learn, and TensorFlow. Build ML models and analyze data like a pro.',
    instructor: 'Dr. Michael Chen',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    duration: '50 hours',
    level: 'Intermediate',
    students: 8900,
    rating: 4.9,
    category: 'Data Science'
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    description: 'Learn user interface and user experience design. Master Figma, create stunning designs, and build your portfolio.',
    instructor: 'Emma Rodriguez',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    duration: '30 hours',
    level: 'Beginner',
    students: 15200,
    rating: 4.7,
    category: 'Design'
  },
  {
    id: '4',
    title: 'Digital Marketing Complete Course',
    description: 'Master SEO, social media marketing, email marketing, and paid advertising. Grow your business online.',
    instructor: 'James Wilson',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    duration: '25 hours',
    level: 'Beginner',
    students: 9800,
    rating: 4.6,
    category: 'Marketing'
  },
  {
    id: '5',
    title: 'Advanced React & TypeScript',
    description: 'Take your React skills to the next level. Learn TypeScript, advanced patterns, testing, and performance optimization.',
    instructor: 'David Kim',
    price: 94.99,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    duration: '35 hours',
    level: 'Advanced',
    students: 6700,
    rating: 4.9,
    category: 'Development'
  },
  {
    id: '6',
    title: 'Mobile App Development with React Native',
    description: 'Build iOS and Android apps with React Native. Learn navigation, state management, and publish to app stores.',
    instructor: 'Lisa Anderson',
    price: 84.99,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    duration: '45 hours',
    level: 'Intermediate',
    students: 7300,
    rating: 4.7,
    category: 'Development'
  }
];

interface UserDashboardProps {
  user: User;
  onCourseSelect: (course: Course) => void;
  transactions: Transaction[];
  onDispute: (transactionId: string, reason: string) => void;
}

export function UserDashboard({ user, onCourseSelect, transactions, onDispute }: UserDashboardProps) {
  const purchasedCourses = MOCK_COURSES.filter(course => 
    user.purchasedCourses.includes(course.id)
  );

  const totalSpent = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{purchasedCourses.length}</div>
            <p className="text-xs text-gray-600 mt-1">Active learning</p>
          </CardContent>
        </Card>

        <Card>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{transactions.length}</div>
            <p className="text-xs text-gray-600 mt-1">Total purchases</p>
          </CardContent>
        </Card>

        <Card>
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

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div>
            <h2 className="mb-6">My Courses</h2>
            {purchasedCourses.length > 0 ? (
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
