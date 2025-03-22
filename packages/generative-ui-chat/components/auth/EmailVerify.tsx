// generative-ui-chat/components/auth/email-verify.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button, Input, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";

interface EmailVerifyProps {
  email: string;
  onVerify: (code: string) => Promise<boolean>;
  onResendCode: () => Promise<void>;
}

export const EmailVerify: React.FC<EmailVerifyProps> = ({ email, onVerify, onResendCode }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async () => {
    setIsVerifying(true);
    setError(null);
    try {
      const success = await onVerify(verificationCode);
      if (!success) {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError(null);
    try {
      await onResendCode();
      setCountdown(60); // Start a 60-second countdown
    } catch (err) {
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center pb-0">
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <p className="text-center">
          We&apos;ve sent a verification code to <strong>{email}</strong>. 
          Please enter the code below to verify your email address.
        </p>
        <Input
          type="text"
          label="Verification Code"
          placeholder="Enter your verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
        {error && (
          <p className="text-danger text-center">{error}</p>
        )}
        <Button 
          color="primary" 
          className="w-full" 
          onPress={handleVerify}
          isLoading={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify Email'}
        </Button>
        <div className="text-center">
          <Button
            variant="light"
            onPress={handleResendCode}
            isDisabled={countdown > 0 || isResending}
            startContent={<Icon icon="mdi:email-sync" />}
          >
            {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend verification code'}
          </Button>
        </div>
        {isResending && (
          <Progress
            size="sm"
            isIndeterminate
            aria-label="Resending verification code"
            className="max-w-md"
          />
        )}
      </CardBody>
    </Card>
  );
};

export const EmailVerifyExample = () => {
  const mockEmail = "user@example.com";

  const handleVerify = async (code: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return code === "123456"; // Mock verification
  };

  const handleResendCode = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Verification code resent");
  };

  return (
    <EmailVerify
      email={mockEmail}
      onVerify={handleVerify}
      onResendCode={handleResendCode}
    />
  );
};