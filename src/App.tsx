import { useState } from 'react';
import { Header } from './components/Header';
import { CourseList } from './components/CourseList';
import { CourseDetail } from './components/CourseDetail';
import { AuthModal } from './components/AuthModal';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  image: string;
  duration: string;
  level: string;
  students: number;
  rating: number;
  category: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  serviceTax: number;
  totalAmount: number;
  date: string;
  status: 'completed' | 'disputed';
  disputeReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  purchasedCourses: string[];
}

// Mock users (5 users + 1 admin)
export const MOCK_USERS: User[] = [
  {
    id: 'admin',
    name: 'Admin',
    email: 'admin@learnhub.com',
    password: 'admin123',
    role: 'admin',
    purchasedCourses: []
  },
  {
    id: 'user1',
    name: 'John Smith',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
    purchasedCourses: ['1', '3']
  },
  {
    id: 'user2',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    password: 'user123',
    role: 'user',
    purchasedCourses: ['2']
  },
  {
    id: 'user3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    password: 'user123',
    role: 'user',
    purchasedCourses: ['1', '2', '4']
  },
  {
    id: 'user4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: 'user123',
    role: 'user',
    purchasedCourses: ['5']
  },
  {
    id: 'user5',
    name: 'David Wilson',
    email: 'david@example.com',
    password: 'user123',
    role: 'user',
    purchasedCourses: ['3', '6']
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [view, setView] = useState<'home' | 'dashboard'>('home');
  const [transactions, setTransactions] = useState<Transaction[]>(generateInitialTransactions());

  function generateInitialTransactions(): Transaction[] {
    const courses = [
      { id: '1', title: 'Complete Web Development Bootcamp', price: 89.99 },
      { id: '2', title: 'Data Science & Machine Learning', price: 99.99 },
      { id: '3', title: 'UI/UX Design Masterclass', price: 79.99 },
      { id: '4', title: 'Digital Marketing Complete Course', price: 69.99 },
      { id: '5', title: 'Advanced React & TypeScript', price: 94.99 },
      { id: '6', title: 'Mobile App Development with React Native', price: 84.99 }
    ];

    const initialTransactions: Transaction[] = [];
    let txId = 1;

    // Generate transactions for existing purchases
    MOCK_USERS.forEach(user => {
      if (user.role === 'user') {
        user.purchasedCourses.forEach(courseId => {
          const course = courses.find(c => c.id === courseId);
          if (course) {
            const serviceTax = course.price * 0.18; // 18% service tax
            initialTransactions.push({
              id: `TX${String(txId).padStart(6, '0')}`,
              userId: user.id,
              userName: user.name,
              courseId: course.id,
              courseTitle: course.title,
              coursePrice: course.price,
              serviceTax: serviceTax,
              totalAmount: course.price + serviceTax,
              date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            });
            txId++;
          }
        });
      }
    });

    return initialTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  const handleLogin = (email: string, password: string) => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setShowAuthModal(false);
      if (user.role === 'admin') {
        setView('dashboard');
      }
    } else {
      alert('Invalid credentials. Try:\nAdmin: admin@learnhub.com / admin123\nUser: john@example.com / user123');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
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
    setView('dashboard');
  };

  const handleDispute = (transactionId: string, reason: string) => {
    setTransactions(transactions.map(tx => 
      tx.id === transactionId 
        ? { ...tx, status: 'disputed' as const, disputeReason: reason }
        : tx
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={currentUser}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onDashboardClick={() => setView('dashboard')}
        onHomeClick={() => setView('home')}
      />
      
      <main>
        {view === 'home' ? (
          <>
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
          </>
        ) : currentUser?.role === 'admin' ? (
          <AdminDashboard 
            transactions={transactions}
            users={MOCK_USERS.filter(u => u.role === 'user')}
          />
        ) : (
          <UserDashboard 
            user={currentUser!}
            onCourseSelect={setSelectedCourse}
            transactions={transactions.filter(tx => tx.userId === currentUser?.id)}
            onDispute={handleDispute}
          />
        )}
      </main>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}

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
