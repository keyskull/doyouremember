// generative-ui-chat/components/auth/signup.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Link, Divider, Checkbox } from "@heroui/react";
import { Icon } from "@iconify/react";

interface SignUpProps {
  onSignUp: (email: string, password: string) => void;
  onSocialSignUp?: (provider: 'google' | 'github') => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSignUp, onSocialSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!agreeTerms) {
      alert("Please agree to the terms and conditions!");
      return;
    }
    onSignUp(email, password);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center pb-0">
        <h2 className="text-2xl font-bold">Sign Up</h2>
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Checkbox
            isSelected={agreeTerms}
            onValueChange={setAgreeTerms}
          >
            I agree to the <Link href="/terms">terms and conditions</Link>
          </Checkbox>
          <Button color="primary" type="submit" className="w-full">
            Sign Up
          </Button>
        </form>

        <Divider className="my-4" />

        {onSocialSignUp && (
          <div className="space-y-2">
            <Button 
              variant="bordered" 
              startContent={<Icon icon="flat-color-icons:google" />}
              className="w-full"
              onPress={() => onSocialSignUp('google')}
            >
              Sign up with Google
            </Button>
            <Button 
              variant="bordered" 
              startContent={<Icon icon="mdi:github" />}
              className="w-full"
              onPress={() => onSocialSignUp('github')}
            >
              Sign up with GitHub
            </Button>
          </div>
        )}

        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link href="/signin" color="primary">
            Sign in
          </Link>
        </p>
      </CardBody>
    </Card>
  );
};

export const SignUpExample = ({ skipSocialSignUp = false }: { skipSocialSignUp?: boolean }) => {
  const handleSignUp = (email: string, password: string) => {
    console.log('Sign up attempt', { email, password });
    // Here you would typically handle the sign-up logic
  };

  const handleSocialSignUp = (provider: 'google' | 'github') => {
    console.log('Social sign up with', provider);
    // Here you would typically handle the social sign-up logic
  };

  return (
    <SignUp 
      onSignUp={handleSignUp} 
      onSocialSignUp={!skipSocialSignUp ? handleSocialSignUp : undefined}
    />
  );
};