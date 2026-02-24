import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; 
import { sendCyberShieldEmail } from "@/utils/emailService"; 

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "CLIENT", 
      }
    });

    try {
      await sendCyberShieldEmail(newUser.email, "WELCOME");
    } catch (emailError) {
      console.error("Welcome email failed to send:", emailError);
    }

    return NextResponse.json({ success: true, message: "Account created successfully!" });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ success: false, error: "Failed to create account" }, { status: 500 });
  }
}