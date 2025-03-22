'use client';

import { Send, Plus, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat, Message } from 'ai/react';
import { useCallback, useEffect, useState } from 'react';
import { availableModels, type ModelConfig } from '@/lib/models';
import { useToast } from '@/components/ToastContext';
import { Navigation } from '@/components/Navigation';
import { Badge, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { VoiceInput } from '@/components/VoiceInput';

interface Conversation {
  id: string;
  title: string;
  model: string;
  messages: Message[];
}

export default function Home() {
  const { showToast } = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose
  } = useDisclosure();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit: handleChatSubmit, status, setMessages } = useChat({
    api: '/api/chat',
    body: {
      conversationId: currentConversation?.id,
      model: currentConversation?.model,
    },
    onFinish: async (message) => {
      // Check if the message content contains our completion signal
      const doneMatch = message.content.match(/<DONE>(.+)$/);
      if (doneMatch) {
        // Remove the completion signal from the message
        const cleanContent = message.content.replace(/<DONE>.+$/, '');

        // Update the messages with the clean content
        setMessages(prev =>
          prev.map(m =>
            m.id === message.id
              ? { ...m, content: cleanContent }
              : m
          )
        );

        // Fetch the latest messages to ensure everything is in sync
        if (currentConversation) {
          fetchMessages(currentConversation.id);
        }
      }
    },
  });


  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/conversations');
      const data = await response.json();
      setConversations(data);
      if (data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      showToast('Failed to fetch conversations', 'error');
    }
  }, [currentConversation, showToast]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const messages = await response.json();
      setMessages(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      showToast('Failed to fetch messages', 'error');
    }
  }, [setMessages, showToast]);

  const createNewConversation = async (model: ModelConfig) => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create conversation');
      }

      const newConversation = await response.json();
      if (!newConversation || !newConversation.id) {
        throw new Error('Invalid conversation data received');
      }

      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      showToast('New conversation created', 'success');
      onClose();
    } catch (error) {
      console.error('Error creating conversation:', error);
      showToast(error instanceof Error ? error.message : 'Failed to create conversation', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleChatSubmit(e);
  };

  const deleteConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.id !== id));
        if (currentConversation?.id === id) {
          const remainingConversations = conversations.filter(conv => conv.id !== id);
          setCurrentConversation(remainingConversations[0] || null);
        }
        onDeleteModalClose();
        showToast('Conversation deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      showToast('Failed to delete conversation', 'error');
    }
  };

  const handleVoiceTranscript = (text: string) => {
    // Update the input field with the interim transcript
    handleInputChange({ target: { value: text } } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleVoiceFinalTranscript = async (text: string) => {
    if (!text.trim()) return;

    // Set the final transcript as input
    handleInputChange({ target: { value: text } } as React.ChangeEvent<HTMLInputElement>);

    // Create a synthetic form event to submit the message
    const formEvent = new Event('submit', { bubbles: true, cancelable: true });
    await handleChatSubmit(formEvent as unknown as React.FormEvent);
  };

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation.id);
    } else {
      setMessages([]);
    }
  }, [currentConversation, fetchMessages, setMessages]);

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4">
          <button
            onClick={onOpen}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        <div className="px-4 space-y-2">
          {conversations.map((conv) => (
            <div key={conv.id}
              className={`w-full flex justify-between text-left px-4 py-2 rounded-lg transition-colors ${currentConversation?.id === conv.id
                ? 'bg-blue-100 dark:bg-blue-900'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              <button
                className="w-full text-left"
                onClick={() => {
                  setCurrentConversation(conv);
                  setMessages(conv.messages);
                }}
              >
                {conv.title || 'New Conversation'}
              </button>
              <button
                onClick={() => {
                  setConversationToDelete(conv.id);
                  onDeleteModalOpen();
                }}
                className="hover:opacity-100"
                title="Delete conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <Navigation />

        <header className="border-b bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="w-full flex items-center space-x-4 justify-between">
                <h1 className="text-2xl font-bold">{currentConversation?.title}</h1>
                <Badge color="primary" variant="flat" className="hidden sm:flex">
                  {currentConversation?.model}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-2">Welcome to AI Chat</h2>
                <p className="text-gray-600 dark:text-gray-400">Ask anything to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message: Message, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${message.role === 'user'
                      ? 'bg-blue-50 dark:bg-blue-900/20 ml-12'
                      : 'bg-white dark:bg-gray-800 mr-12 shadow-sm'
                      }`}
                  >
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <div className="border-t bg-white dark:bg-gray-800 p-4">
          <div className="container mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  onFinalTranscript={handleVoiceFinalTranscript}
                  disabled={status === 'streaming'}
                />

                <Button
                  type="submit"
                  color="primary"
                  isLoading={status === 'streaming'}
                  startContent={status !== 'submitted' && <Send className="w-4 h-4" />}
                >
                  Send
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Select AI Model</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {availableModels.map((modelOption) => (
                <button
                  key={modelOption.id}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${currentConversation?.model === modelOption.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }
                    ${modelOption.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  onClick={() => createNewConversation(modelOption)}
                  disabled={modelOption.disabled}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{modelOption.name}</h3>
                    <Badge
                      color={
                        modelOption.provider === 'openai'
                          ? 'success'
                          : modelOption.provider === 'anthropic'
                            ? 'secondary'
                            : 'primary'
                      }
                      variant="flat"
                    >
                      {modelOption.provider}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {modelOption.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Max tokens: {modelOption.maxTokens.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalContent>
          <ModalHeader>Delete Conversation</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={onDeleteModalClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={() => conversationToDelete && deleteConversation(conversationToDelete)}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
