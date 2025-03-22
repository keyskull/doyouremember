// generative-ui-chat/components/service/service-list.tsx
'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardBody, CardFooter, Button, Image, Input, Select, SelectItem, Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Service {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    imageUrl: string;
}

interface ServiceListProps {
    services: Service[];
    onServiceSelect: (service: Service) => void;
}

export const ServiceList: React.FC<ServiceListProps> = ({ services, onServiceSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    const categories = useMemo(() => {
        const cats = new Set(services.map(service => service.category));
        return ['all', ...Array.from(cats)];
    }, [services]);

    const filteredAndSortedServices = useMemo(() => {
        return services
            .filter(service =>
                (selectedCategory === 'all' || service.category === selectedCategory) &&
                (service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    service.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .sort((a, b) => {
                if (sortBy === 'name') return a.name.localeCompare(b.name);
                if (sortBy === 'price') return a.price - b.price;
                return 0;
            });
    }, [services, selectedCategory, searchTerm, sortBy]);

    const paginatedServices = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedServices.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedServices, currentPage]);

    const totalPages = Math.ceil(filteredAndSortedServices.length / itemsPerPage);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startContent={<Icon icon="mdi:magnify" />}
                    className="flex-grow"
                />
                <Select
                    placeholder="Category"
                    selectedKeys={[selectedCategory]}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-48"
                >
                    {categories.map((category) => (
                        <SelectItem key={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                    ))}
                </Select>
                <Select
                    placeholder="Sort by"
                    selectedKeys={[sortBy]}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-48"
                >
                    <SelectItem key="name">Name</SelectItem>
                    <SelectItem key="price">Price</SelectItem>
                </Select>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {paginatedServices.map((service) => (
                    <Card key={service.id} className="h-full">
                        <CardBody className="p-0 flex flex-row">
                            <Image
                                src={service.imageUrl}
                                alt={service.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{service.name}</h3>
                                <p className="text-small text-default-500 mt-1">{service.description}</p>
                                <p className="text-default-400 mt-2">Category: {service.category}</p>
                                <p className="font-semibold mt-2">${service.price.toFixed(2)}</p>
                            </div>
                        </CardBody>
                        <CardFooter className="justify-end">
                            <Button color="primary" onPress={() => onServiceSelect(service)}>
                                View Details
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <Pagination
                        total={totalPages}
                        initialPage={1}
                        page={currentPage}
                        onChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export const ServiceListExample = () => {
    const exampleServices: Service[] = [
        {
            id: '1',
            name: 'Web Development',
            description: 'Custom website development tailored to your needs',
            category: 'development',
            price: 1500,
            imageUrl: '/api/placeholder/500/300'
        },
        {
            id: '2',
            name: 'Logo Design',
            description: 'Professional logo design to represent your brand',
            category: 'design',
            price: 500,
            imageUrl: '/api/placeholder/500/300'
        },
        {
            id: '3',
            name: 'SEO Optimization',
            description: "Improve your website's search engine rankings",
            category: 'marketing',
            price: 800,
            imageUrl: '/api/placeholder/500/300'
        },
        {
            id: '4',
            name: 'Mobile App Development',
            description: 'Create a custom mobile app for your business',
            category: 'development',
            price: 3000,
            imageUrl: '/api/placeholder/500/300'
        },
        {
            id: '5',
            name: 'Content Writing',
            description: 'High-quality content creation for your website or blog',
            category: 'content',
            price: 300,
            imageUrl: '/api/placeholder/500/300'
        },
        {
            id: '6',
            name: 'Social Media Management',
            description: 'Manage and grow your social media presence',
            category: 'marketing',
            price: 600,
            imageUrl: '/api/placeholder/500/300'
        },
        {
            id: '7',
            name: 'E-commerce Solution',
            description: 'Set up and customize your online store',
            category: 'development',
            price: 2000,
            imageUrl: '/api/placeholder/500/300'
        }
    ];

    const handleServiceSelect = (service: Service) => {
        console.log('Selected service:', service);
        // Here you would typically navigate to a service detail page or open a modal
    };

    return <ServiceList services={exampleServices} onServiceSelect={handleServiceSelect} />;
};