// generative-ui-chat/components/service/service-description.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Image, Accordion, AccordionItem, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface ServiceDescriptionProps {
  serviceName: string;
  description: string;
  imageUrl: string;
  features: ServiceFeature[];
  pricingTiers: PricingTier[];
  faqs: FAQ[];
  onSubscribe: (tierName: string) => void;
}

export const ServiceDescription: React.FC<ServiceDescriptionProps> = ({
  serviceName,
  description,
  imageUrl,
  features,
  pricingTiers,
  faqs,
  onSubscribe
}) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Service Overview */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-2">{serviceName}</h2>
              <p className="text-default-500">{description}</p>
              <Button color="primary" className="mt-4" onPress={() => selectedTier && onSubscribe(selectedTier)}>
                Get Started
              </Button>
            </div>
            <div className="md:w-1/2">
              <Image
                src={imageUrl}
                alt={serviceName}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="px-4 pt-4 pb-0">
          <h3 className="text-xl font-semibold">Features</h3>
        </CardHeader>
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Icon icon={feature.icon} className="text-2xl text-primary" />
                <div>
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="text-small text-default-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader className="px-4 pt-4 pb-0">
          <h3 className="text-xl font-semibold">Pricing</h3>
        </CardHeader>
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={selectedTier === tier.name ? 'border-primary' : ''}>
                <CardBody className="p-4">
                  <h4 className="text-lg font-semibold">{tier.name}</h4>
                  <div className="my-2">
                    <span className="text-2xl font-bold">${tier.price}</span>
                    <span className="text-small text-default-500">/{tier.interval}</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center">
                        <Icon icon="mdi:check" className="text-success mr-2" />
                        <span className="text-small">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    color={selectedTier === tier.name ? "primary" : "default"}
                    variant={selectedTier === tier.name ? "solid" : "bordered"}
                    onPress={() => setSelectedTier(tier.name)}
                    className="w-full"
                  >
                    {selectedTier === tier.name ? 'Selected' : 'Select'}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader className="px-4 pt-4 pb-0">
          <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
        </CardHeader>
        <CardBody className="p-4">
          <Accordion>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} aria-label={faq.question} title={faq.question}>
                <p className="text-default-500">{faq.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>
    </div>
  );
};

export const ServiceDescriptionExample = () => {
  const exampleService: ServiceDescriptionProps = {
    serviceName: "CloudBoost Pro",
    description: "Supercharge your cloud infrastructure with our advanced management and optimization tools.",
    imageUrl: "/api/placeholder/500/300",
    features: [
      {
        icon: "mdi:cloud-sync",
        title: "Automated Syncing",
        description: "Keep your data in sync across all devices with real-time cloud synchronization."
      },
      {
        icon: "mdi:shield-check",
        title: "Enhanced Security",
        description: "Bank-level encryption and advanced threat protection to keep your data safe."
      },
      {
        icon: "mdi:chart-line",
        title: "Performance Analytics",
        description: "Gain insights into your cloud performance with detailed analytics and reporting."
      },
      {
        icon: "mdi:account-group",
        title: "Team Collaboration",
        description: "Seamlessly work together with integrated team collaboration tools."
      }
    ],
    pricingTiers: [
      {
        name: "Basic",
        price: 9.99,
        interval: "month",
        features: ["5GB Storage", "Basic Analytics", "24/7 Support"]
      },
      {
        name: "Pro",
        price: 19.99,
        interval: "month",
        features: ["50GB Storage", "Advanced Analytics", "Priority Support", "API Access"]
      },
      {
        name: "Enterprise",
        price: 49.99,
        interval: "month",
        features: ["Unlimited Storage", "Custom Analytics", "Dedicated Support", "Advanced API Access", "Custom Integrations"]
      }
    ],
    faqs: [
      {
        question: "How does the 14-day free trial work?",
        answer: "You can use CloudBoost Pro for free for 14 days. No credit card is required to start your trial. You'll have full access to all features during this period."
      },
      {
        question: "Can I upgrade or downgrade my plan at any time?",
        answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
      },
      {
        question: "Is there a long-term contract?",
        answer: "No, our services are provided on a month-to-month basis. You can cancel at any time without any long-term commitment."
      }
    ],
    onSubscribe: (tierName: string) => {
      console.log(`Subscribed to ${tierName} tier`);
      // Here you would typically handle the subscription process
    }
  };

  return <ServiceDescription {...exampleService} />;
};