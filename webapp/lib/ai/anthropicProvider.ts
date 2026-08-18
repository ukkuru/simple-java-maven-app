import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisProvider } from "./provider";
import { AnalysisProviderError } from "./provider";
import type { AnalysisResult, AnalyzeRequest } from "@/types";
import { analysisResultSchema } from "./schema";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

interface AnthropicProviderOptions {
  apiKey: string;
  model: string;
  timeoutMs?: number;
}

/**
 * LLM-backed provider. Kept isolated behind the AnalysisProvider interface
 * so it can be swapped for a different model/vendor without touching the
 * rest of the app — only lib/ai/index.ts's factory needs to change.
 */
export class AnthropicAnalysisProvider implements AnalysisProvider {
  readonly name = "anthropic";
  private client: Anthropic;
  private model: string;
  private timeoutMs: number;

  constructor(options: AnthropicProviderOptions) {
    this.client = new Anthropic({ apiKey: options.apiKey });
    this.model = options.model;
    this.timeoutMs = options.timeoutMs ?? 30000;
  }

  async analyze(input: AnalyzeRequest): Promise<AnalysisResult> {
    const userPrompt = buildUserPrompt(input.userStory, input.acceptanceCriteria, input.framework);

    const first = await this.callModel(userPrompt);
    const firstParsed = tryParse(first);
    if (firstParsed.success) return firstParsed.data;

    // One corrective retry: tell the model exactly what was wrong with its JSON.
    const retryPrompt = `${userPrompt}\n\nYour previous response failed schema validation with this error:\n${firstParsed.error}\n\nReturn ONLY corrected valid JSON matching the exact schema, no other text.`;
    const second = await this.callModel(retryPrompt);
    const secondParsed = tryParse(second);
    if (secondParsed.success) return secondParsed.data;

    throw new AnalysisProviderError(
      "The AI provider returned a response that didn't match the expected format after a retry.",
      "invalid_response"
    );
  }

  private async callModel(prompt: string): Promise<string> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await this.client.messages.create(
          {
            model: this.model,
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: prompt }],
          },
          { signal: controller.signal }
        );
        const block = response.content.find((b) => b.type === "text");
        if (!block || block.type !== "text") {
          throw new AnalysisProviderError("The AI provider returned an empty response.", "invalid_response");
        }
        return block.text;
      } finally {
        clearTimeout(timeout);
      }
    } catch (err) {
      if (err instanceof AnalysisProviderError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new AnalysisProviderError("The AI provider timed out.", "timeout");
      }
      const status = (err as { status?: number })?.status;
      if (status === 429) {
        throw new AnalysisProviderError("The AI provider is rate limiting requests.", "rate_limited");
      }
      throw new AnalysisProviderError(
        `The AI provider request failed: ${err instanceof Error ? err.message : "unknown error"}`,
        "provider_failure"
      );
    }
  }
}

function tryParse(raw: string): { success: true; data: AnalysisResult } | { success: false; error: string } {
  let json: unknown;
  try {
    const cleaned = raw
      .trim()
      .replace(/^```(json)?/i, "")
      .replace(/```$/i, "")
      .trim();
    json = JSON.parse(cleaned);
  } catch (e) {
    return { success: false, error: `Response was not valid JSON: ${e instanceof Error ? e.message : "parse error"}` };
  }
  const result = analysisResultSchema.safeParse(json);
  if (!result.success) {
    return { success: false, error: result.error.message };
  }
  return { success: true, data: result.data };
}
