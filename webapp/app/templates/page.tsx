import Link from "next/link";
import { getTemplatesByCategory } from "@/lib/data/templates";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

const QUALITY_TONE: Record<string, BadgeTone> = {
  excellent: "success",
  good: "success",
  average: "warning",
  poor: "danger",
  very_poor: "danger",
};

const QUALITY_LABEL: Record<string, string> = {
  excellent: "Excellent example",
  good: "Good example",
  average: "Average example",
  poor: "Poor example",
  very_poor: "Very poor example",
};

export default function TemplatesPage() {
  const grouped = getTemplatesByCategory();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
      <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
        Load a realistic example straight into the analyzer to see how it works.
      </p>

      <div className="mt-8 space-y-10">
        {Object.entries(grouped).map(([category, templates]) => (
          <section key={category} aria-labelledby={`cat-${category}`}>
            <h2 id={`cat-${category}`} className="mb-3 text-lg font-semibold">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {templates.map((t) => (
                <Card key={t.id} className="flex flex-col">
                  <CardContent className="flex flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{t.title}</h3>
                      <Badge tone={QUALITY_TONE[t.quality]}>{QUALITY_LABEL[t.quality]}</Badge>
                    </div>
                    <p className="line-clamp-3 flex-1 text-sm text-[rgb(var(--text-muted))]">{t.userStory}</p>
                    <Link href={`/analyze?templateId=${t.id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "self-start" })}>
                      Use Template
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
