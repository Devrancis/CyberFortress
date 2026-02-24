import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendCyberShieldEmail } from "@/utils/emailService"; 

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tickets: {
          orderBy: { createdAt: 'desc' },
          include: { messages: { orderBy: { createdAt: 'asc' } } } 
        }
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, tickets: user.tickets });
  } catch (error) {
    console.error("GET Tickets Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { email, issue, aiResponse, needsHuman } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const newTicket = await prisma.ticket.create({
      data: {
        issue,
        aiResponse,
        needsHuman,
        status: needsHuman ? "PENDING" : "AI_RESOLVED",
        userId: user.id
      }
    });


    if (newTicket.status === "AI_RESOLVED") {
      sendCyberShieldEmail(email, "AI_RESOLVED", newTicket.id);
    } else if (newTicket.status === "PENDING") {
      sendCyberShieldEmail(email, "PENDING_REMINDER", newTicket.id);
    }

    return NextResponse.json({ success: true, ticket: newTicket });
  } catch (error) {
    console.error("POST Ticket Error:", error);
    return NextResponse.json({ success: false, error: "Failed to save ticket" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { ticketId, newStatus } = await req.json();

    if (!ticketId || !newStatus) {
      return NextResponse.json({ error: "Missing ID or Status" }, { status: 400 });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: newStatus },
      include: { user: true } 
    });

    if (newStatus === "SCHEDULED") {
      sendCyberShieldEmail(updatedTicket.user.email, "SCHEDULED", updatedTicket.id);
    } else if (newStatus === "HUMAN_RESOLVED") {
      sendCyberShieldEmail(updatedTicket.user.email, "HUMAN_RESOLVED", updatedTicket.id);
    }

    return NextResponse.json({ success: true, ticket: updatedTicket });
  } catch (error) {
    console.error("PUT Update Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update ticket" }, { status: 500 });
  }
}