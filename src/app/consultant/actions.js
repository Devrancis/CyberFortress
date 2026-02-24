"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function markTicketAsResolved(ticketId) {
  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'HUMAN_RESOLVED' }
    });
    
    revalidatePath('/consultant'); 
    
    return { success: true };
  } catch (error) {
    console.error("Error updating ticket:", error);
    return { success: false, error: "Failed to resolve ticket" };
  }
}