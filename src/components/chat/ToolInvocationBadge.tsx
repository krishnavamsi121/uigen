"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

function getFilename(path: unknown): string {
  if (typeof path !== "string" || !path) return "";
  const parts = path.split("/");
  return parts[parts.length - 1];
}

function getLabel(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;
  const command = args.command as string | undefined;
  const filename = getFilename(args.path);

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
        return `Editing ${filename}`;
      case "insert":
        return `Inserting into ${filename}`;
      case "view":
        return `Viewing ${filename}`;
      case "undo_edit":
        return `Undoing edit in ${filename}`;
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename":
        return `Renaming ${filename}`;
      case "delete":
        return `Deleting ${filename}`;
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const label = getLabel(toolInvocation);
  const isDone = toolInvocation.state === "result" && toolInvocation.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
