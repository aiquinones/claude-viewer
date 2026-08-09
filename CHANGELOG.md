# Changelog

Notable changes to Claude Viewer, newest first.

## 0.4.0 — 2026-08-09

### Added

- **The system prompt surface.** Every CLAUDE.md that loads for the workspace, in the order Claude
  reads them — user, project, local, nested — with `@` imports walked recursively and indented under
  whichever file pulled them in. Each file shows its size, an estimated token count, and a bar for
  its share of the total. Nested files are marked "loads only under `<dir>/`" and kept out of the
  headline number, so that number is what always loads. Clicking a file renders it.
- **A skill's own content renders in the panel**, under the metadata: the SKILL.md below its
  frontmatter, as markdown, with each heading pinned to the top of the pane while you're inside its
  section.
- **Spotlight filters.** Opening the search from a surface starts it narrowed to that surface, and
  typing `filter:skill` lifts the word out of the box into a pill. `Backspace` or the pill's `x`
  removes it.
- **A magnifier button** beside every view's refresh button, so the search is reachable without the
  keyboard. Its tooltip prints the chord.

### Changed

- **The skills list narrows and then gets out of the way.** Its column is 160–240px, and on a narrow
  panel it leaves the layout entirely — parked off the left edge, slid back by hovering the handle or
  tabbing into it. A skill's body gets the full width in a split editor group.
- **The winner of a name collision is a crown by the name** rather than a block of text, with the
  shadowed copies behind a hover card. A skill's tool overrides moved below its content.

### Fixed

- The spotlight input no longer draws the focus ring VS Code injects into webviews.
- Landing page cards no longer grow when they stack on a narrow panel.
- A skill's content no longer runs underneath the list's hover handle, and the sticky headings no
  longer paint over the list as it slides in.

## 0.3.0 — 2026-08-03

### Added

- **The panel opens on a landing page** — "Viewing agent on `<folder>`" and one card per config
  surface — instead of dropping straight into skills.
- **A sidebar tree** in its own activity bar container, nested surface → scope → skill. Clicking a
  row opens the panel on it.
- **Spotlight search.** `Cmd+F` or `Cmd+K` in the panel opens a search box over whatever view is up;
  typing matches skill names as a subsequence, arrows walk the results, Enter opens one.

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
