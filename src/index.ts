import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { spawn } from "node:child_process";

/**
 * Pi extension for Mnemosyne.
 *
 * Registers native Pi tools that proxy to the `mnemosyne` CLI:
 *  - mnemosyne_remember
 *  - mnemosyne_recall
 *  - mnemosyne_forget
 *  - mnemosyne_stats
 *  - mnemosyne_sleep
 *
 * Requires `mnemosyne-memory` to be installed and on PATH:
 *   pip install mnemosyne-memory
 */

function runMnemosyne(command: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn("mnemosyne", [command, ...args], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    child.on("error", (err) => {
      reject(
        new Error(
          `Failed to run mnemosyne: ${err.message}\nMake sure mnemosyne-memory is installed: pip install mnemosyne-memory`
        )
      );
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `mnemosyne exited with code ${code}`));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

function makeTextResult(text: string) {
  return {
    content: [{ type: "text" as const, text }],
    details: {},
  };
}

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "mnemosyne_remember",
    label: "Mnemosyne: Remember",
    description:
      "Store a fact, preference, or observation in Mnemosyne memory. Use when the user reveals important context that should persist across sessions.",
    parameters: Type.Object({
      content: Type.String({
        description: "The memory content to store.",
      }),
      source: Type.Optional(
        Type.String({
          description: "Source tag for the memory (default: pi).",
        })
      ),
      importance: Type.Optional(
        Type.Number({
          description:
            "Importance score from 0.0 to 1.0. Higher values make the memory rank higher in recall.",
          minimum: 0,
          maximum: 1,
        })
      ),
    }),
    async execute(_toolCallId, params) {
      const args = [params.content];
      if (params.source !== undefined) args.push(params.source);
      if (params.importance !== undefined)
        args.push(String(params.importance));
      const output = await runMnemosyne("store", args);
      return makeTextResult(output);
    },
  });

  pi.registerTool({
    name: "mnemosyne_recall",
    label: "Mnemosyne: Recall",
    description:
      "Search Mnemosyne memory by semantic similarity. Use before starting work on a task to retrieve relevant prior context.",
    parameters: Type.Object({
      query: Type.String({
        description: "Natural-language query describing what you need.",
      }),
      top_k: Type.Optional(
        Type.Number({
          description: "Maximum number of results to return (default: 5).",
          minimum: 1,
          maximum: 50,
        })
      ),
    }),
    async execute(_toolCallId, params) {
      const args = [params.query];
      if (params.top_k !== undefined) args.push(String(params.top_k));
      const output = await runMnemosyne("recall", args);
      return makeTextResult(output);
    },
  });

  pi.registerTool({
    name: "mnemosyne_forget",
    label: "Mnemosyne: Forget",
    description:
      "Delete a memory from Mnemosyne by its ID. Use when the user asks to remove outdated or incorrect information.",
    parameters: Type.Object({
      id: Type.String({
        description: "The memory ID returned by mnemosyne_remember.",
      }),
    }),
    async execute(_toolCallId, params) {
      const output = await runMnemosyne("delete", [params.id]);
      return makeTextResult(output);
    },
  });

  pi.registerTool({
    name: "mnemosyne_stats",
    label: "Mnemosyne: Stats",
    description:
      "Show Mnemosyne database statistics. Use to inspect memory usage, bank sizes, and model status.",
    parameters: Type.Object({}),
    async execute() {
      const output = await runMnemosyne("stats", []);
      return makeTextResult(output);
    },
  });

  pi.registerTool({
    name: "mnemosyne_sleep",
    label: "Mnemosyne: Sleep",
    description:
      "Run Mnemosyne consolidation (sleep). Use at the end of a long session to compress working memories into long-term summaries.",
    parameters: Type.Object({}),
    async execute() {
      const output = await runMnemosyne("sleep", []);
      return makeTextResult(output);
    },
  });
}
