// src/lib/openai.ts
import OpenAI from "openai";

// The SDK will automatically read process.env.OPENAI_API_KEY
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// We don’t need the old ChatCompletionRequestMessage type—just use our own minimal type
export type ChatMsg = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function createChatCompletion(params: {
  model: string;
  messages: ChatMsg[];
}) {
  // v4 uses openai.chat.completions.create()
  return openai.chat.completions.create({
    model: params.model,
    messages: params.messages,
  });
}
