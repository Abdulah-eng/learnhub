import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
}

export function AuthModal({ onClose, onLogin }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to LearnHub</DialogTitle>
          <DialogDescription>
            Login to access your courses and dashboard
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Quick login:</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={fillAdmin} className="flex-1">
              Admin Login
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={fillUser} className="flex-1">
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
