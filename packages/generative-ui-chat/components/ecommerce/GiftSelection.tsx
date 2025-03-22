// generative-ui-chat/components/ecommerce/gift.tsx
'use client'

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Radio, RadioGroup, Textarea, Button, Switch, Input } from "@heroui/react";

interface GiftOption {
  id: string;
  name: string;
  price: number;
}

interface GiftSelectionProps {
  productName: string;
  giftOptions: GiftOption[];
  onSubmit: (giftDetails: GiftDetails) => void;
}

interface GiftDetails {
  isGift: boolean;
  selectedOption?: string;
  message?: string;
  recipientName?: string;
  recipientEmail?: string;
}

export const GiftSelection: React.FC<GiftSelectionProps> = ({
  productName,
  giftOptions,
  onSubmit
}) => {
  const [isGift, setIsGift] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  const handleSubmit = () => {
    const giftDetails: GiftDetails = {
      isGift,
      selectedOption,
      message: message.trim(),
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim()
    };
    onSubmit(giftDetails);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-start px-4 pt-4 pb-0">
        <h4 className="text-large font-bold">Gift Options for {productName}</h4>
      </CardHeader>
      <CardBody className="px-4 py-4">
        <div className="space-y-4">
          <Switch 
            isSelected={isGift}
            onValueChange={setIsGift}
          >
            This is a gift
          </Switch>

          {isGift && (
            <>
              <RadioGroup
                label="Select a gift option"
                value={selectedOption}
                onValueChange={setSelectedOption}
              >
                {giftOptions.map((option) => (
                  <Radio key={option.id} value={option.id}>
                    {option.name} (${option.price.toFixed(2)})
                  </Radio>
                ))}
              </RadioGroup>

              <Textarea
                label="Gift Message"
                placeholder="Enter your gift message here"
                value={message}
                onValueChange={setMessage}
                maxRows={4}
              />

              <Input
                label="Recipient's Name"
                placeholder="Enter recipient's name"
                value={recipientName}
                onValueChange={setRecipientName}
              />

              <Input
                label="Recipient's Email"
                placeholder="Enter recipient's email"
                type="email"
                value={recipientEmail}
                onValueChange={setRecipientEmail}
              />
            </>
          )}

          <Button 
            color="primary" 
            onPress={handleSubmit}
            className="w-full"
          >
            {isGift ? "Add Gift to Cart" : "Add to Cart"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export const GiftSelectionExample = () => {
  const exampleProps: GiftSelectionProps = {
    productName: "Deluxe Gift Basket",
    giftOptions: [
      { id: "gift1", name: "Standard Gift Wrap", price: 5.99 },
      { id: "gift2", name: "Premium Gift Box", price: 12.99 },
      { id: "gift3", name: "Luxury Gift Set", price: 24.99 },
    ],
    onSubmit: (giftDetails: GiftDetails) => {
      console.log("Gift details submitted:", giftDetails);
      // Here you would typically update your cart or send this data to your backend
    }
  };

  return <GiftSelection {...exampleProps} />;
};