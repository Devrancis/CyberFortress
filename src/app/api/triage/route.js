import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { issue } = body;

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are CyberFortress's elite Tier 1 AI Security Analyst. 
    A client just reported this security anomaly: "${issue}"
    
    Task:
    1. Analyze the threat severity immediately.
    2. Provide 2-3 immediate, actionable mitigation steps.
    3. State if human escalation is needed.
    
    Respond strictly in JSON format with exactly two keys:
    - "reply": Your detailed text response to the client (speak urgently but professionally).
    - "needsConsultant": A boolean (true or false). Set to true for ransomware, breaches, or network downtime.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const aiResponse = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      reply: aiResponse.reply,
      needsConsultant: aiResponse.needsConsultant,
    });

  } catch (error) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json(
      { success: false, error: "System error connecting to AI SOC framework." },
      { status: 500 }
    );
  }
}

// Future me!!! Don't touch the Vercel timeout extension
export const maxDuration = 60;