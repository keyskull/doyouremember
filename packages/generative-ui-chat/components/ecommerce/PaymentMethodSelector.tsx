// generative-ui-chat/components/ecommerce/payment-method.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Radio, RadioGroup, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from "@heroui/react";
import { Icon } from "@iconify/react";

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal';
  last4: string;
  expiryDate?: string;
}

interface PaymentMethodProps {
  paymentMethods: PaymentMethod[];
  selectedMethod: string;
  onSelectMethod: (id: string) => void;
  onAddMethod: (method: PaymentMethod) => void;
}

const getPaymentIcon = (type: PaymentMethod['type']) => {
  switch (type) {
    case 'credit':
    case 'debit':
      return <Icon icon="mdi:credit-card" className="text-2xl" />;
    case 'paypal':
      return <Icon icon="mdi:paypal" className="text-2xl" />;
  }
};

export const PaymentMethodSelector: React.FC<PaymentMethodProps> = ({
  paymentMethods,
  selectedMethod,
  onSelectMethod,
  onAddMethod
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCVV, setNewCardCVV] = useState("");

  const handleAddNewCard = () => {
    // In a real application, you would typically make an API call here
    // to validate and save the new card details securely
    const newMethod: PaymentMethod = {
      id: `card_${Date.now()}`,
      type: 'credit',
      last4: newCardNumber.slice(-4),
      expiryDate: newCardExpiry
    };
    onAddMethod(newMethod);
    setNewCardNumber("");
    setNewCardExpiry("");
    setNewCardCVV("");
    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex justify-between items-center">
        <h4 className="text-large font-bold">Payment Method</h4>
        <Button variant="light" onPress={onOpen}>
          Add New
        </Button>
      </CardHeader>
      <CardBody>
        <RadioGroup
          value={selectedMethod}
          onValueChange={onSelectMethod}
        >
          {paymentMethods.map((method) => (
            <Radio key={method.id} value={method.id}>
              <div className="flex items-center">
                {getPaymentIcon(method.type)}
                <div className="ml-2">
                  <p className="font-semibold">{method.type.charAt(0).toUpperCase() + method.type.slice(1)}</p>
                  <p className="text-small text-default-500">
                    {method.type === 'paypal' ? 'PayPal Account' : `**** **** **** ${method.last4}`}
                  </p>
                  {method.expiryDate && (
                    <p className="text-tiny text-default-400">Expires {method.expiryDate}</p>
                  )}
                </div>
              </div>
            </Radio>
          ))}
        </RadioGroup>
      </CardBody>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Add New Payment Method</ModalHeader>
          <ModalBody>
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={newCardNumber}
              onChange={(e) => setNewCardNumber(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={newCardExpiry}
                onChange={(e) => setNewCardExpiry(e.target.value)}
              />
              <Input
                label="CVV"
                placeholder="123"
                type="password"
                value={newCardCVV}
                onChange={(e) => setNewCardCVV(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant='flat' color="danger" onPress={onClose}>
              Cancel
            </Button>
            <Button onPress={handleAddNewCard} disabled={!newCardNumber || !newCardExpiry || !newCardCVV}>
              Add Card
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export const PaymentMethodSelectorExample = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "card_1", type: "credit", last4: "4242", expiryDate: "12/24" },
    { id: "card_2", type: "debit", last4: "1234", expiryDate: "10/25" },
    { id: "paypal_1", type: "paypal", last4: "5678" }
  ]);
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);

  const handleAddMethod = (newMethod: PaymentMethod) => {
    setPaymentMethods([...paymentMethods, newMethod]);
    setSelectedMethod(newMethod.id);
  };

  return (
    <PaymentMethodSelector
      paymentMethods={paymentMethods}
      selectedMethod={selectedMethod}
      onSelectMethod={setSelectedMethod}
      onAddMethod={handleAddMethod}
    />
  );
};