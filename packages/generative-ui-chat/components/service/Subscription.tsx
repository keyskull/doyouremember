// generative-ui-chat/components/service/subscription.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Radio, RadioGroup, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface SubscriptionProps {
  currentPlan: SubscriptionPlan;
  availablePlans: SubscriptionPlan[];
  onChangePlan: (newPlanId: string) => void;
  onCancelSubscription: () => void;
}

export const Subscription: React.FC<SubscriptionProps> = ({
  currentPlan,
  availablePlans,
  onChangePlan,
  onCancelSubscription
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan.id);

  const handlePlanChange = () => {
    if (selectedPlan !== currentPlan.id) {
      onChangePlan(selectedPlan);
    }
    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-start px-4 pt-4 pb-0">
        <h4 className="text-large font-bold">Your Subscription</h4>
      </CardHeader>
      <CardBody className="px-4 py-4">
        <div className="mb-4">
          <h5 className="text-medium font-semibold">Current Plan: {currentPlan.name}</h5>
          <p className="text-small text-default-500">${currentPlan.price}/month</p>
          <ul className="list-disc list-inside mt-2">
            {currentPlan.features.map((feature, index) => (
              <li key={index} className="text-small">{feature}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <Button color="primary" onPress={onOpen}>Change Plan</Button>
          <Button color="danger" variant="light" onPress={onCancelSubscription}>Cancel Subscription</Button>
        </div>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Change Subscription Plan</ModalHeader>
            <ModalBody>
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                {availablePlans.map((plan) => (
                  <Radio key={plan.id} value={plan.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{plan.name}</span>
                      <span>${plan.price}/month</span>
                    </div>
                    <ul className="list-disc list-inside mt-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-small text-default-500">{feature}</li>
                      ))}
                    </ul>
                  </Radio>
                ))}
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handlePlanChange}>
                Confirm Change
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
};

export const SubscriptionExample = () => {
  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 9.99,
      features: ['Feature 1', 'Feature 2']
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 19.99,
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 49.99,
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5', 'Priority Support']
    }
  ];

  const [currentPlan, setCurrentPlan] = useState(plans[0]);

  const handleChangePlan = (newPlanId: string) => {
    const newPlan = plans.find(plan => plan.id === newPlanId);
    if (newPlan) {
      setCurrentPlan(newPlan);
      console.log(`Changed to ${newPlan.name}`);
    }
  };

  const handleCancelSubscription = () => {
    console.log('Subscription cancelled');
    // Here you would typically call an API to cancel the subscription
  };

  return (
    <Subscription
      currentPlan={currentPlan}
      availablePlans={plans}
      onChangePlan={handleChangePlan}
      onCancelSubscription={handleCancelSubscription}
    />
  );
};