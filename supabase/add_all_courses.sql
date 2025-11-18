-- ============================================
-- ADD ALL 30 COURSES TO DATABASE
-- ============================================
-- Run this file in Supabase SQL Editor
-- This adds all 30 courses with new categories
-- ============================================

-- First, add the new categories
INSERT INTO categories (name, slug) VALUES
  ('GenAI', 'genai'),
  ('DevOps & Cloud', 'devops-cloud'),
  ('Advanced Tech', 'advanced-tech')
ON CONFLICT (slug) DO NOTHING;

-- Now insert all 30 courses
-- GenAI Courses (1-10)
INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Foundations of Generative AI: Concepts & Models',
  'Explore the fundamentals of generative AI, including transformer architectures, diffusion models, and foundational concepts behind GPT, DALL-E, and more.',
  'Dr. Sarah Mitchell',
  1499.00,
  'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0NzUzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '45 hours',
  'Beginner',
  8500,
  4.9,
  (SELECT id FROM categories WHERE slug = 'genai' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Foundations of Generative AI: Concepts & Models');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Prompt Engineering & Workflow Automation',
  'Master the art of crafting effective prompts, building AI workflows, and automating tasks with GPT-4, Claude, and other LLMs.',
  'Alex Chen',
  1899.00,
  'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBjb2RlfGVufDF8fHx8MTc2MzQ4NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  '30 hours',
  'Intermediate',
  12400,
  4.8,
  (SELECT id FROM categories WHERE slug = 'genai' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Prompt Engineering & Workflow Automation');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Building Multimodal AI Applications',
  'Learn to build applications that combine text, image, audio, and video using cutting-edge multimodal AI models and frameworks.',
  'Dr. Maria Rodriguez',
  2099.00,
  'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0NzUzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '50 hours',
  'Advanced',
  5200,
  4.9,
  (SELECT id FROM categories WHERE slug = 'genai' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Building Multimodal AI Applications');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Generative AI for Product Managers & Innovators',
  'Strategic guide for PMs to leverage GenAI in product development, identify use cases, and drive innovation without deep technical knowledge.',
  'James Parker',
  2599.00,
  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjMzNzU0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '25 hours',
  'Beginner',
  9800,
  4.7,
  (SELECT id FROM categories WHERE slug = 'genai' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Generative AI for Product Managers & Innovators');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Deploying LLMs at Scale: Architecture & Infrastructure',
  'Learn production-grade deployment strategies for LLMs, including optimization, scaling, cost management, and infrastructure design.',
  'Dr. Kevin Zhao',
  1799.00,
  'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnN8ZW58MXx8fHwxNzYzNDQ0MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  '55 hours',
  'Advanced',
  4100,
  4.9,
  (SELECT id FROM categories WHERE slug = 'genai' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Deploying LLMs at Scale: Architecture & Infrastructure');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Responsible AI & Ethical Governance in GenAI',
  'Understand ethical implications, bias mitigation, privacy concerns, and governance frameworks for responsible GenAI deployment.',
  'Dr. Emily Thompson',
  1599.00,
  'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0NzUzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '28 hours',
  'Intermediate',
  7600,
  4.8,
  (SELECT id FROM categories WHERE slug = 'genai' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Responsible AI & Ethical Governance in GenAI');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Fine-Tuning & Customizing Large Language Models',
  'Deep dive into fine-tuning techniques, LoRA, QLoRA, and custom training strategies to adapt LLMs for specific domains and tasks.',
  'Dr. Raj Patel',
  1999.00,
  'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBjb2RlfGVufDF8fHx8MTc2MzQ4NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  '60 hours',
  'Advanced',
  3800,
  4.9,
  (SELECT id FROM categories WHERE slug = 'genai' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Fine-Tuning & Customizing Large Language Models');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Generative AI in Enterprise Workflows: Use Cases & ROI',
  'Practical guide to implementing GenAI in enterprise settings, measuring ROI, and transforming business processes with AI.',
  'Linda Martinez',
  1599.00,
  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjMzNzU0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '35 hours',
  'Intermediate',
  6900,
  4.7,
  (SELECT id FROM categories WHERE slug = 'genai' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Generative AI in Enterprise Workflows: Use Cases & ROI');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Agents, Retrieval-Augmented Generation & Tools (E.g., LangChain)',
  'Build intelligent AI agents using RAG, LangChain, vector databases, and tool-calling capabilities for complex workflows.',
  'Dr. Michael Wong',
  1699.00,
  'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0NzUzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '48 hours',
  'Advanced',
  5500,
  4.9,
  (SELECT id FROM categories WHERE slug = 'genai' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Agents, Retrieval-Augmented Generation & Tools (E.g., LangChain)');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'GenAI for Designers: From Ideation to Production',
  'Leverage AI tools like Midjourney, Stable Diffusion, and ChatGPT to enhance creative workflows from concept to final design.',
  'Sophie Anderson',
  1249.00,
  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjMzNzU0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '32 hours',
  'Beginner',
  10200,
  4.8,
  (SELECT id FROM categories WHERE slug = 'genai' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'GenAI for Designers: From Ideation to Production');

-- DevOps & Cloud Courses (11-20)
INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Cloud Foundations for DevOps Engineers',
  'Comprehensive introduction to AWS, Azure, and GCP cloud platforms, core services, and DevOps best practices in cloud environments.',
  'Mark Stevens',
  1399.00,
  'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnN8ZW58MXx8fHwxNzYzNDQ0MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  '42 hours',
  'Beginner',
  11200,
  4.8,
  (SELECT id FROM categories WHERE slug = 'devops-cloud' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Cloud Foundations for DevOps Engineers');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Infrastructure as Code with Terraform & AWS/Azure',
  'Master Terraform to automate infrastructure provisioning on AWS and Azure. Learn modules, state management, and best practices.',
  'Jennifer Lee',
  1549.00,
  'https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0MjI5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '40 hours',
  'Intermediate',
  8700,
  4.9,
  (SELECT id FROM categories WHERE slug = 'devops-cloud' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Infrastructure as Code with Terraform & AWS/Azure');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'CI/CD Pipelines: Best Practices & Tooling',
  'Build robust CI/CD pipelines using Jenkins, GitLab CI, GitHub Actions, and ArgoCD. Learn testing, deployment strategies, and automation.',
  'David Kumar',
  1449.00,
  'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBjb2RlfGVufDF8fHx8MTc2MzQ4NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  '38 hours',
  'Intermediate',
  9500,
  4.8,
  (SELECT id FROM categories WHERE slug = 'devops-cloud' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'CI/CD Pipelines: Best Practices & Tooling');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Containerization with Docker & Kubernetes Fundamentals',
  'Start with Docker containers and progress to Kubernetes basics. Learn containerization, orchestration, and cloud-native principles.',
  'Robert Chen',
  1499.00,
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW5mcmFzdHJ1Y3R1cmV8ZW58MXx8fHwxNzYzNDkyMTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  '45 hours',
  'Beginner',
  13400,
  4.9,
  (SELECT id FROM categories WHERE slug = 'devops-cloud' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Containerization with Docker & Kubernetes Fundamentals');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Kubernetes Administration: Cluster Setup & Operations',
  'Advanced Kubernetes administration covering cluster setup, upgrades, backup/restore, networking, and production operations.',
  'Dr. Amanda Foster',
  1749.00,
  'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnN8ZW58MXx8fHwxNzYzNDQ0MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  '52 hours',
  'Advanced',
  6200,
  4.9,
  (SELECT id FROM categories WHERE slug = 'devops-cloud' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Kubernetes Administration: Cluster Setup & Operations');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Kubernetes for Developers: Deploying Cloud-Native Apps',
  'Developer-focused Kubernetes course covering deployments, services, ingress, ConfigMaps, secrets, and application lifecycle management.',
  'Chris Martinez',
  1599.00,
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW5mcmFzdHJ1Y3R1cmV8ZW58MXx8fHwxNzYzNDkyMTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  '44 hours',
  'Intermediate',
  7800,
  4.8,
  (SELECT id FROM categories WHERE slug = 'devops-cloud' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Kubernetes for Developers: Deploying Cloud-Native Apps');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Observability, Monitoring & Logging in Cloud Native Environments',
  'Master observability with Prometheus, Grafana, ELK Stack, and distributed tracing tools like Jaeger and OpenTelemetry.',
  'Sarah Wilson',
  1649.00,
  'https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0MjI5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '46 hours',
  'Intermediate',
  5900,
  4.8,
  (SELECT id FROM categories WHERE slug = 'devops-cloud' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Observability, Monitoring & Logging in Cloud Native Environments');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Security & Governance in DevOps + Kubernetes',
  'Comprehensive security course covering DevSecOps, Kubernetes security, RBAC, network policies, secrets management, and compliance.',
  'Dr. Thomas Garcia',
  1799.00,
  'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnN8ZW58MXx8fHwxNzYzNDQ0MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  '48 hours',
  'Advanced',
  4700,
  4.9,
  (SELECT id FROM categories WHERE slug = 'devops-cloud' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Security & Governance in DevOps + Kubernetes');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Serverless Architectures & Event-Driven Cloud Apps',
  'Build scalable serverless applications using AWS Lambda, Azure Functions, API Gateway, and event-driven architecture patterns.',
  'Michelle Taylor',
  1499.00,
  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjMzNzU0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '40 hours',
  'Intermediate',
  8100,
  4.7,
  (SELECT id FROM categories WHERE slug = 'devops-cloud' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Serverless Architectures & Event-Driven Cloud Apps');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Site Reliability Engineering: SLOs, SLIs & Chaos Engineering',
  'Learn SRE principles, define SLIs/SLOs/SLAs, implement chaos engineering, and build resilient, highly available systems.',
  'Dr. Jason Kim',
  1849.00,
  'https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0MjI5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '50 hours',
  'Advanced',
  5300,
  4.9,
  (SELECT id FROM categories WHERE slug = 'devops-cloud' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Site Reliability Engineering: SLOs, SLIs & Chaos Engineering');

-- Advanced Tech Courses (21-30)
INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Machine Learning Ops (MLOps): Productionizing Models',
  'End-to-end MLOps covering model versioning, deployment, monitoring, CI/CD for ML, and production best practices.',
  'Dr. Lisa Zhang',
  1899.00,
  'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBjb2RlfGVufDF8fHx8MTc2MzQ4NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  '55 hours',
  'Advanced',
  4500,
  4.9,
  (SELECT id FROM categories WHERE slug = 'advanced-tech' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Machine Learning Ops (MLOps): Productionizing Models');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Big Data Engineering with Apache Kafka, Spark & Databricks',
  'Master big data processing with Kafka streaming, Spark processing, and Databricks for scalable data engineering pipelines.',
  'Daniel Rodriguez',
  1949.00,
  'https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0MjI5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '58 hours',
  'Advanced',
  3900,
  4.8,
  (SELECT id FROM categories WHERE slug = 'advanced-tech' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Big Data Engineering with Apache Kafka, Spark & Databricks');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Graph Neural Networks & Network Science for Tech Pros',
  'Deep dive into graph theory, network analysis, and GNNs for applications in social networks, recommendation systems, and more.',
  'Dr. Patricia Moore',
  1749.00,
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW5mcmFzdHJ1Y3R1cmV8ZW58MXx8fHwxNzYzNDkyMTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  '47 hours',
  'Advanced',
  2800,
  4.9,
  (SELECT id FROM categories WHERE slug = 'advanced-tech' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Graph Neural Networks & Network Science for Tech Pros');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'AI-Powered Infrastructure: Building Resilient Systems',
  'Learn how to build self-healing, AI-driven infrastructure that predicts failures, optimizes resources, and maintains high availability.',
  'Dr. Marcus Johnson',
  1999.00,
  'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0NzUzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '52 hours',
  'Advanced',
  3200,
  4.8,
  (SELECT id FROM categories WHERE slug = 'advanced-tech' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'AI-Powered Infrastructure: Building Resilient Systems');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Advanced Software Engineering: Microservices & Domain-Driven Design',
  'Master microservices architecture, DDD principles, event sourcing, CQRS, and building scalable distributed systems.',
  'Andrew Williams',
  1699.00,
  'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBjb2RlfGVufDF8fHx8MTc2MzQ4NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  '50 hours',
  'Advanced',
  5600,
  4.9,
  (SELECT id FROM categories WHERE slug = 'advanced-tech' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Advanced Software Engineering: Microservices & Domain-Driven Design');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Edge Computing & IoT Architectures for AI Applications',
  'Build edge computing solutions for IoT and AI workloads. Learn edge deployment, real-time processing, and distributed AI.',
  'Dr. Rachel Green',
  1799.00,
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwaW5mcmFzdHJ1Y3R1cmV8ZW58MXx8fHwxNzYzNDkyMTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  '45 hours',
  'Intermediate',
  4300,
  4.7,
  (SELECT id FROM categories WHERE slug = 'advanced-tech' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Edge Computing & IoT Architectures for AI Applications');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Quantum Computing Fundamentals for Developers',
  'Introduction to quantum computing concepts, quantum algorithms, and hands-on programming with Qiskit and quantum simulators.',
  'Dr. Benjamin Carter',
  1599.00,
  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjMzNzU0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '38 hours',
  'Intermediate',
  3600,
  4.8,
  (SELECT id FROM categories WHERE slug = 'advanced-tech' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Quantum Computing Fundamentals for Developers');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Data Privacy, Security & Compliance for Modern Systems',
  'Comprehensive guide to GDPR, CCPA, data encryption, privacy-preserving techniques, and building compliant systems.',
  'Dr. Olivia Harris',
  1549.00,
  'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlcnN8ZW58MXx8fHwxNzYzNDQ0MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  '42 hours',
  'Intermediate',
  6700,
  4.8,
  (SELECT id FROM categories WHERE slug = 'advanced-tech' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Data Privacy, Security & Compliance for Modern Systems');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Full-Stack AI Applications: From Model to UI',
  'Build complete AI-powered applications from ML models to production-ready UIs using modern frameworks and deployment strategies.',
  'Jessica Brown',
  1849.00,
  'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0NzUzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '54 hours',
  'Advanced',
  4900,
  4.9,
  (SELECT id FROM categories WHERE slug = 'advanced-tech' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Full-Stack AI Applications: From Model to UI');

INSERT INTO courses (title, description, instructor, price, image_url, duration, level, students, rating, category_id)
SELECT 
  'Real-Time Anomaly Detection & Streaming Analytics',
  'Implement real-time anomaly detection systems using streaming analytics, time series analysis, and ML-based detection algorithms.',
  'Dr. Steven Lee',
  1899.00,
  'https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM0MjI5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '49 hours',
  'Advanced',
  3400,
  4.8,
  (SELECT id FROM categories WHERE slug = 'advanced-tech' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Real-Time Anomaly Detection & Streaming Analytics');

