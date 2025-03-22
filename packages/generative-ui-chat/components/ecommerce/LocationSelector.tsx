// generative-ui-chat/components/ecommerce/location.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Radio, RadioGroup, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Location {
  id: string;
  name: string;
  address: string;
}

interface LocationSelectorProps {
  currentLocation: Location;
  savedLocations: Location[];
  onLocationChange: (location: Location) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation,
  savedLocations,
  onLocationChange
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedLocation, setSelectedLocation] = useState<string>(currentLocation.id);
  const [newAddress, setNewAddress] = useState("");

  const handleLocationChange = (locationId: string) => {
    const location = savedLocations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(locationId);
      onLocationChange(location);
    }
  };

  const handleAddNewLocation = () => {
    // In a real application, you would typically make an API call here
    // to validate and save the new address
    const newLocation: Location = {
      id: `loc_${Date.now()}`,
      name: "Custom Address",
      address: newAddress
    };
    onLocationChange(newLocation);
    setNewAddress("");
    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex justify-between items-center">
        <h4 className="text-large font-bold">Delivery Location</h4>
        <Button onPress={onOpen}>
          Change
        </Button>
      </CardHeader>
      <CardBody>
        <div className="flex items-start">
          <Icon icon="mdi:map-marker" className="text-primary text-xl mt-1 mr-2" />
          <div>
            <p className="font-semibold">{currentLocation.name}</p>
            <p className="text-small text-default-500">{currentLocation.address}</p>
          </div>
        </div>
      </CardBody>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Select Location</ModalHeader>
          <ModalBody>
            <RadioGroup
              value={selectedLocation}
              onValueChange={handleLocationChange}
            >
              {savedLocations.map((location) => (
                <Radio key={location.id} value={location.id}>
                  <div>
                    <p className="font-semibold">{location.name}</p>
                    <p className="text-small text-default-500">{location.address}</p>
                  </div>
                </Radio>
              ))}
            </RadioGroup>
            <Divider className="my-4" />
            <Input
              label="Add New Address"
              placeholder="Enter your address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant='flat' color="danger" onPress={onClose}>
              Close
            </Button>
            <Button onPress={handleAddNewLocation} disabled={!newAddress}>
              Add New Location
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export const LocationSelectorExample = () => {
  const [currentLocation, setCurrentLocation] = useState<Location>({
    id: "loc_1",
    name: "Home",
    address: "123 Main St, Anytown, USA 12345"
  });

  const savedLocations: Location[] = [
    {
      id: "loc_1",
      name: "Home",
      address: "123 Main St, Anytown, USA 12345"
    },
    {
      id: "loc_2",
      name: "Work",
      address: "456 Business Ave, Cityville, USA 67890"
    },
    {
      id: "loc_3",
      name: "Gym",
      address: "789 Fitness Blvd, Healthytown, USA 13579"
    }
  ];

  return (
    <LocationSelector
      currentLocation={currentLocation}
      savedLocations={savedLocations}
      onLocationChange={setCurrentLocation}
    />
  );
};