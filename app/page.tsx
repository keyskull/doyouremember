'use client';

import { Send, Plus, Trash2, MessageCircle, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat, Message } from '@ai-sdk/react';
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
  const [topicInput, setTopicInput] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [lastProcessedContent, setLastProcessedContent] = useState<string>('');

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

  // Handle word selection when message content changes
  useEffect(() => {
    const currentMessage = messages.find(m => m.role === 'assistant' && m.content !== lastProcessedContent);
    if (currentMessage) {
      const items = currentMessage.content.split(',').map(item => item.trim());
      const singleWords = items.filter(item => item.split(' ').length === 1);
      if (singleWords.length > 0) {
        setSelectedWords(new Set(singleWords));
      }
      setLastProcessedContent(currentMessage.content);
    }
  }, [messages, lastProcessedContent]);

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

  const handleTopicSubmit: (e: React.FormEvent) => Promise<void> = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setIsSpinning(true);
    try {
      // First create the conversation
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: availableModels[0].id,
          title: topicInput.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create conversation');
      }

      const newConversation = await response.json();

      // Then send the initial message with the topic
      const messageResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `${topicInput.trim()}`
            }],
          conversationId: newConversation.id,
          model: newConversation.model,
        }),
      });

      if (!messageResponse.ok) {
        throw new Error('Failed to send initial message');
      }

      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setTopicInput('');
      showToast('New conversation created', 'success');
    } catch (error) {
      console.error('Error creating conversation:', error);
      showToast(error instanceof Error ? error.message : 'Failed to create conversation', 'error');
    } finally {
      setIsSpinning(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (currentConversation) {
      // Fetch messages initially and refresh every 5 seconds
      fetchMessages(currentConversation.id);
      const interval = setInterval(() => {
      }, 5000);
      
      // Cleanup interval on unmount or conversation change
      return () => clearInterval(interval);
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
                <p className="text-gray-600 dark:text-gray-400 mb-4">What topic would you like to discuss?</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">Try asking about science, history, technology, or any other subject you're curious about.</p>

                <form onSubmit={handleTopicSubmit} className="relative max-w-md mx-auto">
                  <div className={`relative ${isSpinning ? 'animate-spin-slow' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-20 -z-10"></div>
                    <div className="relative">
                      <input
                        type="text"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        placeholder="Enter your topic..."
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 pr-28 text-sm"
                      />
                      <button
                        type="submit"
                        disabled={isSpinning || !topicInput.trim()}
                        className={`absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm ${isSpinning || !topicInput.trim() ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        {isSpinning ? 'Loading...' : 'Start Chat'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.filter(message => message.role !== 'system' && !message.content.includes('<SCRIPT>')).map((message: Message, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${message.role === 'user'
                      ? 'bg-blue-50 dark:bg-blue-900/20 ml-8'
                      : 'bg-white dark:bg-gray-800 mr-8 shadow-sm'
                      }`}
                  >
                    {message.role === 'assistant' ? (
                      <div>
                        {(() => {
                          if (message.content.includes('<ARRAY>')) {
                            const items = message.content.split(',').map(item => item.trim());
                            return (
                              <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                  {items.map((item, itemIndex) => {
                                    if (item.split(' ').length === 1) {
                                      const isSelected = selectedWords.has(item);
                                      return (
                                        <div
                                          key={itemIndex}
                                          className={`p-2 rounded-md cursor-pointer transition-all duration-200 text-sm h-full flex items-center justify-center text-center shadow-sm hover:shadow-md ${isSelected
                                            ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                                            : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20'
                                            }`}
                                          onClick={() => {
                                            setSelectedWords(prev => {
                                              const newSet = new Set(prev);
                                              if (isSelected) {
                                                newSet.delete(item);
                                              } else {
                                                newSet.add(item);
                                              }
                                              return newSet;
                                            });
                                          }}
                                        >
                                          <div className={`font-medium ${isSelected ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                                            {item}
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                                {selectedWords.size > 0 && (
                                  <div className="mt-2 flex justify-end">
                                    <button
                                      onClick={async () => {
                                        const selectedText = Array.from(selectedWords).join(', ');
                                        const prompt = {
                                          role: 'user',
                                          name: 'Anki Card Generator',
                                          content: `
<SCRIPT>
This GPT helps users expand their vocabulary by providing words related to specific fields or topics. When a user provides a list of English words, it responds with a chart that includes the words provided strictly following the order given in the list and does not add any additional words. This GPT assists users in creating structured Anki card charts for effective vocabulary retention. If the user's word list contains duplicates, it will merge repeated words into a single entry. When generating Anki cards, it formats responses into the following columns:

Front: Contains the word or term to learn.
Back: Includes the English definition.
Example: Provides an example sentence.
Chinese: Chinese meaning of the word.
Synonyms: Lists several synonyms.
Etymology: Details the word root and composition.
Fun Fact: Includes one fun fact about the word.
Tags: Specifies the topic category and grammatical type (e.g., verb, adjective).

The output will be one table that includes all the words from the provided list, ensuring that all words are processed and presented in a single chart, strictly maintaining the given order. if one message is not enough, automatically generate the second response. If 2 responses are not enough, automatically generate the third response. If 3 responses are not enough, automatically generate the 4th response.
${selectedText}
start with <CSV>

`}


                                        // Send to AI
                                        const response = await fetch('/api/chat', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            messages: [...messages, prompt],
                                            conversationId: currentConversation?.id,
                                            model: currentConversation?.model,
                                          }),
                                        });

                                        if (!response.ok) throw new Error('Failed to send message');

                                        const data = await response.json();
                                        const assistantMessage: Message = { role: 'assistant', content: data.content, id: (Date.now() + 1).toString() };
                                        setMessages(prev => [...prev, assistantMessage]);
                                        
                                        // Clear the selected words after generating Anki file
                                        setSelectedWords(new Set());
                                      }}
                                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                      Generate Anki's file by selected words
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return (
                            <div className="prose dark:prose-invert max-w-none prose-sm">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="prose dark:prose-invert max-w-none prose-sm">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    )}
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
                disabled={status === 'streaming' || !currentConversation || messages.length === 0}
              />
              <div className="flex items-center gap-2">
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  onFinalTranscript={handleVoiceFinalTranscript}
                  disabled={status === 'streaming' || !currentConversation || messages.length === 0}
                />

                <Button
                  type="submit"
                  color="primary"
                  isLoading={status === 'streaming'}
                  startContent={status !== 'submitted' && <Send className="w-4 h-4" />}
                  isDisabled={status === 'streaming' || !currentConversation || messages.length === 0}
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
