// generative-ui-chat/components/auth/profile.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Avatar, Textarea, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  phone: string;
  notificationsEnabled: boolean;
}

interface ProfileProps {
  userProfile: UserProfile;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => Promise<void>;
}

export const Profile: React.FC<ProfileProps> = ({ userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof UserProfile, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdateProfile(profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col items-center pb-0">
        <h2 className="text-2xl font-bold">User Profile</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <Avatar src={profile.avatar} size="lg" />
          </div>
          <Input
            label="Name"
            value={profile.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={!isEditing}
          />
          <Input
            label="Email"
            type="email"
            value={profile.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={!isEditing}
          />
          <Input
            label="Phone"
            type="tel"
            value={profile.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={!isEditing}
          />
          <Textarea
            label="Bio"
            value={profile.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
          />
          <div className="flex items-center justify-between">
            <span>Enable Notifications</span>
            <Switch
              checked={profile.notificationsEnabled}
              onChange={(e) => handleInputChange('notificationsEnabled', e.target.checked)}
              disabled={!isEditing}
            />
          </div>
          {isEditing ? (
            <div className="flex justify-end space-x-2">
              <Button 
                color="danger" 
                variant="light"
                onPress={() => {
                  setIsEditing(false);
                  setProfile(userProfile);
                }}
              >
                Cancel
              </Button>
              <Button 
                color="primary" 
                type="submit"
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <Button 
              color="primary" 
              onPress={() => setIsEditing(true)}
              startContent={<Icon icon="mdi:pencil" />}
            >
              Edit Profile
            </Button>
          )}
        </form>
      </CardBody>
    </Card>
  );
};

export const ProfileExample = () => {
  const mockUserProfile: UserProfile = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    bio: "Software developer and tech enthusiast.",
    phone: "+1 (555) 123-4567",
    notificationsEnabled: true,
  };

  const handleUpdateProfile = async (updatedProfile: Partial<UserProfile>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Profile updated:", updatedProfile);
    // In a real application, you would send this data to your backend
  };

  return <Profile userProfile={mockUserProfile} onUpdateProfile={handleUpdateProfile} />;
};