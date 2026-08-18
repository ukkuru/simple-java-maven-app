import type { AnalysisResult, AnalyzeRequest } from "@/types";

export class AnalysisProviderError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "invalid_response"
      | "provider_failure"
      | "timeout"
      | "rate_limited"
      | "not_configured"
  ) {
    super(message);
    this.name = "AnalysisProviderError";
  }
}

export interface AnalysisProvider {
  readonly name: string;
  analyze(input: AnalyzeRequest): Promise<AnalysisResult>;
}
