// generative-ui-chat/components/service/policy.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Accordion, AccordionItem, Link } from "@heroui/react";
import { Icon } from "@iconify/react";

interface PolicySection {
  id: string;
  title: string;
  content: string;
}

interface PolicyProps {
  policyName: string;
  lastUpdated: string;
  sections: PolicySection[];
  contactEmail: string;
}

export const Policy: React.FC<PolicyProps> = ({
  policyName,
  lastUpdated,
  sections,
  contactEmail
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-col items-start px-4 pt-4 pb-0">
        <h2 className="text-2xl font-bold">{policyName}</h2>
        <p className="text-small text-default-500">Last Updated: {lastUpdated}</p>
      </CardHeader>
      <CardBody className="px-4 py-4">
        <Accordion>
          {sections.map((section) => (
            <AccordionItem
              key={section.id}
              aria-label={section.title}
              title={section.title}
              indicator={({ isOpen }) => (
                <Icon
                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  icon="mdi:chevron-down"
                />
              )}
            >
              <div className="text-small whitespace-pre-wrap">{section.content}</div>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-6 text-center">
          <p className="text-small text-default-500">
            If you have any questions about this {policyName}, please contact us at{' '}
            <Link href={`mailto:${contactEmail}`} color="primary">
              {contactEmail}
            </Link>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export const PolicyExample = () => {
  const privacyPolicySections: PolicySection[] = [
    {
      id: '1',
      title: 'Information We Collect',
      content: `We collect several types of information from and about users of our Website, including information:
• By which you may be personally identified, such as name, postal address, e-mail address, telephone number, or any other identifier by which you may be contacted online or offline ("personal information");
• That is about you but individually does not identify you, such as your internet connection, the equipment you use to access our Website, and usage details.`
    },
    {
      id: '2',
      title: 'How We Use Your Information',
      content: `We use information that we collect about you or that you provide to us, including any personal information:
• To present our Website and its contents to you.
• To provide you with information, products, or services that you request from us.
• To fulfill any other purpose for which you provide it.
• To carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.
• To notify you about changes to our Website or any products or services we offer or provide though it.`
    },
    {
      id: '3',
      title: 'Disclosure of Your Information',
      content: `We may disclose aggregated information about our users, and information that does not identify any individual, without restriction. We may disclose personal information that we collect or you provide as described in this privacy policy:
• To our subsidiaries and affiliates.
• To contractors, service providers, and other third parties we use to support our business.
• To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of our assets.`
    },
  ];

  return (
    <Policy
      policyName="Privacy Policy"
      lastUpdated="June 1, 2023"
      sections={privacyPolicySections}
      contactEmail="privacy@example.com"
    />
  );
};