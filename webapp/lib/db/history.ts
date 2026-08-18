import { prisma } from "./client";
import type { AnalysisRecord, AnalysisResult, Framework } from "@/types";

function titleFromUserStory(userStory: string): string {
  const cleaned = userStory.trim().replace(/\s+/g, " ");
  const goalMatch = cleaned.match(/i\s+(?:want|need)(?:\s+to)?\s+(.+?)(?:,?\s+so\s+that|$)/i);
  const base = goalMatch?.[1] ?? cleaned;
  const words = base.split(" ").slice(0, 8).join(" ");
  return words.length < base.length ? `${words}...` : words || "Untitled Story";
}

export async function saveAnalysis(params: {
  userStory: string;
  acceptanceCriteria: string;
  framework: Framework;
  result: AnalysisResult;
  previousScore?: number | null;
}): Promise<AnalysisRecord> {
  const record = await prisma.analysis.create({
    data: {
      title: titleFromUserStory(params.userStory),
      framework: params.framework,
      userStory: params.userStory,
      acceptanceCriteria: params.acceptanceCriteria,
      overallScore: params.result.overallScore,
      previousScore: params.previousScore ?? null,
      resultJson: JSON.stringify(params.result),
    },
  });
  return toAnalysisRecord(record);
}

export async function listAnalyses(limit = 50): Promise<AnalysisRecord[]> {
  const records = await prisma.analysis.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return records.map(toAnalysisRecord);
}

export async function getAnalysis(id: string): Promise<AnalysisRecord | null> {
  const record = await prisma.analysis.findUnique({ where: { id } });
  return record ? toAnalysisRecord(record) : null;
}

function toAnalysisRecord(record: {
  id: string;
  title: string;
  framework: string;
  userStory: string;
  acceptanceCriteria: string;
  overallScore: number;
  previousScore: number | null;
  resultJson: string;
  createdAt: Date;
}): AnalysisRecord {
  return {
    id: record.id,
    title: record.title,
    framework: record.framework as Framework,
    userStory: record.userStory,
    acceptanceCriteria: record.acceptanceCriteria,
    overallScore: record.overallScore,
    previousScore: record.previousScore,
    result: JSON.parse(record.resultJson) as AnalysisResult,
    createdAt: record.createdAt.toISOString(),
  };
}
