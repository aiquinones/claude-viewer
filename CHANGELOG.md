# Changelog

Notable changes to Claude Viewer, newest first.

## 0.28.1 - 2026-08-31

### Changed

- **A deliverable chip is a bordered box, not a link.** The color that identifies the kind is in
  the icon, so the title reads as plain text — a blue title beside a pink mark was two claims about
  the same chip. Each kind now has its own icon color, and an unrecognised one stays muted.

## 0.28.0 - 2026-08-31

### Added

- **Codex sessions appear on the usage surface.** They were on Active Agents only — no totals, no
  squares on the grid, no row in the list, and both paths into a session page dead-ended. Codex
  states what each request cost per line, so the scan is incremental like Claude's.
- **A Codex session is priced from what it consumed.** The dash was never missing data, it was a
  missing rate table; OpenAI's card now sits beside Anthropic's. The dash still appears for a model
  with no published rates, on either CLI — which also fixes a Claude session on an unknown model
  drawing a cost curve flat along zero.
- **Codex skill loads are listed.** Codex has no skill tool — it loads a skill by reading its
  SKILL.md, and that read is the record. Fills the Skills used list and the agent row's skill trail.
- **A session can announce what it produced.** An agent echoes a marker and a JSON payload; the
  panel reads it off the Bash call in the transcript and draws a clickable chip under that agent's
  row, beside the PR link — a storybook, a link, a file, or a PR. Read from Claude, Copilot and
  Codex transcripts alike. The instructions an agent reads ship with the extension.
- **View Docs**, a command listing the docs this extension writes. Picking one rewrites it to what
  this version ships, opens it, and puts its `@` import line on the clipboard. Replaces
  Set up deliverables.

### Changed

- **The panel draws before the config is read.** The launch used to wait on every SKILL.md and every
  CLAUDE.md before drawing anything, so a large setup sat on one spinner for the whole read. The
  three loaders publish separately now: the landing cards say "Reading config…" rather than
  "None found", and each surface waits behind its own loader instead of behind all three.
- **The performance card names every stage still running**, not just the usage scan.

### Fixed

- **The usage views no longer report a zero that isn't a reading.** Codex bills against a
  rate-limit window and states no per-token figure, and three places asked a question with two
  answers and three CLIs — drawing a `0 AIU` headline, a `0 AIU` session total, and a cost curve
  along the floor. Each one claimed the work was free. They draw a dash with the reason in the
  hover instead.
- **The skill list no longer claims a Codex session loaded no skills** when the CLI records no skill
  load of any kind.

## 0.26.1 - 2026-08-27

### Changed

- **Usage is always shown on the cost basis.** The separate usage metric switch and output-only
  cost option are gone; dollar figures now reflect all billed tokens.
- **The Codex mark is measured and rendered more accurately.**

### Fixed

- **Working agents no longer appear idle mid-turn.**
- **Agent rows retain their PR, context, and prompt details when the panel cannot currently see
  the source window.**

## 0.26.0 - 2026-08-26

### Added

- **Active Agents now includes Codex sessions.** Codex rows use Codex's own mark and expose the
  activity state available from its session data.
- **Agent rows show more context.** Rows can show the active stage, the pull request opened by a
  Copilot agent, and any sub-agents launched by the session.
- **Usage session pages link back to Active Agents.** The session activity badge opens the matching
  agent row, and the landing page shows the cost of the launch.
- **Usage filters show activity.** Session filters now keep the current activity state visible.

### Changed

- **Performance cards have a more polished interaction.** The cards, stage indicators, and landing
  surface now have clearer emphasis and lighter visual treatment.
- **Session headers hide the current workspace.** The header no longer repeats the workspace that is
  already selected.
- **Skill scope markers are clearer.** Scope origin is softer and appears below the skill title.

### Fixed

- **Copilot session context bars measure the full session**, rather than a sub-agent's context.
- **PR links from agent rows open the browser without also navigating the panel.**

## 0.24.0 - 2026-08-25

### Added

- **A session splits into stages, and two wheels under the curves say what each one cost.** The
  curves above answer "what did request 47 spend"; neither says which stretch of the work was the
  expensive one, and the log already records where those stretches begin. A skill load opens a stage
  and it runs until the next one opens another — so one wheel is what each stage spent and the other
  is what it did to the context. A wheel rather than a third curve because stages are a handful of
  named things being compared, not a sequence. The cost wheel follows the page's metric, so the two
  readings of one session can't end up in different units, and growth is measured from the last
  reading before the stage began, so the body a skill loaded counts against the stage that loaded it.
- **A stage is a skill you named.** Drawing a spoke for every skill a session loaded gave a session
  that ran `/commit` four times four axes nobody asked for. A skill listed in
  `claudeViewer.stages.names` opens a stage wherever it loads; one that isn't is invisible to the
  split and the stage that was running carries straight through it — which is the ignore half of the
  ask with no second setting to keep in sync. Names are written from a dialog behind the heading's
  (i), which lists every skill the session loaded rather than only the stages, since which of them is
  a stage is the choice being made there. Three states, not two: no skills ran, so there is nothing
  to split; skills ran and none is named, so the card offers the dialog rather than two empty wheels;
  otherwise the pair.
