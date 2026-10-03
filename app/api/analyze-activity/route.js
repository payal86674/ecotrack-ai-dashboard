import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { activity } = body;

    // Call your AI model (e.g. Groq) or logic here
    
    return NextResponse.json({ 
      success: true, 
      score: 85,
      impact: "Great choice! Plant-based meals significantly reduce your carbon footprint."
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze activity' }, { status: 500 });
  }
}