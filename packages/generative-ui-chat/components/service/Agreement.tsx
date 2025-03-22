// generative-ui-chat/components/service/agreement.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Checkbox, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";

interface AgreementProps {
  title: string;
  content: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const Agreement: React.FC<AgreementProps> = ({
  title,
  content,
  onAccept,
  onDecline
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isChecked, setIsChecked] = useState(false);

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
      onClose();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-start px-4 pt-4 pb-0">
        <h4 className="text-large font-bold">{title}</h4>
      </CardHeader>
      <CardBody className="px-4 py-4">
        <p className="text-small text-default-500">
          Please read and accept our {title} before proceeding.
        </p>
        <Button color="primary" onPress={onOpen} className="mt-4">
          Read {title}
        </Button>
      </CardBody>
      <CardFooter className="px-4 py-4 flex-col items-start">
        <Checkbox
          isSelected={isChecked}
          onValueChange={setIsChecked}
          className="mb-4"
        >
          I have read and agree to the {title}
        </Checkbox>
        <div className="flex w-full justify-between">
          <Button color="danger" variant="light" onPress={onDecline}>
            Decline
          </Button>
          <Button color="primary" onPress={handleAccept} isDisabled={!isChecked}>
            Accept
          </Button>
        </div>
      </CardFooter>

      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <div className="max-h-96 overflow-y-auto">
              <p className="whitespace-pre-wrap">{content}</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export const AgreementExample = () => {
  const termsOfService = `
Terms of Service

1. Acceptance of Terms
By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.

2. Description of Service
The service provides users with access to [description of your service].

3. User Conduct
You agree to use the service for lawful purposes only. You must not use the service in any way that causes, or may cause, damage to the service or impairment of the availability or accessibility of the service.

4. Termination
We may terminate or suspend your access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

5. Limitation of Liability
In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.

6. Changes
We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.

7. Contact Us
If you have any questions about these Terms, please contact us.
  `;

  const handleAccept = () => {
    console.log("Terms of Service accepted");
    // Here you would typically update user's status in your backend
  };

  const handleDecline = () => {
    console.log("Terms of Service declined");
    // Here you might redirect the user or disable certain features
  };

  return (
    <Agreement
      title="Terms of Service"
      content={termsOfService}
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
};