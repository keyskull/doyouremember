// generative-ui-chat/components/ecommerce/support.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Accordion, AccordionItem, Button, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

interface FAQItem {
  question: string;
  answer: string;
}

interface SupportTicket {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How can I track my order?",
    answer: "You can track your order by logging into your account and visiting the 'Order History' section. There, you'll find a 'Track Order' button next to your recent orders."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Products must be in their original condition and packaging. Please visit our Returns page for more detailed information."
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping times vary depending on your location and the shipping method chosen. Standard shipping typically takes 3-5 business days, while express shipping can take 1-2 business days."
  },
];

export const SupportInterface: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ticketForm, setTicketForm] = useState<SupportTicket>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field: keyof SupportTicket, value: string) => {
    setTicketForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support ticket submitted:', ticketForm);
    // Here you would typically send this data to your backend
    onClose();
    // Reset form
    setTicketForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-col items-start px-4 pt-4 pb-0">
        <h2 className="text-2xl font-bold">Customer Support</h2>
        <p className="text-default-500">How can we help you today?</p>
      </CardHeader>
      <CardBody className="px-4 py-4">
        <Accordion>
          <AccordionItem key="faq" aria-label="Frequently Asked Questions" title="Frequently Asked Questions">
            {faqItems.map((item, index) => (
              <Accordion key={index} className="px-0">
                <AccordionItem key={index} aria-label={item.question} title={item.question}>
                  <p className="text-small text-default-500">{item.answer}</p>
                </AccordionItem>
              </Accordion>
            ))}
          </AccordionItem>
        </Accordion>

        <div className="mt-6 space-y-4">
          <Button 
            color="primary" 
            startContent={<Icon icon="mdi:chat" />}
            className="w-full"
          >
            Start Live Chat
          </Button>
          <Button
            color="secondary"
            variant="bordered"
            startContent={<Icon icon="mdi:email-outline" />}
            className="w-full"
            onPress={onOpen}
          >
            Submit Support Ticket
          </Button>
        </div>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Submit a Support Ticket</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <Input
                  label="Name"
                  placeholder="Enter your name"
                  value={ticketForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  value={ticketForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                <Input
                  label="Subject"
                  placeholder="Enter the subject of your inquiry"
                  value={ticketForm.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                />
                <Textarea
                  label="Message"
                  placeholder="Describe your issue or question"
                  value={ticketForm.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                />
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleSubmitTicket}>
                Submit Ticket
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
};

export const SupportInterfaceExample = () => {
  return <SupportInterface />;
};