- **The spotlight finds the panel's own surfaces, not just what's in them.** `view` is a third search
  kind and every surface is a document in the index, so Cmd+F is now the way to reach a surface as
  well as a thing on one. Opening the box on a surface still narrows to that surface's own kind — a
  pill that's on because it's always on is furniture rather than a filter — and a view is one
  Backspace away on an empty box.
- **The palette and a link can name a surface or one session.** Usage and Active Agents were
  reachable only by opening the panel and clicking a card, and one session's page only by finding
  that session again in a list of every session on disk. Three palette commands and three link shapes
  go straight there. A link names a session by id alone: which CLI minted it is resolved on the host,
  so a link author never has to know, and a miss opens the picker with the id typed in.
- **An agent row's right-click opens that session on the usage surface.** A running agent is the one
  row in the panel that says nothing about what it has spent. "Analyze session" is the fourth command
  on the menu and the only one that goes somewhere rather than doing something. A session opened that
  way gets a back arrow that retraces the ask — the arrow is "where I came from" and names the
  surface in its tooltip, while the breadcrumb stays "up one level" and still says Usage, because
  that is where the page lives however it was reached. A session that has not paid for anything yet
  isn't in the history at all, and the page says which ways that happens rather than reporting a
  failure.
- **A session page keeps reading while its agent is still writing.** It read the session once on
  mount and then sat frozen. It re-reads at the agents rate now, taking that rate from the agents
  poll itself rather than a copy of the number, and the badge beside the session name is the same one
  the agent rows draw, on the same one-second clock. The poll is on the host: a hidden panel still
  holds its webview, so a timer in there would go on reading transcripts for a tab nobody is looking
  at. A session that was over when you opened it and gets resumed in a terminal starts updating; one
  that exits stops costing anything.

### Changed

- **The Claude cost basis option is gone, and every dollar figure is every billed token.**
  `claudeViewer.usage.costBasis` let the figure count output tokens alone — on a real session that
  hides four fifths of the bill: of $24.42 paid, $19.67 is cache reads and $2.67 is output. A cost
  that can be set to a number the API never charged is a footgun, and a menu row offering it made it
  read as a legitimate alternative. The (i) card still shows the four-way split, which was always the
  useful half, and no longer has to strike three parts out to explain which setting you're on.

### Fixed

- **A session's cost counted every request two or three times.** One API request is written to a
  transcript as several lines — a reply carrying a thinking block and two tool calls lands as three —
  and every one of those lines repeats the *whole* request's usage block. Measured on a real session:
  273 assistant lines, 167 requests, $41.25 read against $24.42 actually paid, with the turn chart
  drawing 273 bars and the context curve stacking duplicate points. The dedupe is in the parser now,
  where the two callers that already guarded it were each solving it separately.
- **A load dot's skills read as a list, and its bubble can open downward.** Several skills land on one
  point often — Copilot loads one twice for a typed command, and a busy turn can carry six — and
  joining them into one sentence in a `nowrap` bubble grew it wider than the panel. One name per line
  instead, and since that trades width for height, the bubble measures itself and flips below the
  point where there isn't room above it.
- **The first session chart's heading names the metric it's drawing.** It said "Turns" whichever
  metric was picked, so the one thing the curve's height means was the one thing the heading didn't
  say.
- **The two stage wheels centre in the panel** instead of hugging the left edge with the rest of the
  width empty beside them, and the (i) beside a chart heading sits on the row's centre rather than a
  few pixels above the text next to it.

## 0.22.0 - 2026-08-24

### Added

- **Clicking a session on the usage surface opens it taken apart.** A page inside the surface rather
  than a surface of its own, so going back finds the Sessions tab with its filter text and scroll
  position intact. The breadcrumb says `Usage › <session>`, with the session id and a copy button
  under it. Three sections: what the session cost, over its own turns instead of a window's; the
  turns themselves as an area chart, one point per request; and the skills it loaded, most-loaded
  first with `Σ size × loads` in the heading. Skill loads are read off the log rather than inferred —
  both CLIs write the invocation down — and the unit is a load, not a call, since Copilot injecting a
  skill you named and then loading it again for the model really is two bodies in the context.
- **A second chart beside it: how full the context got, request by request.** The top of it is
  whichever of the peak and the warning line is higher rather than the window, because a 50k session
  drawn against a 1M window is a flat line along the floor. The thresholds are dashed rules with the
  number at the right end, read through the same setting the agent rows' context bars use, so the two
  surfaces can't disagree about where a line falls. Each skill load is a dot on the curve. Context
  does not only grow — the biggest session here dips twice — so the line is drawn rather than
  smoothed.
