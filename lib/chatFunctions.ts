import { z } from 'zod';
import { BaseFunctionAgent, FunctionDefinition } from './functions';
import { prisma } from '@/lib/prisma';
import { Message } from '@prisma/client';

type ChatFunctionResults = {
  clear_history: { success: boolean };
  search_messages: { messages: Message[] };
  summarize_conversation: { summary: string };
};

export class ChatFunctionAgent extends BaseFunctionAgent {
  constructor() {
    super();
    this.registerChatFunctions();
  }

  private registerChatFunctions() {
    // Register all available chat functions
    this.registerFunction(this.clearHistoryFunction);
    this.registerFunction(this.searchMessagesFunction);
    this.registerFunction(this.summarizeConversationFunction);
  }

  protected async executeFunctionImpl<T>(name: string, args: Record<string, unknown>): Promise<T> {
    switch (name) {
      case 'clear_history':
        return (await this.clearHistory(args as { conversationId: string })) as T;
      case 'search_messages':
        return (await this.searchMessages(args as { query: string, conversationId: string })) as T;
      case 'summarize_conversation':
        return (await this.summarizeConversation(args as { conversationId: string })) as T;
      default:
        throw new Error(`Unknown function: ${name}`);
    }
  }

  // Function implementations
  private async clearHistory({ conversationId }: { conversationId: string }): Promise<ChatFunctionResults['clear_history']> {
    await prisma.message.deleteMany({
      where: { conversationId }
    });
    return { success: true };
  }

  private async searchMessages({ query, conversationId }: { query: string, conversationId: string }): Promise<ChatFunctionResults['search_messages']> {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        content: {
          contains: query.toLowerCase()
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    return { messages };
  }

  private async summarizeConversation({ conversationId }: { conversationId: string }): Promise<ChatFunctionResults['summarize_conversation']> {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    });

    // Simple summary implementation - can be enhanced with AI summarization
    const messageCount = messages.length;
    const firstMessage = messages[0]?.content.slice(0, 100) + '...';
    const lastMessage = messages[messages.length - 1]?.content.slice(0, 100) + '...';

    return {
      summary: `Conversation with ${messageCount} messages. Started with: "${firstMessage}". Latest message: "${lastMessage}"`
    };
  }

  // Function definitions
  private clearHistoryFunction: FunctionDefinition<ChatFunctionResults['clear_history']> = {
    name: 'clear_history',
    description: 'Clear all messages from a conversation',
    parameters: z.object({
      conversationId: z.string().min(1)
    })
  };

  private searchMessagesFunction: FunctionDefinition<ChatFunctionResults['search_messages']> = {
    name: 'search_messages',
    description: 'Search for messages in a conversation',
    parameters: z.object({
      query: z.string().min(1),
      conversationId: z.string().min(1)
    })
  };

  private summarizeConversationFunction: FunctionDefinition<ChatFunctionResults['summarize_conversation']> = {
    name: 'summarize_conversation',
    description: 'Get a summary of the conversation',
    parameters: z.object({
      conversationId: z.string().min(1)
    })
  };
} 