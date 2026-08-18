import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RewrittenStorySection } from "@/components/dashboard/rewritten-story-section";

describe("RewrittenStorySection", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("copies the rewritten user story to the clipboard", async () => {
    render(
      <RewrittenStorySection
        rewrittenUserStory="As a customer, I want to reset my password, so that I regain access."
        rationale={["Persona is specific."]}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /copy user story/i }));
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "As a customer, I want to reset my password, so that I regain access."
      );
    });
    expect(await screen.findByText(/copied!/i)).toBeInTheDocument();
  });

  it("calls onUseVersion with the rewritten text when 'Use This Version' is clicked", () => {
    const onUseVersion = vi.fn();
    render(
      <RewrittenStorySection
        rewrittenUserStory="As a customer, I want X, so that Y."
        rationale={[]}
        onUseVersion={onUseVersion}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /use this version/i }));
    expect(onUseVersion).toHaveBeenCalledWith("As a customer, I want X, so that Y.");
  });
});
