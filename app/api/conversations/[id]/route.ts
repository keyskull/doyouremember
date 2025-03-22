import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const conversationId = (await params).id;

  // Verify conversation belongs to user
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
  });

  if (!conversation) {
    return new Response('Conversation not found', { status: 404 });
  }

  // Delete the conversation and its messages
  await prisma.conversation.delete({
    where: {
      id: conversationId,
    },
  });

  return new Response(null, { status: 204 });
} 