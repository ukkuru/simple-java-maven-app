import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AnalyzeContent } from "@/components/analysis/analyze-content";
import { FrameworkProvider } from "@/components/layout/framework-context";
import { ToastProvider } from "@/components/ui/toast";
import { runHeuristicAnalysis } from "@/lib/analysis";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

function renderAnalyze() {
  return render(
    <ToastProvider>
      <FrameworkProvider>
        <AnalyzeContent />
      </FrameworkProvider>
    </ToastProvider>
  );
}

const USER_STORY =
  "As a registered customer, I want to reset my password using my verified email, so that I can regain access to my account.";
const AC = "Given I am registered\nWhen I request a reset\nThen I receive an email";

describe("Analyze flow", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        const body = JSON.parse((init?.body as string) ?? "{}");
        const result = runHeuristicAnalysis(body.userStory, body.acceptanceCriteria, body.framework);
        return {
          ok: true,
          json: async () => ({ result, record: { id: "test-id" } }),
        } as Response;
      })
    );
  });

  it("shows the empty state first, then the input form once started", () => {
    renderAnalyze();
    expect(screen.getByText(/is your user story actually ready for development/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /analyze my user story/i }));
    expect(screen.getByRole("textbox", { name: /^user story$/i })).toBeInTheDocument();
  });

  it("blocks submission with a validation error when the story is too short", async () => {
    renderAnalyze();
    fireEvent.click(screen.getByRole("button", { name: /analyze my user story/i }));
    fireEvent.click(screen.getByRole("button", { name: /analyze user story/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/at least 10 characters/i);
  });

  it("runs an analysis and renders the results dashboard", async () => {
    renderAnalyze();
    fireEvent.click(screen.getByRole("button", { name: /analyze my user story/i }));

    fireEvent.change(screen.getByRole("textbox", { name: /^user story$/i }), { target: { value: USER_STORY } });
    fireEvent.change(screen.getByRole("textbox", { name: /^acceptance criteria$/i }), { target: { value: AC } });
    fireEvent.click(screen.getByRole("button", { name: /analyze user story/i }));

    await waitFor(() => expect(screen.getByText(/executive summary/i)).toBeInTheDocument());
    expect(screen.getByText(/recommended user story/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /re-analyze/i })).toBeInTheDocument();
  });

  it("supports re-analysis and shows a score delta after editing", async () => {
    renderAnalyze();
    fireEvent.click(screen.getByRole("button", { name: /analyze my user story/i }));

    fireEvent.change(screen.getByRole("textbox", { name: /^user story$/i }), {
      target: { value: "As a user I want stuff and things and more so that it's good." },
    });
    fireEvent.click(screen.getByRole("button", { name: /analyze user story/i }));
    await waitFor(() => expect(screen.getByText(/executive summary/i)).toBeInTheDocument());

    fireEvent.change(screen.getByRole("textbox", { name: /^user story$/i }), { target: { value: USER_STORY } });
    fireEvent.change(screen.getByRole("textbox", { name: /^acceptance criteria$/i }), { target: { value: AC } });
    fireEvent.click(screen.getByRole("button", { name: /re-analyze/i }));

    await waitFor(() => expect(screen.getAllByText(/pts/i).length).toBeGreaterThan(0));
  });
});
