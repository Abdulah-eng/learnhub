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
  role: 'admin' | 'user';
  purchasedCourses: string[];
  isApproved?: boolean;
  isBlocked?: boolean;
}

// Mock users (5 users + 1 admin) - Note: These are for reference only, actual users come from Supabase
export const MOCK_USERS: User[] = [
  {
    id: 'admin',
    name: 'Admin',
    email: 'admin@learnhub.com',
    role: 'admin',
    purchasedCourses: []
  },
  {
    id: 'user1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'user',
    purchasedCourses: ['1', '3']
  },
  {
    id: 'user2',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'user',
    purchasedCourses: ['2']
  },
  {
    id: 'user3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'user',
    purchasedCourses: ['1', '2', '4']
  },
  {
    id: 'user4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'user',
    purchasedCourses: ['5']
  },
  {
    id: 'user5',
    name: 'David Wilson',
    email: 'david@example.com',
    role: 'user',
    purchasedCourses: ['3', '6']
  }
];

export const MOCK_COURSES: Course[] = [
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

export function generateInitialTransactions(): Transaction[] {
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

