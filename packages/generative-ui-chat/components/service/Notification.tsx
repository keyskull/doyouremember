// generative-ui-chat/components/service/notification.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: Date;
}

interface NotificationProps {
    notifications: Notification[];
    onDismiss: (id: string) => void;
    onDismissAll: () => void;
}

const getIconForType = (type: Notification['type']) => {
    switch (type) {
        case 'info':
            return 'mdi:information';
        case 'success':
            return 'mdi:check-circle';
        case 'warning':
            return 'mdi:alert';
        case 'error':
            return 'mdi:close-circle';
    }
};

const getColorForType = (type: Notification['type']) => {
    switch (type) {
        case 'info':
            return 'primary';
        case 'success':
            return 'success';
        case 'warning':
            return 'warning';
        case 'error':
            return 'danger';
    }
};

export const Notification: React.FC<NotificationProps> = ({
    notifications,
    onDismiss,
    onDismissAll
}) => {
    const [expandedNotifications, setExpandedNotifications] = useState<string[]>([]);

    useEffect(() => {
        // Automatically expand new notifications
        const newIds = notifications.map(n => n.id);
        setExpandedNotifications(prev => [...([...prev, ...newIds])]);
    }, [notifications]);

    const toggleExpand = (id: string) => {
        setExpandedNotifications(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const formatTimestamp = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardBody className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-large font-bold">Notifications</h4>
                    {notifications.length > 0 && (
                        <Button size="sm" variant="light" onClick={onDismissAll}>
                            Clear All
                        </Button>
                    )}
                </div>
                {notifications.length === 0 ? (
                    <p className="text-center text-default-500">No new notifications</p>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`w-full cursor-pointer`}
                                onPress={() => toggleExpand(notification.id)}
                            >
                                <CardBody className="p-3">
                                    <div className="flex items-start">
                                        <Badge content="" color={getColorForType(notification.type)} shape="circle" className="mr-3 mt-1">
                                            <Icon icon={getIconForType(notification.type)} width={24} />
                                        </Badge>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <p className={`font-semibold text-${getColorForType(notification.type)}`}>
                                                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    isIconOnly
                                                    variant="light"
                                                    onClick={(e) => {
                                                        onDismiss(notification.id);
                                                    }}

                                                >
                                                    <Icon icon="mdi:close" />
                                                </Button>
                                            </div>
                                            <p className={expandedNotifications.includes(notification.id) ? '' : 'line-clamp-2'}>
                                                {notification.message}
                                            </p>
                                            <p className="text-tiny text-default-400 mt-1">
                                                {formatTimestamp(notification.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

export const NotificationExample = () => {
    const date = Date.now();
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'info',
            message: 'Your order has been shipped.',
            timestamp: new Date()
        },
        {
            id: '2',
            type: 'success',
            message: 'Your payment was successful.',
            timestamp: new Date(date - 3600000) // 1 hour ago
        },
        {
            id: '3',
            type: 'warning',
            message: 'Your subscription will expire soon.',
            timestamp: new Date(date - 7200000) // 2 hours ago
        },
        {
            id: '4',
            type: 'error',
            message: 'There was an error processing your request. Please try again later.',
            timestamp: new Date(date - 10800000) // 3 hours ago
        }
    ]);

    const handleDismiss = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleDismissAll = () => {
        setNotifications([]);
    };

    return (
        <Notification
            notifications={notifications}
            onDismiss={handleDismiss}
            onDismissAll={handleDismissAll}
        />
    );
};