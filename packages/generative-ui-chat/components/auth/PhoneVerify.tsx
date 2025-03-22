// generative-ui-chat/components/auth/phone-verify.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button, Input, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";

interface PhoneVerifyProps {
  phoneNumber: string;
  onVerify: (code: string) => Promise<boolean>;
  onResendCode: () => Promise<void>;
}

export const PhoneVerify: React.FC<PhoneVerifyProps> = ({ phoneNumber, onVerify, onResendCode }) => {
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
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }
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
    (<Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center pb-0">
        <h2 className="text-2xl font-bold">Verify Your Phone Number</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <p className="text-center">
          We&apos;ve sent a verification code to <strong>{phoneNumber}</strong>. 
          Please enter the 6-digit code below to verify your phone number.
        </p>
        <Input
          type="text"
          label="Verification Code"
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
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
          {isVerifying ? 'Verifying...' : 'Verify Phone Number'}
        </Button>
        <div className="text-center">
          <Button
            variant="light"
            onPress={handleResendCode}
            isDisabled={countdown > 0 || isResending}
            startContent={<Icon icon="mdi:cellphone-message" />}
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
    </Card>)
  );
};

export const PhoneVerifyExample = () => {
  const mockPhoneNumber = "+1 (555) 123-4567";

  const handleVerify = async (code: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return code === "123456"; // Mock verification
  };

  const handleResendCode = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Verification code resent to phone");
  };

  return (
    <PhoneVerify
      phoneNumber={mockPhoneNumber}
      onVerify={handleVerify}
      onResendCode={handleResendCode}
    />
  );
};