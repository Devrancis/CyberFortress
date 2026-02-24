import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const allTickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } }
      }
    });

    return NextResponse.json({ success: true, tickets: allTickets });
  } catch (error) {
    console.error("Failed to fetch admin tickets:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}