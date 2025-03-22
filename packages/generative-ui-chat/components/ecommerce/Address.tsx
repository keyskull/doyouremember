// generative-ui-chat/components/ecommerce/tracking.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardBody, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Textarea, Checkbox } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressProps {
  address: Address;
  onEdit: (editedAddress: Address) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}

export const Address: React.FC<AddressProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editedAddress, setEditedAddress] = useState<Address>(address);

  const handleInputChange = (field: keyof Address, value: string | boolean) => {
    setEditedAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onEdit(editedAddress);
    onClose();
  };

  const handleSetDefault = () => {
    onSetDefault(address.id);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardBody className="flex flex-col gap-4">
        <div>
          <h4 className="text-large font-bold">{address.name}</h4>
          <p className="text-small text-default-500">{address.street}</p>
          <p className="text-small text-default-500">
            {address.city}, {address.state} {address.zipCode}
          </p>
          <p className="text-small text-default-500">{address.country}</p>
          {address.isDefault && (
            <span className="text-tiny text-primary">Default Address</span>
          )}
        </div>
        <div className="flex justify-between">
          <Button color="primary" variant="light" onPress={onOpen}>
            Edit
          </Button>
          <Button color="danger" variant="light" onPress={() => onDelete(address.id)}>
            Delete
          </Button>
          {!address.isDefault && (
            <Button color="secondary" variant="light" onPress={handleSetDefault}>
              Set as Default
            </Button>
          )}
        </div>
      </CardBody>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Edit Address</ModalHeader>
          <ModalBody>
            <form className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter full name"
                value={editedAddress.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <Textarea
                label="Street Address"
                placeholder="Enter street address"
                value={editedAddress.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
              />
              <div className="flex gap-4">
                <Input
                  label="City"
                  placeholder="Enter city"
                  value={editedAddress.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
                <Input
                  label="State"
                  placeholder="Enter state"
                  value={editedAddress.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Input
                  label="ZIP Code"
                  placeholder="Enter ZIP code"
                  value={editedAddress.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
                <Input
                  label="Country"
                  placeholder="Enter country"
                  value={editedAddress.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </div>
              <Checkbox
                isSelected={editedAddress.isDefault}
                onChange={(e) => handleInputChange('isDefault', e.target.checked)}
              >
                Set as default address
              </Checkbox>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSave}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export const AddressExample = () => {
  const [address, setAddress] = useState<Address>({
    id: '1',
    name: 'John Doe',
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'USA',
    isDefault: true
  });

  const handleEdit = (editedAddress: Address) => {
    setAddress(editedAddress);
    console.log('Address updated:', editedAddress);
  };

  const handleDelete = (addressId: string) => {
    console.log('Address deleted:', addressId);
    // In a real application, you would remove the address from your state or database here
  };

  const handleSetDefault = (addressId: string) => {
    setAddress(prev => ({ ...prev, isDefault: true }));
    console.log('Address set as default:', addressId);
  };

  return (
    <Address
      address={address}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSetDefault={handleSetDefault}
    />
  );
};