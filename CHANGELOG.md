# Changelog

Notable changes to Claude Viewer, newest first.

## 0.10.0 — 2026-08-14

### Added

- **Copilot CLI sessions on the Active Agents surface**, as rows beside the Claude ones rather than
  a surface of their own — the question the surface answers, what's running and where, spans both
  CLIs. A row says which CLI it belongs to and shows its branch, and the list stays sorted by
  activity across the two.
- **Waiting is read rather than guessed for Copilot rows.** Copilot writes permission requests and
  their answers to disk, so an unanswered one means that agent is at a prompt right now. A Claude
  row with the same age still says Working and takes a minute of silence to change its mind — the
  badge is the same badge, and the tooltip is where a state that was read differs from one that was
  inferred.

### Changed

- **Agent rows keep up with the agents.** The surface had two refresh signals and neither watched
  what changes most: session files are written once at startup, so their watchers fire only when an
  agent starts or exits. Transcripts are now re-read every 2 seconds while Active Agents is open,
  every 30 seconds while another surface is, and not at all while the panel is hidden or closed. A
  row no longer counts up to 40m beside an agent that's mid-turn, and one that went quiet and
  started again comes back.

### Added

- **The Active Agents surface.** Every Claude Code session running right now, grouped by whether
  it's working in this workspace, with a state, how long since it last did anything, the tool it's
  waiting on, and a link to the PR it opened. Clicking a row opens that session's transcript. States
  are inferred from how the transcript ends and how long ago that was, so a row crosses from Working
  to Waiting on its own without anything changing on disk.
- **A skill's references as a graph.** The Content section toggles between the text and a picture of
  the viewed skill's neighbourhood — itself, the skills it names, and the skills that name it — with
  a directed edge wherever one skill's description or body refers to another. Drag a node and
  everything tied to it follows. A skill with no references leaves the toggle dimmed.
- **Skill costs read against a budget.** `claudeViewer.budgets.skills.description` and `.content` are
  limits you set, with `.overrides` for the one skill that legitimately costs more, and a bar under
  each number says within, near, or over. The (i) beside the Cost heading names where each limit came
  from — the default, your setting, this workspace, or your override — and says when you pay each
  cost and what a normal skill runs. These are the first VS Code settings the extension reads.

### Changed

- **The CLAUDE.md you're reading is named by its path**, pinned above the file's own headings as the
  top row of the sticky stack — so the top of the pane says which file and which section.
- **The palette commands are renamed.** **Claude Viewer: Open** is now **Claude Viewer: Launch
  Viewer**, and **Open Skill…** is now **Find Skill…**. Both used to start with the word Claude
  Code's own commands start with, so typing "open" returned a mixed list. Their ids moved with
  them — `claudeViewer.launch` and `claudeViewer.findSkill` — so a keybinding on either of the old
  ids needs updating.
- Every contributed command now gets its "Claude Viewer" prefix from `category` instead of two of
  the four spelling it into the title.

### Fixed

- The Content heading and its mode toggle sit on one line, centred in the block, instead of in
  separate bands with the toggle overflowing its row.

## 0.6.1 — 2026-08-10

### Changed

- **The marketplace listing has a demo.** A 15-second loop of the panel resolving skills and the
  CLAUDE.md stack, at the top of the README. It's fetched from the repo rather than packaged, so
  the download is unchanged.
- **A real description**, replacing the placeholder that led with the fact it was AI-written.

## 0.6.0 — 2026-08-10

### Added

- **Token counts on the skills surface**, split by when you pay them: a skill's name and description
  are in the system prompt on every request, while its SKILL.md is only read once Claude picks it.
  The detail shows both, the scope headings and the view header total the listed one, and a shadowed
  skill counts for nothing — it's never listed.
- **Go to selection.** Picking a CLAUDE.md scrolls down to its text; a button in the header scrolls
  you back to the row you left, and appears only once you're far enough down to need it.
- **A search button on the system prompt surface**, which had a bare refresh button where every
  other view has both.
- **One loading component** behind every wait in the panel — the icon's robot, which blinks and
  glances while you wait, over a progress bar in the surface's own accent.
- **The landing cards' glow follows the cursor**, on a spring, and drifts back to its corner when
  you leave.

### Changed

- **The system prompt's two sections fold** from their headings, the way the skills list folds a
  scope. The subtotal stays in the heading, so a folded section still says what it costs.
- **The shadow count is off the skills card and the scope headings** — the crown on the winning
  skill already says a name collided.

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
