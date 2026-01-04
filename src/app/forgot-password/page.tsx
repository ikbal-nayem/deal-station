
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import SplashScreen from '@/components/layout/SplashScreen';
import { useRouter } from 'next/navigation';
import { ROLES } from '@/constants/auth.constant';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn, isAuthLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
		if (!isAuthLoading && isLoggedIn) {
			if (user?.roles.includes(ROLES.ADMIN)) {
				router.replace('/admin');
			} else if (user?.roles.includes(ROLES.OPERATOR)) {
				router.replace('/dashboard');
			} else {
				router.replace('/');
			}
		}
	}, [isLoggedIn, isAuthLoading, user, router]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In a real app, you'd call your backend.
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset requested for:', email);

    setIsLoading(false);
    toast({
        title: "Password Reset Sent",
        description: "If an account exists for that email, a reset link has been sent.",
    })
  };

  if (isAuthLoading || isLoggedIn) {
    return <SplashScreen />;
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background">
       <Header />
       <div className="flex flex-1 items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold font-headline">
              <KeyRound className="inline-block mr-2" />
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>
          <CardContent className="mt-4 text-center text-sm flex flex-col gap-4">
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Back to Login
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                Back to Home
              </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
