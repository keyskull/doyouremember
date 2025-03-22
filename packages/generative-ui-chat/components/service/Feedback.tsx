// generative-ui-chat/components/service/feedback.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Textarea, Button, Radio, RadioGroup, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";

interface FeedbackProps {
  onSubmit: (feedback: FeedbackData) => void;
}

interface FeedbackData {
  rating: number;
  title: string;
  description: string;
  name: string;
  email: string;
}

export const Feedback: React.FC<FeedbackProps> = ({ onSubmit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    title: '',
    description: '',
    name: '',
    email: ''
  });

  const handleInputChange = (field: keyof FeedbackData, value: string | number) => {
    setFeedback(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(feedback);
    onOpen(); // Open thank you modal
    // Reset form
    setFeedback({
      rating: 0,
      title: '',
      description: '',
      name: '',
      email: ''
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-start px-4 pt-4 pb-0">
        <h4 className="text-large font-bold">Feedback</h4>
        <p className="text-small text-default-500">We value your opinion!</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RadioGroup
            label="How would you rate your experience?"
            orientation="horizontal"
            value={feedback.rating.toString()}
            onValueChange={(value) => handleInputChange('rating', parseInt(value))}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <Radio key={value} value={value.toString()}>
                {value}
              </Radio>
            ))}
          </RadioGroup>

          <Input
            label="Title"
            placeholder="Brief summary of your feedback"
            value={feedback.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />

          <Textarea
            label="Description"
            placeholder="Please provide more details about your experience"
            value={feedback.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
          />

          <Input
            label="Name"
            placeholder="Your name (optional)"
            value={feedback.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Your email (optional)"
            value={feedback.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />

          <Button color="primary" type="submit" className="w-full">
            Submit Feedback
          </Button>
        </form>
      </CardBody>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Thank You!</ModalHeader>
          <ModalBody>
            <p>We appreciate your feedback. It helps us improve our services.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export const FeedbackExample = () => {
  const handleSubmit = (feedbackData: FeedbackData) => {
    console.log('Feedback submitted:', feedbackData);
    // Here you would typically send this data to your backend
  };

  return <Feedback onSubmit={handleSubmit} />;
};