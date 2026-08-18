import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TextEditorField } from "@/components/forms/text-editor-field";

describe("TextEditorField", () => {
  it("shows a character count", () => {
    render(
      <TextEditorField
        id="us"
        label="User Story"
        value="hello"
        onChange={() => {}}
        placeholder="placeholder"
        maxLength={100}
      />
    );
    expect(screen.getByText("5 / 100")).toBeInTheDocument();
  });

  it("clears the value when Clear is clicked", () => {
    const onChange = vi.fn();
    render(
      <TextEditorField
        id="us"
        label="User Story"
        value="hello"
        onChange={onChange}
        placeholder="placeholder"
        maxLength={100}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /clear/i }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("shows a validation error when provided", () => {
    render(
      <TextEditorField
        id="us"
        label="User Story"
        value=""
        onChange={() => {}}
        placeholder="placeholder"
        maxLength={100}
        error="This field is required."
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("This field is required.");
  });

  it("truncates input to maxLength", () => {
    const onChange = vi.fn();
    render(
      <TextEditorField
        id="us"
        label="User Story"
        value=""
        onChange={onChange}
        placeholder="placeholder"
        maxLength={5}
      />
    );
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "abcdefgh" } });
    expect(onChange).toHaveBeenCalledWith("abcde");
  });
});
