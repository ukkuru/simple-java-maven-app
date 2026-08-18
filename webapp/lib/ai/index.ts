import type { AnalysisProvider } from "./provider";
import { AnalysisProviderError } from "./provider";
import { HeuristicProvider } from "./heuristicProvider";
import { AnthropicAnalysisProvider } from "./anthropicProvider";

export { AnalysisProviderError };
export type { AnalysisProvider };

/**
 * Provider factory driven entirely by environment variables:
 *   AI_PROVIDER=heuristic|anthropic
 *   AI_API_KEY=...
 *   AI_MODEL=...
 * Adding a new vendor means adding one branch here and a class that
 * implements AnalysisProvider — nothing else in the app needs to change.
 */
export function getAnalysisProvider(): AnalysisProvider {
  const providerName = (process.env.AI_PROVIDER || "heuristic").toLowerCase();

  switch (providerName) {
    case "heuristic":
      return new HeuristicProvider();
    case "anthropic": {
      const apiKey = process.env.AI_API_KEY;
      if (!apiKey) {
        throw new AnalysisProviderError(
          "AI_PROVIDER is set to 'anthropic' but AI_API_KEY is not configured.",
          "not_configured"
        );
      }
      const model = process.env.AI_MODEL || "claude-sonnet-4-5";
      return new AnthropicAnalysisProvider({ apiKey, model });
    }
    default:
      throw new AnalysisProviderError(`Unknown AI_PROVIDER: "${providerName}".`, "not_configured");
  }
}
