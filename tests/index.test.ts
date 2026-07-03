import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const registerTool = vi.fn();
const registerCommand = vi.fn();

function createMockApi(): ExtensionAPI {
  return {
    registerTool,
    registerCommand,
    // Minimal stub for other ExtensionAPI methods
    on: vi.fn() as unknown as ExtensionAPI["on"],
    registerShortcut: vi.fn() as unknown as ExtensionAPI["registerShortcut"],
    registerFlag: vi.fn() as unknown as ExtensionAPI["registerFlag"],
    registerProvider: vi.fn() as unknown as ExtensionAPI["registerProvider"],
    appendEntry: vi.fn() as unknown as ExtensionAPI["appendEntry"],
    getSession: vi.fn() as unknown as ExtensionAPI["getSession"],
    ui: {} as unknown as ExtensionAPI["ui"],
  } as ExtensionAPI;
}

describe("mnemosyne-pi extension", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers the expected tools", async () => {
    const extension = (await import("../src/index.ts")).default;
    const pi = createMockApi();
    extension(pi);

    expect(registerTool).toHaveBeenCalledTimes(5);
    const names = registerTool.mock.calls.map((call) => call[0].name);
    expect(names).toContain("mnemosyne_remember");
    expect(names).toContain("mnemosyne_recall");
    expect(names).toContain("mnemosyne_forget");
    expect(names).toContain("mnemosyne_stats");
    expect(names).toContain("mnemosyne_sleep");
  });
});
