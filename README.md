# Claude Viewer

A VS Code extension that shows you your Claude Code setup — CLAUDE.md files, skills, hooks,
subagents, slash commands, MCP servers, plugins, and permissions — resolved for the workspace you
have open.

The files are spread across `~/.claude/`, the project's `.claude/`, `.mcp.json`, and `~/.claude.json`.
Reading them tells you what's on disk. It doesn't tell you which settings file won a given key,
which CLAUDE.md files actually load and in what order, or which of two same-named skills is the one
that runs. Claude Viewer answers that.

Read-only, local files only, no network calls.

## Current state

**Building v1.** Nothing is installable yet.

v1 covers two surfaces, skills and CLAUDE.md, and shows both merged with their origin:

- **Skills** — every skill from project, user, and plugin scope, with the description Claude
  actually reads. When two scopes define the same name, one wins; the view shows which, and the
  shadowed one stays visible instead of silently vanishing.
- **CLAUDE.md** — the load order from user global down through nested files, `@imports` expanded
  into a tree, and a size estimate per file so you can see what your context is spending.

Full spec: `docs/v1.md`. Everything else — hooks, MCP, permissions — is in `docs/SCOPE.md` and
comes after.

*Keep this section current as v1 lands.*

## Stack

TypeScript strict, React + shadcn/ui in the webview, Zod for parsing config files, esbuild, pnpm.
