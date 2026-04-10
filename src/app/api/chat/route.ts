// src/app/api/chat/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()
    if (!messages) {
      return NextResponse.json({ error: 'Missing messages' }, { status: 400 })
    }

    // Instantiate OpenAI on the server
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    })

    // Call the chat completion endpoint
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,             // array of { role: 'system'|'user'|'assistant', content: string }
    })

    // Return only the assistant’s message
    return NextResponse.json(completion.choices[0].message)
  } catch (err: any) {
    console.error('API/chat error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
