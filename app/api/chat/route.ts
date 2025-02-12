import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Edge API route

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    const { message, chatId } = await req.json();

    // Vind of maak een nieuwe chat
    let chat;
    if (chatId) {
      chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { messages: true }
      });

      if (!chat || chat.userId !== session.user.id) {
        return NextResponse.json({ error: 'Chat niet gevonden' }, { status: 404 });
      }
    } else {
      chat = await prisma.chat.create({
        data: {
          userId: session.user.id,
          title: 'Nieuwe chat',
          messages: {
            create: {
              content: message,
              isBot: false
            }
          }
        },
        include: { messages: true }
      });
    }

    // Stuur bericht naar n8n
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        userId: session.user.id,
        chatId: chat.id,
        previousMessages: chat.messages
      }),
    });

    const aiResponse = await n8nResponse.json();

    // Sla AI antwoord op
    const botMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        content: aiResponse.message,
        isBot: true
      }
    });

    return NextResponse.json({
      message: botMessage.content,
      chatId: chat.id
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het verwerken van je bericht' },
      { status: 500 }
    );
  }
}

// Ophalen van chatgeschiedenis
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');

    if (chatId) {
      // Haal specifieke chat op
      const chat = await prisma.chat.findUnique({
        where: { 
          id: chatId,
          userId: session.user.id
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (!chat) {
        return NextResponse.json({ error: 'Chat niet gevonden' }, { status: 404 });
      }

      return NextResponse.json(chat);
    } else {
      // Haal alle chats op
      const chats = await prisma.chat.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      return NextResponse.json(chats);
    }
  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het ophalen van de chatgeschiedenis' },
      { status: 500 }
    );
  }
}