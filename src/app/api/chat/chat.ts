// src/app/api/chat/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Instantiate OpenAI on the server
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,            // expect array of { role, content }
  })

  return NextResponse.json(completion.choices[0].message)
}
