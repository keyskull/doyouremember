'use client';

import { useState, useEffect } from 'react';
import { availableModels, type ModelConfig } from '@/lib/models';
import { Navigation } from '@/components/Navigation';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    isBusiness: false,
    name: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    defaultModel: 'gpt-4',
  });

  useEffect(() => {
    setLoading(false);
  }, []);


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (preferences.isBusiness) {
      if (!preferences.name?.trim()) {
        newErrors.name = 'Business name is required';
      }
      if (!preferences.street?.trim()) {
        newErrors.street = 'Street address is required';
      }
      if (!preferences.city?.trim()) {
        newErrors.city = 'City is required';
      }
      if (!preferences.state?.trim()) {
        newErrors.state = 'State/Province is required';
      }
      if (!preferences.postalCode?.trim()) {
        newErrors.postalCode = 'Postal code is required';
      }
      if (!preferences.country?.trim()) {
        newErrors.country = 'Country is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Toast Message */}
      {message && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg ${
          message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {message.text}
        </div>
      )}

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-8">Settings</h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Model Selection */}
                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900">Default AI Model</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {availableModels.map((model: ModelConfig) => (
                      <div
                        key={model.id}
                        className={`relative rounded-lg border p-4 cursor-pointer ${
                          preferences.defaultModel === model.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                        onClick={() => setPreferences(prev => ({ ...prev, defaultModel: model.id }))}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="defaultModel"
                              value={model.id}
                              checked={preferences.defaultModel === model.id}
                              onChange={() => setPreferences(prev => ({ ...prev, defaultModel: model.id }))}
                              className="h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <label htmlFor={model.id} className="ml-3 block text-sm font-medium text-gray-700">
                              {model.name}
                            </label>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            model.provider === 'openai' ? 'bg-green-100 text-green-800' :
                            model.provider === 'anthropic' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {model.provider}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{model.description}</p>
                        <p className="mt-1 text-xs text-gray-400">Max tokens: {model.maxTokens.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        id="emailNotifications"
                        checked={preferences.emailNotifications}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="emailNotifications" className="ml-3 text-sm text-gray-700">
                        Email notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="smsNotifications"
                        id="smsNotifications"
                        checked={preferences.smsNotifications}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="smsNotifications" className="ml-3 text-sm text-gray-700">
                        SMS notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        id="pushNotifications"
                        checked={preferences.pushNotifications}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="pushNotifications" className="ml-3 text-sm text-gray-700">
                        Push notifications
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Business Profile</h2>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isBusiness"
                        id="isBusiness"
                        checked={preferences.isBusiness}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="isBusiness" className="ml-3 text-sm text-gray-700">
                        Enable business profile
                      </label>
                    </div>
                  </div>

                  {preferences.isBusiness && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={preferences.name || ''}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="street"
                          id="street"
                          value={preferences.street || ''}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.street ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.street && (
                          <p className="mt-1 text-sm text-red-500">{errors.street}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={preferences.city || ''}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          State / Province *
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={preferences.state || ''}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.state ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          id="postalCode"
                          value={preferences.postalCode || ''}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.postalCode ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.postalCode && (
                          <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="country"
                          id="country"
                          value={preferences.country || ''}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.country ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.country && (
                          <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
                    >
                      {saving ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 