'use client';

import { useApp } from '@/lib/context/AppContext';
import { Button } from './ui/button';
import { LogIn, LogOut, User as UserIcon, Home, BookOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function Header() {
  const { currentUser, setShowAuthModal, handleLogout } = useApp();
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl text-gray-900">LearnHub</span>
          </div>
          
          <div className="flex items-center gap-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    {currentUser.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/')}>
                    <Home className="h-4 w-4 mr-2" />
                    Browse Courses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    My Courses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setShowAuthModal(true)} className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

