# Course Listing Website (Community) - Next.js

This is a full Next.js implementation of the Course Listing Website (Community) design. The original Figma design is available at https://www.figma.com/design/I8CQDfpGndMH79TWYDhq8n/Course-Listing-Website--Community-.

## Features

- **Course Listing**: Browse courses by category with filtering
- **Course Details**: View detailed information about each course
- **User Authentication**: Login system with admin and user roles
- **User Dashboard**: View purchased courses and transaction history
- **Admin Dashboard**: Manage users and monitor all transactions
- **Transaction Management**: Purchase courses and dispute transactions
- **Responsive Design**: Fully responsive layout matching the Figma design

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Supabase** - Backend as a Service (Database & Authentication)
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **React Context** - State management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── dashboard/         # Dashboard page
│   └── globals.css         # Global styles
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── Header.tsx         # Navigation header
│   ├── CourseList.tsx     # Course listing component
│   ├── CourseCard.tsx     # Individual course card
│   ├── CourseDetail.tsx   # Course detail modal
│   ├── AuthModal.tsx      # Authentication modal
│   ├── UserDashboard.tsx  # User dashboard
│   ├── AdminDashboard.tsx # Admin dashboard
│   └── TransactionReceipt.tsx # Transaction display
├── lib/                   # Utilities and types
│   ├── types.ts           # TypeScript interfaces
│   └── context/           # React context providers
│       └── AppContext.tsx # Main app context
└── components/ui/         # shadcn/ui components
```

## Authentication

This project uses Supabase Authentication for real user authentication. See `SUPABASE_AUTH_SETUP.md` for detailed setup instructions.

### Test Credentials (after setup)
- **Admin**: `admin@learnhub.com` / `admin123`
- **Users**: `john@example.com`, `sarah@example.com`, `michael@example.com`, `emily@example.com`, `david@example.com` / `user123`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Design Fidelity

This implementation matches the Figma design exactly, including:
- Exact color schemes and gradients
- Typography and spacing
- Component layouts and interactions
- Responsive breakpoints
- All UI states and animations

## License

This project uses components from [shadcn/ui](https://ui.shadcn.com/) used under [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md).

This project includes photos from [Unsplash](https://unsplash.com) used under [license](https://unsplash.com/license).
