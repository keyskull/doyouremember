// generative-ui-chat/components/ecommerce/location-with-map.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Radio, RadioGroup, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
// import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface LocationWithMapProps {
  currentLocation: Location;
  savedLocations: Location[];
  onLocationChange: (location: Location) => void;
}

const MapMarker: React.FC<{ location: Location }> = ({ location }) => {
  // const map = useMap();
  
  // useEffect(() => {
    // map.setView([location.lat, location.lng], 13);
  // }, [location, map]);

  // return <Marker position={[location.lat, location.lng]} />;
  return <div>Map Marker</div>;
};

export const LocationWithMap: React.FC<LocationWithMapProps> = ({
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
    // to geocode the address and get lat/lng coordinates
    const newLocation: Location = {
      id: `loc_${Date.now()}`,
      name: "Custom Address",
      address: newAddress,
      lat: 0, // Replace with actual geocoded latitude
      lng: 0, // Replace with actual geocoded longitude
    };
    onLocationChange(newLocation);
    setNewAddress("");
    onClose();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex justify-between items-center">
        <h4 className="text-large font-bold">Delivery Location</h4>
        <Button variant='light' onPress={onOpen}>
          Change
        </Button>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-start mb-4">
              <Icon icon="mdi:map-marker" className="text-primary text-xl mt-1 mr-2" />
              <div>
                <p className="font-semibold">{currentLocation.name}</p>
                <p className="text-small text-default-500">{currentLocation.address}</p>
              </div>
            </div>
            <div className="h-64 md:h-80 rounded-lg overflow-hidden">
              {/* <MapContainer
                center={[currentLocation.lat, currentLocation.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapMarker location={currentLocation} />
              </MapContainer> */}
            </div>
          </div>
        </div>
      </CardBody>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Select Location</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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
              </div>
              <div className="h-64 md:h-80 rounded-lg overflow-hidden">
                {/* <MapContainer
                  center={[currentLocation.lat, currentLocation.lng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapMarker location={currentLocation} />
                </MapContainer> */}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" color="danger" onPress={onClose}>
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

export const LocationWithMapExample = () => {
  const [currentLocation, setCurrentLocation] = useState<Location>({
    id: "loc_1",
    name: "Home",
    address: "123 Main St, Anytown, USA 12345",
    lat: 40.7128, // Example coordinates (New York City)
    lng: -74.0060
  });

  const savedLocations: Location[] = [
    {
      id: "loc_1",
      name: "Home",
      address: "123 Main St, Anytown, USA 12345",
      lat: 40.7128,
      lng: -74.0060
    },
    {
      id: "loc_2",
      name: "Work",
      address: "456 Business Ave, Cityville, USA 67890",
      lat: 34.0522, // Example coordinates (Los Angeles)
      lng: -118.2437
    },
    {
      id: "loc_3",
      name: "Gym",
      address: "789 Fitness Blvd, Healthytown, USA 13579",
      lat: 41.8781, // Example coordinates (Chicago)
      lng: -87.6298
    }
  ];

  return (
    <LocationWithMap
      currentLocation={currentLocation}
      savedLocations={savedLocations}
      onLocationChange={setCurrentLocation}
    />
  );
};