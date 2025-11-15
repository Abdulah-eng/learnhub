'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useApp } from '@/lib/context/AppContext';

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, handleLogin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const role = await handleLogin(email, password);
    
    // Navigate based on user role
    if (role === 'admin') {
      router.push('/dashboard');
    } else if (role === 'user') {
      router.push('/dashboard');
    }
  };

  const fillAdmin = () => {
    setEmail('admin@learnhub.com');
    setPassword('admin123');
  };

  const fillUser = () => {
    setEmail('john@example.com');
    setPassword('user123');
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-left">
          <DialogTitle className="text-gray-900 text-xl font-semibold">Welcome to LearnHub</DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            Login to access your courses and dashboard
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-900">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white"
            />
          </div>

          <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white font-medium">
            Login
          </Button>
        </form>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Quick login:</p>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={fillAdmin} 
              className="flex-1 bg-white text-gray-900 border-gray-200/50 hover:bg-gray-50"
            >
              Admin Login
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={fillUser} 
              className="flex-1 bg-white text-gray-900 border-gray-200/50 hover:bg-gray-50"
            >
              User Login
            </Button>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Admin: admin@learnhub.com / admin123</p>
            <p>Users: john@example.com, sarah@example.com, michael@example.com, emily@example.com, david@example.com (all use password: user123)</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

