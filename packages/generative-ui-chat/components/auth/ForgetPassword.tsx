// generative-ui-chat/components/auth/forget-password.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ForgetPasswordProps {
  onSubmit: (email: string) => Promise<void>;
}

export const ForgetPassword: React.FC<ForgetPasswordProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(email);
      setIsSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardBody className="py-8 px-4">
          <div className="text-center">
            <Icon icon="mdi:email-check" className="text-success text-4xl mb-4" />
            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
            <p className="mb-4">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <Link href="/signin" color="primary">
              Return to Sign In
            </Link>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center pb-0">
        <h2 className="text-2xl font-bold">Forgot Password</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-center text-small text-default-500">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && (
            <p className="text-danger text-center">{error}</p>
          )}
          <Button 
            color="primary" 
            type="submit" 
            className="w-full"
            isLoading={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/signin" color="primary">
            Back to Sign In
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

export const ForgetPasswordExample = () => {
  const handleSubmit = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Password reset link sent to: ${email}`);
    // In a real application, you would send a request to your backend to initiate the password reset process
  };

  return <ForgetPassword onSubmit={handleSubmit} />;
}; 