// generative-ui-chat/components/service/booking.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Select, SelectItem, Textarea, DatePicker } from "@heroui/react";
import { DateValue } from "@heroui/react";

interface ServiceBookingProps {
    services: { id: string; name: string }[];
    onSubmit: (bookingData: BookingData) => void;
}

interface BookingData {
    service: string;
    date: DateValue | null;
    time: string;
    name: string;
    email: string;
    phone: string;
    notes: string;
}

export const ServiceBooking: React.FC<ServiceBookingProps> = ({ services, onSubmit }) => {
    const [bookingData, setBookingData] = useState<BookingData>({
        service: '',
        date: null,
        time: '',
        name: '',
        email: '',
        phone: '',
        notes: '',
    });

    const handleInputChange = (field: keyof BookingData, value: string | DateValue | null) => {
        setBookingData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (bookingData.date) {
            onSubmit(bookingData);
        } else {
            console.error("Date is required");
            // You might want to show an error message to the user here
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="flex flex-col items-start px-4 pt-4 pb-0">
                <h4 className="text-large font-bold">Book a Service</h4>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        label="Service"
                        placeholder="Select a service"
                        selectedKeys={bookingData.service ? [bookingData.service] : []}
                        onChange={(e) => handleInputChange('service', e.target.value)}
                        required
                    >
                        {services.map((service) => (
                            <SelectItem key={service.id} >
                                {service.name}
                            </SelectItem>
                        ))}
                    </Select>

                    <DatePicker
                        label="Date"
                        value={bookingData.date}
                        onChange={(date) => handleInputChange('date', date)}
                    />

                    <Input
                        label="Time"
                        type="time"
                        value={bookingData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        required
                    />

                    <Input
                        label="Name"
                        value={bookingData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                    />

                    <Input
                        label="Phone"
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                    />

                    <Textarea
                        label="Additional Notes"
                        value={bookingData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                    />

                    <Button color="primary" type="submit" className="w-full">
                        Book Appointment
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
};

export const ServiceBookingExample = () => {
    const exampleServices = [
        { id: '1', name: 'Haircut' },
        { id: '2', name: 'Massage' },
        { id: '3', name: 'Consultation' },
    ];

    const handleSubmit = (bookingData: BookingData) => {
        console.log('Booking submitted:', bookingData);
        // Here you would typically send this data to your backend
    };

    return <ServiceBooking services={exampleServices} onSubmit={handleSubmit} />;
};