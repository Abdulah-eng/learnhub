'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useApp } from '@/lib/context/AppContext';

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, handleLogin, handleSignup, handleGoogleSignIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const role = await handleLogin(email, password);
      
      // Navigate based on user role
      if (role === 'admin' || role === 'user') {
        router.push('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    setIsLoading(true);
    try {
      const role = await handleSignup(email, password, name.trim());
      
      // Navigate to dashboard after signup
      if (role === 'user') {
        router.push('/dashboard');
      }
    } finally {
      setIsLoading(false);
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

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleGoogleClick = async () => {
    setIsGoogleLoading(true);
    try {
      await handleGoogleSignIn();
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={(open) => {
      setShowAuthModal(open);
      if (!open) {
        resetForm();
        setActiveTab('login');
      }
    }}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-left">
          <DialogTitle className="text-gray-900 text-xl font-semibold">Welcome to LearnHub</DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            Sign in to your account or create a new one
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg border border-gray-200/60">
            <TabsTrigger
              value="login"
              className="py-2 text-sm font-semibold text-gray-500 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="py-2 text-sm font-semibold text-gray-500 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-black text-white border-black hover:bg-gray-900 flex items-center justify-center gap-2"
              onClick={handleGoogleClick}
              disabled={isGoogleLoading || isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-gray-900">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-gray-900">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-900 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
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
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-black text-white border-black hover:bg-gray-900 flex items-center justify-center gap-2"
              onClick={handleGoogleClick}
              disabled={isGoogleLoading || isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-gray-900">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-gray-900">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-gray-900">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white"
                />
                <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-900 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

