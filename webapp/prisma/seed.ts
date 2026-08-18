import { PrismaClient } from "@prisma/client";
import { runHeuristicAnalysis } from "../lib/analysis";
import { DEMO_EXAMPLES } from "../lib/data/examples";

const prisma = new PrismaClient();

function titleFromUserStory(userStory: string): string {
  const cleaned = userStory.trim().replace(/\s+/g, " ");
  const goalMatch = cleaned.match(/i\s+(?:want|need)(?:\s+to)?\s+(.+?)(?:,?\s+so\s+that|$)/i);
  const base = goalMatch?.[1] ?? cleaned;
  const words = base.split(" ").slice(0, 8).join(" ");
  return words.length < base.length ? `${words}...` : words || "Untitled Story";
}

async function main() {
  await prisma.analysis.deleteMany();

  const frameworks: Array<"SMART" | "INVEST"> = ["INVEST", "SMART"];

  for (let i = 0; i < DEMO_EXAMPLES.length; i++) {
    const example = DEMO_EXAMPLES[i];
    const framework = frameworks[i % frameworks.length];
    const result = runHeuristicAnalysis(example.userStory, example.acceptanceCriteria, framework);

    // Simulate a "before" score for stories that were improved, so History
    // demonstrates the score-improvement feature out of the box.
    const wasImproved = example.quality === "poor" || example.quality === "very_poor" || example.quality === "average";
    const previousScore = wasImproved ? Math.max(10, result.overallScore - (18 + i * 4)) : null;

    await prisma.analysis.create({
      data: {
        title: titleFromUserStory(example.userStory),
        framework,
        userStory: example.userStory,
        acceptanceCriteria: example.acceptanceCriteria,
        overallScore: result.overallScore,
        previousScore,
        resultJson: JSON.stringify(result),
        createdAt: new Date(Date.now() - (DEMO_EXAMPLES.length - i) * 1000 * 60 * 60 * 6),
      },
    });
  }

  console.log(`Seeded ${DEMO_EXAMPLES.length} demo analyses.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
