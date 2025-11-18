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
  // GenAI Courses
  {
    id: '1',
    title: 'Foundations of Generative AI: Concepts & Models',
    description: 'Explore the fundamentals of generative AI, including transformer architectures, diffusion models, and foundational concepts behind GPT, DALL-E, and more.',
    instructor: 'Dr. Sarah Mitchell',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0NzUzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '45 hours',
    level: 'Beginner',
    students: 8500,
    rating: 4.9,
    category: 'GenAI'
  },
  {
    id: '2',
    title: 'Prompt Engineering & Workflow Automation',
    description: 'Master the art of crafting effective prompts, building AI workflows, and automating tasks with GPT-4, Claude, and other LLMs.',
    instructor: 'Alex Chen',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBjb2RlfGVufDF8fHx8MTc2MzQ4NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '30 hours',
    level: 'Intermediate',
    students: 12400,
    rating: 4.8,
    category: 'GenAI'
  },
  {
    id: '3',
    title: 'Building Multimodal AI Applications',
    description: 'Learn to build applications that combine text, image, audio, and video using cutting-edge multimodal AI models and frameworks.',
    instructor: 'Dr. Maria Rodriguez',
    price: 2099,
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0NzUzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '50 hours',
    level: 'Advanced',
    students: 5200,
    rating: 4.9,
    category: 'GenAI'
  },
  {
    id: '4',
    title: 'Generative AI for Product Managers & Innovators',
    description: 'Strategic guide for PMs to leverage GenAI in product development, identify use cases, and drive innovation without deep technical knowledge.',
    instructor: 'James Parker',
    price: 2599,
    image: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjMzNzU0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '25 hours',
    level: 'Beginner',
    students: 9800,
    rating: 4.7,
    category: 'GenAI'
  },
  {
    id: '5',
    title: 'Deploying LLMs at Scale: Architecture & Infrastructure',
    description: 'Learn production-grade deployment strategies for LLMs, including optimization, scaling, cost management, and infrastructure design.',
    instructor: 'Dr. Kevin Zhao',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnN8ZW58MXx8fHwxNzYzNDQ0MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '55 hours',
    level: 'Advanced',
    students: 4100,
    rating: 4.9,
    category: 'GenAI'
  },
  {
    id: '6',
    title: 'Responsible AI & Ethical Governance in GenAI',
    description: 'Understand ethical implications, bias mitigation, privacy concerns, and governance frameworks for responsible GenAI deployment.',
    instructor: 'Dr. Emily Thompson',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0NzUzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '28 hours',
    level: 'Intermediate',
    students: 7600,
    rating: 4.8,
    category: 'GenAI'
  },
  {
    id: '7',
    title: 'Fine-Tuning & Customizing Large Language Models',
    description: 'Deep dive into fine-tuning techniques, LoRA, QLoRA, and custom training strategies to adapt LLMs for specific domains and tasks.',
    instructor: 'Dr. Raj Patel',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBjb2RlfGVufDF8fHx8MTc2MzQ4NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '60 hours',
    level: 'Advanced',
    students: 3800,
    rating: 4.9,
    category: 'GenAI'
  },
  {
    id: '8',
    title: 'Generative AI in Enterprise Workflows: Use Cases & ROI',
    description: 'Practical guide to implementing GenAI in enterprise settings, measuring ROI, and transforming business processes with AI.',
    instructor: 'Linda Martinez',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjMzNzU0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '35 hours',
    level: 'Intermediate',
    students: 6900,
    rating: 4.7,
    category: 'GenAI'
  },
  {
    id: '9',
    title: 'Agents, Retrieval-Augmented Generation & Tools (E.g., LangChain)',
    description: 'Build intelligent AI agents using RAG, LangChain, vector databases, and tool-calling capabilities for complex workflows.',
    instructor: 'Dr. Michael Wong',
    price: 1699,
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0NzUzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '48 hours',
    level: 'Advanced',
    students: 5500,
    rating: 4.9,
    category: 'GenAI'
  },
  {
    id: '10',
    title: 'GenAI for Designers: From Ideation to Production',
    description: 'Leverage AI tools like Midjourney, Stable Diffusion, and ChatGPT to enhance creative workflows from concept to final design.',
    instructor: 'Sophie Anderson',
    price: 1249,
    image: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjMzNzU0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '32 hours',
    level: 'Beginner',
    students: 10200,
    rating: 4.8,
    category: 'GenAI'
  },
  // DevOps / Cloud / Kubernetes Courses
  {
    id: '11',
    title: 'Cloud Foundations for DevOps Engineers',
    description: 'Comprehensive introduction to AWS, Azure, and GCP cloud platforms, core services, and DevOps best practices in cloud environments.',
    instructor: 'Mark Stevens',
    price: 1399,
    image: 'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnN8ZW58MXx8fHwxNzYzNDQ0MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '42 hours',
    level: 'Beginner',
    students: 11200,
    rating: 4.8,
    category: 'DevOps & Cloud'
  },
  {
    id: '12',
    title: 'Infrastructure as Code with Terraform & AWS/Azure',
    description: 'Master Terraform to automate infrastructure provisioning on AWS and Azure. Learn modules, state management, and best practices.',
    instructor: 'Jennifer Lee',
    price: 1549,
    image: 'https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0MjI5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '40 hours',
    level: 'Intermediate',
    students: 8700,
    rating: 4.9,
    category: 'DevOps & Cloud'
  },
  {
    id: '13',
    title: 'CI/CD Pipelines: Best Practices & Tooling',
    description: 'Build robust CI/CD pipelines using Jenkins, GitLab CI, GitHub Actions, and ArgoCD. Learn testing, deployment strategies, and automation.',
    instructor: 'David Kumar',
    price: 1449,
    image: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBjb2RlfGVufDF8fHx8MTc2MzQ4NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '38 hours',
    level: 'Intermediate',
    students: 9500,
    rating: 4.8,
    category: 'DevOps & Cloud'
  },
  {
    id: '14',
    title: 'Containerization with Docker & Kubernetes Fundamentals',
    description: 'Start with Docker containers and progress to Kubernetes basics. Learn containerization, orchestration, and cloud-native principles.',
    instructor: 'Robert Chen',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW5mcmFzdHJ1Y3R1cmV8ZW58MXx8fHwxNzYzNDkyMTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '45 hours',
    level: 'Beginner',
    students: 13400,
    rating: 4.9,
    category: 'DevOps & Cloud'
  },
  {
    id: '15',
    title: 'Kubernetes Administration: Cluster Setup & Operations',
    description: 'Advanced Kubernetes administration covering cluster setup, upgrades, backup/restore, networking, and production operations.',
    instructor: 'Dr. Amanda Foster',
    price: 1749,
    image: 'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnN8ZW58MXx8fHwxNzYzNDQ0MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '52 hours',
    level: 'Advanced',
    students: 6200,
    rating: 4.9,
    category: 'DevOps & Cloud'
  },
  {
    id: '16',
    title: 'Kubernetes for Developers: Deploying Cloud-Native Apps',
    description: 'Developer-focused Kubernetes course covering deployments, services, ingress, ConfigMaps, secrets, and application lifecycle management.',
    instructor: 'Chris Martinez',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW5mcmFzdHJ1Y3R1cmV8ZW58MXx8fHwxNzYzNDkyMTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '44 hours',
    level: 'Intermediate',
    students: 7800,
    rating: 4.8,
    category: 'DevOps & Cloud'
  },
  {
    id: '17',
    title: 'Observability, Monitoring & Logging in Cloud Native Environments',
    description: 'Master observability with Prometheus, Grafana, ELK Stack, and distributed tracing tools like Jaeger and OpenTelemetry.',
    instructor: 'Sarah Wilson',
    price: 1649,
    image: 'https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0MjI5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '46 hours',
    level: 'Intermediate',
    students: 5900,
    rating: 4.8,
    category: 'DevOps & Cloud'
  },
  {
    id: '18',
    title: 'Security & Governance in DevOps + Kubernetes',
    description: 'Comprehensive security course covering DevSecOps, Kubernetes security, RBAC, network policies, secrets management, and compliance.',
    instructor: 'Dr. Thomas Garcia',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnN8ZW58MXx8fHwxNzYzNDQ0MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '48 hours',
    level: 'Advanced',
    students: 4700,
    rating: 4.9,
    category: 'DevOps & Cloud'
  },
  {
    id: '19',
    title: 'Serverless Architectures & Event-Driven Cloud Apps',
    description: 'Build scalable serverless applications using AWS Lambda, Azure Functions, API Gateway, and event-driven architecture patterns.',
    instructor: 'Michelle Taylor',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjMzNzU0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '40 hours',
    level: 'Intermediate',
    students: 8100,
    rating: 4.7,
    category: 'DevOps & Cloud'
  },
  {
    id: '20',
    title: 'Site Reliability Engineering: SLOs, SLIs & Chaos Engineering',
    description: 'Learn SRE principles, define SLIs/SLOs/SLAs, implement chaos engineering, and build resilient, highly available systems.',
    instructor: 'Dr. Jason Kim',
    price: 1849,
    image: 'https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0MjI5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '50 hours',
    level: 'Advanced',
    students: 5300,
    rating: 4.9,
    category: 'DevOps & Cloud'
  },
  // Other Technical Courses
  {
    id: '21',
    title: 'Machine Learning Ops (MLOps): Productionizing Models',
    description: 'End-to-end MLOps covering model versioning, deployment, monitoring, CI/CD for ML, and production best practices.',
    instructor: 'Dr. Lisa Zhang',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBjb2RlfGVufDF8fHx8MTc2MzQ4NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '55 hours',
    level: 'Advanced',
    students: 4500,
    rating: 4.9,
    category: 'Advanced Tech'
  },
  {
    id: '22',
    title: 'Big Data Engineering with Apache Kafka, Spark & Databricks',
    description: 'Master big data processing with Kafka streaming, Spark processing, and Databricks for scalable data engineering pipelines.',
    instructor: 'Daniel Rodriguez',
    price: 1949,
    image: 'https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0MjI5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '58 hours',
    level: 'Advanced',
    students: 3900,
    rating: 4.8,
    category: 'Advanced Tech'
  },
  {
    id: '23',
    title: 'Graph Neural Networks & Network Science for Tech Pros',
    description: 'Deep dive into graph theory, network analysis, and GNNs for applications in social networks, recommendation systems, and more.',
    instructor: 'Dr. Patricia Moore',
    price: 1749,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW5mcmFzdHJ1Y3R1cmV8ZW58MXx8fHwxNzYzNDkyMTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '47 hours',
    level: 'Advanced',
    students: 2800,
    rating: 4.9,
    category: 'Advanced Tech'
  },
  {
    id: '24',
    title: 'AI-Powered Infrastructure: Building Resilient Systems',
    description: 'Learn how to build self-healing, AI-driven infrastructure that predicts failures, optimizes resources, and maintains high availability.',
    instructor: 'Dr. Marcus Johnson',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0NzUzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '52 hours',
    level: 'Advanced',
    students: 3200,
    rating: 4.8,
    category: 'Advanced Tech'
  },
  {
    id: '25',
    title: 'Advanced Software Engineering: Microservices & Domain-Driven Design',
    description: 'Master microservices architecture, DDD principles, event sourcing, CQRS, and building scalable distributed systems.',
    instructor: 'Andrew Williams',
    price: 1699,
    image: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBjb2RlfGVufDF8fHx8MTc2MzQ4NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '50 hours',
    level: 'Advanced',
    students: 5600,
    rating: 4.9,
    category: 'Advanced Tech'
  },
  {
    id: '26',
    title: 'Edge Computing & IoT Architectures for AI Applications',
    description: 'Build edge computing solutions for IoT and AI workloads. Learn edge deployment, real-time processing, and distributed AI.',
    instructor: 'Dr. Rachel Green',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW5mcmFzdHJ1Y3R1cmV8ZW58MXx8fHwxNzYzNDkyMTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '45 hours',
    level: 'Intermediate',
    students: 4300,
    rating: 4.7,
    category: 'Advanced Tech'
  },
  {
    id: '27',
    title: 'Quantum Computing Fundamentals for Developers',
    description: 'Introduction to quantum computing concepts, quantum algorithms, and hands-on programming with Qiskit and quantum simulators.',
    instructor: 'Dr. Benjamin Carter',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjMzNzU0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '38 hours',
    level: 'Intermediate',
    students: 3600,
    rating: 4.8,
    category: 'Advanced Tech'
  },
  {
    id: '28',
    title: 'Data Privacy, Security & Compliance for Modern Systems',
    description: 'Comprehensive guide to GDPR, CCPA, data encryption, privacy-preserving techniques, and building compliant systems.',
    instructor: 'Dr. Olivia Harris',
    price: 1549,
    image: 'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnN8ZW58MXx8fHwxNzYzNDQ0MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '42 hours',
    level: 'Intermediate',
    students: 6700,
    rating: 4.8,
    category: 'Advanced Tech'
  },
  {
    id: '29',
    title: 'Full-Stack AI Applications: From Model to UI',
    description: 'Build complete AI-powered applications from ML models to production-ready UIs using modern frameworks and deployment strategies.',
    instructor: 'Jessica Brown',
    price: 1849,
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0NzUzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '54 hours',
    level: 'Advanced',
    students: 4900,
    rating: 4.9,
    category: 'Advanced Tech'
  },
  {
    id: '30',
    title: 'Real-Time Anomaly Detection & Streaming Analytics',
    description: 'Implement real-time anomaly detection systems using streaming analytics, time series analysis, and ML-based detection algorithms.',
    instructor: 'Dr. Steven Lee',
    price: 1899,
    image: 'https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0MjI5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '49 hours',
    level: 'Advanced',
    students: 3400,
    rating: 4.8,
    category: 'Advanced Tech'
  }
];

export function generateInitialTransactions(): Transaction[] {
  const courses = MOCK_COURSES.map(c => ({ id: c.id, title: c.title, price: c.price }));

  const initialTransactions: Transaction[] = [];
  let txId = 1;

  // Generate transactions for existing purchases
  MOCK_USERS.forEach(user => {
    if (user.role === 'user') {
      user.purchasedCourses.forEach(courseId => {
        const course = courses.find(c => c.id === courseId);
        if (course) {
          const serviceTax = course.price * 0.08; // 8% service tax
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

