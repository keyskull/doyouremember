import { streamText, Tool } from 'ai';
import { prisma } from '@/lib/prisma';
import { availableModels } from '@/lib/models';
import { ChatFunctionAgent } from '@/lib/chatFunctions';
import { MessageAnalyzer } from '@/lib/messageAnalyzer';
import { NextResponse } from 'next/server';
import { getProvider } from '@/lib/privoder';

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant' | 'system' | 'function';
  name?: string;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

const chatFunctionAgent = new ChatFunctionAgent();
const messageAnalyzer = new MessageAnalyzer();

export async function POST(req: Request) {
  try {



    const { messages, conversationId, model = 'gemini-2.0-pro-exp-02-05' } = await req.json();

    // Validate model selection
    const selectedModel = availableModels.find(m => m.id === model);
    if (!selectedModel) {
      return new NextResponse('Invalid model selection', { status: 400 });
    }

    // Verify conversation belongs to user
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    // Check for UI component generation in the user's message
    const userMessage = messages[messages.length - 1];
    const componentResult = await messageAnalyzer.analyzeMessage(userMessage.content);

    // If a UI component was requested, return it directly
    if (componentResult) {
      await prisma.message.create({
        data: {
          content: userMessage.content,
          role: userMessage.role,
          conversationId,
        },
      });

      const response = {
        text: `Here's the ${componentResult.type} component you requested:`,
        component: componentResult.component,
      };

      await prisma.message.create({
        data: {
          content: JSON.stringify(response),
          role: 'assistant',
          conversationId,
        },
      });

      return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Store the user's message for regular chat
    await prisma.message.create({
      data: {
        content: userMessage.content,
        role: userMessage.role,
        conversationId,
      },
    });


    try {
      // Handle different providers
      const provider = getProvider(selectedModel);


      // Update conversation title if it's the first message
      if (messages.length === 1) {
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { title: messages[0].content.slice(0, 100) },
        });
      }

      const tools: Record<string, Tool> = {};
      Array.from(chatFunctionAgent.functions.values()).forEach(fn => {
        tools[fn.name] = {
          parameters: fn.parameters.shape,
          execute: async (args) => {
            const result = await chatFunctionAgent.executeFunction({
              name: fn.name,
              arguments: args,
            });
            return result;
          }
        };
      });


      // console.log('Messages:', messages);

      const stream = streamText({
        model: provider,
        messages: messages.map((message: ChatMessage) => {
          // console.log('Message:', message);
          return ({
            content: message.content,
            role: message.role,
            name: message.name,
            // tool_calls: message.tool_calls,
          })
        }),
        // tools,
        temperature: selectedModel.temperature,
        maxTokens: selectedModel.maxTokens,
        onFinish: async (completion) => {
          // console.log('Completion:', completion);
          await prisma.message.create({
            data: {
              content: completion.text,
              role: 'assistant',
              conversationId,
            },
          });
        },
        onError: (error) => {
          console.error('Error in chat API:', error);
        }
      });
      return stream.toDataStreamResponse();
    } catch (error) {
      console.error('Error in chat API:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to process chat request' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Chat error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 