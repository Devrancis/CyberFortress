import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

export async function POST(req) {
  try {
    const { ticketId, text, sender, isCriticalAlert } = await req.json();

    const newMessage = await prisma.message.create({
      data: {
        text,
        sender,
        ticketId
      }
    });

    if (isCriticalAlert) {
      try {
        await transporter.sendMail({
          from: `"CyberFortress SOC" <${process.env.EMAIL_USER}>`,
          to: "francisiyiola@gmail.com", 
          subject: "🚨 URGENT: Critical Client Threat Updated",
          html: `
            <h2 style="color: #ef4444;">Critical Threat Alert</h2>
            <p><strong>Ticket ID:</strong> ${ticketId}</p>
            <p><strong>Client Update:</strong> ${text}</p>
            <p>Please log in to the CyberFortress Consultant Dashboard immediately to respond.</p>
          `,
        });
        console.log("Alert email sent successfully.");
      } catch (emailError) {
        console.error("Email failed to send, but message was saved:", emailError);
      }
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Message Error:", error);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}