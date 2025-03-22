import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {

    const conversations = await prisma.conversation.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        messages: true,
      },
    });
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Error fetching conversations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { model } = await req.json();

    const conversation = await prisma.conversation.create({
      data: {
        title: 'New Conversation',
        model: model,
      },
    });
    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Error creating conversation' }, { status: 500 });
  }
} 