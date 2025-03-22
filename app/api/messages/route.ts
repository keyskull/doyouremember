import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {


  // Get conversationId from URL params
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversationId');

  if (!conversationId) {
    return new Response('Conversation ID is required', { status: 400 });
  }

  // Verify conversation belongs to user
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });

  if (!conversation) {
    return new Response('Conversation not found', { status: 404 });
  }

  return Response.json(conversation.messages);
} 