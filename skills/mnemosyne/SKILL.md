---
name: mnemosyne
description: Persist and recall memories across Pi sessions using Mnemosyne, a local-first SQLite-backed memory layer. Use when the user reveals preferences, constraints, or project facts that should survive sessions, or when starting work on a topic where prior context may help.
license: MIT
---

# Mnemosyne

[Mnemosyne](https://github.com/mnemosyne-oss/mnemosyne) is a local-first AI memory layer. It stores facts, preferences, and observations in a SQLite database on your machine and surfaces them with semantic search. No cloud. No API keys.

This skill is installed automatically with the `@mnemosyne-oss/pi-mnemosyne` Pi package.

## When to use Mnemosyne

- The user states a preference ("I like my tests in `tests/`", "Use `pnpm` not `npm`").
- You learn something about the project that will matter in future sessions.
- You discover a bug, gotcha, or workaround worth remembering.
- You are starting a task and want to recall prior related context.
- The user asks you to remember or forget something.

## Available tools

- `mnemosyne_remember` — Store a memory.
- `mnemosyne_recall` — Search memories by semantic similarity.
- `mnemosyne_forget` — Delete a memory by ID.
- `mnemosyne_stats` — Show memory statistics.
- `mnemosyne_sleep` — Consolidate old memories into summaries.

## Usage examples

Remember a preference:
```
Tool: mnemosyne_remember
content: "User prefers pytest with fixtures over unittest"
importance: 0.9
```

Recall relevant context before a task:
```
Tool: mnemosyne_recall
query: "testing preferences"
```

Remove outdated info:
```
Tool: mnemosyne_forget
id: "<memory-id-from-recall>"
```

Consolidate at the end of a big session:
```
Tool: mnemosyne_sleep
```

## Best practices

- Store concise, factual memories. Avoid dumping entire conversations.
- Use `importance` between 0.7 and 0.95 for facts that should persist.
- Recall before starting work on a new but related task.
- Forget stale or incorrect memories when the user corrects you.
- Run `mnemosyne_sleep` occasionally to compress old working memories.

## Installation

```bash
pip install mnemosyne-memory
pi install npm:@mnemosyne-oss/pi-mnemosyne
```

For project-local install, add to `.pi/settings.json`:

```json
{
  "packages": [
    "npm:@mnemosyne-oss/pi-mnemosyne"
  ]
}
```
