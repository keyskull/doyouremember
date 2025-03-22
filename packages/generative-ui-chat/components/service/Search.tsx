// generative-ui-chat/components/service/search.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface SearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onResultClick: (result: SearchResult) => void;
}

export const Search: React.FC<SearchProps> = ({ onSearch, onResultClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setIsLoading(true);
        onSearch(query).then((searchResults) => {
          setResults(searchResults);
          setIsLoading(false);
          setShowResults(true);
        });
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="w-full max-w-md mx-auto" ref={searchRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          className="w-full"
          startContent={
            <Icon icon="mdi:magnify" className="text-default-400" />
          }
          endContent={
            isLoading ? (
              <Icon icon="mdi:loading" className="animate-spin text-default-400" />
            ) : query && (
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={() => setQuery('')}
              >
                <Icon icon="mdi:close" className="text-default-400" />
              </Button>
            )
          }
        />
        {showResults && results.length > 0 && (
          <Card className="absolute z-10 w-full mt-1">
            <CardBody className="p-2">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-2 hover:bg-default-100 cursor-pointer rounded"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="font-medium">{result.title}</div>
                  <div className="text-small text-default-400">{result.category}</div>
                  <div className="text-tiny text-default-500 truncate">{result.description}</div>
                </div>
              ))}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export const SearchExample = () => {
  const mockSearchResults: SearchResult[] = [
    { id: '1', title: 'iPhone 12', description: 'Apple smartphone with A14 Bionic chip', category: 'Electronics' },
    { id: '2', title: 'MacBook Air', description: 'Thin and light laptop with M1 chip', category: 'Computers' },
    { id: '3', title: 'AirPods Pro', description: 'Wireless earbuds with active noise cancellation', category: 'Audio' },
    { id: '4', title: 'iPad Air', description: 'Versatile tablet with A14 Bionic chip', category: 'Tablets' },
  ];

  const handleSearch = async (query: string): Promise<SearchResult[]> => {
    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSearchResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Selected result:', result);
    // Here you would typically navigate to the product page or show more details
  };

  return (
    <Search onSearch={handleSearch} onResultClick={handleResultClick} />
  );
};