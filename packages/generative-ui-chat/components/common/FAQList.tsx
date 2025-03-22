// generative-ui-chat/components/common/faq-list.tsx
'use client';
import React, { useState } from 'react';
import { Accordion, AccordionItem, Selection } from "@heroui/react";
import { Icon } from '@iconify/react/dist/iconify.js';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

interface FAQListProps {
    faqs: FAQItem[];
}




export const FAQList: React.FC<FAQListProps> = ({ faqs }) => {
    const [expandedKeys, setExpandedKeys] = useState<Selection>('all');

    const handleSelectionChange = (keys: Selection) => {
        setExpandedKeys(keys);
    };

    return (
        <Accordion
            className="px-0"
            selectedKeys={expandedKeys}
            onSelectionChange={handleSelectionChange}
        >
            {faqs.map((faq) => (
                <AccordionItem
                    key={faq.id}
                    aria-label={faq.question}
                    title={faq.question}
                    indicator={({ isOpen }) => (
                        <Icon
                            icon={"mdi:chevron-down-up"}
                            className={`transition-transform ${isOpen ? 'rotate-180' : ''
                                }`}
                        />
                    )}
                >
                    <div className="text-small text-default-500">{faq.answer}</div>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export const FAQListExample = () => {
    const FAQListExampleProps = {
        faqs: [
            {
                id: '1',
                question: 'What is Generative UI?',
                answer: 'Generative UI is a new way to create user interfaces using code.'
            },
            {
                id: '2',
                question: 'How does Generative UI work?',
                answer: 'Generative UI uses algorithms to generate UI components.'
            }
        ]
    };
    
    return <FAQList faqs={FAQListExampleProps.faqs} />;
}