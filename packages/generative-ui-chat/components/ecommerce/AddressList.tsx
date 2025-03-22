// generative-ui-chat/components/ecommerce/address-list.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Radio, RadioGroup, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Textarea } from "@heroui/react";
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

interface AddressListProps {
  addresses: Address[];
  onAddressSelect: (addressId: string) => void;
  onAddressAdd: (address: Omit<Address, 'id'>) => void;
  onAddressEdit: (address: Address) => void;
  onAddressDelete: (addressId: string) => void;
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onAddressSelect,
  onAddressAdd,
  onAddressEdit,
  onAddressDelete
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });

  const handleAddressChange = (addressId: string) => {
    setSelectedAddress(addressId);
    onAddressSelect(addressId);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress(address);
    onOpen();
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setNewAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false
    });
    onOpen();
  };

  const handleSaveAddress = () => {
    if (editingAddress) {
      onAddressEdit({ ...newAddress, id: editingAddress.id });
    } else {
      onAddressAdd(newAddress);
    }
    onClose();
  };

  const handleInputChange = (field: keyof Omit<Address, 'id'>, value: string | boolean) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex justify-between items-center px-4 pt-4 pb-0">
        <h4 className="text-large font-bold">Your Addresses</h4>
        <Button color="primary" onPress={handleAddNewAddress}>
          Add New Address
        </Button>
      </CardHeader>
      <CardBody>
        <RadioGroup
          value={selectedAddress || ''}
          onValueChange={handleAddressChange}
        >
          {addresses.map((address) => (
            <Card key={address.id} className="w-full mb-4">
              <CardBody className="flex justify-between items-center">
                <Radio value={address.id}>
                  <div className="ml-2">
                    <p className="font-semibold">{address.name}</p>
                    <p className="text-small text-default-500">
                      {address.street}, {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-small text-default-500">{address.country}</p>
                    {address.isDefault && (
                      <span className="text-tiny text-primary">Default Address</span>
                    )}
                  </div>
                </Radio>
                <div>
                  <Button
                    isIconOnly
                    color="primary"
                    variant="light"
                    onPress={() => handleEditAddress(address)}
                  >
                    <Icon icon="mdi:pencil" />
                  </Button>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    onPress={() => onAddressDelete(address.id)}
                  >
                    <Icon icon="mdi:trash" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </RadioGroup>
      </CardBody>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{editingAddress ? 'Edit Address' : 'Add New Address'}</ModalHeader>
          <ModalBody>
            <form className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter full name"
                value={newAddress.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <Textarea
                label="Street Address"
                placeholder="Enter street address"
                value={newAddress.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
              />
              <div className="flex gap-4">
                <Input
                  label="City"
                  placeholder="Enter city"
                  value={newAddress.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
                <Input
                  label="State"
                  placeholder="Enter state"
                  value={newAddress.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Input
                  label="ZIP Code"
                  placeholder="Enter ZIP code"
                  value={newAddress.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
                <Input
                  label="Country"
                  placeholder="Enter country"
                  value={newAddress.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                />
                <span>Set as default address</span>
              </label>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSaveAddress}>
              Save Address
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export const AddressListExample = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'John Doe',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
      isDefault: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      street: '456 Elm St',
      city: 'Other City',
      state: 'NY',
      zipCode: '67890',
      country: 'USA',
      isDefault: false
    }
  ]);

  const handleAddressSelect = (addressId: string) => {
    console.log('Selected address:', addressId);
  };

  const handleAddressAdd = (newAddress: Omit<Address, 'id'>) => {
    const id = (addresses.length + 1).toString();
    setAddresses([...addresses, { ...newAddress, id }]);
  };

  const handleAddressEdit = (editedAddress: Address) => {
    setAddresses(addresses.map(addr => addr.id === editedAddress.id ? editedAddress : addr));
  };

  const handleAddressDelete = (addressId: string) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
  };

  return (
    <AddressList
      addresses={addresses}
      onAddressSelect={handleAddressSelect}
      onAddressAdd={handleAddressAdd}
      onAddressEdit={handleAddressEdit}
      onAddressDelete={handleAddressDelete}
    />
  );
};