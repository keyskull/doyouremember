// generative-ui-chat/components/auth/change-password.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ChangePasswordProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    if (passwordStrength(newPassword) < 3) {
      setError("New password is not strong enough.");
      return;
    }

    setIsLoading(true);
    try {
      await onChangePassword(currentPassword, newPassword);
      setSuccess(true);
    } catch (err) {
      setError('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardBody className="py-8 px-4">
          <div className="text-center">
            <Icon icon="mdi:check-circle" className="text-success text-4xl mb-4" />
            <h2 className="text-2xl font-bold mb-2">Password Changed Successfully</h2>
            <p>Your password has been updated. You can now use your new password to log in.</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center pb-0">
        <h2 className="text-2xl font-bold">Change Password</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            label="New Password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Progress
            value={passwordStrength(newPassword) * 25}
            className="mb-2"
            color={passwordStrength(newPassword) >= 3 ? "success" : "warning"}
          />
          <Input
            type="password"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export const ChangePasswordExample = () => {
  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Password changed successfully');
    // In a real application, you would send a request to your backend to change the password
  };

  return <ChangePassword onChangePassword={handleChangePassword} />;
};