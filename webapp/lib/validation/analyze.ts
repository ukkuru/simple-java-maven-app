import { z } from "zod";

export const analyzeRequestSchema = z.object({
  userStory: z
    .string()
    .trim()
    .min(10, "User story must be at least 10 characters.")
    .max(4000, "User story is too long (max 4000 characters)."),
  acceptanceCriteria: z
    .string()
    .trim()
    .max(6000, "Acceptance criteria is too long (max 6000 characters)."),
  framework: z.enum(["SMART", "INVEST"], {
    errorMap: () => ({ message: "Framework must be either SMART or INVEST." }),
  }),
  previousScore: z.number().min(0).max(100).nullable().optional(),
});

export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;
