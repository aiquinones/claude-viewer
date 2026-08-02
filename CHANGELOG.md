# Changelog

Notable changes to Claude Viewer, newest first.

## 0.2.0 — 2026-08-02

### Added

- **Claude Viewer: Open Skill…** — a searchable picker over every resolved skill that opens the
  panel on the one you choose. It matches on the description as well as the name, so you can find a
  skill by what it does when you don't remember what it's called.
- **Skill deep links.** `vscode://canoq.claude-viewer/skill/commit` opens the panel on that skill,
  launching VS Code first if it isn't running. Add `?scope=user` for a specific scope's copy, or
  drop the name to just open the picker. Links carry a name and never a path, so one can't be
  crafted to open a file outside your skill directories.
- **The panel has its own tab icon** instead of the default glyph, in light and dark variants.

### Fixed

- **The package no longer ships the repo's own `.claude/` directory.** `.vscodeignore` had no rule
  for it, so 0.0.1 installed `.claude/skills/publish/SKILL.md` — an internal release runbook — into
  every user's extension folder. It contained no credentials, and 0.2.0 supersedes it.

### Changed

- Internal reorganization of `src/`: one folder per entry point holding the helpers only it uses,
  and a single source of truth for scopes. No change to behavior.

## 0.0.1 — 2026-08-01

First release.

- **The skills surface.** **Claude Viewer: Open** lists every skill Claude Code can see for the
  current workspace, grouped by scope — project, user, plugin — with the description Claude actually
  reads.
- When two scopes define the same skill name, the view shows which one wins and keeps the shadowed
  one visible rather than letting it disappear.
- Malformed frontmatter renders as an issue on the skill instead of a missing row.
- The panel refreshes as config changes on disk, and follows your editor theme.
- With no folder open, user- and plugin-scoped skills still resolve; project scope is absent.

Read-only. Local files only, no network calls.

---

There is no 0.1.0. Odd minor versions are reserved for the pre-release channel, so stable releases
use even ones.