- **The panel has its own palettes, and a theme picker in every view's `...`.** Four modes: a dark
  palette, a light one, `auto`, and `Editor's color`. `auto` is the new default and the one that
  didn't exist before — it reads the editor's light/dark polarity and nothing else, which is the part
  of inheriting a theme that's always right. `Editor's color` is the old behaviour, every colour read
  from the active theme. The palettes are a deep blue-slate and its mirror, with no alpha anywhere,
  eight ground steps in a deliberately narrow band so stacking cards in panes in pinned headers
  doesn't turn every nesting level into a visible box.
- **One usage grid for both CLIs.** When you were working is one question however many tools you were
  working with, so a day is one square painted from the total and the hover says which — `3 sessions
  (2 Claude, 1 ghcp)`, on a single-tool day too, since on a lone square which CLI it was is the whole
  question a merged grid raises. The retention note stays Claude's: it explains a sweep Copilot isn't
  subject to, so it only renders when there are Claude days in the span.
- **Copilot rows have a context bar.** Its used figure is on disk after all, in
  `~/.copilot/session-store.db` rather than in the event log — the event carrying it is marked
  ephemeral and never gets written to the log. One database for the machine, so one query for every
  row. The card gives no sign which file the number came from, and the context-window table now knows
  the GPT ids Copilot runs.
- **A right-click on an agent row opens what you do to the process** — open the session log, copy the
  session id, end the pid. The kill asks first by replacing the menu's own contents with the
  question, so there's nothing behind it to mis-click and Cancel is nearest where the pointer already
  was. It sends SIGTERM rather than SIGKILL, so the CLI cleans up its session file and its lock on
  the way out.
- **A red `!` when more than one live process holds one session.** Both loaders already found those
  and dropped them, which is right — every field on a row comes off the shared transcript, so two
  processes would draw the same row twice. What was missing is that it happened at all, because
  killing the pid the row names leaves the others running. The tooltip says which pid this row is.
- **A session row says which branch it was on**, under the title. Claude stamps the branch on every
  assistant line and Copilot keeps it in the session's `workspace.yaml`, so nothing new is read for
  it. The latest turn wins rather than the most common one: sessions branch, enter a worktree and
  come back, and the label means where the session left off — which is what a list sorted by last
  activity is already about.
- **A row says which CLI it is with the CLI's own mark**, in the session list, the Active Agents
  rows, the grid's hover and the session header. A row is short of width and the tool's name is the
  least interesting thing on it. Both marks came off this machine rather than being redrawn.

### Changed

- **The usage surface has one header, and one menu behind it.** The headline used to be the Skills
  tab's first section, so the Sessions tab had no total and the scope toggle existed twice. It sits
  above the tabs now — both tabs are readings of the same sessions — with a `...` in the corner
  holding the metric, the scope and the Claude cost basis, each saying which layer set it. The one
  control left on the surface is the window, under the figure, because everything in the menu says
  *which number* you're reading where the window says what the number is a total *of*.
- **An agent row's warnings are icons beside the age now**, with the message in the hover. Printing
  "no event log on disk yet" in full cost three lines of red under a row you opened to read its
  title.
- **A row prints its folder only when that isn't the workspace root** — an agent in the open folder
  was printing that folder's name back at you. The condition is the path rather than the group, so a
  worktree under the same root still prints, which is the whole question when two agents share a
  repo. Session rows on the usage surface do the same.
- **The two hover buttons came off the agent row.** The log button had a home in the right-click menu
  already; the row colour lost its entry point and nothing else — a row that carries a colour still
  paints with it. An icon that appears on hover has to be hovered again to say what it is, which is a
  lot of chrome for a list you leave open.
- **Robots mode on the agents surface is hidden rather than dimmed**, and the toggle hides with it,
  since a control with one mode left is a decoration. That's not what a blocked mode does: a blocked
  mode is one you can't pick *here*, so it stays and dims and says why.

### Fixed

- **A Copilot row read Idle through most of a working session.** The backward walk over the event log
  matched the events that mean "done" and not the ones that mean "still going", so from a session's
  second turn on it ran past the live turn and landed on the previous turn's end. Replayed line by
  line over a real 133-event session, 48 of those 133 prefixes read Idle while the model was writing
  or running tools. An escaped turn was the second hole — it's never closed, so a cancelled query
  read Working indefinitely.
- **The context card no longer opens as you scroll past a row.** The bar spans the row, so you cross
  it on the way somewhere else; it waits 400ms now, and only on the way in.
- **The usage cost card opens downward where there's no room above it.** It was pinned upward, which
  is right at the bottom of the usage surface and wrong on the session page, where the same card
  mounts near the top of a scrolled pane and lost its top half into the breadcrumb. It measures on
  arrival now, and up stays the preference so nothing moves where there was already room.
- **The grid's hover bubble is no longer clipped by the grid.** It lived inside the box that scrolls
  sideways, so the top row's bubble lost its upper half and the leftmost one went behind the pinned
  weekday column. It hangs off a frame around the box instead, and its placement is measured when the
  pointer arrives rather than derived from which column the square is in — the content scrolls under
  the frame, so a column number no longer says where anything is on screen.
- **Agent rows sort by when the session started**, not by which agent last wrote. Activity order
  reshuffled the list on every poll and moved the row you were reading out from under you.
- **A hover card sets its own type rather than inheriting its trigger's**, so a card opened from a
  monospaced row isn't monospaced. The `Totals for` window toggle reads as the end of that sentence
  now, and the (i) beside a heading centres on the cap-height instead of the x-height.

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
