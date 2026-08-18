"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, RefreshCw } from "lucide-react";
import type { AnalysisResult, Framework } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useFramework } from "@/components/layout/framework-context";
import { TextEditorField } from "@/components/forms/text-editor-field";
import { FrameworkSelector } from "@/components/forms/framework-selector";
import { EmptyState } from "@/components/analysis/empty-state";
import { LoadingExperience } from "@/components/analysis/loading-experience";
import { ResultsDashboard } from "@/components/dashboard/results-dashboard";
import { DEMO_EXAMPLES } from "@/lib/data/examples";
import { TEMPLATES } from "@/lib/data/templates";

const US_MAX = 4000;
const AC_MAX = 6000;

type Status = "idle" | "loading" | "results";

export function AnalyzeContent() {
  const searchParams = useSearchParams();
  const { framework, setFramework } = useFramework();
  const { toast } = useToast();

  const [started, setStarted] = useState(false);
  const [userStory, setUserStory] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ userStory?: string }>({});
  const formTopRef = useRef<HTMLDivElement>(null);
  const appliedParam = useRef<string | null>(null);

  useEffect(() => {
    const templateId = searchParams.get("templateId");
    const exampleId = searchParams.get("exampleId");
    const key = templateId ?? exampleId;
    if (!key || appliedParam.current === key) return;
    appliedParam.current = key;

    if (templateId) {
      const t = TEMPLATES.find((t) => t.id === templateId);
      if (t) {
        setUserStory(t.userStory);
        setAcceptanceCriteria(t.acceptanceCriteria);
        setStarted(true);
      }
    } else if (exampleId) {
      const e = DEMO_EXAMPLES.find((e) => e.id === exampleId);
      if (e) {
        setUserStory(e.userStory);
        setAcceptanceCriteria(e.acceptanceCriteria);
        setStarted(true);
      }
    }
  }, [searchParams]);

  const showForm = started || userStory.length > 0 || acceptanceCriteria.length > 0 || result !== null;

  function loadUserStoryExample() {
    setUserStory(
      "As a registered customer, I want to reset my password using my verified email address, so that I can regain access to my account without contacting support."
    );
  }

  function loadAcExample() {
    setAcceptanceCriteria(
      "Given I am a registered user\nWhen I enter valid credentials\nThen I should be logged into the application"
    );
  }

  function tryRandomExample() {
    const example = DEMO_EXAMPLES[Math.floor(Math.random() * DEMO_EXAMPLES.length)];
    setUserStory(example.userStory);
    setAcceptanceCriteria(example.acceptanceCriteria);
    setStarted(true);
    setTimeout(() => runAnalysis(example.userStory, example.acceptanceCriteria), 50);
  }

  async function runAnalysis(storyOverride?: string, acOverride?: string) {
    const story = storyOverride ?? userStory;
    const ac = acOverride ?? acceptanceCriteria;

    if (story.trim().length < 10) {
      setErrors({ userStory: "Please enter a user story of at least 10 characters." });
      formTopRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
      return;
    }
    setErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userStory: story,
          acceptanceCriteria: ac,
          framework,
          previousScore: result?.overallScore ?? null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "We couldn't analyze your story. Please try again.");
      }

      setPreviousScore(result ? result.overallScore : null);
      setResult(data.result as AnalysisResult);
      setStatus("results");
    } catch (err) {
      setStatus(result ? "results" : "idle");
      toast({
        tone: "error",
        title: "Analysis failed",
        description: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  const analyzeLabel = result ? "Re-analyze" : "Analyze User Story";

  const scenarioContext = useMemo(
    () => ({ userStory, acceptanceCriteria, framework }),
    [userStory, acceptanceCriteria, framework]
  );

  if (!showForm) {
    return (
      <EmptyState
        onAnalyze={() => setStarted(true)}
        onTryExample={tryRandomExample}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div ref={formTopRef} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Analysis</h1>
        <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
          Paste your user story and acceptance criteria, choose a framework, and get an instant quality assessment.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="space-y-6">
          <TextEditorField
            id="user-story"
            label="User Story"
            value={userStory}
            onChange={setUserStory}
            placeholder={"As a [user/persona], I want [goal/action], so that [benefit/value]."}
            onExample={loadUserStoryExample}
            maxLength={US_MAX}
            minRows={4}
            error={errors.userStory}
            emptyState={!userStory ? <span>Tip: start with &ldquo;As a&hellip;&rdquo;</span> : undefined}
          />

          <TextEditorField
            id="acceptance-criteria"
            label="Acceptance Criteria"
            helperText="Given/When/Then, bullet points, numbered criteria, or plain text are all supported."
            value={acceptanceCriteria}
            onChange={setAcceptanceCriteria}
            placeholder={"Given I am a registered user\nWhen I enter valid credentials\nThen I should be logged into the application"}
            onExample={loadAcExample}
            maxLength={AC_MAX}
            minRows={4}
          />

          <div>
            <p className="mb-2 text-sm font-semibold">Choose Quality Framework</p>
            <FrameworkSelector value={framework} onChange={(f: Framework) => setFramework(f)} />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button size="lg" onClick={() => runAnalysis()} disabled={status === "loading"}>
              {result ? <RefreshCw className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              {analyzeLabel}
            </Button>
            {result && (
              <span className="text-xs text-[rgb(var(--text-muted))]">
                Edit the text above and re-analyze to see if your score improves.
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {status === "loading" && <LoadingExperience done={false} />}

      {status === "results" && result && (
        <ResultsDashboard
          result={result}
          originalUserStory={scenarioContext.userStory}
          originalAcceptanceCriteria={scenarioContext.acceptanceCriteria}
          previousScore={previousScore}
          onUseRewrittenStory={(text) => {
            setUserStory(text);
            toast({ tone: "success", title: "User story updated", description: "The rewritten version is now in the editor." });
          }}
          onUseRewrittenAc={(text) => {
            setAcceptanceCriteria(text);
            toast({ tone: "success", title: "Acceptance criteria updated", description: "The improved version is now in the editor." });
          }}
        />
      )}
    </div>
  );
}
