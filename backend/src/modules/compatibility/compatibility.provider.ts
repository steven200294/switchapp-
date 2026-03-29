import OpenAI from "openai";
import { env } from "../../config/env.js";

/**
 * OpenAI-compatible chat completion. Extend with Anthropic etc. behind the same interface later.
 */
export async function requestCompatibilityJson(systemPrompt: string, userPrompt: string): Promise<string> {
  if (env.ai.provider !== "openai") {
    throw new Error(`AI provider "${env.ai.provider}" is not implemented`);
  }
  const client = new OpenAI({ apiKey: env.ai.apiKey });
  const completion = await client.chat.completions.create({
    model: env.ai.model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.35,
  });
  const text = completion.choices[0]?.message?.content;
  if (!text) {
    throw new Error("Empty AI response");
  }
  return text;
}
