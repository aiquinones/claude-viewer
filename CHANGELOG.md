# Changelog

Notable changes to Claude Viewer, newest first.

## 0.20.0 - 2026-08-21

### Added

- **The usage surface is tabbed, and Sessions is the new half.** Skills is what was there — a
  window's totals split by the skill that was running, with the Day / Week toggle that goes with it.
  Sessions opens first and covers the whole machine: every session on record, drawn as a grid of days
  and listed under it. The grid is Sunday-to-Saturday weeks painted from the surface accent in four
  shades plus empty, with a Tokens / Sessions toggle over the same days. The shades are quartiles by
  rank over the distinct values, which is what keeps a fortnight of ordinary days readable beside one
  800k outlier — and what keeps two days that both say "1 session" the same colour. The box scrolls
  sideways and opens at today, its weekday column pinned so it doesn't start off screen. The list
  below filters by name and scrolls inside its own box, so the grid above it stays put.
- **The grid spans as far back as Claude Code actually keeps.** It reads `cleanupPeriodDays` from
  Claude Code's own settings — managed, then local, then project, then user, falling through any
  layer that can't answer — rather than assuming a year. A sweep at startup deletes transcripts older
  than that, so a year-long grid was ten empty months by construction, which reads as a failed scan
  rather than as history that was deleted. An (i) beside the heading says which file the number came
  from. The span widens past the window when data outlived it, which is what a resumed session does:
  rewriting the file resets the age the sweep measures.
- Behind it, every transcript on disk folds into one record per session — a name, four numbers, and
  one entry per day it spent something — so the cache is bounded by the corpus's shape rather than
  its size. Measured on a real machine: 87 transcripts, 76MB, 287ms cold and 8ms warm.

### Fixed

- **Hover cards and tooltips no longer open behind the pinned bar above them.** Their default was
  `z-30` and every pane's pinned bar is also 30 — a tie the later element in the DOM wins, and the
  body is always later than the list above it. The estimator's card was the visible one; every other
  card had the same latent bug, and the one call site that worked around it doesn't need to any more.
  The panel's stacking order is one named back-to-front scale now, and the build fails on a raw
  z-index written anywhere else.
- **The grid's own lattice.** A month label was a flex child of its week column, so any column
  carrying one was as wide as the word rather than as a square — a visible gap every four weeks.
  Labels are absolute now, and span two to three columns the way GitHub's do. The gaps were also 4px
  horizontal against 2px vertical, which reads as columns rather than days; one pitch drives the
  layout, the label offsets and the tooltip together.

## 0.18.0 - 2026-08-21

### Added

- **The Memory surface** — the files Claude writes about you, under
  `~/.claude/projects/<encoded>/memory/`: one file per fact, plus the `MEMORY.md` index that decides
  which of them a session ever reads. Grouped by type, and carrying the same two-number split the
  skills surface uses — what the index costs *every session*, and what every memory costs *if all of
  it is recalled*. It exists for the two ways that pair goes wrong without announcing itself: a
  memory on disk that nothing in the index points at, so no session will read it, and an index line
  pointing at a file that is gone, still spending tokens to claim it. Both show as a warning on the
  row. A `[[link]]` with no target is neither — the memory instructions say it marks something worth
  writing later, so it renders dimmed. `MEMORY.md` itself reads below the list the way a memory
  does. Memory is keyed on the working directory, so a worktree gets its own and no folder open
  means none at all; there is no user scope to fall back to.
- **The surface is tabbed by CLI.** Copilot has memory too and none of it is on this machine — it
  lives on GitHub and is fetched per session — so its tab says where to find it rather than showing
  an empty list. Both tools write agent rows and one list merges them; only Claude writes memory
  *files*, so these two halves answer different questions and don't share a column.
- **Which token estimate the panel uses is a setting.** Every "est. tokens" was `chars ÷ 4` with
  nothing saying so, and Claude's current tokenizer runs about a third denser than that rule of
  thumb. Now it's a choice between two approximations — standard, and the same rule × 1.35 — and
  every figure on every surface moves with it. The number is itself a button: hovering names the
  approximation and its formula, and clicking opens a dialog that says which models each one is the
  right claim for. The dialog holds a draft, so Apply is the only thing that writes and it stays
  greyed while the draft matches what's already set. Arrows walk the options and Enter applies.

### Fixed

- **Two Active Agents rows that described a session that wasn't there.** A slash command writes
  `user` lines the model never saw — an `isMeta` caveat block, and one carrying `<command-name>` —
  and reading the end of the transcript took either as a prompt still waiting on an answer. So a
  session sat at Working for a minute after `/clear` and then aged into Waiting, whose tooltip
  claimed a tool call was out; replayed over the 82 transcripts here, the four that end that way all
  read Idle now and nothing else changed. Separately, a live process whose transcript doesn't exist
  has never been prompted — it was an empty row carrying only an issue. Claude Code leaves these
  behind, since resuming a conversation spawns a second process and abandons the first.
