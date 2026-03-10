import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  toolName: string,
  command: string,
  path: string,
  state: "call" | "result" = "result"
) {
  return {
    toolCallId: "test-id",
    toolName,
    args: { command, path },
    state,
    result: state === "result" ? "Success" : undefined,
  };
}

test("str_replace_editor create → Creating Card.tsx", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", "create", "src/components/Card.tsx")}
    />
  );
  expect(screen.getByText("Creating Card.tsx")).toBeDefined();
});

test("str_replace_editor str_replace → Editing utils.ts", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", "str_replace", "src/lib/utils.ts")}
    />
  );
  expect(screen.getByText("Editing utils.ts")).toBeDefined();
});

test("str_replace_editor insert → Inserting into index.tsx", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", "insert", "src/index.tsx")}
    />
  );
  expect(screen.getByText("Inserting into index.tsx")).toBeDefined();
});

test("str_replace_editor view → Viewing App.tsx", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", "view", "src/App.tsx")}
    />
  );
  expect(screen.getByText("Viewing App.tsx")).toBeDefined();
});

test("str_replace_editor undo_edit → Undoing edit in App.tsx", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", "undo_edit", "src/App.tsx")}
    />
  );
  expect(screen.getByText("Undoing edit in App.tsx")).toBeDefined();
});

test("file_manager rename → Renaming OldName.tsx", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("file_manager", "rename", "src/OldName.tsx")}
    />
  );
  expect(screen.getByText("Renaming OldName.tsx")).toBeDefined();
});

test("file_manager delete → Deleting OldName.tsx", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("file_manager", "delete", "src/OldName.tsx")}
    />
  );
  expect(screen.getByText("Deleting OldName.tsx")).toBeDefined();
});

test("unknown tool falls back to raw toolName", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("some_unknown_tool", "run", "src/file.ts")}
    />
  );
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});

test("completed state shows green dot, not spinner", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", "create", "src/Card.tsx", "result")}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("in-progress state shows spinner, not green dot", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", "create", "src/Card.tsx", "call")}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
