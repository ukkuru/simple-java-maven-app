import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FrameworkSelector } from "@/components/forms/framework-selector";

describe("FrameworkSelector", () => {
  it("marks the current framework as selected", () => {
    render(<FrameworkSelector value="INVEST" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /INVEST/i })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: /SMART/i })).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange with the clicked framework", () => {
    const onChange = vi.fn();
    render(<FrameworkSelector value="INVEST" onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: /SMART/i }));
    expect(onChange).toHaveBeenCalledWith("SMART");
  });

  it("shows the sub-criteria for the selected framework", () => {
    render(<FrameworkSelector value="SMART" onChange={() => {}} />);
    expect(screen.getByText("Specific")).toBeInTheDocument();
    expect(screen.getByText("Time-bound")).toBeInTheDocument();
  });
});
