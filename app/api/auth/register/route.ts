import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    // Validatie
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Alle velden zijn verplicht' },
        { status: 400 }
      );
    }

    // Check of gebruiker bestaat
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Een gebruiker met deze email of gebruikersnaam bestaat al' },
        { status: 400 }
      );
    }

    // Hash wachtwoord
    const hashedPassword = await hash(password, 10);

    // Maak gebruiker aan
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        settings: {
          create: {} // Maakt standaard instellingen
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      message: 'Account succesvol aangemaakt',
      user
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het registreren' },
      { status: 500 }
    );
  }
}