- **The usage view waited 15 seconds on a timer before its first scan.** Nothing ever started one:
  the call that kicks off a scan if none has run was imported and never called, so the only path
  that reached the disk was the poll — and the poll scheduled its first pass a full interval out.
  Arriving at the surface cost ~15,000ms of nothing in front of a 120ms read. The scan now starts
  while you're still on the landing page, and entering a polling mode reads immediately rather than
  in an interval.
- **A hover card no longer stays open after you click its trigger.** Clicking focuses the trigger,
  and the cards opened on `:focus-within` — so the card hung there until focus moved elsewhere. Most
  visible on the usage pills, where the card describing an option sat over the option you'd just
  picked, and on a flow step, whose "names…" popup pinned open on the very click that opens the
  step. Keyboard focus still opens a card; a mouse click no longer pins one.

## 0.16.0 - 2026-08-19

### Added

- **How full an agent's context is**, as a bar on every Claude row of the Active Agents surface. The
  fill is how much of the model's window is used; the colour comes from two absolute thresholds —
  200k and 300k by default — because a conversation degrades at a token count rather than at a share
  of whatever room is left. Those two come apart visibly, so the track carries a hairline tick where
  each threshold falls. Hovering the bar names both numbers, says where each came from, and links
  the settings that change them. The used figure is read off the transcript; the window size is
  recorded in no file Claude Code writes, so it comes from a table with a per-model override and a
  settable fallback. Copilot records no context size at all, so those rows have no bar rather than
  an invented one.
- **A link can name a section inside a skill**, not just the skill —
  `vscode://canoq.claude-viewer/skill/dev-feature#7-release-the-worktree`, and `#7`, and
  `#release-the-worktree`, all land on the same heading. Which mode it opens in is a question about
  what the link named: a heading that's a step opens the flow already on it, since the column around
  it is what says where in the sequence you are; a heading that isn't in the sequence lights up in
  the text instead and stays lit until you click elsewhere. The `?section=` form is read too.
- **The agent groups fold from their headings**, the way the skill scopes and the system prompt
  sections already do. The count stays in the heading, so a folded group still says how many agents
  it's hiding — which is the point when Elsewhere is the long list and your own folder is the one
  you came to read.
- **An agent row's two icon buttons say what they are** on hover. They're invisible until you hover
  the row, so the moment they appear is the moment they have to be labelled, and the panel's own
  tooltip is faster to arrive than the native one.

### Changed

- **Clicking an agent row goes to the agent, not to its log.** The transcript is the consolation
  prize — what you want is the tab you left mid-turn, or the terminal sitting at a permission
  prompt. Both are reached by walking the agent's process chain. An agent that's out of reach —
  another window, another terminal app — still opens its transcript, which is what every row did
  before.
- **The viewer opens in the column you're in** instead of always taking a new one. An empty editor
  group to the right is taken first, since a group with no tabs is a column someone opened to put
  something in; otherwise the panel lands in the focused group. Re-launching reveals the panel where
  it is rather than walking it one column right each time, and opening a config file from inside the
  panel no longer buries the panel that asked for it.
- **The usage menu sits with the numbers it changes**, at the top-right of the summary card, and
  renders under either metric. It used to be inline in the cost note, which only renders in Cost
  mode — so the menu was unreachable in Tokens. "All usage settings" now lands on the usage settings
  rather than on the budgets.
- **The usage surface says what each number is in fewer words.** The toggle hints carried their whole
  justification inline and now say what the option is and stop, and two of them hedge where the code
  is inferring rather than reading. The empty state names the window it's empty for.

### Fixed

- **A usage toggle that can't save now says so**, and offers Reload Window. An auto-update swaps in
  new code without reloading the window, so a window that started on an older build runs the new
  Usage surface against a settings registry that has never heard of its keys. Every write was
  refused and the rejection was dropped, so the toggle drew whatever `settings.json` already held
  and pressing it did nothing at all.
- The row picker's labels spell it **color**, not colour.

## 0.14.0 - 2026-08-18

### Added 

- **Robot Mode** on the active agent view

- **Usage View** tracks the cost of your sessions, tagging them by skill

### Changed

- **Better Budget Info**, with sources for articles on skill budgets


## 0.12.0 - 2026-08-17

### Added

- **Flow Mode in Skill View**: You can view a skill as a flow

### Changed

- **Visual bug on the robot svg**, related to transparecy

- **Visual: refresh button spins while running**


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
