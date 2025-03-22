'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center px-2 py-2 text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300"
            >
              <Icon icon="heroicons:home" className="w-5 h-5 mr-1" />
              Home
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Icon icon="heroicons:chat-bubble-left-right" className="w-5 h-5 mr-1" />
                Chat
              </div>
            </Link>
            <Link
              href="/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/settings')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Icon icon="heroicons:cog-6-tooth" className="w-5 h-5 mr-1" />
                Settings
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 