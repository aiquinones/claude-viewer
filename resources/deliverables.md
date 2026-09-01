# Deliverables

A deliverable is something you produced that the person you're working with will want to open — a
Storybook you started, a plan you wrote, a PR, a preview URL. Declaring one puts a clickable chip
under your session's row in the Claude Viewer panel's Active Agents surface.

Declare one by echoing the marker and a JSON object:

```
echo 'claude-viewer:deliverable {"type":"storybook","title":"Storybook","url":"http://localhost:6006"}'
```

That is the whole mechanism. Nothing reads the output — the panel reads the command itself out of
the session log, so there is no id to look up and nothing to install.

## The payload

| field   | required | what it is                                                          |
| ------- | -------- | ------------------------------------------------------------------- |
| `type`  | yes      | `storybook`, `link`, `file`, or `pr`. Picks the icon and how it opens |
| `title` | no       | What the chip says. Defaults to the type's own name                  |
| `url`   | one of   | An `http://` or `https://` address. Opens in the browser             |
| `path`  | one of   | A file, opened in the editor. Relative resolves against your cwd     |

Give exactly one of `url` and `path`. A declaration with neither points nowhere and is ignored.

## Examples

```
echo 'claude-viewer:deliverable {"type":"file","title":"Plan","path":"docs/plan.md"}'
echo 'claude-viewer:deliverable {"type":"pr","title":"PR #128","url":"https://github.com/you/repo/pull/128"}'
echo 'claude-viewer:deliverable {"type":"link","title":"Preview","url":"https://preview.example.com"}'
```

## Rules worth knowing

- **Declare it when it exists**, not when you plan to. A chip is a thing to click.
- **Re-declaring the same type and title replaces the chip** rather than adding a second one, so a
  step that reruns is free to announce itself again.
- **A `path` has to be inside the session's working directory.** One outside it is dropped — a
  deliverable is something this session produced.
- **A `url` has to be `http` or `https`.** Anything else is dropped.
- Eight per session. Past that the oldest go.
