'use client';

import { useApp } from '@/lib/context/AppContext';
import { Button } from './ui/button';
import { LogIn, LogOut, User as UserIcon, Home, BookOpen, ChevronDown, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

export function Header() {
  const { currentUser, setShowAuthModal, handleLogout } = useApp();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoutClick = async (onComplete?: () => void) => {
    setIsLoggingOut(true);
    try {
      await handleLogout();
      router.push('/');
    } catch (error) {
      router.push('/');
    } finally {
      setIsLoggingOut(false);
      onComplete?.();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => router.push('/')}>
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl text-gray-900 font-semibold">LearnHub</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
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
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogoutClick();
                  }}
                  className="flex items-center gap-2"
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowAuthModal(true)} className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="border border-gray-200/70 rounded-full"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent className="sm:max-w-sm bg-white">
          <DialogHeader className="text-left">
            <DialogTitle className="text-gray-900 text-lg font-semibold">Menu</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {currentUser ? (
              <>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200/70 p-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{currentUser.name}</p>
                    <p className="text-sm text-gray-600">{currentUser.role === 'admin' ? 'Administrator' : 'Learner'}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start" onClick={() => { router.push('/'); setMobileMenuOpen(false); }}>
                    <Home className="h-4 w-4 mr-2" />
                    Browse Courses
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { router.push('/dashboard'); setMobileMenuOpen(false); }}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    {currentUser.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isLoggingOut}
                  onClick={() => handleLogoutClick(() => setMobileMenuOpen(false))}
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </>
            ) : (
              <Button
                className="w-full bg-black text-white hover:bg-gray-900"
                onClick={() => {
                  setShowAuthModal(true);
                  setMobileMenuOpen(false);
                }}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login / Sign Up
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

