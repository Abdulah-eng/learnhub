'use client';

import { useApp } from '@/lib/context/AppContext';
import { Button } from './ui/button';
import { LogIn, LogOut, User as UserIcon, Home, BookOpen, ChevronDown } from 'lucide-react';
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
              <>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2"
                    onClick={() => router.push('/dashboard')}
                  >
                    <UserIcon className="h-4 w-4" />
                    {currentUser.name}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push('/')}>
                        <Home className="h-4 w-4 mr-2" />
                        Browse Courses
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        {currentUser.role === 'admin' ? 'Admin Dashboard' : 'My Courses'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button 
                  variant="outline" 
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await handleLogout();
                      router.push('/');
                    } catch (error) {
                      // Error already handled in handleLogout
                      router.push('/');
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
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

