// generative-ui-chat/components/common/summary.tsx

'use client';
import React from 'react';
import { Card, CardHeader, CardBody, Divider, Button } from "@heroui/react";

interface SummaryItem {
    key: string;
    value: string;
}

interface SummaryProps {
    title: string;
    items: SummaryItem[];
    footer?: React.ReactNode;
}




export const Summary: React.FC<SummaryProps> = ({
    title,
    items,
    footer
}) => {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="flex justify-center">
                <h4 className="text-lg font-semibold">{title}</h4>
            </CardHeader>
            <Divider />
            <CardBody>
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li key={index} className="flex justify-between items-center">
                            <span className="text-sm text-default-500">{item.key}</span>
                            <span className="font-medium">{item.value}</span>
                        </li>
                    ))}
                </ul>
                {footer && (
                    <>
                        <Divider className="my-4" />
                        <div className="mt-2">{footer}</div>
                    </>
                )}
            </CardBody>
        </Card>
    );
};


export const SummaryExample = () => {
    const SummaryExampleProps = {
        title: 'Order Summary',
        items: [
            { key: 'Subtotal', value: '$199.98' },
            { key: 'Tax', value: '$0.00' },
            { key: 'Total', value: '$199.98' },
        ],
        footer: (
            <Button variant="light">
                Confirm Order
            </Button>
        ),
    };
    
    return (
        <Summary
            title={SummaryExampleProps.title}
            items={SummaryExampleProps.items}
            footer={SummaryExampleProps.footer}
        />
    );
}