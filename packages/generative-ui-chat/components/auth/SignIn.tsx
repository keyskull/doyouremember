// generative-ui-chat/components/auth/signin.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Link, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

interface SignInProps {
  onSignIn: (email: string, password: string) => void;
  onSocialSignIn?: (provider: 'google' | 'github') => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSignIn, onSocialSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center pb-0">
        <h2 className="text-2xl font-bold">Sign In</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button color="primary" type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <Divider className="my-4" />

        {onSocialSignIn && (
          <div className="space-y-2">
            <Button 
              variant="bordered" 
              startContent={<Icon icon="flat-color-icons:google" />}
              className="w-full"
              onPress={() => onSocialSignIn('google')}
            >
              Sign in with Google
            </Button>
            <Button 
              variant="bordered" 
              startContent={<Icon icon="mdi:github" />}
              className="w-full"
              onPress={() => onSocialSignIn('github')}
            >
              Sign in with GitHub
            </Button>
          </div>
        )}

        <p className="text-center mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" color="primary">
            Sign up
          </Link>
        </p>
      </CardBody>
    </Card>
  );
};

export const SignInExample = ({ skipSocialSignUp = false }: { skipSocialSignUp?: boolean }) => {
  const handleSignIn = (email: string, password: string) => {
    console.log('Sign in attempt', { email, password });
    // Here you would typically handle the sign-in logic
  };

  const handleSocialSignIn = (provider: 'google' | 'github') => {
    console.log('Social sign in with', provider);
    // Here you would typically handle the social sign-in logic
  };

  return <SignIn onSignIn={handleSignIn} onSocialSignIn={!skipSocialSignUp ? handleSocialSignIn : undefined} />;
};