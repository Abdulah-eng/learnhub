import { User } from '../App';
import { Button } from './ui/button';
import { LogIn, LogOut, User as UserIcon, Home, BookOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onDashboardClick: () => void;
  onHomeClick: () => void;
}

export function Header({ user, onLoginClick, onLogout, onDashboardClick, onHomeClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl text-gray-900">LearnHub</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onHomeClick}>
                    <Home className="h-4 w-4 mr-2" />
                    Browse Courses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDashboardClick}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    My Courses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={onLoginClick} className="flex items-center gap-2">
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
