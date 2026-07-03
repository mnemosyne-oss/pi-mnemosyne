# pi-mnemosyne

> Pi extension and skill for [Mnemosyne](https://github.com/mnemosyne-oss/mnemosyne) — local-first, SQLite-backed AI memory.

[![npm](https://img.shields.io/npm/v/@mnemosyne-oss/pi-mnemosyne.svg)](https://www.npmjs.com/package/@mnemosyne-oss/pi-mnemosyne)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

`@mnemosyne-oss/pi-mnemosyne` brings Mnemosyne into the [Pi coding agent](https://pi.dev/) through a native Pi extension and skill.

## Features

- **Native Pi tools** for remembering, recalling, and forgetting memories.
- **Local-first** — all data stays in a SQLite database on your machine.
- **Zero-config** once installed.
- **Pi skill** included for progressive disclosure and best practices.

## Install

1. Install the Mnemosyne CLI:

```bash
pip install mnemosyne-memory
```

2. Install the Pi package:

```bash
pi install npm:@mnemosyne-oss/pi-mnemosyne
```

Or add it to `.pi/settings.json` for a project:

```json
{
  "packages": [
    "npm:@mnemosyne-oss/pi-mnemosyne"
  ]
}
```

3. Restart Pi (`/reload` or restart the session).

## Tools

| Tool | Purpose |
|------|---------|
| `mnemosyne_remember` | Store a memory |
| `mnemosyne_recall` | Search memories by semantic similarity |
| `mnemosyne_forget` | Delete a memory by ID |
| `mnemosyne_stats` | Show memory statistics |
| `mnemosyne_sleep` | Consolidate old memories into summaries |

## Quickstart

After installing, try:

```
/skill:mnemosyne
```

Then ask:

```
Remember that I prefer vitest over jest for testing.
Recall my testing preferences.
```

## Development

```bash
git clone https://github.com/mnemosyne-oss/pi-mnemosyne.git
cd pi-mnemosyne
npm install
npm run typecheck
npm test
```

## Releasing

1. Bump `version` in `package.json`.
2. Commit and push.
3. Tag and push:
   ```bash
   git tag -a v0.1.0 -m "Release v0.1.0"
   git push origin v0.1.0
   ```
4. The [release workflow](.github/workflows/release.yml) publishes to npm.

Make sure the `NPM_TOKEN` secret is set in the GitHub repository settings.

## License

MIT © Mnemosyne OSS
